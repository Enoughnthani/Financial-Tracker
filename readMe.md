# 💰 Financial Tracker App

A modern, user-friendly financial management web application that helps you track expenses, manage budgets, and gain insights into your spending habits. Built with vanilla HTML, CSS, and JavaScript.

## ✨ Features

- **🔐 Google Authentication** - Secure login with Google account
- **📊 Dashboard Overview** - View total income, expenses, and balance at a glance
- **💰 Transaction Management** - Add, view, and filter income/expense transactions
- **🎯 Budget Tracking** - Set monthly budgets and track spending progress
- **👤 User Profile** - Display Google account information
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **💾 Local Storage** - User data persistence using browser local storage

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (Vanilla)** - No frameworks, pure JS
- **Google Identity Services** - OAuth 2.0 authentication
- **Font Awesome** - Icons
- **Google Fonts** - Inter font family

## 📁 Project Structure
financial-tracker/
├── index.html # Landing page
├── pages/
│ ├── login.html # Login page
│ ├── create-account.html # Account registration
│ └── dashboard.html # Main dashboard
├── css/
│ └── style.css # Global styles
├── js/
│ ├── auth.js # Authentication logic
│ └── dashboard.js # Dashboard functionality
└── README.md # Project documentation

text

## 🔧 Installation & Setup

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Live server extension (for VS Code) or any local HTTP server
- Google Cloud Console account (for OAuth)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/financial-tracker.git
cd financial-tracker
Step 2: Set Up Google OAuth
Go to Google Cloud Console

Create a new project or select existing one

Navigate to APIs & Services > Credentials

Click Create Credentials > OAuth Client ID

Select Web application as application type

Add authorized JavaScript origins:

http://localhost:5500

http://127.0.0.1:5500

Copy your Client ID

Open js/auth.js and replace:

javascript
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com';
Step 3: Run the Application
Using VS Code Live Server (Recommended)
Install Live Server extension

Right-click on index.html

Select "Open with Live Server"

Using Python
bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
Then open http://localhost:8000

Using Node.js
bash
npx http-server -p 8080
📱 Usage
