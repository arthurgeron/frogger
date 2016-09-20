var sapo, pontos, vidas;


function componentes(largura, altura, cor, x, y) {
    this.gamearea = telaDoJogo;
    this.width = largura;
    this.height = altura;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    
    this.atualizar = function() {
        context = telaDoJogo.context;
        context.fillStyle = cor;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    this.novaPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }
}

function atualizaTeladeJogo() {
    telaDoJogo.clear();
    sapo.speedX = 0;
    sapo.speedY = 0;    
    if (telaDoJogo.key && telaDoJogo.key == 37) {sapo.speedX = -1; }
    if (telaDoJogo.key && telaDoJogo.key == 39) {sapo.speedX = 1; }
    if (telaDoJogo.key && telaDoJogo.key == 38) {sapo.speedY = -1; }
    if (telaDoJogo.key && telaDoJogo.key == 40) {sapo.speedY = 1; }
    sapo.novaPos();    

    areasegura1.atualizar();
    areasegura2.atualizar();
    
    sapo.atualizar();
    
    carro1.atualizar()
    carro2.atualizar()
    moto.atualizar()
}


var telaDoJogo = {
    //canvas : document.createElement("canvas"),
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


window.onload = function () {
    
 //function componentes(largura, altura, cor, x, y)   
 
    carro1 =  new componentes(180, 85, "gray", 60, 65);
    carro2 =  new componentes(80, 85, "red", 500, 250);
    moto =  new componentes(80, 30, "blue", 320, 200);
    
    sapo = new componentes(30, 30, "#006010", 320, 370);
    
    areasegura1 =  new componentes(640, 60, "green", 0, 0);
    areasegura2 =  new componentes(640, 32, "green", 0, 370);
    
    telaDoJogo.start();

    
}