document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded - initializing navigation');

    // Основные переменные
    const tabs = document.querySelectorAll('.tabs_title');
    const contents = document.querySelectorAll('.tabs_content');
    const subcategoryButtons = document.querySelectorAll('.subcategory-btn');

    // Функция для переключения основных вкладок
    function switchMainTab(tabElement) {
        console.log('Switching to tab:', tabElement.dataset.tab);

        // Убираем активный класс у всех вкладок
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // Добавляем активный класс текущей вкладке
        tabElement.classList.add('active');

        // Показываем соответствующий контент
        const tabId = `tab-${tabElement.dataset.tab}`;
        const content = document.getElementById(tabId);
        if (content) {
            content.classList.add('active');
            return content;
        }
        return null;
    }

    // Функция для фильтрации карточек по подкатегориям
    function filterSubcategory(subcategory, activeTab = null) {
        if (!activeTab) {
            activeTab = document.querySelector('.tabs_content.active');
        }

        if (!activeTab) {
            console.error('No active tab found!');
            return;
        }

        console.log('Filtering subcategory:', subcategory, 'in tab:', activeTab.id);

        // Находим все карточки в активной вкладке
        const allItems = activeTab.querySelectorAll('.subcategory-item');

        // Скрываем все карточки
        allItems.forEach(item => {
            item.style.display = 'none';
            item.style.opacity = '0';
        });

        // Показываем только карточки выбранной подкатегории
        const filteredItems = activeTab.querySelectorAll(`.subcategory-item[data-subcategory="${subcategory}"]`);
        console.log('Found items for subcategory:', filteredItems.length);

        if (filteredItems.length === 0) {
            console.warn('No items found for subcategory:', subcategory);
        }

        filteredItems.forEach(item => {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
            }, 50);
        });

        // Обновляем активную кнопку подкатегории
        const allButtons = activeTab.querySelectorAll('.subcategory-btn');
        allButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        const activeButton = activeTab.querySelector(`.subcategory-btn[data-subcategory="${subcategory}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
            console.log('Activated button:', activeButton.id);
        } else {
            console.warn('No button found for subcategory:', subcategory);
        }
    }

    // Функция для обработки навигации по подкатегориям
    function handleSubcategoryNavigation(targetId) {
        console.log('Handling subcategory navigation for:', targetId);

        const targetElement = document.getElementById(targetId);
        if (!targetElement) {
            console.error('Element not found with id:', targetId);
            return;
        }

        if (!targetElement.classList.contains('subcategory-btn')) {
            console.error('Element is not a subcategory button:', targetElement);
            return;
        }

        // Определяем номер вкладки из ID (первая цифра)
        const tabNumber = targetId.charAt(0);
        console.log('Tab number from ID:', tabNumber);

        const tab = document.querySelector(`.tabs_title[data-tab="${tabNumber}"]`);
        if (!tab) {
            console.error('Tab not found for number:', tabNumber);
            return;
        }

        // Переключаемся на нужную вкладку
        const content = switchMainTab(tab);

        // Даем время для переключения вкладки
        setTimeout(() => {
            const subcategory = targetElement.getAttribute('data-subcategory');
            console.log('Filtering subcategory:', subcategory);

            filterSubcategory(subcategory, content);

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

    // Функция для обработки навигации по хэшу
    function handleHashNavigation() {
        const hash = window.location.hash;
        console.log('Hash changed:', hash);

        if (!hash) return;

        // Если хэш указывает на вкладку (tab-1, tab-2, tab-3)
        if (hash.startsWith('#tab-')) {
            const tabNumber = hash.replace('#tab-', '');
            const tab = document.querySelector(`.tabs_title[data-tab="${tabNumber}"]`);
            if (tab) {
                switchMainTab(tab);
            }
        }
        // Если хэш указывает на подкатегорию (11гз, 22ф, etc)
        else {
            const targetId = hash.replace('#', '');
            handleSubcategoryNavigation(targetId);
        }
    }

    // Обработчики событий для основных вкладок
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            switchMainTab(this);
            // Обновляем URL
            window.location.hash = `tab-${this.dataset.tab}`;
        });
    });

    // Обработчики для кнопок подкатегорий
    subcategoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            const subcategory = this.getAttribute('data-subcategory');
            const activeTab = this.closest('.tabs_content');
            filterSubcategory(subcategory, activeTab);

            // Обновляем URL с хэшем
            window.location.hash = this.id;
        });
    });

    // Обработчик изменения хэша
    window.addEventListener('hashchange', handleHashNavigation);

    // Обработчик для всех ссылок с хэшем
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && !href.startsWith('#tab-')) {
                // Для подкатегорий обрабатываем вручную
                e.preventDefault();
                window.location.hash = href;
            }
        });
    });

    // Инициализация при загрузке страницы
    function initializePage() {
        console.log('Initializing page...');

        // Показываем первую подкатегорию в каждой вкладке
        document.querySelectorAll('.tabs_content').forEach(tab => {
            const firstSubcategory = tab.querySelector('.subcategory-btn.active');
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
        if (window.location.hash) {
            console.log('Initial hash found:', window.location.hash);
            setTimeout(handleHashNavigation, 100);
        } else {
            // Активируем первую вкладку по умолчанию
            const firstTab = document.querySelector('.tabs_title.active');
            if (firstTab) {
                switchMainTab(firstTab);
            }
        }
    }

    // Запускаем инициализацию
    initializePage();

    // Дебаг функция для проверки элементов
    function debugElements() {
        console.log('Available subcategory buttons:');
        subcategoryButtons.forEach(btn => {
            console.log('ID:', btn.id, 'Data-subcategory:', btn.getAttribute('data-subcategory'));
        });

        console.log('Navigation links:');
        document.querySelectorAll('a[href^="#11"], a[href^="#22"], a[href^="#33"]').forEach(link => {
            console.log('Link href:', link.getAttribute('href'));
        });
    }
});