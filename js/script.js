let todos = JSON.parse(localStorage.getItem('todos')) || [];
let nextTodoId = todos.length > 0 ? Math.max(todos.map(todo => todo.id)) + 1 : 1;
const todosAlert = document.querySelector('#todos-alert');
const todoList = document.getElementById('todo-list');

const addTodo = () => {
    const todoInput = document.getElementById('todo-input');
    const title = todoInput.value.trim();
    if (title !== '') {
        const newTodo = { id: nextTodoId++, title, status: 'todo' };
        todos.push(newTodo);
        displayTodos();
        todoInput.value = '';
    }
}

const insertElements = (array) => {
    todoList.innerHTML = '';
    if (array.length > 0) {
        todosAlert.classList.add('d-none');
        array.forEach(todo => {
            const li = createTodoElement(todo);
            todoList.appendChild(li);
        });
    } else {
        todosAlert.classList.remove('d-none');
    }
    localStorage.setItem('todos', JSON.stringify(todos));
}

const createTodoElement = (todo) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex todo-item justify-content-between align-items-center';
    // li.setAttribute('draggable', "true");
    li.innerHTML = `
        <span class="fs-6">${todo.title}</span>
        <div class="todo-buttons d-flex align-items-center gap-2">
            <span class="badge">${todo.status}</span>
            <i class='bx bxs-edit fs-2' onclick="openEditModal(${todo.id})"></i>
            <i class='bx bxs-trash fs-2' onclick="deleteTodo(${todo.id})"></i>
        </div>
    `;
    return li;
}

const displayTodos = () => {
    const filterStatus = document.getElementById('filter-select');
    const searchInput = document.getElementById('search-input');
    const todoCount = document.getElementById('todo-count');
    if (filterStatus.value === 'all') {
        todoCount.innerText = todos.length;
        if (searchInput.value !== '') {
            const filteredTodos = todos.filter(todo => todo.title.toLowerCase().includes((searchInput.value.toLowerCase())));
            todoCount.innerText = filteredTodos.length;
            insertElements(filteredTodos);
        } else {
            insertElements(todos);
        }
    } else {
        let filteredTodos = todos.filter(todo => todo.status === filterStatus.value);
        todoCount.innerText = filteredTodos.length;
        if (searchInput.value !== '') {
            filteredTodos = filteredTodos.filter(todo => todo.title.toLowerCase().includes((searchInput.value.toLowerCase())));
            todoCount.innerText = filteredTodos.length;
            insertElements(filteredTodos);
        } else {
            insertElements(filteredTodos);
        }
    }
};

const deleteTodo = (id) => {
    todos = todos.filter(todo => todo.id !== id);
    displayTodos();
}

const openEditModal = (id) => {
    const todo = todos.find(todo => todo.id === id);
    const editTodoTitle = document.getElementById('editTodoTitle');
    const editTodoStatus = document.querySelector(`input[name="editTodoStatus"][value="${todo.status}"]`);
    editTodoTitle.value = todo.title;
    editTodoStatus.checked = true;
    $('#editTodoModal').modal('show');
    document.querySelector('#editTodoModal button.btn-primary').setAttribute('data-todo-id', id);
}

const saveEditedTodo = () => {
    const id = parseInt(document.querySelector('#editTodoModal button.btn-primary').getAttribute('data-todo-id'));
    const todo = todos.find(todo => todo.id === id);
    todo.title = document.getElementById('editTodoTitle').value;
    todo.status = document.querySelector('input[name="editTodoStatus"]:checked').value;
    $('#editTodoModal').modal('hide');
    displayTodos();
}

// todoList.addEventListener('dragstart', function (event) {
//     draggedItem = event.target;
//     event.target.style.opacity = '0.5';
// });

// todoList.addEventListener('dragend', function (event) {
//     draggedItem.style.opacity = '1';
// });

// todoList.addEventListener('dragover', function (event) {
//     event.preventDefault();
// });

// todoList.addEventListener('drop', function (event) {
//     event.preventDefault();
//     if (event.target.tagName === 'LI') {
//         todoList.insertBefore(draggedItem, event.target.nextSibling);
//     } else {
//         todoList.appendChild(draggedItem);
//     }
// });

displayTodos();