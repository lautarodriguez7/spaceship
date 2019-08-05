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
        shots = [],
        player = new Rectangle(90, 280, 10, 10),
        pause = true,
        gameOver = true,
        score = 0,
        enemies = [];

    function random (max) {
        return ~~(Math.random() *max);
    }

    function reset () {
        score = 0;
        player.x = 90;
        player.y = 280;
        shots.length = 0;
        enemies.push(new Rectangle (10, 0,10, 10));
        gameOver = false;
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
        requestAnimationFrame(repaint);
        paint(ctx);
    }

    function act() {
        if (!pause) {
        // Move rect
        //if (pressing[KEY_UP])
        //    y -= 10;  //just moving horizontal
        if (pressing[KEY_RIGHT])
            player.x += 10;
        //if (pressing[KEY_DOWN])
        //    y += 10;  //just moving horizontal
        if (pressing[KEY_LEFT])
            player.x -= 10;

        // Out screen
        if (player.x > canvas.width - player.width)
           player.x = canvas.width - player.width;
        /*if (y > canvas.height)
            y = 0;*/
        if (player.x < 0)
           player.x = 0;
        /*if (y < 0)
            y = canvas.height;*/

        // New shot
        if (lastPress == KEY_SPACE){
            shots.push(new Rectangle(player.x+3, player.y, 5, 5));
            lastPress = null;
        }

        // Move shots
        for (var i = 0, l = shots.length; i < l; i++) {
            shots[i].y -= 10;
            if (shots[i].y < 0) {
                shots.splice(i--, 1); //(i--(position), 1(number of eliminations))
                l--;
            }
        }
    }
        // Pause/Unpause
        if (lastPress == KEY_ENTER) {
            pause = !pause;
            lastPress = null;
        }
    }    
    function paint(ctx) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        /*ctx.fillStyle = '#0f0';
        ctx.fillRect(x, y, 10, 10);*/

        ctx.fillStyle = '#0f0';
        player.fill(ctx);
        //ctx.fillText('Last Press: '+lastPress,0,20);

        ctx.fillStyle = '#f00';
        for (var i = 0, l=shots.length; i < l; i++)
            shots[i].fill(ctx);
        
        ctx.fillStyle = '#fff';
        ctx.fillText ('Last Press: ' +lastPress, 0, 20);
        ctx.fillText('Shots: ' +shots.length, 0, 30); 

        if (pause) {
            ctx.textAlign = 'center';
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

    function Rectangle(x,y,width,height){
        this.x = (x == null) ?0 : x;
        this.y = (y == null) ?0 : y;
        this.width = (width == null) ?0 : width;
        this.height = (height == null) ?this.width : height;
        }
    
    Rectangle.prototype.intersects=function(rect){
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

    window.requestAnimationFrame = (function() {
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {window.setTimeout(callback, 17);};
    })();
})();