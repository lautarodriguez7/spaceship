(function(){
    'use strict';
var pressing = [];

document.addEventListener('keydown', function(evt) {
    lastPress = evt.keyCode;
    pressing[evt.keyCode] = true;
}, false)

document.addEventListener('keyup', function(evt) {
    lastPress = evt.keyCode;
    pressing[evt.keyCode] = true;
}, false)

})();