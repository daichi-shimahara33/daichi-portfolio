#!/usr/bin/env python3
"""
ポートフォリオ 写真・コンテンツ総合管理サーバー
起動方法: python3 server.py
"""

import base64
import http.server
import json
import os
import re
import socketserver
import subprocess
import time
import urllib.parse

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
NEWS_FILE = os.path.join(DATA_DIR, "news.json")
PHOTOS_FILE = os.path.join(DATA_DIR, "photos.json")
IMAGES_DIR = os.path.join(BASE_DIR, "images")


class PortfolioHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)

        if parsed_path.path == "/api/news":
            self.handle_get_json_file(NEWS_FILE, [])
            return

        if parsed_path.path == "/api/photos":
            self.handle_get_json_file(PHOTOS_FILE, {"slots": {}, "gallery": []})
            return

        if parsed_path.path == "/api/images":
            self.handle_get_images()
            return

        if parsed_path.path == "/api/images/meta":
            self.handle_get_images_meta()
            return

        super().do_GET()

    def do_POST(self):
        parsed_path = urllib.parse.urlparse(self.path)

        if parsed_path.path == "/api/news":
            self.handle_post_json_file(NEWS_FILE)
            return

        if parsed_path.path == "/api/photos":
            self.handle_post_json_file(PHOTOS_FILE)
            return

        if parsed_path.path == "/api/upload":
            self.handle_upload_image()
            return

        if parsed_path.path == "/api/delete-image":
            self.handle_delete_image()
            return

        if parsed_path.path == "/api/publish":
            self.handle_publish_git()
            return

        self.send_error(404, "Endpoint not found")

    def send_json(self, data, status=200):
        res_body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(res_body)))
        self.end_headers()
        self.wfile.write(res_body)

    def handle_get_json_file(self, filepath, default_val):
        if not os.path.exists(filepath):
            data = default_val
        else:
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    data = json.load(f)
            except Exception as e:
                self.send_error(500, f"Error reading JSON file: {e}")
                return
        self.send_json(data)

    def handle_post_json_file(self, filepath):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            payload = json.loads(post_data.decode("utf-8"))

            os.makedirs(DATA_DIR, exist_ok=True)
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(payload, f, ensure_ascii=False, indent=2)

            self.send_json({"status": "success"})
        except Exception as e:
            self.send_error(500, f"Failed to save JSON: {e}")

    def handle_get_images(self):
        images = []
        if os.path.exists(IMAGES_DIR):
            for fname in sorted(os.listdir(IMAGES_DIR)):
                if fname.lower().endswith((".jpg", ".jpeg", ".png", ".webp")) and not fname.endswith("_thumb.jpg"):
                    images.append(f"images/{fname}")
        self.send_json(images)

    def handle_get_images_meta(self):
        items = []
        if os.path.exists(IMAGES_DIR):
            for fname in sorted(os.listdir(IMAGES_DIR)):
                if fname.lower().endswith((".jpg", ".jpeg", ".png", ".webp")) and not fname.endswith("_thumb.jpg"):
                    fpath = os.path.join(IMAGES_DIR, fname)
                    try:
                        sz_kb = round(os.path.getsize(fpath) / 1024, 1)
                        mtime = os.path.getmtime(fpath)
                    except OSError:
                        sz_kb = 0
                        mtime = 0
                    items.append({
                        "filename": fname,
                        "url": f"images/{fname}",
                        "size_kb": sz_kb,
                        "mtime": mtime
                    })
        items.sort(key=lambda x: -x["mtime"])
        self.send_json(items)

    def handle_upload_image(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            payload = json.loads(post_data.decode("utf-8"))

            filename = payload.get("filename", "")
            base64_data = payload.get("data", "")

            if not filename or not base64_data:
                self.send_error(400, "Missing filename or data")
                return

            if "," in base64_data:
                base64_data = base64_data.split(",", 1)[1]

            file_bytes = base64.b64decode(base64_data)
            original_kb = round(len(file_bytes) / 1024, 1)

            name, ext = os.path.splitext(filename)
            ext = ext.lower()
            if ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif"]:
                ext = ".jpg"

            safe_name = re.sub(r"[^\w\-]", "_", name)[:40] or "photo"
            timestamp = int(time.time())
            saved_filename = f"{safe_name}_{timestamp}{ext}"

            os.makedirs(IMAGES_DIR, exist_ok=True)
            saved_path = os.path.join(IMAGES_DIR, saved_filename)

            with open(saved_path, "wb") as f:
                f.write(file_bytes)

            # macOS sips による高画質Retina自動軽量化（長辺1200px・品質72）
            if os.path.exists("/usr/bin/sips") and ext in [".jpg", ".jpeg"]:
                try:
                    subprocess.run(["/usr/bin/sips", "-Z", "1200", saved_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    subprocess.run(["/usr/bin/sips", "-s", "format", "jpeg", "-s", "formatOptions", "72", saved_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                except Exception:
                    pass

            optimized_kb = round(os.path.getsize(saved_path) / 1024, 1)

            self.send_json({
                "status": "success",
                "filename": saved_filename,
                "url": f"images/{saved_filename}",
                "original_kb": original_kb,
                "optimized_kb": optimized_kb
            })
        except Exception as e:
            self.send_error(500, f"Failed to upload image: {e}")

    def handle_delete_image(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            payload = json.loads(post_data.decode("utf-8"))
            url = payload.get("url", "")
            fname = os.path.basename(url)
            target = os.path.join(IMAGES_DIR, fname)
            if os.path.exists(target) and os.path.commonpath([IMAGES_DIR, os.path.abspath(target)]) == IMAGES_DIR:
                os.remove(target)
                self.send_json({"status": "success", "deleted": fname})
            else:
                self.send_error(404, "Image not found")
        except Exception as e:
            self.send_error(500, f"Failed to delete image: {e}")

    def handle_publish_git(self):
        try:
            subprocess.run(["git", "add", "data/", "images/", "index.html"], cwd=BASE_DIR, check=True)
            commit_proc = subprocess.run(
                ["git", "commit", "-m", "Update site photos and content via Admin Console"],
                cwd=BASE_DIR,
                capture_output=True,
                text=True
            )
            push_proc = subprocess.run(
                ["git", "push", "origin", "main"],
                cwd=BASE_DIR,
                capture_output=True,
                text=True
            )
            if push_proc.returncode == 0:
                self.send_json({"status": "success", "message": "GitHub / Vercel 本番環境へ公開しました！"})
            else:
                self.send_json({"status": "warning", "message": "ローカル保存完了（GitHubプッシュはスキップされました）", "detail": push_proc.stderr})
        except Exception as e:
            self.send_json({"status": "warning", "message": f"ローカル保存完了: {e}"})


def run_server():
    os.chdir(BASE_DIR)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), PortfolioHandler) as httpd:
        print("\n=======================================================")
        print("🚀 ポートフォリオ & 写真管理サーバーが起動しました！")
        print(f"👉 トップページ:   http://localhost:{PORT}/index.html")
        print(f"👉 専用管理画面:   http://localhost:{PORT}/admin.html")
        print("終了するには Ctrl + C を押してください")
        print("=======================================================\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nサーバーを停止しました。")
            httpd.server_close()


if __name__ == "__main__":
    run_server()
