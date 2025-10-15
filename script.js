



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

// Адаптация для мобильных устройств
function checkMobileDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Инициализация вкладок
    initTabs();

    // Инициализация слайдеров в карточках
    initCardSliders();

    // Инициализация модального окна
    initModal();
});

// Функция инициализации вкладок
function initTabs() {
    // Основные вкладки
    const tabTitles = document.querySelectorAll('.tabs_title');
    const tabContents = document.querySelectorAll('.tabs_content');

    tabTitles.forEach(title => {
        title.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');

            // Убираем активный класс у всех вкладок
            tabTitles.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Добавляем активный класс к текущей вкладке
            this.classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');
        });
    });

    // Подкатегории
    const subcategoryBtns = document.querySelectorAll('.subcategory-btn');

    subcategoryBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const subcategory = this.getAttribute('data-subcategory');
            const parentTab = this.closest('.tabs_content');

            // Убираем активный класс у всех кнопок подкатегорий в текущей вкладке
            parentTab.querySelectorAll('.subcategory-btn').forEach(b => b.classList.remove('active'));

            // Добавляем активный класс к текущей кнопке
            this.classList.add('active');

            // Скрываем все контейнеры подкатегорий в текущей вкладке
            parentTab.querySelectorAll('.house-tabs-container, .foundation-tabs-container, .portfolio-cards.subcategory-content').forEach(container => {
                container.style.display = 'none';
            });

            // Показываем выбранную подкатегорию
            if (subcategory === '3гд') {
                parentTab.querySelector('.house-tabs-container').style.display = 'block';
                // Активируем первую вкладку домов
                activateFirstHouseTab(parentTab);
            } else if (subcategory === '3ф') {
                parentTab.querySelector('.foundation-tabs-container').style.display = 'block';
                // Активируем первую вкладку фундаментов
                activateFirstFoundationTab(parentTab);
            } else {
                const content = parentTab.querySelector(`.subcategory-content[data-subcategory="${subcategory}"]`);
                if (content) content.style.display = 'block';
            }
        });
    });

    // Вкладки для домов
    const houseTabBtns = document.querySelectorAll('.house-tab-btn');

    houseTabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const houseType = this.getAttribute('data-house-type');
            const container = this.closest('.house-tabs-container');

            // Убираем активный класс у всех кнопок
            container.querySelectorAll('.house-tab-btn').forEach(b => b.classList.remove('active'));
            container.querySelectorAll('.house-tab').forEach(t => t.classList.remove('active'));

            // Добавляем активный класс к текущей кнопке и вкладке
            this.classList.add('active');
            container.querySelector(`.house-tab[data-house-type="${houseType}"]`).classList.add('active');
        });
    });

    // Вкладки для фундаментов
    const foundationTabBtns = document.querySelectorAll('.foundation-tab-btn');

    foundationTabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const foundationType = this.getAttribute('data-foundation');
            const container = this.closest('.foundation-tabs-container');

            // Убираем активный класс у всех кнопок
            container.querySelectorAll('.foundation-tab-btn').forEach(b => b.classList.remove('active'));
            container.querySelectorAll('.foundation-tab').forEach(t => t.classList.remove('active'));

            // Добавляем активный класс к текущей кнопке и вкладке
            this.classList.add('active');
            container.querySelector(`.foundation-tab[data-foundation="${foundationType}"]`).classList.add('active');
        });
    });

    // Активируем первую подкатегорию в каждой вкладке
    document.querySelectorAll('.tabs_content.active .subcategory-btn.active').forEach(btn => {
        btn.click();
    });
}

// Активировать первую вкладку домов
function activateFirstHouseTab(parentTab) {
    const firstBtn = parentTab.querySelector('.house-tab-btn');
    if (firstBtn) firstBtn.click();
}

// Активировать первую вкладку фундаментов
function activateFirstFoundationTab(parentTab) {
    const firstBtn = parentTab.querySelector('.foundation-tab-btn');
    if (firstBtn) firstBtn.click();
}

// Функция инициализации слайдеров в карточках
function initCardSliders() {
    document.querySelectorAll('.portfolio-slider').forEach(slider => {
        const container = slider.querySelector('.slider-container');
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = slider.querySelector('.prev-btn');
        const nextBtn = slider.querySelector('.next-btn');
        const indicators = slider.querySelectorAll('.indicator');
        const currentSlide = slider.querySelector('.current-slide');
        const totalSlides = slider.querySelector('.total-slides');

        // Устанавливаем общее количество слайдов
        if (totalSlides) {
            totalSlides.textContent = slides.length;
        }

        let currentIndex = 0;

        // Функция обновления слайдера
        function updateSlider() {
            container.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Обновляем индикаторы
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });

            // Обновляем счетчик
            if (currentSlide) {
                currentSlide.textContent = currentIndex + 1;
            }

            // Скрываем/показываем кнопки навигации
            if (slides.length <= 1) {
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
            }
        }

        // Обработчики для кнопок навигации
        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateSlider();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                currentIndex = (currentIndex + 1) % slides.length;
                updateSlider();
            });
        }

        // Обработчики для индикаторов
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function () {
                currentIndex = index;
                updateSlider();
            });
        });

        // Инициализация слайдера
        updateSlider();
    });
}

// Функция инициализации модального окна
function initModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    const modalCounter = document.getElementById('modalCounter');

    let currentImages = [];
    let currentIndex = 0;

    // Открытие модального окна при клике на изображение
    document.querySelectorAll('.slide img').forEach(img => {
        img.addEventListener('click', function () {
            const slider = this.closest('.portfolio-slider');
            const slides = slider.querySelectorAll('.slide');

            // Собираем все изображения из слайдера
            currentImages = Array.from(slides).map(slide => {
                return slide.querySelector('img').src;
            });

            // Находим индекс текущего изображения
            currentIndex = Array.from(slides).findIndex(slide => {
                return slide.querySelector('img') === this;
            });

            openModal();
        });
    });

    // Функция открытия модального окна
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateModalImage();
    }

    // Функция закрытия модального окна
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Функция обновления изображения в модальном окне
    function updateModalImage() {
        modalImage.src = currentImages[currentIndex];
        modalCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;

        // Скрываем кнопки навигации, если изображение одно
        if (currentImages.length <= 1) {
            modalPrev.style.display = 'none';
            modalNext.style.display = 'none';
            modalCounter.style.display = 'none';
        } else {
            modalPrev.style.display = 'flex';
            modalNext.style.display = 'flex';
            modalCounter.style.display = 'block';
        }
    }

    // Обработчики событий для модального окна
    modalClose.addEventListener('click', closeModal);

    modalPrev.addEventListener('click', function () {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateModalImage();
    });

    modalNext.addEventListener('click', function () {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateModalImage();
    });

    // Закрытие модального окна при клике на фон
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Навигация с помощью клавиатуры
    document.addEventListener('keydown', function (e) {
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') modalPrev.click();
            if (e.key === 'ArrowRight') modalNext.click();
        }
    });
}

// Функция для активации табов
function activateTab(tabId) {
    // Находим все кнопки табов и убираем активный класс
    const tabButtons = document.querySelectorAll('.tabs_title');
    tabButtons.forEach(button => button.classList.remove('active'));

    // Находим все контенты табов и скрываем их
    const tabContents = document.querySelectorAll('.tabs_content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Активируем нужную кнопку и контент
    const targetButton = document.querySelector(`.tabs_title[data-tab="${tabId}"]`);
    const targetContent = document.getElementById(`tab-${tabId}`);

    if (targetButton && targetContent) {
        targetButton.classList.add('active');
        targetContent.classList.add('active');
    }
}

// Инициализация навигации в шапке
document.addEventListener('DOMContentLoaded', function () {
    // Обработчики для навигации в шапке
    const headerNavLinks = document.querySelectorAll('.main-nav a[href^="#tab-"]');

    headerNavLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Получаем ID таба из href (убираем #tab-)
            const tabId = this.getAttribute('href').replace('#tab-', '');

            // Активируем таб
            activateTab(tabId);

            // Прокручиваем к секции с табами
            const tabsSection = document.querySelector('.categories.raboti');
            if (tabsSection) {
                tabsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }

            // Закрываем мобильное меню если оно открыто
            const mobileNav = document.querySelector('#mobile-nav');
            const burgerMenu = document.querySelector('.burger-menu');
            if (mobileNav && mobileNav.classList.contains('show')) {
                mobileNav.classList.remove('show');
                burgerMenu.classList.remove('clicked');
                document.body.style.overflow = '';
            }
        });
    });

    // Обработчики для кнопок табов (если их еще нет)
    const tabButtons = document.querySelectorAll('.tabs_title');
    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');
            activateTab(tabId);
        });
    });
});