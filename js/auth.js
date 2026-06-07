// Google API Configuration - Replace with your Google Client ID
const GOOGLE_CLIENT_ID = '885316256157-9bosddc61mhieokop7u9v1nago38vr0c.apps.googleusercontent.com';

// User database (localStorage)
let users = JSON.parse(localStorage.getItem('finwise_users')) || [];

function showMessage(message, isError = false) {
  const toast = document.createElement('div');
  toast.className = 'message-toast';
  toast.style.background = isError ? '#ff4757' : '#00b894';
  toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

function handleSignup(event) {
  event.preventDefault();
  
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  
  if (!validateEmail(email)) {
    showMessage('Please enter a valid email address', true);
    return false;
  }
  
  if (!validatePassword(password)) {
    showMessage('Password must be at least 6 characters', true);
    return false;
  }
  
  if (password !== confirmPassword) {
    showMessage('Passwords do not match', true);
    return false;
  }
  
  if (users.find(u => u.email === email)) {
    showMessage('Email already registered. Please login.', true);
    return false;
  }
  
  const hashedPassword = btoa(password);
  
  const newUser = {
    id: Date.now(),
    name: name,
    email: email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('finwise_users', JSON.stringify(users));
  localStorage.setItem('finwise_currentUser', JSON.stringify({ id: newUser.id, name: newUser.name, email: newUser.email }));
  
  showMessage('Account created successfully! Redirecting...');
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1500);
  
  return false;
}

function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const rememberMe = document.getElementById('rememberMe')?.checked || false;
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    showMessage('Email not found. Please create an account.', true);
    return false;
  }
  
  const hashedInput = btoa(password);
  if (user.password !== hashedInput) {
    showMessage('Invalid password. Please try again.', true);
    return false;
  }
  
  const sessionUser = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem('finwise_currentUser', JSON.stringify(sessionUser));
  
  if (rememberMe) {
    localStorage.setItem('finwise_rememberMe', 'true');
  } else {
    localStorage.removeItem('finwise_rememberMe');
  }
  
  showMessage('Login successful! Redirecting...');
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1000);
  
  return false;
}

function handleGoogleCredentialResponse(response) {
  const decoded = parseJwt(response.credential);
  
  const googleUser = {
    id: decoded.sub,
    name: decoded.name,
    email: decoded.email,
    picture: decoded.picture,
    given_name: decoded.given_name,
    family_name: decoded.family_name
  };
  
  // Check if user exists
  const existingUser = users.find(u => u.email === googleUser.email);
  if (!existingUser) {
    users.push(googleUser);
    localStorage.setItem('finwise_users', JSON.stringify(users));
  }
  
  localStorage.setItem('finwise_currentUser', JSON.stringify(googleUser));
  showMessage(`Welcome ${googleUser.name}!`);
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1000);
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

function initializeGoogleSignIn() {
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredentialResponse
    });
    
    const googleButton = document.getElementById('googleSignInButton');
    if (googleButton) {
      google.accounts.id.renderButton(
        googleButton,
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
  
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  const forgotLink = document.getElementById('forgotPasswordLink');
  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      showMessage('Password reset link sent to your email (demo)');
    });
  }
  
  initializeGoogleSignIn();
});