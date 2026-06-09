let currentUser = null;

function showMessage(message, isError = false) {
  const toast = document.createElement('div');
  toast.className = 'message-toast';
  toast.style.background = isError ? '#ff4757' : '#00b894';
  toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function updateUserInfo(user) {
  document.getElementById('userNameDisplay').textContent = user.name;
  if (user.picture && user.picture !== 'https://via.placeholder.com/40') {
    document.getElementById('userAvatar').src = user.picture;
  }
  
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileEmail').textContent = user.email;
  if (user.picture) {
    document.getElementById('profileAvatar').src = user.picture;
  }
}

function handleLogout() {
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.disableAutoSelect();
  }
  
  localStorage.removeItem('finwise_currentUser');
  
  showMessage('Logged out successfully!');
  setTimeout(() => {
    window.location.href = '../index.html';
  }, 1000);
}

function loadPage(pageId) {
  document.querySelectorAll('.page-content').forEach(page => {
    page.classList.remove('active-page');
  });
  
  const selectedPage = document.getElementById(pageId + 'Page');
  if (selectedPage) {
    selectedPage.classList.add('active-page');
  }

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.page === pageId) {
      btn.classList.add('active');
    }
  });
}

function filterTransactions() {
  const filterType = document.getElementById('filterType').value;
  const searchTerm = document.getElementById('searchCategory').value.toLowerCase();
  const allTransactions = document.querySelectorAll('#transactionsList .transaction-item');
  
  allTransactions.forEach(transaction => {
    const category = transaction.querySelector('.transaction-category').textContent.toLowerCase();
    const amountClass = transaction.querySelector('.transaction-amount').classList;
    const isIncome = amountClass.contains('income');
    const isExpense = amountClass.contains('expense');
    
    let showByType = true;
    if (filterType === 'income') showByType = isIncome;
    if (filterType === 'expense') showByType = isExpense;
    
    const showBySearch = searchTerm === '' || category.includes(searchTerm);
    
    transaction.style.display = (showByType && showBySearch) ? 'flex' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const storedUser = localStorage.getItem('finwise_currentUser');
  
  if (!storedUser) {
    window.location.href = '../pages/login.html';
    return;
  }
  
  currentUser = JSON.parse(storedUser);
  updateUserInfo(currentUser);
  
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      loadPage(btn.dataset.page);
    });
  });
  
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  

  const applyFilterBtn = document.getElementById('applyFilterBtn');
  if (applyFilterBtn) {
    applyFilterBtn.addEventListener('click', filterTransactions);
  }
  
  const searchInput = document.getElementById('searchCategory');
  if (searchInput) {
    searchInput.addEventListener('keyup', filterTransactions);
  }
  
  const filterType = document.getElementById('filterType');
  if (filterType) {
    filterType.addEventListener('change', filterTransactions);
  }
  
  loadPage('overview');
});