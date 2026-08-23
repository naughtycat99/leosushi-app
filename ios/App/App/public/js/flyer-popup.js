// Luxurious Flyer Popup Module - Leo Sushi
// High-end 2-column Experience with Glassmorphism & Hero Imagery
// QR Download & 10% Flyer Reward Integration

(function() {
  'use strict';

  const QR_LIB_URL = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';

  const urlParams = new URLSearchParams(window.location.search);
  const isFromFlyer = urlParams.get('ref') === 'flyer';
  const discountStatus = localStorage.getItem('leo_flyer_discount');
  const discountUsed = discountStatus === 'used';

  function init() {
    if (isFromFlyer && !discountStatus) {
      localStorage.setItem('leo_flyer_discount', 'unused');
    }

    // DO NOT SHOW POPUP ON MENU PAGE
    if (window.location.pathname.includes('menu') || window.location.pathname.includes('catalog')) {
      return;
    }

    const isEligibleForDiscount = localStorage.getItem('leo_flyer_discount') === 'unused';

    const overlay = document.createElement('div');
    overlay.id = 'flyerPopupOverlay';
    
    overlay.innerHTML = `
      <div class="flyer-card-gold">
        <button class="flyer-close-gold" id="flyerPopupClose">×</button>
        
        <div class="flyer-columns-luxury">
          <!-- Left: Hero Brand Side -->
          <div class="flyer-hero-side">
            <div class="flyer-hero-overlay"></div>
            <div class="flyer-hero-content">
              <img src="assets/logo.png" alt="Leo Sushi" class="f-luxury-logo">
              <div class="f-luxury-title">LEO SUSHI</div>
              <div class="f-luxury-tag">Premium Asian Taste</div>
            </div>
          </div>

          <!-- Right: Interactive Offer Side -->
          <div class="flyer-interact-side">
            <div class="f-interact-inner">
              <div class="f-app-box">
                <div class="f-box-h">📱 LEO SUSHI APP</div>
                <div class="f-box-p">Bestelle schneller & sichere dir Vorteile!</div>
                <div class="f-qr-luxury">
                  <div id="flyerAppQR"></div>
                  <div class="f-qr-frame"></div>
                </div>
                <div class="f-store-luxury">
                  <a href="https://apps.apple.com/de/app/leo-sushi/id6758460309" class="s-l-link" target="_blank">🍎 Store</a>
                  <a href="https://play.google.com/store/apps/details?id=com.leosushi.berlin" class="s-l-link" target="_blank">▶️ Play</a>
                </div>
              </div>

              <div class="f-divider-luxury"><span>hoặc</span></div>

              <div class="f-offer-box">
                ${isEligibleForDiscount ? `
                  <div class="f-gold-card">
                    <div class="f-card-top">10% OFF</div>
                    <div class="f-card-mid">FLYER-RABATT</div>
                    <div class="f-card-bot">Code: FLYER10</div>
                  </div>
                ` : `
                  <div class="f-welcome-msg">
                    <div class="f-w-h">Willkommen</div>
                    <div class="f-w-p">Erleben Sie den Premium-Geschmack von Leo Sushi</div>
                  </div>
                `}
                
                <button class="f-btn-gold" id="flyerOrderBtn">
                  🛍️ JETZT ONLINE BESTELLEN ${isEligibleForDiscount ? '<small>(-10%)</small>' : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      #flyerPopupOverlay {
        position: fixed; inset: 0; z-index: 999999;
        background: rgba(0,0,0,0.85); backdrop-filter: blur(20px);
        display: flex; align-items: center; justify-content: center; padding: 20px;
        opacity: 0; visibility: hidden;
        transition: all 0.5s ease;
      }
      #flyerPopupOverlay.active { opacity: 1; visibility: visible; }

      .flyer-card-gold {
        background: #0b0b0d; border: 1px solid rgba(229,207,142,0.3);
        border-radius: 30px; width: 100%; max-width: 760px; position: relative;
        box-shadow: 0 50px 100px rgba(0,0,0,0.9), 0 0 40px rgba(229,207,142,0.05);
        overflow: hidden; transform: translateY(30px) scale(0.95); transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }
      #flyerPopupOverlay.active .flyer-card-gold { transform: translateY(0) scale(1); }

      .flyer-columns-luxury { display: flex; flex-direction: row; min-height: 520px; }

      /* Hero Side */
      .flyer-hero-side {
        flex: 1; position: relative;
        background: url('assets/popup-bg.png') center/cover no-repeat;
        display: flex; align-items: center; justify-content: center; overflow: hidden;
      }
      .flyer-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(11,11,13,0.8), rgba(11,11,13,0.2), rgba(11,11,13,0.8)); }
      .flyer-hero-content { position: relative; z-index: 2; text-align: center; }
      .f-luxury-logo { width: 80px; height: 80px; border-radius: 50%; border: 3px solid #e5cf8e; background: #fff; margin-bottom: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
      .f-luxury-title { font-size: 28px; font-weight: 900; color: #fff; letter-spacing: 2px; }
      .f-luxury-tag { font-size: 14px; color: #e5cf8e; font-weight: 500; opacity: 0.8; }

      /* Interact Side */
      .flyer-interact-side { flex: 1.1; padding: 40px; background: rgba(255,255,255,0.02); display: flex; align-items: center; justify-content: center; }
      .f-interact-inner { width: 100%; max-width: 320px; text-align: center; }

      .f-app-box { margin-bottom: 25px; }
      .f-box-h { font-size: 16px; font-weight: 800; color: #e5cf8e; margin-bottom: 6px; }
      .f-box-p { font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 20px; }

      .f-qr-luxury { position: relative; display: inline-block; background: #fff; padding: 10px; border-radius: 20px; margin-bottom: 20px; }
      #flyerAppQR { width: 140px; height: 140px; }
      .f-qr-frame { position: absolute; inset: -5px; border: 2px solid rgba(229,207,142,0.2); border-radius: 24px; pointer-events: none; }

      .f-store-luxury { display: flex; gap: 10px; }
      .s-l-link { flex: 1; padding: 10px; background: #1a1b1e; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; font-size: 12px; font-weight: 700; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 6px; transition: 0.3s; }
      .s-l-link:hover { background: #333; border-color: #e5cf8e; }

      .f-divider-luxury { margin: 20px 0; display: flex; align-items: center; gap: 15px; color: rgba(255,255,255,0.2); font-size: 12px; }
      .f-divider-luxury::before, .f-divider-luxury::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08); }

      .f-gold-card { background: linear-gradient(135deg, #e5cf8e, #b3914a); border-radius: 15px; padding: 20px; color: #000; box-shadow: 0 15px 40px rgba(229,207,142,0.2); margin-bottom: 20px; }
      .f-card-top { font-size: 24px; font-weight: 900; }
      .f-card-mid { font-size: 14px; font-weight: 700; border-top: 1px solid rgba(0,0,0,0.1); border-bottom: 1px solid rgba(0,0,0,0.1); padding: 5px 0; margin: 8px 0; letter-spacing: 2px; }
      .f-card-bot { font-size: 11px; font-weight: 600; opacity: 0.8; }

      .f-welcome-msg { margin-bottom: 20px; }
      .f-w-h { font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 5px; }
      .f-w-p { font-size: 12px; color: rgba(255,255,255,0.5); }

      .f-btn-gold { width: 100%; padding: 18px; background: #C41E3A; color: #fff; border: none; border-radius: 16px; font-size: 15px; font-weight: 800; cursor: pointer; transition: 0.4s; box-shadow: 0 10px 30px rgba(196,30,58,0.3); }
      .f-btn-gold:hover { background: #d42a48; transform: translateY(-4px); box-shadow: 0 15px 40px rgba(196,30,58,0.4); }
      .f-btn-gold small { display: block; font-size: 10px; font-weight: 400; opacity: 0.8; }

      .flyer-close-gold { position: absolute; top: 20px; right: 20px; width: 35px; height: 35px; background: rgba(255,255,255,0.1); border: none; border-radius: 50%; color: #fff; font-size: 24px; cursor: pointer; z-index: 10; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
      .flyer-close-gold:hover { background: #C41E3A; }

      @media (max-width: 760px) {
        .flyer-columns-luxury { flex-direction: column; max-height: 85vh; overflow-y: auto; }
        .flyer-hero-side { min-height: 180px; }
        .f-luxury-title { font-size: 22px; }
        .flyer-interact-side { padding: 30px 20px; }
        .flyer-card-gold { max-width: 360px; border-radius: 25px; }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(overlay);

    // Show the popup IMMEDIATELY (Do not wait for QR library)
    setTimeout(() => overlay.classList.add('active'), 50);

    const qrImageUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://www.leo-sushi-berlin.de/download-app';
    const qrTarget = document.getElementById('flyerAppQR');
    if (qrTarget) {
      qrTarget.innerHTML = `<img src="${qrImageUrl}" alt="App Download QR" style="width: 140px; height: 140px;">`;
    }

    const closeAll = () => {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 500);
    };

    document.getElementById('flyerPopupClose').onclick = closeAll;
    document.getElementById('flyerOrderBtn').onclick = () => {
      closeAll();
      setTimeout(() => {
        if (!window.location.pathname.includes('menu') && !window.location.pathname.includes('catalog')) {
          window.location.href = 'menu.html';
        }
      }, 250);
    };
    overlay.onclick = (e) => { if (e.target === overlay) closeAll(); };
    document.onkeydown = (e) => { if (e.key === 'Escape') closeAll(); };
  }

  // Optimize Page Load: Wait until intro screen finishes entirely (2500ms + 800ms)
  const startPopup = () => {
    setTimeout(init, 3400);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startPopup);
  } else {
    startPopup();
  }
})();
