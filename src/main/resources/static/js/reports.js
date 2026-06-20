// ============================================
// REPORTS - PURE JAVASCRIPT
// ============================================

(function () {
    'use strict';

    

    // ============================================
    // DOM READY
    // ============================================
    document.addEventListener('DOMContentLoaded', function () {
        

        initSidebar();
        loadUserInfo();
        loadReportData();
        initPrint();
    });

    // ============================================
    // SIDEBAR
    // ============================================
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

    // ============================================
    // USER
    // ============================================
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

    // ============================================
    // REPORT DATA
    // ============================================
    async function loadReportData() {
        try {
            const data = await getReportSummary();
            
            updateStats(data);
            await loadTransactions();
        } catch (error) {
            console.warn('Could not load report data:', error);
        }
    }

    function updateStats(data) {
        const income = document.getElementById('reportIncome');
        const expenses = document.getElementById('reportExpenses');
        const balance = document.getElementById('reportBalance');
        const count = document.getElementById('reportCount');

        if (income) income.textContent = formatCurrency(data.totalIncome || 0);
        if (expenses) expenses.textContent = formatCurrency(data.totalExpenses || 0);
        if (balance) balance.textContent = formatCurrency(data.totalBalance || 0);
        if (count) count.textContent = data.transactionCount || 0;
    }

    async function loadTransactions() {
        try {
            const transactions = await getTransactions();

            if (transactions && transactions.length > 0) {
                showTransactionReport(transactions);
            }
        } catch (error) {
            console.warn('Could not load transactions:', error);
        }
    }

    function showTransactionReport(transactions) {
        const reportSection = document.getElementById('transactionReport');
        const tbody = document.getElementById('reportTransactionsBody');

        if (!reportSection || !tbody) return;

        // Show the report section
        reportSection.style.display = 'block';

        // Hide empty state in summary
        const emptyState = document.querySelector('#reportContent .empty-state');
        if (emptyState) {
            emptyState.style.display = 'none';
        }

        // Get last 10 transactions
        const recent = transactions.slice(0, 10);

        tbody.innerHTML = recent.map(function (t) {
            const typeClass = t.transactionType === 'INCOME' ? 'badge-income' : 'badge-expense';
            const amountClass = t.transactionType === 'INCOME' ? 'up' : 'down';

            return `
                <tr>
                    <td>${escapeHtml(t.description || 'N/A')}</td>
                    <td class="${amountClass}">${formatCurrency(t.amount)}</td>
                    <td><span class="${typeClass}">${t.transactionType}</span></td>
                    <td>${formatDate(t.transactionDate)}</td>
                </tr>
            `;
        }).join('');

        // Add summary stats
        const totalIncome = transactions.filter(function (t) {
            return t.transactionType === 'INCOME';
        }).reduce(function (sum, t) {
            return sum + (t.amount || 0);
        }, 0);

        const totalExpenses = transactions.filter(function (t) {
            return t.transactionType === 'EXPENSE';
        }).reduce(function (sum, t) {
            return sum + (t.amount || 0);
        }, 0);

        const netBalance = totalIncome - totalExpenses;

        // Add summary row
        const summaryRow = `
            <tr style="font-weight:700;background:var(--gray-50);">
                <td colspan="4" style="text-align:right;padding:0.75rem 1rem;">
                    <span style="color:var(--success);">Income: $${totalIncome.toFixed(2)}</span>
                    &nbsp;|&nbsp;
                    <span style="color:var(--danger);">Expenses: $${totalExpenses.toFixed(2)}</span>
                    &nbsp;|&nbsp;
                    <span style="color:var(--primary);">Net: $${netBalance.toFixed(2)}</span>
                </td>
            </tr>
        `;

        tbody.innerHTML += summaryRow;
    }

    // ============================================
    // PRINT
    // ============================================
    function initPrint() {
        const printBtn = document.getElementById('printBtn');
        if (printBtn) {
            printBtn.addEventListener('click', function () {
                window.print();
            });
        }
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
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