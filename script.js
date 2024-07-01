function loadTodos() { 
  // This function will load the todos from the browser
  const todos = JSON.parse(localStorage.getItem("todos")) || { "todoList": [] };
  return todos;
}

function addTodoToLocalStorage(todo) {
  const todos = loadTodos();
  todos.todoList.push({...todo});  
  localStorage.setItem("todos", JSON.stringify(todos));
}


function refreshTodo(todos){ 
   localStorage.setItem("todos", JSON.stringify(todos)); 
}


function executeFilterAction(event) {
  const todoList = document.getElementById("TodoList");
  const element = event.target; // This gives us full element like <p> ... </p>  
  const value = element.getAttribute('data-filter'); // Get attribute method to get values of any attribute   
  todoList.innerHTML = '';
  const todos = loadTodos();
  if (value == 'all') {
    todos.todoList.forEach(todo => {
      appendTodoInHtml(todo);
    });
  } else if (value == 'pending') {
    todos.todoList.forEach(todo => {
      if (todo.isCompleted == false)  
        appendTodoInHtml(todo);
    });
  } else {
    todos.todoList.forEach(todo => {
      if (todo.isCompleted == true)
        appendTodoInHtml(todo);
    });
  }
}
 
function refreshTodoInHTML(todos){
  const todoList = document.getElementById('TodoList'); 
  todoList.innerHTML = ''; 
  todos.todoList.forEach(todo => {
    appendTodoInHtml(todo);
  }); 
}

 
function completeTodo(event){
  const todoItem = event.target.parentElement.parentElement;  
  const todoId = todoItem.getAttribute("data-id"); 
  const todos = loadTodos(); 
  todos.todoList.forEach(todo => {
    if (todo.id == todoId) {
      todo.isCompleted = !todo.isCompleted; 
    }
  });  
  console.log(todos); 
  refreshTodo(todos);  
  refreshTodoInHTML(todos);  
     
} 
 

function getNextId() {
  // Get the next ID from local storage or initialize it to 0
  let nextId = localStorage.getItem("nextId");
  if (nextId === null) {
    nextId = 0;
    localStorage.setItem("nextId", nextId);
  }
  return parseInt(nextId);
}

function incrementNextId() {
  // Increment the next ID in local storage
  let nextId = getNextId();
  nextId++;
  localStorage.setItem("nextId", nextId);
} 



function deleteTodo(event){ 
  const todoItem = event.target.parentElement.parentElement; 
  const todoId = todoItem.getAttribute("data-id"); 
  let todos = loadTodos();   
  todos.todoList = todos.todoList.filter(todo => todo.id != todoId );  
  refreshTodo(todos);  
  refreshTodoInHTML(todos); 
} 
 
function editTodo(event){
  const todoItem = event.target.parentElement.parentElement; 
  const todoId = todoItem.getAttribute("data-id"); 
  let todos = loadTodos();    
  const response = prompt("What is new value you want's to set ? ")  ; 
  todos.todoList.forEach(todo => {
    if (todo.id == todoId) {
      todo.text = response ;
    }
  });     
  refreshTodo(todos); 
  refreshTodoInHTML(todos);  
   
}



function appendTodoInHtml(todo) {  
  const todoList = document.getElementById("TodoList");  

  const wrapper = document.createElement("div");
  wrapper.classList.add('todoBtn');
 
  const todoItem = document.createElement("li");
  todoItem.setAttribute("data-id", todo.id);

  const textDiv = document.createElement('div');  
  if (todo.isCompleted) {
    textDiv.classList.add('complete');
  } else {
    textDiv.classList.remove('complete');
  }  

  textDiv.textContent = todo.text;
  todoItem.classList.add("todoItem");

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("editBtn"); 
  editBtn.addEventListener("click",editTodo);     

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("deleteBtn"); 
  deleteBtn.addEventListener('click',deleteTodo);

  const completeBtn = document.createElement("button");
  completeBtn.textContent = (todo.isCompleted) ? "Reset" : "Completed"; 
  completeBtn.classList.add("completedBtn");
  completeBtn.addEventListener("click", completeTodo);

  wrapper.appendChild(editBtn);
  wrapper.appendChild(deleteBtn);
  wrapper.appendChild(completeBtn);

  todoItem.appendChild(textDiv);
  todoItem.appendChild(wrapper);
  todoList.appendChild(todoItem);
}

document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todoInput");
  const submitButton = document.getElementById("addTodo");
  const filterBtns = document.getElementsByClassName('filter-btn');

  for (const btn of filterBtns) {
    btn.addEventListener("click", executeFilterAction);
  }
    
  submitButton.addEventListener("click", (event) => {
    const todoText = todoInput.value.trim(); // Trim leading/trailing whitespace

    if (todoText === "") {
      alert("Please write something for the todo");
    } else {
      const todos = loadTodos();            
      const id = getNextId(); // Get the next ID  
      addTodoToLocalStorage({ text: todoText, isCompleted: false, id: id }); 
      incrementNextId(); // Increment the next ID 
      alert('Todo Added !!');
      appendTodoInHtml({ text: todoText, isCompleted: false, id: id });
      todoInput.value = "";
    }
  });

  todoInput.addEventListener("change", (event) => {
    const todoText = event.target.value.trim();
    event.target.value = todoText;
  });

  let todos = loadTodos();
  todos.todoList.forEach(todo => {
    appendTodoInHtml(todo);
  });
});
