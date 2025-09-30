# E2E Commerce - Sistema de Gestão de Usuários

Sistema completo de gestão de usuários para e-commerce, desenvolvido com HTML, CSS e JavaScript puro (sem frameworks).

## 🚀 Características

- **Autenticação Segura**: Sistema de login com hash de senhas e salt
- **Gestão de Usuários**: CRUD completo com diferentes perfis (Cliente, Vendedor, Admin)
- **Interface Responsiva**: Design moderno inspirado no Mercado Livre
- **Persistência Local**: Dados salvos em localStorage/sessionStorage
- **Roteamento**: Sistema de navegação baseado em hash
- **Validações**: Validação completa de formulários e dados
- **Segurança**: Criptografia de senhas, sanitização de inputs, controle de sessão

## 🎨 Identidade Visual

- **Cores Base**: Amarelo primário (#FFF159), Azul ação (#3483FA)
- **Tipografia**: Stack do sistema (system-ui, -apple-system, Segoe UI, Roboto)
- **Design**: Clean, espaçamento generoso, microinterações suaves

## 📁 Estrutura do Projeto

```
/e2e-commerce
├── index.html              # Página principal
├── README.md              # Documentação
├── /assets
│   └── logo.svg           # Logo do sistema
├── /css
│   ├── base.css           # Reset e estilos base
│   ├── layout.css         # Layout e grid
│   ├── components.css     # Componentes UI
│   └── theme.css          # Tema e variáveis CSS
└── /js
    ├── app.js             # Aplicação principal
    ├── router.js          # Sistema de roteamento
    ├── storage.js         # Gerenciamento de dados
    ├── crypto.js          # Criptografia e segurança
    ├── validators.js      # Validações de formulário
    ├── auth.js            # Sistema de autenticação
    ├── users.js           # CRUD de usuários
    ├── ui.js              # Componentes de interface
    └── /pages
        ├── login.js       # Página de login
        ├── register.js    # Página de cadastro
        ├── dashboardCliente.js    # Dashboard do cliente
        ├── dashboardVendedor.js   # Dashboard do vendedor
        ├── admin.js       # Painel administrativo
        ├── perfil.js      # Página de perfil
        └── notFound.js    # Página 404
```

## 🔐 Perfis de Usuário

### Cliente
- Visualizar e editar perfil pessoal
- Alterar senha
- Acompanhar atividades da conta

### Vendedor
- Todas as funcionalidades do cliente
- Gerenciar produtos (em desenvolvimento)
- Visualizar vendas (em desenvolvimento)

### Administrador
- Todas as funcionalidades anteriores
- Gerenciar todos os usuários
- Visualizar estatísticas do sistema
- Exportar/importar dados
- Configurações do sistema

## 🛠️ Funcionalidades

### Autenticação
- ✅ Login seguro com validação
- ✅ Cadastro de novos usuários
- ✅ Logout automático por inatividade
- ✅ Controle de sessão
- ✅ Alteração de senha

### Gestão de Usuários
- ✅ Listar usuários (admin)
- ✅ Criar usuários (admin)
- ✅ Editar usuários
- ✅ Excluir usuários (admin)
- ✅ Buscar usuários
- ✅ Filtrar por perfil
- ✅ Estatísticas de usuários

### Interface
- ✅ Design responsivo
- ✅ Navegação intuitiva
- ✅ Modais e notificações
- ✅ Validação em tempo real
- ✅ Estados de loading
- ✅ Feedback visual

### Segurança
- ✅ Hash de senhas com salt
- ✅ Sanitização de inputs
- ✅ Validação de dados
- ✅ Controle de permissões
- ✅ Sessões seguras

## 🚀 Como Usar

1. **Abrir o sistema**: Abra o arquivo `index.html` em um navegador
2. **Primeira execução**: O sistema perguntará se deseja inicializar com dados de exemplo
3. **Login**: Use as credenciais dos usuários de exemplo ou crie uma nova conta

### Usuários de Exemplo

Após inicializar com dados de exemplo, você terá:

- **Admin**: `admin@e2ecommerce.com` / `Admin123!`
- **Cliente**: `joao@email.com` / `Cliente123!`
- **Vendedor**: `maria@email.com` / `Vendedor123!`

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com variáveis CSS
- **JavaScript ES6+**: Lógica da aplicação
- **Web Crypto API**: Criptografia de senhas
- **localStorage/sessionStorage**: Persistência de dados

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 📱 Dispositivos móveis (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1200px+)

## 🔒 Segurança

- **Senhas**: Hash SHA-256 com salt aleatório
- **Sessões**: Controle de expiração e renovação
- **Validação**: Sanitização de todos os inputs
- **Permissões**: Controle granular de acesso
- **Dados**: Criptografia de informações sensíveis

## 🎯 Próximas Funcionalidades

- [ ] Sistema de produtos
- [ ] Carrinho de compras
- [ ] Processo de checkout
- [ ] Sistema de pagamentos
- [ ] Notificações em tempo real
- [ ] Relatórios avançados
- [ ] API REST
- [ ] Integração com banco de dados

## 📄 Licença

Este projeto é um exemplo educacional e pode ser usado livremente para fins de aprendizado e desenvolvimento.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Adicionar novas funcionalidades
- Melhorar a documentação

---

**E2E Commerce** - Sistema de Gestão de Usuários v1.0.0

