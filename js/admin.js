/**
 * DAICHI SHIMAHARA #33 - VISUAL SITE-MAP PHOTO & AI COPYWRITING ADMIN LOGIC
 */

(function () {
  'use strict';

  const API_NEWS_URL = '/api/news';
  const API_PHOTOS_URL = '/api/photos';
  const API_TEXTS_URL = '/api/texts';
  const API_WORKS_URL = '/api/works';
  const API_AI_WRITE_URL = '/api/ai-write';
  const API_IMAGES_META_URL = '/api/images/meta';
  const API_UPLOAD_URL = '/api/upload';
  const API_DELETE_IMAGE_URL = '/api/delete-image';
  const API_PUBLISH_URL = '/api/publish';

  const LS_NEWS_KEY = 'ds_portfolio_news_data';
  const LS_PHOTOS_KEY = 'ds_portfolio_photos_data';
  const LS_TEXTS_KEY = 'ds_portfolio_texts_data';
  const LS_WORKS_KEY = 'ds_portfolio_works_data';
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

  const DEFAULT_TEXTS_DATA = {
    hero_tag: 'EXCELLENCE // #33',
    hero_desc: 'インサイド・アウトサイドともに対応できるオールラウンドプレイヤー。高い運動量とフィジカルを活かしたトランジション、ゴール下でのリバウンドでチームの勝利に貢献する。',
    statement_sub: 'コートの上で流した汗も、コートの外で創る熱狂も。\nすべては、バスケットボールを通じて人と繋がり、本気で生きる証。',
    statement_1_title: '192cmの肉体を張り、\n大人になっても本気で勝利に飢える。',
    statement_1_text: '久我山高校でIH3年連続出場、大学、そして社会人クラブ『EXCELLENCE』へ。大人になってもバスケは趣味で終わらない。192cmのサイズでゴール下を死守し、泥臭くルーズボールへ飛び込む瞬間に情熱を燃やしています。',
    statement_2_title: '東京から愛媛、全国へ。\n1つのボールが世代の壁を溶かす。',
    statement_2_text: '所属や肩書き、地域の枠なんて関係ない。愛媛をはじめ全国各地の体育館へ赴き、初対面の仲間とも全力のパス1本で本音で繋がる。バスケが持つ“人と人を爆発的に結びつける引力”を、自らの足で広げています。',
    statement_3_title: 'スポーツから企業案件まで、\n想いが伝わるWebと映像を創る。',
    statement_3_text: 'スポーツ領域にとどまらず、企業のコーポレートサイト、ブランドLP、プロモーション動画まであらゆる分野に対応。机上のテンプレに頼らず、理念や熱量を深く汲み取り、企画からデザイン・実装までワンストップで形にします。',
    vision_1_title: '地方遠征 & チーム訪問活動',
    vision_1_text: '現在は東京のチーム（EXCELLENCE）に所属しながら、都内だけでなく地方のチームや練習現場にも積極的に足を運んでいます。\n\n特に愛媛県にはよくお邪魔させていただいており、バスケをしていなければ出会えなかった素晴らしい仲間や指導者の方々と貴重な縁を築いています。',
    vision_2_title: 'チーム関係者の皆様へ & 今後の夢',
    vision_2_text: '【練習参加・交流チーム随時募集中】\n練習参加や合同練習を受け入れていただける社会人・クラブチーム様がございましたら、ぜひお気軽にご連絡ください！\n\n【FUTURE VISION】\n将来的には自身のYouTubeチャンネルを開設し、「全国の社会人バスケチーム訪問旅」プロジェクトを始動予定。各地のチームの魅力やバスケの楽しさを発信していきます。',
    gallery_lead: 'コート上の真剣勝負から、遠征先でのリラックスした一コマまで。\nバスケを通じて生まれる、かけがえのない思い出と仲間との絆を大切にしています。',
    gallery_place: '都内・愛媛県・各遠征先体育館',
    gallery_activity: '練習試合・地方遠征・グルメ食べ歩き',
    gallery_contact: '合同練習・見学・体験 随時受付中'
  };

  // 各セクションのAIモーダル設定（ラベル・ワンタップ例文）
  const AI_SECTION_CONFIG = {
    hero: {
      modalTitle: '① トップ画面（ABOUT）の自己紹介文をAIで作成・変更',
      titleKey: 'hero_tag',
      bodyKey: 'hero_desc',
      titleLabel: '肩書きタグ（英語・背番号など）',
      bodyLabel: 'メイン自己紹介文',
      chips: [
        '192cmのオールラウンダーとしてゴール下とリバウンドで勝利に貢献',
        '社会人バスケEXCELLENCEで戦いつつ、Web・映像クリエイターとしても活動',
        'バスケの情熱とクリエイティブの力でコート内外に熱狂を創る'
      ]
    },
    statement_1: {
      modalTitle: '② STATEMENT【左カード：ON THE COURT】の文章をAIで作成',
      titleKey: 'statement_1_title',
      bodyKey: 'statement_1_text',
      titleLabel: 'カード見出し（改行すると2行になります）',
      bodyLabel: 'カード本文',
      chips: [
        '192cmのフィジカルでゴール下を支配し、大人になっても本気で勝利を目指す',
        '久我山高校から大学、社会人EXCELLENCEまで一貫して泥臭いリバウンドにこだわる',
        '週末のコートで流す汗と勝利への執念が人生の原動力'
      ]
    },
    statement_2: {
      modalTitle: '② STATEMENT【真ん中カード：BEYOND BORDERS】の文章をAIで作成',
      titleKey: 'statement_2_title',
      bodyKey: 'statement_2_text',
      titleLabel: 'カード見出し',
      bodyLabel: 'カード本文',
      chips: [
        '東京から愛媛、全国の体育館へ足を運び、バスケを通じて世代や地域を超えて繋がる',
        '初対面の仲間ともパス1本で本音で語り合えるバスケの引力を広げる',
        '全国のクラブチームとの合同練習や交流を通じて一生モノの仲間を作る'
      ]
    },
    statement_3: {
      modalTitle: '② STATEMENT【右カード：CREATIVE & WEB】の文章をAIで作成',
      titleKey: 'statement_3_title',
      bodyKey: 'statement_3_text',
      titleLabel: 'カード見出し',
      bodyLabel: 'カード本文',
      chips: [
        'スポーツチームから一般企業・店舗まで、想いと熱量が伝わるWebサイトと動画を制作',
        'テンプレに頼らず企画からデザイン・実装までワンストップで形にする',
        '卒団記念ムービーやコーポレートサイトなど、心を動かすクリエイティブを提供'
      ]
    },
    vision_1: {
      modalTitle: '④ VISION【左：地方遠征カード】の文章をAIで作成',
      titleKey: 'vision_1_title',
      bodyKey: 'vision_1_text',
      titleLabel: 'カードタイトル',
      bodyLabel: 'カード本文',
      chips: [
        '東京のEXCELLENCEで活動しながら愛媛など全国各地のチームへ遠征・交流している',
        '地方遠征での熱いマッチアップと現地の仲間との出会いが最高の財産',
        'これからも全国各地のコートへ足を運び、バスケの輪を広げていきたい'
      ]
    },
    vision_2: {
      modalTitle: '④ VISION【右：チーム募集＆今後の夢カード】の文章をAIで作成',
      titleKey: 'vision_2_title',
      bodyKey: 'vision_2_text',
      titleLabel: 'カードタイトル',
      bodyLabel: 'カード本文',
      chips: [
        '合同練習や練習参加を受け入れてくださるチームを随時募集中！将来はYouTubeで全国バスケ旅を発信したい',
        'バスケの交流もWeb・動画制作のご相談もいつでも大歓迎！一緒に面白いことを創りたい',
        '全国の社会人バスケチームの魅力を映像とWebで発信するプロジェクトを始動予定'
      ]
    },
    gallery: {
      modalTitle: '⑤ GALLERY（オフショット）の紹介文・項目をAIで作成',
      titleKey: null,
      bodyKey: 'gallery_lead',
      titleLabel: '',
      bodyLabel: 'オフショット紹介リード文',
      chips: [
        '試合の真剣勝負から遠征先でのグルメや仲間との笑顔まで、バスケがある日常の思い出',
        '都内や愛媛遠征での練習風景と、コートを離れたリラックスしたオフショット集',
        'バスケを通じて出会った仲間との絆と、全力で楽しむ日々の記録'
      ]
    }
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
  let textsData = JSON.parse(JSON.stringify(DEFAULT_TEXTS_DATA));
  let newsList = [];
  let worksList = [];
  let availableImages = [];
  let imagesMetaList = [];
  let isServerOnline = false;
  let editingItemId = null;
  let activePickerCallback = null;
  let activeAiTargetKey = null;

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

  // AI Writer Modal DOM
  const aiModal = document.getElementById('ai-writer-modal');
  const aiBackdrop = document.getElementById('ai-writer-backdrop');
  const aiCloseBtn = document.getElementById('ai-modal-close-btn');
  const aiModalTitle = document.getElementById('ai-modal-title');
  const aiModalNuance = document.getElementById('ai-modal-nuance');
  const btnAiModalGenerate = document.getElementById('btn-ai-modal-generate');
  const aiModalChips = document.getElementById('ai-modal-chips');
  const aiModalProposals = document.getElementById('ai-modal-proposals');
  const aiModalTitleGroup = document.getElementById('ai-modal-title-group');
  const aiModalTitleLabel = document.getElementById('ai-modal-title-label');
  const aiModalEditTitle = document.getElementById('ai-modal-edit-title');
  const aiModalBodyLabel = document.getElementById('ai-modal-body-label');
  const aiModalEditBody = document.getElementById('ai-modal-edit-body');
  const aiModalGalleryExtra = document.getElementById('ai-modal-gallery-extra');
  const aiModalGalPlace = document.getElementById('ai-modal-gal-place');
  const aiModalGalActivity = document.getElementById('ai-modal-gal-activity');
  const aiModalGalContact = document.getElementById('ai-modal-gal-contact');
  const btnAiModalCancel = document.getElementById('btn-ai-modal-cancel');
  const btnAiModalSave = document.getElementById('btn-ai-modal-save');

  // NEWS Form & Inline AI DOM
  const newsAiNuanceInput = document.getElementById('news-ai-nuance-input');
  const btnNewsAiGenerate = document.getElementById('btn-news-ai-generate');
  const newsAiProposalsList = document.getElementById('news-ai-proposals-list');
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
        await saveTextsData();
        await saveNewsData();
        await saveWorksData();
        showToast('写真・文章・実績のすべての変更をサイトに保存しました！', 'success');
      });
    }

    if (btnPublishLive) {
      btnPublishLive.addEventListener('click', publishToGitHub);
    }

    // 📸 写真変更ボタン
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
          showToast(`「${slotObj.label}」の写真を変更しました！`, 'success');
        });
      });
    });

    // ✨ AI文章作成・変更ボタン（① ABOUT / ② STATEMENT / ④ VISION / ⑤ GALLERY）
    document.querySelectorAll('[data-ai-text-trigger]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetKey = btn.getAttribute('data-ai-text-trigger');
        openAiTextModal(targetKey);
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
          if (newsAiNuanceInput) newsAiNuanceInput.focus();
        } else {
          vmapNewsEditorBox.style.display = 'none';
        }
      });
    }

    // ③ NEWS フォーム内のAI記事生成
    if (btnNewsAiGenerate) {
      btnNewsAiGenerate.addEventListener('click', async () => {
        const nuance = (newsAiNuanceInput && newsAiNuanceInput.value.trim()) || '最近のバスケの試合や活動の近況報告';
        await runNewsInlineAi(nuance);
      });
    }

    document.querySelectorAll('[data-news-chip]').forEach((chip) => {
      chip.addEventListener('click', async () => {
        const text = chip.getAttribute('data-news-chip') || '';
        if (newsAiNuanceInput) newsAiNuanceInput.value = text;
        await runNewsInlineAi(text);
      });
    });

    initLibraryUploader();
    initPickerModal();
    initAiWriterModal();
    initWorksAdminEvents();

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

  /**
   * サーバー＆ローカルデータの読み込み
   */
  async function checkServerAndLoadData() {
    try {
      const res = await fetch(API_PHOTOS_URL, { cache: 'no-store' });
      if (res.ok) {
        const loadedPhotos = await res.json();
        if (loadedPhotos && loadedPhotos.slots && Array.isArray(loadedPhotos.gallery)) {
          photosData = loadedPhotos;
        }
        isServerOnline = true;
        setServerStatus(true, 'AIエンジン＆サーバー接続中（変更すると即サイトに反映）');
      } else {
        throw new Error('API offline');
      }
    } catch (e) {
      isServerOnline = false;
      setServerStatus(false, 'ブラウザAI＆保存モード');
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

    // サイト文章データ（site_texts.json）の読み込み
    try {
      const tRes = await fetch(isServerOnline ? API_TEXTS_URL : 'data/site_texts.json', { cache: 'no-store' });
      if (tRes.ok) {
        const loadedTexts = await tRes.json();
        if (loadedTexts && typeof loadedTexts === 'object') {
          textsData = { ...DEFAULT_TEXTS_DATA, ...loadedTexts };
        }
      }
    } catch (e) {
      const savedTexts = localStorage.getItem(LS_TEXTS_KEY);
      if (savedTexts) {
        try { textsData = { ...DEFAULT_TEXTS_DATA, ...JSON.parse(savedTexts) }; } catch (err) {}
      }
    }

    // Newsの読み込み
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

    // Works（制作実績）の読み込み
    try {
      const wRes = await fetch(isServerOnline ? API_WORKS_URL : 'data/works.json', { cache: 'no-store' });
      if (wRes.ok) {
        worksList = await wRes.json();
      }
    } catch (e) {
      const savedWorks = localStorage.getItem(LS_WORKS_KEY);
      if (savedWorks) {
        try { worksList = JSON.parse(savedWorks); } catch (err) {}
      }
    }

    await loadImagesList();
    renderVisualSlots();
    renderVisualTexts();
    renderVisualNewsCards();
    renderVisualWorksCards();
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
   * 画面上の各セクションテキストプレビュー（#vmap-txt-*）を最新状態に更新
   */
  function renderVisualTexts() {
    Object.entries(textsData).forEach(([key, val]) => {
      const el = document.getElementById(`vmap-txt-${key}`);
      if (el && val != null) {
        el.innerHTML = escapeHtml(String(val)).replace(/\n/g, '<br>');
      }
    });
  }

  /**
   * 🤖 クライアント・サーバー共通 AIコピーライティング生成関数
   */
  async function requestAiProposals(target, nuance) {
    if (isServerOnline) {
      try {
        const res = await fetch(API_AI_WRITE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target, nuance })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.proposals)) return data.proposals;
        }
      } catch (e) {}
    }
    return generateLocalAiCopy(target, nuance);
  }

  function generateLocalAiCopy(target, nuance) {
    const clean = (nuance || '').trim().replace(/\s+/g, ' ') || 'コートでの挑戦と仲間との繋がり';
    const shortCore = clean.length > 28 ? clean.slice(0, 28) + '…' : clean;

    const isGame = /試合|勝|負|大会|得点|点|リバウンド|バスケ|EXCELLENCE|トーナメント/.test(clean);
    const isTrip = /遠征|愛媛|訪問|地方|旅|合宿|練習参加|交流|仲間|体育館/.test(clean);
    const isWork = /Web|WEB|サイト|動画|映像|ムービー|制作|仕事|依頼|企業|LP|卒団/.test(clean);
    const isPrivate = /休日|オフ|ご飯|グルメ|みかん|カフェ|散歩|プライベート/.test(clean);

    let inferredCat = 'INFO';
    if (isGame) inferredCat = 'GAME';
    else if (isTrip) inferredCat = 'VISIT';
    else if (isWork) inferredCat = 'CREATIVE';
    else if (isPrivate) inferredCat = 'PRIVATE';

    if (target === 'hero') {
      return [
        {
          badge: '🔥 パターンA：熱量＆アスリート重視',
          title: 'EXCELLENCE // #33',
          body: `${clean}を体現する192cmのオールラウンドプレイヤー。高い運動量とフィジカルを活かしたトランジション、ゴール下での泥臭いリバウンドでチームの勝利に貢献し、コート内外で熱狂を創り出す。`
        },
        {
          badge: '🤝 パターンB：親しみ＆二刀流ストーリー重視',
          title: 'ATHLETE & CREATOR // #33',
          body: `社会人バスケ『EXCELLENCE』で汗を流しながら、${clean}を大切に活動中。192cmのインサイドプレーで勝利を掴み、Web・映像クリエイティブの力で人やチームの魅力を形にします。`
        },
        {
          badge: '💼 パターンC：スマート＆プロフェッショナル',
          title: 'TOKYO / EXCELLENCE #33',
          body: `競技者としてのストイックな視点と、Web・映像制作の実践力を兼ね備えたハイブリッドプレイヤー。${clean}を軸に、スポーツからビジネス領域まで確かな成果と熱量を届けます。`
        }
      ];
    }

    if (target.startsWith('statement')) {
      return [
        {
          badge: '🔥 パターンA：熱いステートメント風',
          title: `${shortCore}\n本気で挑み続けるからこそ見える景色がある。`,
          body: `${clean}。大人になっても情熱は決して色褪せない。192cmの身体を張ってコートで戦い抜き、バスケを通じて出会うすべての人と本気で向き合い、最高の価値を創り続けます。`
        },
        {
          badge: '🤝 パターンB：共感・ストーリー風',
          title: `バスケが繋ぐ縁と、\n${shortCore}`,
          body: `${clean}という想いを胸に、東京から全国へと活動の幅を広げています。世代や地域の垣根を越えて1つのボールで繋がり、そこで生まれた絆やストーリーを大切に育てています。`
        },
        {
          badge: '💼 パターンC：クリエイティブ＆信頼感風',
          title: `想いをカタチにし、\n${shortCore}`,
          body: `${clean}。テンプレートな表現ではなく、現場の空気感や一人ひとりの情熱を深く汲み取り、見る人の心を動かすWebサイトや映像作品へと昇華させます。`
        }
      ];
    }

    if (target.startsWith('vision')) {
      return [
        {
          badge: '🔥 パターンA：情熱・挑戦スタイル',
          title: shortCore,
          body: `${clean}。\n\n東京（EXCELLENCE）での競技活動にとどまらず、全国のコートや新しいフィールドへ自ら足を運び、バスケとクリエイティブが持つ可能性をこれからも全力で広げていきます。`
        },
        {
          badge: '🤝 パターンB：ウェルカム・交流重視スタイル',
          title: 'バスケの輪を広げる活動 & 今後の展望',
          body: `${clean}。\n\n練習参加や合同練習、またWeb・動画制作のご相談もいつでも大歓迎です！バスケを通じて出会う皆様と一緒に、ワクワクする新しい企画やご縁を創っていければ嬉しいです。`
        },
        {
          badge: '⚡ パターンC：すっきり簡潔スタイル',
          title: `NEXT VISION // ${shortCore}`,
          body: `${clean}をテーマに、コート上のプレーもクリエイティブ制作もさらにアップデートしていきます。ご興味を持っていただけた方はぜひお気軽にお声がけください！`
        }
      ];
    }

    if (target === 'works') {
      const isVideoWork = /動画|映像|ムービー|PV|MV|YouTube|卒団|Filmora|リール/.test(clean);
      const wType = isVideoWork ? 'video' : 'web';
      const wEyebrow = isVideoWork ? 'MEMORIAL & PROMOTION VIDEO' : 'WEB DESIGN & FULL-STACK DEV';
      const wMeta1 = isVideoWork ? '⏱ 制作期間: 約2〜4週間（企画・構成〜映像編集）' : '⏱ 制作領域: 企画設計・UI/UXデザイン・レスポンシブ実装';
      const wMeta2 = isVideoWork ? '🛠 使用ツール: Filmora / 映像演出・サウンド編集' : '🛠 技術構成: HTML5 / CSS3 / JavaScript / SEO構造化設計';
      return [
        {
          badge: '💼 パターンA：王道プロフェッショナル実績',
          type: wType,
          eyebrow: wEyebrow,
          title: shortCore,
          work_badge: isVideoWork ? '企画・構成・制作担当' : '企画・UI設計・フルスクラッチ開発',
          meta1: wMeta1,
          meta2: wMeta2,
          body: `${clean}。クライアント様の理念やターゲット層の導線を徹底的にヒアリングし、テンプレートに頼らないオリジナル設計で制作。視覚的なインパクトと使いやすさ・伝わりやすさを高次元で両立させたプロジェクトです。`,
          quote: '「想いと熱量をダイレクトに届け、見る人の心を動かすクリエイティブへ」'
        },
        {
          badge: '🔥 パターンB：ストーリー＆熱量重視',
          type: wType,
          eyebrow: wEyebrow,
          title: `${shortCore} プロジェクト`,
          work_badge: isVideoWork ? 'ストーリー設計〜制作' : 'コンセプト設計〜デザイン実装',
          meta1: wMeta1,
          meta2: wMeta2,
          body: `${clean}。現場の空気感やそこに込められたストーリーを細部まで汲み取り、見た瞬間に熱量が伝わる構成を追求。公開後も多くの方から高い評価をいただいた実績です。`,
          quote: '「単なる制作物ではなく、長く愛される一生モノの資産をつくる」'
        },
        {
          badge: '⚡ パターンC：成果・ビジネス貢献重視',
          type: wType,
          eyebrow: wEyebrow,
          title: shortCore,
          work_badge: 'ワンストップ制作',
          meta1: wMeta1,
          meta2: wMeta2,
          body: `${clean}。スマホでの見やすさや表示スピード、SEO対策・お問い合わせ導線まで一貫して最適化し、集客・ブランディングに直結する構成を実現しました。`,
          quote: '「スピード・品質・成果にこだわったワンストップ制作」'
        }
      ];
    }

    if (target === 'gallery') {
      return [
        {
          badge: '🤝 パターンA：温かみのあるオフショット紹介',
          title: '日々の練習 & オフショット',
          body: `${clean}。\n試合中の真剣な表情から、練習後や遠征先で仲間と笑い合うリラックスした瞬間まで、バスケがある日常の風景を切り取っています。`
        },
        {
          badge: '🔥 パターンB：アクティブ・臨場感スタイル',
          title: 'ON & OFF COURT MEMORIES',
          body: `${clean}！\n都内の体育館から地方遠征、練習後のグルメ巡りまで、最高の仲間たちと過ごすリアルな日々をお届けします。`
        },
        {
          badge: '⚡ パターンC：ショート＆スタイリッシュ',
          title: 'コート内外のリアルな日常',
          body: `${clean}。\n1つのボールから広がる出会いと、かけがえのない時間を大切にしています。`
        }
      ];
    }

    // NEWS用
    return [
      {
        badge: '🔥 パターンA：熱量＆臨場感レポート',
        category: inferredCat,
        title: `【最新報告】${shortCore}！`,
        body: `${clean}！コートの上での全力プレーと仲間との熱い連携で、非常に充実した時間となりました。いつも温かい応援や交流をいただきありがとうございます！`
      },
      {
        badge: '🤝 パターンB：親しみ＆感謝スタイル',
        category: inferredCat,
        title: `${shortCore}｜仲間と共に過ごした最高の時間`,
        body: `${clean}。こうした日々の積み重ねや皆様とのご縁が、競技にもクリエイティブ制作にも大きなエネルギーを与えてくれています。これからも全力で駆け抜けます！`
      },
      {
        badge: '💼 パターンC：スマート＆プロフェッショナル告知',
        category: inferredCat,
        title: `TOPICS：${shortCore}`,
        body: `${clean}。活動の詳細や制作実績・お問い合わせについては各ページからもご覧いただけます。今後ともよろしくお願いいたします！`
      }
    ];
  }

  /**
   * 🤖 AI文章作成＆編集モーダル（① ABOUT / ② STATEMENT / ④ VISION / ⑤ GALLERY）
   */
  function initAiWriterModal() {
    if (!aiModal) return;

    const closeAiModal = () => {
      aiModal.classList.remove('is-open');
      aiModal.setAttribute('aria-hidden', 'true');
      activeAiTargetKey = null;
    };

    if (aiBackdrop) aiBackdrop.addEventListener('click', closeAiModal);
    if (aiCloseBtn) aiCloseBtn.addEventListener('click', closeAiModal);
    if (btnAiModalCancel) btnAiModalCancel.addEventListener('click', closeAiModal);

    if (btnAiModalGenerate) {
      btnAiModalGenerate.addEventListener('click', async () => {
        if (!activeAiTargetKey) return;
        const nuance = (aiModalNuance && aiModalNuance.value.trim()) || 'バスケへの情熱と仲間との繋がり';
        await renderModalAiProposals(activeAiTargetKey, nuance);
      });
    }

    if (btnAiModalSave) {
      btnAiModalSave.addEventListener('click', async () => {
        if (!activeAiTargetKey) return;
        const cfg = AI_SECTION_CONFIG[activeAiTargetKey];
        if (!cfg) return;

        if (cfg.titleKey && aiModalEditTitle) {
          textsData[cfg.titleKey] = aiModalEditTitle.value.trim();
        }
        if (cfg.bodyKey && aiModalEditBody) {
          textsData[cfg.bodyKey] = aiModalEditBody.value.trim();
        }
        if (activeAiTargetKey === 'gallery') {
          if (aiModalGalPlace) textsData.gallery_place = aiModalGalPlace.value.trim();
          if (aiModalGalActivity) textsData.gallery_activity = aiModalGalActivity.value.trim();
          if (aiModalGalContact) textsData.gallery_contact = aiModalGalContact.value.trim();
        }

        await saveTextsData();
        renderVisualTexts();
        closeAiModal();
        showToast('文章をサイトに反映しました！', 'success');
      });
    }
  }

  function openAiTextModal(targetKey) {
    const cfg = AI_SECTION_CONFIG[targetKey];
    if (!cfg || !aiModal) return;

    activeAiTargetKey = targetKey;
    if (aiModalTitle) aiModalTitle.textContent = cfg.modalTitle;
    if (aiModalNuance) aiModalNuance.value = '';
    if (aiModalProposals) {
      aiModalProposals.style.display = 'none';
      aiModalProposals.innerHTML = '';
    }

    // ワンタップ例文チップを生成
    if (aiModalChips) {
      aiModalChips.innerHTML = '<span class="chip-label">ワンタップ例：</span>';
      (cfg.chips || []).forEach((chipText) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'ai-chip';
        b.textContent = `💡 ${chipText.slice(0, 22)}…`;
        b.addEventListener('click', async () => {
          if (aiModalNuance) aiModalNuance.value = chipText;
          await renderModalAiProposals(targetKey, chipText);
        });
        aiModalChips.appendChild(b);
      });
    }

    // 現在の文章をフォームにセット
    if (cfg.titleKey) {
      aiModalTitleGroup.style.display = 'flex';
      aiModalTitleLabel.textContent = cfg.titleLabel;
      aiModalEditTitle.value = textsData[cfg.titleKey] || '';
    } else {
      aiModalTitleGroup.style.display = 'none';
    }

    aiModalBodyLabel.textContent = cfg.bodyLabel;
    aiModalEditBody.value = textsData[cfg.bodyKey] || '';

    if (targetKey === 'gallery' && aiModalGalleryExtra) {
      aiModalGalleryExtra.style.display = 'grid';
      aiModalGalPlace.value = textsData.gallery_place || '';
      aiModalGalActivity.value = textsData.gallery_activity || '';
      aiModalGalContact.value = textsData.gallery_contact || '';
    } else if (aiModalGalleryExtra) {
      aiModalGalleryExtra.style.display = 'none';
    }

    aiModal.classList.add('is-open');
    aiModal.setAttribute('aria-hidden', 'false');
    if (aiModalNuance) aiModalNuance.focus();
  }

  async function renderModalAiProposals(targetKey, nuance) {
    if (!aiModalProposals) return;
    aiModalProposals.style.display = 'grid';
    aiModalProposals.innerHTML = '<div style="grid-column: 1/-1; color: var(--color-accent); font-weight:700;">🤖 AIが3パターンの文章を作成中...</div>';

    const proposals = await requestAiProposals(targetKey, nuance);
    aiModalProposals.innerHTML = '';

    proposals.forEach((prop) => {
      const card = document.createElement('div');
      card.className = 'ai-proposal-card';
      card.innerHTML = `
        <span class="ai-prop-badge">${escapeHtml(prop.badge)}</span>
        <div class="ai-prop-title">${escapeHtml(prop.title || '').replace(/\n/g, '<br>')}</div>
        <div class="ai-prop-body">${escapeHtml(prop.body || '').replace(/\n/g, '<br>')}</div>
        <button type="button" class="btn-use-proposal">この文章をセットする ✓</button>
      `;

      card.querySelector('.btn-use-proposal').addEventListener('click', () => {
        if (aiModalEditTitle && prop.title) aiModalEditTitle.value = prop.title;
        if (aiModalEditBody && prop.body) aiModalEditBody.value = prop.body;
        showToast('下の確認欄にセットしました！「💾 この文章をサイトに反映する」で保存できます', 'success');
      });

      aiModalProposals.appendChild(card);
    });
  }

  /**
   * ③ NEWS フォーム内インラインAIライター
   */
  async function runNewsInlineAi(nuance) {
    if (!newsAiProposalsList) return;
    newsAiProposalsList.style.display = 'grid';
    newsAiProposalsList.innerHTML = '<div style="grid-column: 1/-1; color: var(--color-accent); font-weight:700;">🤖 AIがニュース記事を3パターン作成中...</div>';

    const proposals = await requestAiProposals('news', nuance);
    newsAiProposalsList.innerHTML = '';

    proposals.forEach((prop) => {
      const card = document.createElement('div');
      card.className = 'ai-proposal-card';
      card.innerHTML = `
        <span class="ai-prop-badge">${escapeHtml(prop.badge)}</span>
        <div class="ai-prop-title">${escapeHtml(prop.title || '')}</div>
        <div class="ai-prop-body">${escapeHtml(prop.body || '')}</div>
        <button type="button" class="btn-use-proposal">この記事を使う ✓</button>
      `;

      card.querySelector('.btn-use-proposal').addEventListener('click', () => {
        if (titleInput) titleInput.value = prop.title || '';
        if (descTextarea) descTextarea.value = prop.body || '';
        if (categorySelect && prop.category) categorySelect.value = prop.category;
        updateLivePreview();
        showToast('タイトルと本文を自動入力しました！', 'success');
      });

      newsAiProposalsList.appendChild(card);
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
          <button type="button" class="btn-swap-photo btn-news-photo-only">📸 写真変更</button>
          <button type="button" class="btn-action-edit btn-news-edit" style="flex:1;">✨ AI文章・編集</button>
          <button type="button" class="btn-action-delete btn-news-del">削除</button>
        </div>
      `;

      card.querySelector('.btn-news-photo-only').addEventListener('click', () => {
        openPhotoPicker(`③ NEWS ${idx + 1}枚目「${item.title}」の写真を変更`, item.image, async (newUrl) => {
          item.image = newUrl;
          await saveNewsData();
          renderVisualNewsCards();
          renderLibraryAdmin();
          showToast(`NEWS ${idx + 1}枚目の写真を変更しました！`, 'success');
        });
      });

      card.querySelector('.btn-news-edit').addEventListener('click', () => {
        startEdit(item.id);
      });

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
   * 🗂 全写真フォルダ描画
   */
  function renderLibraryAdmin() {
    if (!libraryMediaGrid) return;
    libraryMediaGrid.innerHTML = '';

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

  async function saveTextsData() {
    localStorage.setItem(LS_TEXTS_KEY, JSON.stringify(textsData));
    if (isServerOnline) {
      try {
        await fetch(API_TEXTS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(textsData)
        });
      } catch (e) {}
    }
  }

  async function publishToGitHub() {
    await savePhotosData();
    await saveTextsData();
    await saveNewsData();
    await saveWorksData();

    if (!isServerOnline) {
      showToast('変更を保存しました！', 'info');
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
      showToast('日付、タイトル、本文を入力してください（上のAIボックスで自動作成もできます！）', 'error');
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

    formModeTitle.textContent = 'お知らせを編集（上のAIライターで書き直しもOK）';
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
    if (newsAiProposalsList) {
      newsAiProposalsList.style.display = 'none';
      newsAiProposalsList.innerHTML = '';
    }
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

  /**
   * ⑥ WORKS（制作実績ページ）管理＆AI自動作成
   */
  function initWorksAdminEvents() {
    const btnToggleWorks = document.getElementById('btn-toggle-works-form');
    const worksEditorBox = document.getElementById('vmap-works-editor-box');
    const btnCancelWorks = document.getElementById('btn-cancel-works-edit');
    const btnWorksAiGen = document.getElementById('btn-works-ai-generate');
    const worksAiInput = document.getElementById('works-ai-nuance-input');
    const worksForm = document.getElementById('works-form');

    if (btnToggleWorks && worksEditorBox) {
      btnToggleWorks.addEventListener('click', () => {
        const isHidden = worksEditorBox.style.display === 'none';
        if (isHidden) {
          resetWorksForm();
          worksEditorBox.style.display = 'block';
          worksEditorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (worksAiInput) worksAiInput.focus();
        } else {
          worksEditorBox.style.display = 'none';
        }
      });
    }

    if (btnCancelWorks && worksEditorBox) {
      btnCancelWorks.addEventListener('click', () => {
        resetWorksForm();
        worksEditorBox.style.display = 'none';
      });
    }

    if (btnWorksAiGen) {
      btnWorksAiGen.addEventListener('click', async () => {
        const nuance = (worksAiInput && worksAiInput.value.trim()) || '新しいWebサイト制作プロジェクト';
        await runWorksInlineAi(nuance);
      });
    }

    document.querySelectorAll('[data-works-chip]').forEach((chip) => {
      chip.addEventListener('click', async () => {
        const text = chip.getAttribute('data-works-chip') || '';
        if (worksAiInput) worksAiInput.value = text;
        await runWorksInlineAi(text);
      });
    });

    if (worksForm) {
      worksForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const editId = document.getElementById('works-edit-id').value;
        const type = document.getElementById('works-type').value || 'web';
        const eyebrow = document.getElementById('works-eyebrow').value.trim() || (type === 'video' ? 'MEMORIAL & PROMOTION VIDEO' : 'WEB DESIGN & FULL-STACK DEV');
        const badge = document.getElementById('works-badge').value.trim() || '企画・制作担当';
        const title = document.getElementById('works-title').value.trim();
        const meta1 = document.getElementById('works-meta1').value.trim() || '⏱ 制作領域: 企画・デザイン・制作';
        const meta2 = document.getElementById('works-meta2').value.trim() || '🛠 技術構成: フルカスタム制作';
        const desc = document.getElementById('works-desc').value.trim();
        const quote = document.getElementById('works-quote').value.trim();

        if (!title || !desc) {
          showToast('実績タイトルと詳細解説を入力してください（上のAIライターで自動作成もできます！）', 'error');
          return;
        }

        const itemObj = {
          id: editId || ('work-' + Date.now()),
          type,
          eyebrow,
          title,
          badge,
          meta1,
          meta2,
          desc,
          quote
        };

        if (editId) {
          const idx = worksList.findIndex((w) => w.id === editId);
          if (idx !== -1) worksList[idx] = itemObj;
          showToast('制作実績カードを更新しました！', 'success');
        } else {
          worksList.push(itemObj);
          showToast('新しい制作実績カードを追加しました！', 'success');
        }

        await saveWorksData();
        renderVisualWorksCards();
        resetWorksForm();
        if (worksEditorBox) worksEditorBox.style.display = 'none';
      });
    }
  }

  async function runWorksInlineAi(nuance) {
    const listEl = document.getElementById('works-ai-proposals-list');
    if (!listEl) return;
    listEl.style.display = 'grid';
    listEl.innerHTML = '<div style="grid-column: 1/-1; color: var(--color-accent); font-weight:700;">🤖 AIが制作実績カードを3パターン作成中...</div>';

    const proposals = await requestAiProposals('works', nuance);
    listEl.innerHTML = '';

    proposals.forEach((prop) => {
      const card = document.createElement('div');
      card.className = 'ai-proposal-card';
      card.innerHTML = `
        <span class="ai-prop-badge">${escapeHtml(prop.badge)}</span>
        <div class="ai-prop-title">${escapeHtml(prop.title || '')}</div>
        <div class="ai-prop-body">${escapeHtml(prop.body || '')}</div>
        <button type="button" class="btn-use-proposal">この実績カードを使う ✓</button>
      `;

      card.querySelector('.btn-use-proposal').addEventListener('click', () => {
        document.getElementById('works-type').value = prop.type || 'web';
        document.getElementById('works-eyebrow').value = prop.eyebrow || '';
        document.getElementById('works-badge').value = prop.work_badge || '';
        document.getElementById('works-title').value = prop.title || '';
        document.getElementById('works-meta1').value = prop.meta1 || '';
        document.getElementById('works-meta2').value = prop.meta2 || '';
        document.getElementById('works-desc').value = prop.body || '';
        document.getElementById('works-quote').value = prop.quote || '';
        showToast('全7項目を自動入力しました！「💾 この制作実績カードを保存する」で追加できます', 'success');
      });

      listEl.appendChild(card);
    });
  }

  function renderVisualWorksCards() {
    const grid = document.getElementById('vmap-works-cards-grid');
    if (!grid) return;
    grid.innerHTML = '';

    worksList.forEach((w, idx) => {
      const card = document.createElement('article');
      const cardTypeClass = w.type === 'video' ? 'work-card-video' : 'work-card-web';
      card.className = `work-card ${cardTypeClass}`;

      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div class="work-type-eyebrow" style="margin-bottom:0;">${escapeHtml(w.eyebrow || '')}</div>
          <span class="group-pill pill-visible" style="font-size:0.72rem;">WORKS ${idx + 1}枚目</span>
        </div>
        <header class="work-header">
          <h3 class="work-title">${escapeHtml(w.title || '')}</h3>
          <span class="work-badge">${escapeHtml(w.badge || '')}</span>
        </header>
        <div class="work-meta">
          <span>${escapeHtml(w.meta1 || '')}</span>
          <span>${escapeHtml(w.meta2 || '')}</span>
        </div>
        <p class="work-desc">${escapeHtml(w.desc || '').replace(/\n/g, '<br>')}</p>
        ${w.quote ? `<blockquote class="work-quote">${escapeHtml(w.quote)}</blockquote>` : ''}
        <div class="vmap-news-actions-bar" style="margin-top:16px;padding:12px 0 0;">
          <button type="button" class="btn-action-edit btn-work-edit" style="flex:1;">✨ AIで書き直し・編集する</button>
          <button type="button" class="btn-action-delete btn-work-del">削除</button>
        </div>
      `;

      card.querySelector('.btn-work-edit').addEventListener('click', () => {
        const worksEditorBox = document.getElementById('vmap-works-editor-box');
        document.getElementById('works-edit-id').value = w.id;
        document.getElementById('works-type').value = w.type || 'web';
        document.getElementById('works-eyebrow').value = w.eyebrow || '';
        document.getElementById('works-badge').value = w.badge || '';
        document.getElementById('works-title').value = w.title || '';
        document.getElementById('works-meta1').value = w.meta1 || '';
        document.getElementById('works-meta2').value = w.meta2 || '';
        document.getElementById('works-desc').value = w.desc || '';
        document.getElementById('works-quote').value = w.quote || '';
        document.getElementById('works-form-mode-title').textContent = `制作実績「${w.title}」を編集`;
        document.getElementById('works-submit-text').textContent = '💾 変更を保存する';
        if (worksEditorBox) {
          worksEditorBox.style.display = 'block';
          worksEditorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

      card.querySelector('.btn-work-del').addEventListener('click', async () => {
        if (!window.confirm(`制作実績「${w.title}」を削除しますか？`)) return;
        worksList = worksList.filter((item) => item.id !== w.id);
        await saveWorksData();
        renderVisualWorksCards();
        showToast('制作実績カードを削除しました', 'success');
      });

      grid.appendChild(card);
    });
  }

  function resetWorksForm() {
    const formEl = document.getElementById('works-form');
    if (formEl) formEl.reset();
    const idEl = document.getElementById('works-edit-id');
    if (idEl) idEl.value = '';
    const titleEl = document.getElementById('works-form-mode-title');
    if (titleEl) titleEl.textContent = '新しい制作実績カードを作成';
    const subEl = document.getElementById('works-submit-text');
    if (subEl) subEl.textContent = '💾 この制作実績カードを保存する';
    const propList = document.getElementById('works-ai-proposals-list');
    if (propList) {
      propList.style.display = 'none';
      propList.innerHTML = '';
    }
  }

  async function saveWorksData() {
    localStorage.setItem(LS_WORKS_KEY, JSON.stringify(worksList));
    if (isServerOnline) {
      try {
        await fetch(API_WORKS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(worksList)
        });
      } catch (e) {}
    }
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
