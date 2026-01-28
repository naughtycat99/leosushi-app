// Global variable to store menu data from API
let MENU_DATA_FROM_API = null;
let MENU_CATEGORIES_FROM_API = null;

// Expose to window for other scripts
if (typeof window !== 'undefined') {
  window.MENU_DATA_FROM_API = MENU_DATA_FROM_API;
  window.loadMenuFromAPI = loadMenuFromAPI;
}

// Load menu from database API
async function loadMenuFromAPI() {
  try {
    // Check if window.api is available
    if (typeof window === 'undefined' || !window.api || !window.api.menu) {
      console.warn('⚠️ window.api.menu not available, skipping menu load');
      return null;
    }

    console.log('🔄 Loading menu from database...');

    // Load categories
    const categoriesResponse = await window.api.menu.getCategories();
    if (categoriesResponse && categoriesResponse.success) {
      MENU_CATEGORIES_FROM_API = categoriesResponse.data || [];
      console.log('✅ Loaded categories:', MENU_CATEGORIES_FROM_API.length);
    } else {
      console.error('❌ Failed to load categories:', categoriesResponse?.message || 'Unknown error');
      MENU_CATEGORIES_FROM_API = [];
    }

    // Load all menu items
    const itemsResponse = await window.api.menu.getMenuItems();
    if (itemsResponse && itemsResponse.success) {
      const items = itemsResponse.data || [];
      console.log('✅ Loaded menu items:', items.length);

      // Transform database format to MENU_DATA format
      MENU_DATA_FROM_API = transformMenuDataFromDB(items, MENU_CATEGORIES_FROM_API);
      console.log('✅ Transformed menu data:', MENU_DATA_FROM_API.length, 'categories');

      // Update window reference
      if (typeof window !== 'undefined') {
        window.MENU_DATA_FROM_API = MENU_DATA_FROM_API;
      }

      return MENU_DATA_FROM_API;
    } else {
      console.error('❌ Failed to load menu items:', itemsResponse?.message || 'Unknown error');
      return null;
    }
  } catch (error) {
    console.error('❌ Error loading menu from API:', error);
    return null;
  }
}

// Transform database format to MENU_DATA format
function transformMenuDataFromDB(items, categories) {
  // Group items by category
  const categoryMap = {};

  // Initialize categories
  categories.forEach(cat => {
    categoryMap[cat.category_id] = {
      id: cat.category_id.toLowerCase().replace(/\s+/g, '-'),
      title: cat.name,
      items: []
    };
  });

  // Add items to categories (only available items for customer view)
  items.forEach(item => {
    // Only include available items (available = 1 or NULL means available)
    const isAvailable = item.available === 1 || item.available === null || item.available === undefined;
    if (isAvailable && item.category_id && categoryMap[item.category_id]) {
      const transformedItem = {
        name: item.name,
        desc: item.description || '',
        descEn: item.description_en || '',
        price: item.price ? parseFloat(item.price).toFixed(2).replace('.', ',') : '0,00',
        vegetarian: item.vegetarian === 1 || item.vegetarian === true,
        spicy: item.spicy === 1 || item.spicy === true,
        quantity: item.quantity || '',
        allergens: item.allergens || '',
        hasOptions: item.has_options === 1 || item.has_options === true,
        options: item.options || []
      };

      categoryMap[item.category_id].items.push(transformedItem);
    }
  });

  // Convert to array and filter out empty categories
  return Object.values(categoryMap).filter(cat => cat.items.length > 0);
}

// Menu Module
async function renderMenuTabs() {
  const tabs = document.getElementById('menuTabs');
  if (!tabs) return;

  // Load menu from API if not already loaded
  if (!MENU_DATA_FROM_API) {
    await loadMenuFromAPI();
  }

  // Use API data if available, otherwise fallback to static MENU_DATA
  const menuData = MENU_DATA_FROM_API || (typeof MENU_DATA !== 'undefined' ? MENU_DATA : []);

  if (menuData.length === 0) {
    console.warn('⚠️ No menu data available');
    return;
  }

  menuData.forEach((cat, idx) => {
    const chip = document.createElement('button');
    chip.className = 'chip' + (idx === 0 ? ' active' : '');
    chip.textContent = cat.title;
    chip.dataset.target = cat.id;
    chip.addEventListener('click', () => {
      document.querySelectorAll('.menu-tabs .chip').forEach(el => el.classList.remove('active'));
      chip.classList.add('active');
      renderMenuList(cat.id, document.getElementById('menuSearch')?.value || '');
      // Smooth scroll to top of menu section
      requestAnimationFrame(() => {
        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    tabs.appendChild(chip);
  });
}

// Helper function to get item image based on category
function getItemImage(categoryId, itemName) {
  // Map category to default images - using new high-quality images
  const CAT_IMAGES = {
    vorspeisen: 'assets/477094040_943569787952278_5086544566261599514_n.jpg',
    salate: 'assets/salat_mit_garnelen_88520.jpg',
    suppen: 'assets/2325542.png',
    hauptspeisen: 'assets/474747577_583620977982257_5069519367255368765_n.jpg',
    teriyaki: 'assets/Image_Teriyaki-Tuna-Tataki-Flatbread_Teriyaki-Sauce_RT_SV_BKP_092921-5.jpg',
    pokebowl: 'assets/sake-poke-bowl-with-rice-or-salad.png',
    maki: 'assets/banh-mi-shushi.png',
    nigiri: 'assets/526755952_122145800660617493_8652643431098218812_n.jpg',
    insideout: 'assets/678a39d1596da842cc63c03c 1.png',
    sashimi: 'assets/498665275_17863755624399871_7773501872179564451_n 1.png',
    crunchy: 'assets/10 3498178 1.png',
    bigrolls: 'assets/bua-tiec-shushi.png',
    minirolls: 'assets/vegan-crunchiy-california-rolls-with-tofu-08c0ea7eeb121ea89055bbc92a83a9bd 1.png',
    specialrolls: 'assets/close-up-sushi-served-table 1.png',
    firenigiri: 'assets/107321305_156996452705031_5135397567937722939_n.jpg',
    temaki: 'assets/dsc06551_master.jpg',
    sushimenu: 'assets/bua-tiec-shushi.png',
    dessert: 'assets/474145891_579480641729624_2668845756094693673_n.jpg',
    beilagen: 'assets/524354655_17842903512542764_6403983830540063508_n11 1.png'
  };
  return CAT_IMAGES[categoryId] || 'assets/close-up-sushi-served-table 1.png';
}

function createCategory(cat, query, shouldOpen = false) {
  const details = document.createElement('details');
  details.className = 'menu-category';
  details.id = cat.id;
  if (shouldOpen) details.open = true;
  const summary = document.createElement('summary');
  const filtered = cat.items.filter(i => (i.name + ' ' + i.desc).toLowerCase().includes(query.toLowerCase()));
  if (filtered.length === 0) return null;

  const CAT_BG = {
    vorspeisen: 'assets/477094040_943569787952278_5086544566261599514_n.jpg',
    salate: 'assets/salat_mit_garnelen_88520.jpg',
    suppen: 'assets/2325542.png',
    hauptspeisen: 'assets/474747577_583620977982257_5069519367255368765_n.jpg',
    teriyaki: 'assets/Image_Teriyaki-Tuna-Tataki-Flatbread_Teriyaki-Sauce_RT_SV_BKP_092921-5.jpg',
    pokebowl: 'assets/sake-poke-bowl-with-rice-or-salad.png',
    maki: 'assets/banh-mi-shushi.png',
    nigiri: 'assets/526755952_122145800660617493_8652643431098218812_n.jpg',
    insideout: 'assets/678a39d1596da842cc63c03c 1.png',
    sashimi: 'assets/498665275_17863755624399871_7773501872179564451_n 1.png',
    crunchy: 'assets/10 3498178 1.png',
    bigrolls: 'assets/bua-tiec-shushi.png',
    minirolls: 'assets/vegan-crunchiy-california-rolls-with-tofu-08c0ea7eeb121ea89055bbc92a83a9bd 1.png',
    specialrolls: 'assets/close-up-sushi-served-table 1.png',
    firenigiri: 'assets/107321305_156996452705031_5135397567937722939_n.jpg',
    temaki: 'assets/dsc06551_master.jpg',
    sushimenu: 'assets/bua-tiec-shushi.png',
    dessert: 'assets/474145891_579480641729624_2668845756094693673_n.jpg',
    beilagen: 'assets/524354655_17842903512542764_6403983830540063508_n11 1.png'
  };
  const bg = CAT_BG[cat.id];
  if (bg) {
    details.style.setProperty('--summary-bg', `url("${bg}")`);
  }
  summary.innerHTML = `<span>${cat.title}</span><span class="meta"><span>${filtered.length}</span><span class="chev">▾</span></span>`;

  const wrap = document.createElement('div');
  wrap.className = 'menu-items-grid';
  if (cat.categoryDesc) {
    const descDiv = document.createElement('div');
    descDiv.className = 'category-description';
    descDiv.textContent = cat.categoryDesc;
    descDiv.style.gridColumn = '1 / -1';
    wrap.appendChild(descDiv);
  }
  filtered.forEach((i) => {
    const card = document.createElement('div');
    card.className = 'menu-item-card';

    const itemImage = getItemImage(cat.id, i.name);

    card.innerHTML = `
      <div class="menu-item-image-wrapper">
        <img class="menu-item-image" src="${itemImage}" alt="${i.name}" loading="lazy" onerror="this.onerror=null; this.style.display='none'; const fallback = this.parentElement.querySelector('.menu-item-image-fallback'); if(fallback) fallback.style.display='flex';">
        <div class="menu-item-image-fallback" style="display:none; align-items:center; justify-content:center; font-size:32px; color:var(--muted); width:100%; height:100%;">🍣</div>
      </div>
      <div class="menu-item-info">
        <div class="menu-item-name">${i.name}</div>
        <div class="menu-item-desc">${i.desc}</div>
      </div>
      <div class="menu-item-actions">
        <div class="menu-item-price">€${i.price}</div>
        <button class="menu-item-add-btn" data-name="${escapeHtml(i.name)}" data-price="${i.price}" data-desc="${escapeHtml(i.desc || '')}">
          <span>+</span>
          <span>In den Warenkorb</span>
        </button>
      </div>
    `;

    const addBtn = card.querySelector('.menu-item-add-btn');
    const handleAddClick = (e) => {
      e.stopPropagation();
      window.openAddToCartModal(i.name, i.price, i.desc || '');
    };

    if (addBtn) {
      addBtn.addEventListener('click', handleAddClick);
    }

    card.addEventListener('click', (e) => {
      if (e.target !== addBtn && !addBtn.contains(e.target)) {
        handleAddClick(e);
      }
    });

    wrap.appendChild(card);
  });
  details.appendChild(summary);
  details.appendChild(wrap);
  return details;
}

async function renderMenuList(activeId, query = '') {
  const list = document.getElementById('menuList');
  if (!list) return;
  list.innerHTML = '';

  if (!activeId) return;

  // Load menu from API if not already loaded
  if (!MENU_DATA_FROM_API) {
    await loadMenuFromAPI();
  }

  // Use API data if available, otherwise fallback to static MENU_DATA
  const menuData = MENU_DATA_FROM_API || (typeof MENU_DATA !== 'undefined' ? MENU_DATA : []);
  const cats = menuData.filter(c => c.id === activeId);

  cats.forEach((cat) => {
    const el = createCategory(cat, query, true);
    if (el) list.appendChild(el);
  });
}

function setupMenuSearch() {
  const input = document.getElementById('menuSearch');
  if (!input) return;
  input.addEventListener('input', (e) => {
    const query = e.target.value;
    const active = document.querySelector('.menu-tabs .chip.active');
    const activeId = active?.dataset.target;
    if (activeId) renderMenuList(activeId, query);
  });
}

function setupGallery() {
  const scroller = document.getElementById('galleryScroller');
  if (!scroller) return;

  const images = [
    { src: "assets/close-up-sushi-served-table 1.png", alt: "Sushi Auswahl" },
    { src: "assets/bua-tiec-shushi.png", alt: "Sushi Teller" },
    { src: "assets/474747577_583620977982257_5069519367255368765_n.jpg", alt: "Warme Speise" },
    { src: "assets/498665275_17863755624399871_7773501872179564451_n 1.png", alt: "Set Menu" },
    { src: "assets/526755952_122145800660617493_8652643431098218812_n.jpg", alt: "Detail 1" },
    { src: "assets/107321305_156996452705031_5135397567937722939_n.jpg", alt: "Detail 2" },
    { src: "assets/Image_Teriyaki-Tuna-Tataki-Flatbread_Teriyaki-Sauce_RT_SV_BKP_092921-5.jpg", alt: "Signature Roll" },
    { src: "assets/banh-mi-shushi.png", alt: "Nigiri" },
    { src: "assets/sake-poke-bowl-with-rice-or-salad.png", alt: "Poke Bowl" },
    { src: "assets/474145891_579480641729624_2668845756094693673_n.jpg", alt: "Dessert" },
    { src: "assets/678a39d1596da842cc63c03c 1.png", alt: "Ambiente 1" },
    { src: "assets/dsc06551_master.jpg", alt: "Ambiente 2" },
    { src: "assets/10 3498178 1.png", alt: "Ambiente 3" },
    { src: "assets/477094040_943569787952278_5086544566261599514_n.jpg", alt: "Chef Special" },
    { src: "assets/salat_mit_garnelen_88520.jpg", alt: "Platte" }
  ];

  const track = document.createElement('div');
  track.className = 'gallery-track';

  [...images, ...images].forEach(imgData => {
    const img = document.createElement('img');
    img.src = imgData.src;
    img.alt = imgData.alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    track.appendChild(img);
  });
  scroller.appendChild(track);

  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightImg');
  const btnClose = document.getElementById('lightboxClose');
  const btnPrev = document.getElementById('lightboxPrev');
  const btnNext = document.getElementById('lightboxNext');
  let currentIdx = 0;

  function open(idx) {
    currentIdx = idx % images.length;
    if (lbImg && images[currentIdx]) {
      lbImg.src = images[currentIdx].src;
      lbImg.alt = images[currentIdx].alt;
      lb?.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function close() {
    lb?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function next() {
    currentIdx = (currentIdx + 1) % images.length;
    if (lbImg && images[currentIdx]) {
      lbImg.src = images[currentIdx].src;
      lbImg.alt = images[currentIdx].alt;
    }
  }

  function prev() {
    currentIdx = (currentIdx - 1 + images.length) % images.length;
    if (lbImg && images[currentIdx]) {
      lbImg.src = images[currentIdx].src;
      lbImg.alt = images[currentIdx].alt;
    }
  }

  track.querySelectorAll('img').forEach((img, idx) => {
    const originalIdx = idx % images.length;
    img.addEventListener('click', () => open(originalIdx));
  });

  btnClose?.addEventListener('click', close);
  btnNext?.addEventListener('click', next);
  btnPrev?.addEventListener('click', prev);
  lb?.addEventListener('click', (e) => { if (e.target === lb) close(); });

  window.addEventListener('keydown', (e) => {
    if (lb?.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
}

function setupReviews() {
  const container = document.getElementById('reviewsContainer');
  if (!container) return;

  if (typeof GOOGLE_PLACES_CONFIG !== 'undefined' && GOOGLE_PLACES_CONFIG.useAPI && GOOGLE_PLACES_CONFIG.apiKey && GOOGLE_PLACES_CONFIG.placeId) {
    fetchGoogleReviews();
  } else {
    if (typeof FALLBACK_REVIEWS !== 'undefined') {
      renderReviews(FALLBACK_REVIEWS);
    }
  }
}

async function fetchGoogleReviews() {
  const container = document.getElementById('reviewsContainer');
  if (!container) return;

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACES_CONFIG.placeId}&fields=reviews&key=${GOOGLE_PLACES_CONFIG.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.result.reviews) {
      const reviews = data.result.reviews.slice(0, 3);
      renderReviews(reviews);
    } else {
      console.error('Google Places API error:', data.status);
      if (typeof FALLBACK_REVIEWS !== 'undefined') {
        renderReviews(FALLBACK_REVIEWS);
      }
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    if (typeof FALLBACK_REVIEWS !== 'undefined') {
      renderReviews(FALLBACK_REVIEWS);
    }
  }
}

function renderReviews(reviews) {
  const container = document.getElementById('reviewsContainer');
  if (!container) return;

  container.innerHTML = '';
  const reviewsToShow = reviews.slice(0, 3);

  reviewsToShow.forEach((review, index) => {
    const card = document.createElement('blockquote');
    card.className = 'review-card';
    card.style.opacity = '0';
    card.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;

    const authorInitial = review.author_name ? review.author_name.charAt(0).toUpperCase() : '?';
    const stars = '⭐'.repeat(review.rating || 5);
    const reviewText = review.text || review.review || '';

    card.innerHTML = `
      <div class="quote-icon">"</div>
      <div class="review-stars">${stars}</div>
      <p class="review-text">${reviewText}</p>
      <div class="review-author">
        <div class="author-avatar">${authorInitial}</div>
        <div>
          <strong>${review.author_name || 'Anonym'}</strong>
          <span>Google Review</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  if (!document.getElementById('reviewFadeInStyle')) {
    const style = document.createElement('style');
    style.id = 'reviewFadeInStyle';
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

function setupAnimations() {
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    for (let i = 0; i < 15; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle decorative-element';
      sparkle.style.left = Math.random() * 100 + '%';
      sparkle.style.top = Math.random() * 100 + '%';
      sparkle.style.animationDelay = Math.random() * 3 + 's';
      heroSection.appendChild(sparkle);
    }

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle decorative-element';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 5 + 's';
      heroSection.appendChild(particle);
    }
  }

  const menuSection = document.querySelector('.menu-section');
  if (menuSection) {
    const butterflyEmojis = ['🦋', '🦋', '🦋', '🦋', '🦋'];
    butterflyEmojis.forEach((emoji, index) => {
      const butterfly = document.createElement('div');
      butterfly.className = 'butterfly decorative-element';
      butterfly.textContent = emoji;
      butterfly.style.top = (20 + index * 15) + '%';
      menuSection.style.position = 'relative';
      menuSection.appendChild(butterfly);
    });
  }

  const gallerySection = document.querySelector('.gallery');
  if (gallerySection) {
    const leafEmojis = ['🍃', '🍂', '🌿', '🍃'];
    leafEmojis.forEach((emoji, index) => {
      const leaf = document.createElement('div');
      leaf.className = 'leaf decorative-element';
      leaf.textContent = emoji;
      gallerySection.style.position = 'relative';
      gallerySection.style.overflow = 'hidden';
      gallerySection.appendChild(leaf);
    });
  }

  const aboutSection = document.querySelector('.about');
  if (aboutSection) {
    for (let i = 0; i < 3; i++) {
      const wave = document.createElement('div');
      wave.className = 'wave decorative-element';
      wave.style.left = (30 + i * 20) + '%';
      wave.style.top = '50%';
      aboutSection.style.position = 'relative';
      aboutSection.appendChild(wave);
    }

    const flowerEmojis = ['🌸', '🌺', '🌼'];
    flowerEmojis.forEach((emoji, index) => {
      const flower = document.createElement('div');
      flower.className = 'flower decorative-element';
      flower.textContent = emoji;
      flower.style.top = (30 + index * 20) + '%';
      aboutSection.appendChild(flower);
    });
  }

  const reviewsSection = document.querySelector('.reviews');
  if (reviewsSection) {
    for (let i = 0; i < 12; i++) {
      const star = document.createElement('div');
      star.className = 'star decorative-element';
      star.textContent = '⭐';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 3 + 's';
      reviewsSection.style.position = 'relative';
      reviewsSection.appendChild(star);
    }
  }

  const contactSection = document.querySelector('.contact');
  if (contactSection) {
    for (let i = 0; i < 3; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble decorative-element';
      contactSection.style.position = 'relative';
      contactSection.style.overflow = 'hidden';
      contactSection.appendChild(bubble);
    }
  }
}

function setupIntroScreen() {
  const introScreen = document.getElementById('introScreen');
  if (!introScreen) {
    setupPageLoadAnimations();
    return;
  }

  document.body.style.visibility = 'visible';
  document.body.style.opacity = '1';
  document.body.style.display = 'block';
  document.body.style.overflow = 'hidden';

  const allContent = document.querySelectorAll('header, main, section, .site-header, .menu-order-page');
  allContent.forEach(el => {
    if (el) {
      el.style.visibility = 'visible';
      el.style.opacity = '1';
      el.style.display = '';
    }
  });

  setTimeout(() => {
    introScreen.classList.add('hidden');
    setTimeout(() => {
      introScreen.style.display = 'none';
      introScreen.style.visibility = 'hidden';
      introScreen.style.pointerEvents = 'none';
      introScreen.style.opacity = '0';
      introScreen.style.zIndex = '-1';

      document.body.style.overflow = '';
      document.body.style.overflowX = 'hidden';

      document.body.style.visibility = 'visible';
      document.body.style.opacity = '1';
      document.body.style.display = 'block';

      allContent.forEach(el => {
        if (el) {
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          el.style.display = '';
          el.style.zIndex = '';
        }
      });

      try {
        introScreen.remove();
      } catch (e) {
        console.log('Could not remove intro screen:', e);
      }

      setupPageLoadAnimations();
      console.log('Intro screen hidden, page should be visible now');
    }, 800);
  }, 2500);
}

function setupPageLoadAnimations() {
  const isIndexPage = !window.location.pathname.includes('menu') && !window.location.pathname.includes('catalog');
  const isMenuPage = window.location.pathname.includes('menu') || window.location.pathname.includes('catalog');

  if (isIndexPage) {
    const header = document.querySelector('.site-header');
    const heroSection = document.querySelector('.hero-luxe');
    const heroTitle = document.querySelector('.hero-title-luxe');
    const heroDescription = document.querySelector('.hero-description-luxe');
    const heroActions = document.querySelector('.hero-actions');
    const heroStats = document.querySelectorAll('.hero-stat-card');
    const sections = document.querySelectorAll('section:not(.hero-luxe)');

    if (header) {
      header.classList.add('page-load-animate', 'animate-fade-in-down');
    }

    if (heroSection) {
      heroSection.classList.add('page-load-animate', 'animate-fade-in');
    }

    if (heroTitle) {
      heroTitle.classList.add('page-load-animate', 'animate-fade-in-up', 'animate-delay-1');
    }
    if (heroDescription) {
      heroDescription.classList.add('page-load-animate', 'animate-fade-in-up', 'animate-delay-2');
    }
    if (heroActions) {
      heroActions.classList.add('page-load-animate', 'animate-fade-in-up', 'animate-delay-3');
    }

    heroStats.forEach((stat, index) => {
      stat.classList.add('page-load-animate', 'animate-scale-in', `animate-delay-${Math.min(index + 4, 8)}`);
    });

    sections.forEach((section, index) => {
      section.classList.add('page-load-animate', 'animate-fade-in-up', `animate-delay-${Math.min(index + 1, 8)}`);
    });
  }

  if (isMenuPage) {
    const header = document.querySelector('.site-header');
    const menuOrderPage = document.querySelector('.menu-order-page');
    const menuHero = document.querySelector('.menu-order-hero');
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    const heroMetaCards = document.querySelectorAll('.hero-meta-card');
    const heroCard = document.querySelector('.hero-card');
    const menuTabsSidebar = document.querySelector('.menu-tabs-sidebar');
    const menuContent = document.querySelector('.menu-content');

    if (header) {
      header.classList.add('page-load-animate', 'animate-fade-in-down');
    }

    if (menuOrderPage) {
      menuOrderPage.classList.add('page-load-animate', 'animate-fade-in');
    }

    if (menuHero) {
      menuHero.classList.add('page-load-animate', 'animate-fade-in', 'animate-delay-1');
    }

    if (heroTitle) {
      heroTitle.classList.add('page-load-animate', 'animate-fade-in-up', 'animate-delay-2');
    }
    if (heroDescription) {
      heroDescription.classList.add('page-load-animate', 'animate-fade-in-up', 'animate-delay-3');
    }

    heroMetaCards.forEach((card, index) => {
      card.classList.add('page-load-animate', 'animate-scale-in', `animate-delay-${Math.min(index + 4, 8)}`);
    });

    if (heroCard) {
      heroCard.classList.add('page-load-animate', 'animate-slide-in-right', 'animate-delay-5');
    }

    if (menuTabsSidebar) {
      menuTabsSidebar.classList.add('page-load-animate', 'animate-slide-in-left', 'animate-delay-1');
    }

    if (menuContent) {
      menuContent.classList.add('page-load-animate', 'animate-fade-in-up', 'animate-delay-2');
    }
  }
}

// Menu Book and Menu Order Page Functions
let currentBookPage = 0;
let bookPages = [];

function createWelcomePage1() {
  return `
    <div class="welcome-main-frame">
      <div class="welcome-logo-section">
        <div class="welcome-logo-circle">
          <img src="assets/logo.png" alt="Leo Sushi">
        </div>
        <div class="welcome-logo-text">Leo Sushi</div>
      </div>
      <div class="welcome-title-section">
        <h1 class="welcome-title-line">Welcome to</h1>
        <h1 class="welcome-title-line">Leo Sushi</h1>
      </div>
      <div class="welcome-intro-section">
        <p>Tauchen Sie ein in eine andere Welt, in der Frische und Tradition großgeschrieben werden. Erleben Sie inmitten Marktplatz für Ihre Geschmacksknospen!</p>
        <p>Lassen Sie den Alltag in Leo Sushi hinter sich und entdecken Sie die kulinarische Vielfalt Asiens</p>
      </div>
      <p class="welcome-notice">WIR WÜNSCHEN IHNEN EINEN WUNDERBAREN AUFENTHALT IM Leo Sushi FÜR ALLERGEN ÜBERSICHT | FRAGEN SIE BITTE DAS PERSONAL!</p>
      <div class="welcome-section">
        <h2 class="welcome-section-title">Allergene:</h2>
        <div class="welcome-list-two-columns">
          <div class="welcome-list-column">
            <div class="welcome-list-item">A - Glutenhaltiges Getreide</div>
            <div class="welcome-list-item">B - Krebstiere und daraus gewonnene Erzeugnisse</div>
            <div class="welcome-list-item">C - Eier und daraus gewonnene Erzeugnisse</div>
            <div class="welcome-list-item">D - Fische und daraus gewonnene Erzeugnisse</div>
            <div class="welcome-list-item">E - Erdnüsse und daraus gewonnene Erzeugnisse</div>
            <div class="welcome-list-item">F - Soja(bohnen) und daraus gewonnene Erzeugnisse</div>
            <div class="welcome-list-item">G - Milch und daraus gewonnene Erzeugnisse</div>
          </div>
          <div class="welcome-list-column">
            <div class="welcome-list-item">H - Schalenfrüchte</div>
            <div class="welcome-list-item">I - Sellerie und daraus gewonnene Erzeugnisse</div>
            <div class="welcome-list-item">J - Senf und daraus gewonnene Erzeugnisse</div>
            <div class="welcome-list-item">K - Sesamsamen und daraus gewonnene Erzeugnisse</div>
            <div class="welcome-list-item">L - Schwefeldioxid und Sulphite</div>
            <div class="welcome-list-item">M - Lupinen und daraus gewonnene Erzeugnisse</div>
            <div class="welcome-list-item">N - Weichtiere und daraus gewonnene Erzeugnisse</div>
          </div>
        </div>
      </div>
      <div class="welcome-section">
        <h2 class="welcome-section-title">Zusatzstoffe:</h2>
        <div class="welcome-list-two-columns">
          <div class="welcome-list-column">
            <div class="welcome-list-item">1. Farbstoff</div>
            <div class="welcome-list-item">2. Konservierungsstoff</div>
            <div class="welcome-list-item">3. Antioxidationsmittel</div>
            <div class="welcome-list-item">4. Geschmacksverstärker</div>
            <div class="welcome-list-item">5. geschwefelt</div>
            <div class="welcome-list-item">6. geschwärzt</div>
            <div class="welcome-list-item">7. Phosphat</div>
          </div>
          <div class="welcome-list-column">
            <div class="welcome-list-item">8. Milcheiweiß (bei Fleischerzeugnissen)</div>
            <div class="welcome-list-item">9. koffeinhaltig</div>
            <div class="welcome-list-item">10. chininhaltig</div>
            <div class="welcome-list-item">11. Süßungsmittel</div>
            <div class="welcome-list-item">13. gewachst</div>
          </div>
        </div>
      </div>
      <p class="welcome-disclaimer">Alle Preisangaben sind in EUR, inkl. MwSt. Irrtümer sowie Wort- und Ausdrucksfehler vorbehalten, Alle Angaben ohne Gewähr! Bilder dienen nur zur Dekoration und sind der Abbildung ähnlich</p>
    </div>
  `;
}

function createWelcomePage2() {
  return `
    <div class="welcome-page-content">
      <div class="welcome-decorative-line">
        <div class="decorative-diamond"></div>
        <div class="decorative-line"></div>
        <div class="decorative-diamond"></div>
      </div>
      <div class="welcome-content-section">
        <h2 class="welcome-section-title">Allergene:</h2>
        <div class="welcome-grid-list">
          <div class="welcome-list-item"><strong>A</strong> - Glutenhaltiges Getreide</div>
          <div class="welcome-list-item"><strong>B</strong> - Krebstiere und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>C</strong> - Eier und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>D</strong> - Fische und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>E</strong> - Erdnüsse und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>F</strong> - Soja(bohnen) und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>G</strong> - Milch und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>H</strong> - Schalenfrüchte</div>
          <div class="welcome-list-item"><strong>I</strong> - Sellerie und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>J</strong> - Senf und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>K</strong> - Sesamsamen und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>L</strong> - Schwefeldioxid und Sulphite</div>
          <div class="welcome-list-item"><strong>M</strong> - Lupinen und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>N</strong> - Weichtiere und daraus gewonnene Erzeugnisse</div>
        </div>
      </div>
    </div>
  `;
}

function createWelcomePage3() {
  return `
    <div class="welcome-page-content">
      <div class="welcome-content-section">
        <h2 class="welcome-section-title">Zusatzstoffe:</h2>
        <div class="welcome-grid-list">
          <div class="welcome-list-item"><strong>1.</strong> Farbstoff</div>
          <div class="welcome-list-item"><strong>2.</strong> Konservierungsstoff</div>
          <div class="welcome-list-item"><strong>3.</strong> Antioxidationsmittel</div>
          <div class="welcome-list-item"><strong>4.</strong> Geschmacksverstärker</div>
          <div class="welcome-list-item"><strong>5.</strong> geschwefelt</div>
          <div class="welcome-list-item"><strong>6.</strong> geschwärzt</div>
          <div class="welcome-list-item"><strong>7.</strong> Phosphat</div>
          <div class="welcome-list-item"><strong>8.</strong> Milcheiweiß (bei Fleischerzeugnissen)</div>
          <div class="welcome-list-item"><strong>9.</strong> koffeinhaltig</div>
          <div class="welcome-list-item"><strong>10.</strong> chininhaltig</div>
          <div class="welcome-list-item"><strong>11.</strong> Süßungsmittel</div>
          <div class="welcome-list-item"><strong>13.</strong> gewachst</div>
        </div>
      </div>
      <div class="welcome-decorative-line">
        <div class="decorative-diamond"></div>
        <div class="decorative-line"></div>
        <div class="decorative-diamond"></div>
      </div>
      <p class="welcome-disclaimer">Alle Preisangaben sind in EUR, inkl. MwSt. Irrtümer sowie Wort- und Ausdrucksfehler vorbehalten, Alle Angaben ohne Gewähr! Bilder dienen nur zur Dekoration und sind der Abbildung ähnlich</p>
    </div>
  `;
}

async function createBookPages() {
  const maxItemsPerPage = 7;
  const allPages = [];

  // Load menu from API if not already loaded
  if (!MENU_DATA_FROM_API) {
    await loadMenuFromAPI();
  }

  // Use API data if available, otherwise fallback to static MENU_DATA
  const menuData = MENU_DATA_FROM_API || (typeof MENU_DATA !== 'undefined' ? MENU_DATA : []);
  menuData.forEach(category => {
    const items = category.items || [];
    if (items.length === 0) return;

    for (let i = 0; i < items.length; i += maxItemsPerPage) {
      const chunk = items.slice(i, i + maxItemsPerPage);
      const pageNumber = Math.floor(i / maxItemsPerPage) + 1;
      const totalPages = Math.ceil(items.length / maxItemsPerPage);

      const pageData = {
        title: category.title,
        categoryDesc: category.categoryDesc,
        items: chunk,
        isPartial: items.length > maxItemsPerPage,
        pageNumber: pageNumber,
        totalPages: totalPages
      };

      allPages.push(pageData);
    }
  });

  bookPages = [];

  const welcomePage1 = { title: 'Welcome', isWelcome: true, content: createWelcomePage1() };
  const welcomePage2 = { title: 'Allergene', isWelcome: true, content: createWelcomePage2() };
  const welcomePage3 = { title: 'Zusatzstoffe', isWelcome: true, content: createWelcomePage3() };
  bookPages.push([welcomePage1]);
  bookPages.push([welcomePage2]);
  bookPages.push([welcomePage3]);

  allPages.forEach(page => {
    bookPages.push([page]);
  });

  renderBookPages();
}

function renderBookPages() {
  const book = document.getElementById('menuBook');
  const totalPagesEl = document.getElementById('totalPages');

  if (!book) return;

  book.innerHTML = '';
  totalPagesEl.textContent = bookPages.length;

  bookPages.forEach((pageArray, pageIndex) => {
    const page = document.createElement('div');
    page.className = 'book-page single-page';
    page.dataset.pageIndex = pageIndex;

    if (pageArray[0] && pageArray[0].isWelcome) {
      page.innerHTML = `<div class="book-page-content-wrapper">${pageArray[0].content}</div>`;
    } else if (pageArray[0]) {
      const pageContent = createBookPageContent(pageArray[0], pageIndex + 1, false);
      page.innerHTML = pageContent ? `<div class="book-page-content-wrapper">${pageContent}</div>` : '';
    }
    book.appendChild(page);
  });

  updateBookDisplay();
}

function createBookPageContent(pageData, pageNumber, isLeftPage) {
  if (!pageData) return '';

  const title = pageData.isPartial && pageData.totalPages > 1
    ? `${escapeHtml(pageData.title)} (${pageData.pageNumber}/${pageData.totalPages})`
    : escapeHtml(pageData.title);

  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
      <h2 style="margin:0;flex:1;">${title}</h2>
      <div style="font-size:14px;color:var(--muted);font-weight:600;opacity:0.7;">${pageNumber}</div>
    </div>
    ${pageData.categoryDesc && pageData.pageNumber === 1 ? `<p style="color:var(--muted);margin-bottom:20px;font-style:italic;line-height:1.6;">${escapeHtml(pageData.categoryDesc)}</p>` : ''}
    <div class="book-page-content">
      ${pageData.items.map(item => `
        <div class="book-menu-item" onclick="window.openAddToCartModal('${item.name.replace(/'/g, "\\'")}', '${item.price}', '${(item.desc || '').replace(/'/g, "\\'")}')">
          <div style="display:flex;justify-content:space-between;align-items:start;gap:16px;">
            <div style="flex:1;">
              <div style="font-weight:700;font-size:16px;color:#fff;margin-bottom:6px;">${escapeHtml(item.name)}</div>
              <div style="color:var(--muted);font-size:14px;line-height:1.5;">${escapeHtml(item.desc || '')}</div>
            </div>
            <div style="text-align:right;flex-shrink:0;">
              <div style="font-size:18px;font-weight:700;color:var(--gold);margin-bottom:8px;">€${item.price}</div>
              <button style="background:linear-gradient(135deg,var(--gold),var(--gold-2));color:#1a1a1a;border:none;border-radius:8px;padding:8px 16px;font-weight:700;cursor:pointer;font-size:13px;transition:all .3s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">+</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function openMenuBook() {
  const overlay = document.getElementById('menuBookOverlay');
  if (!overlay) return;

  createBookPages();
  currentBookPage = 0;
  updateBookDisplay();

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenuBook() {
  const overlay = document.getElementById('menuBookOverlay');
  if (!overlay) return;

  overlay.classList.remove('active');
  document.body.style.overflow = '';

  // Ensure fixed order button is visible after closing menu book
  const allFixedOrderBtns = document.querySelectorAll('.fixed-order-btn, #fixedOrderBtn');
  const isApp = document.body.classList.contains('is-capacitor-app');

  allFixedOrderBtns.forEach(btn => {
    if (btn) {
      // REMOVED app-specific hiding to support standard mobile web UI
      /*
      if (isApp) {
        // Hide on App
        btn.style.setProperty('display', 'none', 'important');
        btn.style.setProperty('visibility', 'hidden', 'important');
        btn.style.setProperty('opacity', '0', 'important');
        btn.style.setProperty('pointer-events', 'none', 'important');
      } else */ if (!document.body.classList.contains('cart-open')) {
        btn.classList.add('force-show');
        const isMobile = window.innerWidth <= 720;
        btn.style.setProperty('display', 'flex', 'important');
        btn.style.setProperty('visibility', 'visible', 'important');
        btn.style.setProperty('opacity', '1', 'important');
        btn.style.setProperty('position', 'fixed', 'important');
        btn.style.setProperty('right', isMobile ? '12px' : '20px', 'important');
        btn.style.setProperty('bottom', isMobile ? '16px' : '20px', 'important');
        btn.style.setProperty('z-index', '99999', 'important');
        btn.style.setProperty('pointer-events', 'auto', 'important');
        btn.style.setProperty('transform', 'none', 'important');
      }
    }
  });
}

function nextBookPage() {
  if (currentBookPage < bookPages.length - 1) {
    currentBookPage++;
    updateBookDisplay();
  }
}

function prevBookPage() {
  if (currentBookPage > 0) {
    currentBookPage--;
    updateBookDisplay();
  }
}

function updateBookDisplay() {
  const book = document.getElementById('menuBook');
  const currentPageEl = document.getElementById('currentPage');
  const prevBtn = document.getElementById('bookPrevBtn');
  const nextBtn = document.getElementById('bookNextBtn');

  if (!book || !currentPageEl) return;

  currentPageEl.textContent = currentBookPage + 1;

  if (prevBtn) prevBtn.disabled = currentBookPage === 0;
  if (nextBtn) nextBtn.disabled = currentBookPage >= bookPages.length - 1;

  const pages = book.querySelectorAll('.book-page');
  pages.forEach((page) => {
    const pageIndex = parseInt(page.dataset.pageIndex) || 0;

    if (pageIndex === currentBookPage) {
      page.style.opacity = '1';
      page.style.pointerEvents = 'auto';
      page.style.zIndex = '2';
      page.style.display = 'flex';
    } else {
      page.style.opacity = '0';
      page.style.pointerEvents = 'none';
      page.style.zIndex = '1';
      page.style.display = 'none';
    }
  });
}

// Menu Order Page Functions
let currentCategory = null;
let allMenuItemsFlat = [];

function openMenuOrderPage() {
  const menuOrderPage = document.getElementById('menuOrderPage');
  if (!menuOrderPage) return;

  initMenuOrderPage();

  menuOrderPage.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenuOrderPage() {
  const menuOrderPage = document.getElementById('menuOrderPage');
  if (!menuOrderPage) return;

  menuOrderPage.classList.remove('active');
  document.body.style.overflow = '';

  // Ensure fixed order button is visible after closing menu order page
  const allFixedOrderBtns = document.querySelectorAll('.fixed-order-btn, #fixedOrderBtn');
  const isApp = document.body.classList.contains('is-capacitor-app');

  allFixedOrderBtns.forEach(btn => {
    if (btn) {
      // REMOVED app-specific hiding to support standard mobile web UI
      /*
      if (isApp) {
        // Hide on App
        btn.style.setProperty('display', 'none', 'important');
        btn.style.setProperty('visibility', 'hidden', 'important');
        btn.style.setProperty('opacity', '0', 'important');
        btn.style.setProperty('pointer-events', 'none', 'important');
      } else */ if (!document.body.classList.contains('cart-open')) {
        btn.classList.add('force-show');
        const isMobile = window.innerWidth <= 720;
        btn.style.setProperty('display', 'flex', 'important');
        btn.style.setProperty('visibility', 'visible', 'important');
        btn.style.setProperty('opacity', '1', 'important');
        btn.style.setProperty('position', 'fixed', 'important');
        btn.style.setProperty('right', isMobile ? '12px' : '20px', 'important');
        btn.style.setProperty('bottom', isMobile ? '16px' : '20px', 'important');
        btn.style.setProperty('z-index', '99999', 'important');
        btn.style.setProperty('pointer-events', 'auto', 'important');
        btn.style.setProperty('transform', 'none', 'important');
      }
    }
  });
}

async function initMenuOrderPage() {
  // Load menu from API if not already loaded
  if (!MENU_DATA_FROM_API) {
    await loadMenuFromAPI();
  }

  allMenuItemsFlat = [];
  // Use API data if available, otherwise fallback to static MENU_DATA
  const menuData = MENU_DATA_FROM_API || (typeof MENU_DATA !== 'undefined' ? MENU_DATA : []);
  menuData.forEach(category => {
    category.items.forEach(item => {
      allMenuItemsFlat.push({
        ...item,
        category: category.title,
        categoryDesc: category.categoryDesc
      });
    });
  });

  renderMenuTabsNavigation();
  setupWelcomeTabs();
}

function renderMenuTabsNavigation() {
  const container = document.getElementById('menuTabsContainer');
  if (!container) return;

  container.innerHTML = '';

  const welcomeTab = document.createElement('button');
  welcomeTab.className = 'menu-tab active';
  welcomeTab.id = 'tab-btn-welcome';
  welcomeTab.setAttribute('role', 'tab');
  welcomeTab.setAttribute('aria-selected', 'true');
  welcomeTab.setAttribute('aria-controls', 'tab-welcome');
  welcomeTab.dataset.tab = 'welcome';
  welcomeTab.innerHTML = '<span class="tab-icon">👋</span><span class="tab-label">Willkommen</span>';
  welcomeTab.addEventListener('click', () => switchTab('welcome'));
  container.appendChild(welcomeTab);

  // Use API data if available, otherwise fallback to static MENU_DATA
  const menuData = MENU_DATA_FROM_API || (typeof MENU_DATA !== 'undefined' ? MENU_DATA : []);
  menuData.forEach((category, index) => {
    const tab = document.createElement('button');
    tab.className = 'menu-tab';
    tab.id = `tab-btn-${category.id}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('aria-controls', 'tab-category');
    tab.dataset.tab = 'category';
    tab.dataset.category = category.title;
    const icon = getCategoryIcon(category.title);
    tab.innerHTML = `<span class="tab-icon">${icon}</span><span class="tab-label">${category.title}</span>`;
    tab.addEventListener('click', () => switchTab('category', category.title));
    container.appendChild(tab);
  });

  populateMobileDropdown();
}

function populateMobileDropdown() {
  const dropdown = document.getElementById('categorySelectMobile');
  if (!dropdown) return;

  dropdown.innerHTML = '<option value="">Kategorie wählen...</option>';

  const welcomeOption = document.createElement('option');
  welcomeOption.value = 'welcome';
  welcomeOption.textContent = '👋 Willkommen';
  dropdown.appendChild(welcomeOption);

  // Use API data if available, otherwise fallback to static MENU_DATA
  const menuData = MENU_DATA_FROM_API || (typeof MENU_DATA !== 'undefined' ? MENU_DATA : []);
  menuData.forEach(category => {
    const option = document.createElement('option');
    option.value = category.title;
    const icon = getCategoryIcon(category.title);
    option.textContent = `${icon} ${category.title}`;
    dropdown.appendChild(option);
  });

  dropdown.addEventListener('change', (e) => {
    const value = e.target.value;
    if (value === 'welcome') {
      switchTab('welcome');
    } else if (value) {
      switchTab('category', value);
    }
  });
}

function switchTab(tabType, categoryTitle = null) {
  const allTabs = document.querySelectorAll('.menu-tab');
  allTabs.forEach(tab => {
    tab.classList.remove('active');
    tab.setAttribute('aria-selected', 'false');
  });

  const dropdown = document.getElementById('categorySelectMobile');
  if (dropdown) {
    if (tabType === 'welcome') {
      dropdown.value = 'welcome';
    } else if (categoryTitle) {
      dropdown.value = categoryTitle;
    } else {
      dropdown.value = '';
    }
  }

  const allPanes = document.querySelectorAll('.tab-pane');
  allPanes.forEach(pane => pane.classList.remove('active'));

  const searchInput = document.getElementById('menuSearchInput');
  if (searchInput) {
    searchInput.value = '';
  }

  if (tabType === 'welcome') {
    const welcomeTab = document.getElementById('tab-btn-welcome');
    if (welcomeTab) {
      welcomeTab.classList.add('active');
      welcomeTab.setAttribute('aria-selected', 'true');
    }
    const welcomePane = document.getElementById('tab-welcome');
    if (welcomePane) {
      welcomePane.classList.add('active');
    }
    currentCategory = null;
  } else if (tabType === 'category' && categoryTitle) {
    const categoryTab = document.querySelector(`[data-category="${categoryTitle}"]`);
    if (categoryTab) {
      categoryTab.classList.add('active');
      categoryTab.setAttribute('aria-selected', 'true');
    }
    const categoryPane = document.getElementById('tab-category');
    if (categoryPane) {
      categoryPane.classList.add('active');
      currentCategory = categoryTitle;
      renderMenuItems(categoryTitle);
    }
  }
}

function setupWelcomeTabs() {
  const welcomeContent1 = document.getElementById('welcomeContent1');

  if (typeof createWelcomePage1 === 'function') {
    if (welcomeContent1) {
      welcomeContent1.innerHTML = createWelcomePage1();
    }
  }

  const welcomeContent2 = document.getElementById('welcomeContent2');
  const welcomeContent3 = document.getElementById('welcomeContent3');
  if (welcomeContent2) welcomeContent2.style.display = 'none';
  if (welcomeContent3) welcomeContent3.style.display = 'none';
}

function getCategoryIcon(category) {
  const icons = {
    'MENÜS': '🍱',
    'VORSPEISEN': '🌶️',
    'SALATE': '🥗',
    'SUPPEN': '🍲',
    'MAKI': '🍣',
    'INSIDE OUT': '🍣',
    'CRUNCHY INSIDE OUT ROLLS': '🍣',
    'TEMAKI': '🌯',
    'SASHIMI': '🐟',
    'NIGIRI': '🍣'
  };
  return icons[category.toUpperCase()] || '🍽️';
}

async function renderMenuItems(categoryTitle) {
  // Load menu from API if not already loaded
  if (!MENU_DATA_FROM_API) {
    await loadMenuFromAPI();
  }

  // Use API data if available, otherwise fallback to static MENU_DATA
  const menuData = MENU_DATA_FROM_API || (typeof MENU_DATA !== 'undefined' ? MENU_DATA : []);
  const category = menuData.find(cat => cat.title === categoryTitle);
  const itemsList = document.getElementById('menuItemsList');
  const categoryTitleEl = document.getElementById('currentCategoryTitle');
  const categoryHeroImage = document.getElementById('categoryHeroImage');

  if (!category || !itemsList) {
    console.warn('⚠️ Category not found or itemsList not found:', categoryTitle);
    return;
  }

  if (categoryTitleEl) {
    let titleText = categoryTitle.toUpperCase();
    if (category.categorySubtitle) {
      titleText += ' ' + category.categorySubtitle;
    }
    categoryTitleEl.textContent = titleText;
  }

  if (categoryHeroImage) {
    const heroImageSrc = category.items[0]?.image || getItemImage(category.id, category.items[0]?.name) || 'assets/close-up-sushi-served-table 1.png';
    categoryHeroImage.innerHTML = `
      <div class="category-hero-image-wrapper">
        <img src="${heroImageSrc}" alt="${categoryTitle}">
        <div class="category-hero-overlay"></div>
      </div>
    `;
  }

  const items = category.items || [];
  const groupedItems = [];
  let currentGroup = null;
  let groupItems = [];

  items.forEach((item, index) => {
    if (item.groupTitle) {
      if (currentGroup !== item.groupTitle) {
        if (currentGroup !== null && groupItems.length > 0) {
          groupedItems.push({ type: 'group', title: currentGroup, items: groupItems });
        }
        currentGroup = item.groupTitle;
        groupItems = [item];
      } else {
        groupItems.push(item);
      }
    } else {
      if (currentGroup !== null && groupItems.length > 0) {
        groupedItems.push({ type: 'group', title: currentGroup, items: groupItems });
        currentGroup = null;
        groupItems = [];
      }
      groupedItems.push({ type: 'item', item: item });
    }
  });

  if (currentGroup !== null && groupItems.length > 0) {
    groupedItems.push({ type: 'group', title: currentGroup, items: groupItems });
  }

  const flatItems = [];
  groupedItems.forEach(group => {
    if (group.type === 'group') {
      flatItems.push({ type: 'group-header', title: group.title });
      group.items.forEach(item => flatItems.push({ type: 'item', item: item }));
    } else {
      flatItems.push(group);
    }
  });

  const midPoint = Math.ceil(flatItems.length / 2);
  const leftColumn = flatItems.slice(0, midPoint);
  const rightColumn = flatItems.slice(midPoint);

  const getItemNumber = (item, index) => {
    const nameMatch = item.name.match(/^(\d+)\./);
    return nameMatch ? parseInt(nameMatch[1]) : index + 1;
  };

  const renderItem = (entry, index) => {
    if (entry.type === 'group-header') {
      return `<div class="menu-group-title">${escapeHtml(entry.title)}</div>`;
    } else if (entry.type === 'item') {
      return createMenuItemCard(entry.item, getItemNumber(entry.item, index), category.id);
    }
    return '';
  };

  itemsList.innerHTML = `
    <div class="menu-items-column">
      ${leftColumn.map((entry, index) => renderItem(entry, index)).join('')}
    </div>
    <div class="menu-items-column">
      ${rightColumn.map((entry, index) => renderItem(entry, index + midPoint)).join('')}
    </div>
  `;
}

function createMenuItemCard(item, itemNumber, categoryId = '') {
  const sushiMenuMatch = item.name.match(/^(S\d+)\.\s*(.+)$/);
  const makiMatch = item.name.match(/^(M\d+)\.\s*(.+)$/);
  const crunchyMatch = item.name.match(/^(C\d+)\.\s*(.+)$/);
  const sashimiMatch = item.name.match(/^(Sa\d+)\.\s*(.+)$/);
  const nigiriMatch = item.name.match(/^(N\d+)\.\s*(.+)$/);
  const bigRollsMatch = item.name.match(/^(P\d+)\.\s*(.+)$/);
  const miniRollsMatch = item.name.match(/^(Pa\d+)\.\s*(.+)$/);
  const specialRollsMatch = item.name.match(/^(Sp\d+)\.\s*(.+)$/);
  const fireNigiriMatch = item.name.match(/^(F\d+)\.\s*(.+)$/);
  const temakiMatch = item.name.match(/^(Te\d+)\.\s*(.+)$/);
  const dessertMatch = item.name.match(/^(D\d+)\.\s*(.+)$/);
  const beilagenMatch = item.name.match(/^(B\d+)\.\s*(.+)$/);
  const zeroPaddedMatch = item.name.match(/^(0\d+)\.\s*(.+)$/);
  const regularMatch = item.name.match(/^(\d+)\.\s*(.+)$/);
  let displayNumber, displayName;

  if (sushiMenuMatch) {
    displayNumber = sushiMenuMatch[1];
    displayName = sushiMenuMatch[2];
  } else if (makiMatch) {
    displayNumber = makiMatch[1];
    displayName = makiMatch[2];
  } else if (crunchyMatch) {
    displayNumber = crunchyMatch[1];
    displayName = crunchyMatch[2];
  } else if (sashimiMatch) {
    displayNumber = sashimiMatch[1];
    displayName = sashimiMatch[2];
  } else if (nigiriMatch) {
    displayNumber = nigiriMatch[1];
    displayName = nigiriMatch[2];
  } else if (bigRollsMatch) {
    displayNumber = bigRollsMatch[1];
    displayName = bigRollsMatch[2];
  } else if (miniRollsMatch) {
    displayNumber = miniRollsMatch[1];
    displayName = miniRollsMatch[2];
  } else if (specialRollsMatch) {
    displayNumber = specialRollsMatch[1];
    displayName = specialRollsMatch[2];
  } else if (fireNigiriMatch) {
    displayNumber = fireNigiriMatch[1];
    displayName = fireNigiriMatch[2];
  } else if (temakiMatch) {
    displayNumber = temakiMatch[1];
    displayName = temakiMatch[2];
  } else if (dessertMatch) {
    displayNumber = dessertMatch[1];
    displayName = dessertMatch[2];
  } else if (beilagenMatch) {
    displayNumber = beilagenMatch[1];
    displayName = beilagenMatch[2];
  } else if (zeroPaddedMatch) {
    displayNumber = zeroPaddedMatch[1];
    displayName = zeroPaddedMatch[2];
  } else if (regularMatch) {
    displayNumber = regularMatch[1];
    displayName = regularMatch[2];
  } else {
    displayNumber = itemNumber;
    displayName = item.name;
  }

  const allergenMatch = displayName.match(/\(([A-Z0-9,]+)\)/);
  let allergenCodes = '';
  if (allergenMatch) {
    allergenCodes = allergenMatch[1];
    displayName = displayName.replace(/\s*\([A-Z0-9,]+\)\s*/, '').trim();
  }

  if (item.allergens) {
    allergenCodes = item.allergens;
  }

  let optionsHTML = '';
  if (item.hasOptions && item.options && item.options.length > 0) {
    const uniqueId = `options-${itemNumber}-${Math.random().toString(36).substr(2, 9)}`;
    optionsHTML = `
      <div class="menu-item-options" id="${uniqueId}" style="display: none;">
        ${item.options.map(option => `
          <div class="menu-item-option" onclick="event.stopPropagation(); window.openAddToCartModal('${(item.name + ' - ' + option.name).replace(/'/g, "\\'")}', '${option.price}', '${(item.desc || '').replace(/'/g, "\\'")}')">
            <span class="option-name">${escapeHtml(option.name)}</span>
            ${option.vegetarian ? '<span class="vegetarian-icon">🌿</span>' : ''}
            <span class="option-price">€${option.price}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  let descriptionHTML = '';
  if (item.desc) {
    if (item.useBulletPoints) {
      let items = [];
      let prefix = '';
      let hasColon = item.desc.includes(':');

      if (hasColon) {
        const parts = item.desc.split(':');
        prefix = parts[0].trim();
        const rest = parts.slice(1).join(':').trim();
        if (rest) {
          const subItems = rest.split(',').map(s => s.trim()).filter(s => s);
          items = [prefix + ':', ...subItems];
        } else {
          items = [item.desc];
        }
      } else {
        items = item.desc.split(',').map(s => s.trim()).filter(s => s);
      }

      descriptionHTML = `
        <ul class="menu-item-bullet-list">
          ${items.map(itemText => `<li>${escapeHtml(itemText)}</li>`).join('')}
        </ul>
      `;
    } else {
      descriptionHTML = `<p class="menu-item-description">${escapeHtml(item.desc)}</p>`;
      if (item.descEn) {
        descriptionHTML += `<p class="menu-item-description menu-item-description-en">${escapeHtml(item.descEn)}</p>`;
      }
    }
  }

  const uniqueCardId = `card-${itemNumber}-${Math.random().toString(36).substr(2, 9)}`;
  let optionsId = '';
  if (item.hasOptions && item.options && item.options.length > 0) {
    const match = optionsHTML.match(/id="([^"]+)"/);
    if (match) {
      optionsId = match[1];
    }
  }

  return `
    <div class="menu-item-card ${item.hasOptions ? 'has-options' : ''}" id="${uniqueCardId}" data-options-id="${optionsId}" onclick="${item.hasOptions ? `toggleMenuOptions('${optionsId}', '${uniqueCardId}')` : `window.openAddToCartModal('${item.name.replace(/'/g, "\\'")}', '${item.price}', '${(item.desc || '').replace(/'/g, "\\'")}')`}">
      <div class="menu-item-number">${displayNumber}</div>
      <div class="menu-item-content">
        <div class="menu-item-header">
          <div class="menu-item-name-wrapper">
            <h3 class="menu-item-name">${escapeHtml(displayName)}</h3>
            ${allergenCodes ? `<span class="menu-item-allergens">(${allergenCodes})</span>` : ''}
            ${item.vegetarian ? '<span class="menu-item-vegetarian-icon">🌿</span>' : ''}
          </div>
          ${!item.hasOptions ? `<div class="menu-item-price">€${item.price}</div>` : ''}
        </div>
        ${item.quantity ? `<div class="menu-item-quantity">${escapeHtml(item.quantity)}</div>` : ''}
        ${descriptionHTML}
        ${optionsHTML}
      </div>
    </div>
  `;
}

function setupMenuBook() {
  const menuLink = document.getElementById('menuLink');
  const heroMenuLink = document.getElementById('heroMenuLink');
  const fixedOrderBtn = document.getElementById('fixedOrderBtn');
  const menuBookClose = document.getElementById('menuBookClose');
  const bookPrevBtn = document.getElementById('bookPrevBtn');
  const bookNextBtn = document.getElementById('bookNextBtn');
  const overlay = document.getElementById('menuBookOverlay');

  if (fixedOrderBtn) {
    const isMenuPage = window.location.pathname.includes('menu') || window.location.pathname.includes('catalog') || document.getElementById('menuOrderPage');

    if (!isMenuPage) {
      fixedOrderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'catalog';
      });
    }
  }

  document.addEventListener('click', (e) => {
    const menuOrderPage = document.getElementById('menuOrderPage');
    if (menuOrderPage && e.target === menuOrderPage) {
      closeMenuOrderPage();
    }
  });

  const menuSearchInput = document.getElementById('menuSearchInput');
  if (menuSearchInput) {
    menuSearchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      if (searchTerm) {
        const categoryPane = document.getElementById('tab-category');
        if (categoryPane && !categoryPane.classList.contains('active')) {
          const firstCategoryTab = document.querySelector('.menu-tab[data-tab="category"]');
          if (firstCategoryTab) {
            const categoryTitle = firstCategoryTab.dataset.category;
            switchTab('category', categoryTitle);
          }
        }

        const filteredItems = allMenuItemsFlat.filter(item =>
          item.name.toLowerCase().includes(searchTerm) ||
          (item.desc && item.desc.toLowerCase().includes(searchTerm))
        );

        const itemsList = document.getElementById('menuItemsList');
        const categoryTitleEl = document.getElementById('currentCategoryTitle');

        if (categoryTitleEl) {
          categoryTitleEl.textContent = `SUCHERGEBNISSE (${filteredItems.length})`;
        }

        const categoryHeroImage = document.getElementById('categoryHeroImage');
        if (categoryHeroImage) {
          categoryHeroImage.style.display = 'none';
        }

        if (itemsList) {
          if (filteredItems.length === 0) {
            itemsList.innerHTML = `
              <div style="text-align: center; padding: 60px 20px; color: rgba(233,233,236,0.6); grid-column: 1 / -1;">
                <p style="font-size: 18px; margin-bottom: 12px;">Keine Ergebnisse gefunden</p>
                <p style="font-size: 14px;">Versuchen Sie es mit anderen Suchbegriffen</p>
              </div>
            `;
          } else {
            const midPoint = Math.ceil(filteredItems.length / 2);
            const leftColumn = filteredItems.slice(0, midPoint);
            const rightColumn = filteredItems.slice(midPoint);

            const getItemNumber = (item, index) => {
              const nameMatch = item.name.match(/^(\d+)\./);
              return nameMatch ? parseInt(nameMatch[1]) : index + 1;
            };

            itemsList.innerHTML = `
              <div class="menu-items-column">
                ${leftColumn.map((item, index) => createMenuItemCard(item, getItemNumber(item, index))).join('')}
              </div>
              <div class="menu-items-column">
                ${rightColumn.map((item, index) => createMenuItemCard(item, getItemNumber(item, midPoint + index))).join('')}
              </div>
            `;
          }
        }
      } else {
        const welcomeTab = document.getElementById('tab-btn-welcome');
        if (welcomeTab && welcomeTab.classList.contains('active')) {
          return;
        }

        const categoryHeroImage = document.getElementById('categoryHeroImage');
        if (categoryHeroImage) {
          categoryHeroImage.style.display = 'block';
        }

        if (currentCategory) {
          renderMenuItems(currentCategory);
        } else if (MENU_DATA.length > 0) {
          switchTab('category', MENU_DATA[0].title);
        }
      }
    });
  }

  if (menuBookClose) menuBookClose.addEventListener('click', closeMenuBook);
  if (bookPrevBtn) bookPrevBtn.addEventListener('click', prevBookPage);
  if (bookNextBtn) bookNextBtn.addEventListener('click', nextBookPage);

  document.addEventListener('keydown', (e) => {
    if (overlay && overlay.classList.contains('active')) {
      if (e.key === 'ArrowLeft') prevBookPage();
      if (e.key === 'ArrowRight') nextBookPage();
      if (e.key === 'Escape') closeMenuBook();
    }
    const menuOrderPage = document.getElementById('menuOrderPage');
    if (menuOrderPage && menuOrderPage.classList.contains('active')) {
      if (e.key === 'Escape') closeMenuOrderPage();
    }
  });
}

// Make functions globally available
window.openMenuBook = openMenuBook;
window.closeMenuBook = closeMenuBook;
window.nextBookPage = nextBookPage;
window.prevBookPage = prevBookPage;
window.openMenuOrderPage = openMenuOrderPage;
window.closeMenuOrderPage = closeMenuOrderPage;
window.toggleMenuOptions = function (optionsId, cardId) {
  const optionsEl = document.getElementById(optionsId);
  const cardEl = document.getElementById(cardId);
  if (!optionsEl || !cardEl) return;

  const isVisible = optionsEl.style.display !== 'none';

  if (isVisible) {
    optionsEl.style.display = 'none';
    cardEl.classList.remove('options-expanded');
  } else {
    optionsEl.style.display = 'block';
    cardEl.classList.add('options-expanded');
  }
};

