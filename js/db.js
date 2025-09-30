/**
 * Simulação de banco de dados MySQL
 * Sistema E2E Commerce - Gestão de Produtos
 */

class Database {
    constructor() {
        this.products = [];
        this.isInitialized = false;
    }

    /**
     * Inicializa o banco com dados seed
     */
    async initialize() {
        if (this.isInitialized) {
            return;
        }

        try {
            // Verifica se já existem produtos no localStorage
            const existingProducts = window.Storage.storage.getItem('products', []);
            
            if (existingProducts.length === 0) {
                console.log('🌱 Inicializando banco de dados com dados seed...');
                this.products = this.generateSeedData();
                this.saveProducts();
                console.log(`✅ ${this.products.length} produtos criados`);
            } else {
                this.products = existingProducts;
                console.log(`📊 ${this.products.length} produtos carregados do localStorage`);
            }

            this.isInitialized = true;
        } catch (error) {
            console.error('❌ Erro ao inicializar banco de dados:', error);
            throw error;
        }
    }

    /**
     * Gera dados seed simulando produtos de um e-commerce
     */
    generateSeedData() {
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;

        return [
            // Calçados
            {
                id: "p-001",
                name: "Tênis Run Fast",
                description: "Tênis leve para corrida com tecnologia de amortecimento avançada",
                category: "calcados",
                price: 299.90,
                stock: 120,
                active: true,
                imageKey: "calcados",
                createdAt: now - (30 * oneDayMs),
                updatedAt: now - (30 * oneDayMs)
            },
            {
                id: "p-002",
                name: "Sapato Social Elegance",
                description: "Sapato social em couro legítimo para ocasiões especiais",
                category: "calcados",
                price: 450.00,
                stock: 45,
                active: true,
                imageKey: "calcados",
                createdAt: now - (25 * oneDayMs),
                updatedAt: now - (25 * oneDayMs)
            },
            {
                id: "p-003",
                name: "Sandália Comfort",
                description: "Sandália confortável para o dia a dia",
                category: "calcados",
                price: 89.90,
                stock: 200,
                active: true,
                imageKey: "calcados",
                createdAt: now - (20 * oneDayMs),
                updatedAt: now - (20 * oneDayMs)
            },

            // Roupas
            {
                id: "p-004",
                name: "Camiseta Básica Premium",
                description: "Camiseta 100% algodão com corte moderno",
                category: "roupas",
                price: 49.90,
                stock: 300,
                active: true,
                imageKey: "roupas",
                createdAt: now - (28 * oneDayMs),
                updatedAt: now - (28 * oneDayMs)
            },
            {
                id: "p-005",
                name: "Jaqueta Jeans Vintage",
                description: "Jaqueta jeans com lavagem vintage e detalhes únicos",
                category: "roupas",
                price: 199.90,
                stock: 75,
                active: true,
                imageKey: "roupas",
                createdAt: now - (22 * oneDayMs),
                updatedAt: now - (22 * oneDayMs)
            },
            {
                id: "p-006",
                name: "Vestido Elegante",
                description: "Vestido elegante para ocasiões especiais",
                category: "roupas",
                price: 350.00,
                stock: 30,
                active: true,
                imageKey: "roupas",
                createdAt: now - (15 * oneDayMs),
                updatedAt: now - (15 * oneDayMs)
            },

            // Acessórios
            {
                id: "p-007",
                name: "Bolsa de Couro Artesanal",
                description: "Bolsa de couro legítimo com acabamento artesanal",
                category: "acessorios",
                price: 280.00,
                stock: 50,
                active: true,
                imageKey: "acessorios",
                createdAt: now - (18 * oneDayMs),
                updatedAt: now - (18 * oneDayMs)
            },
            {
                id: "p-008",
                name: "Relógio Smart Fitness",
                description: "Relógio inteligente com monitoramento de saúde",
                category: "acessorios",
                price: 599.90,
                stock: 25,
                active: true,
                imageKey: "acessorios",
                createdAt: now - (12 * oneDayMs),
                updatedAt: now - (12 * oneDayMs)
            },

            // Eletrônicos
            {
                id: "p-009",
                name: "Smartphone Galaxy Pro",
                description: "Smartphone com câmera profissional e tela 4K",
                category: "eletronicos",
                price: 1299.90,
                stock: 15,
                active: true,
                imageKey: "eletronicos",
                createdAt: now - (10 * oneDayMs),
                updatedAt: now - (10 * oneDayMs)
            },
            {
                id: "p-010",
                name: "Fone Bluetooth Premium",
                description: "Fone sem fio com cancelamento de ruído",
                category: "eletronicos",
                price: 399.90,
                stock: 80,
                active: true,
                imageKey: "eletronicos",
                createdAt: now - (8 * oneDayMs),
                updatedAt: now - (8 * oneDayMs)
            },
            {
                id: "p-011",
                name: "Tablet Pro 12",
                description: "Tablet profissional com tela retina",
                category: "eletronicos",
                price: 899.90,
                stock: 20,
                active: true,
                imageKey: "eletronicos",
                createdAt: now - (5 * oneDayMs),
                updatedAt: now - (5 * oneDayMs)
            },

            // Casa e Decoração
            {
                id: "p-012",
                name: "Luminária LED Moderna",
                description: "Luminária LED com controle de intensidade",
                category: "casa",
                price: 159.90,
                stock: 60,
                active: true,
                imageKey: "casa",
                createdAt: now - (14 * oneDayMs),
                updatedAt: now - (14 * oneDayMs)
            },
            {
                id: "p-013",
                name: "Jogo de Pratos Premium",
                description: "Jogo de pratos em porcelana de alta qualidade",
                category: "casa",
                price: 89.90,
                stock: 100,
                active: true,
                imageKey: "casa",
                createdAt: now - (7 * oneDayMs),
                updatedAt: now - (7 * oneDayMs)
            },

            // Esportes
            {
                id: "p-014",
                name: "Bola de Futebol Oficial",
                description: "Bola de futebol oficial para competições",
                category: "esportes",
                price: 79.90,
                stock: 150,
                active: true,
                imageKey: "esportes",
                createdAt: now - (16 * oneDayMs),
                updatedAt: now - (16 * oneDayMs)
            },
            {
                id: "p-015",
                name: "Kit Academia Completo",
                description: "Kit completo para treinos em casa",
                category: "esportes",
                price: 299.90,
                stock: 40,
                active: true,
                imageKey: "esportes",
                createdAt: now - (6 * oneDayMs),
                updatedAt: now - (6 * oneDayMs)
            },

            // Produtos com estoque baixo
            {
                id: "p-016",
                name: "Produto Esgotando",
                description: "Produto com estoque baixo para testes",
                category: "calcados",
                price: 199.90,
                stock: 5,
                active: true,
                imageKey: "calcados",
                createdAt: now - (3 * oneDayMs),
                updatedAt: now - (3 * oneDayMs)
            },

            // Produto inativo
            {
                id: "p-017",
                name: "Produto Inativo",
                description: "Produto descontinuado (não deve aparecer na listagem)",
                category: "eletronicos",
                price: 99.90,
                stock: 0,
                active: false,
                imageKey: "eletronicos",
                createdAt: now - (40 * oneDayMs),
                updatedAt: now - (40 * oneDayMs)
            }
        ];
    }

    /**
     * Salva produtos no localStorage
     */
    saveProducts() {
        window.Storage.storage.setItem('products', this.products);
    }

    /**
     * Carrega produtos do localStorage
     */
    loadProducts() {
        this.products = window.Storage.storage.getItem('products', []);
    }

    /**
     * Obtém todos os produtos
     */
    getAllProducts() {
        return [...this.products];
    }

    /**
     * Obtém produtos ativos
     */
    getActiveProducts() {
        return this.products.filter(product => product.active);
    }

    /**
     * Busca produto por ID
     */
    getProductById(id) {
        return this.products.find(product => product.id === id) || null;
    }

    /**
     * Atualiza produto
     */
    updateProduct(id, updates) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = {
                ...this.products[index],
                ...updates,
                updatedAt: Date.now()
            };
            this.saveProducts();
            return this.products[index];
        }
        return null;
    }

    /**
     * Adiciona estoque ao produto
     */
    addStock(id, quantity) {
        const product = this.getProductById(id);
        if (product && product.active) {
            const newStock = product.stock + quantity;
            return this.updateProduct(id, { stock: newStock });
        }
        return null;
    }

    /**
     * Verifica se o banco está inicializado
     */
    isReady() {
        return this.isInitialized;
    }

    /**
     * Reinicializa o banco (limpa dados e recria)
     */
    async reset() {
        this.products = [];
        this.isInitialized = false;
        window.Storage.storage.removeItem('products');
        await this.initialize();
    }

    /**
     * Obtém estatísticas do banco
     */
    getStats() {
        const total = this.products.length;
        const active = this.products.filter(p => p.active).length;
        const inactive = total - active;
        const lowStock = this.products.filter(p => p.active && p.stock < 20).length;
        const outOfStock = this.products.filter(p => p.active && p.stock === 0).length;

        return {
            total,
            active,
            inactive,
            lowStock,
            outOfStock,
            categories: this.getCategoryStats()
        };
    }

    /**
     * Obtém estatísticas por categoria
     */
    getCategoryStats() {
        const stats = {};
        this.products.forEach(product => {
            if (!stats[product.category]) {
                stats[product.category] = {
                    total: 0,
                    active: 0,
                    totalStock: 0,
                    totalValue: 0
                };
            }
            
            stats[product.category].total++;
            if (product.active) {
                stats[product.category].active++;
                stats[product.category].totalStock += product.stock;
                stats[product.category].totalValue += product.price * product.stock;
            }
        });

        return stats;
    }
}

// Instância global do banco
const database = new Database();

// Inicializa o banco automaticamente
database.initialize().catch(error => {
    console.error('Erro ao inicializar banco de dados:', error);
});

// Exporta para uso global
window.Database = database;
