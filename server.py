#!/usr/bin/env python3
"""
ポートフォリオ 写真・文章・AIライティング総合管理サーバー
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
TEXTS_FILE = os.path.join(DATA_DIR, "site_texts.json")
WORKS_FILE = os.path.join(DATA_DIR, "works.json")
CATALOG_FILE = os.path.join(DATA_DIR, "media_catalog.json")
IMAGES_DIR = os.path.join(BASE_DIR, "images")


def generate_smart_copy(target: str, nuance: str, tone: str) -> list:
    """
    ユーザーの簡単なニュアンス・メモから、対象セクションとトーンに合わせた
    3パターンの自然な日本語タイトル＆本文を生成するAIライティングエンジン
    """
    raw = (nuance or "").strip()
    clean = re.sub(r"\s+", " ", raw)

    # キーワード抽出と文脈判定
    is_game = any(w in clean for w in ["試合", "勝", "負", "大会", "得点", "点", "リバウンド", "バスケ", "EXCELLENCE", "トーナメント", "リーグ"])
    is_trip = any(w in clean for w in ["遠征", "愛媛", "訪問", "地方", "旅", "合宿", "練習参加", "交流", "仲間", "体育館"])
    is_work = any(w in clean for w in ["Web", "WEB", "サイト", "動画", "映像", "ムービー", "制作", "仕事", "依頼", "企業", "LP", "卒団", "シャークス"])
    is_private = any(w in clean for w in ["休日", "オフ", "ご飯", "グルメ", "みかん", "カフェ", "散歩", "プライベート", "息抜き"])

    # 抽出フレーズ（ユーザーの言葉を自然に活かす）
    core_phrase = clean if clean else "コートでの挑戦と仲間との繋がり"
    short_core = core_phrase[:28] + ("…" if len(core_phrase) > 28 else "")

    # 推定カテゴリ（NEWS用）
    inferred_cat = "INFO"
    if is_game:
        inferred_cat = "GAME"
    elif is_trip:
        inferred_cat = "VISIT"
    elif is_work:
        inferred_cat = "CREATIVE"
    elif is_private:
        inferred_cat = "PRIVATE"

    # セクション別の文字量・構成に応じた3パターン生成
    if target == "hero":
        return [
            {
                "badge": "🔥 パターンA：熱量＆アスリート重視",
                "title": "EXCELLENCE // #33",
                "body": f"{core_phrase}を体現する192cmのオールラウンドプレイヤー。高い運動量とフィジカルを活かしたトランジション、ゴール下での泥臭いリバウンドでチームの勝利に貢献し、コート内外で熱狂を創り出す。"
            },
            {
                "badge": "🤝 パターンB：親しみ＆二刀流ストーリー重視",
                "title": "ATHLETE & CREATOR // #33",
                "body": f"社会人バスケ『EXCELLENCE』で汗を流しながら、{core_phrase}を大切に活動中。192cmのインサイドプレーで勝利を掴み、Web・映像クリエイティブの力で人やチームの魅力を形にします。"
            },
            {
                "badge": "💼 パターンC：スマート＆プロフェッショナル",
                "title": "TOKYO / EXCELLENCE #33",
                "body": f"競技者としてのストイックな視点と、Web・映像制作の実践力を兼ね備えたハイブリッドプレイヤー。{core_phrase}を軸に、スポーツからビジネス領域まで確かな成果と熱量を届けます。"
            }
        ]

    if target.startswith("statement"):
        return [
            {
                "badge": "🔥 パターンA：熱いステートメント風",
                "title": f"{short_core}\n本気で挑み続けるからこそ見える景色がある。",
                "body": f"{core_phrase}。大人になっても情熱は決して色褪せない。192cmの身体を張ってコートで戦い抜き、バスケを通じて出会うすべての人と本気で向き合い、最高の価値を創り続けます。"
            },
            {
                "badge": "🤝 パターンB：共感・ストーリー風",
                "title": f"バスケが繋ぐ縁と、\n{short_core}",
                "body": f"{core_phrase}という想いを胸に、東京から全国へと活動の幅を広げています。世代や地域の垣根を越えて1つのボールで繋がり、そこで生まれた絆やストーリーを大切に育てています。"
            },
            {
                "badge": "💼 パターンC：クリエイティブ＆信頼感風",
                "title": f"想いをカタチにし、\n{short_core}",
                "body": f"{core_phrase}。テンプレートな表現ではなく、現場の空気感や一人ひとりの情熱を深く汲み取り、見る人の心を動かすWebサイトや映像作品へと昇華させます。"
            }
        ]

    if target.startswith("vision"):
        return [
            {
                "badge": "🔥 パターンA：情熱・挑戦スタイル",
                "title": f"{short_core}",
                "body": f"{core_phrase}。\n\n東京（EXCELLENCE）での競技活動にとどまらず、全国のコートや新しいフィールドへ自ら足を運び、バスケとクリエイティブが持つ可能性をこれからも全力で広げていきます。"
            },
            {
                "badge": "🤝 パターンB：ウェルカム・交流重視スタイル",
                "title": "バスケの輪を広げる活動 & 今後の展望",
                "body": f"{core_phrase}。\n\n練習参加や合同練習、またWeb・動画制作のご相談もいつでも大歓迎です！バスケを通じて出会う皆様と一緒に、ワクワクする新しい企画やご縁を創っていければ嬉しいです。"
            },
            {
                "badge": "⚡ パターンC：すっきり簡潔スタイル",
                "title": f"NEXT VISION // {short_core}",
                "body": f"{core_phrase}をテーマに、コート上のプレーもクリエイティブ制作もさらにアップデートしていきます。ご興味を持っていただけた方はぜひお気軽にお声がけください！"
            }
        ]

    if target == "works":
        is_video_work = any(w in clean for w in ["動画", "映像", "ムービー", "PV", "MV", "YouTube", "卒団", "Filmora", "リール", "ショート"])
        w_type = "video" if is_video_work else "web"
        w_eyebrow = "MEMORIAL & PROMOTION VIDEO" if is_video_work else "WEB DESIGN & FULL-STACK DEV"
        w_meta1 = "⏱ 制作期間: 約2〜4週間（企画・構成〜映像編集）" if is_video_work else "⏱ 制作領域: 企画設計・UI/UXデザイン・レスポンシブ実装"
        w_meta2 = "🛠 使用ツール: Filmora / 映像演出・サウンド編集" if is_video_work else "🛠 技術構成: HTML5 / CSS3 / JavaScript / SEO構造化設計"
        return [
            {
                "badge": "💼 パターンA：王道プロフェッショナル実績",
                "type": w_type,
                "eyebrow": w_eyebrow,
                "title": f"{short_core}",
                "work_badge": "企画・構成・制作担当" if is_video_work else "企画・UI設計・フルスクラッチ開発",
                "meta1": w_meta1,
                "meta2": w_meta2,
                "body": f"{core_phrase}。クライアント様の理念やターゲット層の導線を徹底的にヒアリングし、テンプレートに頼らないオリジナル設計で制作。視覚的なインパクトと使いやすさ・伝わりやすさを高次元で両立させたプロジェクトです。",
                "quote": "「想いと熱量をダイレクトに届け、見る人の心を動かすクリエイティブへ」"
            },
            {
                "badge": "🔥 パターンB：ストーリー＆熱量重視",
                "type": w_type,
                "eyebrow": w_eyebrow,
                "title": f"{short_core} プロジェクト",
                "work_badge": "ストーリー設計〜制作" if is_video_work else "コンセプト設計〜デザイン実装",
                "meta1": w_meta1,
                "meta2": w_meta2,
                "body": f"{core_phrase}。現場の空気感やそこに込められたストーリーを細部まで汲み取り、見た瞬間に熱量が伝わる構成を追求。公開後も多くの方から高い評価をいただいた実績です。",
                "quote": "「単なる制作物ではなく、長く愛される一生モノの資産をつくる」"
            },
            {
                "badge": "⚡ パターンC：成果・ビジネス貢献重視",
                "type": w_type,
                "eyebrow": w_eyebrow,
                "title": f"{short_core}",
                "work_badge": "ワンストップ制作",
                "meta1": w_meta1,
                "meta2": w_meta2,
                "body": f"{core_phrase}。スマホでの見やすさや表示スピード、SEO対策・お問い合わせ導線まで一貫して最適化し、集客・ブランディングに直結する構成を実現しました。",
                "quote": "「スピード・品質・成果にこだわったワンストップ制作」"
            }
        ]

    if target == "gallery":
        return [
            {
                "badge": "🤝 パターンA：温かみのあるオフショット紹介",
                "title": "日々の練習 & オフショット",
                "body": f"{core_phrase}。\n試合中の真剣な表情から、練習後や遠征先で仲間と笑い合うリラックスした瞬間まで、バスケがある日常の風景を切り取っています。"
            },
            {
                "badge": "🔥 パターンB：アクティブ・臨場感スタイル",
                "title": "ON & OFF COURT MEMORIES",
                "body": f"{core_phrase}！\n都内の体育館から地方遠征、練習後のグルメ巡りまで、最高の仲間たちと過ごすリアルな日々をお届けします。"
            },
            {
                "badge": "⚡ パターンC：ショート＆スタイリッシュ",
                "title": "コート内外のリアルな日常",
                "body": f"{core_phrase}。\n1つのボールから広がる出会いと、かけがえのない時間を大切にしています。"
            }
        ]

    # デフォルト / NEWS記事用（タイトル・本文・カテゴリまで自動提案！）
    if is_game:
        return [
            {
                "badge": "🔥 パターンA：試合の臨場感＆熱血レポート",
                "category": inferred_cat,
                "title": f"【試合結果】{short_core}！インサイドとリバウンドで勝利に貢献",
                "body": f"{core_phrase}！192cmのサイズを活かしたゴール下のリバウンドとトランジションで流れを引き寄せ、チーム一丸となって熱いゲームを戦い抜きました。応援ありがとうございました！"
            },
            {
                "badge": "🤝 パターンB：チームへの感謝＆爽やか報告",
                "category": inferred_cat,
                "title": f"{short_core}｜チームメイトと共に掴んだ大きな一歩",
                "body": f"{core_phrase}。タフな時間帯もメンバー同士で声を掛け合い、最後まで自分たちのバスケを貫くことができました。次戦に向けてまた練習から積み上げていきます！"
            },
            {
                "badge": "⚡ パターンC：簡潔・ニュースヘッドライン風",
                "category": inferred_cat,
                "title": f"GAME REPORT：{short_core}",
                "body": f"{core_phrase}。攻守にわたるハードワークで存在感を発揮し、今シーズンのさらなる飛躍につながる一戦となりました。"
            }
        ]
    elif is_trip:
        return [
            {
                "badge": "🤝 パターンA：遠征・交流の温かさ重視",
                "category": inferred_cat,
                "title": f"【遠征・交流】{short_core}！最高の出会いと熱気あふれる時間",
                "body": f"{core_phrase}。初めて合わせるメンバーともパス1本で熱く繋がり、バスケが持つ「人と人を結びつける力」を改めて実感する素晴らしい時間になりました。温かく迎えてくださった皆様、本当にありがとうございました！"
            },
            {
                "badge": "🔥 パターンB：熱いマッチアップ＆刺激レポート",
                "category": inferred_cat,
                "title": f"{short_core}｜地域を越えた真剣勝負と新たな絆",
                "body": f"{core_phrase}！普段とは違う環境・プレイヤーとのマッチアップから多くの刺激を受け、コート内外で忘れられない思い出ができました。また必ずお邪魔します！"
            },
            {
                "badge": "⚡ パターンC：オフショット＆旅ログ風",
                "category": inferred_cat,
                "title": f"EXPEDITION LOG：{short_core}",
                "body": f"{core_phrase}。体育館での全力プレーはもちろん、現地の空気やグルメ、仲間との語らいまで満喫した最高の遠征となりました！"
            }
        ]
    elif is_work:
        return [
            {
                "badge": "💼 パターンA：実績・プロフェッショナル報告",
                "category": inferred_cat,
                "title": f"【制作実績】{short_core}｜想いと熱量を形にするクリエイティブ",
                "body": f"{core_phrase}。クライアント様やチームの皆様が大切にしてきたストーリーを丁寧にヒアリングし、見る人の心にまっすぐ届くデザイン・構成へと仕上げました。Web制作・映像制作のご相談も随時受け付けております！"
            },
            {
                "badge": "🤝 パターンB：ストーリー＆感謝重視",
                "category": inferred_cat,
                "title": f"{short_core}を担当させていただきました！",
                "body": f"{core_phrase}。制作を通じてたくさんの熱い想いに触れ、私自身も大きなエネルギーをいただきました。大切な節目のプロジェクトをお任せいただき心より感謝いたします！"
            },
            {
                "badge": "⚡ パターンC：スマート告知スタイル",
                "category": inferred_cat,
                "title": f"CREATIVE UPDATE：{short_core}",
                "body": f"{core_phrase}。企画設計からデザイン・実装までワンストップで対応いたしました。料金シミュレーターからのお見積もり・ご相談もお気軽にどうぞ！"
            }
        ]
    else:
        return [
            {
                "badge": "🤝 パターンA：自然で親しみやすい近況報告",
                "category": inferred_cat,
                "title": f"【最新情報】{short_core}",
                "body": f"{core_phrase}。コートの上での真剣勝負だけでなく、日々のこうした瞬間や新しい出会いのひとつひとつが、競技やクリエイティブ活動の大きな原動力になっています！"
            },
            {
                "badge": "🔥 パターンB：エネルギッシュ＆前向きスタイル",
                "category": inferred_cat,
                "title": f"{short_core}｜オンもオフも全力で楽しむ日々",
                "body": f"{core_phrase}！バスケも仕事もプライベートも、すべてに本気で向き合いながら毎日をアップデートしています。引き続き応援よろしくお願いいたします！"
            },
            {
                "badge": "⚡ パターンC：すっきりスマートなニュース風",
                "category": inferred_cat,
                "title": f"TOPICS：{short_core}",
                "body": f"{core_phrase}。今後の活動や最新プロジェクトについても順次このページで発信していきますので、ぜひチェックしてください！"
            }
        ]


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

        if parsed_path.path == "/api/texts":
            self.handle_get_json_file(TEXTS_FILE, {})
            return

        if parsed_path.path == "/api/works":
            self.handle_get_json_file(WORKS_FILE, [])
            return

        if parsed_path.path == "/api/media-catalog":
            self.handle_get_json_file(CATALOG_FILE, [])
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

        if parsed_path.path == "/api/texts":
            self.handle_post_json_file(TEXTS_FILE)
            return

        if parsed_path.path == "/api/works":
            self.handle_post_json_file(WORKS_FILE)
            return

        if parsed_path.path == "/api/media-catalog":
            self.handle_post_json_file(CATALOG_FILE)
            return

        if parsed_path.path == "/api/ai-write":
            self.handle_ai_write()
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

    def handle_ai_write(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            payload = json.loads(post_data.decode("utf-8"))
            target = payload.get("target", "news")
            nuance = payload.get("nuance", "")
            tone = payload.get("tone", "passion")

            proposals = generate_smart_copy(target, nuance, tone)
            self.send_json({"status": "success", "proposals": proposals})
        except Exception as e:
            self.send_error(500, f"Failed to generate copy: {e}")

    def handle_get_images(self):
        images = []
        if os.path.exists(IMAGES_DIR):
            for fname in sorted(os.listdir(IMAGES_DIR)):
                if fname.lower().endswith((".jpg", ".jpeg", ".png", ".webp")) and not fname.endswith("_thumb.jpg"):
                    images.append(f"images/{fname}")
        self.send_json(images)

    def handle_get_images_meta(self):
        catalog_map = {}
        cloud_items = []
        if os.path.exists(CATALOG_FILE):
            try:
                with open(CATALOG_FILE, "r", encoding="utf-8") as f:
                    cat_list = json.load(f)
                    if isinstance(cat_list, list):
                        for entry in cat_list:
                            u = entry.get("url", "")
                            if u:
                                catalog_map[u] = entry
                                if u.startswith("http://") or u.startswith("https://"):
                                    cloud_items.append({
                                        "filename": entry.get("filename") or os.path.basename(u),
                                        "url": u,
                                        "size_kb": entry.get("size_kb"),
                                        "mtime": entry.get("mtime", 9999999999),
                                        "category": entry.get("category", "offshot"),
                                        "memo": entry.get("memo", ""),
                                        "source": "cloudinary"
                                    })
            except Exception:
                pass

        items = list(cloud_items)
        if os.path.exists(IMAGES_DIR):
            for fname in sorted(os.listdir(IMAGES_DIR)):
                if fname.lower().endswith((".jpg", ".jpeg", ".png", ".webp")) and not fname.endswith("_thumb.jpg"):
                    fpath = os.path.join(IMAGES_DIR, fname)
                    url = f"images/{fname}"
                    try:
                        sz_kb = round(os.path.getsize(fpath) / 1024, 1)
                        mtime = os.path.getmtime(fpath)
                    except OSError:
                        sz_kb = 0
                        mtime = 0
                    cat_info = catalog_map.get(url, {})
                    items.append({
                        "filename": fname,
                        "url": url,
                        "size_kb": sz_kb,
                        "mtime": mtime,
                        "category": cat_info.get("category", "offshot"),
                        "memo": cat_info.get("memo", ""),
                        "source": "local"
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
            subprocess.run(
                ["git", "commit", "-m", "Update site photos and texts via Visual Admin Console"],
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
        print("🚀 ポートフォリオ & AIライティング・写真管理サーバー起動！")
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
