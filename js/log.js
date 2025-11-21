
// Carregar logs ordenados (mais recentes)
logs.sort((a, b) => new Date(b.data) - new Date(a.data));

function renderLogs(filteredLogs) {
    const tbody = document.getElementById("logsBody");
    tbody.innerHTML = "";

    filteredLogs.forEach(log => {
        const row = `
            <tr>
                <td>${log.data}</td>
                <td>${log.nome}</td>
                <td>${log.cpf}</td>
                <td>${log.fator}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Filtro
function applyFilter() {
    const type = document.getElementById("filterType").value;
    const search = document.getElementById("searchInput").value.toLowerCase();

    let filtered = logs;

    if (type === "nome") {
        filtered = logs.filter(l => l.nome.toLowerCase().includes(search));
    } else if (type === "cpf") {
        filtered = logs.filter(l => l.cpf.includes(search));
    }

    renderLogs(filtered);
}

// Render inicial (todos)
renderLogs(logs);
