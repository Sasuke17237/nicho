/**
 * VIP Digital Store - Client Store Engine
 * Telegram Link: https://t.me/SPIDERSELLER7
 */

(function () {
  'use strict';

  const CONFIG = {
    telegramUsername: 'SPIDERSELLER7',
    telegramUrl: 'https://t.me/SPIDERSELLER7',
    storageKey: 'vip_store_custom_products',
    defaultDataPath: 'data/products.json'
  };

  let allProducts = [];
  let currentCategory = 'all';
  let activeProductForBuy = null;
  let selectedPaymentMethod = 'Pix';

  // Elements
  const productGrid = document.getElementById('productGrid');
  const categoryBar = document.getElementById('categoryBar');
  const previewModal = document.getElementById('previewModal');
  const previewContainer = document.getElementById('previewContent');
  const previewTitle = document.getElementById('previewTitle');
  const closePreviewBtn = document.getElementById('closePreviewBtn');

  const buyModal = document.getElementById('buyModal');
  const closeBuyBtn = document.getElementById('closeBuyBtn');
  const buyTitle = document.getElementById('buyProductName');
  const buyDesc = document.getElementById('buyProductDesc');
  const buyPrice = document.getElementById('buyProductPrice');
  const confirmTelegramBuyBtn = document.getElementById('confirmTelegramBuyBtn');

  // Initialize Store
  async function initStore() {
    setupTelegramLinks();
    await loadProducts();
    renderCategories();
    renderProducts();
    setupEventListeners();
  }

  // Update all telegram badges and links
  function setupTelegramLinks() {
    const tgBadges = document.querySelectorAll('.telegram-link-target');
    tgBadges.forEach(el => {
      el.href = CONFIG.telegramUrl;
    });
  }

  // Load products from localStorage or JSON file
  async function loadProducts() {
    try {
      const stored = localStorage.getItem(CONFIG.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          allProducts = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('Could not read from local storage:', e);
    }

    // Fallback: Fetch default products.json
    try {
      const response = await fetch(CONFIG.defaultDataPath);
      if (response.ok) {
        allProducts = await response.json();
      } else {
        console.error('Failed to load default products.json');
      }
    } catch (err) {
      console.error('Network error loading products:', err);
    }
  }

  // Render Category Filter Pills
  function renderCategories() {
    if (!categoryBar) return;

    const categories = ['all'];
    allProducts.forEach(p => {
      if (p.category && !categories.includes(p.category)) {
        categories.push(p.category);
      }
    });

    categoryBar.innerHTML = categories.map(cat => {
      const label = cat === 'all' ? '✨ Todos os Produtos' : cat;
      const isActive = cat === currentCategory ? 'active' : '';
      return `<button class="cat-pill ${isActive}" data-category="${escapeHtml(cat)}">${escapeHtml(label)}</button>`;
    }).join('');

    categoryBar.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.getAttribute('data-category');
        categoryBar.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts();
      });
    });
  }

  // Render Product Cards Grid
  function renderProducts() {
    if (!productGrid) return;

    const filtered = currentCategory === 'all' 
      ? allProducts 
      : allProducts.filter(p => p.category === currentCategory);

    if (filtered.length === 0) {
      productGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
          <i class="fas fa-box-open" style="font-size: 2.5rem; opacity: 0.5; margin-bottom: 1rem; display: block;"></i>
          <p style="font-size: 1.1rem; font-weight: 600;">Nenhum produto cadastrado nesta categoria.</p>
        </div>
      `;
      return;
    }

    productGrid.innerHTML = filtered.map(product => {
      const formattedPrice = Number(product.price).toFixed(2);
      const isVideo = checkIfVideo(product.preview || product.image);
      const imageSrc = product.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="card-media">
            <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'">
            ${product.category ? `<span class="card-category-tag">${escapeHtml(product.category)}</span>` : ''}
          </div>

          <div class="card-content">
            <div class="card-header-info">
              <h2 class="product-title">${escapeHtml(product.name)}</h2>
              <span class="product-price">$${formattedPrice}</span>
            </div>

            <p class="product-description">${escapeHtml(product.description || '')}</p>

            <div class="card-actions">
              <button class="btn btn-preview" data-action="preview" data-id="${product.id}">
                <i class="fas ${isVideo ? 'fa-play' : 'fa-eye'}"></i> Ver Prévia
              </button>
              <button class="btn btn-buy" data-action="buy" data-id="${product.id}">
                <i class="fab fa-telegram-plane"></i> Comprar
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Check if URL is video
  function checkIfVideo(url) {
    if (!url) return false;
    return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url);
  }

  // Open Preview Modal
  function openPreview(product) {
    if (!product) return;
    previewTitle.textContent = product.name;
    const mediaUrl = product.preview || product.image;

    if (checkIfVideo(mediaUrl)) {
      previewContainer.innerHTML = `
        <video controls autoplay loop muted playsinline style="width:100%; height:100%; border-radius:18px;">
          <source src="${escapeHtml(mediaUrl)}" type="video/mp4">
          Seu navegador não suporta este formato de vídeo.
        </video>
      `;
    } else {
      previewContainer.innerHTML = `
        <img src="${escapeHtml(mediaUrl)}" alt="${escapeHtml(product.name)}" style="width:100%; height:auto; object-fit:contain; border-radius:18px;">
      `;
    }

    previewModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closePreview() {
    previewModal.classList.remove('is-open');
    previewContainer.innerHTML = '';
    document.body.style.overflow = '';
  }

  // Open Buy Modal
  function openBuyModal(product) {
    if (!product) return;
    activeProductForBuy = product;
    buyTitle.textContent = product.name;
    buyDesc.textContent = product.description || 'Produto digital com entrega instantânea.';
    buyPrice.textContent = `$${Number(product.price).toFixed(2)}`;

    // Reset payment method
    selectedPaymentMethod = 'Pix';
    document.querySelectorAll('.method-card').forEach(btn => {
      btn.classList.toggle('is-selected', btn.getAttribute('data-method') === 'Pix');
    });

    buyModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeBuyModal() {
    buyModal.classList.remove('is-open');
    activeProductForBuy = null;
    document.body.style.overflow = '';
  }

  // Redirect to Telegram with pre-filled message
  function sendTelegramPurchase() {
    if (!activeProductForBuy) return;

    const priceFormatted = Number(activeProductForBuy.price).toFixed(2);
    const text = `Olá! Gostaria de comprar o produto *${activeProductForBuy.name}* por *$${priceFormatted}*.\nForma de pagamento: *${selectedPaymentMethod}*.\nPor favor, me envie as instruções de pagamento.`;
    
    const encoded = encodeURIComponent(text);
    const telegramUrl = `https://t.me/${CONFIG.telegramUsername}?text=${encoded}`;
    
    window.open(telegramUrl, '_blank');
    closeBuyModal();
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Grid action delegation
    if (productGrid) {
      productGrid.addEventListener('click', (e) => {
        const previewBtn = e.target.closest('[data-action="preview"]');
        if (previewBtn) {
          const id = Number(previewBtn.getAttribute('data-id'));
          const product = allProducts.find(p => p.id === id);
          if (product) openPreview(product);
          return;
        }

        const buyBtn = e.target.closest('[data-action="buy"]');
        if (buyBtn) {
          const id = Number(buyBtn.getAttribute('data-id'));
          const product = allProducts.find(p => p.id === id);
          if (product) openBuyModal(product);
          return;
        }
      });
    }

    // Modal close buttons
    if (closePreviewBtn) closePreviewBtn.addEventListener('click', closePreview);
    if (closeBuyBtn) closeBuyBtn.addEventListener('click', closeBuyModal);

    // Click outside to close modals
    window.addEventListener('click', (e) => {
      if (e.target === previewModal) closePreview();
      if (e.target === buyModal) closeBuyModal();
    });

    // Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closePreview();
        closeBuyModal();
      }
    });

    // Payment method selection
    document.querySelectorAll('.method-card').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.method-card').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        selectedPaymentMethod = btn.getAttribute('data-method') || 'Pix';
      });
    });

    // Confirm button in buy modal
    if (confirmTelegramBuyBtn) {
      confirmTelegramBuyBtn.addEventListener('click', sendTelegramPurchase);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Expose store init to window
  window.addEventListener('DOMContentLoaded', initStore);
})();
