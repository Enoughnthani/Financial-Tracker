// ============================================
// GOALS - PURE JAVASCRIPT
// ============================================

(function () {
    'use strict';

    

    // ============================================
    // DOM READY
    // ============================================
    document.addEventListener('DOMContentLoaded', function () {
        

        initSidebar();
        loadUserInfo();
        loadGoals();
        initModal();
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
    // GOALS
    // ============================================
    async function loadGoals() {
        try {
            const goals = await getGoals();
            renderGoals(goals);
            updateBadge('goalsBadge', goals.length);
        } catch (error) {
            console.warn('Could not load goals:', error);
            showEmptyState('Error loading goals');
        }
    }

    function renderGoals(goals) {
        const container = document.getElementById('goalsContainer');
        if (!container) return;

        if (!goals || goals.length === 0) {
            container.innerHTML = `
                <article class="empty-state">
                    <span class="empty-icon">🎯</span>
                    <p>No goals set yet. Create your first goal!</p>
                    <button class="btn btn-primary" id="emptyAddBtn">
                        <i class="fas fa-plus"></i> Create Goal
                    </button>
                </article>
            `;

            const emptyBtn = document.getElementById('emptyAddBtn');
            if (emptyBtn) {
                emptyBtn.addEventListener('click', openModal);
            }
            return;
        }

        container.innerHTML = goals.map(function (g) {
            const progress = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount * 100) : 0;
            const statusClass = g.status ? g.status.toLowerCase() : 'active';
            const isCompleted = progress >= 100;

            return `
                <article class="goal-card" data-id="${g.id}">
                    <header class="goal-card-header">
                        <section>
                            <h3 class="goal-name">${escapeHtml(g.goalName)}</h3>
                            <span class="goal-status ${statusClass}">${g.status || 'Active'}</span>
                        </section>
                        <section class="goal-actions">
                            <button class="delete-btn" data-id="${g.id}" aria-label="Delete goal">
                                <i class="fas fa-trash"></i>
                            </button>
                        </section>
                    </header>
                    <section class="goal-amounts">
                        <span class="current">$${formatCurrency(g.currentAmount)} saved</span>
                        <span>Target: $${formatCurrency(g.targetAmount)}</span>
                    </section>
                    <figure class="goal-progress-bar">
                        <span class="goal-progress-fill ${isCompleted ? 'completed' : ''}" 
                              style="width: ${Math.min(progress, 100)}%;"></span>
                    </figure>
                    <section class="goal-progress-labels">
                        <span>${Math.round(progress)}% Complete</span>
                        <span>${g.targetDate ? formatDate(g.targetDate) : 'No deadline'}</span>
                    </section>
                    <footer class="goal-card-footer">
                        <button class="btn btn-success btn-sm contribute-btn" data-id="${g.id}">
                            <i class="fas fa-plus"></i> Contribute
                        </button>
                        <button class="btn btn-outline btn-sm edit-btn" data-id="${g.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </footer>
                </article>
            `;
        }).join('');

        // Add delete event listeners
        document.querySelectorAll('.delete-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const id = parseInt(this.getAttribute('data-id'));
                deleteGoal(id);
            });
        });

        // Add contribute event listeners
        document.querySelectorAll('.contribute-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const id = parseInt(this.getAttribute('data-id'));
                contributeToGoal(id);
            });
        });

        // Add edit event listeners
        document.querySelectorAll('.edit-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const id = parseInt(this.getAttribute('data-id'));
                // For now, just show a message
                showToast('Edit functionality coming soon!');
            });
        });
    }

    async function deleteGoal(id) {
        if (!confirm('Delete this goal?')) return;

        try {
            await window.deleteGoal(id);
            loadGoals();
            showToast('Goal deleted');
        } catch (error) {
            console.error('Error deleting goal:', error);
            showToast('Error deleting goal', 'error');
        }
    }

    async function contributeToGoal(id) {
        const amount = prompt('Enter contribution amount:');
        if (!amount) return;

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            showToast('Please enter a valid amount', 'error');
            return;
        }

        try {
            await window.contributeToGoal(id, numAmount);
            loadGoals();
            showToast('Contribution added!');
        } catch (error) {
            console.error('Error contributing:', error);
            showToast('Error adding contribution', 'error');
        }
    }

    function updateBadge(id, count) {
        const el = document.getElementById(id);
        if (el) el.textContent = count;
    }

    function showEmptyState(message) {
        const container = document.getElementById('goalsContainer');
        if (container) {
            container.innerHTML = `
                <article class="empty-state">
                    <span class="empty-icon">⚠️</span>
                    <p>${message}</p>
                </article>
            `;
        }
    }

    // ============================================
    // MODAL
    // ============================================
    function initModal() {
        const overlay = document.getElementById('modalOverlay');
        const openBtn = document.getElementById('openAddModal');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelModal');
        const saveBtn = document.getElementById('saveGoal');

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
            saveBtn.addEventListener('click', saveGoal);
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
            // Set default date to 1 year from now
            const dateInput = document.getElementById('goalDate');
            if (dateInput && !dateInput.value) {
                const date = new Date();
                date.setFullYear(date.getFullYear() + 1);
                dateInput.value = date.toISOString().split('T')[0];
            }
        }
    }

    function closeModal() {
        const overlay = document.getElementById('modalOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            document.getElementById('addGoalForm').reset();
        }
    }

    async function saveGoal() {
        const name = document.getElementById('goalName').value.trim();
        const target = parseFloat(document.getElementById('goalTarget').value);
        const current = parseFloat(document.getElementById('goalCurrent').value) || 0;
        const date = document.getElementById('goalDate').value;

        if (!name || !target) {
            showToast('Please enter goal name and target amount', 'error');
            return;
        }

        try {
            await window.createGoal({
                goalName: name,
                targetAmount: target,
                currentAmount: current,
                targetDate: date || null,
                status: 'ACTIVE'
            });

            closeModal();
            loadGoals();
            showToast('Goal created successfully!');
        } catch (error) {
            console.error('Error creating goal:', error);
            showToast('Error creating goal', 'error');
        }
    }

    // ============================================
    // TOAST
    // ============================================
    function showToast(message, type) {
        if (type === 'error') {
            alert('❌ ' + message);
        } else {
            alert('✅ ' + message);
        }
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    function formatCurrency(amount) {
        return parseFloat(amount || 0).toFixed(2);
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