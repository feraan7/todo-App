const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-btn");
const todoContainer = document.getElementById("todo-container");
const emptyState = document.getElementById("empty-state");
const allBtn = document.getElementById("all-btn");
const activeBtn = document.getElementById("active-btn");
const completedBtn = document.getElementById("completed-btn");
const clearBtn = document.getElementById("clear-btn");

const todoList = JSON.parse(localStorage.getItem("todoList")) || [];

let currentFilter = "all";
let editId = null;

function saveTodos() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

function updateFilterButtons() {
    const buttons = [allBtn, activeBtn, completedBtn];

    buttons.forEach(function(button) {
        button.className = "rounded bg-gray-200 px-3 py-2";
    });

    const activeButton = currentFilter === "active" ? activeBtn
        : currentFilter === "completed" ? completedBtn : allBtn;
    activeButton.className = "rounded bg-blue-600 px-3 py-2 text-white";
}

function displayTodos() {
    todoContainer.innerHTML = "";

    const filteredTodos = todoList.filter(function(todo) {
        if (currentFilter === "active") return !todo.completed;
        if (currentFilter === "completed") return todo.completed;
        return true;
    });

    if (filteredTodos.length === 0) {
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
    }

    filteredTodos.forEach(function(todo) {
        const todoItem = document.createElement("div");
        todoItem.className = "flex items-center justify-between rounded border p-3";

        const todoMain = document.createElement("div");
        todoMain.className = "flex min-w-0 items-center gap-2";

        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.checked = todo.completed;
        checkBox.className = "h-4 w-4";
        checkBox.setAttribute("aria-label", "Mark task as completed");

        checkBox.addEventListener("change", function() {
            todo.completed = checkBox.checked;
            saveTodos();
            displayTodos();
        });

        const todoText = document.createElement("span");
        todoText.className = todo.completed ? "break-words text-gray-400 line-through" : "break-words";
        todoText.textContent = todo.todoText;

        const todoActions = document.createElement("div");
        todoActions.className = "flex gap-2";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "rounded bg-gray-200 px-2 py-1";
        editBtn.setAttribute("aria-label", "Edit task");

        editBtn.addEventListener("click", function() {
            todoInput.value = todo.todoText;
            editId = todo.id;
            addButton.textContent = "Update Todo";
            todoInput.focus();
        });

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "rounded bg-red-100 px-2 py-1 text-red-700";
        delBtn.setAttribute("aria-label", "Delete task");

        delBtn.addEventListener("click", function() {
            const index = todoList.findIndex(function(item) {
                return item.id === todo.id;
            });

            if (index !== -1) {
                todoList.splice(index, 1);
                saveTodos();
                displayTodos();
            }
        });

        todoMain.append(checkBox, todoText);
        todoActions.append(editBtn, delBtn);
        todoItem.append(todoMain, todoActions);
        todoContainer.append(todoItem);
    });

    clearBtn.disabled = todoList.length === 0;
    updateFilterButtons();
}

function resetForm() {
    editId = null;
    addButton.textContent = "Add Todo";
    todoInput.value = "";
    todoInput.focus();
}

addButton.addEventListener("click", function() {
    const text = todoInput.value.trim();

    if (text === "") {
        alert("Please enter a todo!");
        return;
    }

    if (editId !== null) {
        const todo = todoList.find(function(item) {
            return item.id === editId;
        });

        if (todo) {
            todo.todoText = text;
        }
    } else {
        todoList.push({
            todoText: text,
            id: Date.now(),
            completed: false
        });
    }

    resetForm();
    saveTodos();
    displayTodos();
});

todoInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addButton.click();
    }
});

allBtn.addEventListener("click", function() {
    currentFilter = "all";
    displayTodos();
});

activeBtn.addEventListener("click", function() {
    currentFilter = "active";
    displayTodos();
});

completedBtn.addEventListener("click", function() {
    currentFilter = "completed";
    displayTodos();
});

clearBtn.addEventListener("click", function() {
    if (todoList.length === 0) return;

    const confirmed = confirm("Are you sure you want to delete all todos?");

    if (!confirmed) return;

    todoList.length = 0;
    resetForm();
    saveTodos();
    displayTodos();
});

displayTodos();