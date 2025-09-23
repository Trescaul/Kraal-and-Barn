// Admin Dashboard Functionality
let currentSection = 'dashboard';

// Initialize admin dashboard
function initializeAdminDashboard() {
    if (!App.requireAdmin()) return;
    
    loadDashboardData();
    setupAdminEventListeners();
    loadSettings();
    loadProductsTable();
    
    // Handle hash routing
    const hash = window.location.hash.substring(1);
    if (hash) {
        switchSection(hash);
    }
}

// Setup admin event listeners
function setupAdminEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            switchSection(section);
        });
    });
    
    // Logout
    document.getElementById('admin-logout').addEventListener('click', App.handleLogout);
    
    // Add product button
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', showAddProductModal);
    }
    
    // Settings form
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', saveSettings);
    }
    
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModals();
            }
        });
    });
}

// Switch between admin sections
function switchSection(section) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Show/hide sections
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    document.getElementById(`${section}-section`).classList.add('active');
    
    // Update URL hash
    window.location.hash = section;
    currentSection = section;
    
    // Load section-specific data
    switch (section) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'products':
            loadProductsTable();
            break;
        case 'settings':
            loadSettings();
            break;
        case 'users':
            loadUsersTable();
            break;
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        const response = await App.apiRequest('/admin/dashboard');
        
        if (response.success) {
            updateDashboardStats(response.data.stats);
            displayRecentProducts(response.data.recentProducts);
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        App.showNotification('Failed to load dashboard data', 'error');
    }
}

// Update dashboard statistics
function updateDashboardStats(stats) {
    document.getElementById('total-products').textContent = stats.totalProducts;
    document.getElementById('total-users').textContent = stats.totalUsers;
    document.getElementById('out-of-stock').textContent = stats.outOfStock;
    document.getElementById('active-users').textContent = stats.activeUsers;
}

// Display recent products
function displayRecentProducts(products) {
    const container = document.getElementById('recent-products');
    
    if (!products || products.length === 0) {
        container.innerHTML = '<p class="empty-state">No recent products</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="recent-item">
            <div class="recent-item-image">
                <img src="${product.images[0]?.url || 'assets/images/placeholder.jpg'}" 
                     alt="${product.name}">
            </div>
            <div class="recent-item-info">
                <h4>${product.name}</h4>
                <p>${product.category} • ${App.formatPrice(product.price)}</p>
            </div>
            <div class="recent-item-date">
                ${new Date(product.createdAt).toLocaleDateString()}
            </div>
        </div>
    `).join('');
}

// Load products for admin table
async function loadProductsTable() {
    try {
        const response = await App.apiRequest('/products?limit=50');
        
        if (response.success) {
            displayProductsTable(response.data.products);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        App.showNotification('Failed to load products', 'error');
    }
}

// Display products in admin table
function displayProductsTable(products) {
    const tbody = document.querySelector('#products-table tbody');
    
    if (!products || products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No products found</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${App.formatPrice(product.price)}</td>
            <td>${product.stockQuantity}</td>
            <td>
                <span class="status-badge ${product.inStock ? 'status-active' : 'status-inactive'}">
                    ${product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
            </td>
            <td>
                <div class="table-actions">
                    <button class="action-btn view" onclick="viewProduct('${product._id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editProduct('${product._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct('${product._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load settings
async function loadSettings() {
    try {
        const response = await App.apiRequest('/settings');
        
        if (response.success) {
            populateSettingsForm(response.data.settings);
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        App.showNotification('Failed to load settings', 'error');
    }
}

// Populate settings form
function populateSettingsForm(settings) {
    const form = document.getElementById('settings-form');
    if (!form || !settings) return;
    
    // General settings
    if (settings.siteName) {
        form.elements['siteName'].value = settings.siteName;
    }
    
    // Hero banner
    if (settings.heroBanner) {
        if (settings.heroBanner.title) {
            form.elements['heroBanner.title'].value = settings.heroBanner.title;
        }
        if (settings.heroBanner.subtitle) {
            form.elements['heroBanner.subtitle'].value = settings.heroBanner.subtitle;
        }
    }
    
    // Theme colors
    if (settings.theme) {
        if (settings.theme.primaryColor) {
            form.elements['theme.primaryColor'].value = settings.theme.primaryColor;
        }
        if (settings.theme.secondaryColor) {
            form.elements['theme.secondaryColor'].value = settings.theme.secondaryColor;
        }
        if (settings.theme.accentColor) {
            form.elements['theme.accentColor'].value = settings.theme.accentColor;
        }
    }
}

// Save settings
async function saveSettings(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const settings = {};
    
    // Convert form data to nested object
    for (let [key, value] of formData.entries()) {
        if (value) {
            const keys = key.split('.');
            let current = settings;
            
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }
            
            current[keys[keys.length - 1]] = value;
        }
    }
    
    try {
        const response = await App.apiRequest('/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
        
        if (response.success) {
            App.showNotification('Settings saved successfully');
            // Apply new theme settings
            App.loadThemeSettings();
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        App.showNotification('Failed to save settings', 'error');
    }
}

// Show add product modal
function showAddProductModal() {
    const modal = document.getElementById('add-product-modal');
    modal.style.display = 'flex';
    
    // Populate form (in a real implementation, this would have the full form)
    const form = document.getElementById('add-product-form');
    form.innerHTML = `
        <div class="modal-body">
            <div class="form-group">
                <label for="product-name">Product Name</label>
                <input type="text" id="product-name" name="name" required>
            </div>
            <div class="form-group">
                <label for="product-category">Category</label>
                <select id="product-category" name="category" required>
                    <option value="">Select Category</option>
                    <option value="Honey">Honey</option>
                    <option value="Rabbits">Rabbits</option>
                    <option value="Goats">Goats</option>
                    <option value="Fish">Fish</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Poultry">Poultry</option>
                </select>
            </div>
            <div class="form-group">
                <label for="product-price">Price</label>
                <input type="number" id="product-price" name="price" step="0.01" required>
            </div>
            <div class="form-group">
                <label for="product-description">Description</label>
                <textarea id="product-description" name="description" required></textarea>
            </div>
            <div class="form-group">
                <label for="product-stock">Stock Quantity</label>
                <input type="number" id="product-stock" name="stockQuantity" required>
            </div>
            <button type="submit" class="btn btn-primary">Add Product</button>
        </div>
    `;
    
    // Add form submit handler
    form.onsubmit = handleAddProduct;
}

// Handle add product form submission
async function handleAddProduct(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const productData = Object.fromEntries(formData);
    
    try {
        const response = await App.apiRequest('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
        
        if (response.success) {
            App.showNotification('Product added successfully');
            closeModals();
            loadProductsTable(); // Refresh the table
        }
    } catch (error) {
        console.error('Error adding product:', error);
        App.showNotification('Failed to add product', 'error');
    }
}

// Close all modals
function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// View product
function viewProduct(productId) {
    window.open(`../product-details.html?id=${productId}`, '_blank');
}

// Edit product
function editProduct(productId) {
    // In a real implementation, this would open an edit modal
    // or navigate to an edit page
    App.showNotification('Edit product functionality coming soon', 'info');
}

// Delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const response = await App.apiRequest(`/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (response.success) {
            App.showNotification('Product deleted successfully');
            loadProductsTable(); // Refresh the table
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        App.showNotification('Failed to delete product', 'error');
    }
}

// Load users table (placeholder)
async function loadUsersTable() {
    App.showNotification('User management coming soon', 'info');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.admin-dashboard')) {
        initializeAdminDashboard();
    }
});

// Global functions for admin actions
window.viewProduct = viewProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;