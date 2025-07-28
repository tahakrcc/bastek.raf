// Mobil menü için
document.addEventListener('DOMContentLoaded', function() {
    // Scroll Progress Bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // Header Scroll Effect
    const header = document.querySelector('.header');
    const navMenu = document.querySelector('.main-nav ul');
    const heroSection = document.querySelector('.hero');
    let lastScroll = 0;

    // Ana sayfada olup olmadığımızı kontrol et
    const isHomePage = window.location.pathname === '/' || 
                      window.location.pathname === '/index.html' ||
                      window.location.pathname.endsWith('/bastek-raf-sistemleri/') ||
                      window.location.pathname.endsWith('/bastek-raf-sistemleri/index.html');

    // Sayfa yüklendiğinde ana sayfada ve hero section'da ise menüyü şeffaf yap
    if (isHomePage && window.scrollY < (heroSection?.offsetHeight || 0)) {
        navMenu?.classList.add('transparent');
        header?.classList.add('transparent');
    }

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        const heroHeight = heroSection?.offsetHeight || 0;

        // Sadece ana sayfada ise şeffaflık kontrolü yap
        if (isHomePage) {
            if (currentScroll < heroHeight) {
                navMenu?.classList.add('transparent');
                header?.classList.add('transparent');
            } else {
                navMenu?.classList.remove('transparent');
                header?.classList.remove('transparent');
            }
        }

        // Header'ı scroll durumuna göre gizle/göster
        if (currentScroll > lastScroll && currentScroll > 100) {
            header?.classList.add('scroll-down');
            header?.classList.remove('scroll-up');
        } else {
            header?.classList.remove('scroll-down');
            header?.classList.add('scroll-up');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll için
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute('href'));
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                // Sayaçlar görünürse animasyonu tekrar başlat
                setTimeout(() => {
                    if (targetSection.querySelector('.stat-number')) {
                        resetAndAnimateCounters();
                    }
                }, 600);
            }
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.service-card, .feature, .section-title');
    
    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial setup for reveal elements
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease-out';
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Parallax Effect
    const parallaxElements = document.querySelectorAll('.hero');
    
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const scrolled = window.pageYOffset;
            element.style.backgroundPositionY = scrolled * 0.5 + 'px';
        });
    });

    // Hover Effect for Service Cards
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const navItems = document.querySelectorAll('.main-nav li');

    // Menü öğelerine sıra numarası ekle
    navItems.forEach((item, index) => {
        item.style.setProperty('--i', index);
    });

    // Mobil menü toggle
    mobileMenuBtn?.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav?.classList.toggle('active');
    });

    // Menü öğelerine tıklandığında menüyü kapat
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Sayfa dışına tıklandığında menüyü kapat
    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Add page transition class
    document.body.classList.add('page-transition');

    // Sayaç animasyonu
    function animateCounter(el, target, duration = 2200) {
        let start = 0;
        let startTime = null;
        function updateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            el.textContent = Math.floor(progress * (target - start) + start);
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(updateCounter);
    }

    function handleStatCounters() {
        const counters = document.querySelectorAll('.stat-number');
        let started = false;
        function isInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top < window.innerHeight && rect.bottom > 0
            );
        }
        function startCountersIfVisible() {
            if (started) return;
            if (counters.length && isInViewport(counters[0])) {
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target);
                });
                started = true;
                window.removeEventListener('scroll', startCountersIfVisible);
            }
        }
        window.addEventListener('scroll', startCountersIfVisible);
        startCountersIfVisible();
    }
    handleStatCounters();

    // Fade-in animasyonları için Intersection Observer
    function fadeInSections() {
        const fadeSections = document.querySelectorAll('.fade-section');
        const observer = new window.IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        fadeSections.forEach(section => observer.observe(section));
    }
    document.addEventListener('DOMContentLoaded', fadeInSections);

    // Ürünler için görsel modalı
    (function() {
        const imageModal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const closeBtn = document.querySelector('#imageModal .close');
        let currentImages = [];
        let currentIndex = 0;
        let imgSlideInterval = null;

        // Tüm .image-gallery img'lerine tıklandığında
        document.querySelectorAll('.image-gallery img').forEach(img => {
            img.addEventListener('click', function() {
                // O galerideki tüm img'leri bul
                const gallery = this.closest('.image-gallery');
                currentImages = Array.from(gallery.querySelectorAll('img'));
                currentIndex = currentImages.indexOf(this);
                showModalImage();
                imageModal.classList.add('active');
                startSlide();
            });
        });

        function showModalImage() {
            if(currentImages.length > 0) {
                modalImg.src = currentImages[currentIndex].src;
                modalImg.alt = currentImages[currentIndex].alt;
            }
        }
        function showNext() {
            currentIndex = (currentIndex + 1) % currentImages.length;
            showModalImage();
        }
        function showPrev() {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            showModalImage();
        }
        function startSlide() {
            stopSlide();
            imgSlideInterval = setInterval(showNext, 2000);
        }
        function stopSlide() {
            if(imgSlideInterval) clearInterval(imgSlideInterval);
        }
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showNext();
            startSlide();
        });
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showPrev();
            startSlide();
        });
        closeBtn.addEventListener('click', closeImageModal);
        imageModal.addEventListener('click', function(e) {
            if(e.target === imageModal) closeImageModal();
        });
        function closeImageModal() {
            imageModal.classList.remove('active');
            stopSlide();
        }
    })();

    // Sayaçları sıfırla ve tekrar başlat
    function resetAndAnimateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => { counter.textContent = '0'; });
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            animateCounter(counter, target);
        });
    }
});

// Hizmetler modalı kodları
const serviceDetails = {
    market: {
        title: 'Market Rafı',
        body: 'Market raflarımız, yüksek dayanıklılık ve estetik tasarım ile mağazanızda maksimum verimlilik sağlar. Farklı ölçü ve renk seçenekleriyle ihtiyacınıza özel çözümler sunar.',
        imgs: [
            'images/products/market-racks/WhatsApp Image 2025-06-05 at 00.48.35.jpeg',
            'images/products/market-racks/WhatsApp Image 2025-06-05 at 00.48.35 (1).jpeg',
            'images/products/market-racks/WhatsApp Image 2025-06-05 at 00.48.35 (2).jpeg',
            'images/products/market-racks/WhatsApp Image 2025-06-05 at 00.48.35 (3).jpeg',
            'images/products/market-racks/WhatsApp Image 2025-06-05 at 00.54.57.jpeg',
            'images/products/market-racks/WhatsApp Image 2025-06-05 at 00.54.57 (1).jpeg',
            'images/products/market-racks/WhatsApp Image 2025-06-05 at 00.54.57 (2).jpeg',
            'images/products/market-racks/WhatsApp Image 2025-06-05 at 00.54.57 (3).jpeg'
        ]
    },
    depo: {
        title: 'Depo Rafı',
        body: 'Depo ve arşiv sistemleri için özel olarak tasarlanmış raflarımız, güvenli depolama ve kolay erişim imkanı sunar. Modüler yapısı sayesinde alanınıza tam uyum sağlar.',
        imgs: [
            'images/products/depo-rafi/WhatsApp Image 2025-06-05 at 00.45.32.jpeg',
            'images/products/depo-rafi/WhatsApp Image 2025-06-05 at 00.45.32 (1).jpeg',
            'images/products/depo-rafi/WhatsApp Image 2025-06-05 at 00.45.33.jpeg'
        ]
    },
    araba: {
        title: 'Market Arabası',
        body: 'Dayanıklı ve ergonomik market arabalarımız, alışveriş deneyimini kolaylaştırır. Farklı hacim ve model seçenekleriyle hizmetinizde.',
        imgs: [
            'images/products/market-arabasi/WhatsApp Image 2025-06-04 at 17.31.00.jpeg',
            'images/products/market-arabasi/WhatsApp Image 2025-06-04 at 17.31.00 (1).jpeg',
            'images/products/market-arabasi/WhatsApp Image 2025-06-04 at 17.31.00 (2).jpeg',
            'images/products/market-arabasi/WhatsApp Image 2025-06-04 at 17.31.00 (3).jpeg',
            'images/products/market-arabasi/WhatsApp Image 2025-06-04 at 17.31.01.jpeg',
            'images/products/market-arabasi/WhatsApp Image 2025-06-04 at 17.31.01 (1).jpeg',
            'images/products/market-arabasi/WhatsApp Image 2025-06-04 at 17.31.01 (2).jpeg',
            'images/products/market-arabasi/WhatsApp Image 2025-06-04 at 17.31.01 (3).jpeg',
            'images/products/market-arabasi/WhatsApp Image 2025-06-04 at 17.31.01 (4).jpeg'
        ]
    },
    kasa: {
        title: 'Kasa Bandı',
        body: 'Market ve mağazalar için özel tasarlanmış kasa bandı sistemlerimiz, hızlı ve güvenli ödeme alanları oluşturur. Uzun ömürlü ve bakımı kolaydır.',
        imgs: [
            'images/products/kasa-bandi/WhatsApp Image 2025-06-05 at 00.49.13.jpeg',
            'images/products/kasa-bandi/WhatsApp Image 2025-06-05 at 00.49.13 (1).jpeg'
        ]
    },
    arsiv: {
        title: 'Banka Arşivi',
        body: 'Bankalar ve kurumlar için güvenli arşiv ve depolama sistemleri. Dayanıklı malzeme ve fonksiyonel tasarım ile belgeleriniz güvende.',
        imgs: [
            'images/products/depo-arsivi/depo1.jpg',
            'images/products/depo-arsivi/depo2.jpg',
            'images/products/depo-arsivi/depo3.jpg',
            'images/products/depo-arsivi/depo4.jpg'
        ]
    },
    montaj: {
        title: 'Montaj',
        body: 'Profesyonel montaj ve kurulum hizmetlerimiz ile tüm raf ve ekipmanlarınız hızlı ve güvenli şekilde kullanıma hazır hale getirilir.',
        imgs: [
            'images/products/market-racks/WhatsApp Image 2025-06-05 at 00.54.57.jpeg',
            'images/products/market-racks/WhatsApp Image 2025-06-05 at 00.54.57 (1).jpeg',
            'images/products/market-racks/WhatsApp Image 2025-06-05 at 00.54.57 (2).jpeg',
            'images/products/market-racks/WhatsApp Image 2025-06-05 at 00.54.57 (3).jpeg'
        ]
    }
};

const modal = document.getElementById('serviceModal');
const modalTitle = document.getElementById('serviceModalTitle');
const modalBody = document.getElementById('serviceModalBody');
const modalClose = document.getElementById('serviceModalClose');
const modalImg = document.getElementById('serviceModalImg');
let slideInterval = null;
let slideIndex = 0;
document.querySelectorAll('.service-detail-img').forEach(img => {
    img.addEventListener('click', function() {
        const key = this.getAttribute('data-service');
        if(serviceDetails[key]) {
            modalTitle.textContent = serviceDetails[key].title;
            modalBody.textContent = serviceDetails[key].body;
            if(serviceDetails[key].imgs && serviceDetails[key].imgs.length > 0) {
                slideIndex = 0;
                modalImg.src = serviceDetails[key].imgs[slideIndex];
                modalImg.alt = serviceDetails[key].title;
                modalImg.style.display = 'block';
                if(slideInterval) clearInterval(slideInterval);
                slideInterval = setInterval(() => {
                    slideIndex = (slideIndex + 1) % serviceDetails[key].imgs.length;
                    modalImg.style.opacity = 0;
                    setTimeout(() => {
                        modalImg.src = serviceDetails[key].imgs[slideIndex];
                        modalImg.style.opacity = 1;
                    }, 350);
                }, 2000);
            } else {
                modalImg.style.display = 'none';
                if(slideInterval) clearInterval(slideInterval);
            }
            modal.style.display = 'flex';
        }
    });
});
function closeModal() {
    modal.style.display = 'none';
    if(slideInterval) clearInterval(slideInterval);
}
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', function(e) {
    if(e.target === modal) closeModal();
});
