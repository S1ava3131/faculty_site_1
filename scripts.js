// scripts.js - Общие JavaScript функции для сайта

// ==================== ФУНКЦИИ ДЛЯ РАБОТЫ С ИСТОРИЯМИ ====================

// Сохранение истории в localStorage
function saveStoryToLocal(storyData) {
    try {
        let stories = JSON.parse(localStorage.getItem('studentStories')) || [];
        storyData.id = Date.now();
        storyData.date = new Date().toLocaleDateString('ru-RU');
        stories.unshift(storyData);
        localStorage.setItem('studentStories', JSON.stringify(stories));
        console.log('История сохранена:', storyData);
        return true;
    } catch (error) {
        console.error('Ошибка при сохранении истории:', error);
        return false;
    }
}

// Загрузка историй из localStorage
function loadStoriesFromLocal() {
    try {
        return JSON.parse(localStorage.getItem('studentStories')) || [];
    } catch (error) {
        console.error('Ошибка при загрузке историй:', error);
        return [];
    }
}

// Отображение сохраненных историй
function displaySavedStories() {
    const storiesContainer = document.getElementById('storiesContainer');
    if (!storiesContainer) return;
    
    const savedStories = loadStoriesFromLocal();
    console.log('Загружены истории:', savedStories);
    
    // Удаляем только сохраненные истории (чтобы не трогать статические)
    const existingSavedStories = storiesContainer.querySelectorAll('.story-item[data-saved="true"]');
    existingSavedStories.forEach(story => story.remove());
    
    // Добавляем сохраненные истории
    savedStories.forEach((story, index) => {
        const storyElement = createStoryElement(story);
        storiesContainer.appendChild(storyElement);
        
        // Анимация появления с задержкой
        setTimeout(() => {
            storyElement.style.opacity = '1';
            storyElement.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Создание элемента истории
function createStoryElement(story) {
    const article = document.createElement('article');
    article.className = 'story-item';
    article.setAttribute('data-course', story.course);
    article.setAttribute('data-department', story.department);
    article.setAttribute('data-saved', 'true');
    
    const departmentColors = {
        'software': '#27ae60',
        'ai': '#8e44ad', 
        'security': '#d35400'
    };
    
    const departmentNames = {
        'software': 'Программная инженерия',
        'ai': 'Искусственный интеллект',
        'security': 'Кибербезопасность'
    };
    
    const courseNames = {
        '1': '1 курс',
        '2': '2 курс', 
        '3': '3 курс',
        '4': '4 курс',
        'graduate': 'Выпускник'
    };

    article.innerHTML = `
        <div class="story-meta">
            <strong>${escapeHtml(story.name)}</strong>
            <span class="story-badge">${courseNames[story.course]}</span>
            <span class="story-badge" style="background: ${departmentColors[story.department]};">
                ${departmentNames[story.department]}
            </span>
        </div>
        <h3>${escapeHtml(story.title)}</h3>
        <p>${escapeHtml(story.text)}</p>
        <div class="story-meta">
            <small>Опубликовано: ${story.date}</small>
            ${story.email ? `<small>Email: ${escapeHtml(story.email)}</small>` : ''}
        </div>
    `;
    
    return article;
}

// Экранирование HTML для безопасности
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== ФУНКЦИИ ДЛЯ ФОРМЫ (ТЕПЕРЬ ТОЛЬКО ДЛЯ ADD-STORY.HTML) ====================

// Инициализация формы добавления истории
function initStoryForm() {
    const storyForm = document.getElementById('storyForm');
    
    if (!storyForm) {
        console.log('Форма не найдена на этой странице');
        return;
    }
    
    console.log('Инициализация формы добавления истории');
    
    // Обработчик отправки формы
    storyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Форма отправлена');
        
        if (validateForm()) {
            submitStoryForm();
        }
    });
    
    // Обработчик сброса формы
    storyForm.addEventListener('reset', function() {
        clearAllErrors();
        const textCounter = document.getElementById('textCounter');
        if (textCounter) {
            textCounter.textContent = 'Осталось символов: 2000';
            textCounter.className = 'char-counter';
        }
    });
}

// Валидация формы
function validateForm() {
    let isValid = true;
    
    // Валидация имени
    const name = document.getElementById('studentName');
    const nameError = document.getElementById('nameError');
    if (!name.value.trim()) {
        showError(name, nameError, 'Пожалуйста, введите ваше ФИО');
        isValid = false;
    } else {
        hideError(name, nameError);
    }
    
    // Валидация курса
    const course = document.getElementById('studentCourse');
    const courseError = document.getElementById('courseError');
    if (!course.value) {
        showError(course, courseError, 'Пожалуйста, выберите курс');
        isValid = false;
    } else {
        hideError(course, courseError);
    }
    
    // Валидация кафедры
    const department = document.getElementById('studentDepartment');
    const departmentError = document.getElementById('departmentError');
    if (!department.value) {
        showError(department, departmentError, 'Пожалуйста, выберите кафедру');
        isValid = false;
    } else {
        hideError(department, departmentError);
    }
    
    // Валидация заголовка
    const title = document.getElementById('storyTitle');
    const titleError = document.getElementById('titleError');
    if (!title.value.trim()) {
        showError(title, titleError, 'Пожалуйста, введите заголовок истории');
        isValid = false;
    } else {
        hideError(title, titleError);
    }
    
    // Валидация текста
    const text = document.getElementById('storyText');
    const textError = document.getElementById('textError');
    if (!text.value.trim()) {
        showError(text, textError, 'Пожалуйста, напишите вашу историю');
        isValid = false;
    } else {
        hideError(text, textError);
    }
    
    // Валидация email (необязательное поле)
    const email = document.getElementById('studentEmail');
    const emailError = document.getElementById('emailError');
    if (email.value && !isValidEmail(email.value)) {
        showError(email, emailError, 'Пожалуйста, введите корректный email');
        isValid = false;
    } else {
        hideError(email, emailError);
    }
    
    return isValid;
}

// Отправка формы
function submitStoryForm() {
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    
    // Показываем индикатор загрузки
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
    }
    
    // Собираем данные формы
    const formData = {
        name: document.getElementById('studentName').value.trim(),
        course: document.getElementById('studentCourse').value,
        department: document.getElementById('studentDepartment').value,
        title: document.getElementById('storyTitle').value.trim(),
        text: document.getElementById('storyText').value.trim(),
        email: document.getElementById('studentEmail').value.trim()
    };
    
    // Имитация задержки отправки
    setTimeout(() => {
        // Сохраняем историю
        const saved = saveStoryToLocal(formData);
        
        if (saved) {
            // Показываем сообщение об успехе
            if (successMessage) {
                successMessage.style.display = 'block';
            }
            
            // Сбрасываем форму
            document.getElementById('storyForm').reset();
            
            // Сбрасываем счетчик символов
            const textCounter = document.getElementById('textCounter');
            if (textCounter) {
                textCounter.textContent = 'Осталось символов: 2000';
                textCounter.className = 'char-counter';
            }
        }
        
        // Восстанавливаем кнопку
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить историю';
        }
        
        // Скрываем сообщение об успехе через 5 секунд
        if (successMessage) {
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        }
    }, 1500);
}

// ==================== ФУНКЦИИ ВАЛИДАЦИИ ====================

// Проверка email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Показать ошибку
function showError(inputElement, errorElement, message) {
    inputElement.classList.add('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Скрыть ошибку
function hideError(inputElement, errorElement) {
    inputElement.classList.remove('error');
    errorElement.style.display = 'none';
}

// Очистить все ошибки
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(error => {
        error.style.display = 'none';
    });
    
    const inputElements = document.querySelectorAll('.form-control');
    inputElements.forEach(input => {
        input.classList.remove('error');
    });
}

// ==================== ФУНКЦИИ ФИЛЬТРАЦИИ (ТОЛЬКО ДЛЯ STORIES.HTML) ====================

// Инициализация фильтрации историй
function initStoriesFilter() {
    const filterCourse = document.getElementById('filterCourse');
    const filterDepartment = document.getElementById('filterDepartment');
    const resetFilters = document.getElementById('resetFilters');
    const noStoriesMessage = document.getElementById('noStoriesMessage');
    
    if (!filterCourse || !filterDepartment) return;
    
    function applyFilters() {
        const selectedCourse = filterCourse.value;
        const selectedDepartment = filterDepartment.value;
        let visibleCount = 0;
        
        const allStories = document.querySelectorAll('.story-item');
        
        allStories.forEach(item => {
            const itemCourse = item.getAttribute('data-course');
            const itemDepartment = item.getAttribute('data-department');
            
            const courseMatch = selectedCourse === 'all' || itemCourse === selectedCourse;
            const departmentMatch = selectedDepartment === 'all' || itemDepartment === selectedDepartment;
            
            if (courseMatch && departmentMatch) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Показываем/скрываем сообщение "Истории не найдены"
        if (noStoriesMessage) {
            noStoriesMessage.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }
    
    // Обработчики событий
    filterCourse.addEventListener('change', applyFilters);
    filterDepartment.addEventListener('change', applyFilters);
    
    if (resetFilters) {
        resetFilters.addEventListener('click', function(e) {
            e.preventDefault();
            filterCourse.value = 'all';
            filterDepartment.value = 'all';
            applyFilters();
        });
    }
    
    // Применяем фильтры при загрузке
    applyFilters();
}

// ==================== АНИМАЦИИ ====================

// Анимация появления историй
function initStoriesAnimation() {
    const storyItems = document.querySelectorAll('.story-item:not([data-saved="true"])');
    
    storyItems.forEach((item, index) => {
        // Устанавливаем начальное состояние
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Анимируем появление с задержкой
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Счетчик символов
function initCharCounter() {
    const storyText = document.getElementById('storyText');
    const textCounter = document.getElementById('textCounter');
    
    if (storyText && textCounter) {
        storyText.addEventListener('input', function() {
            const remaining = 2000 - this.value.length;
            textCounter.textContent = `Осталось символов: ${remaining}`;
            
            // Изменяем стиль в зависимости от количества оставшихся символов
            if (remaining < 100) {
                textCounter.className = 'char-counter warning';
            } else if (remaining < 0) {
                textCounter.className = 'char-counter error';
            } else {
                textCounter.className = 'char-counter';
            }
        });
        
        // Инициализируем счетчик при загрузке
        const remaining = 2000 - storyText.value.length;
        textCounter.textContent = `Осталось символов: ${remaining}`;
    }
}

// ==================== ОБРАБОТЧИКИ СТРАНИЦ ====================

// Инициализация для страницы историй
function initStoriesPage() {
    console.log('Инициализация страницы историй');
    initStoriesAnimation();
    initStoriesFilter();
    displaySavedStories();
}

// Инициализация для страницы добавления истории
function initAddStoryPage() {
    console.log('Инициализация страницы добавления истории');
    initStoryForm();
    initCharCounter();
}

// Инициализация для главной страницы
function initHomePage() {
    console.log('Инициализация главной страницы');
    
    // Анимация карточек
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ==================== ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация скриптов...');
    
    // Определяем текущую страницу и инициализируем соответствующие функции
    const currentPage = document.body.getAttribute('data-page') || 
                       document.querySelector('title').textContent.toLowerCase();
    
    if (currentPage.includes('истории') || window.location.pathname.includes('stories')) {
        initStoriesPage();
    } else if (currentPage.includes('добавить') || window.location.pathname.includes('add-story')) {
        initAddStoryPage();
    } else if (currentPage.includes('главная') || window.location.pathname.includes('index')) {
        initHomePage();
    }
    
    // Общая инициализация для всех страниц
    initCommonFeatures();
});

// Общие функции для всех страниц
function initCommonFeatures() {
    // Плавная прокрутка для якорей
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Функция для отладки
function debugStories() {
    const stories = loadStoriesFromLocal();
    console.log('Все сохраненные истории:', stories);
    return stories;
}

// Экспортируем функции для глобального использования
window.debugStories = debugStories;
window.saveStoryToLocal = saveStoryToLocal;
window.loadStoriesFromLocal = loadStoriesFromLocal;