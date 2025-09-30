/**
 * Página de Detalhes do Produto
 * Sistema E2E Commerce - Gestão de Produtos
 */

class ProductDetailPage {
    constructor() {
        this.product = null;
        this.isLoading = false;
    }

    /**
     * Renderiza a página
     */
    async render(params = {}) {
        try {
            console.log('🔄 Renderizando detalhes do produto...', params);
            
            const productId = params.id || params.productId;
            if (!productId) {
                throw new Error('ID do produto não fornecido');
            }

            const app = document.getElementById('app');
            if (!app) {
                throw new Error('Elemento #app não encontrado');
            }

            // Mostra loading
            this.showLoading();

            // Carrega produto
            await this.loadProduct(productId);

            // Renderiza interface
            this.renderInterface();

            // Configura eventos
            this.setupEventListeners();

            console.log('✅ Detalhes do produto renderizados');
        } catch (error) {
            console.error('❌ Erro ao renderizar detalhes do produto:', error);
            this.showError('Erro ao carregar produto', error.message);
        }
    }

    /**
     * Mostra loading
     */
    showLoading() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="product-detail-page">
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <p>Carregando produto...</p>
                </div>
            </div>
        `;
    }

    /**
     * Carrega dados do produto
     */
    async loadProduct(productId) {
        try {
            this.isLoading = true;
            
            this.product = await window.ProductsRepo.getProductById(productId);
            
            if (!this.product) {
                throw new Error('Produto não encontrado');
            }

            if (!this.product.active) {
                throw new Error('Produto inativo');
            }
            
            console.log(`📦 Produto carregado: ${this.product.name}`);
        } catch (error) {
            console.error('❌ Erro ao carregar produto:', error);
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
            <div class="product-detail-page">
                ${this.renderHeader()}
                ${this.renderProductDetail()}
                ${this.renderActions()}
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
                    <div class="header-nav">
                        <button class="btn btn-secondary" onclick="window.Router.navigate('/produtos')">
                            ← Voltar para Produtos
                        </button>
                    </div>
                    <div class="header-title">
                        <h1>Detalhes do Produto</h1>
                        <p>Visualize e gerencie as informações do produto</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza detalhes do produto
     */
    renderProductDetail() {
        const imageUrl = window.ProductsRepo.getProductImage(this.product);
        const price = window.ProductsRepo.formatPrice(this.product.price);
        const category = window.CONFIG?.categories?.[this.product.category];
        const stockStatus = this.getStockStatus(this.product.stock);
        const createdAt = window.ProductsRepo.formatDate(this.product.createdAt);
        const updatedAt = window.ProductsRepo.formatDate(this.product.updatedAt);
        
        // Pré-carrega a imagem para melhor UX
        this.preloadImage(imageUrl, this.product.id);

        return `
            <div class="product-detail-section">
                <div class="product-detail-container">
                    <div class="product-image-section">
                        <div class="product-image-large">
                            <img src="${imageUrl}" alt="${this.product.name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='assets/placeholders/${this.product.category || 'default'}.png'; if(this.src.includes('placeholders')) this.style.background='#f8f9fa';">
                            <div class="product-category-large">
                                <span class="category-badge-large" style="background-color: ${category?.color || '#666'}">
                                    ${category?.icon || '📦'} ${category?.name || this.product.category}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="product-info-section">
                        <div class="product-header">
                            <h1 class="product-title">${this.product.name}</h1>
                            <div class="product-price-large">${price}</div>
                        </div>
                        
                        <div class="product-description">
                            <h3>Descrição</h3>
                            <p>${this.product.description}</p>
                        </div>
                        
                        <div class="product-details">
                            <div class="detail-item">
                                <span class="detail-label">Categoria:</span>
                                <span class="detail-value">${category?.name || this.product.category}</span>
                            </div>
                            
                            <div class="detail-item">
                                <span class="detail-label">Estoque:</span>
                                <span class="detail-value stock-value ${stockStatus.class}">
                                    ${this.product.stock} unidades
                                </span>
                            </div>
                            
                            <div class="detail-item">
                                <span class="detail-label">Status:</span>
                                <span class="detail-value status-active">Ativo</span>
                            </div>
                            
                            <div class="detail-item">
                                <span class="detail-label">Criado em:</span>
                                <span class="detail-value">${createdAt}</span>
                            </div>
                            
                            <div class="detail-item">
                                <span class="detail-label">Atualizado em:</span>
                                <span class="detail-value">${updatedAt}</span>
                            </div>
                        </div>
                        
                        <div class="product-stock-info">
                            <h3>Informações de Estoque</h3>
                            <div class="stock-details">
                                <div class="stock-item">
                                    <span class="stock-label">Estoque Atual:</span>
                                    <span class="stock-value ${stockStatus.class}">${this.product.stock} unidades</span>
                                </div>
                                
                                <div class="stock-item">
                                    <span class="stock-label">Status:</span>
                                    <span class="stock-status ${stockStatus.class}">${stockStatus.text}</span>
                                </div>
                                
                                <div class="stock-item">
                                    <span class="stock-label">Valor Total:</span>
                                    <span class="stock-value">${window.ProductsRepo.formatPrice(this.product.price * this.product.stock)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza ações
     */
    renderActions() {
        // Verifica se usuário está logado
        const isLoggedIn = window.Auth?.isLoggedIn();
        
        return `
            <div class="product-actions-section">
                <div class="actions-container">
                    <div class="action-buttons">
                        ${this.renderProductActions()}
                        
                        <button class="btn btn-secondary" onclick="window.Router.navigate('/produtos')">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                            </svg>
                            Voltar para Lista
                        </button>
                    </div>
                    
                    <div class="stock-warning" id="stockWarning" style="display: none;">
                        <div class="warning-icon">⚠️</div>
                        <div class="warning-text">
                            <strong>Estoque baixo!</strong> Considere adicionar mais unidades.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza ações do produto baseadas no status de login
     */
    renderProductActions() {
        // Verifica se usuário está logado
        const isLoggedIn = window.Auth?.isLoggedIn();
        
        if (isLoggedIn) {
            // Usuário logado - mostra botão de adicionar estoque
            return `
                <button class="btn btn-primary" onclick="window.ProductDetailPage.showAddStockModal()">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    Adicionar Estoque
                </button>
            `;
        } else {
            // Usuário não logado - mostra botão para fazer login
            return `
                <button class="btn btn-primary" onclick="window.Router.navigate('/login')">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Fazer Login
                </button>
            `;
        }
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
        // Mostra aviso de estoque baixo se necessário
        if (this.product.stock < 20) {
            const warning = document.getElementById('stockWarning');
            if (warning) {
                warning.style.display = 'flex';
            }
        }
    }

    /**
     * Mostra modal de adicionar estoque
     */
    async showAddStockModal() {
        try {
            if (!this.product.active) {
                window.UI.showToast('Erro', 'Produto inativo - não é possível adicionar estoque', 'error');
                return;
            }

            const modal = window.UI.showModal({
                title: `Adicionar Estoque - ${this.product.name}`,
                content: this.renderAddStockForm(),
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
                        action: () => this.confirmAddStock()
                    }
                ]
            });

            // Configura botões de incremento
            this.setupIncrementButtons();

        } catch (error) {
            console.error('❌ Erro ao mostrar modal:', error);
            window.UI.showToast('Erro', 'Erro ao carregar modal', 'error');
        }
    }

    /**
     * Renderiza formulário de adicionar estoque
     */
    renderAddStockForm() {
        const currentStock = this.product.stock;
        const maxStock = window.CONFIG?.stock?.maxStock || 1000;
        const maxIncrement = maxStock - currentStock;

        return `
            <div class="add-stock-form">
                <div class="product-info">
                    <div class="product-image-small">
                        <img src="${window.ProductsRepo.getProductImage(this.product)}" alt="${this.product.name}">
                    </div>
                    <div class="product-details">
                        <h4>${this.product.name}</h4>
                        <p>Estoque atual: <strong>${currentStock} unidades</strong></p>
                        <p>Preço: ${window.ProductsRepo.formatPrice(this.product.price)}</p>
                        <p>Limite máximo: ${maxStock} unidades</p>
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
    setupIncrementButtons() {
        const incrementButtons = document.querySelectorAll('.increment-btn');
        const incrementInput = document.getElementById('stockIncrement');
        const confirmBtn = document.getElementById('confirmStockBtn');
        
        // Event listeners para botões de incremento
        incrementButtons.forEach(button => {
            button.addEventListener('click', () => {
                const increment = parseInt(button.dataset.increment);
                incrementInput.value = increment;
                this.updateStockPreview(increment);
            });
        });

        // Event listener para input manual
        incrementInput.addEventListener('input', () => {
            const increment = parseInt(incrementInput.value) || 0;
            this.updateStockPreview(increment);
        });

        // Event listener para botão Confirmar
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.confirmAddStock();
            });
        }
    }

    /**
     * Atualiza preview do estoque
     */
    updateStockPreview(increment) {
        const incrementPreview = document.getElementById('incrementPreview');
        const newStockPreview = document.getElementById('newStockPreview');
        
        if (incrementPreview && newStockPreview) {
            incrementPreview.textContent = `${increment} unidades`;
            newStockPreview.textContent = `${this.product.stock + increment} unidades`;
        }
    }

    /**
     * Confirma adição de estoque com validação
     */
    async confirmAddStock() {
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

            const newStock = this.product.stock + increment;
            const maxStock = window.CONFIG?.stock?.maxStock || 1000;

            if (newStock > maxStock) {
                window.UI.showToast('Erro', `Estoque não pode exceder ${maxStock} unidades`, 'error');
                return;
            }

            // Mostra confirmação final
            const confirmed = await this.showFinalConfirmation(increment, newStock);
            if (confirmed) {
                await this.handleAddStock();
            }

        } catch (error) {
            console.error('❌ Erro ao confirmar adição de estoque:', error);
            window.UI.showToast('Erro', 'Erro ao processar confirmação', 'error');
        }
    }

    /**
     * Mostra confirmação final
     */
    async showFinalConfirmation(increment, newStock) {
        return new Promise((resolve) => {
            const modal = window.UI.showModal({
                title: 'Confirmar Aumento de Estoque',
                content: `
                    <div class="confirmation-details">
                        <div class="product-summary">
                            <h4>${this.product.name}</h4>
                            <p><strong>Estoque atual:</strong> ${this.product.stock} unidades</p>
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
                        onclick: 'window.UI.hideModal(); window.ProductDetailPage.cancelConfirmation();'
                    },
                    {
                        text: 'Confirmar',
                        class: 'btn-success btn-confirm-final',
                        onclick: 'window.ProductDetailPage.confirmStockIncrease();'
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
            
            // Busca o incremento do input
            const incrementInput = document.getElementById('stockIncrement');
            const increment = parseInt(incrementInput.value);
            
            if (!increment || increment < 10) {
                window.UI.showToast('Erro', 'Quantidade inválida', 'error');
                return;
            }

            // Executa o aumento de estoque
            await this.handleAddStock();
            
        } catch (error) {
            console.error('❌ Erro ao confirmar aumento:', error);
            window.UI.showToast('Erro', 'Erro ao processar confirmação', 'error');
        }
    }

    /**
     * Manipula adição de estoque
     */
    async handleAddStock() {
        try {
            const incrementInput = document.getElementById('stockIncrement');
            const increment = parseInt(incrementInput.value);

            if (!increment || increment < 10) {
                window.UI.showToast('Erro', 'Quantidade deve ser pelo menos 10 unidades', 'error');
                return;
            }

            // Valida incremento
            const validation = window.Validators.validateStockIncrement(
                increment, 
                this.product.stock, 
                window.CONFIG?.stock?.maxStock || 1000
            );

            if (!validation.isValid) {
                window.UI.showToast('Erro', validation.message, 'error');
                return;
            }

            // Confirmação já foi feita no modal anterior

            // Adiciona estoque
            const updatedProduct = await window.ProductsRepo.addStock(this.product.id, increment);
            
            window.UI.hideModal();
            window.UI.showToast(
                'Sucesso', 
                `Estoque atualizado: ${this.product.stock} → ${updatedProduct.stock} unidades`, 
                'success'
            );

            // Atualiza produto atual
            this.product = updatedProduct;

            // Re-renderiza página
            this.renderInterface();
            this.setupEventListeners();

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
                        <button class="btn btn-primary" onclick="window.Router.navigate('/produtos')">
                            Voltar para Produtos
                        </button>
                        <button class="btn btn-secondary" onclick="window.ProductDetailPage.render({id: '${this.product?.id || ''}'})">
                            Tentar Novamente
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Instância global
const productDetailPage = new ProductDetailPage();

// Exporta para uso global
window.ProductDetailPage = productDetailPage;
