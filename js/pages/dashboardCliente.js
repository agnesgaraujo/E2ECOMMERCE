/**
 * Dashboard do Cliente
 * Sistema E2E Commerce
 */

class DashboardCliente {
    constructor() {
        this.auth = window.Auth;
        this.ui = window.UI;
        this.router = window.Router;
        this.userManager = window.UserManager;
    }

    /**
     * Renderiza o dashboard do cliente
     */
    render() {
        const app = document.getElementById('app');
        if (!app) return;

        const user = this.auth.getCurrentUser();
        if (!user) {
            this.router.navigate('/login');
            return;
        }

        app.innerHTML = `
            <div class="dashboard-cliente">
                <div class="dashboard-header">
                    <div class="welcome-section">
                        <h1>Bem-vindo, ${user.name}!</h1>
                        <p>Gerencie sua conta e acompanhe suas atividades</p>
                    </div>
                    <div class="dashboard-actions">
                        <button class="btn btn-outline" onclick="window.DashboardCliente.goToProfile()">
                            <svg class="icon icon-sm" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                            Meu Perfil
                        </button>
                    </div>
                </div>

                <div class="dashboard-content">
                    <div class="dashboard-grid">
                        <!-- Card de Informações Pessoais -->
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3>Informações Pessoais</h3>
                                <button class="btn btn-sm btn-outline" onclick="window.DashboardCliente.editProfile()">
                                    <svg class="icon icon-sm" viewBox="0 0 24 24">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                    </svg>
                                    Editar
                                </button>
                            </div>
                            <div class="card-body">
                                <div class="info-item">
                                    <span class="info-label">Nome:</span>
                                    <span class="info-value">${user.name}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Email:</span>
                                    <span class="info-value">${user.email}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Tipo de conta:</span>
                                    <span class="info-value">
                                        <span class="badge badge-profile-cliente">Cliente</span>
                                    </span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Membro desde:</span>
                                    <span class="info-value">${this.ui.formatDate(user.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Card de Atividades Recentes -->
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3>Atividades Recentes</h3>
                            </div>
                            <div class="card-body">
                                <div class="activity-list">
                                    <div class="activity-item">
                                        <div class="activity-icon">
                                            <svg class="icon" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                            </svg>
                                        </div>
                                        <div class="activity-content">
                                            <div class="activity-title">Conta criada</div>
                                            <div class="activity-time">${this.ui.formatDate(user.createdAt)}</div>
                                        </div>
                                    </div>
                                    <div class="activity-item">
                                        <div class="activity-icon">
                                            <svg class="icon" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                            </svg>
                                        </div>
                                        <div class="activity-content">
                                            <div class="activity-title">Último login</div>
                                            <div class="activity-time">Agora</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card de Estatísticas -->
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3>Estatísticas da Conta</h3>
                            </div>
                            <div class="card-body">
                                <div class="stats-grid">
                                    <div class="stat-item">
                                        <div class="stat-value">0</div>
                                        <div class="stat-label">Pedidos</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">0</div>
                                        <div class="stat-label">Favoritos</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">0</div>
                                        <div class="stat-label">Avaliações</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card de Ações Rápidas -->
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3>Ações Rápidas</h3>
                            </div>
                            <div class="card-body">
                                <div class="quick-actions">
                                    <button class="quick-action-btn" onclick="window.DashboardCliente.goToProfile()">
                                        <svg class="icon" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                        <span>Editar Perfil</span>
                                    </button>
                                    <button class="quick-action-btn" onclick="window.DashboardCliente.changePassword()">
                                        <svg class="icon" viewBox="0 0 24 24">
                                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                        </svg>
                                        <span>Alterar Senha</span>
                                    </button>
                                    <button class="quick-action-btn" onclick="window.DashboardCliente.viewOrders()">
                                        <svg class="icon" viewBox="0 0 24 24">
                                            <path d="M7 4V2c0-.55-.45-1-1-1s-1 .45-1 1v2H3c-.55 0-1 .45-1 1s.45 1 1 1h1v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V6h1c.55 0 1-.45 1-1s-.45-1-1-1h-2V2c0-.55-.45-1-1-1s-1 .45-1 1v2H7zm2 2h6v8H9V6z"/>
                                        </svg>
                                        <span>Meus Pedidos</span>
                                    </button>
                                    <button class="quick-action-btn" onclick="window.DashboardCliente.viewFavorites()">
                                        <svg class="icon" viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                        <span>Favoritos</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Vai para a página de perfil
     */
    goToProfile() {
        this.router.navigate('/perfil');
    }

    /**
     * Edita perfil
     */
    editProfile() {
        const user = this.auth.getCurrentUser();
        if (!user) return;

        const formHTML = `
            <form id="editProfileForm">
                <div class="form-group">
                    <label for="editName" class="form-label">Nome completo</label>
                    <input type="text" id="editName" name="name" class="form-control" value="${user.name}" required>
                </div>
                <div class="form-group">
                    <label for="editEmail" class="form-label">Email</label>
                    <input type="email" id="editEmail" name="email" class="form-control" value="${user.email}" required>
                </div>
                <div class="form-group">
                    <label for="editPhone" class="form-label">Telefone</label>
                    <input type="tel" id="editPhone" name="phone" class="form-control" value="${user.phone || ''}" placeholder="(11) 99999-9999">
                </div>
            </form>
        `;

        this.ui.showFormModal(
            'Editar Perfil',
            formHTML,
            (data) => this.handleEditProfile(data)
        );
    }

    /**
     * Manipula edição do perfil
     */
    async handleEditProfile(data) {
        try {
            const result = await this.userManager.updateUser(this.auth.currentUser.id, data);
            
            if (result.success) {
                this.ui.showToast('Sucesso!', 'Perfil atualizado com sucesso', 'success');
                this.render(); // Recarrega a página
            } else {
                this.ui.showToast('Erro', result.error, 'error');
            }
        } catch (error) {
            console.error('Erro ao editar perfil:', error);
            this.ui.showToast('Erro', 'Erro interno. Tente novamente.', 'error');
        }
    }

    /**
     * Altera senha
     */
    changePassword() {
        const formHTML = `
            <form id="changePasswordForm">
                <div class="form-group">
                    <label for="currentPassword" class="form-label">Senha atual</label>
                    <input type="password" id="currentPassword" name="currentPassword" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="newPassword" class="form-label">Nova senha</label>
                    <input type="password" id="newPassword" name="newPassword" class="form-control" required>
                    <div class="form-text">A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.</div>
                </div>
                <div class="form-group">
                    <label for="confirmPassword" class="form-label">Confirmar nova senha</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" class="form-control" required>
                </div>
            </form>
        `;

        this.ui.showFormModal(
            'Alterar Senha',
            formHTML,
            (data) => this.handleChangePassword(data)
        );
    }

    /**
     * Manipula alteração de senha
     */
    async handleChangePassword(data) {
        try {
            // Validação básica
            if (data.newPassword !== data.confirmPassword) {
                this.ui.showToast('Erro', 'As senhas não coincidem', 'error');
                return;
            }

            if (data.newPassword.length < 8) {
                this.ui.showToast('Erro', 'A nova senha deve ter pelo menos 8 caracteres', 'error');
                return;
            }

            const result = await this.auth.changePassword(data.currentPassword, data.newPassword);
            
            if (result.success) {
                this.ui.showToast('Sucesso!', 'Senha alterada com sucesso', 'success');
            } else {
                this.ui.showToast('Erro', result.error, 'error');
            }
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            this.ui.showToast('Erro', 'Erro interno. Tente novamente.', 'error');
        }
    }

    /**
     * Visualiza pedidos
     */
    viewOrders() {
        this.ui.showToast('Em breve', 'Funcionalidade de pedidos será implementada', 'info');
    }

    /**
     * Visualiza favoritos
     */
    viewFavorites() {
        this.ui.showToast('Em breve', 'Funcionalidade de favoritos será implementada', 'info');
    }
}

// Instância global
const dashboardCliente = new DashboardCliente();

// Exporta para uso global
window.DashboardCliente = dashboardCliente;

