// Dashboard JavaScript functionality
class OpsDashboard {
    constructor() {
        this.init();
        this.loadDashboardData();
    }

    init() {
        this.setupTabNavigation();
        this.setupEventListeners();
        this.animateKPIs();
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked button and corresponding pane
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
                
                // Load tab-specific content
                this.loadTabContent(targetTab);
            });
        });
    }

    setupEventListeners() {
        // Create Project button
        const createProjectBtn = document.querySelector('.create-project-btn');
        createProjectBtn.addEventListener('click', () => {
            this.showCreateProjectModal();
        });

        // Notification icon
        const notificationIcon = document.querySelector('.notification-icon');
        notificationIcon.addEventListener('click', () => {
            this.showNotifications();
        });

        // User profile
        const userProfile = document.querySelector('.user-profile');
        userProfile.addEventListener('click', () => {
            this.showUserMenu();
        });
    }

    animateKPIs() {
        const kpiCards = document.querySelectorAll('.kpi-card');
        
        kpiCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            }, index * 150);
        });
    }

    async loadDashboardData() {
        try {
            // Simulate API call to get dashboard data
            const dashboardData = await this.fetchDashboardData();
            this.updateKPIs(dashboardData);
            this.updateRecentProjects(dashboardData.projects);
            this.updateResourceAlerts(dashboardData.alerts);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showErrorMessage('Failed to load dashboard data');
        }
    }

    async fetchDashboardData() {
        // Simulate API call - replace with actual API endpoint
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    revenue: {
                        inr: '5,41,12,500',
                        usd: '650,000'
                    },
                    profit: {
                        inr: '1,24,87,500',
                        usd: '150,000'
                    },
                    utilization: 77.5,
                    activeProjects: 2,
                    projects: [
                        {
                            id: 1,
                            name: 'Project Alpha',
                            profit: '$130,000',
                            status: 'active'
                        },
                        {
                            id: 2,
                            name: 'Project Beta',
                            profit: '$20,000',
                            status: 'active'
                        }
                    ],
                    alerts: [
                        {
                            type: 'warning',
                            title: 'Underutilized Resources',
                            description: '2 resources on bench',
                            icon: 'fas fa-exclamation-triangle'
                        },
                        {
                            type: 'danger',
                            title: 'Overutilized Resources',
                            description: '2 resources above 95% utilization',
                            icon: 'fas fa-exclamation-circle'
                        }
                    ]
                });
            }, 1000);
        });
    }

    updateKPIs(data) {
        // Update KPI values with animation
        this.animateValue('.revenue .kpi-value', data.revenue.inr, '₹');
        this.animateValue('.profit .kpi-value', data.profit.inr, '₹');
        this.animateValue('.utilization .kpi-value', data.utilization, '', '%');
        this.animateValue('.projects .kpi-value', data.activeProjects);
    }

    animateValue(selector, endValue, prefix = '', suffix = '') {
        const element = document.querySelector(selector);
        if (!element) return;

        const startValue = 0;
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            let currentValue;
            if (typeof endValue === 'string') {
                // For string values like currency, just set the final value
                currentValue = endValue;
            } else {
                // For numeric values, animate the counting
                currentValue = Math.floor(startValue + (endValue - startValue) * progress);
            }
            
            element.textContent = `${prefix}${currentValue}${suffix}`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    updateRecentProjects(projects) {
        const projectList = document.querySelector('.project-list');
        if (!projectList) return;

        projectList.innerHTML = projects.map(project => `
            <div class="project-item">
                <div class="project-info">
                    <h4>${project.name}</h4>
                    <p>Profit: ${project.profit}</p>
                </div>
                <span class="status-badge ${project.status}">${project.status}</span>
            </div>
        `).join('');
    }

    updateResourceAlerts(alerts) {
        const alertList = document.querySelector('.alert-list');
        if (!alertList) return;

        alertList.innerHTML = alerts.map(alert => `
            <div class="alert-item ${alert.type}">
                <div class="alert-icon">
                    <i class="${alert.icon}"></i>
                </div>
                <div class="alert-content">
                    <h4>${alert.title}</h4>
                    <p>${alert.description}</p>
                </div>
            </div>
        `).join('');
    }

    loadTabContent(tabName) {
        switch (tabName) {
            case 'projects':
                this.loadProjectsContent();
                break;
            case 'resources':
                this.loadResourcesContent();
                break;
            case 'bench-report':
                this.loadBenchReportContent();
                break;
            case 'currency':
                this.loadCurrencyContent();
                break;
            default:
                // Overview tab is already loaded
                break;
        }
    }

    async loadProjectsContent() {
        const projectsContent = document.querySelector('.projects-content');
        projectsContent.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading projects...</p>
            </div>
        `;

        // Simulate loading projects data
        setTimeout(() => {
            projectsContent.innerHTML = `
                <h3>Project Management</h3>
                <p>Manage and track all active projects</p>
                <div class="projects-grid">
                    <div class="project-card">
                        <h4>Project Alpha</h4>
                        <p>Status: Active</p>
                        <p>Profit: $130,000</p>
                        <p>Team: 5 members</p>
                    </div>
                    <div class="project-card">
                        <h4>Project Beta</h4>
                        <p>Status: Active</p>
                        <p>Profit: $20,000</p>
                        <p>Team: 3 members</p>
                    </div>
                </div>
            `;
        }, 1000);
    }

    async loadResourcesContent() {
        const resourcesContent = document.querySelector('.resources-content');
        resourcesContent.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading resources...</p>
            </div>
        `;

        // Simulate loading resources data
        setTimeout(() => {
            resourcesContent.innerHTML = `
                <h3>Resource Management</h3>
                <p>Monitor resource allocation and utilization</p>
                <div class="resource-stats">
                    <div class="stat-item">
                        <h4>Total Resources</h4>
                        <p>8 employees</p>
                    </div>
                    <div class="stat-item">
                        <h4>Billable</h4>
                        <p>6 employees</p>
                    </div>
                    <div class="stat-item">
                        <h4>On Bench</h4>
                        <p>2 employees</p>
                    </div>
                </div>
            `;
        }, 1000);
    }

    async loadBenchReportContent() {
        const benchContent = document.querySelector('.bench-content');
        benchContent.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading bench report...</p>
            </div>
        `;

        // Simulate loading bench data
        setTimeout(() => {
            benchContent.innerHTML = `
                <h3>Bench Report</h3>
                <p>Track unassigned resources and bench time</p>
                <div class="bench-stats">
                    <div class="bench-item">
                        <h4>Resources on Bench</h4>
                        <p>2 employees</p>
                    </div>
                    <div class="bench-item">
                        <h4>Average Bench Time</h4>
                        <p>15 days</p>
                    </div>
                    <div class="bench-item">
                        <h4>Bench Cost</h4>
                        <p>$5,000/month</p>
                    </div>
                </div>
            `;
        }, 1000);
    }

    async loadCurrencyContent() {
        const currencyContent = document.querySelector('.currency-content');
        currencyContent.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading currency data...</p>
            </div>
        `;

        // Simulate loading currency data
        setTimeout(() => {
            currencyContent.innerHTML = `
                <h3>Currency Management</h3>
                <p>Manage multi-currency projects and conversions</p>
                <div class="currency-rates">
                    <div class="rate-item">
                        <h4>USD to INR</h4>
                        <p>83.25</p>
                    </div>
                    <div class="rate-item">
                        <h4>EUR to INR</h4>
                        <p>90.15</p>
                    </div>
                    <div class="rate-item">
                        <h4>GBP to INR</h4>
                        <p>105.50</p>
                    </div>
                </div>
            `;
        }, 1000);
    }

    showCreateProjectModal() {
        // Implement create project modal
        alert('Create Project functionality would be implemented here');
    }

    showNotifications() {
        // Implement notifications panel
        alert('Notifications panel would be implemented here');
    }

    showUserMenu() {
        // Implement user menu dropdown
        alert('User menu would be implemented here');
    }

    showErrorMessage(message) {
        // Create and show error toast
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OpsDashboard();
});

// Add some additional CSS for loading states and error toasts
const additionalStyles = `
.loading {
    text-align: center;
    padding: 2rem;
    color: #64748b;
}

.loading i {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.projects-grid,
.resource-stats,
.bench-stats,
.currency-rates {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
}

.project-card,
.stat-item,
.bench-item,
.rate-item {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.project-card h4,
.stat-item h4,
.bench-item h4,
.rate-item h4 {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.5rem;
}

.error-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ef4444;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);