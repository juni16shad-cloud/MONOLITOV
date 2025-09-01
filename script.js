document.addEventListener('DOMContentLoaded', function () {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categoryContents = document.querySelectorAll('.category-content');

    const tabs = document.querySelectorAll('.tabs_title');
    const contents = document.querySelectorAll('.tabs_content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Убираем активный класс у всех вкладок
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Добавляем активный класс текущей вкладке
            tab.classList.add('active');

            // Показываем соответствующий контент
            const tabId = `tab-${tab.dataset.tab}`;
            const content = document.getElementById(tabId);
            if (content) {
                content.classList.add('active');
            }
        });
    });

    // Обработчики событий для кнопок
    categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            switchCategory(category);
        });
    });
});