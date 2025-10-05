document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded - initializing navigation');

    // Основные переменные
    const tabs = document.querySelectorAll('.tabs_title');
    const contents = document.querySelectorAll('.tabs_content');
    const subcategoryButtons = document.querySelectorAll('.subcategory-btn');

    // Функция для переключения основных вкладок
    function switchMainTab(tabNumber) {
        console.log('Switching to main tab:', tabNumber);

        // Убираем активный класс у всех вкладок
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // Добавляем активный класс текущей вкладке
        const tabElement = document.querySelector(`.tabs_title[data-tab="${tabNumber}"]`);
        if (tabElement) {
            tabElement.classList.add('active');
        }

        // Показываем соответствующий контент
        const tabId = `tab-${tabNumber}`;
        const content = document.getElementById(tabId);
        if (content) {
            content.classList.add('active');

            // Сбрасываем подкатегории при переключении вкладок
            resetSubcategories(content);

            return content;
        }
        return null;
    }

    // Функция для сброса подкатегорий
    function resetSubcategories(tabContent) {
        // Находим первую активную кнопку подкатегории
        const firstSubcategoryBtn = tabContent.querySelector('.subcategory-btn');
        if (firstSubcategoryBtn) {
            const subcategory = firstSubcategoryBtn.getAttribute('data-subcategory');
            filterSubcategory(subcategory, tabContent);
        }
    }

    function filterSubcategory(subcategory, tabContent) {
        console.log('Filtering subcategory:', subcategory, 'in tab:', tabContent.id);

        // Скрываем все контейнеры
        const foundationTabsContainer = tabContent.querySelector('.foundation-tabs-container');
        const houseTabsContainer = tabContent.querySelector('.house-tabs-container');
        const allSubcategoryContents = tabContent.querySelectorAll('.subcategory-content');

        // Скрываем всё
        if (foundationTabsContainer) foundationTabsContainer.style.display = 'none';
        if (houseTabsContainer) houseTabsContainer.style.display = 'none';
        allSubcategoryContents.forEach(content => content.style.display = 'none');

        // Показываем нужный контейнер
        if (subcategory === '3ф' && foundationTabsContainer) {
            foundationTabsContainer.style.display = 'block';
            // Даем время для отображения перед инициализацией
            setTimeout(() => {
                initFoundationTabs();
                initPortfolioSliders();
            }, 50);
        } else if (subcategory === '3гд' && houseTabsContainer) {
            houseTabsContainer.style.display = 'block';
            // Даем время для отображения перед инициализацией
            setTimeout(() => {
                initHouseTabs();
                initPortfolioSliders();
            }, 50);
        } else {
            // Для простых подкатегорий (перекрытия, колонны)
            const subcategoryContent = tabContent.querySelector(`.subcategory-content[data-subcategory="${subcategory}"]`);
            if (subcategoryContent) {
                subcategoryContent.style.display = 'block';
                // Даем время для отображения перед инициализацией
                setTimeout(initPortfolioSliders, 50);
            }
        }

        // Обновляем активную кнопку
        const allButtons = tabContent.querySelectorAll('.subcategory-btn');
        allButtons.forEach(btn => btn.classList.remove('active'));

        const activeButton = tabContent.querySelector(`.subcategory-btn[data-subcategory="${subcategory}"]`);
        if (activeButton) activeButton.classList.add('active');
    }
    // Обработчики событий для основных вкладок
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const tabNumber = this.getAttribute('data-tab');
            const tabContent = switchMainTab(tabNumber);
        });
    });

    // Обработчики для кнопок подкатегорий внутри табов
    subcategoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            const subcategory = this.getAttribute('data-subcategory');
            const activeTab = this.closest('.tabs_content');
            filterSubcategory(subcategory, activeTab);
        });
    });

    // Обработчик для всех ссылок навигации
    document.querySelectorAll('a[href*="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Обрабатываем только ссылки на подкатегории (формат #11гз, #22ф и т.д.)
            if (href.match(/^#\d{2}/)) {
                e.preventDefault();
                handleMenuSubcategoryNavigation(href);
            }
        });
    });

    // Инициализация при загрузке страницы
    function initializePage() {
        console.log('Initializing page...');

        // Активируем первую вкладку по умолчанию
        const firstTab = switchMainTab('3');

        // Обрабатываем начальный хэш если он есть
        if (window.location.hash && window.location.hash.match(/^#\d{2}/)) {
            console.log('Initial hash found:', window.location.hash);
            setTimeout(() => {
                handleMenuSubcategoryNavigation(window.location.hash);
            }, 100);
        }
    }

    // Запускаем инициализацию
    initializePage();

    // Инициализация слайдеров
    initPortfolioSliders();

    // Инициализация вкладок фундаментов и домов
    initFoundationTabs();
    initHouseTabs();
    setTimeout(() => {
        reinitAllSliders();
    }, 500);
});

// Функция для инициализации вкладок фундаментов
function initFoundationTabs() {
    const foundationTabBtns = document.querySelectorAll('.foundation-tab-btn:not([data-initialized])');
    const foundationTabs = document.querySelectorAll('.foundation-tab');

    foundationTabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const foundationType = this.getAttribute('data-foundation');

            // Убираем активный класс у всех кнопок
            foundationTabBtns.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');

            // Скрываем все вкладки
            foundationTabs.forEach(tab => tab.classList.remove('active'));

            // Показываем выбранную вкладку
            const activeTab = document.querySelector(`.foundation-tab[data-foundation="${foundationType}"]`);
            if (activeTab) {
                activeTab.classList.add('active');

                // Инициализируем слайдеры после отображения вкладки
                setTimeout(() => {
                    // Сбрасываем инициализацию слайдеров в этой вкладке
                    const sliders = activeTab.querySelectorAll('.portfolio-slider');
                    sliders.forEach(slider => {
                        slider.removeAttribute('data-initialized');
                    });
                    initPortfolioSliders();
                }, 100);
            }
        });

        // Помечаем кнопку как инициализированную
        btn.setAttribute('data-initialized', 'true');
    });
}

// Функция для инициализации вкладок домов
function initHouseTabs() {
    const houseTabBtns = document.querySelectorAll('.house-tab-btn:not([data-initialized])');
    const houseTabs = document.querySelectorAll('.house-tab');

    houseTabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const houseType = this.getAttribute('data-house-type');

            // Убираем активный класс у всех кнопок
            houseTabBtns.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');

            // Скрываем все вкладки
            houseTabs.forEach(tab => tab.classList.remove('active'));

            // Показываем выбранную вкладку
            const activeTab = document.querySelector(`.house-tab[data-house-type="${houseType}"]`);
            if (activeTab) {
                activeTab.classList.add('active');

                // Инициализируем слайдеры после отображения вкладки
                setTimeout(() => {
                    // Сбрасываем инициализацию слайдеров в этой вкладке
                    const sliders = activeTab.querySelectorAll('.portfolio-slider');
                    sliders.forEach(slider => {
                        slider.removeAttribute('data-initialized');
                    });
                    initPortfolioSliders();
                }, 100);
            }
        });

        // Помечаем кнопку как инициализированную
        btn.setAttribute('data-initialized', 'true');
    });
}


// Функция для инициализации слайдеров
function initPortfolioSliders() {
    const sliders = document.querySelectorAll('.portfolio-slider:not([data-initialized])');

    sliders.forEach(slider => {
        // Проверяем, виден ли слайдер на экране
        const isVisible = slider.offsetParent !== null;

        if (!isVisible) {
            return; // Пропускаем скрытые слайдеры
        }

        const container = slider.querySelector('.slider-container');
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = slider.querySelector('.prev-btn');
        const nextBtn = slider.querySelector('.next-btn');
        const indicators = slider.querySelectorAll('.indicator');
        const currentSlide = slider.querySelector('.current-slide');
        const totalSlides = slider.querySelector('.total-slides');

        // Если нет слайдов, пропускаем
        if (slides.length === 0) {
            return;
        }

        let currentIndex = 0;

        // Устанавливаем общее количество слайдов
        if (totalSlides) {
            totalSlides.textContent = slides.length;
        }

        function updateSlider() {
            // Скрываем все слайды
            slides.forEach((slide, index) => {
                slide.classList.remove('active');
            });

            // Показываем текущий слайд
            if (slides[currentIndex]) {
                slides[currentIndex].classList.add('active');
            }

            // Обновляем индикаторы
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });

            // Обновляем счетчик
            if (currentSlide) {
                currentSlide.textContent = currentIndex + 1;
            }
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider();
        }

        // Добавляем обработчики событий только если элементы существуют
        if (nextBtn) {
            nextBtn.onclick = nextSlide;
        }
        if (prevBtn) {
            prevBtn.onclick = prevSlide;
        }

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentIndex = index;
                updateSlider();
            });
        });

        // Автопрокрутка
        let autoplay = setInterval(nextSlide, 5000);

        // Останавливаем автопрокрутку при наведении
        slider.addEventListener('mouseenter', () => {
            clearInterval(autoplay);
        });

        slider.addEventListener('mouseleave', () => {
            autoplay = setInterval(nextSlide, 5000);
        });

        // Помечаем слайдер как инициализированный
        slider.setAttribute('data-initialized', 'true');

        updateSlider();
    });
}
function reinitAllSliders() {
    // Сбрасываем все слайдеры
    const allSliders = document.querySelectorAll('.portfolio-slider');
    allSliders.forEach(slider => {
        slider.removeAttribute('data-initialized');
    });

    // Инициализируем заново
    initPortfolioSliders();
    initFoundationTabs();
    initHouseTabs();
}

// Функция для обработки мобильного меню
function initMobileMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');

    if (mobileNav.classList.contains('show')) {
        document.body.classList.add('menu-open');
    } else {
        document.body.classList.remove('menu-open');
    };
}

// Закрытие меню при клике на ссылку
const mobileLinks = document.querySelectorAll('#mobile-nav a');
mobileLinks.forEach(link => {
    link.addEventListener('click', function () {
        if (burgerMenu) burgerMenu.classList.remove('clicked');
        if (mobileNav) mobileNav.classList.remove('show');
        if (mobileNavOverlay) mobileNavOverlay.classList.remove('show');
    });
});

// Обработка выпадающих меню в мобильной версии
const mobileMenuItems = document.querySelectorAll('#mobile-nav ul li');
mobileMenuItems.forEach(item => {
    const submenu = item.querySelector('ul');
    if (submenu) {
        const link = item.querySelector('a');
        const toggle = document.createElement('span');
        toggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
        toggle.className = 'mobile-submenu-toggle';
        toggle.style.cssText = 'margin-left: auto; color: var(--gold); cursor: pointer; transition: transform 0.3s ease;';

        link.parentNode.insertBefore(toggle, link.nextSibling);

        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const isShowing = submenu.style.display === 'block';
            submenu.style.display = isShowing ? 'none' : 'block';
            toggle.style.transform = isShowing ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    }
});


// Функция для обработки формы обратной связи
function initContactForm() {
    const contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // Простая валидация
            if (!name || !email || !message) {
                alert('Пожалуйста, заполните все поля');
                return;
            }

            // Здесь можно добавить отправку формы на сервер
            console.log('Форма отправлена:', { name, email, message });
            alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');

            // Очистка формы
            this.reset();
        });
    }
}

// Функция для плавной прокрутки
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Пропускаем ссылки на подкатегории (они обрабатываются отдельно)
            if (href.match(/^#\d{2}/)) {
                return;
            }

            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Функция для ленивой загрузки изображений
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// Инициализация всех функций после загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
    console.log('Initializing all components...');

    // Основная навигация (уже есть выше)

    // Дополнительные инициализации
    initMobileMenu();
    initContactForm();
    initSmoothScroll();
    initLazyLoading();

    // Обработка изменения хэша в URL
    window.addEventListener('hashchange', function () {
        if (window.location.hash && window.location.hash.match(/^#\d{2}/)) {
            setTimeout(() => {
                // Используем существующую функцию для обработки навигации
                const event = new Event('hashchangeNavigation');
                window.dispatchEvent(event);
            }, 100);
        }
    });

    // Добавляем обработчик для программного изменения хэша
    window.addEventListener('hashchangeNavigation', function () {
        if (window.location.hash && window.location.hash.match(/^#\d{2}/)) {
            // Используем существующую функцию handleMenuSubcategoryNavigation
            const handleMenuSubcategoryNavigation = window.handleMenuSubcategoryNavigation;
            if (handleMenuSubcategoryNavigation) {
                handleMenuSubcategoryNavigation(window.location.hash);
            }
        }
    });

    // Делаем функцию доступной глобально для обработки хэша
    window.handleMenuSubcategoryNavigation = handleMenuSubcategoryNavigation;
});

// Обработка ошибок изображений
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            this.alt = 'Изображение не загружено';
            this.style.backgroundColor = '#f0f0f0';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.style.color = '#666';
            this.style.fontSize = '14px';
            this.innerHTML = 'Изображение не найдено';
        });
    });
});

// Адаптация для мобильных устройств
function checkMobileDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
}

// Инициализация проверки устройства
document.addEventListener('DOMContentLoaded', checkMobileDevice);

// Ресайз обработчик для переинициализации при изменении размера окна
let resizeTimeout;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        // Переинициализируем слайдеры при изменении размера окна
        initPortfolioSliders();
    }, 250);
});