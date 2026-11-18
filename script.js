const input = document.getElementById("todo-input");
const todoList = document.querySelector("#todo-list");
const itemsLeft = document.getElementById("items-left");
const clearCompBtn = document.getElementById("clear-completed");
let todoArray = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";
const filterBtns = document.querySelectorAll("[data-filter]");
const themeToggleBtn = document.querySelector(".theme-toggle-btn");
const themeIcon = document.querySelector(".theme-toggle-btn img");
const darkMode = document.classList.contains("dark");
const bottomNav = document.querySelector(".bottom-nav");

bottomNav.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) {
    return;
  }
  if (button.dataset.filter === undefined) {
    return;
  }
  currentFilter = button.dataset.filter;

  renderTodos();
});

todoList.addEventListener("change", (e) => {
  const li = e.target.closest("li");
  todoArray = todoArray.map((todo) => {
    if (li.dataset.id === String(todo.id)) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });

  renderTodos();
});

todoList.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest("button");
  if (deleteBtn) {
    const li = e.target.closest("li");
    deleteTodo(li.dataset.id);
  }
});

function renderTodos() {
  const shown = todoArray.filter((todo) => {
    if (currentFilter === "active") {
      return !todo.completed;
    } else if (currentFilter === "completed") {
      return todo.completed;
    } else {
      return true;
    }
  });
  filterBtns.forEach((button) => {
    button.classList.toggle(
      "selected",
      button.dataset.filter === currentFilter,
    );
  });
  const items = shown.map((todo) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    const span = document.createElement("span");
    const deleteBtn = document.createElement("button");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `mark ${todo.text} as done`);
    span.textContent = todo.text;
    li.append(checkbox, span, deleteBtn);
    li.dataset.id = todo.id;
    li.classList.toggle("completed", todo.completed);
    deleteBtn.setAttribute("aria-label", `delete ${todo.text}`);
    return li;
  });
  const uncompleted = todoArray.filter((todo) => {
    return !todo.completed;
  });
  itemsLeft.textContent = `${uncompleted.length} ${uncompleted.length === 1 ? "item left" : "items left"}`;
  localStorage.setItem("todos", JSON.stringify(todoArray));

  todoList.replaceChildren(...items);
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

function addTodo() {
  const todoText = input.value.trim();
  if (todoText === "") {
    return;
  }
  const newTodo = { text: todoText, id: Date.now(), completed: false };

  todoArray = [...todoArray, newTodo];
  input.value = "";
  renderTodos();
}

function deleteTodo(id) {
  todoArray = todoArray.filter((todo) => {
    return Number(id) !== todo.id;
  });

  renderTodos();
}

function clearCompleted() {
  todoArray = todoArray.filter((todo) => {
    return !todo.completed;
  });
  renderTodos();
}
clearCompBtn.addEventListener("click", clearCompleted);

themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  themeIcon.src = darkMode ? "./images/icon-sun.svg" : "./images/icon-moon.svg";
  themeToggleBtn.setAttribute(
    "aria-label",
    `${darkMode ? "switch to light mode" : "switch to dark mode"}`,
  );
});

renderTodos();
