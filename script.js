/* ===================================================
   Manajemen Tugas
   - Tambah, edit, hapus, toggle selesai
   - Simpan di localStorage
   - Dark mode dengan persistensi
   =================================================== */

// ----- DOM Elements -----
const taskInput  = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const todoList   = document.getElementById('todoList');
const doneList   = document.getElementById('doneList');
const themeToggle = document.getElementById('themeToggle');

// ----- Data -----
let tasks    = JSON.parse(localStorage.getItem('tasks')) || [];
let darkMode = localStorage.getItem('darkMode') === 'true';

// ----- Init -----
setTheme(darkMode);
renderTasks();

// ----- Event Listeners -----
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keyup', e => {
  if (e.key === 'Enter') addTask();
});

themeToggle.addEventListener('click', () => {
  darkMode = !darkMode;
  setTheme(darkMode);
  localStorage.setItem('darkMode', darkMode);
});

// ----- Functions -----
function addTask() {
  const text = taskInput.value.trim();
  if (!text) { alert('Tugas tidak boleh kosong!'); return; }

  tasks.push({ id: Date.now(), text, done: false });
  taskInput.value = '';
  saveAndRender();
}

function toggleDone(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  saveAndRender();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  const newText = prompt('Edit tugas:', task.text);
  if (newText !== null) {
    task.text = newText.trim() || task.text;
    saveAndRender();
  }
}

function deleteTask(id) {
  if (!confirm('Hapus tugas ini?')) return;
  tasks = tasks.filter(t => t.id !== id);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function renderTasks() {
  todoList.innerHTML = '';
  doneList.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.done ? ' done' : '');

    // teks
    const span = document.createElement('span');
    span.textContent = task.text;

    // tombol
    const actions = document.createElement('div');
    actions.append(
      createBtn(task.done ? 'Belum'  : 'Selesai', () => toggleDone(task.id)),
      createBtn('Edit',   () => editTask(task.id)),
      createBtn('Hapus',  () => deleteTask(task.id))
    );

    li.append(span, actions);
    (task.done ? doneList : todoList).appendChild(li);
  });
}

function createBtn(label, handler) {
  const btn = document.createElement('button');
  btn.className = 'task-btn';
  btn.textContent = label;
  btn.onclick = handler;
  return btn;
}

function setTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  themeToggle.textContent = isDark ? '☀️' : '🌙';
}
