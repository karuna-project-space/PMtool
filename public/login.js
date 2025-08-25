// Login Page JavaScript
class LoginManager {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setupDemoAccounts();
    }

    init() {
        // Check if user is already logged in
        const token = localStorage.getItem('authToken');
        if (token && this.isValidToken(token)) {
            this.redirectToDashboard();
        }

        // Add fade-in animation
        document.querySelector('.login-card').classList.add('fade-in');
    }

    setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', (e) => this.handleLogin(e));

        // Password toggle
        const passwordToggle = document.getElementById('passwordToggle');
        passwordToggle.addEventListener('click', () => this.togglePassword());

        // Forgot password
        const forgotPasswordLink = document.getElementById('forgotPasswordLink');
        forgotPasswordLink.addEventListener('click', (e) => this.handleForgotPassword(e));

        // Contact admin
        const contactAdmin = document.getElementById('contactAdmin');
        contactAdmin.addEventListener('click', (e) => this.handleContactAdmin(e));

        // Demo account buttons
        const demoButtons = document.querySelectorAll('.demo-btn');
        demoButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleDemoLogin(e));
        });
    }

    setupDemoAccounts() {
        // Demo account credentials
        this.demoAccounts = {
            'project-manager': {
                email: 'pavan.paruchuri@opsdash.com',
                password: 'demo123',
                name: 'Pavan Paruchuri',
                role: 'Project Manager',
                permissions: ['dashboard', 'projects', 'resources', 'reports']
            },
            'admin': {
                email: 'admin@opsdash.com',
                password: 'admin123',
                name: 'Admin User',
                role: 'Administrator',
                permissions: ['dashboard', 'projects', 'resources', 'reports', 'users', 'settings']
            },
            'hr-manager': {
                email: 'hr@opsdash.com',
                password: 'hr123',
                name: 'HR Manager',
                role: 'HR Manager',
                permissions: ['dashboard', 'resources', 'reports', 'employees']
            },
            'ceo': {
                email: 'ceo@opsdash.com',
                password: 'ceo123',
                name: 'CEO',
                role: 'Chief Executive Officer',
                permissions: ['dashboard', 'projects', 'resources', 'reports', 'analytics', 'finance']
            },
            'finance-manager': {
                email: 'finance@opsdash.com',
                password: 'finance123',
                name: 'Finance Manager',
                role: 'Finance Manager',
                permissions: ['dashboard', 'finance', 'reports', 'billing']
            }
        };
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!this.validateForm(email, password)) {
            return;
        }

        this.showLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                this.handleLoginSuccess(data.data);
            } else {
                this.handleLoginError(data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            this.handleLoginError('Network error. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async handleDemoLogin(e) {
        const role = e.currentTarget.getAttribute('data-role');
        const account = this.demoAccounts[role];

        if (!account) {
            this.showToast('Demo account not found', 'error');
            return;
        }

        // Fill form with demo credentials
        document.getElementById('email').value = account.email;
        document.getElementById('password').value = account.password;

        // Auto-submit after a brief delay
        setTimeout(() => {
            this.showLoading(true);
            
            // Simulate API call for demo
            setTimeout(() => {
                const mockResponse = {
                    success: true,
                    data: {
                        token: this.generateMockToken(),
                        user: {
                            id: Math.random().toString(36).substr(2, 9),
                            email: account.email,
                            name: account.name,
                            role: account.role,
                            permissions: account.permissions
                        }
                    }
                };
                
                this.handleLoginSuccess(mockResponse.data);
                this.showLoading(false);
            }, 1500);
        }, 500);

        this.showToast(`Signing in as ${account.name}...`, 'info');
    }

    handleLoginSuccess(data) {
        // Store authentication data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));

        this.showToast('Login successful! Redirecting...', 'success');

        // Redirect based on user role
        setTimeout(() => {
            this.redirectToDashboard(data.user.role);
        }, 1500);
    }

    handleLoginError(message) {
        this.showToast(message, 'error');
        
        // Shake the form
        const loginCard = document.querySelector('.login-card');
        loginCard.classList.add('shake');
        setTimeout(() => {
            loginCard.classList.remove('shake');
        }, 500);

        // Clear password field
        document.getElementById('password').value = '';
    }

    validateForm(email, password) {
        if (!email || !password) {
            this.showToast('Please fill in all fields', 'error');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showToast('Please enter a valid email address', 'error');
            return false;
        }

        if (password.length < 6) {
            this.showToast('Password must be at least 6 characters', 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidToken(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } catch {
            return false;
        }
    }

    generateMockToken() {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
            iat: Math.floor(Date.now() / 1000),
            sub: 'demo-user'
        }));
        const signature = btoa('mock-signature');
        
        return `${header}.${payload}.${signature}`;
    }

    redirectToDashboard(role) {
        // Redirect based on role
        switch (role) {
            case 'Project Manager':
            case 'Administrator':
            case 'CEO':
                window.location.href = '/pm-dashboard';
                break;
            case 'HR Manager':
                window.location.href = '/hr-dashboard';
                break;
            case 'Finance Manager':
                window.location.href = '/finance-dashboard';
                break;
            default:
                window.location.href = '/pm-dashboard';
        }
    }

    togglePassword() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.querySelector('#passwordToggle i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }

    handleForgotPassword(e) {
        e.preventDefault();
        this.showToast('Password reset functionality would be implemented here', 'info');
    }

    handleContactAdmin(e) {
        e.preventDefault();
        this.showToast('Please contact your system administrator for account access', 'info');
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        const signInBtn = document.getElementById('signInBtn');
        const btnText = signInBtn.querySelector('.btn-text');
        const btnLoader = signInBtn.querySelector('.btn-loader');

        if (show) {
            overlay.style.display = 'flex';
            signInBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'block';
        } else {
            overlay.style.display = 'none';
            signInBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});

// Handle browser back button
window.addEventListener('popstate', () => {
    const token = localStorage.getItem('authToken');
    if (token && new LoginManager().isValidToken(token)) {
        new LoginManager().redirectToDashboard();
    }
});