/**
 * Utilitários para gerenciamento de localStorage e sessionStorage
 * Sistema E2E Commerce
 */

class StorageManager {
    constructor() {
        this.prefix = 'e2e_';
    }

    /**
     * Gera uma chave com prefixo
     */
    _getKey(key) {
        return this.prefix + key;
    }

    /**
     * Salva dados no localStorage
     */
    setItem(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(this._getKey(key), serializedValue);
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    }

    /**
     * Recupera dados do localStorage
     */
    getItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this._getKey(key));
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Erro ao recuperar do localStorage:', error);
            return defaultValue;
        }
    }

    /**
     * Remove item do localStorage
     */
    removeItem(key) {
        try {
            localStorage.removeItem(this._getKey(key));
            return true;
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
            return false;
        }
    }

    /**
     * Limpa todos os dados do sistema
     */
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
            return false;
        }
    }

    /**
     * Verifica se uma chave existe
     */
    hasItem(key) {
        return localStorage.getItem(this._getKey(key)) !== null;
    }

    /**
     * Salva dados no sessionStorage
     */
    setSessionItem(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            sessionStorage.setItem(this._getKey(key), serializedValue);
            return true;
        } catch (error) {
            console.error('Erro ao salvar no sessionStorage:', error);
            return false;
        }
    }

    /**
     * Recupera dados do sessionStorage
     */
    getSessionItem(key, defaultValue = null) {
        try {
            const item = sessionStorage.getItem(this._getKey(key));
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Erro ao recuperar do sessionStorage:', error);
            return defaultValue;
        }
    }

    /**
     * Remove item do sessionStorage
     */
    removeSessionItem(key) {
        try {
            sessionStorage.removeItem(this._getKey(key));
            return true;
        } catch (error) {
            console.error('Erro ao remover do sessionStorage:', error);
            return false;
        }
    }

    /**
     * Limpa todos os dados de sessão
     */
    clearSession() {
        try {
            const keys = Object.keys(sessionStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    sessionStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Erro ao limpar sessionStorage:', error);
            return false;
        }
    }
}

/**
 * Gerenciador específico para usuários
 */
class UserStorage {
    constructor(storageManager) {
        this.storage = storageManager;
        this.USERS_KEY = 'users';
    }

    /**
     * Salva array de usuários
     */
    saveUsers(users) {
        return this.storage.setItem(this.USERS_KEY, users);
    }

    /**
     * Recupera array de usuários
     */
    getUsers() {
        return this.storage.getItem(this.USERS_KEY, []);
    }

    /**
     * Adiciona um novo usuário
     */
    addUser(user) {
        const users = this.getUsers();
        users.push(user);
        return this.saveUsers(users);
    }

    /**
     * Atualiza um usuário existente
     */
    updateUser(userId, userData) {
        const users = this.getUsers();
        const index = users.findIndex(user => user.id === userId);
        
        if (index !== -1) {
            users[index] = { ...users[index], ...userData, updatedAt: Date.now() };
            return this.saveUsers(users);
        }
        
        return false;
    }

    /**
     * Remove um usuário
     */
    removeUser(userId) {
        const users = this.getUsers();
        const filteredUsers = users.filter(user => user.id !== userId);
        return this.saveUsers(filteredUsers);
    }

    /**
     * Busca usuário por ID
     */
    getUserById(userId) {
        const users = this.getUsers();
        return users.find(user => user.id === userId) || null;
    }

    /**
     * Busca usuário por email
     */
    getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
    }

    /**
     * Verifica se email já existe
     */
    emailExists(email) {
        return this.getUserByEmail(email) !== null;
    }
}

/**
 * Gerenciador específico para sessões
 */
class SessionStorage {
    constructor(storageManager) {
        this.storage = storageManager;
        this.SESSION_KEY = 'session';
    }

    /**
     * Cria uma nova sessão
     */
    createSession(userId, profile) {
        const session = {
            userId,
            profile,
            sessionId: this._generateSessionId(),
            createdAt: Date.now(),
            lastActivityAt: Date.now()
        };
        
        this.storage.setSessionItem(this.SESSION_KEY, session);
        return session;
    }

    /**
     * Recupera sessão atual
     */
    getSession() {
        return this.storage.getSessionItem(this.SESSION_KEY, null);
    }

    /**
     * Atualiza última atividade
     */
    updateActivity() {
        const session = this.getSession();
        if (session) {
            session.lastActivityAt = Date.now();
            this.storage.setSessionItem(this.SESSION_KEY, session);
        }
    }

    /**
     * Verifica se sessão é válida
     */
    isSessionValid(maxInactivityMinutes = 30) {
        const session = this.getSession();
        if (!session) return false;

        const now = Date.now();
        const inactivityTime = now - session.lastActivityAt;
        const maxInactivityMs = maxInactivityMinutes * 60 * 1000;

        return inactivityTime < maxInactivityMs;
    }

    /**
     * Remove sessão atual
     */
    clearSession() {
        this.storage.removeSessionItem(this.SESSION_KEY);
    }

    /**
     * Gera ID único para sessão
     */
    _generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

/**
 * Gerenciador de cache para melhorar performance
 */
class CacheManager {
    constructor(storageManager) {
        this.storage = storageManager;
        this.CACHE_KEY = 'cache';
        this.defaultTTL = 5 * 60 * 1000; // 5 minutos
    }

    /**
     * Salva item no cache
     */
    set(key, value, ttl = this.defaultTTL) {
        const cacheItem = {
            value,
            timestamp: Date.now(),
            ttl
        };
        
        const cache = this.storage.getItem(this.CACHE_KEY, {});
        cache[key] = cacheItem;
        this.storage.setItem(this.CACHE_KEY, cache);
    }

    /**
     * Recupera item do cache
     */
    get(key) {
        const cache = this.storage.getItem(this.CACHE_KEY, {});
        const item = cache[key];
        
        if (!item) return null;
        
        const now = Date.now();
        if (now - item.timestamp > item.ttl) {
            delete cache[key];
            this.storage.setItem(this.CACHE_KEY, cache);
            return null;
        }
        
        return item.value;
    }

    /**
     * Remove item do cache
     */
    remove(key) {
        const cache = this.storage.getItem(this.CACHE_KEY, {});
        delete cache[key];
        this.storage.setItem(this.CACHE_KEY, cache);
    }

    /**
     * Limpa cache expirado
     */
    cleanExpired() {
        const cache = this.storage.getItem(this.CACHE_KEY, {});
        const now = Date.now();
        let hasChanges = false;
        
        Object.keys(cache).forEach(key => {
            const item = cache[key];
            if (now - item.timestamp > item.ttl) {
                delete cache[key];
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            this.storage.setItem(this.CACHE_KEY, cache);
        }
    }

    /**
     * Limpa todo o cache
     */
    clear() {
        this.storage.setItem(this.CACHE_KEY, {});
    }
}

// Instâncias globais
const storage = new StorageManager();
const userStorage = new UserStorage(storage);
const sessionStorage = new SessionStorage(storage);
const cache = new CacheManager(storage);

// Limpa cache expirado na inicialização
cache.cleanExpired();

// Exporta para uso global
window.Storage = {
    storage,
    userStorage,
    sessionStorage,
    cache
};

