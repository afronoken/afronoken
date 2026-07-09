const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = Array.from(document.querySelectorAll('.nav-link'));

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

navItems.forEach(link => {
    link.addEventListener('click', () => {
        navItems.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
        navLinks.classList.remove('open');
    });
});

const slides = Array.from(document.querySelectorAll('.slide'));
const dotsContainer = document.querySelector('.slider-dots');
const prevButton = document.querySelector('.slider-button.prev');
const nextButton = document.querySelector('.slider-button.next');
let currentSlide = 0;
let slideInterval;

function buildDots() {
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'slider-dot';
        dot.setAttribute('aria-label', `Slide ${index + 1}`);
        dot.addEventListener('click', () => {
            updateSlide(index);
            restartSlider();
        });
        dotsContainer.appendChild(dot);
    });
}

function updateSlide(index) {
    slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === index);
        slide.setAttribute('aria-hidden', idx !== index);
    });
    const dots = Array.from(dotsContainer.children);
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === index));
    currentSlide = index;
}

function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    updateSlide(nextIndex);
}

function prevSlide() {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    updateSlide(prevIndex);
}

function restartSlider() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 3000);
}

prevButton.addEventListener('click', () => {
    prevSlide();
    restartSlider();
});

nextButton.addEventListener('click', () => {
    nextSlide();
    restartSlider();
});

buildDots();
updateSlide(0);
restartSlider();

const sections = document.querySelectorAll('main section, .hero');

function handleScrollSpy() {
    const scrollPos = window.scrollY + window.innerHeight * 0.3;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.id || 'home';
        const link = document.querySelector(`.nav-link[href='#${id}']`);
        if (!link) return;
        if (scrollPos >= top && scrollPos < top + height) {
            navItems.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', handleScrollSpy);
handleScrollSpy();

/* ==========================================
   Dokumentasi slider (Tentang Afro Noken)
   - Auto slide: 5000ms
   - Pause on hover
   - Next / Prev buttons
   - Pagination dots
   - Swipe support (pointer events)
   ========================================== */
const docSlider = document.querySelector('.doc-slider');
if (docSlider) {
    const viewport = docSlider.querySelector('.doc-viewport');
    const track = docSlider.querySelector('.doc-track');
    const cards = Array.from(docSlider.querySelectorAll('.doc-card'));
    const btnPrev = docSlider.querySelector('.doc-btn.prev');
    const btnNext = docSlider.querySelector('.doc-btn.next');
    const dotsWrap = docSlider.querySelector('.doc-dots');

    let visible = 1;
    let pages = 1;
    let currentPage = 0;
    let autoTimer = null;
    const AUTO_DELAY = 5000; // 5000ms

    // Hitung jumlah item per halaman sesuai viewport
    function calcLayout() {
        const w = window.innerWidth;
        if (w >= 1100) visible = 3;
        else if (w >= 768) visible = 2;
        else visible = 1;
        pages = Math.max(1, Math.ceil(cards.length / visible));
        // Set flex-basis via JS fallback (CSS media queries also set it)
        cards.forEach(card => card.style.flex = `0 0 ${100 / visible}%`);
        buildDots();
        goToPage(Math.min(currentPage, pages - 1));
    }

    // Buat pagination dots
    function buildDots() {
        dotsWrap.innerHTML = '';
        for (let i = 0; i < pages; i++) {
            const b = document.createElement('button');
            b.className = 'doc-dot';
            b.setAttribute('aria-label', `Page ${i + 1}`);
            b.addEventListener('click', () => { goToPage(i); restartAuto(); });
            dotsWrap.appendChild(b);
        }
        updateDots();
    }

    // Update aktiftas dots
    function updateDots() {
        const dots = Array.from(dotsWrap.children);
        dots.forEach((d, i) => d.classList.toggle('active', i === currentPage));
    }

    // Pindah ke halaman tertentu
    function goToPage(pageIndex) {
        currentPage = Math.max(0, Math.min(pageIndex, pages - 1));
        const offset = viewport.clientWidth * currentPage;
        track.style.transform = `translateX(-${offset}px)`;
        // Tandai card aktif (skala ringan)
        const start = currentPage * visible;
        const end = start + visible;
        cards.forEach((c, idx) => c.classList.toggle('active', idx >= start && idx < end));
        updateDots();
    }

    function nextPage() { goToPage((currentPage + 1) % pages); }
    function prevPage() { goToPage((currentPage - 1 + pages) % pages); }

    // Auto play
    function startAuto() { autoTimer = setInterval(nextPage, AUTO_DELAY); }
    function stopAuto() { clearInterval(autoTimer); autoTimer = null; }
    function restartAuto() { stopAuto(); startAuto(); }

    // Button events
    btnNext.addEventListener('click', () => { nextPage(); restartAuto(); });
    btnPrev.addEventListener('click', () => { prevPage(); restartAuto(); });

    // Pause on hover
    docSlider.addEventListener('mouseenter', stopAuto);
    docSlider.addEventListener('mouseleave', startAuto);

    // Swipe support (pointer events)
    (function addSwipe() {
        let startX = 0, dx = 0, isDown = false;
        viewport.addEventListener('pointerdown', (e) => {
            isDown = true; startX = e.clientX; viewport.setPointerCapture(e.pointerId);
        });
        viewport.addEventListener('pointermove', (e) => { if (!isDown) return; dx = e.clientX - startX; });
        viewport.addEventListener('pointerup', (e) => { if (!isDown) return; isDown = false; if (Math.abs(dx) > 50) { if (dx < 0) nextPage(); else prevPage(); restartAuto(); } dx = 0; });
        viewport.addEventListener('pointercancel', () => { isDown = false; dx = 0; });
    })();

    // Recalculate on resize
    let resizeTimer = null;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(calcLayout, 150); });

    // Inisialisasi
    calcLayout();
    startAuto();
}

/* Fade-in saat section muncul (IntersectionObserver) */
const fadeSections = document.querySelectorAll('.fade-section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2,
});

fadeSections.forEach(section => observer.observe(section));

window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = '0';
    loadingScreen.style.visibility = 'hidden';
    setTimeout(() => loadingScreen.remove(), 500);
});

// Simple helper that opens WhatsApp with a short message (kept for backward compatibility)
function sendWA(namaProduk, harga) {
    const noWA = '6281247797865';
    const pesan = `Halo Afro Noken, saya ingin memesan:\n\n📦 Produk: *${namaProduk}*\n💰 Harga: *RP. ${harga}*\n\nMohon informasi langkah selanjutnya. Terima kasih!`;
    const url = `https://wa.me/${noWA}?text=${encodeURIComponent(pesan)}`;
    window.open(url, '_blank');
}

/* ============= Product Category Filter (Katalog) ============= */
// Dapatkan semua elemen kategori button dan product card
const catButtons = document.querySelectorAll('.cat-btn');
const productCards = document.querySelectorAll('.product-card.modern');

// Helper to hide a product card after fade-out transition
function hideCard(card) {
    card.classList.add('hidden');
    const onTransitionEnd = (event) => {
        if (event.propertyName === 'opacity' && card.classList.contains('hidden')) {
            card.style.display = 'none';
            card.removeEventListener('transitionend', onTransitionEnd);
        }
    };
    card.addEventListener('transitionend', onTransitionEnd);
}

// Helper to show a product card with animation
function showCard(card) {
    card.style.display = '';
    // Force reflow so transition can run after display reset
    void card.offsetWidth;
    card.classList.remove('hidden');
}

// Fungsi untuk filter produk berdasarkan kategori yang dipilih
function filterProducts(category) {
    // Update active button
    catButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    
    // Cari button yang diklik dan set active
    const activeBtn = document.querySelector(`.cat-btn[data-category="${category}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-selected', 'true');
    }

    // Filter kartu produk dengan smooth fade animation
    productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'semua' || cardCategory === category) {
            // Tampilkan produk: reset display dan hapus class hidden
            showCard(card);
        } else {
            // Sembunyikan produk: jalankan animasi fade-out lalu display none
            hideCard(card);
        }
    });
}

// Event listener untuk setiap tombol kategori
catButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const category = btn.getAttribute('data-category');
        filterProducts(category);
    });
});

// Inisialisasi: tampilkan semua produk saat halaman load
filterProducts('semua');

/* ================================================================ */

// WhatsApp tujuan: ganti nomor ini dengan nomor bisnis Anda
const WA_NUMBER = '6281247797865';

// URL Apps Script web app yang menambahkan pesanan ke Google Sheets.
// Setelah membuat Apps Script dan menerbitkannya sebagai web app,
// ganti string ini dengan URL yang diberikan.
const GOOGLE_SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
const ORDER_STATUS_DEFAULT = 'Menunggu Konfirmasi';

// Modal elements
const orderModal = document.getElementById('order-modal');
const orderForm = document.getElementById('order-form');
const orderProductInput = document.getElementById('order-product');
const orderNameInput = document.getElementById('order-name');
const orderComplaintInput = document.getElementById('order-complaint');
const orderPriceInput = document.getElementById('order-price');
const orderQtyInput = document.getElementById('order-qty');
const orderTotalInput = document.getElementById('order-total');
const orderAddressInput = document.getElementById('order-address');
const orderPhoneInput = document.getElementById('order-phone');
const waNumberLabel = document.getElementById('wa-number');
if (waNumberLabel) waNumberLabel.textContent = WA_NUMBER;

// Open modal and prefills product name
function parsePrice(priceText) {
    if (!priceText) return 0;
    const numeric = priceText.replace(/[^0-9]/g, '');
    return parseInt(numeric, 10) || 0;
}

function formatCurrency(value) {
    return `Rp ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} `;
}

function updateOrderTotal() {
    if (!orderPriceInput || !orderQtyInput || !orderTotalInput) return;
    const price = parsePrice(orderPriceInput.value);
    const qty = parseInt(orderQtyInput.value, 10) || 0;
    const total = price * qty;
    orderTotalInput.value = formatCurrency(total).trim();
}

if (orderQtyInput) {
    orderQtyInput.addEventListener('input', updateOrderTotal);
}

function openOrderModal(productName, price) {
    if (!orderModal) return;
    orderProductInput.value = `${productName}`;
    orderPriceInput.value = price || 'Rp 0';
    orderQtyInput.value = 1;
    updateOrderTotal();
    orderModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    orderNameInput.focus();
}

// Close modal and reset (keep last values optional)
function closeOrderModal() {
    if (!orderModal) return;
    orderModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Validate form fields (simple required checks)
function validateOrderForm() {
    const name = orderNameInput.value.trim();
    const complaint = orderComplaintInput.value.trim();
    const qty = parseInt(orderQtyInput.value, 10) || 0;
    const address = orderAddressInput.value.trim();
    const phone = orderPhoneInput.value.trim();
    if (!name || !complaint || qty < 1 || !address || !phone) {
        return false;
    }
    return true;
}

async function sendOrderToGoogleSheets(payload) {
    if (!GOOGLE_SHEETS_WEBAPP_URL || GOOGLE_SHEETS_WEBAPP_URL.includes('YOUR_SCRIPT_ID')) {
        console.warn('Google Sheets web app URL belum dikonfigurasi. Order tidak dikirim ke Sheets.');
        return;
    }

    const response = await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Google Sheets request gagal: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
        throw new Error(result.message || 'Google Sheets response tidak valid');
    }
}

// Build message and open WhatsApp
if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateOrderForm()) {
            alert('Mohon lengkapi semua kolom yang bertanda *');
            return;
        }
        const product = orderProductInput.value.trim();
        const name = orderNameInput.value.trim();
        const complaint = orderComplaintInput.value.trim();
        const qty = parseInt(orderQtyInput.value.trim(), 10) || 0;
        const address = orderAddressInput.value.trim();
        const phone = orderPhoneInput.value.trim();
        const priceText = orderPriceInput.value.trim();
        const unitPrice = parsePrice(priceText);
        const totalPayment = unitPrice * qty;
        const timestamp = new Date().toISOString();
        const dateString = new Date().toLocaleDateString('id-ID');

        const message = `Halo Afro Noken, saya ingin memesan produk.\n\nNama: ${name}\nProduk: ${product}\nHarga Satuan: ${priceText}\nJumlah Order: ${qty}\nTotal Pembayaran: ${formatCurrency(totalPayment)}\nAlamat: ${address}\nKontak: ${phone}`;
        const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

        const payload = {
            timestamp,
            orderDate: dateString,
            customerName: name,
            whatsappNumber: phone,
            productName: product,
            quantity: qty,
            unitPrice: unitPrice,
            totalPayment: totalPayment,
            orderAddress: address,
            orderNotes: complaint,
            status: ORDER_STATUS_DEFAULT,
        };

        // Kirim data pesanan ke Google Sheets terlebih dahulu. Jika gagal,
        // tetap membuka WhatsApp agar pelanggan bisa melanjutkan pemesanan.
        try {
            await sendOrderToGoogleSheets(payload);
            console.log('Pesanan berhasil dikirim ke Google Sheets.');
        } catch (error) {
            console.warn('Penyimpanan ke Google Sheets gagal:', error);
        }

        window.open(url, '_blank');
        closeOrderModal();
    });
}

// Close modal when backdrop clicked
if (orderModal) {
    orderModal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop')) closeOrderModal();
    });
}

// Add ripple effect to buy buttons
document.querySelectorAll('.buy-now').forEach(btn => {
    btn.addEventListener('click', function (e) {
        // create ripple element
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        ripple.className = 'ripple';
        this.appendChild(ripple);
        // remove after animation
        setTimeout(() => ripple.remove(), 700);
    });
});

/* ====================================================================== */
