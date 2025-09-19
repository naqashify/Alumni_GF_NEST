// Modern Alumni Dashboard App
class AlumniDashboard {
    constructor() {
        this.data = {
            overview: {
                total_alumni: 2235,
                unique_batches: 15,
                states_represented: 42,
                organizations: 1074,
                alumni_with_linkedin: 713,
                mentoring_willing: 1742,
                placement_support_willing: 1786,
                mentoring_percentage: 77.9,
                placement_percentage: 79.9
            },
            batch_distribution: {"1": 4, "2": 2, "3": 8, "4": 31, "5": 26, "6": 24, "7": 66, "8": 34, "9": 49, "10": 79, "11": 162, "12": 156, "14": 522, "15": 493, "16": 579},
            big_bet_distribution: {"ABC": 350, "THC": 207, "DBC": 191, "ADC": 144, "ADC - Education": 142, "PLDP": 137, "DTP": 121, "PSL - SoE": 100, "PSL": 99, "SOESC": 93, "STP": 62, "SOH": 37, "SLDP": 36, "Gandhi Fellowship": 22, "PSL - SoH": 16},
            work_status_distribution: {"Intrapreneur": 1263, "Not working presently": 302, "Entrepreneur": 104, "Higher Studies": 59, "Freelancer/Consultant": 40},
            state_distribution: {"Uttar Pradesh ": 283, "Bihar": 269, "Maharashtra ": 265, "Madhya Pradesh": 123, "Jharkhand": 121, "New Delhi": 96, "West Bengal": 87, "Rajasthan ": 75, "Assam": 60, "Chhattisgarh": 53, "Gujarat": 48, "Karnataka": 45, "Kerala": 41, "Haryana": 37, "Andhra Pradesh": 34},
            mentoring_responses: {"Yes": 1253, "No. Won't be able to give time": 450, "Yes, for 10 hours in 6 months": 311, "Yes, for 20 hours in 12 months": 178, "yes": 21, "Depend on satuation": 4, "10 hours & 6 months": 2, "weekly 2 hours": 1, "weekly 6 hours": 1, "monthly 10 hours": 1},
            placement_responses: {"Yes": 1786, "No": 442, "yes": 6, "May be": 1},
            top_organizations: {"Piramal Foundation": 63, "Siksha": 22, "Open link foundation": 13, "Kaivalya Education Foundation": 10, "APU": 8, "Piramal Swasthya": 6, "Sampark Foundation": 5, "Rocket Learning": 5, "Open Links Foundation": 5, "Swadesh Foundation": 5},
            top_ug_colleges: {"Banaras Hindu University": 18, "Aligarh Muslim University": 10, "Mumbai University": 6, "University of Allahabad": 5, "BHU": 5, "Dev Sanskriti Vishwavidyalaya": 4, "Patna Women's College": 4},
            top_pg_universities: {"Banaras Hindu University": 44, "IGNOU": 28, "Mahatma Gandhi Kashi Viyapeeth": 25, "Patna University": 22, "Visva Bharati University Shantiniketan": 11, "Aligarh Muslim University": 9, "Central University of South Bihar": 8}
        };
        
        this.currentSection = 'overview';
        this.charts = {};
        this.tableData = [];
        this.filteredData = [];
        this.currentPage = 1;
        this.rowsPerPage = 10;
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupFilters();
        this.setupSearch();
        this.setupExport();
        this.generateSampleData();
        this.renderStateRanking();
        this.renderOrganizations();
        this.setupTable();
        this.animateProgressBars();
        this.setupChartActions();
    }

    setupNavigation() {
        const tabItems = document.querySelectorAll('.tab-item');
        tabItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });
    }

    switchSection(section) {
        // Update tab navigation
        document.querySelectorAll('.tab-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeTabItem = document.querySelector(`[data-section="${section}"]`);
        if (activeTabItem) {
            activeTabItem.classList.add('active');
        }

        // Update content with fade animation
        document.querySelectorAll('.content-section').forEach(contentSection => {
            contentSection.classList.remove('active');
        });
        const activeSection = document.getElementById(section);
        if (activeSection) {
            activeSection.classList.add('active');
        }

        this.currentSection = section;
        
        // Render charts when switching to specific sections
        setTimeout(() => {
            this.renderChartsForSection(section);
            if (section === 'overview') {
                this.animateProgressBars();
            }
        }, 50);
    }

    renderChartsForSection(section) {
        switch(section) {
            case 'demographics':
                this.renderBatchChart();
                this.renderWorkStatusChart();
                this.renderBigBetChart();
                break;
            case 'engagement':
                this.renderMentoringChart();
                this.renderPlacementChart();
                break;
            case 'geographic':
                this.renderStatesChart();
                break;
            case 'academic':
                this.renderUGChart();
                this.renderPGChart();
                break;
        }
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const progress = bar.dataset.progress;
            setTimeout(() => {
                bar.style.width = `${progress}%`;
            }, 500);
        });
    }

    setupChartActions() {
        const chartBtns = document.querySelectorAll('.chart-btn');
        chartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Add visual feedback
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        btn.style.transform = '';
                    }, 100);
                }, 100);
            });
        });
    }

    setupFilters() {
        // Populate batch filter
        const batchFilter = document.getElementById('batchFilter');
        if (batchFilter) {
            Object.keys(this.data.batch_distribution).forEach(batch => {
                const option = document.createElement('option');
                option.value = batch;
                option.textContent = `Batch ${batch}`;
                batchFilter.appendChild(option);
            });
            batchFilter.addEventListener('change', () => this.applyFilters());
        }

        // Populate work status filter
        const workStatusFilter = document.getElementById('workStatusFilter');
        if (workStatusFilter) {
            Object.keys(this.data.work_status_distribution).forEach(status => {
                const option = document.createElement('option');
                option.value = status;
                option.textContent = status;
                workStatusFilter.appendChild(option);
            });
            workStatusFilter.addEventListener('change', () => this.applyFilters());
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const tableSearch = document.getElementById('tableSearch');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchData(e.target.value);
            });
        }
        
        if (tableSearch) {
            tableSearch.addEventListener('input', (e) => {
                this.searchData(e.target.value);
            });
        }
    }

    setupExport() {
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportData();
            });
        }
    }

    generateSampleData() {
        const batches = Object.keys(this.data.batch_distribution);
        const states = Object.keys(this.data.state_distribution);
        const workStatuses = Object.keys(this.data.work_status_distribution);
        const bigBets = Object.keys(this.data.big_bet_distribution);
        
        this.tableData = [];
        
        for (let i = 0; i < 100; i++) {
            const batch = batches[Math.floor(Math.random() * batches.length)];
            const state = states[Math.floor(Math.random() * states.length)].trim();
            const workStatus = workStatuses[Math.floor(Math.random() * workStatuses.length)];
            const bigBet = bigBets[Math.floor(Math.random() * bigBets.length)];
            const mentoring = Math.random() > 0.22 ? 'Yes' : 'No';
            const placement = Math.random() > 0.20 ? 'Yes' : 'No';
            
            this.tableData.push({
                id: i + 1,
                batch: batch,
                state: state,
                workStatus: workStatus,
                bigBet: bigBet,
                mentoring: mentoring,
                placementSupport: placement
            });
        }
        
        this.filteredData = [...this.tableData];
    }

    renderStateRanking() {
        const rankingContainer = document.getElementById('statesRanking');
        if (!rankingContainer) return;
        
        const topStates = Object.entries(this.data.state_distribution)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
        
        rankingContainer.innerHTML = topStates.map(([state, count], index) => `
            <div class="ranking-item">
                <span class="ranking-number">${index + 1}</span>
                <span class="ranking-state">${state.trim()}</span>
                <span class="ranking-count">${count}</span>
            </div>
        `).join('');
    }

    renderOrganizations() {
        const orgContainer = document.getElementById('organizationsList');
        if (!orgContainer) return;
        
        const topOrgs = Object.entries(this.data.top_organizations)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
        
        orgContainer.innerHTML = topOrgs.map(([org, count]) => `
            <div class="org-item">
                <span class="org-name">${org.replace(/\\n/g, '').trim()}</span>
                <span class="org-count">${count}</span>
            </div>
        `).join('');
    }

    getChartColors() {
        return ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];
    }

    getChartConfig(type = 'bar') {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#f5f5f5',
                        font: {
                            family: 'system-ui, -apple-system, sans-serif'
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(31, 33, 33, 0.9)',
                    titleColor: '#f5f5f5',
                    bodyColor: '#f5f5f5',
                    borderColor: '#1FB8CD',
                    borderWidth: 1
                }
            },
            scales: type === 'doughnut' ? {} : {
                x: {
                    ticks: {
                        color: '#f5f5f5',
                        maxRotation: 45
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#f5f5f5'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        };
    }

    renderBatchChart() {
        const ctx = document.getElementById('batchChart');
        if (!ctx) return;
        
        if (this.charts.batch) {
            this.charts.batch.destroy();
        }
        
        const sortedBatches = Object.entries(this.data.batch_distribution)
            .sort(([a], [b]) => parseInt(a) - parseInt(b));
        
        this.charts.batch = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedBatches.map(([batch]) => `Batch ${batch}`),
                datasets: [{
                    label: 'Alumni Count',
                    data: sortedBatches.map(([,count]) => count),
                    backgroundColor: this.getChartColors(),
                    borderWidth: 2,
                    borderColor: 'rgba(31, 184, 205, 0.3)'
                }]
            },
            options: {
                ...this.getChartConfig('bar'),
                plugins: {
                    ...this.getChartConfig('bar').plugins,
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    renderWorkStatusChart() {
        const ctx = document.getElementById('workStatusChart');
        if (!ctx) return;
        
        if (this.charts.workStatus) {
            this.charts.workStatus.destroy();
        }
        
        this.charts.workStatus = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(this.data.work_status_distribution),
                datasets: [{
                    data: Object.values(this.data.work_status_distribution),
                    backgroundColor: this.getChartColors(),
                    borderWidth: 3,
                    borderColor: '#1f2121'
                }]
            },
            options: this.getChartConfig('doughnut')
        });
    }

    renderBigBetChart() {
        const ctx = document.getElementById('bigBetChart');
        if (!ctx) return;
        
        if (this.charts.bigBet) {
            this.charts.bigBet.destroy();
        }
        
        const sortedBigBet = Object.entries(this.data.big_bet_distribution)
            .sort(([,a], [,b]) => b - a);
        
        this.charts.bigBet = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedBigBet.map(([program]) => program),
                datasets: [{
                    label: 'Alumni Count',
                    data: sortedBigBet.map(([,count]) => count),
                    backgroundColor: this.getChartColors(),
                    borderWidth: 2,
                    borderColor: 'rgba(31, 184, 205, 0.3)'
                }]
            },
            options: {
                ...this.getChartConfig('bar'),
                plugins: {
                    ...this.getChartConfig('bar').plugins,
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    renderMentoringChart() {
        const ctx = document.getElementById('mentoringChart');
        if (!ctx) return;
        
        if (this.charts.mentoring) {
            this.charts.mentoring.destroy();
        }
        
        const mentoringData = {
            'Willing to Mentor': 1742,
            'Not Available': 493
        };
        
        this.charts.mentoring = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(mentoringData),
                datasets: [{
                    data: Object.values(mentoringData),
                    backgroundColor: ['#1FB8CD', '#FFC185'],
                    borderWidth: 3,
                    borderColor: '#1f2121'
                }]
            },
            options: this.getChartConfig('doughnut')
        });
    }

    renderPlacementChart() {
        const ctx = document.getElementById('placementChart');
        if (!ctx) return;
        
        if (this.charts.placement) {
            this.charts.placement.destroy();
        }
        
        const placementData = {
            'Willing to Support': 1786,
            'Not Available': 449
        };
        
        this.charts.placement = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(placementData),
                datasets: [{
                    data: Object.values(placementData),
                    backgroundColor: ['#B4413C', '#ECEBD5'],
                    borderWidth: 3,
                    borderColor: '#1f2121'
                }]
            },
            options: this.getChartConfig('doughnut')
        });
    }

    renderStatesChart() {
        const ctx = document.getElementById('statesChart');
        if (!ctx) return;
        
        if (this.charts.states) {
            this.charts.states.destroy();
        }
        
        const topStates = Object.entries(this.data.state_distribution)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
        
        this.charts.states = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topStates.map(([state]) => state.trim()),
                datasets: [{
                    label: 'Alumni Count',
                    data: topStates.map(([,count]) => count),
                    backgroundColor: this.getChartColors(),
                    borderWidth: 2,
                    borderColor: 'rgba(31, 184, 205, 0.3)'
                }]
            },
            options: {
                ...this.getChartConfig('bar'),
                plugins: {
                    ...this.getChartConfig('bar').plugins,
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    renderUGChart() {
        const ctx = document.getElementById('ugChart');
        if (!ctx) return;
        
        if (this.charts.ug) {
            this.charts.ug.destroy();
        }
        
        const sortedUG = Object.entries(this.data.top_ug_colleges)
            .sort(([,a], [,b]) => b - a);
        
        this.charts.ug = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedUG.map(([college]) => college),
                datasets: [{
                    label: 'Alumni Count',
                    data: sortedUG.map(([,count]) => count),
                    backgroundColor: this.getChartColors(),
                    borderWidth: 2,
                    borderColor: 'rgba(31, 184, 205, 0.3)'
                }]
            },
            options: {
                ...this.getChartConfig('bar'),
                plugins: {
                    ...this.getChartConfig('bar').plugins,
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    renderPGChart() {
        const ctx = document.getElementById('pgChart');
        if (!ctx) return;
        
        if (this.charts.pg) {
            this.charts.pg.destroy();
        }
        
        const sortedPG = Object.entries(this.data.top_pg_universities)
            .sort(([,a], [,b]) => b - a);
        
        this.charts.pg = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedPG.map(([university]) => university),
                datasets: [{
                    label: 'Alumni Count',
                    data: sortedPG.map(([,count]) => count),
                    backgroundColor: this.getChartColors(),
                    borderWidth: 2,
                    borderColor: 'rgba(31, 184, 205, 0.3)'
                }]
            },
            options: {
                ...this.getChartConfig('bar'),
                plugins: {
                    ...this.getChartConfig('bar').plugins,
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    setupTable() {
        this.renderTable();
        this.setupPagination();
        
        const rowsSelect = document.getElementById('rowsPerPage');
        if (rowsSelect) {
            rowsSelect.addEventListener('change', (e) => {
                this.rowsPerPage = parseInt(e.target.value);
                this.currentPage = 1;
                this.renderTable();
                this.setupPagination();
            });
        }
        
        const headers = document.querySelectorAll('.data-table th');
        headers.forEach((header, index) => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                const columns = ['batch', 'state', 'workStatus', 'bigBet', 'mentoring', 'placementSupport'];
                if (columns[index]) {
                    this.sortTable(columns[index]);
                }
            });
        });
    }

    renderTable() {
        const tbody = document.getElementById('tableBody');
        if (!tbody) return;
        
        const startIndex = (this.currentPage - 1) * this.rowsPerPage;
        const endIndex = startIndex + this.rowsPerPage;
        const pageData = this.filteredData.slice(startIndex, endIndex);
        
        tbody.innerHTML = pageData.map(row => `
            <tr>
                <td>${row.batch}</td>
                <td>${row.state}</td>
                <td><span class="status-badge ${this.getStatusClass(row.workStatus)}">${row.workStatus}</span></td>
                <td>${row.bigBet}</td>
                <td>${row.mentoring}</td>
                <td>${row.placementSupport}</td>
            </tr>
        `).join('');
    }

    getStatusClass(status) {
        if (status === 'Intrapreneur') return 'working';
        if (status === 'Not working presently') return 'not-working';
        if (status === 'Entrepreneur') return 'entrepreneur';
        if (status === 'Higher Studies') return 'studies';
        return 'working';
    }

    setupPagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.rowsPerPage);
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        
        let paginationHTML = `
            <button ${this.currentPage === 1 ? 'disabled' : ''} onclick="window.dashboard.changePage(${this.currentPage - 1})">Previous</button>
        `;
        
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `<button class="${i === this.currentPage ? 'active' : ''}" onclick="window.dashboard.changePage(${i})">${i}</button>`;
        }
        
        paginationHTML += `
            <button ${this.currentPage === totalPages ? 'disabled' : ''} onclick="window.dashboard.changePage(${this.currentPage + 1})">Next</button>
        `;
        
        pagination.innerHTML = paginationHTML;
    }

    changePage(page) {
        const totalPages = Math.ceil(this.filteredData.length / this.rowsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
            this.setupPagination();
        }
    }

    sortTable(column) {
        this.filteredData.sort((a, b) => {
            const aVal = a[column];
            const bVal = b[column];
            
            if (column === 'batch') {
                return parseInt(aVal) - parseInt(bVal);
            }
            
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return aVal.localeCompare(bVal);
            }
            
            return aVal > bVal ? 1 : -1;
        });
        
        this.currentPage = 1;
        this.renderTable();
        this.setupPagination();
    }

    applyFilters() {
        const batchFilter = document.getElementById('batchFilter');
        const workStatusFilter = document.getElementById('workStatusFilter');
        
        const batchValue = batchFilter ? batchFilter.value : '';
        const workStatusValue = workStatusFilter ? workStatusFilter.value : '';
        
        this.filteredData = this.tableData.filter(row => {
            return (
                (!batchValue || row.batch === batchValue) &&
                (!workStatusValue || row.workStatus === workStatusValue)
            );
        });
        
        this.currentPage = 1;
        this.renderTable();
        this.setupPagination();
    }

    searchData(query) {
        if (!query.trim()) {
            this.filteredData = [...this.tableData];
        } else {
            const lowerQuery = query.toLowerCase();
            this.filteredData = this.tableData.filter(row => 
                Object.values(row).some(value => 
                    value.toString().toLowerCase().includes(lowerQuery)
                )
            );
        }
        
        this.currentPage = 1;
        this.renderTable();
        this.setupPagination();
    }

    exportData() {
        const headers = ['Batch', 'State', 'Work Status', 'Big Bet', 'Mentoring', 'Placement Support'];
        const csvContent = [
            headers.join(','),
            ...this.filteredData.map(row => 
                [row.batch, row.state, row.workStatus, row.bigBet, row.mentoring, row.placementSupport]
                .map(field => `"${field}"`)
                .join(',')
            )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gandhi_fellowship_alumni_data.csv';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new AlumniDashboard();
});