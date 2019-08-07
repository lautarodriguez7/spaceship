(function(){
    'use strict';
    window.addEventListener('load', init, false);
    var KEY_ENTER = 13,
        KEY_SPACE = 32,
        KEY_LEFT = 37,
        KEY_UP = 38,
        KEY_RIGHT = 39,
        KEY_DOWN = 40;

    var canvas = null, 
        ctx = null, 
        player = new Rectangle(90, 280, 10, 10, 0, 3), 
        pause, 
        shots = [], 
        aTimer = 0, 
        eTimer = 0, 
        enemies = []; 

        var spritesheet = new Image();
        var spritesheetP2 = new Image();
        var spritesheetP3 = new Image();
        var background = new Image();
        spritesheetP2.src = 'assets/spritesheet-p2.png';
        spritesheetP3.src = 'assets/spritesheet-p3.png';
        spritesheet.src = 'assets/spritesheet.png';
        background.src = 'assets/nebula.jpg';

    function random (max) {
        return ~~(Math.random() *max);
    }

    function init() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        canvas.width= 200;
        canvas.height= 300;

        run();
        repaint();
    }

    function run() {
        setTimeout(run, 50);
        act(0.05);
    }

    function repaint() {
        requestAnimationFrame(repaint);
        paint(ctx);
    }

    /*function reset () {
        score = 0;
        multiShot = 1;
        player.x = 90;
        player.y = 280;
        player.health = 3,
        player.timer = 0,
        shots.length = 0;
        enemies.length = 0;
        powerUps.length = 0;
        messages.length = 0;
        enemies.push(new Rectangle (30, 0,10, 10, 0, 2));
        enemies.push(new Rectangle (70, 0,10, 10, 0, 2));
        enemies.push(new Rectangle (110, 0,10, 10, 0, 2));
        enemies.push(new Rectangle (150, 0,10, 10, 0, 2));
        gameOver = false;
    }*/


    function act(deltaTime) {
        if (!pause) {
            //Generate Enemy
            eTimer--;
            if (eTimer < 0) {
                enemies.push(new Rectangle(random(15) *10, 0, 10, 10, 3));
                eTimer = 40 + random(40);
            }

            // Move Enemies
            for (var i = 0, l = enemies.length; i < l; i++) {
               if (enemies[i].timer > 0)
               enemies[i].timer--;

            // Enemy Shot
            else if(enemies[i].type == 2) {
                enemies[i].x += enemies[i].vx;
                enemies[i].y += enemies[i].vy;
                // EnemyShot Outside Screen
                if (enemies[i].x<0||enemies[i].x>canvas.width||enemies[i].y<0||enemies[i].y>canvas.height) {
                    enemies.splice(i--, 1);
                    l--;
                    continue;
                }
                 // Player Intersects EnemyShot
                 if (player.intersects(enemies[i] && player.timer < 1)) {
                    player.health--;
                    player.timer = 20;
                }
            }
            // 8Shooter
            if (enemies[i].type == 3) {
                enemies[i].y += 5;
                // 8Shooter Outside Screen
                if (enemies[i].y > canvas.height) {
                    enemies.splice(i--, 1);
                    l--;
                    continue;
                }

                // 8Shooter Shots
                enemies[i].timer--;
                if (enemies[i].timer < 0) {
                    enemies.push(new Rectangle (enemies[i].x + 3, enemies[i].y + 5, 5, 5, 2, 0, 0, 10));
                    enemies.push(new Rectangle (enemies[i].x + 3, enemies[i].y + 5, 5, 5, 2, 0, -7, 7));
                    enemies.push(new Rectangle (enemies[i].x + 3, enemies[i].y + 5, 5, 5, 2, 0, -10, 0));
                    enemies.push(new Rectangle (enemies[i].x + 3, enemies[i].y + 5, 5, 5, 2, 0, -7, -7));
                    enemies.push(new Rectangle (enemies[i].x + 3, enemies[i].y + 5, 5, 5, 2, 0, 0, -10));
                    enemies.push(new Rectangle (enemies[i].x + 3, enemies[i].y + 5, 5, 5, 2, 0, 7, -7));
                    enemies.push(new Rectangle (enemies[i].x + 3, enemies[i].y + 5, 5, 5, 2, 0, 10, 0));
                    enemies.push(new Rectangle (enemies[i].x + 3, enemies[i].y + 5, 5, 5, 2, 0, 7, 7));
                    enemies[i].timer = 30 + random(30);
                }
                 // Player Intersects 8Shooter
                 if (player.intersects(enemies[i] && player.timer < 1)) {
                    player.health--;
                    player.timer = 20;
                }

                // Shot Intersects 8Shooter
                for (var j = 0, ll = shots.length; j < ll; j++) {
                    if (shots[j].intersects(enemies[i])) {
                        score++;
                        enemies[i].health --;
                        if (enemies[i].health < 1) {
                            enemies.splice(l--, 1);
                            l--;
                        }
                        else 
                            enemies[i].timer = 1;
                        shots.splice(j--, 1);
                        l--;
                    
                    
                    }
                }
            }
        }

        // Elapsed time
        aTimer += deltaTime;
        if (aTimer > 3600)
            aTimer -= 3600;
        }
    }
        
    function paint(ctx) {
    
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        ctx.strokeStyle = '#00f';
        for (var i = 0, l = enemies.length; i < l; i++) {
            if (enemies[i].type == 2)
                enemies[i].drawImageArea(ctx,spritesheet,75,(~~(aTimer*10)%2)*5,5,5);
            else if(enemies[i].type==3){
                if(enemies[i].timer==1)
                    enemies[i].drawImageArea(ctx,spritesheet,120,0,10,10);
                else
                    enemies[i].drawImageArea(ctx,spritesheet,100+(~~(aTimer*10)%2)*10,0,10,10);
            }
        }
        
        ctx.fillStyle = '#fff';
        ctx.fillText('SCORE: ', 0, 20);
        ctx.fillText('HEALTH: ?', 150, 20);
        if (pause) {
            ctx.textAlign = 'center';
            ctx.fillText('PAUSE', 100, 150);
            ctx.textAlign='left';
        }
    }

    function Rectangle(x,y,width,height,type,health,vx,vy){
        this.x=(x==null)?0:x;
        this.y=(y==null)?0:y;
        this.vx=(vx==null)?0:vx;
        this.vy=(vy==null)?0:vy;
        this.width=(width==null)?0:width;
        this.height=(height==null)?this.width:height;
        this.type=(type==null)?1:type;
        this.health=(health==null)?1:health;
        this.timer=0;
        }
    
    Rectangle.prototype.intersects = function(rect){
        if(rect!=null){
            return(this.x < rect.x + rect.width &&
                this.x + this.width > rect.x &&
                this.y < rect.y + rect.height &&
                this.y + this.height > rect.y);
        }
    }

    Rectangle.prototype.fill = function (ctx) {
        ctx.fillRect (this.x, this.y, this.width, this.height);
    }

    Rectangle.prototype.drawImageArea = function(ctx,img,sx,sy,sw,sh){
        if(img.width)
            ctx.drawImage(img,sx,sy,sw,sh,this.x,this.y,this.width,this.height);
        else
            ctx.strokeRect(this.x,this.y,this.width,this.height);
    }

    window.requestAnimationFrame = (function() {
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {window.setTimeout(callback, 17);};
    })();
})();