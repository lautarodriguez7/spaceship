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
        lastPress = null,
        pressing = [],
        player = new Rectangle(90, 280, 10, 10, 0, 3),
        pause = true,
        gameOver = true,
        score = 0,
        powerUps = [],
        multiShot = 1,
        shots = [],
        messages = [],
        elapsedTime = 0,
        stars = [],
        enemies = [];

        var spritesheet = new Image();
        spritesheet.src = 'assets/spritesheet.png';

    function random (max) {
        return ~~(Math.random() *max);
    }

    function init() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        canvas.width= 200;
        canvas.height= 300;

        for (i = 0; i < 200; i++)
            stars.push( new Star (random (canvas.width), random(canvas.height)));
        
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

    function reset () {
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
        enemies.push(new Rectangle (10, 0,10, 10, 0, 2));
        enemies.push(new Rectangle (10, 0,10, 10, 0, 2));
        enemies.push(new Rectangle (10, 0,10, 10, 0, 2));
        enemies.push(new Rectangle (10, 0,10, 10, 0, 2));
        gameOver = false;
    }


    function act(deltaTime) {
        if (!pause) {
            //GameOver Reset
            if (gameOver)
                reset();

            // Move player
            //if (pressing[KEY_UP])
            //    y -= 10;  //just moving horizontal
            if (pressing[KEY_RIGHT])
                player.x += 10;
            //if (pressing[KEY_DOWN])
            //    y += 10;  //just moving horizontal
            if (pressing[KEY_LEFT])
                player.x -= 10;

            // Out screen
            if(player.x > canvas.width - player.width)
                player.x = canvas.width - player.width;
            if(player.x < 0)
                player.x = 0;

            // New shot
            if (lastPress == KEY_SPACE) {
                if (multiShot == 3) {
                shots.push(new Rectangle(player.x + 3, player.y + 2, 5, 5));
                shots.push(new Rectangle(player.x + 3, player.y, 5, 5));
                shots.push(new Rectangle(player.x + 9, player.y + 2, 5, 5));
            }
            else if (multiShot == 2){ 
                shots.push(new Rectangle (player.x, player.y, 5, 5));
                shots.push(new Rectangle (player.x + 5, player.y, 5, 5));
            } 
            else
                shots.push(new Rectangle (player.x + 3, player.y, 5, 5));
            lastPress = null;
        }
            // Move shots
            for (var i = 0, l = shots.length; i < l; i++) { //i for ships
                shots[i].y -= 10;
                if (shots[i].y < 0) {
                    shots.splice(i--, 1); //(i--(position), 1(number of eliminations))
                    l--;
                }
            }

            //Move Messages
            for (var i = 0, l = messages.length; i < l; i++) {
                messages[i].y += 2;
                if (messages[i].y < 260) {
                    messages.splice(i--, 1);
                    l--;
                }
            }

            // Move PowerUps
            for (var i = 0, l = powerUps.length; i < l; i++) {
                powerUps[i].y += 5;
                // PowerUp Outside Screen
                if (powerUps[i].y > canvas.height) {
                    powerUps.splice(i--, 1);
                    l--;
                    continue;
                }

                // Player Intersects
                if (player.intersects(powerUps[i])) {
                    if (powerUps[i].type == 1) { //multishot
                        if (multiShot < 3) {
                            multiShot++;
                            messages.push(new messages('MULTI', player.x, player.y));
                        }
                        else {
                            score + 5;
                            messages.push(new messages ('+5', player.x, player.y));
                        }
                    }
                    else { // Extra points
                        score += 5;
                        messages.push(new messages ('+5', player.x, player.y));
                    }
                    powerUps.splice(i--, 1);
                    l--;
                }
            }
            

            // Move Enemies
            for (var i = 0, l = enemies.length; i < l; i++) {
                if (enemies[i].timer > 0)
                enemies[i].timer--;

            // Shot Intersects Enemy
            for (var j = 0, ll = shots.length; j < ll; j++) { //j for shots
                if (shots[j].intersects(enemies[i])) {
                    score++;
                    enemies[i].health--;
                    if (enemies[i].health < 1) {
                    enemies[i].x = random(canvas.width / 10) * 10;
                    enemies[i].y = 0;
                    enemies[i].health = 2;
                    enemies.push (new Rectangle (random (canvas.width / 10) * 10, 0, 10, 10, 0, 2));
                    }
                    else {
                        enemies[i].timer = 1;
                    }
                    shots.splice(j--, 1);
                    ll--;
                }
            }   

                enemies[i].y += 5;
                // Enemy Outside Screen
                if (enemies[i].y > canvas.height) {
                    enemies[i].x = random (canvas.width / 10) * 10;
                    enemies[i].y = 0;
                    enemies[i].health = 2;
                }

                // Player Intersects Enemy
                if (player.intersects(enemies[i] && player.timer < 1)) {
                    player.health--;
                    player.timer = 20;
                }

                // Shot Intersects Enemy
            for (var j = 0, ll = shots.length; j < ll; j++) { //j for shots
                if (shots[j].intersects(enemies[i])) {
                    score++;
                    enemies[i].health--;
                    if (enemies[i].health < 1) {
                        // Add Powerup
                        var r = random(20);
                        if (r < 5) {
                            if (r == 0) // New multishot
                                powerUps.push(new Rectangle(enemies[i].x, enemies[i].y, 10, 10, 1));
                            else    // New ExtraPoints
                                powerUps.push(new Rectangle(enemies[i].x, enemies[i].y, 10, 10, 0));
                        }
                        enemies[i].x = random(canvas.width / 10) * 10;
                        enemies[i].y = 0;
                        enemies[i].health = 2;
                        enemies.push(new Rectangle (random (canvas.width / 10)* 10, 0, 10, 10, 0, 2));
                    }
                    else {
                        enemies[i].timer = 1;
                    }
                    shots.splice(j--, 1);
                    ll--;
                    }
                }   
            }
            
            // Elapsed time
            elapsedTime += deltaTime;
            if (elapsedTime > 3600)
                elapsedTime -= 3600;

            // timer (ex damaged)
            if (player.timer > 0)
            player.timer--;

            //GameOver
            if (player.health < 1) {
                gameOver = true;
                pause = true;
            }
        }
            // Move Stars

            // Pause/Unpause
            if (lastPress == KEY_ENTER) {
                pause = !pause;
                lastPress = null;
            }
        }     

    function Star(x,y) {
        this.x = (x == null) ?0 : x;
        this.y = (y == null) ?0 : y;
    }

    function paint(ctx) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0f0';
        if (player.timer%2 == 0)
            //player.fill(ctx);
            player.drawImageArea(ctx, spritesheet, (~~(elapsedTime*10)%3)*10,0,10,10);

        for (var i = 0, l = powerUps.length; i < l; i++) {
            if (powerUps[i].type == 1) {
                ctx.strokeStyle = '#f90';
                powerUps[i].drawImageArea(ctx, spritesheet, 50, 0, 10, 10);
            }
            else {
                ctx.strokeStyle = '#cc6';
                powerUps[i].drawImageArea(ctx, spritesheet, 60, 0, 10, 10);
            }
            //powerUps[i].fill(ctx);
        }

        for (var i = 0, l = enemies.length; i < l; i++) {
            if (enemies[i].timer%2 == 0) {
                ctx.strokeStyle = '#00f';
                enemies[i].drawImageArea(ctx.spritesheet, 30, 0, 10, 10);
            }   
            else {
                ctx.strokeStyle = '#fff';
                enemies[i].drawImageArea(ctx, spritesheet, 40, 0, 10, 10);
            }
            // enemies[i].fill(ctx);
        }

        ctx.strokeStyle = '#f00';
        for (var i = 0, l=shots.length; i < l; i++)
            //shots[i].fill(ctx);
            shots[i].drawImageArea(ctx,spritesheet,70,(~~(elapsedTime*10)%2)*5,5,5);
        
        /*ctx.fillStyle = '#00f';
        for (var i = 0, l = enemies.length; i < l; i++)
            enemies[i].fill(ctx);*/

        ctx.fillStyle = '#fff';
        for (var i = 0, l = messages.length; i < l; i++)
            ctx.fillText (messages[i].string, messages[i].x, messages[i].y);
        ctx.fillText('SCORE: ' +score, 0, 20);
        ctx.fillText('HEALTH: ' +player.health, 150, 20);
        //ctx.fillText ('Last Press: ' +lastPress, 0, 20);
        //ctx.fillText('Shots: ' +shots.length, 0, 30); 

        //Healths
        /*ctx.fillStyle = '#DF0101'
        ctx.fillText('Health: ' +player.health, 150, 10);*/

        if (pause) {
            ctx.textAlign = 'center';
            if (gameOver)
                ctx.fillText('GAME OVER', 100, 150);
            else
                ctx.fillText('PAUSE', 100, 150);
            ctx.textAlign='left';
        }
    }

    document.addEventListener('keydown', function(evt) {
        lastPress = evt.keyCode;
        pressing[evt.keyCode] = true;
    }, false)

    document.addEventListener('keyup', function(evt) {
        pressing[evt.keyCode] = false;
    }, false)

    function Rectangle(x,y,width,height,type,health) {
        this.x = (x == null) ?0 : x;
        this.y = (y == null) ?0 : y;
        this.width = (width == null) ?0 : width;
        this.height = (height == null) ?this.width : height;
        this.type = (type == null) ?1 : type;
        this.health = (health == null) ?1 : health;
        this.timer = 0;
    }
    
    Rectangle.prototype.intersects = function(rect){
        if(rect!=null){
            return(this.x<rect.x+rect.width&&
                this.x+this.width>rect.x&&
                this.y<rect.y+rect.height&&
                this.y+this.height>rect.y);
        }
    }

    Rectangle.prototype.fill = function (ctx) {
        ctx.fillRect (this.x, this.y, this.width, this.height);
    }

    Rectangle.prototype.drawImageArea=function(ctx,img,sx,sy,sw,sh){
        if(img.width)
            ctx.drawImage(img,sx,sy,sw,sh,this.x,this.y,this.width,this.height);
        else
            ctx.strokeRect(this.x,this.y,this.width,this.height);
        }

        function Message(string,x,y){
            this.string=(string==null)?'?':string;
            this.x=(x==null)?0:x;
            this.y=(y==null)?0:y;
        }

    window.requestAnimationFrame = (function() {
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {window.setTimeout(callback, 17);};
    })();
})();