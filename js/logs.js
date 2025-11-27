document.addEventListener("DOMContentLoaded", function() {
    // Verificar se é usuário master
    const perfilId = localStorage.getItem('perfil_id');
    if (perfilId !== '1') {
        alert('Acesso restrito para usuários Master.');
        window.location.href = 'home-logado.html';
        return;
    }

    carregarLogs();
});

function carregarLogs() {
    const filtro = document.getElementById('filterType').value;
    const busca = document.getElementById('searchInput').value;
    
    showLoading(true);
    
    // Construir URL com parâmetros
    let url = `backend/buscar_logs.php?filtro=${encodeURIComponent(filtro)}`;
    if (busca) {
        url += `&busca=${encodeURIComponent(busca)}`;
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
                renderizarLogs(data.logs);
                atualizarEstatisticas(data.logs);
            } else {
                throw new Error(data.message || 'Erro ao carregar logs');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            mostrarMensagem('Erro ao carregar logs: ' + error.message, 'error');
            showLoading(false);
        });
}

function renderizarLogs(logs) {
    const tbody = document.getElementById('logsBody');
    const noLogsMessage = document.getElementById('noLogsMessage');
    const table = document.getElementById('logsTable');
    
    showLoading(false);
    
    if (!logs || logs.length === 0) {
        tbody.innerHTML = '';
        noLogsMessage.style.display = 'block';
        table.style.display = 'none';
        return;
    }
    
    noLogsMessage.style.display = 'none';
    table.style.display = 'table';
    
    tbody.innerHTML = logs.map(log => `
        <tr>
            <td>${log.data_formatada}</td>
            <td>${log.nome_completo || 'N/A'}</td>
            <td>${log.login || 'N/A'}</td>
            <td>${formatarCPF(log.cpf) || 'N/A'}</td>
            <td>
                <span class="badge ${getBadgeClass(log.tipo)}">
                    ${log.tipo_formatado}
                </span>
            </td>
            <td>${log.fator_formatado || '-'}</td>
            <td><small class="text-muted">${log.ip || 'N/A'}</small></td>
        </tr>
    `).join('');
}

function formatarCPF(cpf) {
    if (!cpf || cpf.length !== 11) return cpf || '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function getBadgeClass(tipo) {
    const classes = {
        'login_sucesso': 'bg-success',
        '2fa_sucesso': 'bg-success',
        'login_erro': 'bg-danger',
        '2fa_erro': 'bg-danger',
        'logout': 'bg-secondary'
    };
    return classes[tipo] || 'bg-primary';
}

function atualizarEstatisticas(logs) {
    if (!logs) return;
    
    document.getElementById('totalLogs').textContent = logs.length;
    document.getElementById('loginsSucesso').textContent = 
        logs.filter(log => log.tipo === 'login_sucesso').length;
    document.getElementById('loginsErro').textContent = 
        logs.filter(log => log.tipo === 'login_erro').length;
    document.getElementById('total2FA').textContent = 
        logs.filter(log => log.tipo.includes('2fa')).length;
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
    // Você pode usar a mesma função showToast do seu login.js
    if (typeof showToast === 'function') {
        showToast(mensagem, tipo);
    } else {
        alert(mensagem);
    }
}

// Buscar ao pressionar Enter no campo de busca
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        carregarLogs();
    }
});