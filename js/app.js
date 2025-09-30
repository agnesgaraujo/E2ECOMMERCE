/**
 * Aplicação Principal
 * Sistema E2E Commerce
 */

class E2ECommerceApp {
    constructor() {
        this.isInitialized = false;
        this.version = '1.0.0';
        this.environment = 'development';
    }

    /**
     * Inicializa a aplicação
     */
    async init() {
        try {
            console.log('🚀 Inicializando E2E Commerce v' + this.version);
            
            // Aguarda o DOM estar pronto
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Inicializa componentes principais
            await this.initializeComponents();
            
            // Configura roteamento
            this.setupRouting();
            
            // Configura handlers globais
            this.setupGlobalHandlers();
            
            // Inicializa dados se necessário
            await this.initializeData();
            
            // Marca como inicializado
            this.isInitialized = true;
            
            console.log('✅ E2E Commerce inicializado com sucesso');
            
            // Mostra notificação de boas-vindas
            this.showWelcomeMessage();

            // Garante primeira tela: produtos (público)
            const current = window.location.hash.slice(1) || '/';
            if (current === '/' || current === '') {
                window.Router.navigate('/produtos', true);
            }
            
        } catch (error) {
            console.error('❌ Erro ao inicializar aplicação:', error);
            this.showError('Erro ao inicializar aplicação', error.message);
        }
    }

    /**
     * Inicializa componentes principais
     */
    async initializeComponents() {
        // Verifica se todos os componentes necessários estão disponíveis
        const requiredComponents = [
            'Storage', 'Crypto', 'Validators', 'Auth', 'UserManager', 
            'UI', 'Router', 'LoginPage', 'RegisterPage', 'DashboardCliente',
            'DashboardVendedor', 'AdminPage', 'PerfilPage', 'NotFoundPage',
            'CONFIG', 'Database', 'ProductsRepo', 'ProductsListPage', 'ProductDetailPage'
        ];

        const missingComponents = requiredComponents.filter(component => !window[component]);
        
        if (missingComponents.length > 0) {
            throw new Error(`Componentes não encontrados: ${missingComponents.join(', ')}`);
        }

        console.log('📦 Componentes carregados com sucesso');
    }

    /**
     * Configura roteamento
     */
    setupRouting() {
        // Registra rotas padrão
        window.Router.registerDefaultRoutes();
        
        // Configura hooks padrão
        window.Router.setupDefaultHooks();
        
        console.log('🛣️ Roteamento configurado');
    }

    /**
     * Configura handlers globais
     */
    setupGlobalHandlers() {
        // Handler para erros não capturados
        window.addEventListener('error', (event) => {
            console.error('Erro global:', event.error);
            this.handleGlobalError(event.error);
        });

        // Handler para promises rejeitadas
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Promise rejeitada:', event.reason);
            this.handleGlobalError(event.reason);
        });

        // Handler para mudanças de visibilidade da página
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handlePageHidden();
            } else {
                this.handlePageVisible();
            }
        });

        // Handler para antes de descarregar a página
        window.addEventListener('beforeunload', (event) => {
            this.handleBeforeUnload(event);
        });

        console.log('🔧 Handlers globais configurados');
    }

    /**
     * Inicializa dados se necessário
     */
    async initializeData() {
        try {
            // Verifica se há usuários no sistema
            const users = window.Storage.userStorage.getUsers();
            
            if (users.length === 0) {
                console.log('📊 Sistema vazio, inicializando dados de exemplo...');
                
                // Pergunta se deve inicializar dados de exemplo
                const shouldInitialize = confirm(
                    'Nenhum usuário encontrado no sistema.\n\n' +
                    'Deseja inicializar com dados de exemplo para testes?\n\n' +
                    'Isso criará:\n' +
                    '• 1 Administrador (admin@e2ecommerce.com)\n' +
                    '• 1 Cliente (joao@email.com)\n' +
                    '• 1 Vendedor (maria@email.com)'
                );
                
                if (shouldInitialize) {
                    const result = await window.UserManager.initializeSampleData();
                    if (result.success) {
                        console.log('✅ Dados de exemplo criados com sucesso');
                        console.log('Resultados:', result.results);
                        window.UI.showToast(
                            'Dados Inicializados', 
                            'Sistema inicializado com dados de exemplo', 
                            'success'
                        );
                    } else {
                        console.error('❌ Erro ao criar dados de exemplo:', result.error);
                    }
                }
            } else {
                console.log(`📊 Sistema possui ${users.length} usuário(s)`);
                console.log('Usuários:', users.map(u => ({ name: u.name, email: u.email, profile: u.profile })));
            }
        } catch (error) {
            console.error('Erro ao inicializar dados:', error);
        }
    }

    /**
     * Mostra mensagem de boas-vindas
     */
    showWelcomeMessage() {
        const user = window.Auth.getCurrentUser();
        
        if (user) {
            window.UI.showToast(
                `Bem-vindo, ${user.name}!`,
                'Sistema E2E Commerce carregado com sucesso',
                'success',
                3000
            );
        } else {
            window.UI.showToast(
                'Bem-vindo ao E2E Commerce!',
                'Sistema de gestão de usuários carregado',
                'info',
                3000
            );
        }
    }

    /**
     * Manipula erros globais
     */
    handleGlobalError(error) {
        // Log do erro
        console.error('Erro global capturado:', error);
        
        // Mostra notificação para o usuário
        window.UI.showToast(
            'Erro no Sistema',
            'Ocorreu um erro inesperado. Tente recarregar a página.',
            'error',
            5000
        );
        
        // Em produção, poderia enviar o erro para um serviço de monitoramento
        if (this.environment === 'production') {
            // this.sendErrorToMonitoring(error);
        }
    }

    /**
     * Manipula quando a página fica oculta
     */
    handlePageHidden() {
        // Pausa timers ou operações desnecessárias
        console.log('📱 Página oculta');
    }

    /**
     * Manipula quando a página fica visível
     */
    handlePageVisible() {
        // Verifica se a sessão ainda é válida
        if (window.Auth.isLoggedIn()) {
            const isValid = window.Storage.sessionStorage.isSessionValid();
            if (!isValid) {
                window.Auth.logout();
                window.UI.showToast(
                    'Sessão Expirada',
                    'Sua sessão expirou. Faça login novamente.',
                    'warning'
                );
            } else {
                // Atualiza última atividade
                window.Auth.updateLastActivity();
            }
        }
        
        console.log('👁️ Página visível');
    }

    /**
     * Manipula antes de descarregar a página
     */
    handleBeforeUnload(event) {
        // Salva dados importantes antes de sair
        if (window.Auth.isLoggedIn()) {
            window.Auth.updateLastActivity();
        }
        
        // Em desenvolvimento, não mostra confirmação
        if (this.environment === 'development') {
            return;
        }
        
        // Em produção, poderia mostrar confirmação se houver dados não salvos
        // event.preventDefault();
        // event.returnValue = '';
    }

    /**
     * Mostra erro na interface
     */
    showError(title, message) {
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div class="error-page">
                    <div class="error-content">
                        <h1>${title}</h1>
                        <p>${message}</p>
                        <div class="error-actions">
                            <button class="btn btn-primary" onclick="window.location.reload()">
                                Recarregar Página
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Obtém informações do sistema
     */
    getSystemInfo() {
        return {
            version: this.version,
            environment: this.environment,
            isInitialized: this.isInitialized,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            storage: {
                users: window.Storage.userStorage.getUsers().length,
                session: window.Storage.sessionStorage.getSession() ? 'active' : 'inactive'
            }
        };
    }

    /**
     * Limpa todos os dados do sistema
     */
    clearAllData() {
        try {
            window.Storage.storage.clear();
            window.Storage.sessionStorage.clearSession();
            window.Storage.cache.clear();
            
            console.log('🗑️ Todos os dados foram limpos');
            window.UI.showToast('Sistema Limpo', 'Todos os dados foram removidos', 'success');
            
            // Redireciona para login
            setTimeout(() => {
                window.Router.navigate('/login');
            }, 2000);
            
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
            window.UI.showToast('Erro', 'Erro ao limpar dados', 'error');
        }
    }

    /**
     * Exporta dados do sistema
     */
    exportSystemData() {
        try {
            const systemInfo = this.getSystemInfo();
            const users = window.Storage.userStorage.getUsers();
            
            const exportData = {
                system: systemInfo,
                users: users,
                exportedAt: new Date().toISOString()
            };
            
            const data = JSON.stringify(exportData, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `e2e_commerce_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            window.UI.showToast('Backup Exportado', 'Dados do sistema exportados com sucesso', 'success');
            
        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            window.UI.showToast('Erro', 'Erro ao exportar dados', 'error');
        }
    }

    /**
     * Reinicia a aplicação
     */
    restart() {
        console.log('🔄 Reiniciando aplicação...');
        
        // Limpa estado
        this.isInitialized = false;
        
        // Recarrega a página
        window.location.reload();
    }
}

// Instância global da aplicação
const app = new E2ECommerceApp();

// Inicializa a aplicação quando o script é carregado
app.init().catch(error => {
    console.error('Falha crítica na inicialização:', error);
    document.body.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui;">
            <div style="text-align: center; padding: 2rem;">
                <h1 style="color: #c62828;">Erro Crítico</h1>
                <p>Falha ao inicializar o sistema E2E Commerce.</p>
                <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #3483FA; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Recarregar Página
                </button>
            </div>
        </div>
    `;
});

// Exporta para uso global
window.App = app;
