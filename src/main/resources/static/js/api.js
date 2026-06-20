// ============================================
// API - PURE JAVASCRIPT
// ============================================

(function () {
    'use strict';

    const API_BASE = '/api';

    

    // ============================================
    // USER
    // ============================================
    window.getCurrentUser = async function () {
        
        try {
            const response = await fetch(API_BASE + '/users/me', {
                credentials: 'include'
            });

            if (response.status === 401) {
                
                return null;
            }

            if (!response.ok) {
                console.warn('User API error:', response.status);
                return null;
            }

            const data = await response.json();
            
            return data;

        } catch (error) {
            console.error('❌ User API error:', error);
            return null;
        }
    };

    // ============================================
    // DASHBOARD
    // ============================================
    window.getDashboardSummary = async function () {
        
        try {
            const response = await fetch(API_BASE + '/dashboard/summary', {
                credentials: 'include'
            });

            if (!response.ok) {
                console.warn('Dashboard API error:', response.status);
                return {
                    totalBalance: 0,
                    totalIncome: 0,
                    totalExpenses: 0,
                    activeGoalsCount: 0,
                    accountsCount: 0,
                    transactionsCount: 0,
                    goalsCount: 0
                };
            }

            const data = await response.json();
            
            return data;

        } catch (error) {
            console.warn('Dashboard API error:', error);
            return {
                totalBalance: 0,
                totalIncome: 0,
                totalExpenses: 0,
                activeGoalsCount: 0,
                accountsCount: 0,
                transactionsCount: 0,
                goalsCount: 0
            };
        }
    };

    // ============================================
    // TRANSACTIONS
    // ============================================
    window.getTransactions = async function () {
        
        try {
            const response = await fetch(API_BASE + '/transactions', {
                credentials: 'include'
            });

            if (!response.ok) {
                console.warn('Transactions API error:', response.status);
                return [];
            }

            const data = await response.json();
            
            return data;

        } catch (error) {
            console.warn('Transactions API error:', error);
            return [];
        }
    };

    window.createTransaction = async function (transaction) {
        
        try {
            const response = await fetch(API_BASE + '/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(transaction)
            });

            if (!response.ok) {
                throw new Error('Failed to create transaction');
            }

            const data = await response.json();
            
            return data;

        } catch (error) {
            console.error('❌ Error creating transaction:', error);
            throw error;
        }
    };

    window.deleteTransaction = async function (id) {
        
        try {
            const response = await fetch(API_BASE + '/transactions/' + id, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete transaction');
            }

            
            return true;

        } catch (error) {
            console.error('❌ Error deleting transaction:', error);
            throw error;
        }
    };

    // ============================================
    // GOALS
    // ============================================
    window.getGoals = async function () {
        
        try {
            const response = await fetch(API_BASE + '/goals', {
                credentials: 'include'
            });

            if (!response.ok) {
                console.warn('Goals API error:', response.status);
                return [];
            }

            const data = await response.json();
            
            return data;

        } catch (error) {
            console.warn('Goals API error:', error);
            return [];
        }
    };

    window.createGoal = async function (goal) {
        
        try {
            const response = await fetch(API_BASE + '/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(goal)
            });

            if (!response.ok) {
                throw new Error('Failed to create goal');
            }

            const data = await response.json();
            
            return data;

        } catch (error) {
            console.error('❌ Error creating goal:', error);
            throw error;
        }
    };

    window.deleteGoal = async function (id) {
        
        try {
            const response = await fetch(API_BASE + '/goals/' + id, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete goal');
            }

            
            return true;

        } catch (error) {
            console.error('❌ Error deleting goal:', error);
            throw error;
        }
    };

    window.contributeToGoal = async function (id, amount) {
        
        try {
            const response = await fetch(API_BASE + '/goals/' + id + '/contribute?amount=' + amount, {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to contribute');
            }

            const data = await response.json();
            
            return data;

        } catch (error) {
            console.error('❌ Error contributing:', error);
            throw error;
        }
    };

    // ============================================
    // ACCOUNTS
    // ============================================
    window.getAccounts = async function () {
        
        try {
            const response = await fetch(API_BASE + '/accounts', {
                credentials: 'include'
            });

            if (!response.ok) {
                console.warn('Accounts API error:', response.status);
                return [];
            }

            const data = await response.json();
            
            return data;

        } catch (error) {
            console.warn('Accounts API error:', error);
            return [];
        }
    };

    window.createAccount = async function (account) {
        
        try {
            const response = await fetch(API_BASE + '/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(account)
            });

            if (!response.ok) {
                throw new Error('Failed to create account');
            }

            const data = await response.json();
            
            return data;

        } catch (error) {
            console.error('❌ Error creating account:', error);
            throw error;
        }
    };

    window.deleteAccount = async function (id) {
        
        try {
            const response = await fetch(API_BASE + '/accounts/' + id, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }

            
            return true;

        } catch (error) {
            console.error('❌ Error deleting account:', error);
            throw error;
        }
    };

    // ============================================
    // BUDGETS - FIX: Added missing functions
    // ============================================
    window.getBudgets = async function () {
        
        try {
            const response = await fetch(API_BASE + '/budgets', {
                credentials: 'include'
            });

            if (!response.ok) {
                console.warn('Budgets API error:', response.status);
                return [];
            }

            const data = await response.json();
            
            return data;

        } catch (error) {
            console.warn('Budgets API error:', error);
            return [];
        }
    };

    window.createBudget = async function (budget) {
        
        try {
            const response = await fetch(API_BASE + '/budgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(budget)
            });

            if (!response.ok) {
                throw new Error('Failed to create budget');
            }

            const data = await response.json();
            
            return data;

        } catch (error) {
            console.error('❌ Error creating budget:', error);
            throw error;
        }
    };

    window.deleteBudget = async function (id) {
        
        try {
            const response = await fetch(API_BASE + '/budgets/' + id, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete budget');
            }

            
            return true;

        } catch (error) {
            console.error('❌ Error deleting budget:', error);
            throw error;
        }
    };

    // ============================================
    // REPORTS
    // ============================================
    window.getReportSummary = async function () {
        
        try {
            const response = await fetch(API_BASE + '/reports/summary', {
                credentials: 'include'
            });

            if (!response.ok) {
                console.warn('Report API error:', response.status);
                return {
                    totalIncome: 0,
                    totalExpenses: 0,
                    totalBalance: 0,
                    transactionCount: 0
                };
            }

            const data = await response.json();
            
            return data;

        } catch (error) {
            console.warn('Report API error:', error);
            return {
                totalIncome: 0,
                totalExpenses: 0,
                totalBalance: 0,
                transactionCount: 0
            };
        }
    };

})();