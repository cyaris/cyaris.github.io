function removeWelcome() {
    var elem = document.getElementById('welcome');
    elem.parentNode.removeChild(elem);
    return false;
}
