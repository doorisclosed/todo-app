const baseUrl = 'http://localhost:3000';
let todoStore = [];

async function getTodos() {
    return fetch(baseUrl + '/todos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

async function addTodoAPI(todo) {
    return fetch(baseUrl + '/todos', {
        method: 'POST',
        body: JSON.stringify(todo),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

async function updateTodo(todo) {
    return fetch(baseUrl + `/todos/${todo.id}`, {
        method: 'PUT',
        body: JSON.stringify(todo),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

async function delTodo(todo) {
    return fetch(baseUrl + `/todos/${todo.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

function addTodo(todo) {
    const listElement = document.querySelector('.todo__items');
    const itemElement = document.createElement('li');

    const textElement = document.createElement('div');
    const deleteBtnElement = document.createElement('div');

    itemElement.className = 'todo-item';
    itemElement.setAttribute('todo-id', todo.id);

    textElement.className = 'todo-item__text';
    textElement.innerText = todo.text;

    deleteBtnElement.className = 'todo-item__delete';
    deleteBtnElement.innerHTML = `
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
           width="20" height="20" viewBox="0 0 348.333 348.334" style="enable-background:new 0 0 348.333 348.334;"
           xml:space="preserve">
            <g>
                <path d="M336.559,68.611L231.016,174.165l105.543,105.549c15.699,15.705,15.699,41.145,0,56.85
                    c-7.844,7.844-18.128,11.769-28.407,11.769c-10.296,0-20.581-3.919-28.419-11.769L174.167,231.003L68.609,336.563
                    c-7.843,7.844-18.128,11.769-28.416,11.769c-10.285,0-20.563-3.919-28.413-11.769c-15.699-15.698-15.699-41.139,0-56.85
                    l105.54-105.549L11.774,68.611c-15.699-15.699-15.699-41.145,0-56.844c15.696-15.687,41.127-15.687,56.829,0l105.563,105.554
                    L279.721,11.767c15.705-15.687,41.139-15.687,56.832,0C352.258,27.466,352.258,52.912,336.559,68.611z"/>
            </g>
        </svg>`;

    itemElement.appendChild(textElement);
    itemElement.appendChild(deleteBtnElement);

    listElement.appendChild(itemElement);

    toggleTodoChecked(itemElement, todo.checked);

    todo.onClickChecked = () => {
        todo.checked = !todo.checked;

        updateTodo(todo)
            .then(res => res.json())
            .then(data => {
                toggleTodoChecked(itemElement, todo.checked);
            });
    };

    todo.onClickDelete = () => {
        delTodo(todo)
         .then(data => {
             textElement.removeEventListener('click', todo.onClickChecked);
             deleteBtnElement.removeEventListener('click', todo.onClickDelete);

             itemElement.remove();
         });
    }

    textElement.addEventListener('click', todo.onClickChecked);
    deleteBtnElement.addEventListener('click', todo.onClickDelete);
}

function toggleTodoChecked(itemElement, toggle) {
    const textElement = itemElement.querySelector('.todo-item__text');
    if (textElement) {
        if (toggle) {
            textElement.classList.add('checked');
        } else {
            textElement.classList.remove('checked');
        }
    }
}

function bootstrap() {
    const addBtnElement = document.querySelector(".todo__add");

    addBtnElement.addEventListener('click', () => {
        const itemText = document.querySelector(".todo__text");

        if (itemText.value !== '') {
            const todo = {
                text: itemText.value,
                checked: false
            };

            addTodoAPI(todo)
                .then(res => res.json())
                .then(data => {
                    addTodo(data);
                });

            itemText.value = '';
        } else {
            alert("Задача не может быть пустой!");
        }
    });

    getTodos()
        .then(res => res.json())
        .then(data => {
            todoStore = data;

            todoStore.forEach(todo => {
                addTodo(todo);
            })
        });
};

bootstrap();
