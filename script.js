document.addEventListener('DOMContentLoaded', function () {
  const todoInput = document.getElementById('todoInput');
  const addTodoButton = document.getElementById('addTodoButton');
  const todoList = document.getElementById('todoList');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  let currentFilter = 'all'; // 'all', 'pending', or 'completed'

  function renderTodos() {
    todoList.innerHTML = '';

    let filteredTodos = todos.filter(todo => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'completed') return todo.completed;
      if (currentFilter === 'pending') return !todo.completed;
    });

    if (filteredTodos.length === 0) {
      const emptyLi = document.createElement('li');
      emptyLi.textContent = "You don't have any task here";
      emptyLi.style.color = "#aaa";
      emptyLi.style.fontStyle = 'italic';
      emptyLi.style.textAlign = "center";
      emptyLi.style.pointerEvents = "none";
      todoList.appendChild(emptyLi);
      return;
    }

    filteredTodos.forEach((todo, idx) => {
      // Find actual index in the todos array (to support deletion and toggle)
      const realIndex = todos.indexOf(todo);

      const listItem = document.createElement('li');
      if (todo.completed) listItem.classList.add('completed');
      listItem.title = "Click to toggle completed";

      listItem.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-btn')) return;
        toggleTodo(realIndex);
      });

      // Task label
      const label = document.createElement('span');
      label.textContent = todo.text;

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'delete-btn';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTodo(realIndex);
      });

      listItem.appendChild(label);
      listItem.appendChild(deleteBtn);
      todoList.appendChild(listItem);
    });
  }

  function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;
    todos.push({ text, completed: false });
    saveTodos();
    renderTodos();
    todoInput.value = '';
  }

  function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  }

  function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
  }

  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  addTodoButton.addEventListener('click', addTodo);
  todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  });

  // FILTERING
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderTodos();
    });
  });

  renderTodos();
});
