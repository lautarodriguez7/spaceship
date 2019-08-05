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
        pause;

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

        ctx.fillStyle = '#0f0';
        ctx.fillRect(x, y, 10, 10);

        ctx.fillStyle = '#fff';
        //ctx.fillText('Last Press: '+lastPress,0,20);

        ctx.fillStyle = '#f00';
        for (var i = 0, l=shots.length; i < l; i++)
            shots[i].fill(ctx);
        
        ctx.fillStyle = '#f00';
        ctx.fillText ('Last Press: ' +lastPress, 0, 20);
        ctx.fillText('Shots: ' +shots.length, 0, 30); 

        if (pause) {
            ctx.textAlign = 'center';
            ctx.fillText('PAUSE', 150, 75);
            ctx.textAlign='left';
        }
    }

    document.addEventListener('keydown', function(evt) {
        lastPress = evt.keyCode;
        pressing[evt.keyCode] = true;
    }, false)

    document.addEventListener('keyup', function(evt) {
        lastPress = evt.keyCode;
        pressing[evt.keyCode] = true;
    }, false)

    window.requestAnimationFrame = (function() {
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {window.setTimeout(callback, 17);};
    })();
})();