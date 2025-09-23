// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Global State
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Initialize Application
function initApp() {
    checkAuthStatus();
    setupEventListeners();
    loadThemeSettings();
}

// Check Authentication Status
async function checkAuthStatus() {
    if (authToken) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                currentUser = result.data.user;
                updateUIForAuthState(true);
            } else {
                localStorage.removeItem('authToken');
                authToken = null;
                updateUIForAuthState(false);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('authToken');
            authToken = null;
            updateUIForAuthState(false);
        }
    } else {
        updateUIForAuthState(false);
    }
}

// Update UI based on authentication state
function updateUIForAuthState(isAuthenticated) {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const adminLink = document.getElementById('admin-link');
    
    if (authButtons && userMenu) {
        if (isAuthenticated) {
            authButtons.classList.add('hidden');
            userMenu.classList.remove('hidden');
            
            // Update user info
            const userNameElement = document.getElementById('user-name');
            if (userNameElement) {
                userNameElement.textContent = currentUser.name;
            }
            
            // Show admin link if user is admin
            if (adminLink && currentUser.role === 'admin') {
                adminLink.classList.remove('hidden');
            }
        } else {
            authButtons.classList.remove('hidden');
            userMenu.classList.add('hidden');
            if (adminLink) adminLink.classList.add('hidden');
        }
    }
}

// Setup global event listeners
function setupEventListeners() {
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Handle user logout
async function handleLogout() {
    try {
        if (authToken) {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        localStorage.removeItem('authToken');
        authToken = null;
        currentUser = null;
        updateUIForAuthState(false);
        window.location.href = 'index.html';
    }
}

// API Request Helper
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };
    
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('authToken');
                authToken = null;
                currentUser = null;
                updateUIForAuthState(false);
                showNotification('Session expired. Please login again.', 'error');
            }
            throw new Error(data.message || 'Request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Load theme settings from backend
async function loadThemeSettings() {
    try {
        const response = await fetch(`${API_BASE_URL}/settings/public`);
        if (response.ok) {
            const result = await response.json();
            applyThemeSettings(result.data.settings);
        }
    } catch (error) {
        console.error('Failed to load theme settings:', error);
    }
}

// Apply theme settings to the page
function applyThemeSettings(settings) {
    if (settings.theme) {
        const root = document.documentElement;
        
        if (settings.theme.primaryColor) {
            root.style.setProperty('--primary-color', settings.theme.primaryColor);
        }
        if (settings.theme.secondaryColor) {
            root.style.setProperty('--secondary-color', settings.theme.secondaryColor);
        }
        if (settings.theme.accentColor) {
            root.style.setProperty('--accent-color', settings.theme.accentColor);
        }
    }
    
    // Update hero section if exists
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    
    if (heroTitle && settings.heroBanner?.title) {
        heroTitle.textContent = settings.heroBanner.title;
    }
    
    if (heroSubtitle && settings.heroBanner?.subtitle) {
        heroSubtitle.textContent = settings.heroBanner.subtitle;
    }
    
    // Update site title
    if (settings.siteName) {
        document.title = `${settings.siteName} - Farm Products`;
    }
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Debounce function for search inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if user is admin
function isAdmin() {
    return currentUser && currentUser.role === 'admin';
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!authToken) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Redirect to admin dashboard if not admin
function requireAdmin() {
    if (!requireAuth()) return false;
    
    if (!isAdmin()) {
        showNotification('Access denied. Admin privileges required.', 'error');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Export for use in other modules
window.App = {
    apiRequest,
    showNotification,
    formatPrice,
    debounce,
    isAdmin,
    requireAuth,
    requireAdmin,
    getAuthToken: () => authToken,
    getCurrentUser: () => currentUser
};