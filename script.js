// Выносим функцию в глобальную область видимости
function handleMenuSubcategoryNavigation(hash) {
    const subcategory = hash.substring(1); // убираем #
    const mainTabNumber = subcategory.charAt(0); // первая цифра - основная вкладка

    // Переключаем основную вкладку
    const tabElement = document.querySelector(`.tabs_title[data-tab="${mainTabNumber}"]`);
    if (tabElement) {
        tabElement.click();

        // После переключения вкладки активируем подкатегорию
        setTimeout(() => {
            const activeTab = document.querySelector('.tabs_content.active');
            if (activeTab) {
                const subcategoryBtn = activeTab.querySelector(`.subcategory-btn[data-subcategory="${subcategory}"]`);
                if (subcategoryBtn) {
                    subcategoryBtn.click();
                }
            }
        }, 200);
    }
}

// Улучшенная функция инициализации слайдеров
function initPortfolioSliders() {
    const sliders = document.querySelectorAll('.portfolio-slider:not([data-initialized])');

    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = slider.querySelector('.prev-btn');
        const nextBtn = slider.querySelector('.next-btn');
        const indicators = slider.querySelectorAll('.indicator');
        const currentSlide = slider.querySelector('.current-slide');
        const totalSlides = slider.querySelector('.total-slides');

        if (slides.length === 0) return;

        let currentIndex = 0;

        // Устанавливаем общее количество слайдов
        if (totalSlides) {
            totalSlides.textContent = slides.length;
        }

        function updateSlider() {
            console.log('Updating slider, current index:', currentIndex);

            // Скрываем все слайды
            slides.forEach((slide, index) => {
                slide.style.display = 'none';
                slide.style.opacity = '0';
            });

            // Показываем текущий слайд
            if (slides[currentIndex]) {
                slides[currentIndex].style.display = 'flex';
                setTimeout(() => {
                    slides[currentIndex].style.opacity = '1';
                }, 50);
            }

            // Обновляем индикаторы
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });

            // Обновляем счетчик
            if (currentSlide) {
                currentSlide.textContent = currentIndex + 1;
            }

            // Обновляем состояние кнопок
            if (prevBtn) {
                prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
                prevBtn.style.cursor = currentIndex === 0 ? 'default' : 'pointer';
            }

            if (nextBtn) {
                nextBtn.style.opacity = currentIndex === slides.length - 1 ? '0.5' : '1';
                nextBtn.style.cursor = currentIndex === slides.length - 1 ? 'default' : 'pointer';
            }
        }

        function nextSlide() {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
                updateSlider();
            }
        }

        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        }

        // Удаляем старые обработчики и добавляем новые
        if (nextBtn) {
            nextBtn.replaceWith(nextBtn.cloneNode(true));
            const newNextBtn = slider.querySelector('.next-btn');
            newNextBtn.onclick = nextSlide;
            newNextBtn.style.cursor = 'pointer';
        }

        if (prevBtn) {
            prevBtn.replaceWith(prevBtn.cloneNode(true));
            const newPrevBtn = slider.querySelector('.prev-btn');
            newPrevBtn.onclick = prevSlide;
            newPrevBtn.style.cursor = 'pointer';
        }

        // Обработчики для индикаторов
        indicators.forEach((indicator, index) => {
            indicator.replaceWith(indicator.cloneNode(true));
            const newIndicator = slider.querySelectorAll('.indicator')[index];
            newIndicator.onclick = () => {
                currentIndex = index;
                updateSlider();
            };
            newIndicator.style.cursor = 'pointer';
        });

        // Добавляем обработчики клавиатуры
        slider.setAttribute('tabindex', '0');
        slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });

        // Помечаем слайдер как инициализированный
        slider.setAttribute('data-initialized', 'true');

        // Запускаем первый раз
        updateSlider();

        console.log('Slider initialized with', slides.length, 'slides');
    });
}

// Упрощенная функция перезапуска слайдеров
function reinitAllSlidersSimple() {
    console.log('Reinitializing all sliders...');

    // Сбрасываем все слайдеры
    document.querySelectorAll('.portfolio-slider').forEach(slider => {
        slider.removeAttribute('data-initialized');
    });

    // Запускаем слайдеры
    setTimeout(() => {
        initPortfolioSliders();
    }, 100);
}

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

            // Перезапускаем слайдеры после переключения таба
            setTimeout(() => {
                reinitAllSlidersSimple();
            }, 300);

            return content;
        }
        return null;
    }

    function resetSubcategories(tabContent) {
        const allPortfolioItems = tabContent.querySelectorAll('.portfolio-item');
        const allSubcategoryContents = tabContent.querySelectorAll('.subcategory-content');
        const foundationTabsContainer = tabContent.querySelector('.foundation-tabs-container');
        const houseTabsContainer = tabContent.querySelector('.house-tabs-container');

        // Сбрасываем отображение
        allPortfolioItems.forEach(item => {
            item.style.display = 'none';
            item.style.opacity = '0';
        });

        allSubcategoryContents.forEach(content => {
            content.style.display = 'none';
        });

        if (foundationTabsContainer) foundationTabsContainer.style.display = 'none';
        if (houseTabsContainer) houseTabsContainer.style.display = 'none';

        // Сбрасываем активные кнопки подкатегорий
        const allButtons = tabContent.querySelectorAll('.subcategory-btn');
        allButtons.forEach(btn => btn.classList.remove('active'));
    }

    // Функция для сброса подкатегорий
    function filterSubcategory(subcategory, tabContent) {
        console.log('Filtering subcategory:', subcategory, 'in tab:', tabContent.id);

        // Скрываем все контейнеры вкладок
        const foundationTabsContainer = tabContent.querySelector('.foundation-tabs-container');
        const houseTabsContainer = tabContent.querySelector('.house-tabs-container');
        const allSubcategoryContents = tabContent.querySelectorAll('.subcategory-content');

        // Скрываем всё
        if (foundationTabsContainer) foundationTabsContainer.style.display = 'none';
        if (houseTabsContainer) houseTabsContainer.style.display = 'none';
        allSubcategoryContents.forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });

        // Убираем активный класс у всех portfolio-cards
        const allPortfolioCards = tabContent.querySelectorAll('.portfolio-cards');
        allPortfolioCards.forEach(cards => cards.classList.remove('active'));

        // Для гражданского и промышленного строительства
        if (subcategory.startsWith('1') || subcategory.startsWith('2')) {
            // Показываем нужный subcategory-content
            const activeContent = tabContent.querySelector(`.subcategory-content[data-subcategory="${subcategory}"]`);
            if (activeContent) {
                activeContent.style.display = 'block';
                activeContent.classList.add('active');

                // Инициализируем слайдеры после отображения
                setTimeout(() => {
                    reinitAllSlidersSimple();
                }, 100);
            }
        }
        // Для ИЖС - сложная структура с вкладками
        else if (subcategory.startsWith('3')) {
            const simpleSubcategory = subcategory.replace('3', '');

            // Для готовых домов
            if (simpleSubcategory === 'гд' && houseTabsContainer) {
                houseTabsContainer.style.display = 'block';
                setTimeout(() => {
                    initHouseTabs();
                    reinitAllSlidersSimple();
                }, 50);
            }
            // Для фундаментов
            else if (simpleSubcategory === 'ф' && foundationTabsContainer) {
                foundationTabsContainer.style.display = 'block';
                setTimeout(() => {
                    initFoundationTabs();
                    reinitAllSlidersSimple();
                }, 50);
            }
            // Для простых подкатегорий
            else {
                const subcategoryContent = tabContent.querySelector(`.subcategory-content[data-subcategory="${subcategory}"]`);
                if (subcategoryContent) {
                    subcategoryContent.style.display = 'block';
                    subcategoryContent.classList.add('active');
                    setTimeout(() => {
                        reinitAllSlidersSimple();
                    }, 50);
                }
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

    // Вешаем обработчики на все кнопки которые могут менять контент
    document.addEventListener('click', function (e) {
        if (e.target.closest('.tabs_title') ||
            e.target.closest('.subcategory-btn') ||
            e.target.closest('.house-tab-btn') ||
            e.target.closest('.foundation-tab-btn')) {
            setTimeout(reinitAllSlidersSimple, 200);
        }
    });

    // Также перезапускаем слайдеры при загрузке страницы
    setTimeout(reinitAllSlidersSimple, 500);
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

// Вешаем обработчики на все кнопки которые могут менять контент
document.addEventListener('click', function (e) {
    if (e.target.closest('.tabs_title') ||
        e.target.closest('.subcategory-btn') ||
        e.target.closest('.house-tab-btn') ||
        e.target.closest('.foundation-tab-btn')) {
        setTimeout(reinitAllSlidersSimple, 200);
    }
});

// Также перезапускаем слайдеры при загрузке страницы
setTimeout(reinitAllSlidersSimple, 500);