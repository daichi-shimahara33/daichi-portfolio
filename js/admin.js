/**
 * DAICHI SHIMAHARA #33 - ADMIN CONSOLE LOGIC
 */

(function () {
  'use strict';

  // 定数 & 初期状態
  const API_NEWS_URL = '/api/news';
  const API_IMAGES_URL = '/api/images';
  const API_UPLOAD_URL = '/api/upload';
  const LOCAL_STORAGE_KEY = 'ds_portfolio_news_data';

  // 既知のストック画像フォールバック
  const FALLBACK_IMAGES = [
    'images/SuUS89tdQ3m_J9UOu82GOg.jpg',
    'images/5Vo3Q0riS66ICKpqVD2ebA.jpg',
    'images/4NU0R9pwTzyqtoKNnRF7aw.jpg',
    'images/team.jpg',
    'images/IMG_8532.jpg',
    'images/5wmlkUItSNWx0Gh7hiKayw.jpg',
    'images/mRke21uCSjeQj7z8Q57I-Q.jpg',
    'images/eLr9eA4LT82MnBISvnik9A.jpg',
    'images/h4aNTqaAQzqDKAj3AHMgBw.jpg',
    'images/wwCRiC-ORKeJXwpUnWNovw.jpg',
    'images/zbICtdpkRRSUus1xPqoVEQ.jpg',
    'images/oIQj8Fq1Q5iU708Wj7-1Lw.jpg'
  ];

  // カテゴリとバッジクラスのマッピング
  const CATEGORY_MAP = {
    SPECIAL: { label: 'SPECIAL', badgeClass: 'badge-special' },
    PRIVATE: { label: 'PRIVATE', badgeClass: 'badge-private' },
    TEAM: { label: 'TEAM', badgeClass: 'badge-team' },
    GAME: { label: 'GAME', badgeClass: 'badge-game' },
    VISIT: { label: 'VISIT', badgeClass: 'badge-visit' },
    CREATIVE: { label: 'CREATIVE', badgeClass: 'badge-creative' },
    INFO: { label: 'INFO', badgeClass: 'badge-game' } // INFO用
  };

  // アプリケーション状態
  let newsList = [];
  let availableImages = [];
  let isServerOnline = false;
  let editingItemId = null;

  // DOM要素
  const form = document.getElementById('news-form');
  const editIdInput = document.getElementById('edit-item-id');
  const dateInput = document.getElementById('news-date');
  const categorySelect = document.getElementById('news-category');
  const titleInput = document.getElementById('news-title');
  const imageSelect = document.getElementById('news-image');
  const descTextarea = document.getElementById('news-desc');
  const formModeTitle = document.getElementById('form-mode-title');
  const btnSubmitText = document.getElementById('btn-submit-text');
  const btnCancelEdit = document.getElementById('btn-cancel-edit');
  const btnResetForm = document.getElementById('btn-reset-form');
  const btnExportJson = document.getElementById('btn-export-json');
  const serverStatus = document.getElementById('server-status');
  const tableBody = document.getElementById('news-table-body');
  const itemsCountBadge = document.getElementById('items-count');
  const toast = document.getElementById('admin-toast');

  // 画像アップロード要素
  const imageDropzone = document.getElementById('image-dropzone');
  const imageFileInput = document.getElementById('image-file-input');
  const dropzonePrompt = document.getElementById('dropzone-prompt');
  const dropzonePreview = document.getElementById('dropzone-preview');
  const uploadedFilename = document.getElementById('uploaded-filename');
  const uploadProgress = document.getElementById('upload-progress');

  // プレビュー要素
  const prevImg = document.getElementById('prev-img');
  const prevBadge = document.getElementById('prev-badge');
  const prevDate = document.getElementById('prev-date');
  const prevTitle = document.getElementById('prev-title');
  const prevDesc = document.getElementById('prev-desc');

  // 初期化
  document.addEventListener('DOMContentLoaded', async () => {
    initDefaultDate();
    initEventListeners();
    await checkServerAndLoadData();
    updateLivePreview();
  });

  /**
   * 日付初期値を本日の日付（YYYY-MM-DD）に設定
   */
  function initDefaultDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  /**
   * イベントリスナーの登録
   */
  function initEventListeners() {
    // フォーム入力中のリアルタイムプレビュー連動
    dateInput.addEventListener('input', updateLivePreview);
    categorySelect.addEventListener('change', updateLivePreview);
    titleInput.addEventListener('input', updateLivePreview);
    imageSelect.addEventListener('change', updateLivePreview);
    descTextarea.addEventListener('input', updateLivePreview);

    // フォーム送信
    form.addEventListener('submit', handleFormSubmit);

    // キャンセルボタン
    btnCancelEdit.addEventListener('click', cancelEdit);

    // リセットボタン
    btnResetForm.addEventListener('click', () => {
      cancelEdit();
      form.reset();
      initDefaultDate();
      updateLivePreview();
    });

    // JSONダウンロード
    btnExportJson.addEventListener('click', exportJson);

    // 画像アップロードイベント
    initImageUploadEvents();
  }

  /**
   * 画像アップロードのイベントリスナー初期化
   */
  function initImageUploadEvents() {
    // クリックでファイル選択ダイアログを開く
    imageDropzone.addEventListener('click', () => {
      imageFileInput.click();
    });

    // キーボード操作対応
    imageDropzone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        imageFileInput.click();
      }
    });

    // ファイル選択
    imageFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        uploadImageFile(file);
      }
    });

    // ドラッグ＆ドロップ対応
    ['dragenter', 'dragover'].forEach((eventName) => {
      imageDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        imageDropzone.classList.add('drag-over');
      });
    });

    ['dragleave', 'dragend', 'drop'].forEach((eventName) => {
      imageDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        imageDropzone.classList.remove('drag-over');
      });
    });

    imageDropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer && e.dataTransfer.files;
      if (files && files.length > 0) {
        uploadImageFile(files[0]);
      }
    });
  }

  /**
   * 画像ファイルのアップロード処理
   */
  async function uploadImageFile(file) {
    if (!file.type.match(/^image\/(jpeg|png|webp|jpg)$/i)) {
      showToast('JPG, PNG, WebP 形式の画像を選択してください', 'error');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      showToast('ファイルサイズが大きすぎます（20MB以下にしてください）', 'error');
      return;
    }

    dropzonePrompt.style.display = 'none';
    dropzonePreview.style.display = 'none';
    uploadProgress.style.display = 'flex';

    try {
      const base64Data = await readFileAsDataURL(file);

      if (isServerOnline) {
        const res = await fetch(API_UPLOAD_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            data: base64Data
          })
        });

        if (!res.ok) throw new Error('Upload failed');
        const result = await res.json();
        const savedUrl = result.url;

        addImageOption(savedUrl, true);
        showToast(`写真を保存しました: ${result.filename}`, 'success');
        uploadedFilename.textContent = result.filename;
      } else {
        addImageOption(base64Data, true, file.name);
        showToast('写真を一時読み込みしました（ローカルモード）', 'success');
        uploadedFilename.textContent = file.name;
      }

      uploadProgress.style.display = 'none';
      dropzonePreview.style.display = 'flex';
      updateLivePreview();
    } catch (err) {
      console.error('Image upload error:', err);
      showToast('写真のアップロードに失敗しました', 'error');
      uploadProgress.style.display = 'none';
      dropzonePrompt.style.display = 'block';
    } finally {
      imageFileInput.value = '';
    }
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function addImageOption(url, selectNow = false, label = '') {
    if (!availableImages.includes(url)) {
      availableImages.unshift(url);
    }

    let existingOpt = Array.from(imageSelect.options).find((opt) => opt.value === url);
    if (!existingOpt) {
      const opt = document.createElement('option');
      opt.value = url;
      opt.textContent = label || url.replace(/^images\//, '');
      imageSelect.insertBefore(opt, imageSelect.firstChild);
      existingOpt = opt;
    }

    if (selectNow) {
      imageSelect.value = url;
    }
  }

  /**
   * サーバー接続チェックおよびデータのロード
   */
  async function checkServerAndLoadData() {
    try {
      const res = await fetch(API_NEWS_URL, { cache: 'no-store' });
      if (res.ok) {
        newsList = await res.json();
        isServerOnline = true;
        setServerStatus(true, 'サーバー接続中（自動同期）');
      } else {
        throw new Error('API not available');
      }
    } catch (e) {
      // ローカルモード（サーバー未起動）
      isServerOnline = false;
      setServerStatus(false, 'ローカルモード（直接ファイル実行）');
      loadFromLocalStorageOrFallback();
    }

    // 画像一覧の取得
    await loadImagesList();

    // テーブル描画
    renderTable();
  }

  /**
   * 画像リストの読み込み
   */
  async function loadImagesList() {
    availableImages = FALLBACK_IMAGES;
    if (isServerOnline) {
      try {
        const res = await fetch(API_IMAGES_URL);
        if (res.ok) {
          const imgs = await res.json();
          if (imgs && imgs.length) {
            availableImages = imgs;
          }
        }
      } catch (e) {
        console.warn('Failed to fetch images from API, using fallback list');
      }
    }

    // セレクトボックスを生成
    imageSelect.innerHTML = '';
    availableImages.forEach((img) => {
      const opt = document.createElement('option');
      opt.value = img;
      // ファイル名を見やすく表示
      const fileName = img.replace(/^images\//, '');
      opt.textContent = fileName;
      imageSelect.appendChild(opt);
    });

    // 初期選択
    if (availableImages.length > 0) {
      imageSelect.value = availableImages[0];
    }
  }

  /**
   * ローカルストレージまたは初期データから読み込み
   */
  function loadFromLocalStorageOrFallback() {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        newsList = JSON.parse(saved);
        return;
      } catch (e) {
        console.error('Failed to parse localStorage data');
      }
    }

    // デフォルトデータ
    newsList = [
      {
        id: 'news-1',
        date: '2026.10.05',
        category: 'GAME',
        badgeClass: 'badge-game',
        title: '秋季クラブ選手権 第3節 EXCELLENCE勝利 & インサイドで貢献',
        desc: '接戦となった後半、トランジションからのポストプレーとリバウンドで主導権を握り、チームの勝利に貢献しました。応援ありがとうございました！',
        image: 'images/SuUS89tdQ3m_J9UOu82GOg.jpg'
      },
      {
        id: 'news-2',
        date: '2026.09.28',
        category: 'VISIT',
        badgeClass: 'badge-visit',
        title: '愛媛県社会人クラブチームへの合同練習・遠征参加',
        desc: '定期的に訪れている愛媛県のクラブチーム練習に参加させていただきました。熱いマッチアップと温かい歓迎に感謝です。また伺います！',
        image: 'images/5Vo3Q0riS66ICKpqVD2ebA.jpg'
      },
      {
        id: 'news-3',
        date: '2026.09.15',
        category: 'CREATIVE',
        badgeClass: 'badge-creative',
        title: '木場レッドシャークス 2025年度卒団記念ムービー制作キックオフ',
        desc: '4年目となる卒団記念ムービーの制作を担当することが決定。今年度のテーマ設計とこれまでの試合映像の構成作成を開始しました。',
        image: 'images/4NU0R9pwTzyqtoKNnRF7aw.jpg'
      }
    ];
  }

  /**
   * サーバー接続ステータス表示
   */
  function setServerStatus(online, text) {
    serverStatus.classList.remove('online', 'offline');
    serverStatus.classList.add(online ? 'online' : 'offline');
    const textEl = serverStatus.querySelector('.status-text');
    if (textEl) textEl.textContent = text;
  }

  /**
   * リアルタイムプレビューの更新
   */
  function updateLivePreview() {
    const rawDate = dateInput.value;
    const formattedDate = rawDate ? rawDate.replace(/-/g, '.') : '2026.10.05';
    const cat = categorySelect.value || 'GAME';
    const title = titleInput.value.trim() || 'タイトルがここに表示されます';
    const desc = descTextarea.value.trim() || '本文のプレビューがここにリアルタイムで表示されます。';
    const img = imageSelect.value || (availableImages[0] || 'images/IMG_8532.jpg');

    const catMeta = CATEGORY_MAP[cat] || { label: cat, badgeClass: 'badge-game' };

    prevDate.textContent = formattedDate;
    prevDate.setAttribute('datetime', rawDate);
    prevBadge.textContent = catMeta.label;
    prevBadge.className = `news-badge ${catMeta.badgeClass}`;
    prevTitle.textContent = title;
    prevDesc.textContent = desc;
    prevImg.src = img;
  }

  /**
   * フォーム送信ハンドラー（新規作成または更新）
   */
  async function handleFormSubmit(e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const desc = descTextarea.value.trim();
    const rawDate = dateInput.value;
    const cat = categorySelect.value;
    const img = imageSelect.value;

    if (!title || !desc || !rawDate) {
      showToast('必須項目（日付、タイトル、本文）を入力してください', 'error');
      return;
    }

    const formattedDate = rawDate.replace(/-/g, '.');
    const catMeta = CATEGORY_MAP[cat] || { label: cat, badgeClass: 'badge-game' };

    if (editingItemId) {
      // 編集更新
      const index = newsList.findIndex((item) => item.id === editingItemId);
      if (index !== -1) {
        newsList[index] = {
          ...newsList[index],
          date: formattedDate,
          category: cat,
          badgeClass: catMeta.badgeClass,
          title: title,
          desc: desc,
          image: img
        };
      }
      showToast('お知らせを更新しました！', 'success');
      cancelEdit();
    } else {
      // 新規作成
      const newItem = {
        id: 'news-' + Date.now(),
        date: formattedDate,
        category: cat,
        badgeClass: catMeta.badgeClass,
        title: title,
        desc: desc,
        image: img
      };
      // 最新順（先頭に追加）
      newsList.unshift(newItem);
      showToast('新しいお知らせを公開しました！', 'success');
    }

    // データの保存処理
    await saveData();

    // フォーム初期化 & 再描画
    form.reset();
    initDefaultDate();
    resetDropzoneUI();
    updateLivePreview();
    renderTable();
  }

  /**
   * データの保存（APIまたはローカルストレージ）
   */
  async function saveData() {
    // 常にローカルストレージにもバックアップ保存
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newsList));

    if (isServerOnline) {
      try {
        const res = await fetch(API_NEWS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newsList)
        });
        if (!res.ok) throw new Error('API save failed');
      } catch (e) {
        console.error('Failed to save to server:', e);
        showToast('サーバーへの保存に失敗しました。ローカル保存されました。', 'error');
      }
    }
  }

  /**
   * 一覧テーブルの描画
   */
  function renderTable() {
    itemsCountBadge.textContent = `${newsList.length} 件`;
    tableBody.innerHTML = '';

    if (newsList.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--color-text-muted); padding: 30px;">
            現在登録されているお知らせはありません。「新しいお知らせを投稿」から作成してください。
          </td>
        </tr>
      `;
      return;
    }

    newsList.forEach((item) => {
      const tr = document.createElement('tr');

      const catMeta = CATEGORY_MAP[item.category] || { label: item.category, badgeClass: 'badge-game' };

      tr.innerHTML = `
        <td>
          <img src="${escapeHtml(item.image)}" alt="" class="table-thumb" loading="lazy">
        </td>
        <td>
          <span class="table-date">${escapeHtml(item.date)}</span>
        </td>
        <td>
          <span class="news-badge ${catMeta.badgeClass}" style="position: static; padding: 2px 8px; font-size: 0.8rem;">
            ${escapeHtml(item.category)}
          </span>
        </td>
        <td>
          <div class="table-title">${escapeHtml(item.title)}</div>
          <div class="table-desc-preview">${escapeHtml(item.desc)}</div>
        </td>
        <td>
          <div class="table-actions">
            <button type="button" class="btn-action-edit" data-id="${item.id}">編集</button>
            <button type="button" class="btn-action-delete" data-id="${item.id}">削除</button>
          </div>
        </td>
      `;

      // イベントリスナー
      tr.querySelector('.btn-action-edit').addEventListener('click', () => startEdit(item.id));
      tr.querySelector('.btn-action-delete').addEventListener('click', () => deleteItem(item.id));

      tableBody.appendChild(tr);
    });
  }

  /**
   * 編集モード開始
   */
  function startEdit(id) {
    const item = newsList.find((x) => x.id === id);
    if (!item) return;

    editingItemId = id;
    editIdInput.value = id;

    // フォームに値をセット
    // 2026.10.05 -> 2026-10-05
    const dashDate = item.date.replace(/\./g, '-');
    dateInput.value = dashDate;
    categorySelect.value = item.category;
    titleInput.value = item.title;
    descTextarea.value = item.desc;
    if (item.image) {
      imageSelect.value = item.image;
    }

    // UI変更
    formModeTitle.textContent = 'お知らせを編集';
    btnSubmitText.textContent = '変更を更新する';
    btnCancelEdit.style.display = 'inline-block';

    updateLivePreview();
    form.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * 編集キャンセル
   */
  function cancelEdit() {
    editingItemId = null;
    editIdInput.value = '';
    formModeTitle.textContent = '新しいお知らせを投稿';
    btnSubmitText.textContent = 'お知らせを公開する';
    btnCancelEdit.style.display = 'none';
    resetDropzoneUI();
  }

  function resetDropzoneUI() {
    if (dropzonePrompt && dropzonePreview && uploadProgress) {
      dropzonePrompt.style.display = 'block';
      dropzonePreview.style.display = 'none';
      uploadProgress.style.display = 'none';
      if (imageFileInput) imageFileInput.value = '';
    }
  }

  /**
   * アイテムの削除
   */
  async function deleteItem(id) {
    const item = newsList.find((x) => x.id === id);
    if (!item) return;

    const ok = window.confirm(`「${item.title}」を本当に削除しますか？`);
    if (!ok) return;

    newsList = newsList.filter((x) => x.id !== id);

    if (editingItemId === id) {
      cancelEdit();
      form.reset();
      initDefaultDate();
    }

    await saveData();
    renderTable();
    updateLivePreview();
    showToast('お知らせを削除しました', 'success');
  }

  /**
   * JSONダウンロード（エクスポート）
   */
  function exportJson() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(newsList, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'news.json');
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('news.json をダウンロードしました！', 'success');
  }

  /**
   * トースト通知の表示
   */
  function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `admin-toast show ${type}`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  /**
   * XSS防止用 エスケープ
   */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
