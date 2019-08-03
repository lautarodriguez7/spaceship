(function(){
    'use strict';
    window.addEventListener('load', init, false);
    var KEY_ENTER = 13,
        KEY_LEFT = 37,
        KEY_UP = 38,
        KEY_RIGHT = 39,
        KEY_DOWN = 40;

    var canvas = null,
        ctx = null,
        x = 50,
        y = 50,
        lastPress = null,
        pressing = [],
        pause = true;


    document.addEventListener('keydown', function(evt) {
        lastPress = evt.keyCode;
        pressing[evt.keyCode] = true;
    }, false)

    document.addEventListener('keyup', function(evt) {
        lastPress = evt.keyCode;
        pressing[evt.keyCode] = true;
    }, false)

    })();