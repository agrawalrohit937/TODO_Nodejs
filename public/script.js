const API_URL = '/api'; // Adjust to your actual backend URL

// State Management
let state = {
    user: null,
    token: localStorage.getItem('token'),
    todos: [],
    filter: 'all',
    searchQuery: '',
    isLoginMode: true
};

// Selectors
const authContainer = document.getElementById('auth-container');
const dashboardContainer = document.getElementById('dashboard-container');
const authForm = document.getElementById('auth-form');
const toggleAuth = document.getElementById('toggle-auth');
const todoList = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const logoutBtn = document.getElementById('logout-btn');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter-btn');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    if (state.token) {
        showDashboard();
        fetchTodos();
    }
});

// --- Auth Functions ---
toggleAuth.addEventListener('click', (e) => {
    e.preventDefault();
    state.isLoginMode = !state.isLoginMode;
    
    document.getElementById('auth-title').innerText = state.isLoginMode ? 'Welcome Back' : 'Create Account';
    document.getElementById('auth-subtitle').innerText = state.isLoginMode ? 'Login to manage your tasks' : 'Join us to stay organized';
    document.getElementById('name-field').style.display = state.isLoginMode ? 'none' : 'block';
    document.getElementById('auth-submit-btn').innerText = state.isLoginMode ? 'Login' : 'Register';
    document.getElementById('toggle-msg').innerText = state.isLoginMode ? "Don't have an account?" : "Already have an account?";
    toggleAuth.innerText = state.isLoginMode ? 'Register' : 'Login';
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const name = document.getElementById('reg-name').value;

    const endpoint = state.isLoginMode ? '/auth/login' : '/auth/register';
    const payload = state.isLoginMode ? { email, password } : { name, email, password };

    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Authentication failed');

        localStorage.setItem('token', data.token);
        state.token = data.token;
        showToast('Success!', state.isLoginMode ? 'Logged in successfully' : 'Account created');
        showDashboard();
        fetchTodos();
    } catch (err) {
        showToast('Error', err.message, 'danger');
    }
});

function logout() {
    localStorage.removeItem('token');
    state.token = null;
    location.reload();
}

logoutBtn.addEventListener('click', logout);

// --- Todo Functions ---
async function fetchTodos() {
    renderLoader();
    try {
        const res = await fetch(`${API_URL}/todos`, {
            headers: { 'Authorization': `Bearer ${state.token}` }
        });
        const data = await res.json();
        state.todos = data;
        renderTodos();
    } catch (err) {
        showToast('Error', 'Failed to fetch todos', 'danger');
    }
}

async function addTodo() {
    const title = todoInput.value.trim();
    if (!title) return;

    try {
        const res = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify({ title })
        });
        const newTodo = await res.json();
        state.todos.unshift(newTodo);
        todoInput.value = '';
        renderTodos();
        showToast('Task Added', 'New task created successfully');
    } catch (err) {
        showToast('Error', 'Could not add task', 'danger');
    }
}

async function toggleTodo(id, completed) {
    try {
        await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify({ completed: !completed })
        });
        state.todos = state.todos.map(t => t._id === id ? { ...t, completed: !completed } : t);
        renderTodos();
    } catch (err) {
        showToast('Error', 'Update failed', 'danger');
    }
}

async function deleteTodo(id) {
    try {
        await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${state.token}` }
        });
        state.todos = state.todos.filter(t => t._id !== id);
        renderTodos();
        showToast('Deleted', 'Task removed');
    } catch (err) {
        showToast('Error', 'Delete failed', 'danger');
    }
}

async function editTodo(id, oldTitle) {
    const newTitle = prompt('Edit Task:', oldTitle);
    if (!newTitle || newTitle === oldTitle) return;

    try {
        await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify({ title: newTitle })
        });
        state.todos = state.todos.map(t => t._id === id ? { ...t, title: newTitle } : t);
        renderTodos();
    } catch (err) {
        showToast('Error', 'Update failed', 'danger');
    }
}

// --- UI Rendering ---
function renderTodos() {
    let filtered = state.todos.filter(todo => {
        const matchesSearch = todo.title.toLowerCase().includes(state.searchQuery.toLowerCase());
        if (state.filter === 'completed') return todo.completed && matchesSearch;
        if (state.filter === 'pending') return !todo.completed && matchesSearch;
        return matchesSearch;
    });

    // Update Stats
    document.getElementById('total-count').innerText = state.todos.length;
    document.getElementById('completed-count').innerText = state.todos.filter(t => t.completed).length;

    if (filtered.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>No tasks found. Start by adding one!</p>
            </div>
        `;
        return;
    }

    todoList.innerHTML = filtered.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}">
            <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo('${todo._id}', ${todo.completed})">
            <span class="todo-text">${escapeHtml(todo.title)}</span>
            <div class="todo-actions">
                <button class="btn-icon" onclick="editTodo('${todo._id}', '${todo.title}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete-btn" onclick="deleteTodo('${todo._id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function showDashboard() {
    authContainer.style.display = 'none';
    dashboardContainer.style.display = 'block';
}

function renderLoader() {
    todoList.innerHTML = '<div class="loader"></div>';
}

function showToast(title, msg, type = 'primary') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<strong>${title}</strong><br>${msg}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// --- Event Listeners ---
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTodo());

searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderTodos();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.filter = btn.dataset.filter;
        renderTodos();
    });
});
