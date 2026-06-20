// ============================================
// DASHBOARD - PURE JAVASCRIPT
// ============================================

(function () {
    'use strict';

    

    let currencyCode = 'ZAR';

    // ============================================
    // DOM READY
    // ============================================
    document.addEventListener('DOMContentLoaded', function () {
        
        initSidebar();
        loadUserFromBackend();
        loadDashboardData();
    });

    // ============================================
    // SIDEBAR
    // ============================================
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

    // ============================================
    // USER
    // ============================================
    async function loadUserFromBackend() {
        

        try {
            const user = await getCurrentUser();
            

            if (user && user.fullName) {
                if (user.currencyCode) {
                    currencyCode = user.currencyCode;
                    
                }
                localStorage.setItem('user', JSON.stringify(user));
                updateUserUI(user);
            } else {
                const stored = localStorage.getItem('user');
                if (stored) {
                    const cachedUser = JSON.parse(stored);
                    if (cachedUser.currencyCode) {
                        currencyCode = cachedUser.currencyCode;
                    }
                    updateUserUI(cachedUser);
                } else {
                    showGuestUI();
                }
            }
        } catch (error) {
            console.error('❌ Error loading user:', error);
            const stored = localStorage.getItem('user');
            if (stored) {
                try {
                    const cachedUser = JSON.parse(stored);
                    if (cachedUser.currencyCode) {
                        currencyCode = cachedUser.currencyCode;
                    }
                    updateUserUI(cachedUser);
                } catch (e) {
                    showGuestUI();
                }
            } else {
                showGuestUI();
            }
        }
    }

    function updateUserUI(user) {
        if (!user || !user.fullName) {
            showGuestUI();
            return;
        }

        const name = user.fullName;
        const email = user.email || 'guest@example.com';
        const initial = name.charAt(0).toUpperCase();

        setElementText('userName', name);
        setElementText('sidebarUserName', name);
        setElementText('sidebarUserEmail', email);
        setElementText('avatar', initial);
        setElementText('welcomeMessage', 'Welcome back, ' + name + '!');

        
    }

    function showGuestUI() {
        setElementText('userName', 'Guest');
        setElementText('sidebarUserName', 'Guest');
        setElementText('sidebarUserEmail', 'guest@example.com');
        setElementText('avatar', 'G');
        setElementText('welcomeMessage', 'Welcome back!');
        
    }

    function setElementText(id, text) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = text;
        }
    }

    // ============================================
    // DASHBOARD DATA
    // ============================================
    async function loadDashboardData() {
        

        try {
            const data = await getDashboardSummary();
            

            updateStat('totalBalance', data.totalBalance || 0);
            updateStat('totalIncome', data.totalIncome || 0);
            updateStat('totalExpenses', data.totalExpenses || 0);
            updateStat('activeGoals', data.activeGoalsCount || 0);

            await loadRecentTransactions();
            await loadGoals();

            updateBadge('accountsBadge', data.accountsCount || 0);
            updateBadge('transactionsBadge', data.transactionsCount || 0);
            updateBadge('goalsBadge', data.goalsCount || 0);

            

        } catch (error) {
            console.error('❌ Error loading dashboard:', error);
        }
    }

    function updateStat(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = formatMoney(value, currencyCode);
        }
    }

    function updateBadge(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
        }
    }

    // ============================================
    // RECENT TRANSACTIONS
    // ============================================
    async function loadRecentTransactions() {
        try {
            const transactions = await getTransactions();
            const tbody = document.getElementById('recentTransactionsBody');

            if (!tbody) return;

            if (!transactions || transactions.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" class="empty-state">
                            <span class="empty-icon">📭</span>
                            <p>No transactions yet</p>
                            <a href="/transactions.html" class="btn btn-sm btn-primary">Add One</a>
                        </td>
                    </tr>
                `;
                return;
            }

            const recent = transactions.slice(0, 5);
            const symbol = getCurrencySymbol(currencyCode);
            
            tbody.innerHTML = recent.map(function (t) {
                const typeClass = t.transactionType === 'INCOME' ? 'badge-income' : 'badge-expense';
                const amountClass = t.transactionType === 'INCOME' ? 'up' : 'down';
                const sign = t.transactionType === 'INCOME' ? '+' : '';
                const formattedAmount = formatMoney(t.amount || 0, currencyCode);

                return `
                    <tr>
                        <td>${escapeHtml(t.description || 'N/A')}</td>
                        <td class="${amountClass}">${sign}${formattedAmount}</td>
                        <td><span class="${typeClass}">${t.transactionType}</span></td>
                        <td>${formatDate(t.transactionDate)}</td>
                    </tr>
                `;
            }).join('');

        } catch (error) {
            console.warn('Could not load transactions:', error);
        }
    }

    // ============================================
    // GOALS
    // ============================================
    async function loadGoals() {
        try {
            const goals = await getGoals();
            const container = document.getElementById('goalsContainer');

            if (!container) return;

            if (!goals || goals.length === 0) {
                container.innerHTML = `
                    <section class="empty-state">
                        <span class="empty-icon">🎯</span>
                        <p>No goals set yet</p>
                        <a href="/goals.html" class="btn btn-sm btn-primary">Create Goal</a>
                    </section>
                `;
                return;
            }

            const symbol = getCurrencySymbol(currencyCode);
            
            container.innerHTML = goals.map(function (g) {
                const progress = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount * 100) : 0;
                return `
                    <section class="goal-item">
                        <header class="goal-top">
                            <span>${escapeHtml(g.goalName)}</span>
                            <span>${formatMoney(g.currentAmount || 0, currencyCode)} / ${formatMoney(g.targetAmount || 0, currencyCode)}</span>
                        </header>
                        <figure class="goal-bar">
                            <span class="goal-fill" style="width:${Math.min(progress, 100)}%;"></span>
                        </figure>
                        <footer class="goal-bottom">
                            <span>${Math.round(progress)}%</span>
                            <span>${g.targetDate ? formatDate(g.targetDate) : ''}</span>
                        </footer>
                    </section>
                `;
            }).join('');

        } catch (error) {
            console.warn('Could not load goals:', error);
        }
    }

    // ============================================
    // CURRENCY HELPERS
    // ============================================
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

    // ============================================
    // MONEY FORMATTING
    // ============================================
    function formatMoney(amount, currencyCode) {
        if (amount === undefined || amount === null) {
            amount = 0;
        }
        const symbol = getCurrencySymbol(currencyCode || 'ZAR');
        return symbol + formatCurrency(amount);
    }

    function formatCurrency(amount) {
        // Format with thousands separators and 2 decimal places
        return Number(amount || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
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