/**
 * DAICHI SHIMAHARA #33 - Official Profile & Portfolio
 * Client Scripts (Navigation, Header, Accessibility)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initActiveNavObserver();
  loadDynamicNews();
  initWnbaTabs();
  initWnbaTeamSpotlight();
  initInsightAccordions();
  initEstimateCalculator();
});

/**
 * Adds shadow/styling to header on scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * Mobile Drawer Menu toggle with keyboard & accessibility support
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  if (!toggleBtn || !drawer) return;

  const toggleMenu = (forceClose = false) => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    const nextState = forceClose ? false : !isExpanded;

    toggleBtn.setAttribute('aria-expanded', String(nextState));
    drawer.classList.toggle('is-open', nextState);
    document.body.style.overflow = nextState ? 'hidden' : '';
  };

  toggleBtn.addEventListener('click', () => toggleMenu());

  // Close when clicking nav links
  const links = drawer.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(true);
    });
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
      toggleMenu(true);
      toggleBtn.focus();
    }
  });

  // Close on resize if wider than tablet breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && toggleBtn.getAttribute('aria-expanded') === 'true') {
      toggleMenu(true);
    }
  }, { passive: true });
}

/**
 * Highlights active navigation link based on current scroll position
 */
function initActiveNavObserver() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-links a');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  if (!sections.length || (!desktopLinks.length && !mobileLinks.length)) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        setActiveLink(desktopLinks, id);
        setActiveLink(mobileLinks, id);
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  function setActiveLink(links, targetId) {
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${targetId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

/**
 * Loads dynamic news from API, data/news.json, or localStorage
 */
async function loadDynamicNews() {
  const newsGrid = document.querySelector('.news-grid');
  if (!newsGrid) return;

  let items = null;

  // 1. Try fetching from /api/news or data/news.json
  try {
    const res = await fetch('/api/news', { cache: 'no-store' });
    if (res.ok) {
      items = await res.json();
    }
  } catch (e) {
    try {
      const jsonRes = await fetch('data/news.json', { cache: 'no-store' });
      if (jsonRes.ok) {
        items = await jsonRes.json();
      }
    } catch (err) {}
  }

  // 2. Fallback to localStorage if available
  if (!items) {
    const saved = localStorage.getItem('ds_portfolio_news_data');
    if (saved) {
      try {
        items = JSON.parse(saved);
      } catch (e) {}
    }
  }

  // If we have items and it is a non-empty array, render them
  if (items && Array.isArray(items) && items.length > 0) {
    renderNewsCards(newsGrid, items);
  }
}

function renderNewsCards(container, items) {
  // Only display up to 6 items on the front page
  const displayItems = items.slice(0, 6);

  container.innerHTML = displayItems.map(item => {
    const cat = escapeHtml(item.category || 'INFO');
    const badgeClass = escapeHtml(item.badgeClass || 'badge-game');
    const date = escapeHtml(item.date || '');
    const rawTitle = item.title || '';
    const title = escapeHtml(rawTitle).replace(/\n/g, '<br>');
    const desc = escapeHtml(item.desc || '');
    const image = escapeHtml(item.image || 'images/IMG_8532.jpg');
    const isoDate = date.replace(/\./g, '-');

    const linkStart = (item.category === 'SPECIAL') ? '<a href="#wnba" style="display:contents;color:inherit;text-decoration:none;">' : '';
    const linkEnd = (item.category === 'SPECIAL') ? '</a>' : '';

    return `
      <article class="news-card">
        ${linkStart}
        <div class="news-card-img-wrap">
          <img src="${image}" alt="${escapeHtml(rawTitle.replace(/\n/g, ' '))}" loading="lazy" decoding="async">
          <span class="news-badge ${badgeClass}">${cat}</span>
        </div>
        <div class="news-card-body">
          <time class="news-date" datetime="${isoDate}">${date}</time>
          <h3 class="news-title">${title}</h3>
          <p class="news-desc">${desc}</p>
        </div>
        ${linkEnd}
      </article>
    `;
  }).join('');
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

/**
 * Interactive WNBA Special Tabs with keyboard & ARIA accessibility
 */
function initWnbaTabs() {
  const tabNav = document.querySelector('.wnba-tab-nav');
  if (!tabNav) return;

  const tabButtons = tabNav.querySelectorAll('.wnba-tab-btn');
  const panels = document.querySelectorAll('.wnba-tab-panel');

  if (!tabButtons.length || !panels.length) return;

  tabButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      switchTab(btn);
    });

    // Keyboard navigation (ArrowLeft / ArrowRight)
    btn.addEventListener('keydown', (e) => {
      let targetIndex = null;
      if (e.key === 'ArrowRight') {
        targetIndex = (index + 1) % tabButtons.length;
      } else if (e.key === 'ArrowLeft') {
        targetIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      }

      if (targetIndex !== null) {
        e.preventDefault();
        tabButtons[targetIndex].focus();
        switchTab(tabButtons[targetIndex]);
      }
    });
  });

  function switchTab(selectedBtn) {
    const targetTab = selectedBtn.getAttribute('data-tab');
    if (!targetTab) return;

    // Update buttons
    tabButtons.forEach(btn => {
      const isSelected = btn === selectedBtn;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', String(isSelected));
    });

    // Update panels
    panels.forEach(panel => {
      const isTarget = panel.id === `wnba-tab-${targetTab}`;
      if (isTarget) {
        panel.classList.add('active');
        panel.removeAttribute('hidden');
      } else {
        panel.classList.remove('active');
        panel.setAttribute('hidden', '');
      }
    });
  }
}

/**
 * Interactive WNBA 15 Teams Featured Player Spotlight
 */
function initWnbaTeamSpotlight() {
  const pills = document.querySelectorAll('.wnba-team-pill[data-team]');
  const spotlight = document.getElementById('wnbaTeamSpotlight');
  if (!pills.length || !spotlight) return;

  const logoWrap = document.getElementById('spotlightLogoWrap');
  const confEl = document.getElementById('spotlightConf');
  const teamEnEl = document.getElementById('spotlightTeamEn');
  const teamJpEl = document.getElementById('spotlightTeamJp');
  const posEl = document.getElementById('spotlightPlayerPos');
  const tagEl = document.getElementById('spotlightPlayerTag');
  const playerJpEl = document.getElementById('spotlightPlayerJp');
  const playerEnEl = document.getElementById('spotlightPlayerEn');
  const descEl = document.getElementById('spotlightPlayerDesc');
  const closeBtn = document.getElementById('spotlightCloseBtn');

  const teamData = {
    GSV: {
      conf: 'WESTERN CONFERENCE // 2026 CHAMPIONS',
      teamEn: 'GOLDEN STATE VALKYRIES',
      teamJp: 'ゴールデンステイト・ヴァルキリーズ',
      logo: 'images/valkyries_logo.png',
      playerJp: 'ギャビー・ウィリアムズ #1',
      playerEn: 'Gabby Williams (#1)',
      pos: 'F / 180cm',
      tag: '2026 FINALS MVP',
      desc: '創設2年目のヴァルキリーズを球団史上初のWNBA制覇へ導いた2026ファイナルMVP。驚異の身体能力とスティール力で攻守を支配する万能エース。（共演：ケイラ・ソーントン（#5）、ティファニー・ヘイズ（#15）、ヴェロニカ・バートン（#22））'
    },
    ATL: {
      conf: 'EASTERN CONFERENCE // 2026 FINALIST',
      teamEn: 'ATLANTA DREAM',
      teamJp: 'アトランタ・ドリーム',
      logo: 'images/dream_logo.png',
      playerJp: 'ライアン・ハワード #10',
      playerEn: 'Rhyne Howard (#10)',
      pos: 'G-F / 188cm',
      tag: 'FRANCHISE SCORER',
      desc: '2026年シーズン30勝14敗の快進撃でファイナル進出を果たしたドリームの絶対的エース。今季加入したエンジェル・リース（#5）やアリシャ・グレイ（#15）と共に東西頂上決戦第7戦までの死闘を演じた。'
    },
    TOR: {
      conf: 'EASTERN CONFERENCE // 2026 EXPANSION',
      teamEn: 'TORONTO TEMPO',
      teamJp: 'トロント・テンポ',
      logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/tor.png',
      playerJp: 'マリーナ・メイブリー #3',
      playerEn: 'Marina Mabrey (#3)',
      pos: 'G / 180cm',
      tag: 'INAUGURAL ACE SCORER',
      desc: '2026年拡張ドラフトで新設トロントへ電撃加入した初代エース。カナダ代表キア・ナース（#11）やブリトニー・サイクス（#20）、ニャラ・サバリー（#8）らと共にカナダ初のWNBAフランチャイズを牽引する。'
    },
    POR: {
      conf: 'WESTERN CONFERENCE // 2026 EXPANSION',
      teamEn: 'PORTLAND FIRE',
      teamJp: 'ポートランド・ファイア',
      logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/por.png',
      playerJp: 'ブリジット・カールトン #6',
      playerEn: 'Bridget Carleton (#6)',
      pos: 'F / 185cm',
      tag: 'EXPANSION #1 PICK',
      desc: '2026年拡張ドラフト全体1位指名でポートランドの初代フランチャイズプレイヤーに就任。超高確率の3Pシュートと戦術理解度で、カルラ・レイテ（#0）やエミリー・エングストラー（#21）ら新天地ロスターを束ねる。'
    },
    NYL: {
      conf: 'EASTERN CONFERENCE',
      teamEn: 'NEW YORK LIBERTY',
      teamJp: 'ニューヨーク・リバティ',
      logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/ny.png',
      playerJp: 'サブリナ・イオネスク #20',
      playerEn: 'Sabrina Ionescu (#20)',
      pos: 'G / 180cm',
      tag: '2026 CUP CHAMPION',
      desc: '2026年も契約延長でニューヨークの顔として君臨し、今季コミッショナーズカップ制覇を達成。ブレアナ・スチュワート（#30）、ジョンケル・ジョーンズ（#35）との「ビッグ3」で圧倒的な攻撃力を誇る。'
    },
    MIN: {
      conf: 'WESTERN CONFERENCE',
      teamEn: 'MINNESOTA LYNX',
      teamJp: 'ミネソタ・リンクス',
      logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/min.png',
      playerJp: 'ナフィーサ・コリアー #24',
      playerEn: 'Napheesa Collier (#24)',
      pos: 'F / 185cm',
      tag: '2-WAY SUPERSTAR',
      desc: '2026年レギュラーシーズンでリーグトップクラスの33勝11敗を記録したリンクスの絶対的支柱。ケイラ・マクブライド（#21）やコートニー・ウィリアムズ（#10）と共に華麗なフットワークと鉄壁の守備で攻守を完遂する。'
    },
    LVA: {
      conf: 'WESTERN CONFERENCE',
      teamEn: 'LAS VEGAS ACES',
      teamJp: 'ラスベガス・エーシズ',
      logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/lv.png',
      playerJp: 'エイジャ・ウィルソン #22',
      playerEn: "A'ja Wilson (#22)",
      pos: 'C-F / 193cm',
      tag: 'FRANCHISE QUEEN',
      desc: '2026年シーズンも31勝13敗の強豪エーシズを牽引する現代WNBA最強のセンター。チェルシー・グレイ（#12）やジャッキー・ヤング（#0）とのコンビネーションと無双のミドルジャンパーで君臨する。'
    },
    IND: {
      conf: 'EASTERN CONFERENCE',
      teamEn: 'INDIANA FEVER',
      teamJp: 'インディアナ・フィーバー',
      logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/ind.png',
      playerJp: 'ケイトリン・クラーク #22',
      playerEn: 'Caitlin Clark (#22)',
      pos: 'G / 183cm',
      tag: 'GENERATIONAL PLAYMAKER',
      desc: 'プロ3年目の2026年シーズンもアリヤ・ボストン（#7）、ケルシー・ミッチェル（#0）と共に28勝16敗の快進撃を演出。ロゴ付近からの超長距離3Pと高速パスで全米の観客動員記録を塗り替え続ける。'
    },
    SEA: {
      conf: 'WESTERN CONFERENCE',
      teamEn: 'SEATTLE STORM',
      teamJp: 'シアトル・ストーム',
      logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/sea.png',
      playerJp: 'フロージェ・ジョンソン #4',
      playerEn: "Flau'jae Johnson (#4)",
      pos: 'G / 178cm',
      tag: '2026 SCORING LEADER',
      desc: '2026年シーズン、新体制となったシアトルでチーム得点王として躍動する新世代スターガード。フランスの超大型若手ドミニク・マロンガ（#14）やエジ・マグベゴー（#13）と共に新時代のストームを牽引する。'
    },
    CON: {
      conf: 'EASTERN CONFERENCE',
      teamEn: 'CONNECTICUT SUN',
      teamJp: 'コネチカット・サン',
      logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/conn.png',
      playerJp: 'ブリトニー・グライナー #42',
      playerEn: 'Brittney Griner (#42)',
      pos: 'C / 206cm',
      tag: 'DOMINANT PAINT FORCE',
      desc: '206cmの規格外のサイズとウイングスパンでペイントエリアに君臨する絶対的センター。圧倒的なリムプロテクトとダンクも叩き込むインサイドの決定力で、ダイアモンド・ミラー（#1）やアリヤ・エドワーズ（#3）ら若手陣を牽引する。'
    },
    PHX: {
      conf: 'WESTERN CONFERENCE',
      teamEn: 'PHOENIX MERCURY',
      teamJp: 'フェニックス・マーキュリー',
      logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/phx.png',
      playerJp: 'アリッサ・トーマス #25',
      playerEn: 'Alyssa Thomas (#25)',
      pos: 'F / 188cm',
      tag: 'TRIPLE-DOUBLE ENGINE',
      desc: 'トリプルダブルを量産する「ザ・エンジン」。2026年ロスターではカリア・クーパー（#2）、ケルシー・プラム（#0）と超攻撃的布陣を形成し、フィジカルと視野の広さでゲームを組み立てる。'
    },
    CHI: {
      conf: 'EASTERN CONFERENCE',
      teamEn: 'CHICAGO SKY',
      teamJp: 'シカゴ・スカイ',
      logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/chi.png',
      playerJp: 'カミラ・カルドーゾ #10',
      playerEn: 'Kamilla Cardoso (#10)',
      pos: 'C / 201cm',
      tag: '201CM PAINT TOWER',
      desc: '201cmの圧倒的な高さを誇る2026年シカゴの大黒柱。今季はベテラン司令塔スカイラー・ディギンズ（#4）やナターシャ・クラウド（#9）、コートニー・ヴァンダースルート（#22）ら実力派ガード陣からのパスを受けゴール下を制圧する。'
    },
    LAS: {
      conf: 'WESTERN CONFERENCE',
      teamEn: 'LOS ANGELES SPARKS',
      teamJp: 'ロサンゼルス・スパークス',
      logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/la.png',
      playerJp: 'ネカ・オグミケ #30',
      playerEn: 'Nneka Ogwumike (#30)',
      pos: 'F / 188cm',
      tag: 'FRANCHISE LEGEND // FINAL SEASON',
      desc: 'かつてMVPと王座をロサンゼルスにもたらし、今シーズン限りでの現役引退を迎えた偉大なるレジェンド。卓越したフットワークとリーダーシップで、ディアリカ・ハンビー（#5）やアリエル・アトキンス（#7）らに魂を託しラストイヤーを駆け抜けた。'
    },
    WAS: {
      conf: 'EASTERN CONFERENCE',
      teamEn: 'WASHINGTON MYSTICS',
      teamJp: 'ワシントン・ミスティクス',
      logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/wsh.png',
      playerJp: 'キキ・イリアフェン #44',
      playerEn: 'Kiki Iriafen (#44)',
      pos: 'F / 191cm',
      tag: 'RISING FRONTCOURT STAR',
      desc: '2026年シーズンに東地区2位（28勝16敗）へと大躍進したワシントンの若き主軸。201cmの新星ローレン・ベッツ（#51）やシャキーラ・オースティン（#0）、ソニア・シトロン（#22）と共にリーグ屈指の若手フロントコートを形成。'
    },
    DAL: {
      conf: 'WESTERN CONFERENCE',
      teamEn: 'DALLAS WINGS',
      teamJp: 'ダラス・ウィングス',
      logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/dal.png',
      playerJp: 'ペイジ・ベッカーズ #5',
      playerEn: 'Paige Bueckers (#5)',
      pos: 'G / 183cm',
      tag: 'FRANCHISE #1 SCORER',
      desc: '2026年シーズンにチーム得点王としてダラスを27勝17敗のプレーオフ進出へ導いた天才ガード。大学時代の盟友アジ・ファッド（#35）やアリケ・オグンボワレ（#24）と共にリーグ最強クラスのバックコート陣を牽引する。'
    }
  };

  let activeTeamCode = null;

  const closeSpotlight = () => {
    activeTeamCode = null;
    spotlight.setAttribute('hidden', '');
    pills.forEach(p => {
      p.classList.remove('is-selected');
      p.setAttribute('aria-expanded', 'false');
    });
  };

  const selectTeam = (code, pillEl) => {
    if (activeTeamCode === code && !spotlight.hasAttribute('hidden')) {
      closeSpotlight();
      return;
    }

    const data = teamData[code];
    if (!data) return;

    activeTeamCode = code;

    pills.forEach(p => {
      const isMatch = p === pillEl;
      p.classList.toggle('is-selected', isMatch);
      p.setAttribute('aria-expanded', String(isMatch));
    });

    const pillLogo = pillEl ? pillEl.querySelector('.team-pill-logo-wrap') : null;
    if (logoWrap && pillLogo) {
      logoWrap.innerHTML = pillLogo.innerHTML;
    }
    if (confEl) confEl.textContent = data.conf;
    if (teamEnEl) teamEnEl.textContent = data.teamEn;
    if (teamJpEl) teamJpEl.textContent = data.teamJp;
    if (posEl) posEl.textContent = data.pos;
    if (tagEl) tagEl.textContent = data.tag;
    if (playerJpEl) playerJpEl.textContent = data.playerJp;
    if (playerEnEl) playerEnEl.textContent = data.playerEn;
    if (descEl) descEl.textContent = data.desc;

    spotlight.removeAttribute('hidden');
    // Retrigger pop animation
    spotlight.style.animation = 'none';
    void spotlight.offsetWidth;
    spotlight.style.animation = '';
  };

  pills.forEach(pill => {
    const code = pill.getAttribute('data-team');
    pill.addEventListener('click', () => selectTeam(code, pill));
    pill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectTeam(code, pill);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSpotlight);
  }
}

/**
 * Expandable Accordions for #33 Player Insight Cards
 */
function initInsightAccordions() {
  const cards = document.querySelectorAll('.insight-card.expandable');
  if (!cards.length) return;

  cards.forEach(card => {
    const toggle = () => {
      const isOpen = card.classList.toggle('is-open');
      card.setAttribute('aria-expanded', String(isOpen));

      const toggleText = card.querySelector('.toggle-text');
      if (toggleText) {
        toggleText.textContent = isOpen ? '閉じる' : '詳しく見る';
      }

      const ballPrompt = card.querySelector('.ball-click-prompt');
      if (ballPrompt) {
        ballPrompt.textContent = isOpen ? 'タップして折りたたむ ▲' : 'ボールをタップして解説を展開';
      }
    };

    card.addEventListener('click', () => {
      toggle();
    });

    // Keyboard support: Enter / Space toggles card
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}

/**
 * Interactive Estimate Sheet & Inquiry Form System
 */
function initEstimateCalculator() {
  const form = document.getElementById('estimateContactForm');
  if (!form) return;

  // Set today's date
  const dateEl = document.getElementById('quotationDate');
  if (dateEl) {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    dateEl.textContent = `${y}.${m}.${d}`;
  }

  // Tab switching
  const tabBtns = document.querySelectorAll('.estimate-tab-btn');
  const panels = document.querySelectorAll('.category-panel');
  const categoryTag = document.getElementById('quotationCategory');
  const speedBlock = document.getElementById('blockDeliverySpeed');
  let currentCategory = 'web';

  const categoryLabels = {
    web: 'WEB DEVELOPMENT // Webサイト制作',
    movie: 'VIDEO CREATIVE // プロモーション動画',
    team: 'BASKETBALL // 練習のお誘い・チーム連携'
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      if (!cat || cat === currentCategory) return;
      currentCategory = cat;

      tabBtns.forEach(b => {
        const isCurrent = b === btn;
        b.classList.toggle('active', isCurrent);
        b.setAttribute('aria-selected', String(isCurrent));
      });

      panels.forEach(p => {
        const match = p.getAttribute('data-panel') === cat;
        p.classList.toggle('active', match);
        if (match) {
          p.removeAttribute('hidden');
        } else {
          p.setAttribute('hidden', '');
        }
      });

      if (categoryTag) {
        categoryTag.textContent = categoryLabels[cat] || cat;
      }

      // Hide delivery speed for team collaboration
      if (speedBlock) {
        speedBlock.style.display = (cat === 'team') ? 'none' : 'block';
      }

      updateQuotation();
    });
  });

  // Client Name Sync
  const nameInput = document.getElementById('senderName');
  const orgInput = document.getElementById('senderOrg');
  const clientEl = document.getElementById('quotationClient');

  const updateClientName = () => {
    if (!clientEl) return;
    const name = nameInput ? nameInput.value.trim() : '';
    const org = orgInput ? orgInput.value.trim() : '';
    if (org && name) {
      clientEl.textContent = `${org} ${name} 様`;
    } else if (org) {
      clientEl.textContent = `${org} 御中`;
    } else if (name) {
      clientEl.textContent = `${name} 様`;
    } else {
      clientEl.textContent = 'お客様';
    }
  };

  if (nameInput) nameInput.addEventListener('input', updateClientName);
  if (orgInput) orgInput.addEventListener('input', updateClientName);

  // Form input changes trigger recalculation
  form.addEventListener('change', updateQuotation);
  if (form) {
    form.addEventListener('input', (e) => {
      if (e.target.id === 'teamName' || e.target.id === 'teamLocation') {
        updateQuotation();
      }
    });
  }

  // Helper format currency
  const formatYen = (num) => '¥' + num.toLocaleString('ja-JP');

  // Spec Sheet Calculation & Dynamic Update (No Price Figures)
  function updateQuotation() {
    const itemsTbody = document.getElementById('quotationItems');
    if (!itemsTbody) return;

    itemsTbody.innerHTML = '';
    const itemsList = [];

    if (currentCategory === 'web') {
      // Plan
      const checkedPlan = form.querySelector('input[name="web_plan"]:checked');
      if (checkedPlan) {
        const title = checkedPlan.getAttribute('data-title');
        const spec = checkedPlan.getAttribute('data-spec') || '基本構成';
        itemsList.push({ name: title, status: spec, badge: '基本プラン' });
      }

      // Options
      const checkedOpts = form.querySelectorAll('input[name="web_options"]:checked');
      checkedOpts.forEach(opt => {
        const title = opt.getAttribute('data-title');
        const spec = opt.getAttribute('data-spec') || '標準装備';
        const isStandard = opt.value === 'responsive';
        itemsList.push({ 
          name: title, 
          status: isStandard ? '標準対応' : '希望する', 
          badge: isStandard ? '標準仕様' : '追加機能' 
        });
      });

      // Speed
      const speedSelect = document.getElementById('deliverySpeed');
      if (speedSelect) {
        const selectedOpt = speedSelect.options[speedSelect.selectedIndex];
        const spec = selectedOpt.getAttribute('data-spec') || selectedOpt.text;
        itemsList.push({ name: '希望進行スケジュール', status: spec, badge: '納期・時期' });
      }

    } else if (currentCategory === 'movie') {
      // Plan
      const checkedPlan = form.querySelector('input[name="movie_plan"]:checked');
      if (checkedPlan) {
        const title = checkedPlan.getAttribute('data-title');
        const spec = checkedPlan.getAttribute('data-spec') || '動画制作';
        itemsList.push({ name: title, status: spec, badge: '基本スタイル' });
      }

      // Options
      const checkedOpts = form.querySelectorAll('input[name="movie_options"]:checked');
      checkedOpts.forEach(opt => {
        const title = opt.getAttribute('data-title');
        const spec = opt.getAttribute('data-spec') || '希望する';
        itemsList.push({ name: title, status: spec, badge: '撮影・演出' });
      });

      // Speed
      const speedSelect = document.getElementById('deliverySpeed');
      if (speedSelect) {
        const selectedOpt = speedSelect.options[speedSelect.selectedIndex];
        const spec = selectedOpt.getAttribute('data-spec') || selectedOpt.text;
        itemsList.push({ name: '希望納品スケジュール', status: spec, badge: '納期・時期' });
      }

    } else if (currentCategory === 'team') {
      // Team Plan
      const checkedPlan = form.querySelector('input[name="team_plan"]:checked');
      if (checkedPlan) {
        const title = checkedPlan.getAttribute('data-title');
        const spec = checkedPlan.getAttribute('data-spec') || '連携希望';
        itemsList.push({ name: title, status: spec, badge: '活動スタイル' });
      }

      // Team Options (複数選択可)
      const checkedOpts = form.querySelectorAll('input[name="team_options"]:checked');
      checkedOpts.forEach(opt => {
        const title = opt.getAttribute('data-title');
        const spec = opt.getAttribute('data-spec') || '希望する';
        itemsList.push({ name: title, status: spec, badge: '参加・連携' });
      });

      const teamName = document.getElementById('teamName')?.value.trim();
      const teamLocation = document.getElementById('teamLocation')?.value.trim();
      if (teamName || teamLocation) {
        const desc = [teamName, teamLocation].filter(Boolean).join(' / ');
        itemsList.push({ name: 'チーム名・活動拠点', status: desc, badge: 'チーム情報' });
      }
    }

    // Render Table Rows
    itemsList.forEach(item => {
      const tr = document.createElement('tr');
      const tdName = document.createElement('td');
      tdName.innerHTML = `
        <div class="item-name-cell">
          <span>${item.name}</span>
          <span class="item-badge-pill">[${item.badge}]</span>
        </div>
      `;

      const tdStatus = document.createElement('td');
      tdStatus.className = 'text-right';
      tdStatus.innerHTML = `<span style="color:var(--color-accent); font-weight:700; font-size:0.82rem;">${item.status}</span>`;

      tr.appendChild(tdName);
      tr.appendChild(tdStatus);
      itemsTbody.appendChild(tr);
    });
  }

  // Initial calculation
  updateQuotation();

  // Copy Request Specification to Clipboard
  const copyBtn = document.getElementById('copyEstimateBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const client = clientEl ? clientEl.textContent : 'お客様';
      const category = categoryLabels[currentCategory] || '';
      const name = nameInput?.value.trim() || '未記入';
      const org = orgInput?.value.trim() || '未記入';
      const email = document.getElementById('senderEmail')?.value.trim() || '未記入';
      const sns = document.getElementById('senderSns')?.value.trim() || '未記入';
      const msg = document.getElementById('senderMessage')?.value.trim() || '特になし';

      const itemsText = Array.from(document.querySelectorAll('#quotationItems tr'))
        .map(tr => {
          const name = tr.querySelector('.item-name-cell span:first-child')?.textContent.trim();
          const status = tr.querySelector('td.text-right')?.textContent.trim();
          return `・${name} → 【${status}】`;
        })
        .join('\n');

      const fullText = `【島原大智 ポートフォリオ ご相談・構成仕様書】
宛名: ${client}
ご相談種別: ${category}
----------------------------------------
■ ご希望要件・構成内容:
${itemsText}
----------------------------------------
■ お問い合わせ者情報:
お名前: ${name}
貴社・チーム名: ${org}
メールアドレス: ${email}
連絡先/SNS: ${sns}

■ ご相談・メッセージ詳細:
${msg}
----------------------------------------
※お見積もりや日程の詳細は、ヒアリングの上で個別にご案内いたします。`;

      navigator.clipboard.writeText(fullText).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#10B981" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span style="color:#10B981;">コピー完了！</span>
        `;
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2200);
      }).catch(() => {
        alert('クリップボードへのコピーに失敗しました。');
      });
    });
  }

  // Smooth Scroll to Standalone Contact Form
  const scrollToFormBtn = document.getElementById('scrollToFormBtn');
  if (scrollToFormBtn) {
    scrollToFormBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('contactFormBox');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          if (nameInput) nameInput.focus();
        }, 600);
      }
    });
  }

  // Submit and Modal
  const submitBtn = document.getElementById('submitEstimateBtn');
  const modal = document.getElementById('estimateModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDoneBtn = document.getElementById('modalDoneBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalSummary = document.getElementById('modalQuoteSummary');
  const mailtoBackupBtn = document.getElementById('mailtoBackupBtn');

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    }
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Simple Validation
      const name = nameInput?.value.trim();
      const emailInput = document.getElementById('senderEmail');
      const email = emailInput?.value.trim();

      if (!name) {
        alert('「お名前」を入力してください。');
        nameInput?.focus();
        return;
      }

      if (!email || !email.includes('@')) {
        alert('有効な「メールアドレス」を入力してください。');
        emailInput?.focus();
        return;
      }

      const category = categoryLabels[currentCategory] || '';
      const org = orgInput?.value.trim() || '個人';
      const msg = document.getElementById('senderMessage')?.value.trim() || 'なし';

      // Build summary for modal
      if (modalSummary) {
        modalSummary.innerHTML = `
          <div style="margin-bottom:6px;"><strong>ご相談種別:</strong> ${category}</div>
          <div style="margin-bottom:6px;"><strong>お名前:</strong> ${name} 様（${org}）</div>
          <div style="margin-bottom:6px;"><strong>ご連絡先:</strong> ${email}</div>
          <div style="margin-top:10px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.1); color:var(--color-accent); font-weight:700;">
            ✓ 要件・構成仕様書の送信を受け付けました（個別お見積もり対応）
          </div>
        `;
      }

      // Configure mailto backup link
      if (mailtoBackupBtn) {
        const mailSubject = encodeURIComponent(`【お問い合わせ】${category}について (${name}様)`);
        const mailBody = encodeURIComponent(`島原 大智 様

ポートフォリオサイトより、下記内容にてご相談・お見積もり依頼を送信いたします。

■ ご相談種別: ${category}
■ お名前: ${name} 様
■ 貴社・チーム名: ${org}
■ メールアドレス: ${email}

■ ご相談詳細:
${msg}
`);
        mailtoBackupBtn.href = `mailto:ds2084.contact@gmail.com?subject=${mailSubject}&body=${mailBody}`;
      }

      // Open Modal
      if (modal) {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
      }
    });
  }
}


