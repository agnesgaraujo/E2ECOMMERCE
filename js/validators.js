/**
 * Validações de campos e dados
 * Sistema E2E Commerce
 */

class Validators {
    constructor() {
        this.patterns = {
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            phone: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
            cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
            cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
            cep: /^\d{5}-\d{3}$/,
            url: /^https?:\/\/.+/,
            strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        };
    }

    /**
     * Valida email
     */
    validateEmail(email) {
        console.log('🔍 Validando email:', email);
        
        if (!email || typeof email !== 'string') {
            console.log('❌ Email é obrigatório');
            return { isValid: false, message: 'Email é obrigatório' };
        }

        const trimmedEmail = email.trim().toLowerCase();
        
        if (trimmedEmail.length === 0) {
            console.log('❌ Email vazio');
            return { isValid: false, message: 'Email é obrigatório' };
        }

        if (trimmedEmail.length > 254) {
            console.log('❌ Email muito longo');
            return { isValid: false, message: 'Email muito longo' };
        }

        if (!this.patterns.email.test(trimmedEmail)) {
            console.log('❌ Formato de email inválido');
            return { isValid: false, message: 'Formato de email inválido' };
        }

        console.log('✅ Email válido:', trimmedEmail);
        return { isValid: true, message: 'Email válido', value: trimmedEmail };
    }

    /**
     * Valida nome
     */
    validateName(name) {
        console.log('🔍 Validando nome:', name);
        
        if (!name || typeof name !== 'string') {
            console.log('❌ Nome é obrigatório');
            return { isValid: false, message: 'Nome é obrigatório' };
        }

        const trimmedName = name.trim();
        
        if (trimmedName.length === 0) {
            console.log('❌ Nome vazio');
            return { isValid: false, message: 'Nome é obrigatório' };
        }

        if (trimmedName.length < 2) {
            console.log('❌ Nome muito curto');
            return { isValid: false, message: 'Nome deve ter pelo menos 2 caracteres' };
        }

        if (trimmedName.length > 100) {
            console.log('❌ Nome muito longo');
            return { isValid: false, message: 'Nome muito longo' };
        }

        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmedName)) {
            console.log('❌ Nome contém caracteres inválidos');
            return { isValid: false, message: 'Nome deve conter apenas letras e espaços' };
        }

        console.log('✅ Nome válido:', trimmedName);
        return { isValid: true, message: 'Nome válido', value: trimmedName };
    }

    /**
     * Valida senha
     */
    validatePassword(password) {
        console.log('🔍 Validando senha:', password ? '***' : 'undefined');
        
        if (!password || typeof password !== 'string') {
            console.log('❌ Senha é obrigatória');
            return { isValid: false, message: 'Senha é obrigatória' };
        }

        if (password.length < 8) {
            console.log('❌ Senha muito curta');
            return { isValid: false, message: 'Senha deve ter pelo menos 8 caracteres' };
        }

        if (password.length > 128) {
            console.log('❌ Senha muito longa');
            return { isValid: false, message: 'Senha muito longa' };
        }

        if (!/[a-z]/.test(password)) {
            console.log('❌ Senha sem letra minúscula');
            return { isValid: false, message: 'Senha deve conter pelo menos uma letra minúscula' };
        }

        if (!/[A-Z]/.test(password)) {
            console.log('❌ Senha sem letra maiúscula');
            return { isValid: false, message: 'Senha deve conter pelo menos uma letra maiúscula' };
        }

        if (!/\d/.test(password)) {
            console.log('❌ Senha sem número');
            return { isValid: false, message: 'Senha deve conter pelo menos um número' };
        }

        console.log('✅ Senha válida:', password.substring(0, 3) + '***');
        return { isValid: true, message: 'Senha válida' };
    }

    /**
     * Valida confirmação de senha
     */
    validatePasswordConfirmation(password, confirmation) {
        console.log('🔍 Validando confirmação de senha:', { 
            hasPassword: !!password, 
            hasConfirmation: !!confirmation,
            match: password === confirmation 
        });
        
        if (!confirmation || typeof confirmation !== 'string') {
            console.log('❌ Confirmação de senha é obrigatória');
            return { isValid: false, message: 'Confirmação de senha é obrigatória' };
        }

        if (password !== confirmation) {
            console.log('❌ Senhas não coincidem');
            return { isValid: false, message: 'Senhas não coincidem' };
        }

        console.log('✅ Confirmação de senha válida');
        return { isValid: true, message: 'Confirmação válida' };
    }

    /**
     * Valida perfil de usuário
     */
    validateProfile(profile) {
        const validProfiles = ['cliente', 'vendedor', 'admin'];
        
        console.log('🔍 Validando perfil:', { profile, validProfiles });
        
        if (!profile || typeof profile !== 'string') {
            console.log('❌ Perfil é obrigatório');
            return { isValid: false, message: 'Perfil é obrigatório' };
        }

        if (!validProfiles.includes(profile)) {
            console.log('❌ Perfil inválido:', profile);
            return { isValid: false, message: 'Perfil inválido' };
        }

        console.log('✅ Perfil válido:', profile);
        return { isValid: true, message: 'Perfil válido', value: profile };
    }

    /**
     * Valida telefone
     */
    validatePhone(phone) {
        console.log('🔍 Validando telefone:', phone);
        
        if (!phone || typeof phone !== 'string') {
            console.log('❌ Telefone é obrigatório');
            return { isValid: false, message: 'Telefone é obrigatório' };
        }

        const cleanedPhone = phone.replace(/\D/g, '');
        
        if (cleanedPhone.length < 10 || cleanedPhone.length > 11) {
            console.log('❌ Telefone deve ter 10 ou 11 dígitos');
            return { isValid: false, message: 'Telefone deve ter 10 ou 11 dígitos' };
        }

        if (!/^[1-9]\d{9,10}$/.test(cleanedPhone)) {
            console.log('❌ Formato de telefone inválido');
            return { isValid: false, message: 'Formato de telefone inválido' };
        }

        console.log('✅ Telefone válido:', cleanedPhone);
        return { isValid: true, message: 'Telefone válido', value: cleanedPhone };
    }

    /**
     * Valida CPF
     */
    validateCPF(cpf) {
        console.log('🔍 Validando CPF:', cpf);
        
        if (!cpf || typeof cpf !== 'string') {
            console.log('❌ CPF é obrigatório');
            return { isValid: false, message: 'CPF é obrigatório' };
        }

        const cleanedCPF = cpf.replace(/\D/g, '');
        
        if (cleanedCPF.length !== 11) {
            console.log('❌ CPF deve ter 11 dígitos');
            return { isValid: false, message: 'CPF deve ter 11 dígitos' };
        }

        if (/^(\d)\1{10}$/.test(cleanedCPF)) {
            console.log('❌ CPF inválido (todos os dígitos iguais)');
            return { isValid: false, message: 'CPF inválido' };
        }

        // Validação do algoritmo do CPF
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cleanedCPF.charAt(i)) * (10 - i);
        }
        let remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cleanedCPF.charAt(9))) {
            console.log('❌ CPF inválido (primeiro dígito verificador)');
            return { isValid: false, message: 'CPF inválido' };
        }

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cleanedCPF.charAt(i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cleanedCPF.charAt(10))) {
            console.log('❌ CPF inválido (segundo dígito verificador)');
            return { isValid: false, message: 'CPF inválido' };
        }

        console.log('✅ CPF válido:', cleanedCPF);
        return { isValid: true, message: 'CPF válido', value: cleanedCPF };
    }

    /**
     * Valida CNPJ
     */
    validateCNPJ(cnpj) {
        console.log('🔍 Validando CNPJ:', cnpj);
        
        if (!cnpj || typeof cnpj !== 'string') {
            console.log('❌ CNPJ é obrigatório');
            return { isValid: false, message: 'CNPJ é obrigatório' };
        }

        const cleanedCNPJ = cnpj.replace(/\D/g, '');
        
        if (cleanedCNPJ.length !== 14) {
            console.log('❌ CNPJ deve ter 14 dígitos');
            return { isValid: false, message: 'CNPJ deve ter 14 dígitos' };
        }

        if (/^(\d)\1{13}$/.test(cleanedCNPJ)) {
            console.log('❌ CNPJ inválido (todos os dígitos iguais)');
            return { isValid: false, message: 'CNPJ inválido' };
        }

        // Validação do algoritmo do CNPJ
        let sum = 0;
        let weight = 2;
        for (let i = 11; i >= 0; i--) {
            sum += parseInt(cleanedCNPJ.charAt(i)) * weight;
            weight = weight === 9 ? 2 : weight + 1;
        }
        let remainder = sum % 11;
        const firstDigit = remainder < 2 ? 0 : 11 - remainder;
        if (firstDigit !== parseInt(cleanedCNPJ.charAt(12))) {
            console.log('❌ CNPJ inválido (primeiro dígito verificador)');
            return { isValid: false, message: 'CNPJ inválido' };
        }

        sum = 0;
        weight = 2;
        for (let i = 12; i >= 0; i--) {
            sum += parseInt(cleanedCNPJ.charAt(i)) * weight;
            weight = weight === 9 ? 2 : weight + 1;
        }
        remainder = sum % 11;
        const secondDigit = remainder < 2 ? 0 : 11 - remainder;
        if (secondDigit !== parseInt(cleanedCNPJ.charAt(13))) {
            console.log('❌ CNPJ inválido (segundo dígito verificador)');
            return { isValid: false, message: 'CNPJ inválido' };
        }

        console.log('✅ CNPJ válido:', cleanedCNPJ);
        return { isValid: true, message: 'CNPJ válido', value: cleanedCNPJ };
    }

    /**
     * Valida CEP
     */
    validateCEP(cep) {
        console.log('🔍 Validando CEP:', cep);
        
        if (!cep || typeof cep !== 'string') {
            console.log('❌ CEP é obrigatório');
            return { isValid: false, message: 'CEP é obrigatório' };
        }

        const cleanedCEP = cep.replace(/\D/g, '');
        
        if (cleanedCEP.length !== 8) {
            console.log('❌ CEP deve ter 8 dígitos');
            return { isValid: false, message: 'CEP deve ter 8 dígitos' };
        }

        if (!/^\d{8}$/.test(cleanedCEP)) {
            console.log('❌ Formato de CEP inválido');
            return { isValid: false, message: 'Formato de CEP inválido' };
        }

        console.log('✅ CEP válido:', cleanedCEP);
        return { isValid: true, message: 'CEP válido', value: cleanedCEP };
    }

    /**
     * Valida URL
     */
    validateURL(url) {
        console.log('🔍 Validando URL:', url);
        
        if (!url || typeof url !== 'string') {
            console.log('❌ URL é obrigatória');
            return { isValid: false, message: 'URL é obrigatória' };
        }

        if (!this.patterns.url.test(url)) {
            console.log('❌ Formato de URL inválido');
            return { isValid: false, message: 'Formato de URL inválido' };
        }

        console.log('✅ URL válida:', url);
        return { isValid: true, message: 'URL válida', value: url };
    }

    /**
     * Valida idade mínima
     */
    validateAge(birthDate, minAge = 18) {
        console.log('🔍 Validando idade:', { birthDate, minAge });
        
        if (!birthDate) {
            console.log('❌ Data de nascimento é obrigatória');
            return { isValid: false, message: 'Data de nascimento é obrigatória' };
        }

        const birth = new Date(birthDate);
        const today = new Date();
        const age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        if (age < minAge) {
            console.log('❌ Idade mínima não atingida:', { age, minAge });
            return { isValid: false, message: `Idade mínima é ${minAge} anos` };
        }

        if (age > 120) {
            console.log('❌ Data de nascimento inválida (idade muito alta)');
            return { isValid: false, message: 'Data de nascimento inválida' };
        }

        console.log('✅ Idade válida:', { age, minAge });
        return { isValid: true, message: 'Idade válida', value: age };
    }

    /**
     * Valida formulário completo de usuário
     */
    validateUserForm(formData) {
        console.log('🔍 Validando formulário de usuário:', { 
            name: formData.name, 
            email: formData.email, 
            profile: formData.profile,
            hasPassword: !!formData.password 
        });
        
        const errors = {};
        const validatedData = {};

        // Nome
        const nameValidation = this.validateName(formData.name);
        if (!nameValidation.isValid) {
            errors.name = nameValidation.message;
        } else {
            validatedData.name = nameValidation.value;
        }

        // Email
        const emailValidation = this.validateEmail(formData.email);
        if (!emailValidation.isValid) {
            errors.email = emailValidation.message;
        } else {
            validatedData.email = emailValidation.value;
        }

        // Senha (apenas se fornecida)
        if (formData.password) {
            const passwordValidation = this.validatePassword(formData.password);
            if (!passwordValidation.isValid) {
                errors.password = passwordValidation.message;
            }
        }

        // Confirmação de senha (apenas se senha fornecida)
        if (formData.password && formData.passwordConfirmation) {
            const confirmationValidation = this.validatePasswordConfirmation(
                formData.password, 
                formData.passwordConfirmation
            );
            if (!confirmationValidation.isValid) {
                errors.passwordConfirmation = confirmationValidation.message;
            }
        }

        // Perfil
        const profileValidation = this.validateProfile(formData.profile);
        if (!profileValidation.isValid) {
            errors.profile = profileValidation.message;
        } else {
            validatedData.profile = profileValidation.value;
        }

        // Campos opcionais
        if (formData.phone) {
            const phoneValidation = this.validatePhone(formData.phone);
            if (!phoneValidation.isValid) {
                errors.phone = phoneValidation.message;
            } else {
                validatedData.phone = phoneValidation.value;
            }
        }

        if (formData.cpf) {
            const cpfValidation = this.validateCPF(formData.cpf);
            if (!cpfValidation.isValid) {
                errors.cpf = cpfValidation.message;
            } else {
                validatedData.cpf = cpfValidation.value;
            }
        }

        const isValid = Object.keys(errors).length === 0;
        console.log('✅ Validação do formulário:', { 
            isValid, 
            errors: Object.keys(errors), 
            validatedData,
            errorCount: Object.keys(errors).length
        });

        return {
            isValid,
            errors,
            data: validatedData
        };
    }

    /**
     * Sanitiza entrada de texto
     */
    sanitizeText(text) {
        if (typeof text !== 'string') return text;
        
        return text
            .trim()
            .replace(/\s+/g, ' ') // Remove espaços extras
            .replace(/[<>]/g, '') // Remove caracteres perigosos
            .substring(0, 1000); // Limita tamanho
    }

    /**
     * Valida se string não está vazia
     */
    validateRequired(value, fieldName = 'Campo') {
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
            return { isValid: false, message: `${fieldName} é obrigatório` };
        }
        return { isValid: true, message: `${fieldName} válido` };
    }

    /**
     * Valida tamanho de string
     */
    validateLength(value, min = 0, max = Infinity, fieldName = 'Campo') {
        console.log('🔍 Validando tamanho:', { value, min, max, fieldName });
        
        if (typeof value !== 'string') {
            console.log('❌ Valor deve ser texto');
            return { isValid: false, message: `${fieldName} deve ser texto` };
        }

        const length = value.trim().length;
        
        if (length < min) {
            console.log('❌ Valor muito curto:', { length, min });
            return { isValid: false, message: `${fieldName} deve ter pelo menos ${min} caracteres` };
        }
        
        if (length > max) {
            console.log('❌ Valor muito longo:', { length, max });
            return { isValid: false, message: `${fieldName} deve ter no máximo ${max} caracteres` };
        }

        console.log('✅ Tamanho válido:', { length, min, max });
        return { isValid: true, message: `${fieldName} válido` };
    }

    /**
     * Valida se é múltiplo de 10
     */
    isMultipleOf10(value) {
        console.log('🔍 Validando múltiplo de 10:', value);
        
        if (typeof value !== 'number' || isNaN(value)) {
            console.log('❌ Valor deve ser um número');
            return { isValid: false, message: 'Valor deve ser um número' };
        }

        if (value <= 0) {
            console.log('❌ Valor deve ser positivo');
            return { isValid: false, message: 'Valor deve ser positivo' };
        }

        if (value % 10 !== 0) {
            console.log('❌ Valor deve ser múltiplo de 10');
            return { isValid: false, message: 'Valor deve ser múltiplo de 10' };
        }

        console.log('✅ Múltiplo de 10 válido:', value);
        return { isValid: true, message: 'Valor válido', value };
    }

    /**
     * Valida se é não negativo
     */
    isNonNegative(value) {
        console.log('🔍 Validando valor não negativo:', value);
        
        if (typeof value !== 'number' || isNaN(value)) {
            console.log('❌ Valor deve ser um número');
            return { isValid: false, message: 'Valor deve ser um número' };
        }

        if (value < 0) {
            console.log('❌ Valor não pode ser negativo');
            return { isValid: false, message: 'Valor não pode ser negativo' };
        }

        console.log('✅ Valor não negativo válido:', value);
        return { isValid: true, message: 'Valor válido', value };
    }

    /**
     * Valida limite máximo de estoque
     */
    limiteMaximo(value, maxLimit = 1000) {
        console.log('🔍 Validando limite máximo:', { value, maxLimit });
        
        if (typeof value !== 'number' || isNaN(value)) {
            console.log('❌ Valor deve ser um número');
            return { isValid: false, message: 'Valor deve ser um número' };
        }

        if (value > maxLimit) {
            console.log('❌ Valor excede limite máximo:', { value, maxLimit });
            return { isValid: false, message: `Valor não pode exceder ${maxLimit}` };
        }

        console.log('✅ Limite máximo válido:', { value, maxLimit });
        return { isValid: true, message: 'Valor válido', value };
    }

    /**
     * Valida incremento de estoque
     */
    validateStockIncrement(increment, currentStock = 0, maxStock = 1000) {
        console.log('🔍 Validando incremento de estoque:', { increment, currentStock, maxStock });
        
        // Valida se é múltiplo de 10
        const multipleValidation = this.isMultipleOf10(increment);
        if (!multipleValidation.isValid) {
            return multipleValidation;
        }

        // Valida se é não negativo
        const nonNegativeValidation = this.isNonNegative(increment);
        if (!nonNegativeValidation.isValid) {
            return nonNegativeValidation;
        }

        // Valida se não excede limite máximo
        const newStock = currentStock + increment;
        const limitValidation = this.limiteMaximo(newStock, maxStock);
        if (!limitValidation.isValid) {
            return {
                isValid: false,
                message: `Incremento resultaria em estoque de ${newStock}, excedendo o limite de ${maxStock}`
            };
        }

        // Valida incremento mínimo
        if (increment < 10) {
            console.log('❌ Incremento mínimo é 10');
            return { isValid: false, message: 'Incremento mínimo é 10 unidades' };
        }

        console.log('✅ Incremento de estoque válido:', { increment, currentStock, newStock });
        return { 
            isValid: true, 
            message: 'Incremento válido', 
            value: increment,
            newStock
        };
    }

    /**
     * Valida categoria de produto
     */
    validateProductCategory(category) {
        console.log('🔍 Validando categoria de produto:', category);
        
        if (!category || typeof category !== 'string') {
            console.log('❌ Categoria é obrigatória');
            return { isValid: false, message: 'Categoria é obrigatória' };
        }

        const validCategories = Object.keys(window.CONFIG?.categories || {});
        
        if (!validCategories.includes(category)) {
            console.log('❌ Categoria inválida:', { category, validCategories });
            return { isValid: false, message: 'Categoria inválida' };
        }

        console.log('✅ Categoria válida:', category);
        return { isValid: true, message: 'Categoria válida', value: category };
    }

    /**
     * Valida preço de produto
     */
    validateProductPrice(price) {
        console.log('🔍 Validando preço de produto:', price);
        
        if (typeof price !== 'number' || isNaN(price)) {
            console.log('❌ Preço deve ser um número');
            return { isValid: false, message: 'Preço deve ser um número' };
        }

        if (price <= 0) {
            console.log('❌ Preço deve ser positivo');
            return { isValid: false, message: 'Preço deve ser positivo' };
        }

        if (price > 999999.99) {
            console.log('❌ Preço muito alto');
            return { isValid: false, message: 'Preço muito alto' };
        }

        console.log('✅ Preço válido:', price);
        return { isValid: true, message: 'Preço válido', value: price };
    }
}

// Instância global
const validators = new Validators();

// Exporta para uso global
window.Validators = validators;
