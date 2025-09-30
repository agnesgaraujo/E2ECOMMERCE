/**
 * Página de Lista de Produtos
 * Sistema E2E Commerce - Gestão de Produtos
 */

class ProductsListPage {
    constructor() {
        this.currentPage = 1;
        this.currentFilters = {
            search: '',
            category: '',
            sortBy: 'name-asc'
        };
        this.isLoading = false;
        this.products = [];
        this.pagination = null;
    }

    /**
     * Renderiza a página
     */
    async render() {
        try {
            console.log('🔄 Renderizando lista de produtos...');
            
            const app = document.getElementById('app');
            if (!app) {
                throw new Error('Elemento #app não encontrado');
            }

            // Mostra loading
            this.showLoading();

            // Carrega dados
            await this.loadData();

            // Renderiza interface
            this.renderInterface();

            // Configura eventos
            this.setupEventListeners();

            console.log('✅ Lista de produtos renderizada');
        } catch (error) {
            console.error('❌ Erro ao renderizar lista de produtos:', error);
            this.showError('Erro ao carregar produtos', error.message);
        }
    }

    /**
     * Mostra loading
     */
    showLoading() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="products-page">
                <div class="page-header">
                    <h1>Gestão de Produtos</h1>
                    <p>Gerencie o estoque dos produtos do sistema</p>
                </div>
                
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <p>Carregando produtos...</p>
                </div>
            </div>
        `;
    }

    /**
     * Carrega dados dos produtos
     */
    async loadData() {
        try {
            this.isLoading = true;
            
            const result = await window.ProductsRepo.getProductsWithFilters({
                ...this.currentFilters,
                page: this.currentPage
            });

            this.products = result.products;
            this.pagination = result.pagination;
            
            console.log(`📦 ${this.products.length} produtos carregados`);
        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Renderiza a interface
     */
    renderInterface() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="products-page">
                ${this.renderHeader()}
                ${this.renderFilters()}
                ${this.renderProducts()}
                ${this.renderPagination()}
            </div>
        `;
    }

    /**
     * Renderiza cabeçalho da página
     */
    renderHeader() {
        return `
            <div class="page-header">
                <div class="header-content">
                    <div class="header-title">
                        <h1>Gestão de Produtos</h1>
                        <p>Gerencie o estoque dos produtos do sistema</p>
                    </div>
                    <div class="header-stats">
                        <div class="stat-item">
                            <span class="stat-number">${this.pagination?.totalItems || 0}</span>
                            <span class="stat-label">Produtos</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza filtros
     */
    renderFilters() {
        const categories = window.ProductsRepo.getAvailableCategories();
        const sortOptions = window.ProductsRepo.getSortOptions();

        return `
            <div class="filters-section">
                <div class="filters-container">
                    <!-- Busca -->
                    <div class="filter-group">
                        <label for="searchInput">Buscar produtos</label>
                        <div class="search-input-container">
                            <input 
                                type="text" 
                                id="searchInput" 
                                placeholder="Digite o nome do produto..."
                                value="${this.currentFilters.search}"
                                class="search-input"
                            >
                            <button class="search-btn" id="searchBtn">
                                <svg class="icon" viewBox="0 0 24 24">
                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Categoria -->
                    <div class="filter-group">
                        <label for="categorySelect">Categoria</label>
                        <select id="categorySelect" class="filter-select">
                            <option value="">Todas as categorias</option>
                            ${categories.map(cat => `
                                <option value="${cat.key}" ${this.currentFilters.category === cat.key ? 'selected' : ''}>
                                    ${cat.icon} ${cat.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <!-- Ordenação -->
                    <div class="filter-group">
                        <label for="sortSelect">Ordenar por</label>
                        <select id="sortSelect" class="filter-select">
                            ${Object.entries(sortOptions).map(([key, config]) => `
                                <option value="${key}" ${this.currentFilters.sortBy === key ? 'selected' : ''}>
                                    ${config.label}
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <!-- Botão limpar -->
                    <div class="filter-group">
                        <button class="btn btn-secondary" id="clearFiltersBtn">
                            Limpar Filtros
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza lista de produtos
     */
    renderProducts() {
        if (this.isLoading) {
            return `
                <div class="products-section">
                    <div class="loading-container">
                        <div class="loading-spinner"></div>
                        <p>Carregando produtos...</p>
                    </div>
                </div>
            `;
        }

        if (this.products.length === 0) {
            return `
                <div class="products-section">
                    <div class="empty-state">
                        <div class="empty-icon">📦</div>
                        <h3>Nenhum produto encontrado</h3>
                        <p>Tente ajustar os filtros de busca</p>
                        <button class="btn btn-primary" id="clearFiltersBtn2">
                            Limpar Filtros
                        </button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="products-section">
                <div class="products-grid">
                    ${this.products.map(product => this.renderProductCard(product)).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Renderiza card do produto
     */
    renderProductCard(product) {
        const imageUrl = window.ProductsRepo.getProductImage(product);
        const price = window.ProductsRepo.formatPrice(product.price);
        const category = window.CONFIG?.categories?.[product.category];
        const stockStatus = this.getStockStatus(product.stock);
        
        // Pré-carrega a imagem para melhor UX
        this.preloadImage(imageUrl, product.id);

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${imageUrl}" alt="${product.name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='assets/placeholders/${product.category || 'default'}.png'; if(this.src.includes('placeholders')) this.style.background='#f8f9fa';">
                    <div class="product-category">
                        <span class="category-badge" style="background-color: ${category?.color || '#666'}">
                            ${category?.icon || '📦'} ${category?.name || product.category}
                        </span>
                    </div>
                </div>
                
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${price}</div>
                    
                    <div class="product-stock">
                        <span class="stock-label">Estoque:</span>
                        <span class="stock-value ${stockStatus.class}">${product.stock} unidades</span>
                    </div>
                </div>
                
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="window.ProductsListPage.viewProduct('${product.id}')">
                        Ver Detalhes
                    </button>
                    ${this.renderProductActions(product)}
                </div>
            </div>
        `;
    }

    /**
     * Renderiza ações do produto baseadas no status de login
     */
    renderProductActions(product) {
        // Verifica se usuário está logado
        const isLoggedIn = window.Auth?.isLoggedIn();
        
        if (isLoggedIn) {
            // Usuário logado - mostra botão de adicionar estoque
            return `
                <button class="btn btn-success" onclick="window.ProductsListPage.showAddStockModal('${product.id}')">
                    + Estoque
                </button>
            `;
        } else {
            // Usuário não logado - mostra botão para fazer login
            return `
                <button class="btn btn-secondary" onclick="window.Router.navigate('/login')">
                    Fazer Login
                </button>
            `;
        }
    }

    /**
     * Renderiza paginação
     */
    renderPagination() {
        if (!this.pagination || this.pagination.totalPages <= 1) {
            return '';
        }

        const { currentPage, totalPages, hasNext, hasPrev } = this.pagination;
        
        return `
            <div class="pagination-section">
                <div class="pagination-info">
                    Página ${currentPage} de ${totalPages}
                </div>
                <div class="pagination-controls">
                    <button 
                        class="btn btn-secondary" 
                        ${!hasPrev ? 'disabled' : ''}
                        onclick="window.ProductsListPage.goToPage(${currentPage - 1})"
                    >
                        Anterior
                    </button>
                    
                    <div class="pagination-pages">
                        ${this.renderPageNumbers(currentPage, totalPages)}
                    </div>
                    
                    <button 
                        class="btn btn-secondary" 
                        ${!hasNext ? 'disabled' : ''}
                        onclick="window.ProductsListPage.goToPage(${currentPage + 1})"
                    >
                        Próxima
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza números das páginas
     */
    renderPageNumbers(currentPage, totalPages) {
        const maxVisible = window.CONFIG?.pagination?.maxVisiblePages || 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        const endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        let pages = '';
        
        for (let i = startPage; i <= endPage; i++) {
            pages += `
                <button 
                    class="btn ${i === currentPage ? 'btn-primary' : 'btn-secondary'}"
                    onclick="window.ProductsListPage.goToPage(${i})"
                >
                    ${i}
                </button>
            `;
        }
        
        return pages;
    }

    /**
     * Obtém status do estoque
     */
    getStockStatus(stock) {
        if (stock === 0) {
            return { class: 'stock-empty', text: 'Esgotado' };
        } else if (stock < 20) {
            return { class: 'stock-low', text: 'Estoque baixo' };
        } else {
            return { class: 'stock-ok', text: 'Em estoque' };
        }
    }

    /**
     * Pré-carrega imagem para melhor UX
     */
    preloadImage(imageUrl, productId) {
        const img = new Image();
        img.onload = () => {
            console.log(`✅ Imagem carregada: ${productId}`);
        };
        img.onerror = () => {
            console.warn(`⚠️ Falha ao carregar imagem: ${productId} - ${imageUrl}`);
        };
        img.src = imageUrl;
    }

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Busca
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.currentFilters.search = e.target.value;
                    this.currentPage = 1;
                    this.refreshData();
                }, window.CONFIG?.search?.debounceMs || 300);
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.currentFilters.search = searchInput.value;
                this.currentPage = 1;
                this.refreshData();
            });
        }

        // Filtros
        const categorySelect = document.getElementById('categorySelect');
        const sortSelect = document.getElementById('sortSelect');
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        const clearFiltersBtn2 = document.getElementById('clearFiltersBtn2');

        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.currentPage = 1;
                this.refreshData();
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentFilters.sortBy = e.target.value;
                this.currentPage = 1;
                this.refreshData();
            });
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        }

        if (clearFiltersBtn2) {
            clearFiltersBtn2.addEventListener('click', () => this.clearFilters());
        }
    }

    /**
     * Limpa filtros
     */
    async clearFilters() {
        this.currentFilters = {
            search: '',
            category: '',
            sortBy: 'name-asc'
        };
        this.currentPage = 1;
        
        // Atualiza interface
        const searchInput = document.getElementById('searchInput');
        const categorySelect = document.getElementById('categorySelect');
        const sortSelect = document.getElementById('sortSelect');
        
        if (searchInput) searchInput.value = '';
        if (categorySelect) categorySelect.value = '';
        if (sortSelect) sortSelect.value = 'name-asc';
        
        await this.refreshData();
    }

    /**
     * Atualiza dados
     */
    async refreshData() {
        try {
            this.showLoading();
            await this.loadData();
            this.renderInterface();
            this.setupEventListeners();
        } catch (error) {
            console.error('❌ Erro ao atualizar dados:', error);
            this.showError('Erro ao atualizar produtos', error.message);
        }
    }

    /**
     * Vai para página específica
     */
    async goToPage(page) {
        if (page < 1 || page > this.pagination.totalPages) return;
        
        this.currentPage = page;
        await this.refreshData();
    }

    /**
     * Visualiza produto
     */
    viewProduct(productId) {
        window.Router.navigate(`/produto/${productId}`);
    }

    /**
     * Mostra modal de adicionar estoque
     */
    async showAddStockModal(productId) {
        try {
            const product = await window.ProductsRepo.getProductById(productId);
            if (!product) {
                window.UI.showToast('Erro', 'Produto não encontrado', 'error');
                return;
            }

            if (!product.active) {
                window.UI.showToast('Erro', 'Produto inativo - não é possível adicionar estoque', 'error');
                return;
            }

            const modal = window.UI.showModal({
                title: `Adicionar Estoque - ${product.name}`,
                content: this.renderAddStockForm(product),
                size: 'medium',
                actions: [
                    {
                        text: 'Cancelar',
                        class: 'btn-secondary',
                        action: () => window.UI.hideModal()
                    },
                    {
                        text: 'Confirmar Aumento',
                        class: 'btn-success',
                        action: () => this.confirmAddStock(productId)
                    }
                ]
            });

            // Configura event listeners para os botões de incremento
            this.setupIncrementButtons(product);

        } catch (error) {
            console.error('❌ Erro ao mostrar modal:', error);
            window.UI.showToast('Erro', 'Erro ao carregar modal', 'error');
        }
    }

    /**
     * Renderiza formulário de adicionar estoque
     */
    renderAddStockForm(product) {
        const currentStock = product.stock;
        const maxStock = window.CONFIG?.stock?.maxStock || 1000;
        const maxIncrement = maxStock - currentStock;

        return `
            <div class="add-stock-form">
                <div class="product-info">
                    <div class="product-image-small">
                        <img src="${window.ProductsRepo.getProductImage(product)}" alt="${product.name}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='assets/placeholders/default.png'">
                    </div>
                    <div class="product-details">
                        <h4>${product.name}</h4>
                        <p>Estoque atual: <strong>${currentStock} unidades</strong></p>
                        <p>Preço: ${window.ProductsRepo.formatPrice(product.price)}</p>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="stockIncrement">Quantidade a adicionar (múltiplos de 10)</label>
                    <div class="increment-buttons">
                        <button type="button" class="btn btn-secondary increment-btn" data-increment="10">+10</button>
                        <button type="button" class="btn btn-secondary increment-btn" data-increment="20">+20</button>
                        <button type="button" class="btn btn-secondary increment-btn" data-increment="30">+30</button>
                        <button type="button" class="btn btn-secondary increment-btn" data-increment="50">+50</button>
                        <button type="button" class="btn btn-secondary increment-btn" data-increment="100">+100</button>
                    </div>
                    <input 
                        type="number" 
                        id="stockIncrement" 
                        class="form-input" 
                        min="10" 
                        max="${maxIncrement}" 
                        step="10" 
                        value="10"
                        placeholder="Digite a quantidade"
                    >
                    <small class="form-help">
                        Mínimo: 10 unidades | Máximo: ${maxIncrement} unidades
                    </small>
                </div>
                
                <div class="stock-preview">
                    <div class="current-stock">
                        <span class="label">Estoque atual:</span>
                        <span class="value">${currentStock} unidades</span>
                    </div>
                    <div class="increment-amount">
                        <span class="label">Adicionando:</span>
                        <span class="value" id="incrementPreview">10 unidades</span>
                    </div>
                    <div class="new-stock">
                        <span class="label">Novo estoque:</span>
                        <span class="value" id="newStockPreview">${currentStock + 10} unidades</span>
                    </div>
                </div>
                
                <div class="confirm-section">
                    <button type="button" class="btn btn-success btn-confirm-stock" id="confirmStockBtn">
                        <svg class="icon" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        Confirmar
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Configura botões de incremento
     */
    setupIncrementButtons(product) {
        const incrementButtons = document.querySelectorAll('.increment-btn');
        const stockInput = document.getElementById('stockIncrement');
        const confirmBtn = document.getElementById('confirmStockBtn');
        
        // Event listeners para botões de incremento
        incrementButtons.forEach(button => {
            button.addEventListener('click', () => {
                const increment = parseInt(button.dataset.increment);
                stockInput.value = increment;
                this.updateStockPreview(product, increment);
            });
        });

        // Event listener para input manual
        stockInput.addEventListener('input', () => {
            const increment = parseInt(stockInput.value) || 0;
            this.updateStockPreview(product, increment);
        });

        // Event listener para botão Confirmar
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.confirmAddStock(product.id);
            });
        }
    }

    /**
     * Atualiza preview do estoque
     */
    updateStockPreview(product, increment) {
        const incrementPreview = document.getElementById('incrementPreview');
        const newStockPreview = document.getElementById('newStockPreview');
        
        if (incrementPreview && newStockPreview) {
            incrementPreview.textContent = `${increment} unidades`;
            newStockPreview.textContent = `${product.stock + increment} unidades`;
        }
    }

    /**
     * Confirma adição de estoque com validação
     */
    async confirmAddStock(productId) {
        try {
            const incrementInput = document.getElementById('stockIncrement');
            const increment = parseInt(incrementInput.value);

            if (!increment || increment < 10) {
                window.UI.showToast('Erro', 'Quantidade deve ser no mínimo 10 unidades', 'error');
                return;
            }

            if (increment % 10 !== 0) {
                window.UI.showToast('Erro', 'Quantidade deve ser múltiplo de 10', 'error');
                return;
            }

            // Busca dados do produto para mostrar na confirmação
            const product = await window.ProductsRepo.getProductById(productId);
            if (!product) {
                window.UI.showToast('Erro', 'Produto não encontrado', 'error');
                return;
            }

            const newStock = product.stock + increment;
            const maxStock = window.CONFIG?.stock?.maxStock || 1000;

            if (newStock > maxStock) {
                window.UI.showToast('Erro', `Estoque não pode exceder ${maxStock} unidades`, 'error');
                return;
            }

            // Armazena o ID do produto atual
            this.currentProductId = productId;
            
            // Mostra confirmação final
            this.showFinalConfirmation(product, increment, newStock);

        } catch (error) {
            console.error('❌ Erro ao confirmar adição de estoque:', error);
            window.UI.showToast('Erro', 'Erro ao processar confirmação', 'error');
        }
    }

    /**
     * Mostra confirmação final
     */
    async showFinalConfirmation(product, increment, newStock) {
        return new Promise((resolve) => {
            const modal = window.UI.showModal({
                title: 'Confirmar Aumento de Estoque',
                content: `
                    <div class="confirmation-details">
                        <div class="product-summary">
                            <h4>${product.name}</h4>
                            <p><strong>Estoque atual:</strong> ${product.stock} unidades</p>
                            <p><strong>Adicionando:</strong> ${increment} unidades</p>
                            <p><strong>Novo estoque:</strong> ${newStock} unidades</p>
                        </div>
                        <div class="confirmation-warning">
                            <p>⚠️ Esta ação não pode ser desfeita. Tem certeza que deseja continuar?</p>
                        </div>
                    </div>
                `,
                size: 'small',
                buttons: [
                    {
                        text: 'Cancelar',
                        class: 'btn-secondary',
                        onclick: 'window.UI.hideModal(); window.ProductsListPage.cancelConfirmation();'
                    },
                    {
                        text: 'Confirmar',
                        class: 'btn-success btn-confirm-final',
                        onclick: 'window.ProductsListPage.confirmStockIncrease();'
                    }
                ]
            });
        });
    }

    /**
     * Cancela confirmação
     */
    cancelConfirmation() {
        // Método para cancelar confirmação
        console.log('Confirmação cancelada');
    }

    /**
     * Confirma aumento de estoque
     */
    async confirmStockIncrease() {
        try {
            window.UI.hideModal();
            
            // Busca o produto atual e incremento
            const incrementInput = document.getElementById('stockIncrement');
            const increment = parseInt(incrementInput.value);
            
            if (!increment || increment < 10) {
                window.UI.showToast('Erro', 'Quantidade inválida', 'error');
                return;
            }

            // Executa o aumento de estoque
            await this.handleAddStock(this.currentProductId);
            
        } catch (error) {
            console.error('❌ Erro ao confirmar aumento:', error);
            window.UI.showToast('Erro', 'Erro ao processar confirmação', 'error');
        }
    }

    /**
     * Manipula adição de estoque
     */
    async handleAddStock(productId) {
        try {
            const incrementInput = document.getElementById('stockIncrement');
            const increment = parseInt(incrementInput.value);

            if (!increment || increment < 10) {
                window.UI.showToast('Erro', 'Quantidade deve ser pelo menos 10 unidades', 'error');
                return;
            }

            // Valida incremento
            const product = await window.ProductsRepo.getProductById(productId);
            const validation = window.Validators.validateStockIncrement(
                increment, 
                product.stock, 
                window.CONFIG?.stock?.maxStock || 1000
            );

            if (!validation.isValid) {
                window.UI.showToast('Erro', validation.message, 'error');
                return;
            }

            // Confirmação já foi feita no modal anterior

            // Adiciona estoque
            const updatedProduct = await window.ProductsRepo.addStock(productId, increment);
            
            window.UI.hideModal();
            window.UI.showToast(
                'Sucesso', 
                `Estoque atualizado: ${product.stock} → ${updatedProduct.stock} unidades`, 
                'success'
            );

            // Atualiza lista
            await this.refreshData();

        } catch (error) {
            console.error('❌ Erro ao adicionar estoque:', error);
            window.UI.showToast('Erro', error.message, 'error');
        }
    }

    /**
     * Mostra erro
     */
    showError(title, message) {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="error-page">
                <div class="error-content">
                    <h1>${title}</h1>
                    <p>${message}</p>
                    <div class="error-actions">
                        <button class="btn btn-primary" onclick="window.ProductsListPage.render()">
                            Tentar Novamente
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Instância global
const productsListPage = new ProductsListPage();

// Exporta para uso global
window.ProductsListPage = productsListPage;
