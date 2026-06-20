(function () {
    'use strict';

    

    document.addEventListener('DOMContentLoaded', function () {
        

        initSidebar();
        loadUserFromBackend();
        loadStats();
        initProfileForm();
        initPreferencesForm();
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

    async function loadUserFromBackend() {
        try {
            const response = await fetch('/api/profile', {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to load profile');
            }

            const user = await response.json();
            

            if (user && user.fullName) {
                localStorage.setItem('user', JSON.stringify(user));
                displayUserInfo(user);
            } else {
                const stored = localStorage.getItem('user');
                if (stored) {
                    try {
                        const cachedUser = JSON.parse(stored);
                        displayUserInfo(cachedUser);
                    } catch (e) {
                        showGuestInfo();
                    }
                } else {
                    showGuestInfo();
                }
            }
        } catch (error) {
            console.warn('Could not load user from backend:', error);
            const stored = localStorage.getItem('user');
            if (stored) {
                try {
                    const cachedUser = JSON.parse(stored);
                    displayUserInfo(cachedUser);
                } catch (e) {
                    showGuestInfo();
                }
            } else {
                showGuestInfo();
            }
        }
    }

    function displayUserInfo(user) {
        if (!user || !user.fullName) {
            showGuestInfo();
            return;
        }

        setElementText('userName', user.fullName);
        setElementText('sidebarUserName', user.fullName);
        setElementText('sidebarUserEmail', user.email || 'guest@example.com');
        setElementText('avatar', user.fullName.charAt(0).toUpperCase());

        setElementText('profileName', user.fullName);
        setElementText('profileEmail', user.email || 'guest@example.com');
        setElementText('profileAvatar', user.fullName.charAt(0).toUpperCase());

        const fullNameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        if (fullNameInput) fullNameInput.value = user.fullName;
        if (emailInput) emailInput.value = user.email || '';
    }

    function showGuestInfo() {
        setElementText('userName', 'Guest');
        setElementText('sidebarUserName', 'Guest');
        setElementText('sidebarUserEmail', 'guest@example.com');
        setElementText('avatar', 'G');
        setElementText('profileName', 'Guest');
        setElementText('profileEmail', 'guest@example.com');
        setElementText('profileAvatar', 'G');
    }

    function setElementText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    async function loadStats() {
        try {
            const accounts = await getAccounts();
            const transactions = await getTransactions();
            const goals = await getGoals();

            const accountsCount = accounts ? accounts.length : 0;
            const transactionsCount = transactions ? transactions.length : 0;
            const goalsCount = goals ? goals.length : 0;

            setElementText('statAccounts', accountsCount);
            setElementText('statTransactions', transactionsCount);
            setElementText('statGoals', goalsCount);

            setElementText('accountsBadge', accountsCount);
            setElementText('transactionsBadge', transactionsCount);
            setElementText('goalsBadge', goalsCount);

        } catch (error) {
            console.warn('Could not load stats:', error);
        }
    }

    function initProfileForm() {
        const form = document.getElementById('profileForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            updateProfile();
        });
    }

    async function updateProfile() {
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!fullName || !email) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        try {
            const response = await fetch('/api/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ fullName, email })
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedUser = await response.json();
            

            localStorage.setItem('user', JSON.stringify(updatedUser));
            displayUserInfo(updatedUser);
            showToast('Profile updated successfully!');

        } catch (error) {
            console.error('Error updating profile:', error);
            showToast('Error updating profile', 'error');
        }
    }

    function initPreferencesForm() {
        const form = document.getElementById('preferencesForm');
        if (!form) return;

        loadPreferences();

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            savePreferences();
        });
    }

    function loadPreferences() {
        const stored = localStorage.getItem('preferences');
        if (stored) {
            try {
                const prefs = JSON.parse(stored);
                if (prefs.theme) {
                    const themeSelect = document.getElementById('theme');
                    if (themeSelect) themeSelect.value = prefs.theme;
                }
                if (prefs.currencyCode) {
                    const currencySelect = document.getElementById('currency');
                    if (currencySelect) {
                        const options = currencySelect.options;
                        for (let i = 0; i < options.length; i++) {
                            if (options[i].value === prefs.currencyCode) {
                                currencySelect.selectedIndex = i;
                                break;
                            }
                        }
                    }
                }
                if (prefs.notifications !== undefined) {
                    const notificationsCheck = document.getElementById('notifications');
                    if (notificationsCheck) notificationsCheck.checked = prefs.notifications;
                }
            } catch (e) {
                console.warn('Error loading preferences:', e);
            }
        }
    }

    async function savePreferences() {
        const theme = document.getElementById('theme').value;
        const currencySelect = document.getElementById('currency');
        const currencyCode = currencySelect.value;
        const notifications = document.getElementById('notifications').checked;

        const prefs = {
            theme: theme,
            currencyCode: currencyCode,
            notifications: notifications
        };

        

        try {
            const response = await fetch('/api/profile/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(prefs)
            });

            if (!response.ok) {
                throw new Error('Failed to save preferences');
            }

            const savedPrefs = await response.json();
            

            localStorage.setItem('preferences', JSON.stringify(prefs));
            showToast('Preferences saved successfully!');

        } catch (error) {
            console.error('Error saving preferences:', error);
            localStorage.setItem('preferences', JSON.stringify(prefs));
            showToast('Preferences saved locally', 'warning');
        }
    }

    function showToast(message, type) {
        if (type === 'error') {
            alert('❌ ' + message);
        } else if (type === 'warning') {
            alert('⚠️ ' + message);
        } else {
            alert('✅ ' + message);
        }
    }

})();