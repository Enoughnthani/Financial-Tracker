(function () {
    'use strict';

    let accountTypes = [];
    let currencyCode = 'ZAR';

    document.addEventListener('DOMContentLoaded', function () {
        initSidebar();
        loadUserInfo();
        loadAccountTypes();
        loadAccounts();
        initModal();
    });


    function initSidebar() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (!menuToggle || !sidebar || !overlay) {
            console.warn('Sidebar elements not found');
            return;
        }

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

                    if (user.currencyCode) {
                        currencyCode = user.currencyCode;
                    }
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

    async function loadAccountTypes() {
        try {
          /*  const response = await fetch('/api/account-types', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to load account types');
            accountTypes = await response.json();
            populateAccountTypeSelect();*/
        } catch (error) {
            console.warn('Could not load account types:', error);
            accountTypes = [
                { id: 1, name: 'Savings' },
                { id: 2, name: 'Checking' },
                { id: 3, name: 'Credit Card' },
                { id: 4, name: 'Cash' },
                { id: 5, name: 'Investment' }
            ];
            populateAccountTypeSelect();
        }
    }

    function populateAccountTypeSelect() {
        const select = document.getElementById('accountType');
        if (!select) return;

        select.innerHTML = accountTypes.map(function (type) {
            return '<option value="' + type.id + '">' + escapeHtml(type.name) + '</option>';
        }).join('');
    }


    async function loadAccounts() {
        try {
            const accounts = await getAccounts();
            renderAccounts(accounts);
            updateBadge('accountsBadge', accounts.length);
        } catch (error) {
            console.warn('Could not load accounts:', error);
            showEmptyState('Error loading accounts');
        }
    }

    function renderAccounts(accounts) {
        const container = document.getElementById('accountsContainer');
        if (!container) return;

        if (!accounts || accounts.length === 0) {
            container.innerHTML = `
                    <article class="empty-state">
                        <span class="empty-icon">🏦</span>
                        <p>No accounts yet. Create your first account!</p>
                        <button class="btn btn-primary" id="emptyAddBtn">
                            <i class="fas fa-plus"></i> Add Account
                        </button>
                    </article>
                `;

            const emptyBtn = document.getElementById('emptyAddBtn');
            if (emptyBtn) {
                emptyBtn.addEventListener('click', openModal);
            }
            return;
        }

        const symbol = getCurrencySymbol(currencyCode);

        container.innerHTML = accounts.map(function (a) {
            const balance = a.balance || 0;
            const type = a.accountType ? a.accountType.name : 'General';

            return `
                    <article class="account-card" data-id="${a.id}">
                        <header class="account-card-header">
                            <section>
                                <h3 class="account-name">${escapeHtml(a.accountName)}</h3>
                                <span class="account-type">${escapeHtml(type)}</span>
                            </section>
                            <section class="account-actions">
                                <button class="delete-btn" data-id="${a.id}" aria-label="Delete account">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </section>
                        </header>
                        <p class="account-balance">
                            <span class="currency">${symbol}</span>${formatCurrency(balance)}
                        </p>
                        <a href="/transactions.html?accountId=${a.id}" class="account-view-btn">
                            <i class="fas fa-eye"></i> View Transactions
                        </a>
                    </article>
                `;
        }).join('');

        document.querySelectorAll('.delete-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const id = parseInt(this.getAttribute('data-id'));
                deleteAccount(id);
            });
        });
    }

    async function deleteAccount(id) {
        if (!confirm('Delete this account? This will also delete all associated transactions.')) return;

        try {
            await window.deleteAccount(id);
            loadAccounts();
            showToast('Account deleted');
        } catch (error) {
            console.error('Error deleting account:', error);
            showToast('Error deleting account', 'error');
        }
    }

    function updateBadge(id, count) {
        const el = document.getElementById(id);
        if (el) el.textContent = count;
    }

    function showEmptyState(message) {
        const container = document.getElementById('accountsContainer');
        if (container) {
            container.innerHTML = `
                    <article class="empty-state">
                        <span class="empty-icon">⚠️</span>
                        <p>${message}</p>
                    </article>
                `;
        }
    }

    function initModal() {
        const overlay = document.getElementById('modalOverlay');
        const openBtn = document.getElementById('openAddModal');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelModal');
        const saveBtn = document.getElementById('saveAccount');

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
            saveBtn.addEventListener('click', saveAccount);
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
        }
    }

    function closeModal() {
        const overlay = document.getElementById('modalOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            document.getElementById('addAccountForm').reset();
        }
    }

    async function saveAccount() {
        const name = document.getElementById('accountName').value.trim();
        const balance = parseFloat(document.getElementById('accountBalance').value) || 0;
        const typeId = parseInt(document.getElementById('accountType').value);

        if (!name) {
            showToast('Please enter an account name', 'error');
            return;
        }

        const selectedType = accountTypes.find(function (t) { return t.id === typeId; });

        try {
            await window.createAccount({
                accountName: name,
                balance: balance,
                accountType: {
                    id: typeId,
                    name: selectedType ? selectedType.name : 'General'
                }
            });

            closeModal();
            loadAccounts();
            showToast('Account created successfully!');
        } catch (error) {
            console.error('Error creating account:', error);
            showToast('Error creating account: ' + error.message, 'error');
        }
    }

    function showToast(message, type) {
        if (type === 'error') {
            alert('❌ ' + message);
        } else {
            alert('✅ ' + message);
        }
    }

    function getCurrencySymbol(code) {
        const symbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'ZAR': 'R',
            'JPY': '¥'
        };
        return symbols[code] || '$';
    }

    function formatCurrency(amount) {
        return Number(amount || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
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