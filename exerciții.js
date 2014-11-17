
function Exercițiu(termeni, facilitate) {
    this.selectate = [];
    this.taste = [];
    var _this = this, tastă;
    document.onkeydown = function (event) { if (tastă = _this.taste[event.keyCode]) { if (tastă.apăsată == 1) tastă.apasă(2); else if (tastă.apăsată % 2) tastă.apăsată *= 2; } }
    document.onkeyup = function (event) { if (tastă = _this.taste[event.keyCode]) { if(tastă.apăsată % 2 == 0) tastă.apăsată /= 2; if (tastă.apăsată == 1) { tastă.selectează(true); tastă.dezIndică(); } } }
}
Exercițiu.prototype.tastează = function (expresie) { Renderer2.reprezintă(expresie); }

var exercițiu;
