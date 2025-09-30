/**
 * Utilitários de criptografia para segurança básica
 * Sistema E2E Commerce
 * 
 * Implementa hash de senhas com salt usando Web Crypto API
 */

class CryptoUtils {
    constructor() {
        this.algorithm = 'SHA-256';
        this.keyLength = 256;
    }

    /**
     * Gera um salt aleatório
     */
    async generateSalt(length = 16) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return this._arrayToBase64(array);
    }

    /**
     * Gera hash de uma string com salt
     */
    async hashPassword(password, salt) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(password + salt);
            const hashBuffer = await crypto.subtle.digest(this.algorithm, data);
            return this._arrayToBase64(new Uint8Array(hashBuffer));
        } catch (error) {
            console.error('Erro ao gerar hash da senha:', error);
            throw new Error('Falha na criptografia da senha');
        }
    }

    /**
     * Verifica se a senha confere com o hash
     */
    async verifyPassword(password, hash, salt) {
        try {
            const newHash = await this.hashPassword(password, salt);
            return this._constantTimeCompare(hash, newHash);
        } catch (error) {
            console.error('Erro ao verificar senha:', error);
            return false;
        }
    }

    /**
     * Gera ID único para usuários
     */
    generateUserId() {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substr(2, 9);
        return `user_${timestamp}_${randomPart}`;
    }

    /**
     * Gera token de recuperação de senha
     */
    async generateResetToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return this._arrayToBase64(array);
    }

    /**
     * Gera hash seguro para tokens
     */
    async hashToken(token) {
        const encoder = new TextEncoder();
        const data = encoder.encode(token);
        const hashBuffer = await crypto.subtle.digest(this.algorithm, data);
        return this._arrayToBase64(new Uint8Array(hashBuffer));
    }

    /**
     * Converte array de bytes para base64
     */
    _arrayToBase64(array) {
        const binary = Array.from(array, byte => String.fromCharCode(byte)).join('');
        return btoa(binary);
    }

    /**
     * Converte base64 para array de bytes
     */
    _base64ToArray(base64) {
        const binary = atob(base64);
        return new Uint8Array(binary.split('').map(char => char.charCodeAt(0)));
    }

    /**
     * Comparação de tempo constante para evitar timing attacks
     */
    _constantTimeCompare(a, b) {
        if (a.length !== b.length) {
            return false;
        }
        
        let result = 0;
        for (let i = 0; i < a.length; i++) {
            result |= a.charCodeAt(i) ^ b.charCodeAt(i);
        }
        
        return result === 0;
    }

    /**
     * Sanitiza entrada para prevenir XSS
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') {
            return input;
        }
        
        return input
            .replace(/[<>]/g, '') // Remove < e >
            .replace(/javascript:/gi, '') // Remove javascript:
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim();
    }

    /**
     * Valida se string é base64 válida
     */
    isValidBase64(str) {
        try {
            return btoa(atob(str)) === str;
        } catch (error) {
            return false;
        }
    }

    /**
     * Gera checksum para verificação de integridade
     */
    async generateChecksum(data) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(JSON.stringify(data));
        const hashBuffer = await crypto.subtle.digest(this.algorithm, dataBuffer);
        return this._arrayToBase64(new Uint8Array(hashBuffer));
    }

    /**
     * Verifica integridade dos dados
     */
    async verifyChecksum(data, expectedChecksum) {
        const actualChecksum = await this.generateChecksum(data);
        return this._constantTimeCompare(actualChecksum, expectedChecksum);
    }
}

/**
 * Classe para gerenciar senhas com políticas de segurança
 */
class PasswordManager {
    constructor() {
        this.crypto = new CryptoUtils();
        this.minLength = 8;
        this.requireUppercase = true;
        this.requireLowercase = true;
        this.requireNumbers = true;
        this.requireSpecialChars = false;
    }

    /**
     * Valida força da senha
     */
    validatePasswordStrength(password) {
        const errors = [];
        
        if (password.length < this.minLength) {
            errors.push(`Senha deve ter pelo menos ${this.minLength} caracteres`);
        }
        
        if (this.requireUppercase && !/[A-Z]/.test(password)) {
            errors.push('Senha deve conter pelo menos uma letra maiúscula');
        }
        
        if (this.requireLowercase && !/[a-z]/.test(password)) {
            errors.push('Senha deve conter pelo menos uma letra minúscula');
        }
        
        if (this.requireNumbers && !/\d/.test(password)) {
            errors.push('Senha deve conter pelo menos um número');
        }
        
        if (this.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Senha deve conter pelo menos um caractere especial');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            score: this._calculatePasswordScore(password)
        };
    }

    /**
     * Calcula score da senha (0-100)
     */
    _calculatePasswordScore(password) {
        let score = 0;
        
        // Comprimento
        if (password.length >= 8) score += 20;
        if (password.length >= 12) score += 10;
        if (password.length >= 16) score += 10;
        
        // Caracteres
        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 10;
        if (/\d/.test(password)) score += 10;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;
        
        // Diversidade
        const uniqueChars = new Set(password).size;
        if (uniqueChars >= 8) score += 10;
        
        return Math.min(score, 100);
    }

    /**
     * Cria hash seguro da senha
     */
    async createPasswordHash(password) {
        const validation = this.validatePasswordStrength(password);
        if (!validation.isValid) {
            throw new Error('Senha não atende aos critérios de segurança: ' + validation.errors.join(', '));
        }
        
        const salt = await this.crypto.generateSalt();
        const hash = await this.crypto.hashPassword(password, salt);
        
        return { hash, salt };
    }

    /**
     * Verifica senha
     */
    async verifyPassword(password, hash, salt) {
        return await this.crypto.verifyPassword(password, hash, salt);
    }

    /**
     * Gera senha aleatória
     */
    generateRandomPassword(length = 12) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        
        return password;
    }
}

/**
 * Classe para gerenciar sessões seguras
 */
class SessionManager {
    constructor() {
        this.crypto = new CryptoUtils();
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutos
    }

    /**
     * Cria sessão segura
     */
    async createSecureSession(userId, profile) {
        const sessionId = await this.crypto.generateResetToken();
        const sessionData = {
            userId,
            profile,
            sessionId,
            createdAt: Date.now(),
            lastActivityAt: Date.now(),
            ip: await this._getClientIP(),
            userAgent: navigator.userAgent
        };
        
        return sessionData;
    }

    /**
     * Valida sessão
     */
    async validateSession(session) {
        if (!session) return false;
        
        const now = Date.now();
        const isExpired = (now - session.lastActivityAt) > this.sessionTimeout;
        
        if (isExpired) {
            return false;
        }
        
        // Verifica se o user agent mudou (possível roubo de sessão)
        if (session.userAgent !== navigator.userAgent) {
            console.warn('User agent mudou, sessão pode ter sido comprometida');
            return false;
        }
        
        return true;
    }

    /**
     * Atualiza atividade da sessão
     */
    updateSessionActivity(session) {
        if (session) {
            session.lastActivityAt = Date.now();
        }
        return session;
    }

    /**
     * Obtém IP do cliente (simulado)
     */
    async _getClientIP() {
        // Em um ambiente real, isso seria obtido do servidor
        // Por enquanto, retorna um identificador baseado no navegador
        return 'client_' + Math.random().toString(36).substr(2, 9);
    }
}

// Instâncias globais
const cryptoUtils = new CryptoUtils();
const passwordManager = new PasswordManager();
const sessionManager = new SessionManager();

// Exporta para uso global
window.Crypto = {
    cryptoUtils,
    passwordManager,
    sessionManager
};

