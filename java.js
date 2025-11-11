// =================================================================
// FUNÇÕES AUXILIARES DE LOCALSTORAGE
// =================================================================

/**
 * Obtém o array de usuários do localStorage. Se não existir, retorna um array vazio.
 * @returns {Array<Object>} Lista de objetos de usuário.
 */
function getUsuarios() {
    const usuariosJSON = localStorage.getItem("usuarios");
    return usuariosJSON ? JSON.parse(usuariosJSON) : [];
}

/**
 * Salva o array de usuários no localStorage.
 * @param {Array<Object>} usuarios Lista de objetos de usuário a ser salva.
 */
function setUsuarios(usuarios) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// =================================================================
// FUNÇÕES DE INTERFACE (AS SUAS FUNÇÕES ORIGINAIS AJUSTADAS)
// =================================================================

/**
 * Alterna a visibilidade do campo de senha.
 * @param {string} id O ID do campo de input (ex: 'senha', 'senhaCadastro').
 */
function togglePassword(id) { 
    const input = document.getElementById(id);
    const span = document.querySelector(`#${id} + .toggle-password`);

    if (input.type === "password") {
        input.type = "text";
        // Altera o ícone para "olho aberto" ou cadeado aberto
        if (span) span.textContent = '👁️'; 
    } else {
        input.type = "password";
        // Altera o ícone para "olho fechado" ou cadeado fechado
        if (span) span.textContent = '🔒'; 
    }
}

/**
 * Função de validação de senhas (mantida, mas integrada em cadastrarUsuario para eficácia).
 * @param {string} senhaId ID do campo de senha.
 * @param {string} confirmaId ID do campo de confirmação de senha.
 * @returns {boolean} Retorna true se as senhas coincidirem.
 */
function validarSenhas(senhaId, confirmaId) { 
    const senha = document.getElementById(senhaId).value;
    const confirma = document.getElementById(confirmaId).value;
    if (senha !== confirma) {
        alert("As senhas não coincidem!");
        return false;
    }
    return true; 
}

/**
 * Simula o envio de link de recuperação (obsoleta após implementação de recuperarSenha).
 * Função mantida do seu código original, mas não usada se 'recuperarSenha' for chamada.
 * @returns {boolean} Sempre retorna false para evitar submit.
 */
function simularEnvio() { 
    const email = document.getElementById("emailRecuperacao").value; // Usando o ID ajustado
    alert(`Um link de recuperação foi enviado para ${email} (simulação).`);
    return false;
}

// =================================================================
// FUNÇÕES PRINCIPAIS DE AUTENTICAÇÃO (USANDO LOCALSTORAGE)
// =================================================================

/**
 * Função de LOGIN. Verifica credenciais no localStorage.
 * Usa os IDs: "email" e "senha" (do seu login.html).
 * @param {Event} event Evento de submissão do formulário.
 * @returns {boolean} Indica sucesso ou falha no login.
 */
// Trecho relevante do script.js
// script.js
function logarUsuario(event) {
    // ⭐ Impede que o formulário recarregue/redirecione
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    // Recupera os usuários cadastrados do localStorage
    const UsuariosJSON = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verifica se existe um usuário com e-mail e senha correspondentes
    const usuarioLogado = UsuariosJSON.find(usuario => usuario.email === email && usuario.senha === senha);

    if (usuarioLogado) {
        // ✅ Redireciona após login bem-sucedido
        localStorage.setItem("usuarioLogado", email);
        alert(`🎉 Login bem-sucedido! Bem-vindo(a), ${email}.`);
        window.location.href = 'index.html';
        return true;
    } else {
        alert("❌ E-mail ou senha inválidos. Tente se cadastrar primeiro.");
        return false;
    }
}

/**
 * Função de CADASTRO. Salva novo usuário no localStorage.
 * Usa os IDs: "emailCadastro", "senhaCadastro" e "confirmaSenha" (conforme seu cadastro.html ajustado).
 * @param {Event} event Evento de submissão do formulário.
 * @returns {boolean} Indica sucesso ou falha no cadastro.
 */
function cadastrarUsuario(event) {
    event.preventDefault(); 
    
    // IDs: "emailCadastro", "senhaCadastro" e "confirmaSenha" (conforme HTML de cadastro)
    const email = document.getElementById("emailCadastro").value; 
    const senha = document.getElementById("senhaCadastro").value;
    const confirma = document.getElementById("confirmaSenha").value;
    // O campo 'nome' não é obrigatório para a autenticação, mas pode ser capturado.
    // const nome = document.getElementById("nome").value; 

    if (!email || !senha || !confirma) {
        alert("Todos os campos obrigatórios (E-mail, Senha e Confirmação) devem ser preenchidos!");
        return false;
    }

    if (senha !== confirma) {
        alert("As senhas não coincidem!");
        return false;
    }

    const usuarios = getUsuarios();

    // Verifica se o e-mail já existe
    if (usuarios.some(u => u.email === email)) {
        alert("Erro: Este e-mail já está cadastrado.");
        return false;
    }

    // Cria o novo usuário
    const novoUsuario = {
        email: email,
        senha: senha, // Lembre-se: em produção, use hashing!
        // nome: nome // Opcional
    };

    usuarios.push(novoUsuario);
    setUsuarios(usuarios);

    alert("✅ Cadastro realizado com sucesso! Você será redirecionado para o Login.");
    window.location.href = 'login.html'; 
    return true; 
}

/**
 * Função de RECUPERAÇÃO DE SENHA. Simula o processo checando a existência do e-mail no localStorage.
 * Usa o ID: "emailRecuperacao" (conforme seu recuperar-senha.html ajustado).
 * @param {Event} event Evento de submissão do formulário.
 * @returns {boolean} Sempre retorna false para evitar submit.
 */
function recuperarSenha(event) {
    event.preventDefault(); 

    // ID: "emailRecuperacao" (conforme HTML de recuperação)
    const email = document.getElementById("emailRecuperacao").value;

    if (!email) {
        alert("Por favor, informe o e-mail para recuperação.");
        return false;
    }

    const usuarios = getUsuarios();
    const usuario = usuarios.find(u => u.email === email);

    if (usuario) {
        // Simulação de envio - Mostra a senha (apenas para teste/simulação)
        alert(`Um link de redefinição de senha foi enviado para ${email}. Senha de teste: ${usuario.senha}`);
    } else {
        alert("Nenhum usuário encontrado com este e-mail.");
    }
    return false;
}