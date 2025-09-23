Kraal and Barn - Farm Products Website
A complete full-stack web application for showcasing and managing farm products including Honey, Rabbits, Goats, Fish, Vegetables, and Poultry. Built with Node.js, Express, MongoDB, and vanilla JavaScript.

🌟 Features
Frontend
Responsive Design - Mobile-first approach with modern UI

Product Catalog - Filterable product listings with search

Admin Dashboard - Complete management interface

User Authentication - Login/registration system

Dynamic Themes - Admin-customizable colors and content

Image Upload - Support for product images and banners

Backend
RESTful API - Clean API architecture

JWT Authentication - Secure user authentication

MongoDB Integration - Flexible data storage

File Upload - Cloudinary and local storage support

Input Validation - Comprehensive validation middleware

Rate Limiting - Protection against abuse

Email Service - Notifications and alerts

🏗️ Project Structure
text
kraal-and-barn/
├── backend/
│   ├── config/                 # Configuration files
│   │   ├── database.js         # MongoDB connection
│   │   └── cloudinary.js       # Cloudinary configuration
│   ├── controllers/            # Route controllers
│   │   ├── authController.js   # Authentication logic
│   │   ├── productController.js # Product management
│   │   └── settingsController.js # Site settings
│   ├── middleware/             # Custom middleware
│   │   ├── auth.js             # Authentication middleware
│   │   ├── upload.js           # File upload handling
│   │   ├── validation.js       # Input validation
│   │   └── rateLimit.js        # Rate limiting
│   ├── models/                 # MongoDB models
│   │   ├── User.js             # User schema
│   │   ├── Product.js          # Product schema
│   │   └── Settings.js         # Settings schema
│   ├── routes/                 # API routes
│   │   ├── auth.js             # Authentication routes
│   │   ├── products.js         # Product routes
│   │   └── settings.js         # Settings routes
│   ├── tests/                  # Test files
│   │   ├── auth.test.js        # Auth tests
│   │   ├── products.test.js    # Product tests
│   │   └── settings.test.js    # Settings tests
│   ├── utils/                  # Utility functions
│   │   ├── helpers.js          # Helper functions
│   │   └── emailService.js     # Email service
│   ├── uploads/                # File upload directory
│   ├── .env                    # Environment variables
│   ├── .env.example            # Environment template
│   ├── package.json            # Dependencies
│   ├── server.js               # Main server file
│   └── seed.js                 # Database seeder
│
└── frontend/
    ├── css/                    # Stylesheets
    │   ├── style.css           # Main styles
    │   ├── products.css        # Product page styles
    │   └── admin.css           # Admin dashboard styles
    ├── js/                     # JavaScript files
    │   ├── app.js              # Main application logic
    │   ├── products.js         # Product page functionality
    │   ├── admin.js            # Admin dashboard functionality
    │   ├── auth.js             # Authentication handling
    │   └── components.js       # Component loader
    ├── components/             # Reusable components
    │   ├── header.html         # Site header
    │   ├── footer.html         # Site footer
    │   └── product-card.html   # Product card component
    ├── assets/                 # Static assets
    │   ├── images/             # Image files
    │   ├── fonts/              # Custom fonts
    │   └── icons/              # Favicons and app icons
    ├── admin/                  # Admin pages
    │   └── dashboard.html      # Admin dashboard
    ├── index.html              # Homepage
    ├── products.html           # Products listing
    ├── login.html              # Login page
    ├── about.html              # About page
    └── contact.html            # Contact page
📁 Assets Directory
This directory contains all static assets for the Kraal and Barn website.

Directory Structure
text
assets/
├── images/
│   ├── logo.png
│   ├── logo-white.png
│   ├── hero-bg.jpg
│   ├── products-bg.jpg
│   ├── placeholder.jpg
│   ├── farm-about.jpg
│   └── categories/
│       ├── honey.jpg
│       ├── rabbits.jpg
│       ├── goats.jpg
│       ├── fish.jpg
│       ├── vegetables.jpg
│       └── poultry.jpg
├── fonts/
│   ├── custom-font.woff
│   ├── custom-font.woff2
│   └── font.css
└── icons/
    ├── favicon.ico
    ├── apple-touch-icon.png
    ├── icon-192.png
    ├── icon-512.png
    └── manifest.json
Image Requirements
Logo
Dimensions: 500x500px (PNG with transparency)

Formats: PNG, SVG

Alternative text: "Kraal and Barn Logo"

Hero Image
Dimensions: 1920x1080px

Format: JPG/WebP

Quality: High resolution, optimized for web

Product Images
Dimensions: 800x600px

Format: JPG/WebP

Aspect ratio: 4:3

File naming: descriptive names (e.g., pure-honey-1.jpg)

Category Images
Dimensions: 600x400px

Format: JPG/WebP

Consistent style and quality

Font Setup
Primary Font: 'Segoe UI'
Fallback to system fonts:

Windows: Segoe UI

macOS: San Francisco

Linux: Ubuntu

Generic: sans-serif

Custom Fonts (if needed)
Place custom font files in fonts/ directory and update font.css

Icons
Favicon
Size: 32x32px

Format: ICO/PNG

Touch Icons
Apple Touch Icon: 180x180px

Android Chrome: 192x192px and 512x512px

Manifest
Web app manifest for PWA capabilities

Optimization Guidelines
Images: Use WebP format when possible

Compression: Optimize all images (max 80% quality)

Lazy Loading: Implement for images below the fold

CDN: Consider using CDN for production

Default Images
If you don't have actual images yet, the system will use:

Placeholder images with SVG fallbacks

Default color backgrounds

Font Awesome icons for categories

🚀 Quick Start
Prerequisites
Node.js (v14 or higher)

MongoDB Atlas account or local MongoDB

Cloudinary account (for image uploads)

Installation
Clone the repository

bash
git clone <repository-url>
cd kraal-and-barn
Setup Backend

bash
cd backend
npm install
Configure Environment Variables

bash
cp .env.example .env
# Edit .env with your configuration
Setup Frontend

bash
cd ../frontend
# No installation needed for frontend (vanilla JS)
Seed Database

bash
cd ../backend
npm run seed
Start Development Server

bash
npm run dev
Access the Application

Frontend: http://localhost:3000

Backend API: http://localhost:5000

⚙️ Configuration
Environment Variables (.env)
env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kraalAndBarn

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend
FRONTEND_URL=http://localhost:3000
Default Admin Account
After running the seed script:

Email: admin@kraalandbarn.com

Password: admin123

📋 API Endpoints
Authentication
POST /api/auth/register - User registration

POST /api/auth/login - User login

GET /api/auth/profile - Get user profile

PUT /api/auth/profile - Update profile

POST /api/auth/logout - User logout

Products
GET /api/products - Get all products (with filtering)

GET /api/products/:id - Get single product

POST /api/products - Create product (Admin only)

PUT /api/products/:id - Update product (Admin only)

DELETE /api/products/:id - Delete product (Admin only)

Settings
GET /api/settings/public - Get public settings

GET /api/settings - Get all settings (Admin only)

PUT /api/settings - Update settings (Admin only)

Admin
GET /api/admin/dashboard - Admin dashboard stats

🎨 Customization
Theme Colors
Admins can customize the site theme through the dashboard:

Primary Color (--primary-color)

Secondary Color (--secondary-color)

Accent Color (--accent-color)

Light Color (--light-color)

Dark Color (--dark-color)

Site Content
Site name and logo

Hero banner text and image

Contact information

Social media links

SEO metadata

🧪 Testing
Run the test suite:

bash
cd backend
npm test
Test coverage includes:

Authentication flows

Product CRUD operations

Settings management

API validation

📦 Deployment
Backend Deployment (Heroku/Railway)
Set environment variables

Deploy from Git repository

Ensure MongoDB connection string is set

Frontend Deployment (Netlify/Vercel)
Build command: (none - static files)

Publish directory: frontend

Set environment variables for API URL

Database
MongoDB Atlas recommended for production

Ensure proper indexing for performance

🔧 Development
Adding New Product Categories
Update category enum in backend/models/Product.js

Add category images in frontend/assets/images/categories/

Update frontend filters in products.html

Custom Validation Rules
Edit backend/middleware/validation.js to add new validation rules.

Email Templates
Modify backend/utils/emailService.js to customize email templates.

🐛 Troubleshooting
Common Issues
MongoDB Connection Error

Check connection string in .env

Verify network access to MongoDB Atlas

Image Upload Issues

Verify Cloudinary credentials

Check file size limits (max 5MB)

Authentication Problems

Ensure JWT_SECRET is set

Check token expiration settings

CORS Errors

Verify FRONTEND_URL in environment variables

Debug Mode
Enable debug logging by setting:

env
NODE_ENV=development
DEBUG=true
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🤝 Contributing
Fork the project

Create a feature branch (git checkout -b feature/amazing-feature)

Commit changes (git commit -m 'Add amazing feature')

Push to branch (git push origin feature/amazing-feature)

Open a Pull Request

📞 Support
For support, please contact:

Email: support@kraalandbarn.com

Issues: GitHub Issues

🚀 Future Enhancements
E-commerce functionality (shopping cart, payments)

Multi-language support

Advanced analytics dashboard

Mobile app (React Native)

API documentation (Swagger/OpenAPI)

Real-time notifications

Social media integration

Blog/News section

Built with ❤️ for sustainable farming