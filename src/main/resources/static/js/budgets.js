// ============================================
// BUDGETS - PURE JAVASCRIPT
// ============================================

(function() {
    'use strict';

    

    // ============================================
    // DOM READY
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        
        
        initSidebar();
        loadUserInfo();
        loadBudgets();
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

        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', function() {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });

        document.querySelectorAll('.sidebar-nav a').forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth < 1024) {
                    sidebar.classList.remove('open');
                    overlay.classList.remove('active');
                }
            });
        });

        document.addEventListener('keydown', function(e) {
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
    // BUDGETS
    // ============================================
    async function loadBudgets() {
        try {
            const budgets = await getBudgets();
            renderBudgets(budgets);
        } catch (error) {
            console.warn('Could not load budgets:', error);
            showEmptyState('Error loading budgets');
        }
    }

    function renderBudgets(budgets) {
        const container = document.getElementById('budgetsContainer');
        if (!container) return;

        if (!budgets || budgets.length === 0) {
            container.innerHTML = `
                <article class="empty-state">
                    <span class="empty-icon">📋</span>
                    <p>No budgets yet. Create your first budget!</p>
                    <button class="btn btn-primary" id="emptyAddBtn">
                        <i class="fas fa-plus"></i> Create Budget
                    </button>
                </article>
            `;
            
            const emptyBtn = document.getElementById('emptyAddBtn');
            if (emptyBtn) {
                emptyBtn.addEventListener('click', openModal);
            }
            return;
        }

        container.innerHTML = budgets.map(function(b) {
            const amount = b.amount || 0;
            const category = b.category ? b.category.name : 'General';
            const spent = b.spent || 0;
            const progress = amount > 0 ? Math.min((spent / amount) * 100, 100) : 0;
            
            let progressClass = '';
            if (progress > 90) progressClass = 'danger';
            else if (progress > 70) progressClass = 'warning';
            
            return `
                <article class="budget-card" data-id="${b.id}">
                    <header class="budget-card-header">
                        <section>
                            <h3 class="budget-name">${escapeHtml(b.name || 'Budget')}</h3>
                            <span class="budget-category">${escapeHtml(category)}</span>
                        </section>
                        <section class="budget-actions">
                            <button class="delete-btn" data-id="${b.id}" aria-label="Delete budget">
                                <i class="fas fa-trash"></i>
                            </button>
                        </section>
                    </header>
                    <p class="budget-amount">
                        <span class="currency">$</span>${formatCurrency(amount)}
                    </p>
                    <p class="budget-period">Monthly budget</p>
                    <section class="budget-progress">
                        <figure class="budget-progress-bar">
                            <span class="budget-progress-fill ${progressClass}" style="width: ${progress}%;"></span>
                        </figure>
                        <section class="budget-progress-labels">
                            <span class="budget-spent">$${formatCurrency(spent)} spent</span>
                            <span>${Math.round(progress)}%</span>
                        </section>
                    </section>
                </article>
            `;
        }).join('');

        // Add delete event listeners
        document.querySelectorAll('.delete-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteBudget(id);
            });
        });
    }

    async function deleteBudget(id) {
        if (!confirm('Delete this budget?')) return;

        try {
            await window.deleteBudget(id);
            loadBudgets();
            showToast('Budget deleted');
        } catch (error) {
            console.error('Error deleting budget:', error);
            showToast('Error deleting budget', 'error');
        }
    }

    function showEmptyState(message) {
        const container = document.getElementById('budgetsContainer');
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
        const saveBtn = document.getElementById('saveBudget');

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
            overlay.addEventListener('click', function(e) {
                if (e.target === this) closeModal();
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', saveBudget);
        }

        document.addEventListener('keydown', function(e) {
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
            document.getElementById('addBudgetForm').reset();
        }
    }

    async function saveBudget() {
        const name = document.getElementById('budgetName').value.trim();
        const amount = parseFloat(document.getElementById('budgetAmount').value);
        const category = document.getElementById('budgetCategory').value;

        if (!name || !amount) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        try {
            await window.createBudget({
                name: name,
                amount: amount,
                category: { name: category }
            });

            closeModal();
            loadBudgets();
            showToast('Budget created successfully!');
        } catch (error) {
            console.error('Error creating budget:', error);
            showToast('Error creating budget', 'error');
        }
    }
    async function increaseBudget(id){

    const amount = prompt("How much would you like to add?");

    if(amount == null) return;

    await fetch(`/api/budgets/${id}/increase?amount=${amount}`,{
        method:"PATCH"
    });

    loadBudgets();
    document.querySelectorAll(".increase-btn").forEach(button=>{

    button.addEventListener("click",function(){

        increaseBudget(this.dataset.id);

    });

});
}
    async function decreaseBudget(id){

    const amount = prompt("How much would you like to subtract?");

    if(amount == null) return;

    await fetch(`/api/budgets/${id}/decrease?amount=${amount}`,{
        method:"PATCH"
    });

    loadBudgets();
    document.querySelectorAll(".decrease-btn").forEach(button=>{

    button.addEventListener("click",function(){

        decreaseBudget(this.dataset.id);

    });

});

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

    function escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) {
            return map[m];
        });
    }

})();
