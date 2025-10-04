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

        // Скрываем все дополнительные контейнеры вкладок
        const foundationTabsContainer = tabContent.querySelector('.foundation-tabs-container');
        const houseTabsContainer = tabContent.querySelector('.house-tabs-container');

        if (foundationTabsContainer) {
            foundationTabsContainer.style.display = 'none';
        }
        if (houseTabsContainer) {
            houseTabsContainer.style.display = 'none';
        }

        // Показываем соответствующие контейнеры для выбранной подкатегории
        if (subcategory === '3ф' && foundationTabsContainer) {
            foundationTabsContainer.style.display = 'block';
            initFoundationTabs();
        } else if (subcategory === '3гд' && houseTabsContainer) {
            houseTabsContainer.style.display = 'block';
            initHouseTabs();
        }

        // Находим все карточки в активной вкладке
        const allItems = tabContent.querySelectorAll('.subcategory-item');

        // Скрываем все карточки с анимацией
        allItems.forEach(item => {
            item.style.display = 'none';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
        });

        // Показываем только карточки выбранной подкатегории
        const filteredItems = tabContent.querySelectorAll(`.subcategory-item[data-subcategory="${subcategory}"]`);

        filteredItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100); // Задержка для эффекта каскада
        });

        // Обновляем активную кнопку подкатегории
        const allButtons = tabContent.querySelectorAll('.subcategory-btn');
        allButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        const activeButton = tabContent.querySelector(`.subcategory-btn[data-subcategory="${subcategory}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Инициализируем слайдеры для показанных элементов
        setTimeout(() => {
            initPortfolioSliders();
        }, 300);
    }
    // Функция для обработки навигации по подкатегориям из меню
    function handleMenuSubcategoryNavigation(targetHash) {
        console.log('Handling menu navigation for:', targetHash);

        // Извлекаем номер вкладки и идентификатор подкатегории из хэша
        const tabNumber = targetHash.substring(1, 2);
        const subcategoryId = targetHash.substring(2);

        console.log('Tab number:', tabNumber, 'Subcategory ID:', subcategoryId);

        // Маппинг идентификаторов подкатегорий
        const subcategoryMap = {
            'гз': 'гз',
            'ф': 'ф',
            'п': 'п',
            'к': 'к',
            'гд': 'гд'
        };

        const subcategory = subcategoryMap[subcategoryId] || subcategoryId;
        console.log('Mapped subcategory:', subcategory);

        // Переключаемся на нужную вкладку
        const tabContent = switchMainTab(tabNumber);

        if (tabContent) {
            // Даем время для переключения вкладки
            setTimeout(() => {
                filterSubcategory(tabNumber + subcategory, tabContent);

                // Прокрутка к секции
                setTimeout(() => {
                    const categoriesSection = document.getElementById('categories');
                    if (categoriesSection) {
                        categoriesSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 100);
            }, 100);
        }
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
});

// Функция для инициализации вкладок фундаментов
function initFoundationTabs() {
    const foundationTabBtns = document.querySelectorAll('.foundation-tab-btn');
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
            }

            // Инициализируем слайдеры для активной вкладки
            initPortfolioSliders();
        });
    });
}

// Функция для инициализации вкладок домов
function initHouseTabs() {
    const houseTabBtns = document.querySelectorAll('.house-tab-btn');
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
            }

            // Инициализируем слайдеры для активной вкладки
            initPortfolioSliders();
        });
    });
}

// Функция для инициализации слайдеров
function initPortfolioSliders() {
    const sliders = document.querySelectorAll('.portfolio-slider');

    sliders.forEach(slider => {
        // Если слайдер уже инициализирован, пропускаем
        if (slider.hasAttribute('data-initialized')) {
            return;
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
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentIndex);
            });

            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });

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
            nextBtn.addEventListener('click', nextSlide);
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
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