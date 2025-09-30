/**
 * Componentes de interface do usuário
 * Sistema E2E Commerce
 */

class UIManager {
    constructor() {
        this.toastContainer = null;
        this.modalContainer = null;
        this.init();
    }

    /**
     * Inicializa o UI Manager
     */
    init() {
        this.toastContainer = document.getElementById('toastContainer');
        this.modalContainer = document.getElementById('modalContainer');
    }

    /**
     * Mostra toast de notificação
     */
    showToast(title, message, type = 'info', duration = 5000) {
        if (!this.toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type} fade-in`;
        
        const icon = this.getToastIcon(type);
        
        toast.innerHTML = `
            <div class="toast-icon">
                ${icon}
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <svg class="icon" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        `;

        this.toastContainer.appendChild(toast);

        // Remove automaticamente após a duração
        if (duration > 0) {
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, duration);
        }

        return toast;
    }

    /**
     * Obtém ícone do toast baseado no tipo
     */
    getToastIcon(type) {
        const icons = {
            success: `<svg class="icon" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>`,
            error: `<svg class="icon" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>`,
            warning: `<svg class="icon" viewBox="0 0 24 24">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>`,
            info: `<svg class="icon" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>`
        };
        return icons[type] || icons.info;
    }

    /**
     * Mostra modal
     */
    showModal(options) {
        if (!this.modalContainer) return;

        const modal = document.createElement('div');
        modal.className = 'modal fade-in';
        
        const {
            title = 'Modal',
            content = '',
            size = 'md',
            closable = true,
            onClose = null,
            buttons = []
        } = options;

        const sizeClass = size === 'sm' ? 'modal-sm' : size === 'lg' ? 'modal-lg' : '';
        
        modal.innerHTML = `
            <div class="modal-dialog ${sizeClass}">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    ${closable ? '<button class="modal-close" onclick="window.UI.closeModal(this.closest(\'.modal\'))">&times;</button>' : ''}
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${buttons.length > 0 ? `
                    <div class="modal-footer">
                        ${buttons.map(btn => `
                            <button class="btn ${btn.class || 'btn-secondary'}" 
                                    onclick="${btn.onclick || 'window.UI.closeModal(this.closest(\'.modal\'))'}">
                                ${btn.text}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        // Fecha modal ao clicar fora
        if (closable) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        }

        this.modalContainer.appendChild(modal);
        
        // Foca no primeiro input
        const firstInput = modal.querySelector('input, textarea, select');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }

        // Callback de fechamento
        modal._onClose = onClose;

        return modal;
    }

    /**
     * Fecha modal
     */
    closeModal(modal) {
        if (!modal) return;

        if (modal._onClose) {
            modal._onClose();
        }

        modal.remove();
    }

    /**
     * Mostra modal de confirmação
     */
    showConfirmModal(title, message, onConfirm, onCancel = null) {
        return this.showModal({
            title,
            content: `<p>${message}</p>`,
            buttons: [
                {
                    text: 'Cancelar',
                    class: 'btn-secondary',
                    onclick: 'window.UI.closeModal(this.closest(\'.modal\'))'
                },
                {
                    text: 'Confirmar',
                    class: 'btn-danger',
                    onclick: `window.UI.closeModal(this.closest('.modal')); (${onConfirm.toString()})()`
                }
            ]
        });
    }

    /**
     * Mostra modal de formulário
     */
    showFormModal(title, formHTML, onSubmit, onCancel = null) {
        const modal = this.showModal({
            title,
            content: formHTML,
            buttons: [
                {
                    text: 'Cancelar',
                    class: 'btn-secondary',
                    onclick: 'window.UI.closeModal(this.closest(\'.modal\'))'
                },
                {
                    text: 'Salvar',
                    class: 'btn-primary',
                    onclick: `window.UI.handleFormSubmit(this.closest('.modal'), ${onSubmit.toString()})`
                }
            ]
        });

        return modal;
    }

    /**
     * Manipula envio de formulário no modal
     */
    handleFormSubmit(modal, onSubmit) {
        const form = modal.querySelector('form');
        if (!form) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        onSubmit(data, modal);
    }

    /**
     * Mostra loading
     */
    showLoading(element, text = 'Carregando...') {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return;

        element.classList.add('loading');
        element.setAttribute('data-loading-text', text);
        
        // Adiciona texto de loading se não existir
        if (!element.querySelector('.loading-text')) {
            const loadingText = document.createElement('div');
            loadingText.className = 'loading-text';
            loadingText.textContent = text;
            element.appendChild(loadingText);
        }
    }

    /**
     * Esconde loading
     */
    hideLoading(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return;

        element.classList.remove('loading');
        const loadingText = element.querySelector('.loading-text');
        if (loadingText) {
            loadingText.remove();
        }
    }

    /**
     * Mostra alerta
     */
    showAlert(message, type = 'info', dismissible = true) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} ${dismissible ? 'alert-dismissible' : ''}`;
        
        alert.innerHTML = `
            ${dismissible ? '<button class="alert-close" onclick="this.parentElement.remove()">&times;</button>' : ''}
            ${message}
        `;

        // Adiciona ao container de alertas ou cria um novo
        let alertContainer = document.getElementById('alertContainer');
        if (!alertContainer) {
            alertContainer = document.createElement('div');
            alertContainer.id = 'alertContainer';
            alertContainer.className = 'alert-container';
            document.body.appendChild(alertContainer);
        }

        alertContainer.appendChild(alert);

        return alert;
    }

    /**
     * Cria tabela
     */
    createTable(data, columns, options = {}) {
        const {
            striped = true,
            hover = true,
            bordered = false,
            responsive = true,
            emptyMessage = 'Nenhum dado encontrado'
        } = options;

        if (!data || data.length === 0) {
            return `<div class="table-empty">
                <p>${emptyMessage}</p>
            </div>`;
        }

        let tableHTML = '<table class="table';
        if (striped) tableHTML += ' table-striped';
        if (hover) tableHTML += ' table-hover';
        if (bordered) tableHTML += ' table-bordered';
        tableHTML += '">';

        // Cabeçalho
        tableHTML += '<thead><tr>';
        columns.forEach(col => {
            tableHTML += `<th>${col.title}</th>`;
        });
        tableHTML += '</tr></thead>';

        // Corpo
        tableHTML += '<tbody>';
        data.forEach((row, index) => {
            tableHTML += '<tr>';
            columns.forEach(col => {
                const value = col.render ? col.render(row[col.key], row, index) : row[col.key] || '';
                tableHTML += `<td>${value}</td>`;
            });
            tableHTML += '</tr>';
        });
        tableHTML += '</tbody></table>';

        if (responsive) {
            tableHTML = `<div class="table-responsive">${tableHTML}</div>`;
        }

        return tableHTML;
    }

    /**
     * Cria formulário
     */
    createForm(fields, options = {}) {
        const {
            method = 'POST',
            action = '',
            id = 'form',
            className = '',
            submitText = 'Salvar'
        } = options;

        let formHTML = `<form method="${method}" action="${action}" id="${id}" class="${className}">`;
        
        fields.forEach(field => {
            formHTML += this.createFormField(field);
        });

        formHTML += `
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">${submitText}</button>
            </div>
        </form>`;

        return formHTML;
    }

    /**
     * Cria campo de formulário
     */
    createFormField(field) {
        const {
            type = 'text',
            name,
            label,
            value = '',
            placeholder = '',
            required = false,
            disabled = false,
            options = [], // Para select
            rows = 3, // Para textarea
            help = '',
            error = ''
        } = field;

        let fieldHTML = '<div class="form-group">';
        
        if (label) {
            fieldHTML += `<label for="${name}" class="form-label">${label}${required ? ' *' : ''}</label>`;
        }

        switch (type) {
            case 'select':
                fieldHTML += `<select name="${name}" id="${name}" class="form-control" ${required ? 'required' : ''} ${disabled ? 'disabled' : ''}>`;
                if (placeholder) {
                    fieldHTML += `<option value="">${placeholder}</option>`;
                }
                options.forEach(option => {
                    const isSelected = option.value === value ? 'selected' : '';
                    fieldHTML += `<option value="${option.value}" ${isSelected}>${option.label}</option>`;
                });
                fieldHTML += '</select>';
                break;

            case 'textarea':
                fieldHTML += `<textarea name="${name}" id="${name}" class="form-control" rows="${rows}" placeholder="${placeholder}" ${required ? 'required' : ''} ${disabled ? 'disabled' : ''}>${value}</textarea>`;
                break;

            case 'checkbox':
                fieldHTML += `<div class="form-check">
                    <input type="checkbox" name="${name}" id="${name}" class="form-check-input" value="1" ${value ? 'checked' : ''} ${required ? 'required' : ''} ${disabled ? 'disabled' : ''}>
                    <label for="${name}" class="form-check-label">${label}</label>
                </div>`;
                break;

            case 'radio':
                fieldHTML += '<div class="form-radio-group">';
                options.forEach(option => {
                    const isChecked = option.value === value ? 'checked' : '';
                    fieldHTML += `<div class="form-check">
                        <input type="radio" name="${name}" id="${name}_${option.value}" class="form-check-input" value="${option.value}" ${isChecked} ${required ? 'required' : ''} ${disabled ? 'disabled' : ''}>
                        <label for="${name}_${option.value}" class="form-check-label">${option.label}</label>
                    </div>`;
                });
                fieldHTML += '</div>';
                break;

            default:
                fieldHTML += `<input type="${type}" name="${name}" id="${name}" class="form-control" value="${value}" placeholder="${placeholder}" ${required ? 'required' : ''} ${disabled ? 'disabled' : ''}>`;
        }

        if (help) {
            fieldHTML += `<div class="form-text">${help}</div>`;
        }

        if (error) {
            fieldHTML += `<div class="form-error">${error}</div>`;
        }

        fieldHTML += '</div>';

        return fieldHTML;
    }

    /**
     * Cria card
     */
    createCard(title, content, options = {}) {
        const {
            subtitle = '',
            footer = '',
            className = '',
            headerActions = ''
        } = options;

        return `
            <div class="card ${className}">
                ${title ? `
                    <div class="card-header">
                        <div class="card-title-group">
                            <h3 class="card-title">${title}</h3>
                            ${subtitle ? `<p class="card-subtitle">${subtitle}</p>` : ''}
                        </div>
                        ${headerActions ? `<div class="card-actions">${headerActions}</div>` : ''}
                    </div>
                ` : ''}
                <div class="card-body">
                    ${content}
                </div>
                ${footer ? `<div class="card-footer">${footer}</div>` : ''}
            </div>
        `;
    }

    /**
     * Cria badge
     */
    createBadge(text, type = 'secondary', size = '') {
        const sizeClass = size ? `badge-${size}` : '';
        return `<span class="badge badge-${type} ${sizeClass}">${text}</span>`;
    }

    /**
     * Cria botão
     */
    createButton(text, options = {}) {
        const {
            type = 'button',
            variant = 'primary',
            size = '',
            disabled = false,
            icon = '',
            onclick = '',
            className = ''
        } = options;

        const sizeClass = size ? `btn-${size}` : '';
        const iconHTML = icon ? `<svg class="icon icon-sm" viewBox="0 0 24 24">${icon}</svg>` : '';

        return `<button type="${type}" class="btn btn-${variant} ${sizeClass} ${className}" ${disabled ? 'disabled' : ''} ${onclick ? `onclick="${onclick}"` : ''}>
            ${iconHTML}${text}
        </button>`;
    }

    /**
     * Anima elemento
     */
    animate(element, animation, duration = 300) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return;

        element.style.animationDuration = `${duration}ms`;
        element.classList.add(animation);

        setTimeout(() => {
            element.classList.remove(animation);
        }, duration);
    }

    /**
     * Scroll suave para elemento
     */
    scrollTo(element, offset = 0) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return;

        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Copia texto para clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copiado!', 'Texto copiado para a área de transferência', 'success', 2000);
            return true;
        } catch (error) {
            console.error('Erro ao copiar:', error);
            this.showToast('Erro', 'Não foi possível copiar o texto', 'error');
            return false;
        }
    }

    /**
     * Formata data
     */
    formatDate(date, options = {}) {
        const {
            locale = 'pt-BR',
            format = 'short'
        } = options;

        if (!date) return '';
        
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return '';

        return dateObj.toLocaleDateString(locale, {
            year: 'numeric',
            month: format === 'short' ? '2-digit' : 'long',
            day: '2-digit'
        });
    }

    /**
     * Formata moeda
     */
    formatCurrency(value, currency = 'BRL') {
        if (value === null || value === undefined) return '';
        
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency
        }).format(value);
    }
}

// Instância global
const ui = new UIManager();

// Exporta para uso global
window.UI = ui;

