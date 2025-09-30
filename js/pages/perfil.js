/**
 * Página de Perfil
 * Sistema E2E Commerce
 */

class PerfilPage {
    constructor() {
        this.auth = window.Auth;
        this.ui = window.UI;
        this.router = window.Router;
        this.userManager = window.UserManager;
    }

    /**
     * Renderiza a página de perfil
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
            <div class="perfil-page">
                <div class="perfil-header">
                    <div class="perfil-title">
                        <h1>Meu Perfil</h1>
                        <p>Gerencie suas informações pessoais e configurações da conta</p>
                    </div>
                    <div class="perfil-actions">
                        <button class="btn btn-outline" onclick="window.PerfilPage.goBack()">
                            <svg class="icon icon-sm" viewBox="0 0 24 24">
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                            </svg>
                            Voltar
                        </button>
                    </div>
                </div>

                <div class="perfil-content">
                    <div class="perfil-grid">
                        <!-- Card de Informações Pessoais -->
                        <div class="perfil-card">
                            <div class="card-header">
                                <h3>Informações Pessoais</h3>
                                <button class="btn btn-sm btn-primary" onclick="window.PerfilPage.editProfile()">
                                    <svg class="icon icon-sm" viewBox="0 0 24 24">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                    </svg>
                                    Editar
                                </button>
                            </div>
                            <div class="card-body">
                                <div class="profile-info">
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
                                            <span class="badge badge-profile-${user.profile}">${this.userManager.getProfileLabel(user.profile)}</span>
                                        </span>
                                    </div>
                                    ${user.phone ? `
                                        <div class="info-item">
                                            <span class="info-label">Telefone:</span>
                                            <span class="info-value">${user.phone}</span>
                                        </div>
                                    ` : ''}
                                    ${user.cpf ? `
                                        <div class="info-item">
                                            <span class="info-label">CPF:</span>
                                            <span class="info-value">${user.cpf}</span>
                                        </div>
                                    ` : ''}
                                    <div class="info-item">
                                        <span class="info-label">Membro desde:</span>
                                        <span class="info-value">${this.ui.formatDate(user.createdAt)}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="info-label">Última atualização:</span>
                                        <span class="info-value">${this.ui.formatDate(user.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card de Segurança -->
                        <div class="perfil-card">
                            <div class="card-header">
                                <h3>Segurança</h3>
                            </div>
                            <div class="card-body">
                                <div class="security-actions">
                                    <div class="security-item">
                                        <div class="security-info">
                                            <h4>Senha</h4>
                                            <p>Altere sua senha para manter sua conta segura</p>
                                        </div>
                                        <button class="btn btn-outline" onclick="window.PerfilPage.changePassword()">
                                            Alterar Senha
                                        </button>
                                    </div>
                                    
                                    <div class="security-item">
                                        <div class="security-info">
                                            <h4>Sessão Atual</h4>
                                            <p>Informações sobre sua sessão atual</p>
                                        </div>
                                        <button class="btn btn-outline" onclick="window.PerfilPage.viewSessionInfo()">
                                            Ver Detalhes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card de Atividades -->
                        <div class="perfil-card">
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
                                    ${user.updatedAt !== user.createdAt ? `
                                        <div class="activity-item">
                                            <div class="activity-icon">
                                                <svg class="icon" viewBox="0 0 24 24">
                                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                                </svg>
                                            </div>
                                            <div class="activity-content">
                                                <div class="activity-title">Perfil atualizado</div>
                                                <div class="activity-time">${this.ui.formatDate(user.updatedAt)}</div>
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>

                        <!-- Card de Configurações -->
                        <div class="perfil-card">
                            <div class="card-header">
                                <h3>Configurações</h3>
                            </div>
                            <div class="card-body">
                                <div class="settings-list">
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h4>Notificações</h4>
                                            <p>Gerencie suas preferências de notificação</p>
                                        </div>
                                        <button class="btn btn-outline" onclick="window.PerfilPage.manageNotifications()">
                                            Configurar
                                        </button>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <h4>Privacidade</h4>
                                            <p>Controle sua privacidade e dados</p>
                                        </div>
                                        <button class="btn btn-outline" onclick="window.PerfilPage.managePrivacy()">
                                            Configurar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card de Ações da Conta -->
                        <div class="perfil-card">
                            <div class="card-header">
                                <h3>Ações da Conta</h3>
                            </div>
                            <div class="card-body">
                                <div class="account-actions">
                                    <button class="btn btn-outline" onclick="window.PerfilPage.exportData()">
                                        <svg class="icon icon-sm" viewBox="0 0 24 24">
                                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                        </svg>
                                        Exportar Dados
                                    </button>
                                    
                                    <button class="btn btn-danger" onclick="window.PerfilPage.logout()">
                                        <svg class="icon icon-sm" viewBox="0 0 24 24">
                                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                                        </svg>
                                        Sair da Conta
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
     * Volta para a página anterior
     */
    goBack() {
        const user = this.auth.getCurrentUser();
        if (user.profile === 'admin') {
            this.router.navigate('/admin');
        } else if (user.profile === 'vendedor') {
            this.router.navigate('/vendedor');
        } else {
            this.router.navigate('/cliente');
        }
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
                    <label for="editName" class="form-label">Nome completo *</label>
                    <input type="text" id="editName" name="name" class="form-control" value="${user.name}" required>
                </div>
                <div class="form-group">
                    <label for="editEmail" class="form-label">Email *</label>
                    <input type="email" id="editEmail" name="email" class="form-control" value="${user.email}" required>
                </div>
                <div class="form-group">
                    <label for="editPhone" class="form-label">Telefone</label>
                    <input type="tel" id="editPhone" name="phone" class="form-control" value="${user.phone || ''}" placeholder="(11) 99999-9999">
                </div>
                <div class="form-group">
                    <label for="editCpf" class="form-label">CPF</label>
                    <input type="text" id="editCpf" name="cpf" class="form-control" value="${user.cpf || ''}" placeholder="000.000.000-00" maxlength="14">
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
            // Aplica máscara no CPF se fornecido
            if (data.cpf) {
                data.cpf = data.cpf.replace(/\D/g, '');
                if (data.cpf.length === 11) {
                    data.cpf = data.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                }
            }

            // Aplica máscara no telefone se fornecido
            if (data.phone) {
                const phoneDigits = data.phone.replace(/\D/g, '');
                if (phoneDigits.length === 11) {
                    data.phone = phoneDigits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                } else if (phoneDigits.length === 10) {
                    data.phone = phoneDigits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                }
            }

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
                    <label for="currentPassword" class="form-label">Senha atual *</label>
                    <input type="password" id="currentPassword" name="currentPassword" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="newPassword" class="form-label">Nova senha *</label>
                    <input type="password" id="newPassword" name="newPassword" class="form-control" required>
                    <div class="form-text">A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.</div>
                </div>
                <div class="form-group">
                    <label for="confirmPassword" class="form-label">Confirmar nova senha *</label>
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
     * Visualiza informações da sessão
     */
    viewSessionInfo() {
        const sessionStats = this.auth.getSessionStats();
        if (!sessionStats) {
            this.ui.showToast('Erro', 'Informações de sessão não disponíveis', 'error');
            return;
        }

        const content = `
            <div class="session-info">
                <div class="info-item">
                    <span class="info-label">ID da Sessão:</span>
                    <span class="info-value">${sessionStats.sessionId}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Perfil:</span>
                    <span class="info-value">
                        <span class="badge badge-profile-${sessionStats.profile}">${this.userManager.getProfileLabel(sessionStats.profile)}</span>
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">Duração da sessão:</span>
                    <span class="info-value">${Math.floor(sessionStats.sessionDuration / 60)} minutos</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Última atividade:</span>
                    <span class="info-value">${Math.floor(sessionStats.lastActivity / 60)} minutos atrás</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Status:</span>
                    <span class="info-value">
                        <span class="badge ${sessionStats.isActive ? 'badge-success' : 'badge-warning'}">
                            ${sessionStats.isActive ? 'Ativa' : 'Inativa'}
                        </span>
                    </span>
                </div>
            </div>
        `;

        this.ui.showModal({
            title: 'Informações da Sessão',
            content,
            size: 'md'
        });
    }

    /**
     * Gerencia notificações
     */
    manageNotifications() {
        this.ui.showToast('Em breve', 'Funcionalidade de notificações será implementada', 'info');
    }

    /**
     * Gerencia privacidade
     */
    managePrivacy() {
        this.ui.showToast('Em breve', 'Funcionalidade de privacidade será implementada', 'info');
    }

    /**
     * Exporta dados do usuário
     */
    exportData() {
        try {
            const user = this.auth.getCurrentUser();
            const userData = {
                ...user,
                exportedAt: new Date().toISOString(),
                exportedBy: user.id
            };

            const data = JSON.stringify(userData, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dados_usuario_${user.id}_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.ui.showToast('Sucesso!', 'Dados exportados com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            this.ui.showToast('Erro', 'Erro ao exportar dados', 'error');
        }
    }

    /**
     * Faz logout
     */
    logout() {
        this.ui.showConfirmModal(
            'Confirmar Logout',
            'Tem certeza que deseja sair da sua conta?',
            () => {
                this.auth.logout();
                this.ui.showToast('Logout realizado', 'Você foi desconectado com sucesso', 'info');
            }
        );
    }
}

// Instância global
const perfilPage = new PerfilPage();

// Exporta para uso global
window.PerfilPage = perfilPage;

