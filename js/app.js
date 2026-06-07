// Firebase configuration (Replace with your own Firebase project config for production)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD7fJ4kLnLpLp4qQlRz3xVxKpXpXpXpXpX",
  authDomain: "finwise-tracker-demo.firebaseapp.com",
  projectId: "finwise-tracker-demo",
  storageBucket: "finwise-tracker-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
let auth;
try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (e) {
  console.warn("Firebase init issue, using mock local auth only");
  auth = null;
}

// Mock local storage for demo persistence (when firebase fails or for offline demo)
class LocalDB {
  static getUsers() {
    let users = localStorage.getItem("finwise_users");
    if (!users) {
      const demoUser = { id: "local_demo", email: "demo@finwise.com", name: "Demo User", photoURL: null };
      localStorage.setItem("finwise_users", JSON.stringify([demoUser]));
      localStorage.setItem("finwise_currentUser", JSON.stringify(demoUser));
      return [demoUser];
    }
    return JSON.parse(users);
  }
  static saveUser(user) {
    const users = this.getUsers();
    const exists = users.find(u => u.id === user.id);
    if (!exists) users.push(user);
    localStorage.setItem("finwise_users", JSON.stringify(users));
    localStorage.setItem("finwise_currentUser", JSON.stringify(user));
  }
  static getCurrentUser() {
    return JSON.parse(localStorage.getItem("finwise_currentUser"));
  }
  static logout() {
    localStorage.removeItem("finwise_currentUser");
  }
}

// Global state
let currentUser = null;
let transactions = [];
let budget = { amount: 0, month: new Date().toISOString().slice(0,7) };
let currentPage = "dashboard";

// Helper: show floating message
function showMessage(msg, isError = false) {
  const toast = document.createElement("aside");
  toast.className = "message-toast";
  toast.style.background = isError ? "#c44536" : "#1e3a5f";
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Load user data from localStorage
function loadUserData() {
  if (!currentUser) return;
  const storageKey = `finwise_${currentUser.id}_transactions`;
  const savedTransactions = localStorage.getItem(storageKey);
  transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
  
  const budgetKey = `finwise_${currentUser.id}_budget`;
  const savedBudget = localStorage.getItem(budgetKey);
  if (savedBudget) {
    budget = JSON.parse(savedBudget);
  } else {
    budget = { amount: 0, month: new Date().toISOString().slice(0,7) };
  }
  renderCurrentPage();
}

function saveTransactions() {
  if (!currentUser) return;
  localStorage.setItem(`finwise_${currentUser.id}_transactions`, JSON.stringify(transactions));
}

function saveBudget() {
  if (!currentUser) return;
  localStorage.setItem(`finwise_${currentUser.id}_budget`, JSON.stringify(budget));
}

// Core business logic
function addTransaction(amount, type, category, date) {
  const newTransaction = {
    id: Date.now(),
    amount: parseFloat(amount),
    type,
    category,
    date: date || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };
  transactions.push(newTransaction);
  saveTransactions();
  showMessage(`${type === 'income' ? 'Income' : 'Expense'} added successfully!`);
  renderCurrentPage();
}

function getCurrentMonthExpenses() {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  return transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);
}

function getTotalIncome() {
  return transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
}

function getTotalExpenses() {
  return transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
}

// Render pages based on active user & page
function renderDashboard() {
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = totalIncome - totalExpenses;
  const monthlyExpenses = getCurrentMonthExpenses();
  const budgetAmount = budget.amount;
  const percentUsed = budgetAmount > 0 ? (monthlyExpenses / budgetAmount) * 100 : 0;
  
  const recentTransactions = [...transactions].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,5);
  
  return `
    <section>
      <h2><i class="fas fa-chart-line"></i> Financial Overview</h2>
      <article class="stats-grid">
        <article class="stat-card"><h4>Total Income</h4><p class="stat-value income">$${totalIncome.toFixed(2)}</p></article>
        <article class="stat-card"><h4>Total Expenses</h4><p class="stat-value expense">$${totalExpenses.toFixed(2)}</p></article>
        <article class="stat-card"><h4>Balance</h4><p class="stat-value balance">$${balance.toFixed(2)}</p></article>
      </article>
    </section>
    
    <section>
      <h2><i class="fas fa-wallet"></i> Monthly Budget Tracker</h2>
      <article class="budget-card">
        <p><strong>Monthly Budget:</strong> $${budget.amount.toFixed(2)}</p>
        <p><strong>Spent this month:</strong> $${monthlyExpenses.toFixed(2)}</p>
        <article class="budget-progress">
          <article class="progress-bar"><article class="progress-fill" style="width: ${Math.min(percentUsed,100)}%;"></article></article>
          <p>${percentUsed.toFixed(1)}% used</p>
        </article>
        <button id="editBudgetBtn" class="btn-secondary"><i class="fas fa-pen"></i> Update Budget</button>
      </article>
    </section>
    
    <section>
      <h2><i class="fas fa-clock"></i> Recent Transactions</h2>
      <article class="transactions-list" id="recentList">
        ${recentTransactions.length === 0 ? '<p>No transactions yet. Add one!</p>' : 
          recentTransactions.map(t => `
            <article class="transaction-item">
              <span><strong>${t.category}</strong> <small>${t.date}</small></span>
              <span class="transaction-amount ${t.type === 'income' ? 'income-text' : 'expense-text'}">
                ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
              </span>
            </article>
          `).join('')
        }
      </article>
      <button id="viewAllTransactionsBtn" style="margin-top:12px;"><i class="fas fa-list"></i> View All Transactions</button>
    </section>
  `;
}

function renderTransactionsPage() {
  let filtered = [...transactions];
  const filterType = document.getElementById('filterType')?.value || 'all';
  const searchCat = document.getElementById('searchCategory')?.value.toLowerCase() || '';
  
  if (filterType !== 'all') filtered = filtered.filter(t => t.type === filterType);
  if (searchCat) filtered = filtered.filter(t => t.category.toLowerCase().includes(searchCat));
  filtered.sort((a,b) => new Date(b.date) - new Date(a.date));
  
  return `
    <section>
      <h2><i class="fas fa-exchange-alt"></i> Transactions</h2>
      <article class="filter-bar">
        <select id="filterType">
          <option value="all" ${filterType === 'all' ? 'selected' : ''}>All</option>
          <option value="income" ${filterType === 'income' ? 'selected' : ''}>Income</option>
          <option value="expense" ${filterType === 'expense' ? 'selected' : ''}>Expenses</option>
        </select>
        <input type="text" id="searchCategory" placeholder="Search by category" value="${searchCat}">
        <button id="applyFilterBtn"><i class="fas fa-search"></i> Filter</button>
      </article>
      <article class="transactions-list">
        ${filtered.length === 0 ? '<p>No transactions match.</p>' : 
          filtered.map(t => `
            <article class="transaction-item">
              <span><strong>${t.category}</strong> <small>${t.date}</small></span>
              <span class="transaction-amount ${t.type === 'income' ? 'income-text' : 'expense-text'}">
                ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
              </span>
            </article>
          `).join('')
        }
      </article>
    </section>
    <section>
      <h2><i class="fas fa-plus-circle"></i> Add New Transaction</h2>
      <form id="addTransactionForm">
        <article class="form-group"><label>Amount ($)</label><input type="number" id="txnAmount" step="0.01" required></article>
        <article class="form-group"><label>Type</label><select id="txnType"><option value="expense">Expense</option><option value="income">Income</option></select></article>
        <article class="form-group"><label>Category</label><input type="text" id="txnCategory" placeholder="e.g., Food, Salary" required></article>
        <article class="form-group"><label>Date</label><input type="date" id="txnDate" value="${new Date().toISOString().split('T')[0]}"></article>
        <button type="submit"><i class="fas fa-save"></i> Add Transaction</button>
      </form>
    </section>
  `;
}

function renderBudgetPage() {
  const monthlyExpenses = getCurrentMonthExpenses();
  const percent = budget.amount > 0 ? (monthlyExpenses / budget.amount) * 100 : 0;
  return `
    <section>
      <h2><i class="fas fa-chart-pie"></i> Budget Management</h2>
      <article class="budget-card">
        <h3>Set Monthly Budget</h3>
        <form id="budgetForm">
          <article class="form-group"><label>Monthly Budget ($)</label><input type="number" id="budgetAmount" step="100" value="${budget.amount}" required></article>
          <button type="submit">Save Budget</button>
        </form>
      </article>
      <article>
        <h3>Tracking</h3>
        <p>Total expenses this month: <strong>$${monthlyExpenses.toFixed(2)}</strong></p>
        <p>Budget limit: <strong>$${budget.amount.toFixed(2)}</strong></p>
        <article class="budget-progress">
          <article class="progress-bar"><article class="progress-fill" style="width: ${Math.min(percent,100)}%;"></article></article>
          <p>${percent.toFixed(1)}% of budget used</p>
        </article>
        ${monthlyExpenses > budget.amount && budget.amount > 0 ? '<p style="color:#c44536; margin-top:12px;"><i class="fas fa-exclamation-triangle"></i> Warning: You have exceeded your budget!</p>' : ''}
      </article>
    </section>
  `;
}

function renderAuthScreen() {
  return `
    <section class="auth-box">
      <article style="text-align:center; margin-bottom: 32px;">
        <i class="fas fa-coins" style="font-size: 64px; color:#2A5298;"></i>
        <h2>FinWise Tracker</h2>
        <p>Sign in to manage your finances</p>
      </article>
      <button id="googleSignInBtn" class="btn-google"><i class="fab fa-google"></i> Sign in with Google</button>
      <p style="margin-top:20px; font-size:13px;">Demo: Firebase ready — or mock local session works.</p>
    </section>
  `;
}

// Navigation & event binding
function renderCurrentPage() {
  const root = document.getElementById('appRoot');
  if (!currentUser) {
    root.innerHTML = renderAuthScreen();
    attachAuthEvents();
    return;
  }
  
  let pageContent = '';
  if (currentPage === 'dashboard') pageContent = renderDashboard();
  else if (currentPage === 'transactions') pageContent = renderTransactionsPage();
  else if (currentPage === 'budget') pageContent = renderBudgetPage();
  
  root.innerHTML = `
    <nav>
      <article class="logo"><h1>FinWise <span>track smarter</span></h1></article>
      <article class="nav-links">
        <button data-page="dashboard" class="nav-btn ${currentPage === 'dashboard' ? 'active' : ''}"><i class="fas fa-tachometer-alt"></i> Dashboard</button>
        <button data-page="transactions" class="nav-btn ${currentPage === 'transactions' ? 'active' : ''}"><i class="fas fa-list-ul"></i> Transactions</button>
        <button data-page="budget" class="nav-btn ${currentPage === 'budget' ? 'active' : ''}"><i class="fas fa-piggy-bank"></i> Budget</button>
      </article>
      <article class="user-info">
        ${currentUser.photoURL ? `<img class="user-avatar" src="${currentUser.photoURL}" alt="avatar">` : `<i class="fas fa-user-circle fa-2x"></i>`}
        <span>${currentUser.displayName || currentUser.email}</span>
        <button id="logoutBtnGlobal" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Exit</button>
      </article>
    </nav>
    <main class="page active-page" id="pageContent">${pageContent}</main>
  `;
  
  attachNavEvents();
  attachPageSpecificEvents();
}

function attachNavEvents() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const page = btn.dataset.page;
      if (page) { currentPage = page; renderCurrentPage(); }
    });
  });
  const logoutBtn = document.getElementById('logoutBtnGlobal');
  if (logoutBtn) logoutBtn.addEventListener('click', () => handleLogout());
}

function attachPageSpecificEvents() {
  if (currentPage === 'dashboard') {
    const editBtn = document.getElementById('editBudgetBtn');
    if (editBtn) editBtn.onclick = () => { currentPage = 'budget'; renderCurrentPage(); };
    const viewAllBtn = document.getElementById('viewAllTransactionsBtn');
    if (viewAllBtn) viewAllBtn.onclick = () => { currentPage = 'transactions'; renderCurrentPage(); };
  }
  if (currentPage === 'transactions') {
    const form = document.getElementById('addTransactionForm');
    if (form) form.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = document.getElementById('txnAmount').value;
      const type = document.getElementById('txnType').value;
      const category = document.getElementById('txnCategory').value;
      const date = document.getElementById('txnDate').value;
      if (!amount || !category) return showMessage("Fill all fields", true);
      addTransaction(amount, type, category, date);
      renderCurrentPage();
    });
    const filterBtn = document.getElementById('applyFilterBtn');
    if (filterBtn) filterBtn.addEventListener('click', () => renderCurrentPage());
  }
  if (currentPage === 'budget') {
    const budgetForm = document.getElementById('budgetForm');
    if (budgetForm) budgetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newBudget = parseFloat(document.getElementById('budgetAmount').value);
      if (!isNaN(newBudget)) {
        budget.amount = newBudget;
        saveBudget();
        showMessage(`Budget set to $${newBudget}`);
        renderCurrentPage();
      }
    });
  }
}

function attachAuthEvents() {
  const googleBtn = document.getElementById('googleSignInBtn');
  if (googleBtn) {
    googleBtn.onclick = async () => {
      if (auth) {
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          currentUser = { id: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL };
          LocalDB.saveUser(currentUser);
          loadUserData();
          renderCurrentPage();
        } catch (err) { showMessage("Google Sign-In error, using demo mode", true); fallbackLocalDemo(); }
      } else { fallbackLocalDemo(); }
    };
  }
}

function fallbackLocalDemo() {
  let localUser = LocalDB.getCurrentUser();
  if (!localUser) {
    localUser = { id: "guest_"+Date.now(), email: "demo@finwise.com", displayName: "Demo User", photoURL: null };
    LocalDB.saveUser(localUser);
  }
  currentUser = localUser;
  loadUserData();
  renderCurrentPage();
  showMessage("Logged in as demo user (offline mode)");
}

async function handleLogout() {
  if (auth) try { await signOut(auth); } catch(e) {}
  LocalDB.logout();
  currentUser = null;
  transactions = [];
  renderCurrentPage();
  showMessage("Logged out successfully");
}

// Firebase auth state listener
if (auth) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = { id: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL };
      LocalDB.saveUser(currentUser);
      loadUserData();
      renderCurrentPage();
    } else {
      const local = LocalDB.getCurrentUser();
      if (local) { currentUser = local; loadUserData(); renderCurrentPage(); }
      else renderCurrentPage();
    }
  });
} else {
  window.addEventListener('DOMContentLoaded', () => {
    const localUser = LocalDB.getCurrentUser();
    if (localUser) { currentUser = localUser; loadUserData(); renderCurrentPage(); }
    else renderCurrentPage();
  });
}