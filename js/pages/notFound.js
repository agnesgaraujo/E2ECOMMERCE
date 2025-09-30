/**
 * Página 404 - Não Encontrada
 * Sistema E2E Commerce
 */

class NotFoundPage {
    constructor() {
        this.ui = window.UI;
        this.router = window.Router;
        this.auth = window.Auth;
    }

    /**
     * Renderiza a página 404
     */
    render() {
        const app = document.getElementById('app');
        if (!app) return;

        const user = this.auth.getCurrentUser();
        const isLoggedIn = this.auth.isLoggedIn();

        app.innerHTML = `
            <div class="not-found-page">
                <div class="not-found-container">
                    <div class="not-found-content">
                        <div class="error-illustration">
                            <svg class="error-icon" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                        </div>
                        
                        <div class="error-info">
                            <h1 class="error-code">404</h1>
                            <h2 class="error-title">Página não encontrada</h2>
                            <p class="error-description">
                                A página que você está procurando não existe ou foi movida.
                            </p>
                            
                            <div class="error-actions">
                                ${isLoggedIn ? `
                                    <button class="btn btn-primary" onclick="window.NotFoundPage.goToDashboard()">
                                        <svg class="icon icon-sm" viewBox="0 0 24 24">
                                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                        </svg>
                                        Ir para Dashboard
                                    </button>
                                ` : `
                                    <button class="btn btn-primary" onclick="window.NotFoundPage.goToLogin()">
                                        <svg class="icon icon-sm" viewBox="0 0 24 24">
                                            <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v12z"/>
                                        </svg>
                                        Fazer Login
                                    </button>
                                `}
                                
                                <button class="btn btn-outline" onclick="window.NotFoundPage.goHome()">
                                    <svg class="icon icon-sm" viewBox="0 0 24 24">
                                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                    </svg>
                                    Página Inicial
                                </button>
                                
                                <button class="btn btn-secondary" onclick="window.NotFoundPage.goBack()">
                                    <svg class="icon icon-sm" viewBox="0 0 24 24">
                                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                                    </svg>
                                    Voltar
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="help-section">
                        <h3>Precisa de ajuda?</h3>
                        <div class="help-options">
                            <div class="help-item">
                                <svg class="icon" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z"/>
                                </svg>
                                <div class="help-content">
                                    <h4>Verifique a URL</h4>
                                    <p>Certifique-se de que o endereço está correto</p>
                                </div>
                            </div>
                            
                            <div class="help-item">
                                <svg class="icon" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                <div class="help-content">
                                    <h4>Navegue pelo menu</h4>
                                    <p>Use o menu de navegação para encontrar o que procura</p>
                                </div>
                            </div>
                            
                            <div class="help-item">
                                <svg class="icon" viewBox="0 0 24 24">
                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                </svg>
                                <div class="help-content">
                                    <h4>Use a busca</h4>
                                    <p>Procure por produtos ou informações na barra de busca</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Vai para o dashboard
     */
    goToDashboard() {
        const user = this.auth.getCurrentUser();
        if (user) {
            if (user.profile === 'admin') {
                this.router.navigate('/admin');
            } else if (user.profile === 'vendedor') {
                this.router.navigate('/vendedor');
            } else {
                this.router.navigate('/cliente');
            }
        } else {
            this.router.navigate('/login');
        }
    }

    /**
     * Vai para a página de login
     */
    goToLogin() {
        this.router.navigate('/login');
    }

    /**
     * Vai para a página inicial
     */
    goHome() {
        this.router.navigate('/');
    }

    /**
     * Volta para a página anterior
     */
    goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            this.goHome();
        }
    }
}

// Instância global
const notFoundPage = new NotFoundPage();

// Exporta para uso global
window.NotFoundPage = notFoundPage;

