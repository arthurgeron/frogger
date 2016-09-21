var sapo, pontos, vidas;
var timer = new Date().getTime(); //Utilizado para medir e limtiar o tempo entre entradas do usuário
var veiculos = [];
var blockSize; //Tamanho de bloco definido de acordo com o tamanho da janela

var typeOfComponent = {
    Veiculo: 1,
    Sapo: 2,
    Mapa: 0,
    properties: {
        1: {
            warp: true
        },
        2: {
            warp: false
        },
        0: {
            warp: false
        },
    }
}

function componentes(largura, altura, cor, x, y, tipoDeComponente) {
    this.gamearea = telaDoJogo;
    this.width = largura;
    this.height = altura;
    this.speedX = 0;
    this.speedY = 0;
    this.tipo = tipoDeComponente;
    if (tipoDeComponente == typeOfComponent.Veiculo) {
        this.baseMovementSpeedX = (Math.floor((Math.random() * 5) + 1) + 6) * /*Numero negativo ou positivo para definir a direcao do veiculo aleatoriamente */ (Math.round(Math.random()) * 2 - 1); //random speed between 10 and 20
        this.x = this.baseMovementSpeedX > 0 ? 0 : telaDoJogo.canvas.width;
    } else {
        this.x = x;
    }
    this.y = y;
    this.initialX = this.x;
    this.initialY = this.y;
    if (this.tipo == typeOfComponent.Sapo) {
        this.biggestY = this.initialY;
    }

    this.atualizar = function () {
        context = telaDoJogo.context;
        context.fillStyle = cor;
        context.fillRect(this.x, this.y, this.width, this.height);
        if (this.tipo == typeOfComponent.Sapo) { //desenha o sapo
            context.fillRect(this.x - 3, this.y - 4, 37, 20);
            context.fillRect(this.x - 5, this.y + 18, 15, 15);
            context.fillRect(this.x + 20, this.y + 18, 15, 15);
        }
        if (this.tipo == typeOfComponent.Veiculo) { //desenha carro com pneus
            context.fillStyle = "black";
            context.fillRect(this.x+10, this.y-10, 20, 10);
            context.fillRect(this.x+10, this.y+30, 20, 10);
            context.fillRect(this.x+70, this.y-10, 20, 10);
            context.fillRect(this.x+70, this.y+30, 20, 10);

        }

    }
    this.novaPos = function () {
        if (typeOfComponent.properties[this.tipo].warp) {
            if (this.x > telaDoJogo.canvas.width || this.x < 0) {
                this.x = this.initialX;
            } else {
                this.x += this.speedX;

            }
            if (this.y > telaDoJogo.canvas.height || this.y < 0) {
                this.y = this.initialY;
            } else {
                this.y += this.speedY;
            }
            //Detectar colisoes
            if (verificarColisao(sapo, this)) {
                perder();
            }
        } else if (this.tipo == typeOfComponent.Sapo) {
            if (this.x + this.speedX < telaDoJogo.canvas.width && this.x + this.speedX > 0) //Limita o movimento do sapo a area do mapa
            {
                this.x += this.speedX;
            }
            if (this.y + this.speedY < telaDoJogo.canvas.height && this.y + this.speedY > 0) //Limita o movimento do sapo a area do mapa
            {
                this.y += this.speedY;
                if (this.y < this.biggestY) {
                    this.biggestY = this.y;
                    adicionarPontuacao(10);
                }
            } else if (this.y <= 30) { // Caso ele atinja a parte superior do mapa vence o jogo
                vencer(); //Venceu a fase
            }

            //Detecao de colisao entre o sapo e veiculos
             for (var i = 0; i < veiculos.length; i++) {
               if(verificarColisao(sapo, veiculos[i])){
                 perder();
                 break;
               }
            }

        } else {
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }
}

function atualizaTeladeJogo() {
    telaDoJogo.clear();
    sapo.speedX = 0;
    sapo.speedY = 0;

    for (var i = 0; i < veiculos.length; i++) {
        veiculos[i].speedX = veiculos[i].baseMovementSpeedX;
        veiculos[i].novaPos();
        veiculos[i].atualizar();
    };

    if (new Date().getTime() - timer > 150) { // Limita o tempo entre entradas do usuário
        if (telaDoJogo.key && telaDoJogo.key == 37) {
            sapo.speedX = -30;
            timer = new Date().getTime();
        }
        if (telaDoJogo.key && telaDoJogo.key == 39) {
            sapo.speedX = 30;
            timer = new Date().getTime();
        }
        if (telaDoJogo.key && telaDoJogo.key == 38) {
            sapo.speedY = -30;
            timer = new Date().getTime();
        }
        if (telaDoJogo.key && telaDoJogo.key == 40) {
            sapo.speedY = 30;
            timer = new Date().getTime();
        }
        sapo.novaPos();
    }
    areasegura1.atualizar();
    areasegura2.atualizar();

    sapo.atualizar();

}


var telaDoJogo = {

    canvas: document.getElementById("canvas"),

    start: function () {
        this.context = this.canvas.getContext("2d");
        //Define o tamanho do canvas dinamicamente, sendo o tamanho minimo 640 por 400
        this.canvas.width = window.innerWidth < 640 ? 640 : window.innerWidth * 0.95;
        this.canvas.height = window.innerHeight < 400 ? 400 : window.innerHeight * 0.8;
        //Inicia os componentes, eles precisam ser iniciados aqui porque utilizando calculos baseados no tamanho do canvas
        iniciarComponentes();
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(atualizaTeladeJogo, 20);

        window.addEventListener('keydown', function (e) {
            telaDoJogo.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            telaDoJogo.key = false;
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function vencer() {
    exibirMensagem('Venceu!');
    adicionarPontuacao(100);
    reiniciarJogo(false);

}

function perder() {
    exibirMensagem('Perdeu!');
    reiniciarJogo(true);
}

function reiniciarJogo(zerarPontos) {
    //Reseta o jogo
    telaDoJogo.clear();
    iniciarComponentes();
    if (zerarPontos) {
        zerarPontuacao();
    }
}
//Funcao para deteccao de colisao entre dois objetos
function verificarColisao(objeto1, objeto2) {
    //Verifica colisao na parte superior do objeto
    if ((objeto1.x >= objeto2.x && objeto1.x <= objeto2.x + objeto2.width) && (objeto1.y >= objeto2.y && objeto1.y <= objeto2.y + objeto2.height))
        return true;
    //Verifica colisao na parte inferior do objeto
    else if ((objeto1.x + objeto1.width >= objeto2.x && objeto1.x + objeto1.width <= objeto2.x + objeto2.width) && (objeto1.y + objeto1.height >= objeto2.y && objeto1.y + objeto1.height <= objeto2.y + objeto2.height))
        return true;
    else
        return false;

}

function exibirMensagem(mensagem) {
    document.getElementById('Mensagem').innerText = mensagem;
    //Animacao
    document.getElementById('Mensagem').className = "animate";
    setTimeout(function () {
        document.getElementById('Mensagem').className = document.getElementById('Mensagem').className = "";
    }, 1000);
}

function adicionarPontuacao(pontos) {
    var temp = parseInt(document.getElementById('score').innerText) + parseInt(pontos);
    var comprimentoFaltanteNumero = 5 - String(temp).length;
    var numeroFinal = '';
    for (i = 0; i < comprimentoFaltanteNumero; i++) {
        numeroFinal += '0';
    }
    numeroFinal += String(temp);
    document.getElementById('score').innerText = numeroFinal;
    //Animacao
    document.getElementById('score').className = " animate";
    setTimeout(function () {
        document.getElementById('score').className = document.getElementById('score').className = "";
    }, 500);
}

function zerarPontuacao(pontos) {
    var temp = 0;
    var comprimentoFaltanteNumero = 5 - String(temp).length;
    var numeroFinal = '';
    for (i = 0; i < comprimentoFaltanteNumero; i++) {
        numeroFinal += '0';
    }
    numeroFinal += String(temp);
    document.getElementById('score').innerText = numeroFinal;
}
function randomCores() {
    var cor = ["red","gray","blue"];
    corRandom = cor[Math.floor(Math.random()*cor.length)];
    return corRandom;
}
    
function iniciarComponentes() {



    sapo = new componentes(30, 30, "#32CD32", telaDoJogo.canvas.width/2, (window.innerHeight * 0.8) - 30, typeOfComponent.Sapo);//cria o sampo no meio da tela.

    areasegura1 = new componentes(telaDoJogo.canvas.width, 60, "#90EE90", 0, 0, typeOfComponent.Mapa);
    areasegura2 = new componentes(telaDoJogo.canvas.width, 32, "#90EE90", 0, telaDoJogo.canvas.height - 32, typeOfComponent.Mapa);

    //Gera veiculos dinamicamente de acordo com o espaco disponivel
    var posicionadorVeiculos = areasegura1.height + 30;
    var espacamento = 60;
    veiculos = [];
    while (true) {

        veiculos.push(new componentes(100, 30, randomCores(), 0, posicionadorVeiculos, typeOfComponent.Veiculo));

        if (posicionadorVeiculos + espacamento >= telaDoJogo.canvas.height - 40) {//resolve o problema do carro vindo por dentro da área segura.
            return;
        } else {
            posicionadorVeiculos += espacamento;
        }
    }
}

window.onload = function () {


    telaDoJogo.start();
}