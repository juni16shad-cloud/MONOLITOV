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
            return content;
        }
        return null;
    }

    // Функция для фильтрации карточек по подкатегориям
    function filterSubcategory(subcategory, tabContent) {
        console.log('Filtering subcategory:', subcategory, 'in tab:', tabContent.id);

        // Находим все карточки в активной вкладке
        const allItems = tabContent.querySelectorAll('.subcategory-item');

        // Скрываем все карточки
        allItems.forEach(item => {
            item.style.display = 'none';
            item.style.opacity = '0';
        });

        // Показываем только карточки выбранной подкатегории
        const filteredItems = tabContent.querySelectorAll(`.subcategory-item[data-subcategory="${subcategory}"]`);
        console.log('Found items for subcategory:', filteredItems.length);

        filteredItems.forEach(item => {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
            }, 50);
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
    }

    // Функция для обработки навигации по подкатегориям из меню
    function handleMenuSubcategoryNavigation(targetHash) {
        console.log('Handling menu navigation for:', targetHash);

        // Извлекаем номер вкладки и идентификатор подкатегории из хэша
        // Формат: #11гз, #22ф, #33п и т.д.
        const tabNumber = targetHash.substring(1, 2); // Первая цифра - номер вкладки
        const subcategoryId = targetHash.substring(2); // Остальное - идентификатор подкатегории

        console.log('Tab number:', tabNumber, 'Subcategory ID:', subcategoryId);

        // Маппинг идентификаторов подкатегорий на data-subcategory значения
        const subcategoryMap = {
            'гз': 'гз',
            'ф': 'фд',
            'п': 'перек',
            'к': 'колонны'
        };

        const subcategory = subcategoryMap[subcategoryId] || subcategoryId;
        console.log('Mapped subcategory:', subcategory);

        // Переключаемся на нужную вкладку
        const tabContent = switchMainTab(tabNumber);

        if (tabContent) {
            // Даем время для переключения вкладки
            setTimeout(() => {
                filterSubcategory(subcategory, tabContent);

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
            switchMainTab(tabNumber);
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

        // Показываем первую подкатегорию в каждой вкладке
        document.querySelectorAll('.tabs_content').forEach(tab => {
            const firstSubcategory = tab.querySelector('.subcategory-btn');
            if (firstSubcategory) {
                const subcategory = firstSubcategory.getAttribute('data-subcategory');
                const items = tab.querySelectorAll(`.subcategory-item[data-subcategory="${subcategory}"]`);

                items.forEach(item => {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                });
            }

            // Скрываем остальные карточки
            const otherItems = tab.querySelectorAll('.subcategory-item:not([style*="display: block"])');
            otherItems.forEach(item => {
                item.style.display = 'none';
                item.style.opacity = '0';
            });
        });

        // Обрабатываем начальный хэш если он есть
        if (window.location.hash && window.location.hash.match(/^#\d{2}/)) {
            console.log('Initial hash found:', window.location.hash);
            setTimeout(() => {
                handleMenuSubcategoryNavigation(window.location.hash);
            }, 100);
        } else {
            // Активируем первую вкладку по умолчанию
            switchMainTab('3');
        }
    }

    // Запускаем инициализацию
    initializePage();
});
// Анимация счетчика (добавить в конец файла script.js)
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // Чем меньше, тем быстрее

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = Math.ceil(target / speed);

        if (count < target) {
            counter.innerText = Math.min(count + increment, target);
            setTimeout(() => animateCounter(), 1);
        }
    });
}

// Запустить анимацию при скролле до секции
function initCounterAnimation() {
    const aboutSection = document.querySelector('.about-section');
    if (!aboutSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(aboutSection);
}

// Вызвать инициализацию после загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
    initCounterAnimation();
});