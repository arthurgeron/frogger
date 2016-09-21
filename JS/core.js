var sapo, pontos, vidas;
var timer = new Date().getTime();//Utilizado para medir e limtiar o tempo entre entradas do usuário
var veiculos = [];
var typeOfComponent = {
    Veiculo : 1,
    Sapo : 2,
    Mapa : 0,
    properties: {
        1 : {warp: true}, 
        2 : {warp: false},
        0 : {warp: false},
    }
}

function componentes(largura, altura, cor, x, y, tipoDeComponente) {
    this.gamearea = telaDoJogo;
    this.width = largura;
    this.height = altura;
    this.speedX = 0;
    this.speedY = 0;
    this.tipo = tipoDeComponente;   
    if(tipoDeComponente == typeOfComponent.Veiculo){
      this.baseMovementSpeedX = (Math.floor((Math.random() * 5) + 1) + 6) * /*Numero negativo ou positivo para definir a direcao do veiculo aleatoriamente */ (Math.round(Math.random()) * 2 - 1);//random speed between 10 and 20
      this.x = this.baseMovementSpeedX>0 ? 0 : telaDoJogo.canvas.width;
    }
    else{
      this.x = x;
    }
    this.y = y;    
    this.initialX = this.x;
    this.initialY = this.y;
    if(this.tipo == typeOfComponent.Sapo)
    {
      this.biggestY = this.initialY;
    }

    this.atualizar = function() {
        context = telaDoJogo.context;
        context.fillStyle = cor;
        context.fillRect(this.x, this.y, this.width, this.height);
        if(this.tipo == typeOfComponent.Sapo){ //desenha o sapo
            context.fillRect(this.x-3, this.y-4, 37, 20);
            context.fillRect(this.x-5, this.y+18, 15,15);
            context.fillRect(this.x+20, this.y+18, 15,15);
        }
    }
    this.novaPos = function() {
        if(typeOfComponent.properties[this.tipo].warp){
            if(this.x > telaDoJogo.canvas.width  || this.x < 0)
            {
                this.x = this.initialX;
            }
            else{
                this.x += this.speedX;  
                
            }
            if(this.y  > telaDoJogo.canvas.height || this.y < 0 )
            {
                this.y = this.initialY;
            }
            else{
                this.y += this.speedY;
            }
            //Detectar colisoes
            if((sapo.x >= this.x && sapo.x <= this.x + this.width ) && (sapo.y >= this.y && sapo.y <= this.y + this.height) ){
                    perder();
            }
        }
        else if(this.tipo == typeOfComponent.Sapo){
            if(this.x + this.speedX < telaDoJogo.canvas.width && this.x + this.speedX > 0)//Limita o movimento do sapo a area do mapa
            {
                this.x += this.speedX;
            }
            if(this.y + this.speedY < telaDoJogo.canvas.height && this.y + this.speedY > 0)  //Limita o movimento do sapo a area do mapa
            {
                this.y += this.speedY;
                if(this.y < this.biggestY){
                    this.biggestY = this.y;
                    adicionarPontuacao(10);
                }
            }
            else if (this.y <=30 ){// Caso ele atinja a parte superior do mapa vence o jogo
                vencer(); //Venceu a fase
            }

        }
        else{
            this.x += this.speedX;
            this.y += this.speedY;   
        }     
    }
}

function atualizaTeladeJogo() {
    telaDoJogo.clear();
    sapo.speedX = 0;
    sapo.speedY = 0;    

    for(var i = 0; i < veiculos.length; i++){
      veiculos[i].speedX = veiculos[i].baseMovementSpeedX;
      veiculos[i].novaPos();
      veiculos[i].atualizar();
    };

    if( new Date().getTime() - timer > 150 ){ // Limita o tempo entre entradas do usuário
        if (telaDoJogo.key && telaDoJogo.key == 37) {sapo.speedX = -30; timer =  new Date().getTime();}
        if (telaDoJogo.key && telaDoJogo.key == 39) {sapo.speedX = 30; timer =  new Date().getTime();}
        if (telaDoJogo.key && telaDoJogo.key == 38) {sapo.speedY = -30; timer =  new Date().getTime();}
        if (telaDoJogo.key && telaDoJogo.key == 40) {sapo.speedY = 30; timer =  new Date().getTime();}
        sapo.novaPos();    
    }
    areasegura1.atualizar();
    areasegura2.atualizar();
    
    sapo.atualizar();

}


var telaDoJogo = {
    
    canvas: document.getElementById("canvas"),
    
    start : function() {
        this.context = this.canvas.getContext("2d");
        this.canvas.width = 640;
        this.canvas.height = 400;
        
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(atualizaTeladeJogo, 20);
        
        window.addEventListener('keydown', function (e) {
            telaDoJogo.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            telaDoJogo.key = false;
        })
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function vencer(){
    exibirMensagem('Venceu!');
    adicionarPontuacao(100);
    reiniciarJogo(false);

}

function perder(){
    exibirMensagem('Perdeu!');
    reiniciarJogo(true);
}

function reiniciarJogo(zerarPontos){
    //Reseta o jogo
    telaDoJogo.clear();
    iniciarComponentes();
    if(zerarPontos){
        zerarPontuacao();
    }
}

function exibirMensagem(mensagem){
    document.getElementById('Mensagem').innerText = mensagem;
    document.getElementById('Mensagem').setAttribute('visible',true);
}

function adicionarPontuacao(pontos){
    var temp = parseInt(document.getElementById('score').innerText) + parseInt(pontos);
    var comprimentoFaltanteNumero = 5 -  String(temp).length;
    var numeroFinal = '';
    for(i = 0 ; i < comprimentoFaltanteNumero ; i ++){
        numeroFinal += '0';
    }
    numeroFinal += String(temp);
    document.getElementById('score').innerText = numeroFinal;
}

function zerarPontuacao(pontos){
    var temp = 0;
    var comprimentoFaltanteNumero = 5 -  String(temp).length;
    var numeroFinal = '';
    for(i = 0 ; i < comprimentoFaltanteNumero ; i ++){
        numeroFinal += '0';
    }
    numeroFinal += String(temp);
    document.getElementById('score').innerText = numeroFinal;
}

function iniciarComponentes(){
    carro1 =  new componentes(180, 85, "black", 0, 65, typeOfComponent.Veiculo);
    carro2 =  new componentes(120, 85, "red", 600, 250, typeOfComponent.Veiculo);
    moto =  new componentes(100, 30, "blue", 0, 200, typeOfComponent.Veiculo);
    
    veiculos = [];
    
    veiculos.push(new componentes(100, 30, "blue", 0, 80, typeOfComponent.Veiculo));
    
    veiculos.push(new componentes(100, 30, "blue", 0, 140, typeOfComponent.Veiculo));

    veiculos.push(new componentes(100, 30, "blue", 0, 200, typeOfComponent.Veiculo));

    veiculos.push(new componentes(100, 30, "blue", 0, 260, typeOfComponent.Veiculo));

    veiculos.push(new componentes(100, 30, "blue", 0, 320, typeOfComponent.Veiculo));

    sapo = new componentes(30, 30, "#32CD32", 320, 370, typeOfComponent.Sapo);
    
    areasegura1 =  new componentes(640, 60, "#90EE90", 0, 0, typeOfComponent.Mapa);
    areasegura2 =  new componentes(640, 32, "#90EE90", 0, 370, typeOfComponent.Mapa);
}

window.onload = function () {
    
    iniciarComponentes();
    
    telaDoJogo.start();
}