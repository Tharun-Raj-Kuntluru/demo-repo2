// Global Variables
let currentUser = null;
let currentRole = 'client';

// Mock Data
const mockProjects = {
    client: [
        {
            id: 'PRJ001',
            title: 'Main Campus Network Upgrade',
            status: 'in-progress',
            architect: 'John Smith',
            submittedDate: '2024-01-15',
            expectedCompletion: '2024-03-15',
            progress: 65
        },
        {
            id: 'PRJ002',
            title: 'Student Housing Wi-Fi Expansion',
            status: 'completed',
            architect: 'Sarah Johnson',
            submittedDate: '2023-12-01',
            expectedCompletion: '2024-01-30',
            progress: 100
        },
        {
            id: 'PRJ003',
            title: 'Library Network Modernization',
            status: 'pending',
            architect: 'Unassigned',
            submittedDate: '2024-01-20',
            expectedCompletion: 'TBD',
            progress: 0
        }
    ],
    admin: [
        {
            id: 'PRJ004',
            title: 'Science Building Infrastructure',
            status: 'pending',
            client: 'State University',
            submittedDate: '2024-01-22',
            priority: 'High'
        },
        {
            id: 'PRJ005',
            title: 'Athletic Complex Network',
            status: 'assigned',
            client: 'Tech College',
            architect: 'Mike Davis',
            submittedDate: '2024-01-18',
            priority: 'Medium'
        }
    ],
    architect: [
        {
            id: 'PRJ006',
            title: 'Admin Building Renovation',
            status: 'in-progress',
            client: 'Community College',
            deadline: '2024-02-28',
            phase: 'Design Phase'
        },
        {
            id: 'PRJ007',
            title: 'Campus-wide Security Upgrade',
            status: 'assigned',
            client: 'Private Academy',
            deadline: '2024-03-31',
            phase: 'Planning'
        }
    ]
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    checkUserSession();
});

// Initialize Event Listeners
function initializeEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('loginModal');
        if (event.target === modal) {
            hideLoginModal();
        }
    });
}

// Modal Functions
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Tab Switching
function switchTab(role) {
    currentRole = role;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update form placeholder or hints based on role
    updateLoginFormForRole(role);
}

function updateLoginFormForRole(role) {
    const emailInput = document.getElementById('email');
    const hints = {
        client: 'Enter your institution email address',
        admin: 'Administrator login credentials',
        architect: 'Network architect account access'
    };
    
    if (emailInput) {
        emailInput.placeholder = hints[role] || 'Email address';
    }
}

// Login Functions
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate login process
    showNotification('Logging in...', 'info');
    
    setTimeout(() => {
        loginUser(email, currentRole);
    }, 1000);
}

function loginDemo(role) {
    const demoUsers = {
        client: 'client@university.edu',
        admin: 'admin@campusnet.com',
        architect: 'architect@campusnet.com'
    };
    
    loginUser(demoUsers[role], role);
}

function loginUser(email, role) {
    currentUser = {
        email: email,
        role: role,
        name: getNameFromEmail(email)
    };
    
    // Store session
    localStorage.setItem('campusnet_user', JSON.stringify(currentUser));
    
    hideLoginModal();
    showNotification(`Welcome back, ${currentUser.name}!`, 'success');
    
    // Redirect to appropriate dashboard
    setTimeout(() => {
        redirectToDashboard(role);
    }, 1500);
}

function getNameFromEmail(email) {
    const names = {
        'client@university.edu': 'Dr. Jennifer Wilson',
        'admin@campusnet.com': 'Michael Chen',
        'architect@campusnet.com': 'Sarah Rodriguez'
    };
    return names[email] || email.split('@')[0];
}

function checkUserSession() {
    const storedUser = localStorage.getItem('campusnet_user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        // Auto-redirect if on main page
        if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
            setTimeout(() => {
                redirectToDashboard(currentUser.role);
            }, 1000);
        }
    }
}

function logout() {
    localStorage.removeItem('campusnet_user');
    currentUser = null;
    window.location.href = 'index.html';
}

// Dashboard Redirects
function redirectToDashboard(role) {
    const dashboards = {
        client: 'pages/client-dashboard.html',
        admin: 'pages/admin-dashboard.html',
        architect: 'pages/architect-dashboard.html'
    };
    
    window.location.href = dashboards[role];
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: getNotificationColor(type),
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        zIndex: '10001',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

// Dashboard Functions
function loadDashboard() {
    if (!currentUser) {
        window.location.href = '../index.html';
        return;
    }
    
    updateDashboardHeader();
    loadDashboardData();
}

function updateDashboardHeader() {
    const userNameElement = document.querySelector('.user-name');
    const userRoleElement = document.querySelector('.user-role');
    const userAvatarElement = document.querySelector('.user-avatar');
    
    if (userNameElement) userNameElement.textContent = currentUser.name;
    if (userRoleElement) userRoleElement.textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
    if (userAvatarElement) userAvatarElement.textContent = currentUser.name.charAt(0);
}

function loadDashboardData() {
    const role = currentUser.role;
    const projects = mockProjects[role] || [];
    
    // Update project counters
    updateProjectCounters(projects, role);
    
    // Load project table
    loadProjectTable(projects, role);
}

function updateProjectCounters(projects, role) {
    if (role === 'client') {
        const total = projects.length;
        const inProgress = projects.filter(p => p.status === 'in-progress').length;
        const completed = projects.filter(p => p.status === 'completed').length;
        
        updateCounter('total-projects', total);
        updateCounter('active-projects', inProgress);
        updateCounter('completed-projects', completed);
    } else if (role === 'admin') {
        const pending = projects.filter(p => p.status === 'pending').length;
        const assigned = projects.filter(p => p.status === 'assigned').length;
        
        updateCounter('pending-projects', pending);
        updateCounter('assigned-projects', assigned);
    } else if (role === 'architect') {
        const myProjects = projects.length;
        const inProgress = projects.filter(p => p.status === 'in-progress').length;
        
        updateCounter('my-projects', myProjects);
        updateCounter('active-designs', inProgress);
    }
}

function updateCounter(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

function loadProjectTable(projects, role) {
    const tableBody = document.querySelector('.project-table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    projects.forEach(project => {
        const row = createProjectRow(project, role);
        tableBody.appendChild(row);
    });
}

function createProjectRow(project, role) {
    const row = document.createElement('tr');
    
    if (role === 'client') {
        row.innerHTML = `
            <td>${project.id}</td>
            <td>${project.title}</td>
            <td><span class="status-badge status-${project.status}">${project.status.replace('-', ' ')}</span></td>
            <td>${project.architect}</td>
            <td>${formatDate(project.submittedDate)}</td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="viewProject('${project.id}')">View</button>
            </td>
        `;
    } else if (role === 'admin') {
        row.innerHTML = `
            <td>${project.id}</td>
            <td>${project.title}</td>
            <td>${project.client}</td>
            <td><span class="status-badge status-${project.status}">${project.status}</span></td>
            <td>${formatDate(project.submittedDate)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="assignProject('${project.id}')">Assign</button>
            </td>
        `;
    } else if (role === 'architect') {
        row.innerHTML = `
            <td>${project.id}</td>
            <td>${project.title}</td>
            <td>${project.client}</td>
            <td><span class="status-badge status-${project.status}">${project.status}</span></td>
            <td>${formatDate(project.deadline)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="openDesignTool('${project.id}')">Design</button>
            </td>
        `;
    }
    
    return row;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Project Actions
function viewProject(projectId) {
    showNotification(`Opening project ${projectId}...`, 'info');
    // In a real app, this would navigate to project details
}

function assignProject(projectId) {
    showNotification(`Assigning project ${projectId}...`, 'info');
    // In a real app, this would open assignment modal
}

function openDesignTool(projectId) {
    showNotification(`Opening design tool for project ${projectId}...`, 'info');
    // In a real app, this would open the network design interface
}

function newDesignRequest() {
    window.location.href = 'request-form.html';
}

// Form Validation
function validateForm(formElement) {
    const requiredFields = formElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    return isValid;
}

// Animation on scroll
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    document.querySelectorAll('.service-card, .stat').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', animateOnScroll);
