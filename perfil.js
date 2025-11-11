document.addEventListener('DOMContentLoaded', () => {

    // Chave do LocalStorage
    const PROFILE_KEY = 'trainerProfileDB';

    // Imagem padrão
    const DEFAULT_SPRITE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';

    // --- Seletores do DOM (Display) ---
    const displaySection = document.getElementById('profile-display-section');
    const spriteDisplay = document.getElementById('profile-sprite-display');
    const nameDisplay = document.getElementById('trainer-name-display');
    const typesDisplay = document.getElementById('types-display');
    const badgesDisplay = document.getElementById('badges-display');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const gotoTeamBuilderBtn = document.getElementById('goto-team-builder-btn');

    // --- Seletores do DOM (Edit Form) ---
    const editSection = document.getElementById('profile-edit-section');
    const editForm = document.getElementById('profile-edit-form');
    const nameInput = document.getElementById('trainer-name-input');
    const spriteInput = document.getElementById('sprite-url-input');
    const typesSelect = document.getElementById('types-select');
    const badgesSelect = document.getElementById('badges-select');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const statusMessage = document.getElementById('edit-status-message');
    
    // --- Objeto de Perfil Padrão ---
    let currentProfile = {
        name: 'Novo Treinador',
        sprite: DEFAULT_SPRITE,
        types: [],
        badges: []
    };

    // --- Funções ---

    // 1. Carregar perfil do LocalStorage
    function loadProfile() {
        const savedProfile = localStorage.getItem(PROFILE_KEY);
        if (savedProfile) {
            currentProfile = JSON.parse(savedProfile);
        }
        renderProfileDisplay();
    }

    // 2. Salvar perfil no LocalStorage
    function saveProfile() {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(currentProfile));
    }

    // 3. Renderizar (mostrar) os dados do perfil na tela
    function renderProfileDisplay() {
        // Valida Nome e Sprite
        nameDisplay.textContent = currentProfile.name || 'Novo Treinador';
        spriteDisplay.src = currentProfile.sprite || DEFAULT_SPRITE;
        // Trata erro de imagem
        spriteDisplay.onerror = () => { spriteDisplay.src = DEFAULT_SPRITE; };

        // Renderiza Tags de Tipo
        renderTags(typesDisplay, currentProfile.types, 'Nenhum tipo favorito');
        
        // Renderiza Tags de Insígnia
        renderTags(badgesDisplay, currentProfile.badges, 'Nenhuma insígnia');
    }

    // Função auxiliar para criar as tags
    function renderTags(container, items, emptyMessage) {
        container.innerHTML = ''; // Limpa container
        if (!items || items.length === 0) {
            container.innerHTML = `<span class="tag-item">${emptyMessage}</span>`;
            return;
        }
        items.forEach(item => {
            const tag = document.createElement('span');
            tag.className = 'tag-item';
            tag.textContent = item;
            container.appendChild(tag);
        });
    }

    // 4. Preencher o formulário de edição com dados atuais
    function populateEditForm() {
        nameInput.value = currentProfile.name;
        spriteInput.value = currentProfile.sprite;
        
        // Seleciona as opções nos <select multiple>
        setSelectedOptions(typesSelect, currentProfile.types);
        setSelectedOptions(badgesSelect, currentProfile.badges);
    }
    
    // Função auxiliar para marcar opções no <select multiple>
    function setSelectedOptions(selectElement, values) {
        for (const option of selectElement.options) {
            option.selected = values.includes(option.value);
        }
    }
    
    // Função auxiliar para ler opções do <select multiple>
    function getSelectedOptions(selectElement) {
        const values = [];
        for (const option of selectElement.selectedOptions) {
            values.push(option.value);
        }
        return values;
    }

    // 5. Trocar entre visualização e edição
    function toggleEditMode(showEdit) {
        if (showEdit) {
            displaySection.style.display = 'none';
            editSection.style.display = 'block';
            populateEditForm();
        } else {
            displaySection.style.display = 'block';
            editSection.style.display = 'none';
        }
    }
    
    // --- Event Listeners ---

    // Botão "Editar Perfil"
    editProfileBtn.addEventListener('click', () => {
        toggleEditMode(true);
    });

    // Botão "Cancelar Edição"
    cancelEditBtn.addEventListener('click', () => {
        toggleEditMode(false);
    });

    // Botão "Ir para o Montador" (Link)
    gotoTeamBuilderBtn.addEventListener('click', () => {
        // Assumindo que seu montador está no 'index.html'
        window.location.href = 'index.html'; 
    });

    // Botão "Salvar Alterações" (Submit do formulário)
    editForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        // Atualiza o objeto currentProfile com os novos dados
        currentProfile.name = nameInput.value.trim();
        currentProfile.sprite = spriteInput.value.trim();
        currentProfile.types = getSelectedOptions(typesSelect);
        currentProfile.badges = getSelectedOptions(badgesSelect);
        
        // Salva no LocalStorage
        saveProfile();
        
        // Atualiza a visualização
        renderProfileDisplay();
        
        // Mostra mensagem de sucesso
        statusMessage.textContent = 'Perfil salvo com sucesso!';
        statusMessage.style.color = 'var(--cor-principal)';
        setTimeout(() => {
            statusMessage.textContent = '';
            toggleEditMode(false); // Volta para a tela de visualização
        }, 1500);
    });

    // --- Inicialização ---
    loadProfile();
});