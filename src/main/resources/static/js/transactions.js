(function () {
    'use strict';

    

    let allTransactions = [];
    let allAccounts = [];
    let allCategories = [];

    document.addEventListener('DOMContentLoaded', function () {
        

        initSidebar();
        loadUserInfo();
        loadAccounts();
        loadCategories();
        loadTransactions();
        initModal();
        initFilters();
    });

    function initSidebar() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (!menuToggle || !sidebar || !overlay) return;

        menuToggle.addEventListener('click', function () {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', function () {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });

        document.querySelectorAll('.sidebar-nav a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth < 1024) {
                    sidebar.classList.remove('open');
                    overlay.classList.remove('active');
                }
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }
        });
    }

    function loadUserInfo() {
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                const user = JSON.parse(stored);
                if (user && user.fullName) {
                    setElementText('userName', user.fullName);
                    setElementText('sidebarUserName', user.fullName);
                    setElementText('sidebarUserEmail', user.email || 'guest@example.com');
                    setElementText('avatar', user.fullName.charAt(0).toUpperCase());
                }
            } catch (e) {
                console.warn('Error parsing user:', e);
            }
        }
    }

    function setElementText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    async function loadAccounts() {
        try {
            allAccounts = await getAccounts();
            populateAccountSelects();
        } catch (error) {
            console.warn('Could not load accounts:', error);
        }
    }

    async function loadCategories() {
        try {
            const response = await fetch('/api/categories', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to load categories');
            allCategories = await response.json();
            populateCategorySelect();
        } catch (error) {
            console.warn('Could not load categories:', error);
            allCategories = [
                { id: 1, name: 'Food' },
                { id: 2, name: 'Transport' },
                { id: 3, name: 'Rent' },
                { id: 4, name: 'Salary' },
                { id: 5, name: 'Other' }
            ];
            populateCategorySelect();
        }
    }

    function populateCategorySelect() {
        const select = document.getElementById('transactionCategory');
        if (!select) return;

        const categories = allCategories.map(function (c) {
            return '<option value="' + c.id + '">' + escapeHtml(c.name) + '</option>';
        }).join('');

        select.innerHTML = '<option value="">Select Category</option>' + categories;
    }

    function populateAccountSelects() {
        const filterSelect = document.getElementById('filterAccount');
        const modalSelect = document.getElementById('transactionAccount');

        const options = allAccounts.map(function (a) {
            return '<option value="' + a.id + '">' + escapeHtml(a.accountName) + '</option>';
        }).join('');

        if (filterSelect) {
            filterSelect.innerHTML = '<option value="">All Accounts</option>' + options;
        }

        if (modalSelect) {
            modalSelect.innerHTML = '<option value="">Select Account</option>' + options;
        }
    }

    async function loadTransactions() {
        try {
            allTransactions = await getTransactions();
            renderTransactions(allTransactions);
            updateBadge('transactionsBadge', allTransactions.length);
        } catch (error) {
            console.warn('Could not load transactions:', error);
            showEmptyState('Error loading transactions');
        }
    }

    function renderTransactions(transactions) {
        const tbody = document.getElementById('transactionsBody');
        if (!tbody) return;

        if (!transactions || transactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <span class="empty-icon">📭</span>
                        <p>No transactions yet</p>
                        <a href="#" class="btn btn-sm btn-primary" id="emptyAddBtn">Add One</a>
                    </td>
                </tr>
            `;

            const emptyBtn = document.getElementById('emptyAddBtn');
            if (emptyBtn) {
                emptyBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    openModal();
                });
            }
            return;
        }

        tbody.innerHTML = transactions.map(function (t) {
            const typeClass = t.transactionType === 'INCOME' ? 'badge-income' : 'badge-expense';
            const amountClass = t.transactionType === 'INCOME' ? 'up' : 'down';

            return `
                <tr>
                    <td>${escapeHtml(t.description || 'N/A')}</td>
                    <td>${t.accountName ? escapeHtml(t.accountName) : 'N/A'}</td>
                    <td>${t.category ? escapeHtml(t.category) : 'Uncategorized'}</td>
                    <td class="${amountClass}">${formatCurrency(t.amount)}</td>
                    <td><span class="${typeClass}">${t.transactionType}</span></td>
                    <td>${formatDate(t.transactionDate)}</td>
                    <td>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${t.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        document.querySelectorAll('.delete-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const id = parseInt(this.getAttribute('data-id'));
                deleteTransaction(id);
            });
        });
    }

    async function deleteTransaction(id) {
        if (!confirm('Delete this transaction?')) return;

        try {
            await window.deleteTransaction(id);
            loadTransactions();
            showToast('Transaction deleted');
        } catch (error) {
            console.error('Error deleting transaction:', error);
            showToast('Error deleting transaction', 'error');
        }
    }

    function updateBadge(id, count) {
        const el = document.getElementById(id);
        if (el) el.textContent = count;
    }

    function showEmptyState(message) {
        const tbody = document.getElementById('transactionsBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <span class="empty-icon">⚠️</span>
                        <p>${message}</p>
                    </td>
                </tr>
            `;
        }
    }

    function initFilters() {
        const form = document.getElementById('filterForm');
        const clearBtn = document.getElementById('clearFilters');

        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                applyFilters();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', function () {
                document.getElementById('filterAccount').value = '';
                document.getElementById('filterType').value = '';
                renderTransactions(allTransactions);
            });
        }
    }

    function applyFilters() {
        const accountId = document.getElementById('filterAccount').value;
        const type = document.getElementById('filterType').value;

        let filtered = allTransactions;

        if (accountId) {
            filtered = filtered.filter(function (t) {
                return t.account && t.account.id == accountId;
            });
        }

        if (type) {
            filtered = filtered.filter(function (t) {
                return t.transactionType === type;
            });
        }

        renderTransactions(filtered);
    }

    function initModal() {
        const overlay = document.getElementById('modalOverlay');
        const openBtn = document.getElementById('openAddModal');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelModal');
        const saveBtn = document.getElementById('saveTransaction');

        if (openBtn) {
            openBtn.addEventListener('click', openModal);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeModal);
        }

        if (overlay) {
            overlay.addEventListener('click', function (e) {
                if (e.target === this) closeModal();
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', saveTransaction);
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeModal();
        });
    }

    function openModal() {
        const overlay = document.getElementById('modalOverlay');
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            const dateInput = document.getElementById('transactionDate');
            if (dateInput && !dateInput.value) {
                dateInput.value = new Date().toISOString().split('T')[0];
            }
        }
    }

    function closeModal() {
        const overlay = document.getElementById('modalOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            document.getElementById('addTransactionForm').reset();
        }
    }

    async function saveTransaction() {
        const description = document.getElementById('transactionDescription').value.trim();
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const type = document.getElementById('transactionType').value;
        const accountId = document.getElementById('transactionAccount').value;
        const categoryId = document.getElementById('transactionCategory').value;
        const date = document.getElementById('transactionDate').value;

        if (!description || !amount || !accountId) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        try {
            const selectedCategory = allCategories.find(function (c) {
                return c.id == categoryId;
            });

            await window.createTransaction({
                description: description,
                amount: amount,
                transactionType: type,
                accountId: parseInt(accountId),
                category: selectedCategory ? selectedCategory.name : null,
                transactionDate: date || new Date().toISOString().split('T')[0]
            });

            closeModal();
            loadTransactions();
            showToast('Transaction added successfully!');
        } catch (error) {
            console.error('Error creating transaction:', error);
            showToast('Error creating transaction', 'error');
        }
    }

    function showToast(message, type) {
        if (type === 'error') {
            alert('❌ ' + message);
        } else {
            alert('✅ ' + message);
        }
    }

    function formatCurrency(amount) {
        return '$' + parseFloat(amount || 0).toFixed(2);
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
    }

    function escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function (m) {
            return map[m];
        });
    }

})();