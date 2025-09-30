/**
 * Sistema de Autenticação
 * Sistema E2E Commerce
 */

class Auth {
    constructor() {
        this.storage = window.Storage;
        this.crypto = window.Crypto;
        this.validators = window.Validators;
        this.currentUser = null;
        this.session = null;
    }

    /**
     * Inicializa o sistema de autenticação
     */
    init() {
        try {
            // Verifica se há sessão ativa
            this.session = this.storage.sessionStorage.getSession();
            
            if (this.session && this.storage.sessionStorage.isSessionValid()) {
                // Carrega dados do usuário
                this.currentUser = this.storage.userStorage.getUserById(this.session.userId);
                
                if (this.currentUser) {
                    console.log('✅ Usuário autenticado:', this.currentUser.name);
                    this.updateLastActivity();
                } else {
                    console.log('❌ Usuário não encontrado, limpando sessão');
                    this.logout();
                }
            } else {
                console.log('📝 Nenhuma sessão ativa');
            }
        } catch (error) {
            console.error('❌ Erro ao inicializar autenticação:', error);
        }
    }

    /**
     * Faz login do usuário
     */
    async login(email, password) {
        try {
            console.log('🔐 Tentando login:', email);
            
            // Validação básica
            if (!email || !password) {
                return {
                    success: false,
                    error: 'Email e senha são obrigatórios'
                };
            }

            // Busca usuário por email
            const user = this.storage.userStorage.getUserByEmail(email);
            if (!user) {
                console.log('❌ Usuário não encontrado:', email);
                return {
                    success: false,
                    error: 'Email ou senha incorretos'
                };
            }

            // Verifica senha
            const isValidPassword = await this.crypto.passwordManager.verifyPassword(
                password, 
                user.passwordHash, 
                user.salt
            );

            if (!isValidPassword) {
                console.log('❌ Senha incorreta para:', email);
                return {
                    success: false,
                    error: 'Email ou senha incorretos'
                };
            }

            // Cria sessão
            this.currentUser = user;
            this.session = this.storage.sessionStorage.createSession(user.id, user.profile);
            
            console.log('✅ Login realizado com sucesso:', user.name);
            
            // Atualiza navegação
            this.updateNavigation();
            
            return {
                success: true,
                user: this.getPublicUserData(user),
                message: 'Login realizado com sucesso'
            };

        } catch (error) {
            console.error('❌ Erro no login:', error);
            return {
                success: false,
                error: 'Erro interno. Tente novamente.'
            };
        }
    }

    /**
     * Faz logout do usuário
     */
    logout() {
        try {
            console.log('🚪 Fazendo logout...');
            
            this.currentUser = null;
            this.session = null;
            this.storage.sessionStorage.clearSession();
            
            console.log('✅ Logout realizado');
            
            // Atualiza navegação
            this.updateNavigation();
            
            return {
                success: true,
                message: 'Logout realizado com sucesso'
            };
        } catch (error) {
            console.error('❌ Erro no logout:', error);
            return {
                success: false,
                error: 'Erro ao fazer logout'
            };
        }
    }

    /**
     * Verifica se usuário está logado
     */
    isLoggedIn() {
        return this.currentUser !== null && this.session !== null;
    }

    /**
     * Obtém usuário atual
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Verifica permissões do usuário
     */
    hasPermission(requiredProfile) {
        if (!this.currentUser) return false;
        
        // Admin tem acesso a tudo
        if (this.currentUser.profile === 'admin') return true;
        
        // Verifica perfil específico
        return this.currentUser.profile === requiredProfile;
    }

    /**
     * Atualiza última atividade
     */
    updateLastActivity() {
        if (this.session) {
            this.storage.sessionStorage.updateActivity();
        }
    }

    /**
     * Altera senha do usuário
     */
    async changePassword(currentPassword, newPassword) {
        try {
            if (!this.currentUser) {
                return {
                    success: false,
                    error: 'Usuário não autenticado'
                };
            }

            // Verifica senha atual
            const isValidCurrentPassword = await this.crypto.passwordManager.verifyPassword(
                currentPassword,
                this.currentUser.passwordHash,
                this.currentUser.salt
            );

            if (!isValidCurrentPassword) {
                return {
                    success: false,
                    error: 'Senha atual incorreta'
                };
            }

            // Valida nova senha
            const passwordValidation = this.validators.validatePassword(newPassword);
            if (!passwordValidation.isValid) {
                return {
                    success: false,
                    error: passwordValidation.message
                };
            }

            // Cria novo hash
            const { hash, salt } = await this.crypto.passwordManager.createPasswordHash(newPassword);
            
            // Atualiza usuário
            const success = this.storage.userStorage.updateUser(this.currentUser.id, {
                passwordHash: hash,
                salt: salt
            });

            if (!success) {
                return {
                    success: false,
                    error: 'Erro ao atualizar senha'
                };
            }

            // Atualiza usuário atual
            this.currentUser.passwordHash = hash;
            this.currentUser.salt = salt;

            return {
                success: true,
                message: 'Senha alterada com sucesso'
            };

        } catch (error) {
            console.error('❌ Erro ao alterar senha:', error);
            return {
                success: false,
                error: 'Erro interno. Tente novamente.'
            };
        }
    }

    /**
     * Atualiza navegação baseada no perfil
     */
    updateNavigation() {
        const navUser = document.getElementById('navUser');
        if (!navUser) return;

        if (this.isLoggedIn()) {
            const user = this.getCurrentUser();
            navUser.innerHTML = `
                <div class="user-menu">
                    <span class="user-name">${user.name}</span>
                    <div class="user-dropdown">
                        <button class="btn btn-secondary" onclick="window.Router.navigate('/produtos')">
                            Produtos
                        </button>
                        <button class="btn btn-secondary" onclick="window.Router.navigate('/perfil')">
                            Meu Perfil
                        </button>
                        <button class="btn btn-danger" onclick="window.Auth.logout()">
                            Sair
                        </button>
                    </div>
                </div>
            `;
        } else {
            navUser.innerHTML = `
                <div class="auth-buttons">
                    <button class="btn btn-secondary" onclick="window.Router.navigate('/produtos')">
                        Produtos
                    </button>
                    <button class="btn btn-primary" onclick="window.Router.navigate('/login')">
                        Entrar
                    </button>
                    <button class="btn btn-outline" onclick="window.Router.navigate('/register')">
                        Cadastrar
                    </button>
                </div>
            `;
        }
    }

    /**
     * Obtém dados públicos do usuário
     */
    getPublicUserData(user) {
        if (!user) return null;
        
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            profile: user.profile,
            phone: user.phone,
            cpf: user.cpf,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }

    /**
     * Verifica se email está disponível
     */
    isEmailAvailable(email) {
        return !this.storage.userStorage.emailExists(email);
    }

    /**
     * Obtém estatísticas de autenticação
     */
    getAuthStats() {
        return {
            isLoggedIn: this.isLoggedIn(),
            currentUser: this.currentUser ? this.getPublicUserData(this.currentUser) : null,
            sessionValid: this.session ? this.storage.sessionStorage.isSessionValid() : false,
            lastActivity: this.session?.lastActivityAt || null
        };
    }
}

// Instância global
const auth = new Auth();

// Inicializa quando o script é carregado
auth.init();

// Exporta para uso global
window.Auth = auth;
