#!/usr/bin/env python3
"""
ポートフォリオ & お知らせ管理用 ローカルサーバー
起動方法: python3 server.py
"""

import http.server
import json
import os
import socketserver
import sys
import urllib.parse

PORT = 8000
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
NEWS_FILE = os.path.join(DATA_DIR, "news.json")
IMAGES_DIR = os.path.join(os.path.dirname(__file__), "images")

class PortfolioHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # CORSヘッダーを追加してローカルでの柔軟なfetchを許可
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
        
        # API: お知らせ一覧取得
        if parsed_path.path == "/api/news":
            self.handle_get_news()
            return
            
        # API: 画像一覧取得 (管理画面での画像選択用)
        if parsed_path.path == "/api/images":
            self.handle_get_images()
            return

        # 通常の静的ファイル配信
        super().do_GET()

    def do_POST(self):
        parsed_path = urllib.parse.urlparse(self.path)
        
        # API: お知らせ更新・保存
        if parsed_path.path == "/api/news":
            self.handle_post_news()
            return

        # API: 画像アップロード
        if parsed_path.path == "/api/upload":
            self.handle_upload_image()
            return

        self.send_error(404, "Endpoint not found")

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

            import base64
            import re
            import time

            file_bytes = base64.b64decode(base64_data)

            name, ext = os.path.splitext(filename)
            ext = ext.lower()
            if ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif"]:
                ext = ".jpg"

            safe_name = re.sub(r"[^\w\-]", "_", name)
            timestamp = int(time.time())
            saved_filename = f"{safe_name}_{timestamp}{ext}"

            os.makedirs(IMAGES_DIR, exist_ok=True)
            saved_path = os.path.join(IMAGES_DIR, saved_filename)

            with open(saved_path, "wb") as f:
                f.write(file_bytes)

            res = {
                "status": "success",
                "filename": saved_filename,
                "url": f"images/{saved_filename}"
            }
            res_body = json.dumps(res, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(res_body)))
            self.end_headers()
            self.wfile.write(res_body)
        except Exception as e:
            self.send_error(500, f"Failed to upload image: {e}")

    def handle_get_news(self):
        if not os.path.exists(NEWS_FILE):
            default_data = []
        else:
            try:
                with open(NEWS_FILE, "r", encoding="utf-8") as f:
                    default_data = json.load(f)
            except Exception as e:
                self.send_error(500, f"Error reading news file: {e}")
                return

        response_body = json.dumps(default_data, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response_body)))
        self.end_headers()
        self.wfile.write(response_body)

    def handle_get_images(self):
        images = []
        if os.path.exists(IMAGES_DIR):
            for fname in sorted(os.listdir(IMAGES_DIR)):
                if fname.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                    images.append(f"images/{fname}")

        response_body = json.dumps(images, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response_body)))
        self.end_headers()
        self.wfile.write(response_body)

    def handle_post_news(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            news_items = json.loads(post_data.decode("utf-8"))

            os.makedirs(DATA_DIR, exist_ok=True)
            with open(NEWS_FILE, "w", encoding="utf-8") as f:
                json.dump(news_items, f, ensure_ascii=False, indent=2)

            res = {"status": "success", "count": len(news_items)}
            res_body = json.dumps(res, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(res_body)))
            self.end_headers()
            self.wfile.write(res_body)
        except Exception as e:
            self.send_error(500, f"Failed to save news: {e}")

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), PortfolioHandler) as httpd:
        print(f"\n=======================================================")
        print(f"🚀 ポートフォリオ & 管理サーバーが起動しました！")
        print(f"👉 トップページ:   http://localhost:{PORT}/index.html")
        print(f"👉 専用管理画面:   http://localhost:{PORT}/admin.html")
        print(f"終了するには Ctrl + C を押してください")
        print(f"=======================================================\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nサーバーを停止しました。")
            httpd.server_close()

if __name__ == "__main__":
    run_server()
