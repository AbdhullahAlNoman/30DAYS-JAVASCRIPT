// Day8 To-Do List App
// plain JS using localStorage; modern but compatible code

const STORAGE_KEY = 'day8_todo_tasks_v1';

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const itemsLeft = document.getElementById('items-left');
const filters = document.querySelectorAll('.filter');
const clearCompletedBtn = document.getElementById('clear-completed');

let tasks = []; // {id, text, completed}
let currentFilter = 'all';

// ----- storage helpers -----
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load tasks:', e);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks:', e);
  }
}

// ----- UI render -----
function render() {
  // filter tasks
  const visible = tasks.filter(t => {
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true;
  });

  // clear list
  taskList.innerHTML = '';

  if (visible.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'task-item';
    empty.innerHTML = '<div style="color:var(--muted);padding:8px">No tasks</div>';
    taskList.appendChild(empty);
  }

  visible.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;

    // checkbox
    const cb = document.createElement('button');
    cb.className = 'checkbox' + (task.completed ? ' checked' : '');
    cb.setAttribute('aria-label', task.completed ? 'Mark as not completed' : 'Mark as completed');
    cb.innerText = task.completed ? '✓' : '';
    cb.addEventListener('click', () => toggleComplete(task.id));

    // text / editable
    const textWrap = document.createElement('div');
    textWrap.className = 'task-text' + (task.completed ? ' completed' : '');
    textWrap.tabIndex = 0;
    textWrap.innerText = task.text;
    // double click to edit
    textWrap.addEventListener('dblclick', () => startEdit(task.id, li));

    // actions: edit button + delete
    const actions = document.createElement('div');
    actions.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.title = 'Edit';
    editBtn.innerText = '✎';
    editBtn.addEventListener('click', () => startEdit(task.id, li));

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn';
    delBtn.title = 'Delete';
    delBtn.innerText = '🗑';
    delBtn.addEventListener('click', () => deleteTask(task.id));

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(cb);
    li.appendChild(textWrap);
    li.appendChild(actions);

    taskList.appendChild(li);
  });

  // update items left
  const left = tasks.filter(t => !t.completed).length;
  itemsLeft.innerText = `${left} item${left !== 1 ? 's' : ''} left`;
}

// ----- operations -----
function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const newTask = { id: Date.now().toString(), text: trimmed, completed: false };
  tasks.unshift(newTask); // newest on top
  saveTasks();
  render();
}

function toggleComplete(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

function startEdit(id, liElement) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  // replace the text element with input
  const input = document.createElement('input');
  input.className = 'edit-input';
  input.value = task.text;
  input.setAttribute('aria-label', 'Edit task');
  // focus and select
  liElement.querySelector('.task-text')?.replaceWith(input);
  input.focus();
  input.select();

  function finish(save) {
    if (save) {
      const newText = input.value.trim();
      if (newText) {
        tasks = tasks.map(t => t.id === id ? { ...t, text: newText } : t);
      } else {
        // if emptied, delete
        tasks = tasks.filter(t => t.id !== id);
      }
      saveTasks();
    }
    render();
    // cleanup listeners
    input.removeEventListener('blur', onBlur);
    input.removeEventListener('keydown', onKey);
  }

  function onBlur() { finish(true); }
  function onKey(e) {
    if (e.key === 'Enter') finish(true);
    if (e.key === 'Escape') finish(false);
  }

  input.addEventListener('blur', onBlur);
  input.addEventListener('keydown', onKey);
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  render();
}

function setFilter(filter) {
  currentFilter = filter;
  filters.forEach(f => f.classList.toggle('active', f.dataset.filter === filter));
  render();
}

// ----- events -----
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(taskInput.value);
  taskInput.value = '';
  taskInput.focus();
});

filters.forEach(btn => {
  btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

clearCompletedBtn.addEventListener('click', () => {
  clearCompleted();
});

// keyboard shortcut: Enter in input adds, ESC clears input
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') taskInput.value = '';
});

// ----- init -----
(function init() {
  tasks = loadTasks();
  render();
})();
