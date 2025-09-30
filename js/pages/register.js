/**
 * Página de Registro
 * Sistema E2E Commerce
 */

class RegisterPage {
    constructor() {
        this.auth = window.Auth;
        this.ui = window.UI;
        this.router = window.Router;
        this.userManager = window.UserManager;
    }

    /**
     * Renderiza a página de registro
     */
    render() {
        const app = document.getElementById('app');
        if (!app) return;

        app.innerHTML = `
            <div class="register-page">
                <div class="register-container">
                    <div class="register-card">
                        <div class="register-header">
                            <div class="register-logo">
                                <img src="assets/logo.svg" alt="E2E Commerce" class="logo-img">
                                <h1>E2E Commerce</h1>
                            </div>
                            <p class="register-subtitle">Crie sua conta para começar</p>
                        </div>
                        
                        <form id="registerForm" class="register-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="name" class="form-label">Nome completo *</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        class="form-control" 
                                        placeholder="Seu nome completo"
                                        required
                                        autocomplete="name"
                                    >
                                    <div class="form-error" id="nameError"></div>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="email" class="form-label">Email *</label>
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
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="phone" class="form-label">Telefone</label>
                                    <input 
                                        type="tel" 
                                        id="phone" 
                                        name="phone" 
                                        class="form-control" 
                                        placeholder="(11) 99999-9999"
                                        autocomplete="tel"
                                    >
                                    <div class="form-error" id="phoneError"></div>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="cpf" class="form-label">CPF</label>
                                    <input 
                                        type="text" 
                                        id="cpf" 
                                        name="cpf" 
                                        class="form-control" 
                                        placeholder="000.000.000-00"
                                        maxlength="14"
                                    >
                                    <div class="form-error" id="cpfError"></div>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="profile" class="form-label">Tipo de conta *</label>
                                    <select id="profile" name="profile" class="form-control" required>
                                        <option value="">Selecione o tipo de conta</option>
                                        <option value="cliente">Cliente</option>
                                        <option value="vendedor">Vendedor</option>
                                    </select>
                                    <div class="form-error" id="profileError"></div>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="password" class="form-label">Senha *</label>
                                    <div class="password-input">
                                        <input 
                                            type="password" 
                                            id="password" 
                                            name="password" 
                                            class="form-control" 
                                            placeholder="Mínimo 8 caracteres"
                                            required
                                            autocomplete="new-password"
                                        >
                                        <button type="button" class="password-toggle" onclick="window.RegisterPage.togglePassword('password')">
                                            <svg class="icon" viewBox="0 0 24 24" id="passwordIcon">
                                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <div class="form-text">A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.</div>
                                    <div class="form-error" id="passwordError"></div>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="passwordConfirmation" class="form-label">Confirmar senha *</label>
                                    <div class="password-input">
                                        <input 
                                            type="password" 
                                            id="passwordConfirmation" 
                                            name="passwordConfirmation" 
                                            class="form-control" 
                                            placeholder="Digite a senha novamente"
                                            required
                                            autocomplete="new-password"
                                        >
                                        <button type="button" class="password-toggle" onclick="window.RegisterPage.togglePassword('passwordConfirmation')">
                                            <svg class="icon" viewBox="0 0 24 24" id="passwordConfirmationIcon">
                                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <div class="form-error" id="passwordConfirmationError"></div>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-check">
                                    <input type="checkbox" id="terms" name="terms" required>
                                    <span class="form-check-label">
                                        Aceito os <a href="#/terms" target="_blank">termos de uso</a> e 
                                        <a href="#/privacy" target="_blank">política de privacidade</a>
                                    </span>
                                </label>
                                <div class="form-error" id="termsError"></div>
                            </div>
                            
                            <button type="submit" class="btn btn-primary btn-block btn-lg" id="registerBtn">
                                <span class="btn-text">Criar conta</span>
                                <div class="spinner spinner-sm" style="display: none;"></div>
                            </button>
                        </form>
                        
                        <div class="register-footer">
                            <p>Já tem uma conta? <a href="#/login">Faça login aqui</a></p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.setupInputMasks();
        this.focusFirstInput();
    }

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        const form = document.getElementById('registerForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Limpa erros ao digitar
        const inputs = document.querySelectorAll('#registerForm input, #registerForm select');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.clearFieldError(input.name));
        });

        // Validação em tempo real
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmailAvailability());
        }

        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', () => this.validatePasswordStrength());
        }

        const passwordConfirmationInput = document.getElementById('passwordConfirmation');
        if (passwordConfirmationInput) {
            passwordConfirmationInput.addEventListener('input', () => this.validatePasswordConfirmation());
        }
    }

    /**
     * Configura máscaras de input
     */
    setupInputMasks() {
        // Máscara para telefone
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                    if (value.length < 14) {
                        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                    }
                }
                e.target.value = value;
            });
        }

        // Máscara para CPF
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                e.target.value = value;
            });
        }
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
            // Cria usuário
            const result = await this.userManager.createUser(data);
            
            if (result.success) {
                this.ui.showToast('Sucesso!', 'Conta criada com sucesso', 'success');
                
                // Redireciona para login
                setTimeout(() => {
                    this.router.navigate('/login');
                }, 1500);
            } else {
                if (result.errors) {
                    this.showFormErrors(result.errors);
                } else {
                    this.showError('register', result.error);
                }
                this.ui.showToast('Erro no cadastro', result.error || 'Verifique os dados informados', 'error');
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            this.showError('register', 'Erro interno. Tente novamente.');
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

        // Valida nome
        if (!data.name || data.name.trim().length < 2) {
            this.showError('name', 'Nome deve ter pelo menos 2 caracteres');
            isValid = false;
        }

        // Valida email
        if (!data.email || data.email.trim().length === 0) {
            this.showError('email', 'Email é obrigatório');
            isValid = false;
        } else if (!this.isValidEmail(data.email)) {
            this.showError('email', 'Email inválido');
            isValid = false;
        }

        // Valida telefone (opcional)
        if (data.phone && data.phone.trim().length > 0) {
            const phoneDigits = data.phone.replace(/\D/g, '');
            if (phoneDigits.length < 10 || phoneDigits.length > 11) {
                this.showError('phone', 'Telefone deve ter 10 ou 11 dígitos');
                isValid = false;
            }
        }

        // Valida CPF (opcional)
        if (data.cpf && data.cpf.trim().length > 0) {
            const cpfDigits = data.cpf.replace(/\D/g, '');
            if (cpfDigits.length !== 11) {
                this.showError('cpf', 'CPF deve ter 11 dígitos');
                isValid = false;
            }
        }

        // Valida perfil
        if (!data.profile) {
            this.showError('profile', 'Tipo de conta é obrigatório');
            isValid = false;
        }

        // Valida senha
        if (!data.password || data.password.length < 8) {
            this.showError('password', 'Senha deve ter pelo menos 8 caracteres');
            isValid = false;
        } else if (!this.isValidPassword(data.password)) {
            this.showError('password', 'Senha deve conter letras maiúsculas, minúsculas e números');
            isValid = false;
        }

        // Valida confirmação de senha
        if (data.password !== data.passwordConfirmation) {
            this.showError('passwordConfirmation', 'Senhas não coincidem');
            isValid = false;
        }

        // Valida termos
        if (!data.terms) {
            this.showError('terms', 'Você deve aceitar os termos de uso');
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
     * Valida senha
     */
    isValidPassword(password) {
        return /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
    }

    /**
     * Valida disponibilidade do email
     */
    async validateEmailAvailability() {
        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();
        
        if (email && this.isValidEmail(email)) {
            const isAvailable = this.auth.isEmailAvailable(email);
            if (!isAvailable) {
                this.showError('email', 'Este email já está em uso');
            } else {
                this.clearFieldError('email');
            }
        }
    }

    /**
     * Valida força da senha
     */
    validatePasswordStrength() {
        const passwordInput = document.getElementById('password');
        const password = passwordInput.value;
        
        if (password.length > 0) {
            const strength = this.calculatePasswordStrength(password);
            this.updatePasswordStrengthIndicator(strength);
        }
    }

    /**
     * Calcula força da senha
     */
    calculatePasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score += 20;
        if (password.length >= 12) score += 10;
        if (/[a-z]/.test(password)) score += 20;
        if (/[A-Z]/.test(password)) score += 20;
        if (/\d/.test(password)) score += 20;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;
        
        if (score < 40) return { level: 'weak', text: 'Fraca', color: '#c62828' };
        if (score < 70) return { level: 'medium', text: 'Média', color: '#f57f17' };
        return { level: 'strong', text: 'Forte', color: '#2e7d32' };
    }

    /**
     * Atualiza indicador de força da senha
     */
    updatePasswordStrengthIndicator(strength) {
        let indicator = document.getElementById('passwordStrength');
        if (!indicator) {
            const passwordGroup = document.getElementById('password').closest('.form-group');
            indicator = document.createElement('div');
            indicator.id = 'passwordStrength';
            indicator.className = 'password-strength';
            passwordGroup.appendChild(indicator);
        }
        
        indicator.innerHTML = `
            <div class="strength-bar">
                <div class="strength-fill" style="width: ${strength.level === 'weak' ? '33%' : strength.level === 'medium' ? '66%' : '100%'}; background-color: ${strength.color};"></div>
            </div>
            <span class="strength-text" style="color: ${strength.color};">${strength.text}</span>
        `;
    }

    /**
     * Valida confirmação de senha
     */
    validatePasswordConfirmation() {
        const password = document.getElementById('password').value;
        const confirmation = document.getElementById('passwordConfirmation').value;
        
        if (confirmation.length > 0 && password !== confirmation) {
            this.showError('passwordConfirmation', 'Senhas não coincidem');
        } else {
            this.clearFieldError('passwordConfirmation');
        }
    }

    /**
     * Mostra erros do formulário
     */
    showFormErrors(errors) {
        Object.keys(errors).forEach(field => {
            this.showError(field, errors[field]);
        });
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
        const button = document.getElementById('registerBtn');
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
    togglePassword(fieldId) {
        const passwordInput = document.getElementById(fieldId);
        const passwordIcon = document.getElementById(`${fieldId}Icon`);
        
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
            const nameInput = document.getElementById('name');
            if (nameInput) {
                nameInput.focus();
            }
        }, 100);
    }

    /**
     * Limpa formulário
     */
    clearForm() {
        const form = document.getElementById('registerForm');
        if (form) {
            form.reset();
        }
        this.clearAllErrors();
        
        // Remove indicador de força da senha
        const indicator = document.getElementById('passwordStrength');
        if (indicator) {
            indicator.remove();
        }
    }
}

// Instância global
const registerPage = new RegisterPage();

// Exporta para uso global
window.RegisterPage = registerPage;

