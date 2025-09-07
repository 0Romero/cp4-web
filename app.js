// Base de dados inicial
let players = [
    {
        "id": 1,
        "nome": "Andressa Alves",
        "posicao": "Meio-campo",
        "clube": "Corinthians",
        "foto": "https://lncimg.lance.com.br/cdn-cgi/image/width=1280,height=720,quality=75,fit=cover,format=webp/uploads/2023/07/2cc4545c-597b-497e-adde-05a569b14239-aspect-ratio-512-320.jpg",
        "gols": 15,
        "assistencias": 10,
        "jogos": 28,
        "favorita": false
    },
    {
        "id": 2,
        "nome": "Dayana Rodríguez",
        "posicao": "Meio-campo",
        "clube": "Corinthians",
        "foto": "https://www.meutimao.com.br/fotos-do-corinthians/w941/2025/01/15/dayana_rodriguez_no_treino_da_pre-temporada_vqbo.jpg",
        "gols": 5,
        "assistencias": 12,
        "jogos": 30,
        "favorita": false
    },
    {
        "id": 3,
        "nome": "Mariza",
        "posicao": "Zagueira",
        "clube": "Corinthians",
        "foto": "https://www.ogol.com.br/img/jogadores/new/52/55/1315255_mariza_20250723194059.png",
        "gols": 2,
        "assistencias": 1,
        "jogos": 32,
        "favorita": false
    },
    {
        "id": 4,
        "nome": "Thaís Regina",
        "posicao": "Zagueira",
        "clube": "Corinthians",
        "foto": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZoOPY4zOI-5tHWOjXvNzEgcVAhNcgrvkfgA&s",
        "gols": 1,
        "assistencias": 2,
        "jogos": 25,
        "favorita": false
    },
    {
        "id": 5,
        "nome": "Letícia Teles",
        "posicao": "Zagueira",
        "clube": "Corinthians",
        "foto": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd0yn0ZgmAcXP1Fcz7QRrUyl5iMwkavVeSTg&s",
        "gols": 0,
        "assistencias": 0,
        "jogos": 18,
        "favorita": false
    }
];

let nextId = 6;
let editingIndex = -1;
let currentSort = '';

document.addEventListener('DOMContentLoaded', function() {
    renderPlayers();
    updateClubFilter();
    
    document.getElementById('searchInput').addEventListener('input', filterPlayers);
    document.getElementById('clubeFilter').addEventListener('change', filterPlayers);
    
    document.getElementById('playerForm').addEventListener('submit', savePlayer);
});

function renderPlayers(playersToRender = players) {
    const container = document.getElementById('playersContainer');
    
    if (playersToRender.length === 0) {
        container.innerHTML = '<div class="no-players">Nenhuma jogadora encontrada</div>';
        return;
    }

    container.innerHTML = playersToRender.map(player => `
        <div class="player-card">
            <img src="${player.foto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face'}" 
                 alt="${player.nome}" class="player-photo" 
                 onerror="this.src='https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face'">
            
            <div class="player-info">
                <div class="player-name">${player.nome}</div>
                <div class="player-position">${player.posicao}</div>
                <div class="player-club">${player.clube}</div>
            </div>
            
            <div class="player-stats">
                <div class="stat-item">
                    <span class="stat-number">${player.gols}</span>
                    <span class="stat-label">Gols</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${player.assistencias}</span>
                    <span class="stat-label">Assistências</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${player.jogos}</span>
                    <span class="stat-label">Jogos</span>
                </div>
            </div>
            
            <div class="player-actions">
                <button class="favorite-btn ${player.favorita ? 'favorited' : ''}" 
                        onclick="toggleFavorite(${player.id})">
                    ⭐
                </button>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editPlayer(${player.id})">Editar</button>
                    <button class="delete-btn" onclick="deletePlayer(${player.id})">Remover</button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateClubFilter() {
    const clubs = [...new Set(players.map(player => player.clube))];
    const filter = document.getElementById('clubeFilter');
    const currentValue = filter.value;
    
    filter.innerHTML = '<option value="">Todos os clubes</option>' +
        clubs.map(club => `<option value="${club}">${club}</option>`).join('');
    
    filter.value = currentValue;
}

function filterPlayers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const clubeFilter = document.getElementById('clubeFilter').value;
    
    let filtered = players.filter(player => {
        const matchesSearch = player.nome.toLowerCase().includes(searchTerm) ||
                            player.posicao.toLowerCase().includes(searchTerm);
        const matchesClub = !clubeFilter || player.clube === clubeFilter;
        
        return matchesSearch && matchesClub;
    });

    if (currentSort) {
        filtered = applySorting(filtered, currentSort);
    }

    renderPlayers(filtered);
}

function sortPlayers(criteria) {
    currentSort = criteria;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const clubeFilter = document.getElementById('clubeFilter').value;
    
    let filtered = players.filter(player => {
        const matchesSearch = player.nome.toLowerCase().includes(searchTerm) ||
                            player.posicao.toLowerCase().includes(searchTerm);
        const matchesClub = !clubeFilter || player.clube === clubeFilter;
        
        return matchesSearch && matchesClub;
    });

    filtered = applySorting(filtered, criteria);
    renderPlayers(filtered);
}

function applySorting(playersList, criteria) {
    return [...playersList].sort((a, b) => {
        if (criteria === 'nome') {
            return a.nome.localeCompare(b.nome);
        } else if (criteria === 'posicao') {
            return a.posicao.localeCompare(b.posicao);
        }
        return 0;
    });
}

function toggleFavorite(id) {
    const player = players.find(p => p.id === id);
    if (player) {
        player.favorita = !player.favorita;
        filterPlayers(); 
        showAlert(player.favorita ? 'Jogadora adicionada aos favoritos!' : 'Jogadora removida dos favoritos!');
    }
}

function openModal(isEdit = false) {
    document.getElementById('modalTitle').textContent = isEdit ? 'Editar Jogadora' : 'Adicionar Jogadora';
    document.getElementById('playerModal').style.display = 'block';
    
    if (!isEdit) {
        document.getElementById('playerForm').reset();
        editingIndex = -1;
    }
}

function closeModal() {
    document.getElementById('playerModal').style.display = 'none';
    document.getElementById('playerForm').reset();
    editingIndex = -1;
}

function editPlayer(id) {
    const player = players.find(p => p.id === id);
    if (!player) return;
    
    editingIndex = players.findIndex(p => p.id === id);
    
    document.getElementById('nome').value = player.nome;
    document.getElementById('posicao').value = player.posicao;
    document.getElementById('clube').value = player.clube;
    document.getElementById('foto').value = player.foto || '';
    document.getElementById('gols').value = player.gols;
    document.getElementById('assistencias').value = player.assistencias;
    document.getElementById('jogos').value = player.jogos;
    
    openModal(true);
}

function savePlayer(e) {
    e.preventDefault();
    
    const formData = {
        nome: document.getElementById('nome').value.trim(),
        posicao: document.getElementById('posicao').value,
        clube: document.getElementById('clube').value.trim(),
        foto: document.getElementById('foto').value.trim(),
        gols: parseInt(document.getElementById('gols').value) || 0,
        assistencias: parseInt(document.getElementById('assistencias').value) || 0,
        jogos: parseInt(document.getElementById('jogos').value) || 0,
        favorita: false
    };

    if (!formData.nome || !formData.posicao || !formData.clube) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }

    if (editingIndex >= 0) {
        // Editar jogadora existente
        const existingPlayer = players[editingIndex];
        players[editingIndex] = {
            ...formData,
            id: existingPlayer.id,
            favorita: existingPlayer.favorita
        };
        showAlert('Jogadora editada com sucesso!');
    } else {
        const newPlayer = {
            ...formData,
            id: nextId++
        };
        players.push(newPlayer);
        showAlert('Jogadora adicionada com sucesso!');
    }

    closeModal();
    filterPlayers(); 
    updateClubFilter();
}

function deletePlayer(id) {
    if (confirm('Tem certeza que deseja remover esta jogadora?')) {
        const index = players.findIndex(p => p.id === id);
        if (index > -1) {
            players.splice(index, 1);
            filterPlayers(); 
            updateClubFilter();
            showAlert('Jogadora removida com sucesso!');
        }
    }
}

function showAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert';
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 300);
    }, 3000);
}

window.onclick = function(event) {
    const modal = document.getElementById('playerModal');
    if (event.target === modal) {
        closeModal();
    }
}
