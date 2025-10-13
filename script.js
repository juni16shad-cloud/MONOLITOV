



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



// Адаптация для мобильных устройств
function checkMobileDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
}

// Инициализация проверки устройства
document.addEventListener('DOMContentLoaded', checkMobileDevice);
// Основная функция для инициализации портфолио
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolioTabs();
    initializeSubcategories();
    initializeHouseTabs();
    initializeFoundationTabs();
    initializeSliders();
    
    // Активируем первую подкатегорию в каждой вкладке
    activateFirstSubcategories();
});

// Активация первых подкатегорий во всех вкладках
function activateFirstSubcategories() {
    const tabContents = document.querySelectorAll('.tabs_content');
    
    tabContents.forEach(tabContent => {
        if (tabContent.classList.contains('active')) {
            const firstSubcategoryBtn = tabContent.querySelector('.subcategory-btn.active');
            if (firstSubcategoryBtn) {
                firstSubcategoryBtn.click();
            }
        }
    });
}

// Инициализация основных табов
function initializePortfolioTabs() {
    const tabButtons = document.querySelectorAll('.tabs_title');
    const tabContents = document.querySelectorAll('.tabs_content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Убираем активный класс у всех кнопок и контента
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке и контенту
            this.classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');
            
            // Активируем первую подкатегорию в новой вкладке
            activateFirstSubcategoryInTab(`tab-${tabId}`);
        });
    });
}

// Активация первой подкатегории в конкретной вкладке
function activateFirstSubcategoryInTab(tabId) {
    const tabContent = document.getElementById(tabId);
    if (tabContent) {
        const firstSubcategoryBtn = tabContent.querySelector('.subcategory-btn');
        if (firstSubcategoryBtn) {
            // Сбрасываем все подкатегории
            tabContent.querySelectorAll('.subcategory-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            tabContent.querySelectorAll('.subcategory-content').forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            
            // Активируем первую подкатегорию
            firstSubcategoryBtn.classList.add('active');
            showSubcategoryContent(firstSubcategoryBtn.getAttribute('data-subcategory'), tabContent);
        }
    }
}

// Инициализация подкатегорий
function initializeSubcategories() {
    const subcategoryButtons = document.querySelectorAll('.subcategory-btn');
    
    subcategoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const subcategory = this.getAttribute('data-subcategory');
            const parentTab = this.closest('.tabs_content');
            
            // Убираем активный класс у всех кнопок подкатегорий в текущей вкладке
            parentTab.querySelectorAll('.subcategory-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Показываем соответствующий контент
            showSubcategoryContent(subcategory, parentTab);
        });
    });
}

// Показ контента подкатегории
function showSubcategoryContent(subcategory, parentTab) {
    // Скрываем весь контент подкатегорий в текущей вкладке
    parentTab.querySelectorAll('.subcategory-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    
    // Скрываем контейнеры вкладок домов и фундаментов
    const houseTabsContainer = parentTab.querySelector('.house-tabs-container');
    const foundationTabsContainer = parentTab.querySelector('.foundation-tabs-container');
    
    if (houseTabsContainer) {
        houseTabsContainer.classList.remove('active');
        houseTabsContainer.style.display = 'none';
    }
    if (foundationTabsContainer) {
        foundationTabsContainer.classList.remove('active');
        foundationTabsContainer.style.display = 'none';
    }
    
    // Показываем соответствующий контент
    if (subcategory === '3гд') {
        // Для готовых домов показываем вкладки типов домов
        if (houseTabsContainer) {
            houseTabsContainer.classList.add('active');
            houseTabsContainer.style.display = 'block';
            // Активируем первую вкладку домов
            const firstHouseTabBtn = houseTabsContainer.querySelector('.house-tab-btn');
            if (firstHouseTabBtn) firstHouseTabBtn.click();
        }
    } else if (subcategory === '3ф') {
        // Для фундаментов показываем вкладки типов фундаментов
        if (foundationTabsContainer) {
            foundationTabsContainer.classList.add('active');
            foundationTabsContainer.style.display = 'block';
            // Активируем первую вкладку фундаментов
            const firstFoundationTabBtn = foundationTabsContainer.querySelector('.foundation-tab-btn');
            if (firstFoundationTabBtn) firstFoundationTabBtn.click();
        }
    } else {
        // Для остальных подкатегорий показываем обычный контент
        const targetContent = parentTab.querySelector(`.subcategory-content[data-subcategory="${subcategory}"]`);
        if (targetContent) {
            targetContent.classList.add('active');
            targetContent.style.display = 'block';
            // Переинициализируем слайдеры в этом контенте
            initializeSlidersInContainer(targetContent);
        }
    }
}

// Инициализация вкладок типов домов
function initializeHouseTabs() {
    const houseTabButtons = document.querySelectorAll('.house-tab-btn');
    const houseTabs = document.querySelectorAll('.house-tab');
    
    houseTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const houseType = this.getAttribute('data-house-type');
            
            // Убираем активный класс у всех кнопок и вкладок
            houseTabButtons.forEach(btn => btn.classList.remove('active'));
            houseTabs.forEach(tab => {
                tab.classList.remove('active');
                tab.style.display = 'none';
            });
            
            // Добавляем активный класс текущей кнопке и вкладке
            this.classList.add('active');
            const activeHouseTab = document.querySelector(`.house-tab[data-house-type="${houseType}"]`);
            if (activeHouseTab) {
                activeHouseTab.classList.add('active');
                activeHouseTab.style.display = 'block';
                
                // Переинициализируем слайдеры в активной вкладке
                initializeSlidersInContainer(activeHouseTab);
            }
        });
    });
}

// Инициализация вкладок типов фундаментов
function initializeFoundationTabs() {
    const foundationTabButtons = document.querySelectorAll('.foundation-tab-btn');
    const foundationTabs = document.querySelectorAll('.foundation-tab');
    
    foundationTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const foundationType = this.getAttribute('data-foundation');
            
            // Убираем активный класс у всех кнопок и вкладок
            foundationTabButtons.forEach(btn => btn.classList.remove('active'));
            foundationTabs.forEach(tab => {
                tab.classList.remove('active');
                tab.style.display = 'none';
            });
            
            // Добавляем активный класс текущей кнопке и вкладке
            this.classList.add('active');
            const activeFoundationTab = document.querySelector(`.foundation-tab[data-foundation="${foundationType}"]`);
            if (activeFoundationTab) {
                activeFoundationTab.classList.add('active');
                activeFoundationTab.style.display = 'block';
                
                // Переинициализируем слайдеры в активной вкладке
                initializeSlidersInContainer(activeFoundationTab);
            }
        });
    });
}

// Инициализация всех слайдеров
function initializeSliders() {
    const sliders = document.querySelectorAll('.portfolio-slider');
    
    sliders.forEach(slider => {
        initializeSingleSlider(slider);
    });
}

// Инициализация слайдеров в конкретном контейнере
function initializeSlidersInContainer(container) {
    const sliders = container.querySelectorAll('.portfolio-slider');
    
    sliders.forEach(slider => {
        initializeSingleSlider(slider);
    });
}

// Инициализация одного слайдера (остается без изменений)
function initializeSingleSlider(slider) {
    const container = slider.querySelector('.slider-container');
    const slides = slider.querySelectorAll('.slide');
    const prevBtn = slider.querySelector('.prev-btn');
    const nextBtn = slider.querySelector('.next-btn');
    const indicators = slider.querySelectorAll('.indicator');
    const currentSlideElement = slider.querySelector('.current-slide');
    const totalSlidesElement = slider.querySelector('.total-slides');
    
    // Если слайд только один, скрываем элементы управления
    if (slides.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (indicators.length > 0) {
            indicators[0].parentElement.style.display = 'none';
        }
        if (currentSlideElement) {
            currentSlideElement.parentElement.style.display = 'none';
        }
        return;
    }
    
    // Показываем элементы управления если они были скрыты
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
    if (indicators.length > 0) {
        indicators[0].parentElement.style.display = 'flex';
    }
    if (currentSlideElement) {
        currentSlideElement.parentElement.style.display = 'block';
    }
    
    let currentSlide = 0;
    
    // Устанавливаем общее количество слайдов
    if (totalSlidesElement) {
        totalSlidesElement.textContent = slides.length;
    }
    
    // Функция для показа слайда
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        if (currentSlideElement) {
            currentSlideElement.textContent = index + 1;
        }
        
        currentSlide = index;
    }
    
    // Следующий слайд
    function nextSlide() {
        let newIndex = currentSlide + 1;
        if (newIndex >= slides.length) {
            newIndex = 0;
        }
        showSlide(newIndex);
    }
    
    // Предыдущий слайд
    function prevSlide() {
        let newIndex = currentSlide - 1;
        if (newIndex < 0) {
            newIndex = slides.length - 1;
        }
        showSlide(newIndex);
    }
    
    // Обработчики событий для кнопок
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Обработчики для индикаторов
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Автопрокрутка (опционально)
    let autoSlideInterval = setInterval(nextSlide, 5000);
    
    // Останавливаем автопрокрутку при наведении
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    });
    
    // Инициализация первого слайда
    showSlide(0);
}

// Обработка изменения размера окна
window.addEventListener('resize', function() {
    // Переинициализируем слайдеры при изменении размера окна
    initializeSliders();
});

// Дебаг функция для проверки состояния
function debugPortfolioState() {
    console.log('Active tab:', document.querySelector('.tabs_title.active')?.textContent);
    console.log('Active subcategory buttons:');
    document.querySelectorAll('.subcategory-btn.active').forEach(btn => {
        console.log('-', btn.textContent, 'data:', btn.getAttribute('data-subcategory'));
    });
    console.log('Visible content blocks:');
    document.querySelectorAll('.subcategory-content[style*="display: block"]').forEach(content => {
        console.log('-', content.getAttribute('data-subcategory'));
    });
}


