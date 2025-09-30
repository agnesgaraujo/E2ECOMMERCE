/**
 * Configurações do sistema E2E Commerce
 * Sistema de Gestão de Produtos
 */

const CONFIG = {
    // Configurações de paginação
    pagination: {
        itemsPerPage: 12,
        maxVisiblePages: 5
    },

    // Configurações de estoque
    stock: {
        maxStock: 1000,
        incrementStep: 10,
        minIncrement: 10
    },

    // Categorias de produtos
    categories: {
        'calcados': {
            name: 'Calçados',
            icon: '👟',
            color: '#FF6B6B'
        },
        'roupas': {
            name: 'Roupas',
            icon: '👕',
            color: '#4ECDC4'
        },
        'acessorios': {
            name: 'Acessórios',
            icon: '👜',
            color: '#45B7D1'
        },
        'eletronicos': {
            name: 'Eletrônicos',
            icon: '📱',
            color: '#96CEB4'
        },
        'casa': {
            name: 'Casa e Decoração',
            icon: '🏠',
            color: '#FFEAA7'
        },
        'esportes': {
            name: 'Esportes',
            icon: '⚽',
            color: '#DDA0DD'
        }
    },

    // Mapeamento de imagens placeholder
    imageMapping: {
        'calcados': 'calcados.png',
        'roupas': 'roupas.png',
        'acessorios': 'acessorios.png',
        'eletronicos': 'eletronicos.png',
        'casa': 'casa.png',
        'esportes': 'esportes.png',
        'default': 'default.png'
    },

    // Configurações de busca
    search: {
        minLength: 2,
        debounceMs: 300
    },

    // Configurações de ordenação
    sortOptions: {
        'name-asc': { label: 'Nome (A-Z)', field: 'name', order: 'asc' },
        'name-desc': { label: 'Nome (Z-A)', field: 'name', order: 'desc' },
        'price-asc': { label: 'Preço (Menor)', field: 'price', order: 'asc' },
        'price-desc': { label: 'Preço (Maior)', field: 'price', order: 'desc' },
        'stock-asc': { label: 'Estoque (Menor)', field: 'stock', order: 'asc' },
        'stock-desc': { label: 'Estoque (Maior)', field: 'stock', order: 'desc' },
        'created-asc': { label: 'Mais Antigos', field: 'createdAt', order: 'asc' },
        'created-desc': { label: 'Mais Recentes', field: 'createdAt', order: 'desc' }
    },

    // Configurações de validação
    validation: {
        stockIncrement: {
            multipleOf: 10,
            min: 10,
            max: 100
        }
    },

    // Configurações de UI
    ui: {
        skeletonRows: 6,
        toastDuration: 3000,
        modalAnimationDuration: 300
    },

    // Configurações de performance
    performance: {
        debounceSearch: 300,
        cacheTimeout: 5 * 60 * 1000, // 5 minutos
        maxCacheSize: 100
    }
};

// Exporta configuração global
window.CONFIG = CONFIG;
