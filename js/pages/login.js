/**
 * Página de Login
 * Sistema E2E Commerce
 */

class LoginPage {
    constructor() {
        this.auth = window.Auth;
        this.ui = window.UI;
        this.router = window.Router;
    }

    /**
     * Renderiza a página de login
     */
    render() {
        const app = document.getElementById('app');
        if (!app) return;

        app.innerHTML = `
            <div class="login-page">
                <div class="login-container">
                    <div class="login-card">
                        <div class="login-header">
                            <div class="login-logo">
                                <img src="assets/logo.svg" alt="E2E Commerce" class="logo-img">
                                <h1>E2E Commerce</h1>
                            </div>
                            <p class="login-subtitle">Faça login para acessar sua conta</p>
                        </div>
                        
                        <form id="loginForm" class="login-form">
                            <div class="form-group">
                                <label for="email" class="form-label">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    class="form-control" 
                                    placeholder="seu@email.com"
                                    required
                                    autocomplete="email"
                                >
                                <div class="form-error" id="emailError"></div>
                            </div>
                            
                            <div class="form-group">
                                <label for="password" class="form-label">Senha</label>
                                <div class="password-input">
                                    <input 
                                        type="password" 
                                        id="password" 
                                        name="password" 
                                        class="form-control" 
                                        placeholder="Sua senha"
                                        required
                                        autocomplete="current-password"
                                    >
                                    <button type="button" class="password-toggle" onclick="window.LoginPage.togglePassword()">
                                        <svg class="icon" viewBox="0 0 24 24" id="passwordIcon">
                                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                        </svg>
                                    </button>
                                </div>
                                <div class="form-error" id="passwordError"></div>
                            </div>
                            
                            <div class="form-options">
                                <label class="form-check">
                                    <input type="checkbox" id="rememberMe" name="rememberMe">
                                    <span class="form-check-label">Lembrar de mim</span>
                                </label>
                                <a href="#/forgot-password" class="forgot-password">Esqueceu a senha?</a>
                            </div>
                            
                            <button type="submit" class="btn btn-primary btn-block btn-lg" id="loginBtn">
                                <span class="btn-text">Entrar</span>
                                <div class="spinner spinner-sm" style="display: none;"></div>
                            </button>
                        </form>
                        
                        <div class="login-footer">
                            <p>Não tem uma conta? <a href="#/register">Cadastre-se aqui</a></p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.focusFirstInput();
    }

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Limpa erros ao digitar
        const inputs = document.querySelectorAll('#loginForm input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.clearFieldError(input.name));
        });

        // Enter para submeter
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && document.activeElement.tagName !== 'BUTTON') {
                const form = document.getElementById('loginForm');
                if (form) {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        });
    }

    /**
     * Manipula envio do formulário
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validação básica
        if (!this.validateForm(data)) {
            return;
        }

        // Mostra loading
        this.setLoading(true);
        this.clearAllErrors();

        try {
            // Tenta fazer login
            const result = await this.auth.login(data.email, data.password);
            
            if (result.success) {
                this.ui.showToast('Sucesso!', 'Login realizado com sucesso', 'success');
                
                console.log('🔄 Redirecionando usuário:', {
                    profile: result.user.profile,
                    name: result.user.name
                });
                
                // Redireciona baseado no perfil
                setTimeout(() => {
                    if (result.user.profile === 'admin') {
                        console.log('➡️ Redirecionando para /admin');
                        this.router.navigate('/admin');
                    } else if (result.user.profile === 'vendedor') {
                        console.log('➡️ Redirecionando para /vendedor');
                        this.router.navigate('/vendedor');
                    } else if (result.user.profile === 'cliente') {
                        console.log('➡️ Redirecionando para /cliente');
                        this.router.navigate('/cliente');
                    } else {
                        console.log('❌ Perfil desconhecido:', result.user.profile);
                        this.router.navigate('/dashboard');
                    }
                }, 1000);
            } else {
                this.showError('login', result.error);
                this.ui.showToast('Erro no login', result.error, 'error');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            this.showError('login', 'Erro interno. Tente novamente.');
            this.ui.showToast('Erro', 'Erro interno. Tente novamente.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Valida formulário
     */
    validateForm(data) {
        let isValid = true;

        // Valida email
        if (!data.email || data.email.trim().length === 0) {
            this.showError('email', 'Email é obrigatório');
            isValid = false;
        } else if (!this.isValidEmail(data.email)) {
            this.showError('email', 'Email inválido');
            isValid = false;
        }

        // Valida senha
        if (!data.password || data.password.length === 0) {
            this.showError('password', 'Senha é obrigatória');
            isValid = false;
        }

        return isValid;
    }

    /**
     * Valida email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Mostra erro em campo específico
     */
    showError(field, message) {
        const errorElement = document.getElementById(`${field}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }

        // Adiciona classe de erro ao input
        const input = document.getElementById(field);
        if (input) {
            input.classList.add('is-invalid');
        }
    }

    /**
     * Limpa erro de campo específico
     */
    clearFieldError(field) {
        const errorElement = document.getElementById(`${field}Error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }

        // Remove classe de erro do input
        const input = document.getElementById(field);
        if (input) {
            input.classList.remove('is-invalid');
        }
    }

    /**
     * Limpa todos os erros
     */
    clearAllErrors() {
        const errorElements = document.querySelectorAll('.form-error');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });

        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.classList.remove('is-invalid');
        });
    }

    /**
     * Define estado de loading
     */
    setLoading(loading) {
        const button = document.getElementById('loginBtn');
        const buttonText = button.querySelector('.btn-text');
        const spinner = button.querySelector('.spinner');
        
        if (loading) {
            button.disabled = true;
            buttonText.style.display = 'none';
            spinner.style.display = 'inline-block';
        } else {
            button.disabled = false;
            buttonText.style.display = 'inline';
            spinner.style.display = 'none';
        }
    }

    /**
     * Alterna visibilidade da senha
     */
    togglePassword() {
        const passwordInput = document.getElementById('password');
        const passwordIcon = document.getElementById('passwordIcon');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordIcon.innerHTML = `
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
            `;
        } else {
            passwordInput.type = 'password';
            passwordIcon.innerHTML = `
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            `;
        }
    }

    /**
     * Foca no primeiro input
     */
    focusFirstInput() {
        setTimeout(() => {
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.focus();
            }
        }, 100);
    }

    /**
     * Limpa formulário
     */
    clearForm() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.reset();
        }
        this.clearAllErrors();
    }
}

// Instância global
const loginPage = new LoginPage();

// Exporta para uso global
window.LoginPage = loginPage;
