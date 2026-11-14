/**
 * DAICHI SHIMAHARA #33 - VISUAL SITE-MAP PHOTO & CONTENT ADMIN LOGIC
 */

(function () {
  'use strict';

  const API_NEWS_URL = '/api/news';
  const API_PHOTOS_URL = '/api/photos';
  const API_IMAGES_META_URL = '/api/images/meta';
  const API_UPLOAD_URL = '/api/upload';
  const API_DELETE_IMAGE_URL = '/api/delete-image';
  const API_PUBLISH_URL = '/api/publish';

  const LS_NEWS_KEY = 'ds_portfolio_news_data';
  const LS_PHOTOS_KEY = 'ds_portfolio_photos_data';
  const SESSION_AUTH_KEY = 'ds_admin_unlocked_v1';
  const ADMIN_PASSCODE = '3333';

  const FALLBACK_IMAGES = [
    'images/IMG_8532.jpg',
    'images/eLr9eA4LT82MnBISvnik9A.jpg',
    'images/h4aNTqaAQzqDKAj3AHMgBw.jpg',
    'images/oIQj8Fq1Q5iU708Wj7-1Lw.jpg',
    'images/ehime_mikan_juice.jpg',
    'images/wwCRiC-ORKeJXwpUnWNovw.jpg',
    'images/zbICtdpkRRSUus1xPqoVEQ.jpg',
    'images/5hWodn-VTF6pPPU5mBzwjA.jpg',
    'images/SuUS89tdQ3m_J9UOu82GOg.jpg',
    'images/nCodfH6uTi-zfORtPWL2Kw.jpg',
    'images/ehime_team_salute.jpg',
    'images/IwPsWPFURlSngd9m60T98w.jpg',
    'images/5wmlkUItSNWx0Gh7hiKayw.jpg',
    'images/mRke21uCSjeQj7z8Q57I-Q.jpg',
    'images/wnba_action.jpg',
    'images/42CEC728-1355-4EE4-BE7F-14211B1E352D_1791466461.jpg',
    'images/5Vo3Q0riS66ICKpqVD2ebA.jpg',
    'images/4NU0R9pwTzyqtoKNnRF7aw.jpg',
    'images/team.jpg',
    'images/tokyo_autumn_tournament.jpg'
  ];

  const DEFAULT_PHOTOS_DATA = {
    slots: {
      hero: {
        label: '① トップ画面（ABOUT）右側のメイン写真',
        section: '① ABOUT（トップ画面）',
        src: 'images/IMG_8532.jpg',
        alt: '島原大智 ポートレート写真'
      },
      statement_1: {
        label: '② STATEMENT【左カード】背景写真',
        section: '② STATEMENT（3つの柱）',
        src: 'images/nCodfH6uTi-zfORtPWL2Kw.jpg',
        alt: 'EXCELLENCEでの試合・チーム風景'
      },
      statement_2: {
        label: '② STATEMENT【真ん中カード】背景写真',
        section: '② STATEMENT（3つの柱）',
        src: 'images/ehime_team_salute.jpg',
        alt: '愛媛県クラブチームとの練習・交流風景'
      },
      statement_3: {
        label: '② STATEMENT【右カード】背景写真',
        section: '② STATEMENT（3つの柱）',
        src: 'images/IwPsWPFURlSngd9m60T98w.jpg',
        alt: 'チームの熱量とストーリーを表現する一枚'
      },
      vision_1: {
        label: '④ VISION【左：地方遠征カード】写真',
        section: '④ VISION（今後の展望）',
        src: 'images/5wmlkUItSNWx0Gh7hiKayw.jpg',
        alt: '地方遠征 & 海辺での一枚'
      },
      vision_2: {
        label: '④ VISION【右：チーム募集カード】写真',
        section: '④ VISION（今後の展望）',
        src: 'images/mRke21uCSjeQj7z8Q57I-Q.jpg',
        alt: '黒ユニフォーム チーム集合写真'
      }
    },
    gallery: [
      { id: 'gal-1', src: 'images/eLr9eA4LT82MnBISvnik9A.jpg', alt: '島原大智 オフショット写真 1（練習・遠征風景）' },
      { id: 'gal-2', src: 'images/h4aNTqaAQzqDKAj3AHMgBw.jpg', alt: '島原大智 オフショット写真 2（チームメイトとの交流）' },
      { id: 'gal-3', src: 'images/oIQj8Fq1Q5iU708Wj7-1Lw.jpg', alt: '島原大智 オフショット写真 3（体育館でのワンシーン）' },
      { id: 'gal-4', src: 'images/ehime_mikan_juice.jpg', alt: '島原大智 愛媛遠征オフショット（蛇口みかんジュース）' },
      { id: 'gal-5', src: 'images/wwCRiC-ORKeJXwpUnWNovw.jpg', alt: '島原大智 オフショット写真 5（遠征先でのスナップ）' },
      { id: 'gal-6', src: 'images/zbICtdpkRRSUus1xPqoVEQ.jpg', alt: '島原大智 オフショット写真 6（バスケ仲間との記念撮影）' },
      { id: 'gal-7', src: 'images/5hWodn-VTF6pPPU5mBzwjA.jpg', alt: '島原大智 オフショット写真 7（コートサイド風景）' },
      { id: 'gal-8', src: 'images/SuUS89tdQ3m_J9UOu82GOg.jpg', alt: '島原大智 オフショット写真 8（試合後のオフショット）' }
    ]
  };

  const CATEGORY_MAP = {
    SPECIAL: { label: 'SPECIAL', badgeClass: 'badge-special' },
    PRIVATE: { label: 'PRIVATE', badgeClass: 'badge-private' },
    TEAM: { label: 'TEAM', badgeClass: 'badge-team' },
    GAME: { label: 'GAME', badgeClass: 'badge-game' },
    VISIT: { label: 'VISIT', badgeClass: 'badge-visit' },
    CREATIVE: { label: 'CREATIVE', badgeClass: 'badge-creative' },
    INFO: { label: 'INFO', badgeClass: 'badge-game' }
  };

  let photosData = JSON.parse(JSON.stringify(DEFAULT_PHOTOS_DATA));
  let newsList = [];
  let availableImages = [];
  let imagesMetaList = [];
  let isServerOnline = false;
  let editingItemId = null;
  let activePickerCallback = null;

  // DOM要素
  const authGate = document.getElementById('admin-auth-gate');
  const authForm = document.getElementById('auth-gate-form');
  const authInput = document.getElementById('auth-passcode');
  const authError = document.getElementById('auth-error');
  const btnLockAdmin = document.getElementById('btn-lock-admin');
  const btnSaveAll = document.getElementById('btn-save-all');
  const btnPublishLive = document.getElementById('btn-publish-live');
  const serverStatus = document.getElementById('server-status');
  const toast = document.getElementById('admin-toast');

  const galleryTopGrid = document.getElementById('admin-gallery-top-grid');
  const galleryExtraGrid = document.getElementById('admin-gallery-extra-grid');
  const btnAddGalleryPhoto = document.getElementById('btn-add-gallery-photo');

  const vmapNewsCardsGrid = document.getElementById('vmap-news-cards-grid');
  const vmapNewsEditorBox = document.getElementById('vmap-news-editor-box');
  const btnToggleNewsForm = document.getElementById('btn-toggle-news-form');

  const libraryDropzone = document.getElementById('library-dropzone');
  const libraryFileInput = document.getElementById('library-file-input');
  const libraryUploadStatus = document.getElementById('library-upload-status');
  const libraryUploadStatusText = document.getElementById('library-upload-status-text');
  const libraryMediaGrid = document.getElementById('library-media-grid');
  const libraryCountBadge = document.getElementById('library-count-badge');

  // Photo Picker Modal DOM
  const pickerModal = document.getElementById('photo-picker-modal');
  const pickerBackdrop = document.getElementById('photo-picker-backdrop');
  const pickerCloseBtn = document.getElementById('picker-close-btn');
  const pickerTitle = document.getElementById('picker-modal-title');
  const pickerGrid = document.getElementById('picker-photos-grid');
  const pickerFileInput = document.getElementById('picker-file-input');
  const btnPickerUploadTrigger = document.getElementById('btn-picker-upload-trigger');
  const pickerUploadHint = document.getElementById('picker-upload-hint');

  // NEWS Form DOM
  const form = document.getElementById('news-form');
  const editIdInput = document.getElementById('edit-item-id');
  const dateInput = document.getElementById('news-date');
  const categorySelect = document.getElementById('news-category');
  const titleInput = document.getElementById('news-title');
  const imageSelect = document.getElementById('news-image');
  const btnPickNewsPhoto = document.getElementById('btn-pick-news-photo');
  const descTextarea = document.getElementById('news-desc');
  const formModeTitle = document.getElementById('form-mode-title');
  const btnSubmitText = document.getElementById('btn-submit-text');
  const btnCancelEdit = document.getElementById('btn-cancel-edit');
  const btnResetForm = document.getElementById('btn-reset-form');

  const prevImg = document.getElementById('prev-img');
  const prevBadge = document.getElementById('prev-badge');
  const prevDate = document.getElementById('prev-date');
  const prevTitle = document.getElementById('prev-title');
  const prevDesc = document.getElementById('prev-desc');

  document.addEventListener('DOMContentLoaded', async () => {
    initAuthGate();
    initDefaultDate();
    initEventListeners();
    await checkServerAndLoadData();
    updateLivePreview();
  });

  function initAuthGate() {
    if (!authGate) return;
    if (sessionStorage.getItem(SESSION_AUTH_KEY) === 'true') {
      authGate.classList.add('is-unlocked');
    }

    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = (authInput.value || '').trim();
        if (code === ADMIN_PASSCODE) {
          sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
          authGate.classList.add('is-unlocked');
          authError.style.display = 'none';
          authInput.value = '';
          showToast('ロックを解除しました！', 'success');
        } else {
          authError.style.display = 'block';
          authInput.select();
        }
      });
    }

    if (btnLockAdmin) {
      btnLockAdmin.addEventListener('click', () => {
        sessionStorage.removeItem(SESSION_AUTH_KEY);
        authGate.classList.remove('is-unlocked');
        if (authInput) authInput.focus();
      });
    }
  }

  function initDefaultDate() {
    if (!dateInput) return;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  function initEventListeners() {
    if (btnSaveAll) {
      btnSaveAll.addEventListener('click', async () => {
        await savePhotosData();
        await saveNewsData();
        showToast('すべての変更をサイトに保存しました！', 'success');
      });
    }

    if (btnPublishLive) {
      btnPublishLive.addEventListener('click', publishToGitHub);
    }

    // ① ABOUT / ② STATEMENT / ④ VISION の「📸 ここの写真を変更する」ボタン
    document.querySelectorAll('[data-slot-trigger]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slotKey = btn.getAttribute('data-slot-trigger');
        const slotObj = photosData.slots && photosData.slots[slotKey];
        if (!slotObj) return;

        openPhotoPicker(`${slotObj.label} を選ぶ`, slotObj.src, async (newUrl) => {
          slotObj.src = newUrl;
          await savePhotosData();
          renderVisualSlots();
          renderLibraryAdmin();
          showToast(`「${slotObj.label}」を変更しました！`, 'success');
        });
      });
    });

    // ⑤ GALLERY 写真追加ボタン
    if (btnAddGalleryPhoto) {
      btnAddGalleryPhoto.addEventListener('click', () => {
        openPhotoPicker('⑤ オフショット（GALLERY）に新しい写真を追加', '', async (selectedUrl) => {
          photosData.gallery.push({
            id: 'gal-' + Date.now(),
            src: selectedUrl,
            alt: `島原大智 オフショット写真 ${photosData.gallery.length + 1}`
          });
          await savePhotosData();
          renderGalleryAdmin();
          renderLibraryAdmin();
          showToast('オフショット写真を追加しました！', 'success');
        });
      });
    }

    // ③ NEWS 新規投稿フォーム開閉
    if (btnToggleNewsForm && vmapNewsEditorBox) {
      btnToggleNewsForm.addEventListener('click', () => {
        const isHidden = vmapNewsEditorBox.style.display === 'none';
        if (isHidden) {
          cancelEdit();
          vmapNewsEditorBox.style.display = 'block';
          vmapNewsEditorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          vmapNewsEditorBox.style.display = 'none';
        }
      });
    }

    initLibraryUploader();
    initPickerModal();

    if (form) {
      dateInput.addEventListener('input', updateLivePreview);
      categorySelect.addEventListener('change', updateLivePreview);
      titleInput.addEventListener('input', updateLivePreview);
      imageSelect.addEventListener('change', updateLivePreview);
      descTextarea.addEventListener('input', updateLivePreview);
      form.addEventListener('submit', handleFormSubmit);
    }

    if (btnPickNewsPhoto) {
      btnPickNewsPhoto.addEventListener('click', () => {
        openPhotoPicker('③ お知らせのアイキャッチ写真を選択', imageSelect.value, (selectedUrl) => {
          addImageOption(selectedUrl, true);
          updateLivePreview();
        });
      });
    }

    if (btnCancelEdit) {
      btnCancelEdit.addEventListener('click', () => {
        cancelEdit();
        if (vmapNewsEditorBox) vmapNewsEditorBox.style.display = 'none';
      });
    }

    if (btnResetForm) {
      btnResetForm.addEventListener('click', () => {
        cancelEdit();
        form.reset();
        initDefaultDate();
        updateLivePreview();
      });
    }
  }

  async function checkServerAndLoadData() {
    try {
      const res = await fetch(API_PHOTOS_URL, { cache: 'no-store' });
      if (res.ok) {
        const loadedPhotos = await res.json();
        if (loadedPhotos && loadedPhotos.slots && Array.isArray(loadedPhotos.gallery)) {
          photosData = loadedPhotos;
        }
        isServerOnline = true;
        setServerStatus(true, 'サーバー接続中（変更すると即サイトに反映されます）');
      } else {
        throw new Error('API offline');
      }
    } catch (e) {
      isServerOnline = false;
      setServerStatus(false, 'プレビュー保存モード');
      const savedPhotos = localStorage.getItem(LS_PHOTOS_KEY);
      if (savedPhotos) {
        try { photosData = JSON.parse(savedPhotos); } catch (err) {}
      } else {
        try {
          const jsonRes = await fetch('data/photos.json', { cache: 'no-store' });
          if (jsonRes.ok) photosData = await jsonRes.json();
        } catch (err) {}
      }
    }

    try {
      const nRes = await fetch(isServerOnline ? API_NEWS_URL : 'data/news.json', { cache: 'no-store' });
      if (nRes.ok) {
        newsList = await nRes.json();
      }
    } catch (e) {
      const savedNews = localStorage.getItem(LS_NEWS_KEY);
      if (savedNews) {
        try { newsList = JSON.parse(savedNews); } catch (err) {}
      }
    }

    await loadImagesList();
    renderVisualSlots();
    renderVisualNewsCards();
    renderGalleryAdmin();
    renderLibraryAdmin();
  }

  async function loadImagesList() {
    availableImages = [...FALLBACK_IMAGES];
    imagesMetaList = [];

    if (isServerOnline) {
      try {
        const metaRes = await fetch(API_IMAGES_META_URL, { cache: 'no-store' });
        if (metaRes.ok) {
          imagesMetaList = await metaRes.json();
          if (imagesMetaList.length > 0) {
            availableImages = imagesMetaList.map((m) => m.url);
          }
        }
      } catch (e) {}
    }

    if (imagesMetaList.length === 0) {
      imagesMetaList = availableImages.map((url) => ({
        filename: url.replace(/^images\//, ''),
        url: url,
        size_kb: null
      }));
    }

    if (imageSelect) {
      const currentVal = imageSelect.value;
      imageSelect.innerHTML = '';
      availableImages.forEach((img) => {
        const opt = document.createElement('option');
        opt.value = img;
        opt.textContent = img.replace(/^images\//, '');
        imageSelect.appendChild(opt);
      });
      if (currentVal && availableImages.includes(currentVal)) {
        imageSelect.value = currentVal;
      } else if (availableImages.length > 0) {
        imageSelect.value = availableImages[0];
      }
    }
  }

  /**
   * ① ABOUT / ② STATEMENT / ④ VISION のサイト見た目プレビュー画像を最新状態に更新
   */
  function renderVisualSlots() {
    if (!photosData.slots) return;
    Object.entries(photosData.slots).forEach(([slotKey, slotInfo]) => {
      const imgEl = document.getElementById(`vmap-img-${slotKey}`);
      if (imgEl && slotInfo && slotInfo.src) {
        imgEl.src = slotInfo.src;
      }
    });
  }

  /**
   * ③ NEWS セクションを実際のカード見た目そのままに描画
   */
  function renderVisualNewsCards() {
    if (!vmapNewsCardsGrid) return;
    vmapNewsCardsGrid.innerHTML = '';

    newsList.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'vmap-news-card-item';

      const catMeta = CATEGORY_MAP[item.category] || { label: item.category, badgeClass: 'badge-game' };
      const posLabel = idx < 3
        ? `🟢 NEWS ${idx + 1}枚目（最初から表示）`
        : `🟠 NEWS ${idx + 1}枚目（「＋もっと見る」枠）`;

      card.innerHTML = `
        <div class="vmap-news-pos-bar">
          <span>${posLabel}</span>
          <span>${escapeHtml(item.date)}</span>
        </div>
        <div class="news-card-img-wrap" style="height: 185px;">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" style="width:100%;height:100%;object-fit:cover;">
          <span class="news-badge ${catMeta.badgeClass}">${escapeHtml(catMeta.label)}</span>
        </div>
        <div class="news-card-body" style="padding: 16px;">
          <h4 class="news-title" style="font-size: 1rem; margin-bottom: 8px;">${escapeHtml(item.title).replace(/\n/g, '<br>')}</h4>
          <p class="news-desc" style="font-size: 0.82rem; -webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;">${escapeHtml(item.desc)}</p>
        </div>
        <div class="vmap-news-actions-bar">
          <button type="button" class="btn-swap-photo btn-news-photo-only" style="flex: 1.3;">📸 写真だけ変更</button>
          <button type="button" class="btn-action-edit btn-news-edit">✏️ 文章編集</button>
          <button type="button" class="btn-action-delete btn-news-del">削除</button>
        </div>
      `;

      // 写真だけワンクリック変更
      card.querySelector('.btn-news-photo-only').addEventListener('click', () => {
        openPhotoPicker(`③ NEWS ${idx + 1}枚目「${item.title}」の写真を変更`, item.image, async (newUrl) => {
          item.image = newUrl;
          await saveNewsData();
          renderVisualNewsCards();
          renderLibraryAdmin();
          showToast(`NEWS ${idx + 1}枚目の写真を変更しました！`, 'success');
        });
      });

      // 文章・日付を編集
      card.querySelector('.btn-news-edit').addEventListener('click', () => {
        startEdit(item.id);
      });

      // 削除
      card.querySelector('.btn-news-del').addEventListener('click', () => {
        deleteItem(item.id);
      });

      vmapNewsCardsGrid.appendChild(card);
    });
  }

  /**
   * ⑤ GALLERY（オフショット写真管理）の描画
   */
  function renderGalleryAdmin() {
    if (!galleryTopGrid || !galleryExtraGrid) return;
    galleryTopGrid.innerHTML = '';
    galleryExtraGrid.innerHTML = '';

    const list = photosData.gallery || [];

    list.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'gallery-admin-card';

      const posLabel = index < 4
        ? `🟢 上段・左から${index + 1}枚目`
        : `🟠 下段（もっと見る）・${index - 3}枚目`;

      card.innerHTML = `
        <div class="gallery-card-top">
          <span>${posLabel}</span>
          <div class="gallery-order-btns">
            <button type="button" class="btn-order-move btn-move-prev" ${index === 0 ? 'disabled' : ''} title="1つ左（前）へ移動">←</button>
            <button type="button" class="btn-order-move btn-move-next" ${index === list.length - 1 ? 'disabled' : ''} title="1つ右（次）へ移動">→</button>
          </div>
        </div>
        <div class="gallery-thumb-wrap">
          <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" loading="lazy">
        </div>
        <div class="gallery-card-actions">
          <button type="button" class="btn-swap-photo">📸 ここの写真を変更</button>
          <button type="button" class="btn-action-delete" title="取り外す">🗑</button>
        </div>
      `;

      card.querySelector('.btn-move-prev').addEventListener('click', async () => {
        if (index <= 0) return;
        const tmp = list[index - 1];
        list[index - 1] = list[index];
        list[index] = tmp;
        await savePhotosData();
        renderGalleryAdmin();
        renderLibraryAdmin();
        showToast('オフショット写真の順番を入れ替えました', 'success');
      });

      card.querySelector('.btn-move-next').addEventListener('click', async () => {
        if (index >= list.length - 1) return;
        const tmp = list[index + 1];
        list[index + 1] = list[index];
        list[index] = tmp;
        await savePhotosData();
        renderGalleryAdmin();
        renderLibraryAdmin();
        showToast('オフショット写真の順番を入れ替えました', 'success');
      });

      card.querySelector('.btn-swap-photo').addEventListener('click', () => {
        openPhotoPicker(`⑤ オフショット（${posLabel}）の写真を変更`, item.src, async (newUrl) => {
          item.src = newUrl;
          await savePhotosData();
          renderGalleryAdmin();
          renderLibraryAdmin();
          showToast(`オフショット写真を差し替えました！`, 'success');
        });
      });

      card.querySelector('.btn-action-delete').addEventListener('click', async () => {
        if (!window.confirm(`「${posLabel}」の写真をギャラリーから取り外しますか？`)) return;
        photosData.gallery.splice(index, 1);
        await savePhotosData();
        renderGalleryAdmin();
        renderLibraryAdmin();
        showToast('ギャラリーから写真を取り外しました', 'success');
      });

      if (index < 4) {
        galleryTopGrid.appendChild(card);
      } else {
        galleryExtraGrid.appendChild(card);
      }
    });
  }

  /**
   * 🗂 全写真フォルダ描画（どの写真がサイトのどこで使われているか日本語で明記！）
   */
  function renderLibraryAdmin() {
    if (!libraryMediaGrid) return;
    libraryMediaGrid.innerHTML = '';

    // 画像URLごとに「サイトのどの場所で使われているか」をマッピング
    const usageMap = {};
    const addUsage = (url, placeName) => {
      if (!url) return;
      if (!usageMap[url]) usageMap[url] = [];
      usageMap[url].push(placeName);
    };

    if (photosData.slots) {
      if (photosData.slots.hero) addUsage(photosData.slots.hero.src, '📍 ① トップ画面メイン写真');
      if (photosData.slots.statement_1) addUsage(photosData.slots.statement_1.src, '📍 ② STATEMENT 左カード');
      if (photosData.slots.statement_2) addUsage(photosData.slots.statement_2.src, '📍 ② STATEMENT 真ん中カード');
      if (photosData.slots.statement_3) addUsage(photosData.slots.statement_3.src, '📍 ② STATEMENT 右カード');
      if (photosData.slots.vision_1) addUsage(photosData.slots.vision_1.src, '📍 ④ VISION 左（地方遠征）');
      if (photosData.slots.vision_2) addUsage(photosData.slots.vision_2.src, '📍 ④ VISION 右（チーム募集）');
    }

    if (Array.isArray(photosData.gallery)) {
      photosData.gallery.forEach((g, idx) => {
        const label = idx < 4
          ? `📍 ⑤ オフショット 上段${idx + 1}枚目`
          : `📍 ⑤ オフショット 下段${idx - 3}枚目`;
        addUsage(g.src, label);
      });
    }

    if (Array.isArray(newsList)) {
      newsList.forEach((n, idx) => {
        addUsage(n.image, `📍 ③ NEWS ${idx + 1}枚目`);
      });
    }

    if (libraryCountBadge) {
      libraryCountBadge.textContent = `${imagesMetaList.length} 枚`;
    }

    imagesMetaList.forEach((meta) => {
      const places = usageMap[meta.url] || [];
      const isUsed = places.length > 0;
      const card = document.createElement('div');
      card.className = 'library-media-card';

      const sizeText = meta.size_kb != null ? `${meta.size_kb} KB` : '軽量化済';
      const usageTagsHtml = isUsed
        ? places.map((p) => `<span class="media-usage-tag">${escapeHtml(p)}</span>`).join('')
        : '<span class="media-unused-tag">現在サイト未使用（いつでも使えます）</span>';

      card.innerHTML = `
        <div class="library-media-thumb">
          <img src="${escapeHtml(meta.url)}" alt="${escapeHtml(meta.filename)}" loading="lazy">
        </div>
        <div class="media-usage-tags">${usageTagsHtml}</div>
        <div class="library-media-meta" style="margin-top: auto; padding-top: 6px;">
          <span>容量: <strong>${sizeText}</strong></span>
          ${!isUsed && isServerOnline ? '<button type="button" class="btn-action-delete btn-del-lib" style="padding: 2px 8px; font-size: 0.72rem;">削除</button>' : ''}
        </div>
      `;

      const delBtn = card.querySelector('.btn-del-lib');
      if (delBtn) {
        delBtn.addEventListener('click', async () => {
          if (!window.confirm(`未使用の画像ファイル「${meta.filename}」を削除しますか？`)) return;
          try {
            const res = await fetch(API_DELETE_IMAGE_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: meta.url })
            });
            if (res.ok) {
              await loadImagesList();
              renderLibraryAdmin();
              showToast(`「${meta.filename}」を削除しました`, 'success');
            }
          } catch (e) {
            showToast('削除に失敗しました', 'error');
          }
        });
      }

      libraryMediaGrid.appendChild(card);
    });
  }

  function initLibraryUploader() {
    if (!libraryDropzone || !libraryFileInput) return;

    libraryDropzone.addEventListener('click', () => libraryFileInput.click());

    libraryFileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) await uploadMultipleFiles(files);
      libraryFileInput.value = '';
    });

    ['dragenter', 'dragover'].forEach((ev) => {
      libraryDropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        e.stopPropagation();
        libraryDropzone.classList.add('drag-over');
      });
    });

    ['dragleave', 'dragend', 'drop'].forEach((ev) => {
      libraryDropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        e.stopPropagation();
        libraryDropzone.classList.remove('drag-over');
      });
    });

    libraryDropzone.addEventListener('drop', async (e) => {
      const files = Array.from((e.dataTransfer && e.dataTransfer.files) || []);
      if (files.length > 0) await uploadMultipleFiles(files);
    });
  }

  async function uploadMultipleFiles(files) {
    if (libraryUploadStatus) libraryUploadStatus.style.display = 'flex';
    let lastUploaded = null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (libraryUploadStatusText) {
        libraryUploadStatusText.textContent = `${i + 1} / ${files.length} 枚目を高画質軽量化＆保存中...`;
      }
      const res = await uploadSingleFileToServer(file);
      if (res) lastUploaded = res;
    }

    if (libraryUploadStatus) libraryUploadStatus.style.display = 'none';
    await loadImagesList();
    renderLibraryAdmin();

    if (lastUploaded) {
      const kbInfo = lastUploaded.original_kb && lastUploaded.optimized_kb
        ? `（${lastUploaded.original_kb}KB ➔ ${lastUploaded.optimized_kb}KB に軽量化！）`
        : '';
      showToast(`${files.length}枚の写真を保存しました！${kbInfo}`, 'success');
    }
  }

  async function uploadSingleFileToServer(file) {
    if (!file.type.match(/^image\/(jpeg|png|webp|jpg)$/i)) {
      showToast('JPG, PNG, WebP 形式の画像を選択してください', 'error');
      return null;
    }
    const base64Data = await readFileAsDataURL(file);
    if (isServerOnline) {
      const res = await fetch(API_UPLOAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, data: base64Data })
      });
      if (!res.ok) throw new Error('Upload failed');
      return await res.json();
    } else {
      addImageOption(base64Data, true, file.name);
      return { filename: file.name, url: base64Data };
    }
  }

  function initPickerModal() {
    if (!pickerModal) return;

    const closePicker = () => {
      pickerModal.classList.remove('is-open');
      pickerModal.setAttribute('aria-hidden', 'true');
      activePickerCallback = null;
    };

    if (pickerBackdrop) pickerBackdrop.addEventListener('click', closePicker);
    if (pickerCloseBtn) pickerCloseBtn.addEventListener('click', closePicker);

    if (btnPickerUploadTrigger && pickerFileInput) {
      btnPickerUploadTrigger.addEventListener('click', () => pickerFileInput.click());
      pickerFileInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (pickerUploadHint) pickerUploadHint.textContent = '高画質軽量化＆アップロード中...';
        try {
          const uploaded = await uploadSingleFileToServer(file);
          await loadImagesList();
          if (uploaded && uploaded.url) {
            if (activePickerCallback) {
              const cb = activePickerCallback;
              closePicker();
              cb(uploaded.url);
            }
          }
        } catch (err) {
          showToast('アップロードに失敗しました', 'error');
        } finally {
          pickerFileInput.value = '';
        }
      });
    }
  }

  function openPhotoPicker(titleText, currentUrl, onSelectCallback) {
    if (!pickerModal || !pickerGrid) return;
    activePickerCallback = onSelectCallback;
    if (pickerTitle) pickerTitle.textContent = titleText || '写真を選択';
    if (pickerUploadHint) pickerUploadHint.textContent = '自動で高画質軽量化されます';

    pickerGrid.innerHTML = '';
    imagesMetaList.forEach((meta) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'picker-photo-option' + (meta.url === currentUrl ? ' is-selected' : '');
      const kbLabel = meta.size_kb ? ` (${meta.size_kb}KB)` : '';
      btn.innerHTML = `
        <img src="${escapeHtml(meta.url)}" alt="${escapeHtml(meta.filename)}" loading="lazy">
        <span class="picker-photo-name">${escapeHtml(meta.filename)}${kbLabel}</span>
      `;
      btn.addEventListener('click', () => {
        const cb = activePickerCallback;
        pickerModal.classList.remove('is-open');
        pickerModal.setAttribute('aria-hidden', 'true');
        activePickerCallback = null;
        if (cb) cb(meta.url);
      });
      pickerGrid.appendChild(btn);
    });

    pickerModal.classList.add('is-open');
    pickerModal.setAttribute('aria-hidden', 'false');
  }

  async function savePhotosData() {
    localStorage.setItem(LS_PHOTOS_KEY, JSON.stringify(photosData));
    if (isServerOnline) {
      try {
        await fetch(API_PHOTOS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(photosData)
        });
      } catch (e) {}
    }
  }

  async function publishToGitHub() {
    await savePhotosData();
    await saveNewsData();

    if (!isServerOnline) {
      showToast('保存しました！', 'info');
      return;
    }

    btnPublishLive.disabled = true;
    const origText = btnPublishLive.innerHTML;
    btnPublishLive.innerHTML = '<span>⏳ 本番へ公開中...</span>';

    try {
      const res = await fetch(API_PUBLISH_URL, { method: 'POST' });
      const data = await res.json();
      showToast(data.message || '本番環境へ反映しました！', 'success');
    } catch (e) {
      showToast('保存完了しました！', 'info');
    } finally {
      btnPublishLive.disabled = false;
      btnPublishLive.innerHTML = origText;
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
    if (!availableImages.includes(url)) availableImages.unshift(url);
    if (!imageSelect) return;
    let existingOpt = Array.from(imageSelect.options).find((opt) => opt.value === url);
    if (!existingOpt) {
      const opt = document.createElement('option');
      opt.value = url;
      opt.textContent = label || url.replace(/^images\//, '');
      imageSelect.insertBefore(opt, imageSelect.firstChild);
    }
    if (selectNow) imageSelect.value = url;
  }

  function setServerStatus(online, text) {
    if (!serverStatus) return;
    serverStatus.classList.remove('online', 'offline');
    serverStatus.classList.add(online ? 'online' : 'offline');
    const textEl = serverStatus.querySelector('.status-text');
    if (textEl) textEl.textContent = text;
  }

  function updateLivePreview() {
    if (!dateInput || !prevDate) return;
    const rawDate = dateInput.value;
    const formattedDate = rawDate ? rawDate.replace(/-/g, '.') : '2026.10.05';
    const cat = categorySelect.value || 'GAME';
    const title = titleInput.value.trim() || 'タイトルがここに表示されます';
    const desc = descTextarea.value.trim() || '本文のプレビューがここにリアルタイムで表示されます。';
    const img = imageSelect.value || (availableImages[0] || 'images/IMG_8532.jpg');

    const catMeta = CATEGORY_MAP[cat] || { label: cat, badgeClass: 'badge-game' };

    prevDate.textContent = formattedDate;
    prevBadge.textContent = catMeta.label;
    prevBadge.className = `news-badge ${catMeta.badgeClass}`;
    prevTitle.textContent = title;
    prevDesc.textContent = desc;
    prevImg.src = img;
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const desc = descTextarea.value.trim();
    const rawDate = dateInput.value;
    const cat = categorySelect.value;
    const img = imageSelect.value;

    if (!title || !desc || !rawDate) {
      showToast('日付、タイトル、本文を入力してください', 'error');
      return;
    }

    const formattedDate = rawDate.replace(/-/g, '.');
    const catMeta = CATEGORY_MAP[cat] || { label: cat, badgeClass: 'badge-game' };

    if (editingItemId) {
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
      newsList.unshift({
        id: 'news-' + Date.now(),
        date: formattedDate,
        category: cat,
        badgeClass: catMeta.badgeClass,
        title: title,
        desc: desc,
        image: img
      });
      showToast('新しいお知らせを公開しました！', 'success');
    }

    await saveNewsData();
    form.reset();
    initDefaultDate();
    updateLivePreview();
    renderVisualNewsCards();
    renderLibraryAdmin();
    if (vmapNewsEditorBox) vmapNewsEditorBox.style.display = 'none';
  }

  async function saveNewsData() {
    localStorage.setItem(LS_NEWS_KEY, JSON.stringify(newsList));
    if (isServerOnline) {
      try {
        await fetch(API_NEWS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newsList)
        });
      } catch (e) {}
    }
  }

  function startEdit(id) {
    const item = newsList.find((x) => x.id === id);
    if (!item) return;

    editingItemId = id;
    editIdInput.value = id;
    dateInput.value = item.date.replace(/\./g, '-');
    categorySelect.value = item.category;
    titleInput.value = item.title;
    descTextarea.value = item.desc;
    if (item.image) imageSelect.value = item.image;

    formModeTitle.textContent = 'お知らせを編集';
    btnSubmitText.textContent = '変更を保存する';
    if (vmapNewsEditorBox) {
      vmapNewsEditorBox.style.display = 'block';
      vmapNewsEditorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    updateLivePreview();
  }

  function cancelEdit() {
    editingItemId = null;
    if (editIdInput) editIdInput.value = '';
    if (formModeTitle) formModeTitle.textContent = '新しいお知らせを投稿';
    if (btnSubmitText) btnSubmitText.textContent = 'この内容で保存する';
  }

  async function deleteItem(id) {
    const item = newsList.find((x) => x.id === id);
    if (!item) return;
    if (!window.confirm(`「${item.title}」を削除しますか？`)) return;

    newsList = newsList.filter((x) => x.id !== id);
    await saveNewsData();
    renderVisualNewsCards();
    renderLibraryAdmin();
    updateLivePreview();
    showToast('お知らせを削除しました', 'success');
  }

  function showToast(message, type = 'info') {
    if (!toast) return;
    toast.textContent = message;
    toast.className = `admin-toast show ${type}`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

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
