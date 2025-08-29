document.addEventListener('DOMContentLoaded', function () {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categoryContents = document.querySelectorAll('.category-content');

    // Функция для переключения категорий
    function switchCategory(category) {
        // Скрываем все категории
        categoryContents.forEach(content => {
            content.classList.remove('active');
        });

        // Убираем активный класс со всех кнопок
        categoryButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Показываем выбранную категорию
        document.getElementById(`${category}-content`).classList.add('active');

        // Делаем активной выбранную кнопку
        document.querySelector(`.category-btn[data-category="${category}"]`).classList.add('active');
    }

    // Обработчики событий для кнопок
    categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            switchCategory(category);
        });
    });
});
    </script >