document.addEventListener('DOMContentLoaded', function () {
  const todoInput = document.getElementById('todoInput');
  const todoDate = document.getElementById('todoDate');
  const todoTime = document.getElementById('todoTime');
  const addTodoButton = document.getElementById('addTodoButton');
  const todoList = document.getElementById('todoList');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  let currentFilter = 'all';

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
      emptyLi.style.justifyContent = "center";
      todoList.appendChild(emptyLi);
      return;
    }

    filteredTodos.forEach((todo) => {
      const realIndex = todos.indexOf(todo);

      const listItem = document.createElement('li');
      listItem.className = todo.completed ? 'completed' : '';
      listItem.title = "Click to toggle completed";

      if (todo.editing) {
        // Edit mode UI
        const editDiv = document.createElement('div');
        editDiv.className = 'task-main editing-inputs';

        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = todo.text;
        editInput.style.marginRight = "10px";
        editInput.style.flex = "2";

        const editDate = document.createElement('input');
        editDate.type = 'date';
        editDate.value = todo.date || "";

        const editTime = document.createElement('input');
        editTime.type = 'time';
        editTime.value = todo.time || "";

        editDiv.appendChild(editInput);
        editDiv.appendChild(editDate);
        editDiv.appendChild(editTime);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.className = 'save-btn';
        saveBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          saveEdit(realIndex, editInput.value, editDate.value, editTime.value);
        });
        editDiv.appendChild(saveBtn);

        listItem.appendChild(editDiv);
      } else {
        // Normal display
        const labelWrapper = document.createElement('span');
        labelWrapper.className = 'task-main';

        const label = document.createElement('span');
        label.textContent = todo.text;

        // Date/time neatly aligned
        if (todo.date || todo.time) {
          const dateSpan = document.createElement('span');
          dateSpan.className = 'task-date-time';
          let dateStr = "";
          if (todo.date) {
            dateStr += todo.date;
          }
          if (todo.time) {
            dateStr += (todo.date ? " " : "") + todo.time;
          }
          dateSpan.textContent = dateStr ? `🗓️ ${dateStr}` : "";
          labelWrapper.appendChild(label);
          labelWrapper.appendChild(dateSpan);
        } else {
          labelWrapper.appendChild(label);
        }
        listItem.appendChild(labelWrapper);

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          todos[realIndex].editing = true;
          renderTodos();
        });
        listItem.appendChild(editBtn);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteTodo(realIndex);
        });
        listItem.appendChild(deleteBtn);

        // Click task toggles completed
        listItem.addEventListener('click', function (e) {
          if (
            e.target.classList.contains('delete-btn') ||
            e.target.classList.contains('edit-btn') ||
            e.target.classList.contains('save-btn') ||
            e.target.tagName === 'INPUT'
          ) return;
          toggleTodo(realIndex);
        });
      }

      todoList.appendChild(listItem);
    });
  }

  function addTodo() {
    const text = todoInput.value.trim();
    const date = todoDate.value;
    const time = todoTime.value;
    if (text === '') return;
    todos.push({ text, date, time, completed: false });
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoDate.value = '';
    todoTime.value = '';
  }

  function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  }

  function toggleTodo(index) {
    if (todos[index].editing) return;
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
  }

  function saveEdit(index, newText, newDate, newTime) {
    todos[index].text = newText.trim();
    todos[index].date = newDate;
    todos[index].time = newTime;
    todos[index].editing = false;
    saveTodos();
    renderTodos();
  }

  function saveTodos() {
    const todosForStorage = todos.map(todo => {
      const t = {...todo};
      delete t.editing;
      return t;
    });
    localStorage.setItem('todos', JSON.stringify(todosForStorage));
  }

  addTodoButton.addEventListener('click', addTodo);
  todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
  });
  todoDate.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
  });
  todoTime.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
  });

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
