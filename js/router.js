/**
 * Sistema de roteamento hash-based
 * Sistema E2E Commerce
 */

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.beforeRouteHooks = [];
        this.afterRouteHooks = [];
        this.defaultRoute = '/produtos';
        this.notFoundRoute = '/404';
        
        this.init();
    }

    /**
     * Inicializa o roteador
     */
    init() {
        // Escuta mudanças no hash
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });

        // Rota inicial: adia decisão; App fará navegação inicial após registrar rotas
    }

    /**
     * Registra uma nova rota
     */
    addRoute(path, handler, options = {}) {
        const route = {
            path,
            handler,
            requiresAuth: options.requiresAuth || false,
            requiredProfile: options.requiredProfile || null,
            title: options.title || 'E2E Commerce',
            meta: options.meta || {}
        };

        this.routes.set(path, route);
    }

    /**
     * Remove uma rota
     */
    removeRoute(path) {
        this.routes.delete(path);
    }

    /**
     * Adiciona hook antes da rota
     */
    beforeRoute(callback) {
        this.beforeRouteHooks.push(callback);
    }

    /**
     * Adiciona hook após a rota
     */
    afterRoute(callback) {
        this.afterRouteHooks.push(callback);
    }

    /**
     * Navega para uma rota
     */
    navigate(path, replace = false) {
        if (replace) {
            window.location.replace(`#${path}`);
        } else {
            window.location.hash = path;
        }
    }

    /**
     * Volta para a rota anterior
     */
    goBack() {
        window.history.back();
    }

    /**
     * Vai para a próxima rota no histórico
     */
    goForward() {
        window.history.forward();
    }

    /**
     * Obtém a rota atual
     */
    getCurrentRoute() {
        return this.currentRoute;
    }

    /**
     * Obtém o hash atual
     */
    getCurrentHash() {
        return window.location.hash.slice(1) || '/';
    }

    /**
     * Verifica se uma rota existe
     */
    hasRoute(path) {
        return this.routes.has(path);
    }

    /**
     * Obtém parâmetros da URL
     */
    getParams() {
        const hash = this.getCurrentHash();
        const params = {};
        
        // Extrai query parameters
        const queryIndex = hash.indexOf('?');
        if (queryIndex !== -1) {
            const queryString = hash.substring(queryIndex + 1);
            const urlParams = new URLSearchParams(queryString);
            
            for (const [key, value] of urlParams) {
                params[key] = value;
            }
        }
        
        return params;
    }

    /**
     * Obtém parâmetros de rota (ex: /user/:id)
     */
    getRouteParams(routePath, currentPath) {
        const params = {};
        const routeParts = routePath.split('/');
        const currentParts = currentPath.split('/');
        
        if (routeParts.length !== currentParts.length) {
            return params;
        }
        
        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
                const paramName = routeParts[i].slice(1);
                params[paramName] = currentParts[i];
            }
        }
        
        return params;
    }

    /**
     * Manipula mudança de rota
     */
    async handleRouteChange() {
        const hash = this.getCurrentHash();
        const path = hash.split('?')[0]; // Remove query parameters
        
        try {
            // Executa hooks antes da rota
            for (const hook of this.beforeRouteHooks) {
                const result = await hook(path);
                if (result === false) {
                    return; // Cancela navegação
                }
            }

            // Busca rota correspondente
            const route = this.findMatchingRoute(path);
            
            if (route) {
                await this.executeRoute(route, path);
            } else {
                await this.handleNotFound(path);
            }

            // Executa hooks após a rota
            for (const hook of this.afterRouteHooks) {
                await hook(path, route);
            }

        } catch (error) {
            console.error('Erro na navegação:', error);
            await this.handleError(error, path);
        }
    }

    /**
     * Encontra rota correspondente
     */
    findMatchingRoute(path) {
        // Busca rota exata primeiro
        if (this.routes.has(path)) {
            return this.routes.get(path);
        }

        // Busca rotas com parâmetros
        for (const [routePath, route] of this.routes) {
            if (this.matchesRoute(routePath, path)) {
                return route;
            }
        }

        return null;
    }

    /**
     * Verifica se uma rota corresponde ao path
     */
    matchesRoute(routePath, path) {
        const routeParts = routePath.split('/');
        const pathParts = path.split('/');
        
        if (routeParts.length !== pathParts.length) {
            return false;
        }
        
        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
                continue; // Parâmetro dinâmico
            }
            
            if (routeParts[i] !== pathParts[i]) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Executa uma rota
     */
    async executeRoute(route, path) {
        // Verifica autenticação
        if (route.requiresAuth && !window.Auth?.isLoggedIn()) {
            this.navigate('/login');
            return;
        }

        // Verifica permissões
        if (route.requiredProfile && !window.Auth?.hasPermission(route.requiredProfile)) {
            console.log('❌ Sem permissão para acessar rota:', {
                route: route.path,
                requiredProfile: route.requiredProfile,
                userProfile: window.Auth?.getCurrentUser()?.profile
            });
            this.navigate('/unauthorized');
            return;
        }

        // Atualiza título da página
        document.title = route.title;

        // Atualiza rota atual
        this.currentRoute = route;

        // Executa handler da rota
        if (typeof route.handler === 'function') {
            const params = this.getRouteParams(route.path, path);
            const queryParams = this.getParams();
            
            await route.handler({
                path,
                params,
                query: queryParams,
                route: route
            });
        }
    }

    /**
     * Manipula rota não encontrada
     */
    async handleNotFound(path) {
        console.warn(`Rota não encontrada: ${path}`);
        
        // Tenta executar rota 404
        const notFoundRoute = this.routes.get(this.notFoundRoute);
        if (notFoundRoute) {
            await this.executeRoute(notFoundRoute, path);
        } else {
            // Fallback para página de erro
        this.showNotFoundPage(path);
        }
    }

    /**
     * Manipula erro na navegação
     */
    async handleError(error, path) {
        console.error(`Erro na rota ${path}:`, error);
        
        // Tenta executar rota de erro
        const errorRoute = this.routes.get('/error');
        if (errorRoute) {
            await this.executeRoute(errorRoute, path);
        } else {
            // Fallback para página de erro
            this.showErrorPage(error, path);
        }
    }

    /**
     * Mostra página 404
     */
    showNotFoundPage(path) {
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div class="error-page">
                    <div class="error-content">
                        <h1>404</h1>
                        <h2>Página não encontrada</h2>
                        <p>A página <code>${path}</code> não foi encontrada.</p>
                        <div class="error-actions">
                            <button class="btn btn-primary" onclick="window.Router.navigate('/produtos')">
                                Voltar ao início
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Mostra página de erro
     */
    showErrorPage(error, path) {
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div class="error-page">
                    <div class="error-content">
                        <h1>Erro</h1>
                        <h2>Algo deu errado</h2>
                        <p>Ocorreu um erro ao carregar a página <code>${path}</code>.</p>
                        <div class="error-details">
                            <details>
                                <summary>Detalhes do erro</summary>
                                <pre>${error.message}</pre>
                            </details>
                        </div>
                        <div class="error-actions">
                            <button class="btn btn-primary" onclick="window.Router.navigate('/')">
                                Voltar ao início
                            </button>
                            <button class="btn btn-secondary" onclick="window.location.reload()">
                                Recarregar página
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Registra rotas padrão do sistema
     */
    registerDefaultRoutes() {
        // Rota de login
        this.addRoute('/login', async () => {
            if (window.Auth?.isLoggedIn()) {
                this.navigate('/dashboard');
                return;
            }
            if (window.LoginPage) {
                window.LoginPage.render();
            }
        }, {
            title: 'Login - E2E Commerce'
        });

        // Rota de registro
        this.addRoute('/register', async () => {
            if (window.Auth?.isLoggedIn()) {
                this.navigate('/dashboard');
                return;
            }
            if (window.RegisterPage) {
                window.RegisterPage.render();
            }
        }, {
            title: 'Cadastro - E2E Commerce'
        });

        // Rota de dashboard (redireciona baseado no perfil)
        this.addRoute('/dashboard', async () => {
            if (!window.Auth?.isLoggedIn()) {
                this.navigate('/login');
                return;
            }
            
            const user = window.Auth.getCurrentUser();
            if (!user) {
                this.navigate('/login');
                return;
            }
            
            // Redireciona baseado no perfil
            if (user.profile === 'admin') {
                this.navigate('/admin');
            } else if (user.profile === 'vendedor') {
                this.navigate('/vendedor');
            } else if (user.profile === 'cliente') {
                this.navigate('/cliente');
            } else {
                this.navigate('/login');
            }
        }, {
            requiresAuth: true,
            title: 'Dashboard - E2E Commerce'
        });

        // Rota de dashboard do cliente
        this.addRoute('/cliente', async () => {
            console.log('🔄 Carregando dashboard do cliente...');
            if (window.DashboardCliente) {
                console.log('✅ DashboardCliente encontrado, renderizando...');
                window.DashboardCliente.render();
            } else {
                console.error('❌ DashboardCliente não encontrado!');
            }
        }, {
            requiresAuth: true,
            requiredProfile: 'cliente',
            title: 'Dashboard Cliente - E2E Commerce'
        });

        // Rota de dashboard do vendedor
        this.addRoute('/vendedor', async () => {
            if (window.DashboardVendedor) {
                window.DashboardVendedor.render();
            }
        }, {
            requiresAuth: true,
            requiredProfile: 'vendedor',
            title: 'Dashboard Vendedor - E2E Commerce'
        });

        // Rota de admin
        this.addRoute('/admin', async () => {
            if (window.AdminPage) {
                window.AdminPage.render();
            }
        }, {
            requiresAuth: true,
            requiredProfile: 'admin',
            title: 'Administração - E2E Commerce'
        });

        // Rota de perfil
        this.addRoute('/perfil', async () => {
            if (window.PerfilPage) {
                window.PerfilPage.render();
            }
        }, {
            requiresAuth: true,
            title: 'Meu Perfil - E2E Commerce'
        });

        // Rota de lista de produtos (público)
        this.addRoute('/produtos', async () => {
            if (window.ProductsListPage) {
                window.ProductsListPage.render();
            }
        }, {
            requiresAuth: false,
            title: 'Produtos - E2E Commerce'
        });

        // Rota de detalhes do produto (público)
        this.addRoute('/produto/:id', async (context) => {
            if (window.ProductDetailPage) {
                window.ProductDetailPage.render(context.params);
            }
        }, {
            requiresAuth: false,
            title: 'Detalhes do Produto - E2E Commerce'
        });

        // Rota 404
        this.addRoute('/404', async () => {
            this.showNotFoundPage(this.getCurrentHash());
        }, {
            title: 'Página não encontrada - E2E Commerce'
        });

        // Rota de erro
        this.addRoute('/error', async () => {
            this.showErrorPage(new Error('Erro desconhecido'), this.getCurrentHash());
        }, {
            title: 'Erro - E2E Commerce'
        });

        // Rota de não autorizado
        this.addRoute('/unauthorized', async () => {
            const app = document.getElementById('app');
            if (app) {
                app.innerHTML = `
                    <div class="error-page">
                        <div class="error-content">
                            <h1>403</h1>
                            <h2>Acesso negado</h2>
                            <p>Você não tem permissão para acessar esta página.</p>
                            <div class="error-actions">
                                <button class="btn btn-primary" onclick="window.Router.navigate('/dashboard')">
                                    Voltar ao dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }
        }, {
            title: 'Acesso negado - E2E Commerce'
        });

        // Rota raiz - redireciona para produtos (público)
        this.addRoute('/', async () => {
            this.navigate('/produtos');
        }, {
            requiresAuth: false,
            title: 'Produtos - E2E Commerce'
        });
    }

    /**
     * Configura hooks padrão
     */
    setupDefaultHooks() {
        // Hook para atualizar navegação
        this.afterRoute((path, route) => {
            if (window.Auth) {
                window.Auth.updateNavigation();
            }
        });

        // Hook para scroll para o topo
        this.afterRoute(() => {
            window.scrollTo(0, 0);
        });
    }
}

// Instância global
const router = new Router();

// Exporta para uso global
window.Router = router;
