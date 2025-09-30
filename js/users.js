/**
 * CRUD de usuários
 * Sistema E2E Commerce
 */

class UserManager {
    constructor() {
        this.storage = window.Storage;
        this.crypto = window.Crypto;
        this.validators = window.Validators;
        this.auth = window.Auth;
    }

    /**
     * Cria um novo usuário
     */
    async createUser(userData) {
        try {
            console.log('🔄 Iniciando criação de usuário:', { name: userData.name, email: userData.email, profile: userData.profile });
            
            // Validação do formulário
            const validation = this.validators.validateUserForm(userData);
            if (!validation.isValid) {
                console.log('❌ Validação falhou:', validation.errors);
                return {
                    success: false,
                    errors: validation.errors
                };
            }

            const { data } = validation;
            console.log('✅ Validação passou, dados:', { name: data.name, email: data.email, profile: data.profile });

            // Verifica se email já existe
            if (this.storage.userStorage.emailExists(data.email)) {
                console.log('❌ Email já existe:', data.email);
                return {
                    success: false,
                    errors: { email: 'Este email já está em uso' }
                };
            }

            // Cria hash da senha
            console.log('🔐 Criando hash da senha...');
            const { hash, salt } = await this.crypto.passwordManager.createPasswordHash(userData.password);
            console.log('✅ Hash criado com sucesso');

            // Cria objeto do usuário
            const user = {
                id: this.crypto.cryptoUtils.generateUserId(),
                name: data.name,
                email: data.email,
                passwordHash: hash,
                salt: salt,
                profile: data.profile,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

            // Adiciona campos opcionais
            if (data.phone) user.phone = data.phone;
            if (data.cpf) user.cpf = data.cpf;

            console.log('💾 Salvando usuário no storage...');
            // Salva usuário
            const success = this.storage.userStorage.addUser(user);
            if (!success) {
                throw new Error('Erro ao salvar usuário');
            }

            console.log('✅ Usuário criado com sucesso:', { id: user.id, name: user.name, profile: user.profile });

            return {
                success: true,
                user: this.getPublicUserData(user),
                message: 'Usuário criado com sucesso'
            };

        } catch (error) {
            console.error('❌ Erro ao criar usuário:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Atualiza um usuário
     */
    async updateUser(userId, userData) {
        try {
            // Verifica permissões
            if (!this.auth.hasPermission('admin') && this.auth.currentUser?.id !== userId) {
                return {
                    success: false,
                    error: 'Sem permissão para editar este usuário'
                };
            }

            // Busca usuário existente
            const existingUser = this.storage.userStorage.getUserById(userId);
            if (!existingUser) {
                return {
                    success: false,
                    error: 'Usuário não encontrado'
                };
            }

            // Validação básica
            const validation = this.validators.validateUserForm({
                ...userData,
                password: userData.password || 'dummy', // Senha opcional na edição
                passwordConfirmation: userData.passwordConfirmation || 'dummy'
            });

            if (!validation.isValid) {
                return {
                    success: false,
                    errors: validation.errors
                };
            }

            const { data } = validation;

            // Verifica se email mudou e se já existe
            if (data.email !== existingUser.email && this.storage.userStorage.emailExists(data.email)) {
                return {
                    success: false,
                    errors: { email: 'Este email já está em uso' }
                };
            }

            // Prepara dados para atualização
            const updateData = {
                name: data.name,
                email: data.email,
                profile: data.profile,
                updatedAt: Date.now()
            };

            // Adiciona campos opcionais se fornecidos
            if (data.phone) updateData.phone = data.phone;
            if (data.cpf) updateData.cpf = data.cpf;

            // Atualiza senha se fornecida
            if (userData.password) {
                const { hash, salt } = await this.crypto.passwordManager.createPasswordHash(userData.password);
                updateData.passwordHash = hash;
                updateData.salt = salt;
            }

            // Salva alterações
            const success = this.storage.userStorage.updateUser(userId, updateData);
            if (!success) {
                throw new Error('Erro ao atualizar usuário');
            }

            // Atualiza usuário atual se for o mesmo
            if (this.auth.currentUser?.id === userId) {
                this.auth.currentUser = { ...this.auth.currentUser, ...updateData };
            }

            return {
                success: true,
                user: this.getPublicUserData({ ...existingUser, ...updateData }),
                message: 'Usuário atualizado com sucesso'
            };

        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Remove um usuário
     */
    deleteUser(userId) {
        try {
            // Verifica permissões
            if (!this.auth.hasPermission('admin')) {
                return {
                    success: false,
                    error: 'Sem permissão para excluir usuários'
                };
            }

            // Não permite excluir a si mesmo
            if (this.auth.currentUser?.id === userId) {
                return {
                    success: false,
                    error: 'Não é possível excluir seu próprio usuário'
                };
            }

            // Verifica se usuário existe
            const user = this.storage.userStorage.getUserById(userId);
            if (!user) {
                return {
                    success: false,
                    error: 'Usuário não encontrado'
                };
            }

            // Remove usuário
            const success = this.storage.userStorage.removeUser(userId);
            if (!success) {
                throw new Error('Erro ao excluir usuário');
            }

            return {
                success: true,
                message: 'Usuário excluído com sucesso'
            };

        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Lista todos os usuários (apenas admin)
     */
    getAllUsers() {
        try {
            if (!this.auth.hasPermission('admin')) {
                return {
                    success: false,
                    error: 'Sem permissão para listar usuários'
                };
            }

            const users = this.storage.userStorage.getUsers();
            const publicUsers = users.map(user => this.getPublicUserData(user));

            return {
                success: true,
                users: publicUsers,
                total: users.length
            };

        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Busca usuário por ID
     */
    getUserById(userId) {
        try {
            // Verifica permissões
            if (!this.auth.hasPermission('admin') && this.auth.currentUser?.id !== userId) {
                return {
                    success: false,
                    error: 'Sem permissão para visualizar este usuário'
                };
            }

            const user = this.storage.userStorage.getUserById(userId);
            if (!user) {
                return {
                    success: false,
                    error: 'Usuário não encontrado'
                };
            }

            return {
                success: true,
                user: this.getPublicUserData(user)
            };

        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Busca usuários por perfil
     */
    getUsersByProfile(profile) {
        try {
            if (!this.auth.hasPermission('admin')) {
                return {
                    success: false,
                    error: 'Sem permissão para filtrar usuários'
                };
            }

            const users = this.storage.userStorage.getUsers();
            const filteredUsers = users.filter(user => user.profile === profile);
            const publicUsers = filteredUsers.map(user => this.getPublicUserData(user));

            return {
                success: true,
                users: publicUsers,
                total: filteredUsers.length
            };

        } catch (error) {
            console.error('Erro ao filtrar usuários:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Busca usuários por nome ou email
     */
    searchUsers(query) {
        try {
            if (!this.auth.hasPermission('admin')) {
                return {
                    success: false,
                    error: 'Sem permissão para buscar usuários'
                };
            }

            if (!query || query.trim().length < 2) {
                return {
                    success: false,
                    error: 'Query deve ter pelo menos 2 caracteres'
                };
            }

            const users = this.storage.userStorage.getUsers();
            const searchTerm = query.toLowerCase().trim();
            
            const filteredUsers = users.filter(user => 
                user.name.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm)
            );

            const publicUsers = filteredUsers.map(user => this.getPublicUserData(user));

            return {
                success: true,
                users: publicUsers,
                total: filteredUsers.length,
                query: searchTerm
            };

        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Obtém estatísticas dos usuários
     */
    getUserStats() {
        try {
            if (!this.auth.hasPermission('admin')) {
                return {
                    success: false,
                    error: 'Sem permissão para visualizar estatísticas'
                };
            }

            const users = this.storage.userStorage.getUsers();
            
            const stats = {
                total: users.length,
                byProfile: {
                    cliente: 0,
                    vendedor: 0,
                    admin: 0
                },
                recent: 0, // últimos 7 dias
                active: 0  // com sessão ativa
            };

            const now = Date.now();
            const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

            users.forEach(user => {
                // Conta por perfil
                stats.byProfile[user.profile]++;

                // Conta usuários recentes
                if (user.createdAt > sevenDaysAgo) {
                    stats.recent++;
                }
            });

            return {
                success: true,
                stats
            };

        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Retorna dados públicos do usuário (sem informações sensíveis)
     */
    getPublicUserData(user) {
        if (!user) return null;

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            profile: user.profile,
            phone: user.phone || null,
            cpf: user.cpf || null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            // Campos calculados
            createdDate: new Date(user.createdAt).toLocaleDateString('pt-BR'),
            updatedDate: new Date(user.updatedAt).toLocaleDateString('pt-BR'),
            profileLabel: this.getProfileLabel(user.profile)
        };
    }

    /**
     * Retorna label do perfil
     */
    getProfileLabel(profile) {
        const labels = {
            cliente: 'Cliente',
            vendedor: 'Vendedor',
            admin: 'Administrador'
        };
        return labels[profile] || profile;
    }

    /**
     * Valida se usuário pode ser editado
     */
    canEditUser(userId) {
        return this.auth.hasPermission('admin') || this.auth.currentUser?.id === userId;
    }

    /**
     * Valida se usuário pode ser excluído
     */
    canDeleteUser(userId) {
        return this.auth.hasPermission('admin') && this.auth.currentUser?.id !== userId;
    }

    /**
     * Exporta dados dos usuários (apenas admin)
     */
    exportUsers(format = 'json') {
        try {
            if (!this.auth.hasPermission('admin')) {
                return {
                    success: false,
                    error: 'Sem permissão para exportar dados'
                };
            }

            const users = this.storage.userStorage.getUsers();
            const publicUsers = users.map(user => this.getPublicUserData(user));

            if (format === 'json') {
                const data = JSON.stringify(publicUsers, null, 2);
                return {
                    success: true,
                    data,
                    filename: `usuarios_${new Date().toISOString().split('T')[0]}.json`
                };
            }

            return {
                success: false,
                error: 'Formato não suportado'
            };

        } catch (error) {
            console.error('Erro ao exportar usuários:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Inicializa dados de exemplo (apenas para desenvolvimento)
     */
    async initializeSampleData() {
        try {
            // Verifica se já existem usuários
            const existingUsers = this.storage.userStorage.getUsers();
            if (existingUsers.length > 0) {
                return {
                    success: false,
                    message: 'Dados já inicializados'
                };
            }

            // Cria usuários de exemplo
            const sampleUsers = [
                {
                    name: 'Administrador Sistema',
                    email: 'admin@e2ecommerce.com',
                    password: 'Admin123!',
                    profile: 'admin'
                },
                {
                    name: 'João Silva',
                    email: 'joao@email.com',
                    password: 'Cliente123!',
                    profile: 'cliente',
                    phone: '11999999999',
                    cpf: '12345678901'
                },
                {
                    name: 'Maria Santos',
                    email: 'maria@email.com',
                    password: 'Vendedor123!',
                    profile: 'vendedor',
                    phone: '11888888888',
                    cpf: '98765432100'
                }
            ];

            console.log('📝 Criando usuários de exemplo:', sampleUsers.map(u => ({ name: u.name, email: u.email, profile: u.profile })));

            const results = [];
            for (const userData of sampleUsers) {
                console.log(`🔄 Criando usuário: ${userData.name} (${userData.profile})`);
                const result = await this.createUser(userData);
                console.log(`✅ Resultado para ${userData.name}:`, result.success ? 'Sucesso' : result.error);
                results.push(result);
            }

            return {
                success: true,
                message: 'Dados de exemplo criados com sucesso',
                results
            };

        } catch (error) {
            console.error('Erro ao inicializar dados de exemplo:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Instância global
const userManager = new UserManager();

// Exporta para uso global
window.UserManager = userManager;
