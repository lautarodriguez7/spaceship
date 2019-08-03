var pressing = [];

document.addEventListener('keydown', functio(evt) {
    lastPress = evt.keyCode;
    pressing[evt.keyCode] = true;
}, false)