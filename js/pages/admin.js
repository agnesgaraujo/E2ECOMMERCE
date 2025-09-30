/**
 * Página de Administração
 * Sistema E2E Commerce
 */

class AdminPage {
    constructor() {
        this.auth = window.Auth;
        this.ui = window.UI;
        this.router = window.Router;
        this.userManager = window.UserManager;
        this.currentView = 'users';
        this.users = [];
        this.stats = null;
    }

    /**
     * Renderiza a página de administração
     */
    render() {
        const app = document.getElementById('app');
        if (!app) return;

        const user = this.auth.getCurrentUser();
        if (!user || user.profile !== 'admin') {
            this.router.navigate('/unauthorized');
            return;
        }

        app.innerHTML = `
            <div class="admin-page">
                <div class="admin-header">
                    <div class="admin-title">
                        <h1>Painel Administrativo</h1>
                        <p>Bem-vindo, ${user.name}! Gerencie o sistema E2E Commerce</p>
                    </div>
                    <div class="admin-actions">
                        <button class="btn btn-primary" onclick="window.AdminPage.addUser()">
                            <svg class="icon icon-sm" viewBox="0 0 24 24">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            </svg>
                            Adicionar Usuário
                        </button>
                    </div>
                </div>

                <div class="admin-content">
                    <div class="admin-sidebar">
                        <nav class="admin-nav">
                            <button class="nav-item ${this.currentView === 'users' ? 'active' : ''}" onclick="window.AdminPage.setView('users')">
                                <svg class="icon" viewBox="0 0 24 24">
                                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10.5l-1.5-2.5C12.04 7.37 11.3 7 10.5 7H9.46c-.8 0-1.54.37-2.01.99L5 10.5l-1.5-2.5C3.04 7.37 2.3 7 1.5 7H.5v2H1.5c.28 0 .5.22.5.5s-.22.5-.5.5H.5v2H1.5c.28 0 .5.22.5.5s-.22.5-.5.5H.5v2H1.5c.28 0 .5.22.5.5s-.22.5-.5.5H.5v2h1c.8 0 1.54-.37 2.01-.99L5 13.5l1.5 2.5c.47.62 1.21.99 2.01.99h1.04c.8 0 1.54-.37 2.01-.99L13 13.5l1.5 2.5c.47.62 1.21.99 2.01.99h1.04c.8 0 1.54-.37 2.01-.99L21 13.5l1.5 2.5c.47.62 1.21.99 2.01.99H26v-2h-1.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5H26v-2h-1.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5H26v-2h-1.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5H26V4h-2v18z"/>
                                </svg>
                                Usuários
                            </button>
                            <button class="nav-item ${this.currentView === 'stats' ? 'active' : ''}" onclick="window.AdminPage.setView('stats')">
                                <svg class="icon" viewBox="0 0 24 24">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                                </svg>
                                Estatísticas
                            </button>
                            <button class="nav-item ${this.currentView === 'settings' ? 'active' : ''}" onclick="window.AdminPage.setView('settings')">
                                <svg class="icon" viewBox="0 0 24 24">
                                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                                </svg>
                                Configurações
                            </button>
                        </nav>
                    </div>

                    <div class="admin-main">
                        <div id="adminContent">
                            <!-- Conteúdo será carregado dinamicamente -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.loadData();
    }

    /**
     * Carrega dados iniciais
     */
    async loadData() {
        try {
            // Carrega usuários
            const usersResult = this.userManager.getAllUsers();
            if (usersResult.success) {
                this.users = usersResult.users;
            }

            // Carrega estatísticas
            const statsResult = this.userManager.getUserStats();
            if (statsResult.success) {
                this.stats = statsResult.stats;
            }

            // Renderiza view atual
            this.renderCurrentView();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.ui.showToast('Erro', 'Erro ao carregar dados', 'error');
        }
    }

    /**
     * Define a view atual
     */
    setView(view) {
        this.currentView = view;
        this.renderCurrentView();
        
        // Atualiza navegação
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        event.target.closest('.nav-item').classList.add('active');
    }

    /**
     * Renderiza a view atual
     */
    renderCurrentView() {
        const content = document.getElementById('adminContent');
        if (!content) return;

        switch (this.currentView) {
            case 'users':
                this.renderUsersView();
                break;
            case 'stats':
                this.renderStatsView();
                break;
            case 'settings':
                this.renderSettingsView();
                break;
        }
    }

    /**
     * Renderiza view de usuários
     */
    renderUsersView() {
        const content = document.getElementById('adminContent');
        if (!content) return;

        content.innerHTML = `
            <div class="admin-section">
                <div class="section-header">
                    <h2>Gerenciar Usuários</h2>
                    <div class="section-actions">
                        <div class="search-box">
                            <input type="text" id="userSearch" placeholder="Buscar usuários..." onkeyup="window.AdminPage.searchUsers(this.value)">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                        </div>
                        <button class="btn btn-primary" onclick="window.AdminPage.addUser()">
                            <svg class="icon icon-sm" viewBox="0 0 24 24">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            </svg>
                            Adicionar Usuário
                        </button>
                    </div>
                </div>

                <div class="users-table-container">
                    ${this.renderUsersTable()}
                </div>
            </div>
        `;
    }

    /**
     * Renderiza tabela de usuários
     */
    renderUsersTable() {
        if (!this.users || this.users.length === 0) {
            return `
                <div class="empty-state">
                    <svg class="icon icon-lg" viewBox="0 0 24 24">
                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10.5l-1.5-2.5C12.04 7.37 11.3 7 10.5 7H9.46c-.8 0-1.54.37-2.01.99L5 10.5l-1.5-2.5C3.04 7.37 2.3 7 1.5 7H.5v2H1.5c.28 0 .5.22.5.5s-.22.5-.5.5H.5v2H1.5c.28 0 .5.22.5.5s-.22.5-.5.5H.5v2H1.5c.28 0 .5.22.5.5s-.22.5-.5.5H.5v2h1c.8 0 1.54-.37 2.01-.99L5 13.5l1.5 2.5c.47.62 1.21.99 2.01.99h1.04c.8 0 1.54-.37 2.01-.99L13 13.5l1.5 2.5c.47.62 1.21.99 2.01.99h1.04c.8 0 1.54-.37 2.01-.99L21 13.5l1.5 2.5c.47.62 1.21.99 2.01.99H26v-2h-1.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5H26v-2h-1.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5H26v-2h-1.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5H26V4h-2v18z"/>
                    </svg>
                    <h3>Nenhum usuário encontrado</h3>
                    <p>Adicione o primeiro usuário para começar</p>
                </div>
            `;
        }

        const columns = [
            { key: 'name', title: 'Nome' },
            { key: 'email', title: 'Email' },
            { 
                key: 'profile', 
                title: 'Perfil',
                render: (value) => `<span class="badge badge-profile-${value}">${this.userManager.getProfileLabel(value)}</span>`
            },
            { 
                key: 'createdAt', 
                title: 'Criado em',
                render: (value) => this.ui.formatDate(value)
            },
            {
                key: 'actions',
                title: 'Ações',
                render: (value, row) => `
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-outline" onclick="window.AdminPage.editUser('${row.id}')" title="Editar">
                            <svg class="icon icon-sm" viewBox="0 0 24 24">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                        </button>
                        ${this.userManager.canDeleteUser(row.id) ? `
                            <button class="btn btn-sm btn-danger" onclick="window.AdminPage.deleteUser('${row.id}')" title="Excluir">
                                <svg class="icon icon-sm" viewBox="0 0 24 24">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                            </button>
                        ` : ''}
                    </div>
                `
            }
        ];

        return this.ui.createTable(this.users, columns, {
            striped: true,
            hover: true,
            responsive: true
        });
    }

    /**
     * Renderiza view de estatísticas
     */
    renderStatsView() {
        const content = document.getElementById('adminContent');
        if (!content) return;

        content.innerHTML = `
            <div class="admin-section">
                <div class="section-header">
                    <h2>Estatísticas do Sistema</h2>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10.5l-1.5-2.5C12.04 7.37 11.3 7 10.5 7H9.46c-.8 0-1.54.37-2.01.99L5 10.5l-1.5-2.5C3.04 7.37 2.3 7 1.5 7H.5v2H1.5c.28 0 .5.22.5.5s-.22.5-.5.5H.5v2H1.5c.28 0 .5.22.5.5s-.22.5-.5.5H.5v2H1.5c.28 0 .5.22.5.5s-.22.5-.5.5H.5v2h1c.8 0 1.54-.37 2.01-.99L5 13.5l1.5 2.5c.47.62 1.21.99 2.01.99h1.04c.8 0 1.54-.37 2.01-.99L13 13.5l1.5 2.5c.47.62 1.21.99 2.01.99h1.04c.8 0 1.54-.37 2.01-.99L21 13.5l1.5 2.5c.47.62 1.21.99 2.01.99H26v-2h-1.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5H26v-2h-1.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5H26v-2h-1.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5H26V4h-2v18z"/>
                            </svg>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${this.stats?.total || 0}</div>
                            <div class="stat-label">Total de Usuários</div>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${this.stats?.byProfile?.cliente || 0}</div>
                            <div class="stat-label">Clientes</div>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M20 6h-2l-2-2H8L6 6H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
                            </svg>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${this.stats?.byProfile?.vendedor || 0}</div>
                            <div class="stat-label">Vendedores</div>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${this.stats?.byProfile?.admin || 0}</div>
                            <div class="stat-label">Administradores</div>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                            </svg>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${this.stats?.recent || 0}</div>
                            <div class="stat-label">Usuários Recentes (7 dias)</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza view de configurações
     */
    renderSettingsView() {
        const content = document.getElementById('adminContent');
        if (!content) return;

        content.innerHTML = `
            <div class="admin-section">
                <div class="section-header">
                    <h2>Configurações do Sistema</h2>
                </div>

                <div class="settings-grid">
                    <div class="settings-card">
                        <div class="card-header">
                            <h3>Dados de Exemplo</h3>
                        </div>
                        <div class="card-body">
                            <p>Inicialize o sistema com dados de exemplo para testes.</p>
                            <button class="btn btn-primary" onclick="window.AdminPage.initializeSampleData()">
                                Inicializar Dados
                            </button>
                        </div>
                    </div>

                    <div class="settings-card">
                        <div class="card-header">
                            <h3>Exportar Dados</h3>
                        </div>
                        <div class="card-body">
                            <p>Exporte todos os dados de usuários em formato JSON.</p>
                            <button class="btn btn-outline" onclick="window.AdminPage.exportUsers()">
                                Exportar Usuários
                            </button>
                        </div>
                    </div>

                    <div class="settings-card">
                        <div class="card-header">
                            <h3>Limpar Dados</h3>
                        </div>
                        <div class="card-body">
                            <p>⚠️ Remove todos os dados do sistema. Esta ação não pode ser desfeita.</p>
                            <button class="btn btn-danger" onclick="window.AdminPage.clearAllData()">
                                Limpar Todos os Dados
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Busca usuários
     */
    searchUsers(query) {
        if (!query || query.trim().length < 2) {
            this.renderUsersTable();
            return;
        }

        const result = this.userManager.searchUsers(query);
        if (result.success) {
            this.users = result.users;
            this.renderUsersTable();
        }
    }

    /**
     * Adiciona usuário
     */
    addUser() {
        const formHTML = `
            <form id="addUserForm">
                <div class="form-group">
                    <label for="addName" class="form-label">Nome completo *</label>
                    <input type="text" id="addName" name="name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="addEmail" class="form-label">Email *</label>
                    <input type="email" id="addEmail" name="email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="addProfile" class="form-label">Perfil *</label>
                    <select id="addProfile" name="profile" class="form-control" required>
                        <option value="">Selecione o perfil</option>
                        <option value="cliente">Cliente</option>
                        <option value="vendedor">Vendedor</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="addPassword" class="form-label">Senha *</label>
                    <input type="password" id="addPassword" name="password" class="form-control" required>
                    <div class="form-text">A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.</div>
                </div>
                <div class="form-group">
                    <label for="addPasswordConfirmation" class="form-label">Confirmar senha *</label>
                    <input type="password" id="addPasswordConfirmation" name="passwordConfirmation" class="form-control" required>
                </div>
            </form>
        `;

        this.ui.showFormModal(
            'Adicionar Usuário',
            formHTML,
            (data) => this.handleAddUser(data)
        );
    }

    /**
     * Manipula adição de usuário
     */
    async handleAddUser(data) {
        try {
            const result = await this.userManager.createUser(data);
            
            if (result.success) {
                this.ui.showToast('Sucesso!', 'Usuário criado com sucesso', 'success');
                this.loadData(); // Recarrega dados
            } else {
                this.ui.showToast('Erro', result.error || 'Verifique os dados informados', 'error');
            }
        } catch (error) {
            console.error('Erro ao adicionar usuário:', error);
            this.ui.showToast('Erro', 'Erro interno. Tente novamente.', 'error');
        }
    }

    /**
     * Edita usuário
     */
    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const formHTML = `
            <form id="editUserForm">
                <div class="form-group">
                    <label for="editName" class="form-label">Nome completo *</label>
                    <input type="text" id="editName" name="name" class="form-control" value="${user.name}" required>
                </div>
                <div class="form-group">
                    <label for="editEmail" class="form-label">Email *</label>
                    <input type="email" id="editEmail" name="email" class="form-control" value="${user.email}" required>
                </div>
                <div class="form-group">
                    <label for="editProfile" class="form-label">Perfil *</label>
                    <select id="editProfile" name="profile" class="form-control" required>
                        <option value="cliente" ${user.profile === 'cliente' ? 'selected' : ''}>Cliente</option>
                        <option value="vendedor" ${user.profile === 'vendedor' ? 'selected' : ''}>Vendedor</option>
                        <option value="admin" ${user.profile === 'admin' ? 'selected' : ''}>Administrador</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editPassword" class="form-label">Nova senha (opcional)</label>
                    <input type="password" id="editPassword" name="password" class="form-control">
                    <div class="form-text">Deixe em branco para manter a senha atual.</div>
                </div>
            </form>
        `;

        this.ui.showFormModal(
            'Editar Usuário',
            formHTML,
            (data) => this.handleEditUser(userId, data)
        );
    }

    /**
     * Manipula edição de usuário
     */
    async handleEditUser(userId, data) {
        try {
            const result = await this.userManager.updateUser(userId, data);
            
            if (result.success) {
                this.ui.showToast('Sucesso!', 'Usuário atualizado com sucesso', 'success');
                this.loadData(); // Recarrega dados
            } else {
                this.ui.showToast('Erro', result.error, 'error');
            }
        } catch (error) {
            console.error('Erro ao editar usuário:', error);
            this.ui.showToast('Erro', 'Erro interno. Tente novamente.', 'error');
        }
    }

    /**
     * Exclui usuário
     */
    deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        this.ui.showConfirmModal(
            'Confirmar Exclusão',
            `Tem certeza que deseja excluir o usuário "${user.name}"? Esta ação não pode ser desfeita.`,
            () => this.handleDeleteUser(userId)
        );
    }

    /**
     * Manipula exclusão de usuário
     */
    async handleDeleteUser(userId) {
        try {
            const result = this.userManager.deleteUser(userId);
            
            if (result.success) {
                this.ui.showToast('Sucesso!', 'Usuário excluído com sucesso', 'success');
                this.loadData(); // Recarrega dados
            } else {
                this.ui.showToast('Erro', result.error, 'error');
            }
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            this.ui.showToast('Erro', 'Erro interno. Tente novamente.', 'error');
        }
    }

    /**
     * Inicializa dados de exemplo
     */
    async initializeSampleData() {
        try {
            const result = await this.userManager.initializeSampleData();
            
            if (result.success) {
                this.ui.showToast('Sucesso!', 'Dados de exemplo criados com sucesso', 'success');
                this.loadData(); // Recarrega dados
            } else {
                this.ui.showToast('Erro', result.error, 'error');
            }
        } catch (error) {
            console.error('Erro ao inicializar dados:', error);
            this.ui.showToast('Erro', 'Erro interno. Tente novamente.', 'error');
        }
    }

    /**
     * Exporta usuários
     */
    exportUsers() {
        try {
            const result = this.userManager.exportUsers();
            
            if (result.success) {
                // Cria e baixa arquivo
                const blob = new Blob([result.data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = result.filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                this.ui.showToast('Sucesso!', 'Dados exportados com sucesso', 'success');
            } else {
                this.ui.showToast('Erro', result.error, 'error');
            }
        } catch (error) {
            console.error('Erro ao exportar usuários:', error);
            this.ui.showToast('Erro', 'Erro interno. Tente novamente.', 'error');
        }
    }

    /**
     * Limpa todos os dados
     */
    clearAllData() {
        this.ui.showConfirmModal(
            'Confirmar Limpeza',
            'Tem certeza que deseja limpar TODOS os dados do sistema? Esta ação não pode ser desfeita e removerá todos os usuários e configurações.',
            () => this.handleClearAllData()
        );
    }

    /**
     * Manipula limpeza de dados
     */
    handleClearAllData() {
        try {
            // Limpa storage
            window.Storage.storage.clear();
            window.Storage.sessionStorage.clearSession();
            
            this.ui.showToast('Sucesso!', 'Todos os dados foram removidos', 'success');
            
            // Redireciona para login
            setTimeout(() => {
                this.router.navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
            this.ui.showToast('Erro', 'Erro interno. Tente novamente.', 'error');
        }
    }
}

// Instância global
const adminPage = new AdminPage();

// Exporta para uso global
window.AdminPage = adminPage;

