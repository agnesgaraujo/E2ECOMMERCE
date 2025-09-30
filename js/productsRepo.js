/**
 * Repositório de Produtos
 * Sistema E2E Commerce - Gestão de Produtos
 */

class ProductsRepository {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = window.CONFIG?.performance?.cacheTimeout || 5 * 60 * 1000; // 5 minutos
    }

    /**
     * Obtém todos os produtos ativos
     */
    async getAllProducts() {
        try {
            if (!window.Database?.isReady()) {
                throw new Error('Banco de dados não inicializado');
            }

            const cacheKey = 'all_products';
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                return cached;
            }

            const products = window.Database.getActiveProducts();
            this.setCache(cacheKey, products);
            
            console.log(`📦 ${products.length} produtos carregados`);
            return products;
        } catch (error) {
            console.error('❌ Erro ao obter produtos:', error);
            throw error;
        }
    }

    /**
     * Busca produtos por nome
     */
    async searchProducts(query, options = {}) {
        try {
            console.log('🔍 Buscando produtos:', { query, options });
            
            if (!query || query.trim().length < 2) {
                return [];
            }

            const searchTerm = query.toLowerCase().trim();
            const cacheKey = `search_${searchTerm}_${JSON.stringify(options)}`;
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                return cached;
            }

            const allProducts = await this.getAllProducts();
            const filteredProducts = allProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );

            this.setCache(cacheKey, filteredProducts);
            console.log(`🔍 ${filteredProducts.length} produtos encontrados para "${query}"`);
            return filteredProducts;
        } catch (error) {
            console.error('❌ Erro na busca de produtos:', error);
            throw error;
        }
    }

    /**
     * Filtra produtos por categoria
     */
    async filterByCategory(category, options = {}) {
        try {
            console.log('🏷️ Filtrando por categoria:', { category, options });
            
            if (!category) {
                return await this.getAllProducts();
            }

            const cacheKey = `category_${category}_${JSON.stringify(options)}`;
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                return cached;
            }

            const allProducts = await this.getAllProducts();
            const filteredProducts = allProducts.filter(product => 
                product.category === category
            );

            this.setCache(cacheKey, filteredProducts);
            console.log(`🏷️ ${filteredProducts.length} produtos na categoria "${category}"`);
            return filteredProducts;
        } catch (error) {
            console.error('❌ Erro ao filtrar por categoria:', error);
            throw error;
        }
    }

    /**
     * Ordena produtos
     */
    async sortProducts(products, sortBy = 'name-asc') {
        try {
            console.log('📊 Ordenando produtos:', { sortBy, count: products.length });
            
            const sortConfig = window.CONFIG?.sortOptions?.[sortBy];
            if (!sortConfig) {
                console.warn('⚠️ Configuração de ordenação não encontrada:', sortBy);
                return products;
            }

            const sortedProducts = [...products].sort((a, b) => {
                let aValue = a[sortConfig.field];
                let bValue = b[sortConfig.field];

                // Tratamento especial para strings
                if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (sortConfig.order === 'asc') {
                    return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
                } else {
                    return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
                }
            });

            console.log(`📊 ${sortedProducts.length} produtos ordenados por ${sortBy}`);
            return sortedProducts;
        } catch (error) {
            console.error('❌ Erro ao ordenar produtos:', error);
            return products; // Retorna produtos sem ordenação em caso de erro
        }
    }

    /**
     * Aplica paginação
     */
    paginateProducts(products, page = 1, itemsPerPage = null) {
        try {
            const pageSize = itemsPerPage || window.CONFIG?.pagination?.itemsPerPage || 12;
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            
            const paginatedProducts = products.slice(startIndex, endIndex);
            const totalPages = Math.ceil(products.length / pageSize);
            
            console.log(`📄 Página ${page}/${totalPages} - ${paginatedProducts.length} produtos`);
            
            return {
                products: paginatedProducts,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: products.length,
                    itemsPerPage: pageSize,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            console.error('❌ Erro na paginação:', error);
            return {
                products: products,
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: products.length,
                    itemsPerPage: pageSize,
                    hasNext: false,
                    hasPrev: false
                }
            };
        }
    }

    /**
     * Busca produto por ID
     */
    async getProductById(id) {
        try {
            console.log('🔍 Buscando produto por ID:', id);
            
            if (!id) {
                throw new Error('ID do produto é obrigatório');
            }

            const cacheKey = `product_${id}`;
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                return cached;
            }

            const product = window.Database.getProductById(id);
            if (product) {
                this.setCache(cacheKey, product);
                console.log('✅ Produto encontrado:', product.name);
            } else {
                console.log('❌ Produto não encontrado:', id);
            }
            
            return product;
        } catch (error) {
            console.error('❌ Erro ao buscar produto por ID:', error);
            throw error;
        }
    }

    /**
     * Adiciona estoque ao produto
     */
    async addStock(productId, increment) {
        try {
            console.log('📦 Adicionando estoque:', { productId, increment });
            
            // Valida incremento
            const product = await this.getProductById(productId);
            if (!product) {
                throw new Error('Produto não encontrado');
            }

            if (!product.active) {
                throw new Error('Produto inativo - não é possível adicionar estoque');
            }

            const validation = window.Validators.validateStockIncrement(
                increment, 
                product.stock, 
                window.CONFIG?.stock?.maxStock || 1000
            );

            if (!validation.isValid) {
                throw new Error(validation.message);
            }

            // Atualiza estoque no banco
            const updatedProduct = window.Database.addStock(productId, increment);
            if (!updatedProduct) {
                throw new Error('Erro ao atualizar estoque');
            }

            // Limpa cache relacionado
            this.clearProductCache(productId);
            
            console.log(`✅ Estoque atualizado: ${product.stock} → ${updatedProduct.stock}`);
            return updatedProduct;
        } catch (error) {
            console.error('❌ Erro ao adicionar estoque:', error);
            throw error;
        }
    }

    /**
     * Obtém produtos com filtros combinados
     */
    async getProductsWithFilters(options = {}) {
        try {
            console.log('🔍 Aplicando filtros:', options);
            
            let products = await this.getAllProducts();

            // Aplica busca por nome
            if (options.search && options.search.trim().length >= 2) {
                products = await this.searchProducts(options.search);
            }

            // Aplica filtro por categoria
            if (options.category) {
                products = products.filter(product => product.category === options.category);
            }

            // Aplica ordenação
            if (options.sortBy) {
                products = await this.sortProducts(products, options.sortBy);
            }

            // Aplica paginação
            const result = this.paginateProducts(products, options.page, options.itemsPerPage);

            console.log(`📊 Resultado dos filtros: ${result.products.length} produtos`);
            return result;
        } catch (error) {
            console.error('❌ Erro ao aplicar filtros:', error);
            throw error;
        }
    }

    /**
     * Obtém estatísticas dos produtos
     */
    async getProductStats() {
        try {
            const stats = window.Database.getStats();
            console.log('📊 Estatísticas dos produtos:', stats);
            return stats;
        } catch (error) {
            console.error('❌ Erro ao obter estatísticas:', error);
            throw error;
        }
    }

    /**
     * Obtém categorias disponíveis
     */
    getAvailableCategories() {
        try {
            const categories = window.CONFIG?.categories || {};
            return Object.entries(categories).map(([key, config]) => ({
                key,
                name: config.name,
                icon: config.icon,
                color: config.color
            }));
        } catch (error) {
            console.error('❌ Erro ao obter categorias:', error);
            return [];
        }
    }

    /**
     * Obtém opções de ordenação
     */
    getSortOptions() {
        try {
            return window.CONFIG?.sortOptions || {};
        } catch (error) {
            console.error('❌ Erro ao obter opções de ordenação:', error);
            return {};
        }
    }

    /**
     * Obtém do cache
     */
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    /**
     * Salva no cache
     */
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    /**
     * Limpa cache de um produto específico
     */
    clearProductCache(productId) {
        const keysToDelete = [];
        for (const key of this.cache.keys()) {
            if (key.includes(productId) || key === 'all_products') {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(key => this.cache.delete(key));
    }

    /**
     * Limpa todo o cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache de produtos limpo');
    }

    /**
     * Obtém imagem do produto
     */
    getProductImage(product) {
        try {
            // URLs diretas do Unsplash com IDs específicos para garantir funcionamento
            const productImageMap = {
                // Calçados
                'p-001': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                'p-002': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                'p-003': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                // Roupas
                'p-004': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                'p-005': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                'p-006': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                // Acessórios
                'p-007': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                'p-008': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                // Eletrônicos
                'p-009': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                'p-010': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                'p-011': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                // Casa e Decoração
                'p-012': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                'p-013': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                // Esportes
                'p-014': 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                'p-015': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                // Teste/baixo estoque
                'p-016': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=700&h=700&fit=crop&crop=center&auto=format&q=80'
            };

            // Se existe imagem específica para o produto
            if (productImageMap[product.id]) {
                return productImageMap[product.id];
            }

            // Fallback por categoria
            const categoryImageMap = {
                'calcados': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                'roupas': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                'acessorios': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                'eletronicos': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                'casa': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=700&h=700&fit=crop&crop=center&auto=format&q=80',
                'esportes': 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=700&h=700&fit=crop&crop=center&auto=format&q=80'
            };

            return categoryImageMap[product.category] || 'assets/placeholders/default.png';
        } catch (error) {
            console.error('❌ Erro ao obter imagem do produto:', error);
            return 'assets/placeholders/default.png';
        }
    }

    /**
     * Formata preço do produto
     */
    formatPrice(price) {
        try {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(price);
        } catch (error) {
            console.error('❌ Erro ao formatar preço:', error);
            return `R$ ${price.toFixed(2)}`;
        }
    }

    /**
     * Formata data do produto
     */
    formatDate(timestamp) {
        try {
            return new Intl.DateTimeFormat('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(new Date(timestamp));
        } catch (error) {
            console.error('❌ Erro ao formatar data:', error);
            return new Date(timestamp).toLocaleDateString('pt-BR');
        }
    }
}

// Instância global
const productsRepo = new ProductsRepository();

// Exporta para uso global
window.ProductsRepo = productsRepo;
