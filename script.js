



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