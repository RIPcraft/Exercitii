
function Exercițiu(termeni) {
    // ponderi
    this.ponderi = [];
    this.ture = [];
    this.nivel = 0;
    this.nivele = 1;
    this.generat = undefined;
    this.factor = 8;
    // termeni
    this.termeni = termeni;
    for (var i in termeni) termeni[i].className = 'termen';
    this.exercițiu = document.getElementById("exercițiu");
    this.inițializează();
    this.introdus = document.createElement('span');
    this.introdus.className = this.introdus.id = 'introdus';
    this.răspuns = document.createElement('div');
    this.răspuns.id = 'răspuns';
    this.confirmat = false;
    // scor
    this.minScor;
    this.maxScor;
    this._timp;
    this._interval;
    this.cronometru = 0;
    this.interval = document.getElementById('interval');
    this.timp = document.getElementById('timp');
    this.scor = document.getElementById('scor');
    this.record = document.getElementById('record');
    this.adaos = document.getElementById('adaos');
	this.record.style.width = this._record + 'px';
	(this.explicație = document.getElementById("explicație")).innerHTML = 'nivelul 1';
}
Exercițiu.prototype.inițializează = function () {
    this.record.style.width = '0px'; // se preia din cookie :)
    this._record = 0;                // se preia din cookie :)
    this._scor = 0;
    this.exercițiu.innerHTML = '';
    for (var i in this.termeni) exercițiu.appendChild(this.termeni[i]);
}
Exercițiu.prototype.generează = function () {
    // adaugă interval de timp
    this._interval = this._timp = (this.maxScor - this.minScor) * Math.pow((Exercițiu.lățimeScor - this._scor) / Exercițiu.lățimeScor, 0.7) + this.minScor;
    this.scor.style.width = this._scor + this._interval + 'px';
    this.interval.style.width = this._interval + 'px';
	this.timp.style.width = this._timp + 'px';
    this.interval.className = 'interval';
    this.timp.className = 'timp';
    this.adaos.style.visibility = 'hidden';
    this.interval.style.visibility = 'visible';
    // generează noua valoare
    var factori, sumă, i, j, k;
    this.generat = [];
    for (i in this.ponderi) {
        for (j = k = sumă = 0, factori = [[], []]; j < this.ponderi[i].length; j++) if (this.ponderi[i][j]) {
            sumă += (factori[0][k] = this.ponderi[i][j] * this.ture[i][j]++);
            factori[1][k++] = j;
        }
        for (j = 0, k = Math.random() * sumă; k > factori[0][j]; k -= factori[0][j++]);
        this.ture[i][this.generat[i] = factori[1][j]] = 1;
    }
	// pornește cronometru
    var _this = this;
    this.cronometru = setInterval(function () {
        _this._timp -= (0.1 * (1 - (_this.introdus.innerHTML.length - 1) / _this.răspuns.innerHTML.length));
		if (_this._timp < 0) {
			clearInterval(_this.cronometru);
			_this.răspunsGreșit();
		}
		else {
			_this.timp.style.width = _this._timp + 'px';
			if (_this._timp < _this._interval * 0.4 + 3) _this.timp.className = (Math.floor(Math.log(_this._timp + 10) * 200) % 10 < 5) ? 'intermitent' : 'timp';
		}
    }, 41);
};
Exercițiu.prototype.răspunsCorect = function () {
    // oprește cronometru
    clearInterval(this.cronometru);
    document.onkeydown = undefined;
	// evidențiază răspuns
    this.introdus.className = 'corect';
    // micșorează ponderi
    var micșorare = this._timp * this._timp * (Exercițiu.lățimeScor - this._scor) /
                    (this._interval * this._interval * Exercițiu.lățimeScor);
    this.modificăPonderi(1 / (1 + 2 * micșorare * (this.factor - 1)));
    // crește scor
    if (this._scor + this._timp >= Exercițiu.lățimeScor) this._timp = Exercițiu.lățimeScor - this._scor;
    this.scor.style.width = (this._scor += this._timp) + 'px';
    this.interval.style.width = this._timp + 'px';
    this.timp.className = 'crește';
    // crește record
    if (this._record < this._scor) {
        this.adaos.style.width = (this._scor - this._record) + 'px';
        this.adaos.style.visibility = 'visible';
        this._record = this._scor;
        this.record.style.width = this._record + 'px';
    }
	// generează următorul exercițiu sau termină nivelul
    var _this = this;
    setTimeout(function () {
        _this.timp.className = 'timp';
        _this.interval.style.visibility = 'hidden';
        _this.adaos.style.visibility = 'hidden';
        setTimeout(function () {
            if (_this._scor < Exercițiu.lățimeScor) _this.generează();
            else _this.terminăNivel();
        }, 200);
    }, 400);
};
Exercițiu.prototype.răspunsGreșit = function () {
    // oprește cronometru
    clearInterval(this.cronometru);
    document.onkeydown = undefined;
	// arată răspuns corect
    this.introdus.className = 'greșit';
    this.răspuns.style.visibility = 'visible';
    // crește ponderi
    var mărire = (this._interval - this._timp) * (this._interval - this._timp) * (Exercițiu.lățimeScor - this._scor) /
                 (this._interval * this._interval * Exercițiu.lățimeScor);
    this.modificăPonderi(1 + mărire * (this.factor - 1));
	// scade scor
	this._timp = Math.min(this._interval, this._scor);
    this.timp.style.width = this._timp + 'px';
    this.timp.className = 'scade';
    this.interval.style.width = (this._interval + this._timp) + 'px';
    this._scor -= this._timp;
	// generează următorul exercițiu
	var _this = this;
    setTimeout(function () {
		_this.scor.style.width = _this._scor + 'px';
		_this.interval.style.visibility = 'hidden';
		setTimeout(function () {
			_this.generează();
		}, 200);
	}, 1200);
};
Exercițiu.prototype.modificăPonderi = function (factor) { for (var i in this.generat) this.ponderi[i][this.generat[i]] *= factor; }
Exercițiu.prototype.creșteNivel = function () {
    var i, j, k, max = [];
    if (!this.nivel++) { this.factor = 2; return 1; }
    if (this.nivel > this.nivele) { this.exercițiu.innerHTML += 'Acesta a fost ultimul nivel...'; return false; }
    for (i in this.ponderi) {
        max[i] = this.ponderi[i][0];
        for (j in this.ponderi[i]) if ((k = this.ponderi[i][j]) > max[i]) max[i] = k;
    }
    this.maxScor *= (1 - (k = (k = (k = (k = (this.maxScor - this.minScor) / (this.maxScor + this.minScor)) * k) * k) * k));
    this.minScor *= (1 + k);
    return max;
}
Exercițiu.prototype.terminăNivel = function () {
    this.exercițiu.innerHTML = 'Felicitări! ai terminat nivelul!<br />';
    this.creșteNivel();
    if (this.nivel <= this.nivele) {
        var span = document.createElement('span'), _this = this;
        this.exercițiu.appendChild(span);
        span.className = "nivel";
        span.innerHTML = 'Nivelul ' + this.nivel;
        span.onclick = function () { _this.inițializează(); _this.explicație.innerHTML = 'nivelul ' + _this.nivel; _this.generează(); };
    }
}
Exercițiu.prototype.exercițiuCompletare = function (tastă) {
    this.introdus.innerHTML = this.introdus.innerHTML.slice(0, -1) + tastă;
    if (tastă != this.răspuns.innerHTML[this.introdus.innerHTML.length - 1]) return this.răspunsGreșit();
    if (this.introdus.innerHTML == this.răspuns.innerHTML) return this.răspunsCorect();
    introdus.innerHTML += '?';
};
Exercițiu.prototype.obiectivTastatură = function (termen) {
    this.răspuns.style.visibility = 'hidden';
    this.răspuns.innerHTML = termen.innerHTML;
    this.introdus.className = 'introdus';
    this.introdus.innerHTML = '?';
    termen.innerHTML = '';
    termen.appendChild(this.introdus);
    termen.appendChild(this.răspuns);
};
Exercițiu.prototype.activeazăTaste = function (taste) {
    var _this = this;
    document.onkeydown = function (event) {
        if (taste[event.keyCode]) taste[event.keyCode][0].apply(_this, taste[event.keyCode].slice(1));
    };
};
Exercițiu.tastaturăNumerică = function (funcție) {
    return {
        48: [funcție, 0],
        49: [funcție, 1],
        50: [funcție, 2],
        51: [funcție, 3],
        52: [funcție, 4],
        53: [funcție, 5],
        54: [funcție, 6],
        55: [funcție, 7],
        56: [funcție, 8],
        57: [funcție, 9],
        96: [funcție, 0],
        97: [funcție, 1],
        98: [funcție, 2],
        99: [funcție, 3],
        100: [funcție, 4],
        101: [funcție, 5],
        102: [funcție, 6],
        103: [funcție, 7],
        104: [funcție, 8],
        105: [funcție, 9]
    };
};
Exercițiu.lățimeScor = 700;


function TablaÎnmulțirii() {
    Exercițiu.call(this, [
        document.createElement('div'),
        document.createElement('span'),
        document.createElement('div'),
        document.createElement('span'),
        document.createElement('div')]);
    this.nivele = 5;
    this.maxScor = 30;
    this.minScor = 3;
    this.creșteNivel();
    this.generează();
}
TablaÎnmulțirii.prototype = (function () { var ț = function () { }; ț.prototype = Exercițiu.prototype; return new ț; })();
TablaÎnmulțirii.prototype.generează = function () {
    Exercițiu.prototype.generează.call(this);
    // recuperarea valorilor
    var a = this.generat[0] + 1, b, c, d, e = '=', s = 'x', n = this.generat[4] * 2;
    for (b = 10; a > b; a -= b--); c = (a += (b = 11 - b) - 1) * b; // găsirea perechii din tabla înmulțirii
    if (this.generat[1]) { d = a; a = b; b = d; } // inversarea perechii (sau nu)
    if (this.generat[2]) { d = a; a = c; c = d; s = ':'; } // înmulțire sau împărțire
    if (this.generat[3]) { d = c; c = b; b = a; a = d; d = e; e = s; s = d; n = (n + 2) % 6; } // inversarea egalității (sau nu)
    // afișarea valorilor
    this.termeni[0].innerHTML = a;
    this.termeni[1].innerHTML = '&nbsp;' + s + '&nbsp;';
    this.termeni[2].innerHTML = b;
    this.termeni[3].innerHTML = '&nbsp;' + e + '&nbsp;';
    this.termeni[4].innerHTML = c;
    this.obiectivTastatură(this.termeni[n]);
    var _this = this;
    this.activeazăTaste(Exercițiu.tastaturăNumerică(function () {
        this.exercițiuCompletare.apply(_this, arguments);
    }));
};
TablaÎnmulțirii.prototype.creșteNivel = function () {
    var i, j, k, max = Exercițiu.prototype.creșteNivel.call(this);
    switch (this.nivel) {
        case 1:
            this.ponderi = [[], [1, 1], [1, 0], [1, 0], [0, 0, 1]]; // doar înmulțiri neinversate și rezultat necunoscut
            this.ture = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                          1, 1, 1, 1, 1, 1, 1, 1, 1,
                          1, 1, 1, 1, 1, 1, 1, 1,
                          1, 1, 1, 1, 1, 1, 1,
                          1, 1, 1, 1, 1, 1,
                          1, 1, 1, 1, 1,
                          1, 1, 1, 1,
                          1, 1, 1,
                          1, 1,
                          1], [1, 1], [1, 1], [1, 1], [1, 1, 1]];
            for (k = 0, i = 5; i > 0; k += (5 + i--)) for (j = 0; j < i; this.ponderi[0][k + j++] = 1); // înmulțiriea cu 5
            return true;
        case 2:
            for (i = 9, j = 5; i > 3; j += i--) this.ponderi[0][j] = max[0]; // înmulțiriea cu 6
            for (i = 9, j = 6; i > 2; j += i--) this.ponderi[0][j] = max[0]; // înmulțiriea cu 7
            this.ponderi[3] = [3, 1]; // inversarea egalităților cu frecvență mică
            return true;
        case 3:
            for (i = 9, j = 7; i > 1; j += i--) this.ponderi[0][j] = max[0]; // înmulțiriea cu 8
            for (i = 9, j = 8; i > 0; j += i--) this.ponderi[0][j] = max[0]; // înmulțiriea cu 9
            for (i = 9, j = 9; i > -1; j += i--) this.ponderi[0][j] = max[0]; // înmulțiriea cu 10
            this.ponderi[4] = [1, 1, 8]; // termeni necunoscuți cu frecvență mică
            this.ponderi[3] = [1, 1]; // inversarea egalităților cu frecvență egală
            return true;
        case 4:
            this.ponderi[4] = [3, 3, 2]; // termeni necunoscuți cu frecvență mare
            this.ponderi[2] = [3, 1]; // împărțiri cu frecvență mică
            return true;
        case 5:
            this.ponderi[2][1] *= 3; // împărțiri cu frecvență mare
            return true;
    }
    return false;
};


var T;
