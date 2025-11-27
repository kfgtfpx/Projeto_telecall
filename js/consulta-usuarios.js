let usuarioParaExcluir = null;

document.addEventListener("DOMContentLoaded", function() {
    // Verificar se é usuário master
    const perfilId = localStorage.getItem('perfil_id');
    if (perfilId !== '1') {
        alert('Acesso restrito para usuários Master.');
        window.location.href = 'home-logado.html';
        return;
    }

    carregarUsuarios();
    
    // Configurar modal de confirmação
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.addEventListener('click', excluirUsuario);
});

function carregarUsuarios() {
    const busca = document.getElementById('searchInput').value;
    
    showLoading(true);
    
    let url = 'backend/buscar_usuarios.php';
    if (busca) {
        url += `?busca=${encodeURIComponent(busca)}`;
    }
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                renderizarUsuarios(data.usuarios);
                atualizarEstatisticas(data.usuarios);
            } else {
                throw new Error(data.message || 'Erro ao carregar usuários');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            mostrarMensagem('Erro ao carregar usuários: ' + error.message, 'error');
            showLoading(false);
        });
}

function renderizarUsuarios(usuarios) {
    const tbody = document.getElementById('usuariosBody');
    const noUsersMessage = document.getElementById('noUsersMessage');
    const table = document.getElementById('usuariosTable');
    
    showLoading(false);
    
    if (!usuarios || usuarios.length === 0) {
        tbody.innerHTML = '';
        noUsersMessage.style.display = 'block';
        table.style.display = 'none';
        return;
    }
    
    noUsersMessage.style.display = 'none';
    table.style.display = 'table';
    
    tbody.innerHTML = usuarios.map(usuario => `
        <tr>
            <td>${usuario.id_usuario}</td>
            <td>${usuario.nome_completo}</td>
            <td>${usuario.login}</td>
            <td>${usuario.email}</td>
            <td>${formatarCPF(usuario.cpf)}</td>
            <td>
                <span class="badge ${usuario.perfil_id == 1 ? 'badge-master' : 'badge-comum'}">
                    ${usuario.nome_perfil}
                </span>
            </td>
            <td>
                ${usuario.perfil_id == 1 ? 
                    '<span class="text-muted">-</span>' : 
                    `<button class="btn btn-danger btn-sm" onclick="confirmarExclusao(${usuario.id_usuario}, '${usuario.nome_completo.replace(/'/g, "\\'")}')">
                        <i class="bi bi-trash"></i> Excluir
                    </button>`
                }
            </td>
        </tr>
    `).join('');
}

function formatarCPF(cpf) {
    if (!cpf || cpf.length !== 11) return cpf || '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function atualizarEstatisticas(usuarios) {
    if (!usuarios) return;
    
    document.getElementById('totalUsuarios').textContent = usuarios.length;
    document.getElementById('usuariosMaster').textContent = 
        usuarios.filter(u => u.perfil_id == 1).length;
    document.getElementById('usuariosComuns').textContent = 
        usuarios.filter(u => u.perfil_id == 2).length;
}

function confirmarExclusao(usuarioId, userName) {
    usuarioParaExcluir = usuarioId;
    document.getElementById('userNameToDelete').textContent = userName;
    
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    modal.show();
}

function excluirUsuario() {
    if (!usuarioParaExcluir) return;
    
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const originalText = confirmDeleteBtn.innerHTML;
    confirmDeleteBtn.disabled = true;
    confirmDeleteBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Excluindo...';
    
    fetch('backend/excluir_usuario.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            usuario_id: usuarioParaExcluir
        })
    })
    .then(response => {
        // Verificar se a resposta é JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Resposta do servidor não é JSON');
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            mostrarMensagem(data.message, 'success');
            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
            modal.hide();
            // Recarregar lista
            carregarUsuarios();
        } else {
            throw new Error(data.message || 'Erro desconhecido');
        }
    })
    .catch(error => {
        console.error('Erro detalhado:', error);
        mostrarMensagem('Erro ao excluir usuário: ' + error.message, 'error');
    })
    .finally(() => {
        confirmDeleteBtn.disabled = false;
        confirmDeleteBtn.innerHTML = originalText;
        usuarioParaExcluir = null;
    });
}

function showLoading(show) {
    const loading = document.getElementById('loadingSpinner');
    const table = document.querySelector('.table-responsive');
    
    if (show) {
        loading.style.display = 'block';
        table.style.display = 'none';
    } else {
        loading.style.display = 'none';
        table.style.display = 'block';
    }
}

function mostrarMensagem(mensagem, tipo) {
    // Use a mesma função showToast do seu login.js ou crie uma simples
    if (typeof showToast === 'function') {
        showToast(mensagem, tipo);
    } else {
        // Mensagem simples com alert
        if (tipo === 'success') {
            alert('✅ ' + mensagem);
        } else {
            alert('❌ ' + mensagem);
        }
    }
}

// Buscar automaticamente ao digitar (com debounce)
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', function(e) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        carregarUsuarios();
    }, 500);
});