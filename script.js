
// Знаходимо потрібні елементи сторінки
const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const clearButton = document.getElementById("clearButton");
const filterButtons = document.querySelectorAll(".filter");

// Завантажуємо завдання з localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Зберігаємо завдання у браузері
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Оновлюємо лічильник
function updateCounter() {
    const total = tasks.length;
    const active = tasks.filter(task => !task.completed).length;

    counter.textContent =
        `Усього: ${total} | Не виконано: ${active}`;
}

// Показуємо завдання на сторінці
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function(task) {
        // Перевіряємо, чи підходить завдання до фільтра
        if (currentFilter === "active" && task.completed) {
            return;
        }

        if (currentFilter === "completed" && !task.completed) {
            return;
        }

        // Створюємо пункт списку
        const li = document.createElement("li");
        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }

        // Створюємо чекбокс
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        // Позначаємо завдання виконаним або активним
        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        // Додаємо текст завдання
        const span = document.createElement("span");
        span.textContent = task.text;

        // Створюємо кнопку видалення
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Видалити";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function() {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        // Додаємо елементи до списку
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });

    updateCounter();
}

// Додаємо нове завдання
function addTask() {
    const text = taskInput.value.trim();

    // Не додаємо порожній текст
    if (text === "") {
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    renderTasks();
}

// Додавання кнопкою
addButton.addEventListener("click", addTask);

// Додавання клавішею Enter
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Перемикання фільтрів
filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(item) {
            item.classList.remove("active");
        });

        button.classList.add("active");
        renderTasks();
    });
});

// Видаляємо всі виконані завдання
clearButton.addEventListener("click", function() {
    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();
});

// Відображаємо збережені завдання при відкритті сайту
renderTasks();
