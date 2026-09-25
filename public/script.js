// Configurações do Estado do Jogo
let tempoRestante = 30;
let pontos = 0;
let vidas = 3;
let tempoMosquito = 1500;
let cronometroInterval = null;
let spawnInterval = null;

// URL base da API
const API_URL = '/api/ranking';

// Carrega o Ranking ao iniciar a página
document.addEventListener('DOMContentLoaded', carregarRanking);

async function carregarRanking() {
    const tabela = document.getElementById('tabela-ranking');

    tabela.innerHTML = '<tr><td colspan="4">Carregando ranking...</td></tr>';

    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error('Erro ao buscar ranking');
        }

        const dados = await resposta.json();

        tabela.innerHTML = '';

        if (dados.length === 0) {
            tabela.innerHTML =
                '<tr><td colspan="4">Nenhum registro encontrado.</td></tr>';
            return;
        }

        dados.forEach((item, index) => {
            const linha = document.createElement('tr');

            linha.innerHTML = `
                <td><strong>#${index + 1}</strong></td>
                <td>${item.nickname}</td>
                <td>${item.pontos} pts</td>
                <td>${item.data_formatada || '-'}</td>
            `;

            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error('Erro:', erro);

        tabela.innerHTML =
            '<tr><td colspan="4">Erro ao carregar o ranking.</td></tr>';
    }
}

function iniciarJogo() {

    // Configura os parâmetros iniciais
    tempoMosquito = parseInt(
        document.getElementById('dificuldade').value
    );

    pontos = 0;
    vidas = 3;
    tempoRestante = 30;

    atualizarVidasUI();

    document.getElementById('pontos-atuais').innerText = pontos;
    document.getElementById('tempo').innerText = tempoRestante;

    // Transição de telas
    document.getElementById('tela-inicial')
        .classList.add('hidden');

    document.getElementById('modal-game-over')
        .classList.add('hidden');

    document.getElementById('tela-jogo')
        .classList.remove('hidden');

    // Inicia os loops do jogo
    cronometroInterval = setInterval(
        atualizarCronometro,
        1000
    );

    criarMosquito();

    spawnInterval = setInterval(
        criarMosquito,
        tempoMosquito
    );
}

function criarMosquito() {

    // Se já houver um mosquito na tela,
    // o jogador perdeu a oportunidade
    // e perde 1 vida
    const mosquitoExistente =
        document.getElementById('mosquito');

    if (mosquitoExistente) {

        mosquitoExistente.remove();

        vidas--;

        atualizarVidasUI();

        if (vidas <= 0) {
            finalizarJogo(false);
            return;
        }
    }

    const palco =
        document.getElementById('palco-jogo');

    const mosquito =
        document.createElement('img');

    // Imagem do mosquito
    mosquito.src = 'imagens/mosquito.png';

    // Fallback caso a imagem não exista
    mosquito.onerror = () => {

        mosquito.src =
            'data:image/svg+xml;utf8,' +
            '<svg xmlns="http://www.w3.org/2000/svg" ' +
            'viewBox="0 0 100 100">' +
            '<circle cx="50" cy="50" r="40" ' +
            'fill="%23e94560"/>' +
            '</svg>';
    };

    mosquito.id = 'mosquito';

    mosquito.className =
        `mosquito ${tamanhoAleatorio()} ${ladoAleatorio()}`;

    // Posições aleatórias dentro dos limites
    const larguraMax =
        window.innerWidth - 100;

    const alturaMax =
        window.innerHeight - 170;

    const posX =
        Math.max(
            10,
            Math.floor(Math.random() * larguraMax)
        );

    const posY =
        Math.max(
            10,
            Math.floor(Math.random() * alturaMax)
        );

    mosquito.style.left = `${posX}px`;
    mosquito.style.top = `${posY}px`;

    // Clique no mosquito
    mosquito.onclick = function () {

        pontos += 10;

        document.getElementById(
            'pontos-atuais'
        ).innerText = pontos;

        mosquito.remove();
    };

    palco.appendChild(mosquito);
}

function tamanhoAleatorio() {

    const classe =
        Math.floor(Math.random() * 3);

    return `tam${classe}`;
}

function ladoAleatorio() {

    return Math.random() < 0.5
        ? 'ladoA'
        : 'ladoB';
}

function atualizarVidasUI() {

    for (let i = 1; i <= 3; i++) {

        const coracao =
            document.getElementById(`v${i}`);

        if (i <= vidas) {

            coracao.style.opacity = '1';
            coracao.innerText = '❤️';

        } else {

            coracao.style.opacity = '0.3';
            coracao.innerText = '🖤';
        }
    }
}

function atualizarCronometro() {

    tempoRestante--;

    document.getElementById(
        'tempo'
    ).innerText = tempoRestante;

    if (tempoRestante <= 0) {
        finalizarJogo(true);
    }
}

function finalizarJogo(vitoria) {

    clearInterval(cronometroInterval);
    clearInterval(spawnInterval);

    const mosquitoExistente =
        document.getElementById('mosquito');

    if (mosquitoExistente) {
        mosquitoExistente.remove();
    }

    document.getElementById(
        'titulo-fim'
    ).innerText =
        vitoria
            ? '🎉 Tempo Esgotado!'
            : '💀 Game Over!';

    document.getElementById(
        'pontos-finais'
    ).innerText = pontos;

    document.getElementById(
        'modal-game-over'
    ).classList.remove('hidden');
}

async function salvarPontuacao(event) {

    event.preventDefault();

    const nickname =
        document.getElementById('nickname').value;

    const btnSalvar =
        document.getElementById('btn-salvar');

    if (!nickname.trim()) {
        return;
    }

    btnSalvar.disabled = true;
    btnSalvar.innerText = 'Salvando...';

    try {

        const resposta = await fetch(API_URL, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                nickname,
                pontos
            })
        });

        if (!resposta.ok) {
            throw new Error(
                'Erro ao salvar no ranking'
            );
        }

        document.getElementById(
            'nickname'
        ).value = '';

        reiniciarJogo();

    } catch (erro) {

        alert(
            'Erro ao salvar pontuação. Tente novamente.'
        );

        console.error(erro);

    } finally {

        btnSalvar.disabled = false;

        btnSalvar.innerText =
            'Salvar no Ranking';
    }
}

function reiniciarJogo() {

    document.getElementById(
        'modal-game-over'
    ).classList.add('hidden');

    document.getElementById(
        'tela-jogo'
    ).classList.add('hidden');

    document.getElementById(
        'tela-inicial'
    ).classList.remove('hidden');

    carregarRanking();
}