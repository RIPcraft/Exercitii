
//-----------------------------------------------------------------------------------------------------------------------------------//
function Cadru(X, Y, L, H, element) { this.X = X || 0; this.Y = Y || 0; this.L = L || 0; this.H = H || 0; this.element = element; }
Cadru.prototype.extins = function (factor) { return new Cadru(this.X - (factor = factor || 0), this.Y - factor, this.L + factor * 2, this.H + factor * 2); }
Cadru.prototype.centru = function (X, Y) { return new Centru(this.X + (X || (this.L / 2)), this.Y + (Y || (this.H / 2))); }
Cadru.prototype.copiază = function (cadru) { this.X = cadru.X; this.Y = cadru.Y; this.L = cadru.L; this.H = cadru.H; }
//-----------------------------------------------------------------------------------------------------------------------------------//
function Centru(X, Y) { this.X = X || 0; this.Y = Y || 0 }
Centru.prototype.identic = function () { return new Centru(this.X, this.Y); }
//-----------------------------------------------------------------------------------------------------------------------------------//
function Derivează(clasă) { var derivat = function () { }; derivat.prototype = clasă.prototype; return new derivat; }
//===================================================================================================================================//
function Expresie(cadru, centru, selectabil, fundal) {
    this.părinte = null;
    this.cadru = cadru || new Cadru(0, 0, 10, 10);
    this.centru = centru || this.cadru.centru();
    this.selectabil = selectabil || this.cadru.extins();
    this.fundal = fundal || Renderer.creazăElement(this.cadru.extins(Expresie.margine));
    this.tip = 'Expresie';
}
Expresie.prototype.activează = function (tastă) {
    this.selectabil.element = Renderer.creazăElement(this.selectabil);
    var _this = this, E = this.selectabil.element, _indică = function () { _this.indică(tastă); }, _dezIndică = function () { _this.dezIndică(tastă); },
        _apasă = function () { if (_this.apăsată) { if (_this.apăsată == 1) _this.apasă(3); else if (_this.apăsată % 3) _this.apăsată *= 3; } else _this.apasă(tastă); },
        _selectează = function () { if (_this.apăsată) { if (_this.apăsată % 3 == 0) _this.apăsată /= 3; if (_this.apăsată == 1) _this.selectează(tastă); } else _this.selectează(tastă); };
    E.onmouseenter = _indică;
    E.onmouseleave = _dezIndică;
    E.onmousedown = _apasă;
    E.onmouseup = _selectează;
    //this.selectabil.element. = _selectează;
    this.nuanțează(tastă);
}
Expresie.prototype.nuanțează = function (tastă) { if(this.cadru.element) Renderer.nuanțează(this.cadru.element, tastă ? 'tastabil' : 'selectabil'); for (var i in this.copii) this.copii[i].nuanțează(tastă); }
Expresie.prototype.dezactivează = function () { var e; (e = this.selectabil.element).onmouseenter = e.onmouseleave = e.onmousedown = e.onmouseup = undefined; Renderer.nuanțează(this.cadru.element, 'simbol'); }
Expresie.prototype.activeazăTot = function () { this.activează(); for (var i in this.copii) this.copii[i].activeazăTot(); }
Expresie.prototype.dezactiveazăTot = function () { for(var i in this.copii) this.copii[i].dezactiveazăTot(); this.dezactivează(); }
Expresie.prototype.ajusteazăZone = function () { if (this.copii) for (var i = 0; i < this.copii.length; i++) this.copii[i].ajusteazăZone(); }
Expresie.prototype.indică = function (tastă) {
    Renderer.nuanțează(this.fundal, tastă ? ('tastă' + (tastă !== true ? 'Indicată' : '')) : (this.selectat ? 'selectatIndicat' : 'indicat'));
}
Expresie.prototype.dezIndică = function (tastă) { Renderer.nuanțează(this.fundal, (tastă || !this.selectat) ? 'neIndicat' : 'selectat'); }
Expresie.prototype.apasă = function (tastă) { Renderer.nuanțează(this.fundal, tastă ? 'tastăApăsată' : 'apăsat'); if (tastă && this.apăsată)this.apăsată *= tastă; }
Expresie.prototype.selectează = function (tastă) {
    if (tastă) exercițiu.tastează(this.copie());
    else if (this.selectat) { exercițiu.selectate = exercițiu.selectate.splice(this.selectat - 1, 1); this.selectat = 0; }
    else exercițiu.selectate[(this.selectat = exercițiu.selectate.length + 1) - 1] = this;
    Renderer.nuanțează(this.fundal, tastă ? ('tastă' + (tastă !== true ? 'Indicată' : '')) : (this.selectat ? 'selectatIndicat' : 'indicat'));
}
Expresie.prototype.copie = function () { return new Expresie(this.cadru.extins(), this.centru.identic()); }
Expresie.prototype.copiiCopii = function () { if (!this.copii) return undefined; var i, copii = []; for (i in this.copii) copii[i] = this.copii[i].copie(); return copii; }
Expresie.prototype.copiiTermeni = function () { if (!this.termeni) return undefined; var i, termeni = []; for (i in this.termeni) termeni[i] = this.termeni[i].copie(); return termeni; }
Expresie.prototype.copiiElemente = function () { if (!this.elemente) return undefined; var i, j, elemente = []; for (i in this.elemente) { elemente[i] = []; for (j in elemente[i]) elemente[i][j] = this.elemente[i][j].copie(); return elemente; } }
Expresie.prototype.modifică = function (p, P, d, D) {
    if (this.selectabil.element) {
        if (P > this.selectabil[p]) { this.selectabil[d] -= (P - this.selectabil[p]); this.selectabil[p] = P; }
        if (P + D < this.selectabil[p] + this.selectabil[d]) this.selectabil[d] = P + D - this.selectabil[p];
    }
    if (this.copii && this.copii[0]) for (var i in this.copii) this.copii[i].modifică(p, Math.max(P - this.copii[i].cadru[p], 0), d, Math.min(P + D, this.copii[i].cadru[p] + this.copii[i].cadru[d]) - Math.max(P, this.copii[i].cadru[p]));
}
Expresie.prototype.spațiuMaxim = function (I, P, D) {
    if (this.copii && this.copii.length > 1) {
        var i, p, s, max;
        for (i in this.copii) if (s = this.copii[i].spațiuMaxim(I, P, D)) {
            if (max === undefined) max = s;
            else if ((p = ((0.5 - I) * this.cadru[D] + 2 * I * this.copii[i].cadru[P] - (0.5 - I) * this.copii[i].cadru[D] + s)) < max) max = p;
        }
        return max;
    }
    else return this.selectabil.element ? Math.max(this.cadru[D] * 0.3, 4) : undefined;
}
Expresie.prototype.areElement = function () {
    if (this.selectabil.element) return true;
    if (!this.copii) return false;
    for (var i in this.copii) if (this.copii[i].areElement()) return true;
    return false;
}
Expresie.prototype.semnAritmetic = function () {
    if (!this.semn) return new Semn();
    if (this.semn.tip == 'Semn') return this.semn;
    if (typeof this.semn == 'string' && (this.semn = Semn.recunoaște(this.semn))) return this.semn = new Semn(this.semn);
    return this.semn = new Semn();
}
Expresie.prototype.activeazăTaste = function (taste) { this._activeazăTaste(taste); }
Expresie.prototype._activeazăTaste = function (taste) {
    var i, activ = true;
    for (i in this.copii)
        activ = (this.copii[i]._activeazăTaste(taste) && activ);
    if (activ = !activ) return false;
    for (i in taste) activ = activ || (taste[i] == this.tip);
    if (!activ) return false;
    this.activează(true);
    return true;
}
Expresie.margine = 3;
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//
function Simbol(cod, selectabil, L, H) {
    var simbol;
    switch (this.valoare = cod) {
        case '^': Superiorizare.call(this, simbol = new Simbol('[]'), new Simbol(2)); this.scalare = simbol.cadru.H / this.cadru.H; break;
        case '_': Inferiorizare.call(this, simbol = new Simbol('[]'), new Simbol(1), 2); this.scalare = simbol.cadru.H / this.cadru.H; break;
        default: simbol = Renderer.simbol(this.valoare = cod, L, H); Expresie.call(this, simbol[0], simbol[1], selectabil); break;
    }
    this.tip = 'Simbol';
}
Simbol.prototype = Derivează(Expresie);
Simbol.prototype.activeazăTot = function () { Expresie.prototype.activează.call(this); }
Simbol.prototype.copie = function () { return new Simbol(this.valoare); }
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//
function Cifră(cifră) { Simbol.call(this, this.valoare = Math.abs(Math.floor(cifră)) % 10); this.tip = 'Cifră'; }
Cifră.prototype = Derivează(Simbol);
Cifră.prototype.copie = function () { return new Cifră(this.valoare); }
//-----------------------------------------------------------------------------------------------------------------------------------//
function Semn(semn, recunoaște) { Simbol.call(this, this.valoare = (recunoaște ? Semn.recunoaște(semn) : semn) || '+'); this.tip = 'Semn'; }
Semn.prototype = Derivează(Simbol);
Semn.recunoaște = function (semn) {
    var i = semn.length - 1, s;
    while (i >= 0 && "+-".indexOf(semn[i--]) < 0);
    if (++i < 0) return undefined;
    if (i < 1) return semn[i];
    if ("+-".indexOf(s = semn[i - 1]) < 0) return semn[i];
    if (semn[i] == s) return semn[i];
    return s + semn[i];
}
Semn.prototype.copie = function () { return new Semn(this.valoare); }
Semn.prototype.opus = function () { return new Semn(this.valoare[1] ? (this.valoare[1] + this.valoare[0]) : (this.valoare == '+' ? '-' : '+')); }
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//
function Alipire(copii) {
    if (!copii.length) copii = [copii];
    else for (i in copii) if (!copii[i].părinte) copii[i].părinte = this;
    else if (copii[i].părinte.length) copii[i].părinte.push(this);
    else copii[i].părinte = [copii[i].părinte, this];
    this.copii = copii;
    if (copii.length > 1) Expresie.call(this);
    else Expresie.call(this, copii[0].cadru.extins(), copii[0].centru, copii[0].selectabil, copii[0].fundal);
    this.tip = 'Alipire';
}
Alipire.prototype = Derivează(Expresie);
Alipire.prototype.copie = function () { return new Alipire(this.copiiCopii()); }
Alipire.prototype._centreazăCopii = function (P, D) {
    var i, început = 0, sfârșit = 0;
    for (i in this.copii) if(this.copii[i]) {
        this.cadru[D] = this.copii[i].centru[P];
        if (început < this.cadru[D]) început = this.cadru[D];
        this.cadru[D] = this.copii[i].cadru[D] - this.cadru[D];
        if (sfârșit < this.cadru[D]) sfârșit = this.cadru[D];
    }
    for (i in this.copii) if(this.copii[i]) {
        this.cadru[D] = this.copii[i].centru[P];
        if (this.cadru[D] < început) this.copii[i].cadru[P] = început - this.cadru[D];
    }
    this.centru[P] = (this.cadru[D] = început + sfârșit) / 2;
}
Alipire.prototype.centreazăCopii = function (P, D) {
    if (this.copii && this.copii[0]) {
        this._centreazăCopii(P, D);
        this.fundal = Renderer.creazăElement(this.cadru.extins(3));
        this.selectabil[P] = this.cadru[P];
        this.selectabil[D] = this.cadru[D];
    }
}
Alipire.prototype.distanțeazăCopii = function (P, D, distanțiere) {
    if (this.copii && this.copii[0]) {
        this.cadru[D] = 0;
        for (var i = 0; i < this.copii.length; i++) {
            this.copii[i].cadru[P] = this.cadru[D];
            this.cadru[D] += this.copii[i].cadru[D] + distanțiere;
        }
        this.centru[P] = (this.cadru[D] -= distanțiere) / 2;
        this.fundal = Renderer.creazăElement(this.cadru.extins(3));
        this.selectabil[P] = this.cadru[P];
        this.selectabil[D] = this.cadru[D];
    }
}
Alipire.prototype.ajusteazăZone = function (P, D, distanțiere, suprafață) {
    if (this.copii && (this.copii.length > 1)) {
        distanțiere /= 2;
        var i, p = 0, stânga, dreapta, spațiuMaxim = 0, spațiiMaxime = [];
        for (i = 0; i < this.copii.length - 1; i++) {
            stânga = this.copii[i].spațiuMaxim(-0.5, P, D);
            dreapta = this.copii[i + 1].spațiuMaxim(0.5, P, D);
            spațiuMaxim += (spațiiMaxime[i * 2] = (dreapta === undefined ? 0 : (stânga || 0)) + distanțiere) + (spațiiMaxime[i * 2 + 1] = (stânga === undefined ? 0 : (dreapta || 0)) + distanțiere);
        }
        suprafață = Math.min(this.cadru[D] * (suprafață || 0) / spațiuMaxim, 1);
        for (i = 0; i < this.copii.length - 1; i++) {
            this.copii[i].modifică(P, p = Math.max(p - distanțiere, 0), D, this.copii[i].cadru[D] - p - Math.max(spațiiMaxime[i * 2] * suprafață - distanțiere, 0));
            p = spațiiMaxime[i * 2 + 1] * suprafață;
        }
        this.copii[i].modifică(P, p = Math.max(p - distanțiere, 0), D, this.copii[i].cadru[D] - p);
    }
    else this.selectabil.copiază(this.cadru);
}
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//
function Alăturare(copii, distanțiere, indicabilitate) {
    Alipire.call(this, copii);
    this.centreazăCopii('Y', 'H');
    this.distanțeazăCopii('X', 'L', this.distanțiere = distanțiere || 0);
    this.indicabilitate = indicabilitate;
    this.tip = 'Alătirare';
}
Alăturare.prototype = Derivează(Alipire);
Alăturare.prototype.copie = function () { return new Alăturare(this.copiiCopii(), this.distanțiere, this.indicabilitate); }
Alăturare.prototype.ajusteazăZone = function () { Expresie.prototype.ajusteazăZone.call(this); Alipire.prototype.ajusteazăZone.call(this, 'X', 'L', this.distanțiere, this.indicabilitate); }
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//
function Capete(capătStâng, conținut, capătDrept, distanțiere, indicabilitate) { Alăturare.call(this, [capătStâng, this.conținut = conținut, capătDrept], distanțiere, indicabilitate); this.tip = 'Capete'; }
Capete.prototype = Derivează(Alăturare);
Capete.prototype.copie = function () { return new Capete(this.copii[0].copie(), this.conținut.copie(), this.copii[2].copie, this.distanțiere, this.indicabilitate); }
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//
function ParantezeRotunde(conținut, mulabile, distanțiere) {
    if (mulabile) {
        this.deschisă = new Simbol('(', undefined, undefined, conținut.cadru.H + distanțiere * 2);
        this.închisă = new Simbol(')', undefined, undefined, conținut.cadru.H + distanțiere * 2);
    }
    else { this.deschisă = new Simbol('('); this.închisă = new Simbol(')'); }
    Capete.call(this, this.deschisă, conținut, this.închisă, mulabile ? distanțiere : 1, 0.5);
    this.tip = 'ParantezeRotunde';
}
ParantezeRotunde.prototype = Derivează(Capete);
ParantezeRotunde.prototype.copie = function () { return new ParantezeRotunde(this.conținut, 0, this.distanțiere); }
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//
function Număr(număr, cifre, semn) {
    var i = 0, distanțiere = 3.6, spațiuIndicabil = 0.5;
    for (număr += ''; i < număr.length && ".,123456789".indexOf(număr[i]) < 0; i++);
    this.semn = (semn || new Semn(Semn.recunoaște(număr.slice(0, i))));
    if (cifre) { this.copii = cifre; this.parteÎntreagă = this; this.valoare = număr; }
    else { // partea întreagă
        this.copii = (this.valoare = (i = Număr.creazăCifre(număr, i)).valoare) ? i.cifre : [new Cifră(0)];
        if (".,".indexOf(număr[i.i]) >= 0) {
            if ((i = Număr.creazăCifre(număr, i.i + 1)).valoare) this.parteZecimală = new Număr(i.valoare, i.cifre); // partea zecimală
            if (număr[i.i] == '(' && număr[(i = Număr.creazăCifre(număr, i.i + 1)).i] == ')' && (i.valoare || (i.cifre.length && cifre !== false))) this.perioadă = new ParantezeRotunde(new Număr(i.valoare, i.cifre)); // perioada
            if (this.perioadă) this.parteFracționară = this.parteZecimală ? new Alăturare([this.parteZecimală, this.perioadă], 3, 0.5) : this.perioadă; // partea fracționară
            else if (this.parteZecimală && (this.parteZecimală.valoare || cifre !== false)) this.parteFracționară = this.parteZecimală;
        }
        if (this.parteFracționară) {
            spațiuIndicabil = 0; distanțiere = 1.8;
            this.copii = [this.parteÎntreagă = new Număr(this.valoare, this.copii, this.semn), new Simbol(','), this.parteFracționară];
        }
        else this.parteÎntreagă = this;
    }
    Alăturare.call(this, this.copii, distanțiere, spațiuIndicabil);
    if (this.parteFracționară) {
        this.centru = this.parteÎntreagă.centru.identic();
        this.valoare += '.';
        if (this.parteZecimală) this.valoare += this.parteZecimală.valoare;
        if (this.perioadă) this.valoare += '(' + this.perioadă.valoare + ')';
        else this.valoare *= 1;
    }
    else this.valoare *= 1;
    this.tip = 'Număr';
}
Număr.prototype = Derivează(Alăturare);
Număr.prototype.copie = function () { return new Număr(this.valoare, false, this.semn.copie()); }
Număr.crează = function (n) { if (!n.cadru && (typeof n == 'number' || typeof n == 'string')) return ((n += '').length == 1 ? new Cifră(n) : new Număr(n)); return n; }
Număr.creazăCifre = function (număr, i) {
    var cifre = [], valoare = '';
    while (i < număr.length && "0123456789".indexOf(număr[i]) >= 0) {
        cifre.push(new Cifră(număr[i]));
        valoare += număr[i++];
    }
    return { valoare: valoare * 1, cifre: cifre, i: i };
}
//-----------------------------------------------------------------------------------------------------------------------------------//
function Înlănțuire(separator, copii, distanțiere, indicabilitate) {
    var i, înlănțuire = [copii[0]];
    for (i = 1; i < copii.length; i++) {
        înlănțuire.push(i > 1 ? separator.copie() : separator);
        înlănțuire.push(copii[i]);
    }
    Alăturare.call(this, înlănțuire, distanțiere || 12, indicabilitate || 0.3);
    this.termeni = copii;
    this.tip = 'Înlănțuire';
}
Înlănțuire.prototype = Derivează(Alăturare);
Înlănțuire.prototype.copie = function () { return new Înlănțuire(this.copii[1].valoare, this.copiiCopii(), this.distanțiere, this.indicabilitate); }
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//
function ÎnmulțireX(copii) { Înlănțuire.call(this, new Simbol('*x'), copii); this.tip = 'ÎnmulțireX'; }
ÎnmulțireX.prototype = Derivează(Înlănțuire);
ÎnmulțireX.prototype.copie = function () { return new ÎnmulțireX(this.copiiTermeni()); }
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//
function Egalitate(copii) { Înlănțuire.call(this, new Egal(), copii); this.tip = 'Egalitate'; }
Egalitate.prototype = Derivează(Înlănțuire);
Egalitate.prototype.copie = function () { return new Egalitate(this.copiiTermeni()); }
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//
function Supraetajare(copii, distanțiere, indicabilitate) {
    Alipire.call(this, copii);
    this.centreazăCopii('X', 'L');
    this.distanțeazăCopii('Y', 'H', this.distanțiere = distanțiere);
    this.indicabilitate = indicabilitate;
    this.tip = 'Supraetajare';
}
Supraetajare.prototype = Derivează(Alipire);
Supraetajare.prototype.ajusteazăZone = function () { Expresie.prototype.ajusteazăZone.call(this); Alipire.prototype.ajusteazăZone.call(this, 'Y', 'H', this.distanțiere, this.indicabilitate); }
Supraetajare.prototype.copie = function () { return new Supraetajare(this.copiiCopii(), this.distanțiere, this.indicabilitate); }
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//
function Fracție(numărător, numitor) { Supraetajare.call(this, [this.numărător = Număr.crează(numărător), new Simbol('-', undefined, Math.max(this.numărător.cadru.L, (this.numitor = Număr.crează(numitor)).cadru.L)), this.numitor], 1.5, 0.4); this.tip = 'Fracție'; }
Fracție.prototype = Derivează(Supraetajare);
Fracție.prototype.copie = function () { return new Fracție(this.numărător.copie(), this.numitor.copie()); }
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//
function Aliniere(copii, distanțiereX, distanțiereY, suprafațăX, suprafațăY) {
    this.elemente = copii;//Aliniere.standardizeazăElemente(copii);
    this.creazăAlipiri('linii', 'Y', 'H');
    this.creazăAlipiri('coloane', 'X', 'L');
    Alipire.call(this, this.linii);
    this.distanțeazăCopii('Y', 'H', distanțiereY || distanțiereX);
    this.copii = this.coloane;
    this.distanțiere = distanțiereX;
    this.indicabilitate = suprafațăX;
    this.distanțeazăCopii('X', 'L', distanțiereX);
    var i, j, k, m = this.elemente.length, n = this.elemente[0].length;
    this.copii = [];
    for (i in this.coloane) {
        this.coloane[i].cadru.H = this.coloane[i].selectabil.H = this.cadru.H;
        this.coloane[i].fundal = Renderer.creazăElement((new Cadru(0, (k = this.coloane[i].cadru).Y, k.L, k.H)).extins(Expresie.margine));
        this.copii.push(this.coloane[i]);
        this.coloane[i].părinte = this;
    }
    for (i in this.linii) {
        this.linii[i].cadru.L = this.linii[i].selectabil.L = this.cadru.L;
        this.linii[i].fundal = Renderer.creazăElement((new Cadru((k = this.linii[i].cadru).X, 0, k.L, k.H)).extins(Expresie.margine));
        this.copii.push(this.linii[i]);
        this.linii[i].părinte = this;
    }
    for (i = 0; i < m; i++) for (j = 0; j < n; j++) {
        (k = this.elemente[i][j]).cadru.X += this.coloane[j].cadru.X;
        k.cadru.Y += this.linii[i].cadru.Y;
        this.elemente[i][j].părinte = this;
        this.copii.push(k);
    }
    this.tip = 'Aliniere';
}
Aliniere.prototype = Derivează(Alipire);
Aliniere.recunoaște = function (copii) {
    var m, n;
    if (m = copii.length) {
        if (n = copii[0].length) { if (m == 1 && n > 1) for (copii = copii[0], i = 0; i < n; copii[i] = [copii[i++]]); }
        else copii = [copii];
    }
    else copii = [[copii]];
    return copii;
}
Aliniere.prototype.creazăAlipiri = function (d, P, D) {
    var i, j, m = this.elemente, n = m, p;
    if (P == 'X') m = m[0];
    else { n = n[0]; p = 1; }
    m = m.length;
    n = n.length;
    for (this[d] = [], i = 0; i < m; i++) {
        for (this[d][i] = [], j = 0; j < n; j++) this[d][i][j] = this.elemente[p ? i : j][p ? j : i];
        this[d][i] = new Alipire(this[d][i]);
        this[d][i].centreazăCopii(P, D);
    }
}
Aliniere.prototype.ajusteazăZone = function () { var i, j; for (i in this.elemente) for (j in this.elemente[i]) this.elemente[i][j].ajusteazăZone(); }
Aliniere.prototype.copie = function () { return new Aliniere(this.copiiElemente(), this.linii[0].distanțiere, this.coloane[0].distanțiere, this.linii[0].indicabilitate, this.coloane[0].indicabilitate); }
Aliniere.prototype.modifică = function () { }
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//
function Caroiere(copii, latură, distanțiere, extra) {
    Expresie.call(this);
    var i, j, k, element;
    for (this.copii = [], i = k = 0; i < copii.length; i++) for (j = 0; j < copii[i].length; j++) if (copii[i][j]) { this.copii[k] = copii[i][j]; this.copii[k++].părinte = this; }
    Alipire.prototype._centreazăCopii.call(this, 'X', 'L');
    Alipire.prototype._centreazăCopii.call(this, 'Y', 'H');
    for (i = 0, latură = Math.max(latură || 0, this.cadru.L, this.cadru.H) ; i < copii.length; i++) for (element = copii[i][j = 0]; j < copii[i].length; element = copii[i][++j]) {
        if (element && (!i || (element !== copii[i - 1][j])) && (!j || (element !== copii[i][j - 1]))) {
            element.selectabil.L = element.selectabil.H = latură;
            for (k = j + 1; k < copii[i].length && element === copii[i][k]; k++) element.selectabil.L += latură + distanțiere;
            for (k = i + 1; k < copii.length && element === copii[k][j]; k++) element.selectabil.H += latură + distanțiere;
            element.cadru.X = (latură + distanțiere) * j + (k = element.selectabil.L / 2 - element.centru.X); element.selectabil.X = -k;
            element.cadru.Y = (latură + distanțiere) * i + (k = element.selectabil.H / 2 - element.centru.Y); element.selectabil.Y = -k;
            Renderer.redimensionează(element.fundal, element.selectabil.extins(extra || Expresie.margine));
        }
    }
    this.extra = extra;
    this.elemente = copii;
    this.cadru.L = (latură + (this.distanțiere =distanțiere)) * j - distanțiere;
    this.cadru.H = (latură + distanțiere) * i - distanțiere;
    this.centru = this.cadru.centru();
}
Caroiere.prototype = Derivează(Expresie);
Caroiere.prototype.copie = function () { return new Caroiere(this.elemente, this.elemente[0][0].cadru.L, this.distanțiere, this.extra); }
//-----------------------------------------------------------------------------------------------------------------------------------//
function Tastă(simbol, coduri, expresie) {
    Expresie.call(this, simbol.cadru, simbol.centru, simbol.selectabil, simbol.fundal);
    if(simbol.copii) this.copii = [simbol];
    this.activează(!(this.coduri = coduri));
    this.expresie = expresie;
    this.apăsată = 1;
    this.tip = 'Tastă';
}
Tastă.prototype = Derivează(Expresie);
Tastă.prototype.activează = function (dezafectare) {
    Renderer.nuanțează(this.fundal, dezafectare ? 'tastăInactivă' : 'tastă');
    if (dezafectare) { var i, k; this.dezactiveazăTot(); for (i in this.coduri) if (exercițiu.taste[(k = this.coduri[i])] === this) exercițiu.taste[k] = undefined; }
    else {
        Expresie.prototype.activează.call(this, 3);
        for (var i in this.coduri) exercițiu.taste[this.coduri[i]] = this;
        var _this = this, _dezIndică = function () { _this.dezIndică(); };
        this.selectabil.onmouseleave = _dezIndică;
    }
}
Tastă.prototype.dezIndică = function () { Renderer.nuanțează(this.fundal, 'tastă'); }
Tastă.prototype.copie = function () { return this.expresie.copie(); }
//-----------------------------------------------------------------------------------------------------------------------------------//
function Tastatură(copii) { }
Tastatură.prototype = Derivează(Expresie);
Tastatură.prototype.activeazăTaste = function (set) {
    //for (var i in this.copii);
}
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//
function TastaturăNumerică(set) {
    var c0 = new Cifră(0), c1 = new Cifră(1), c2 = new Cifră(2), c3 = new Cifră(3), c4 = new Cifră(4),
        c5 = new Cifră(5), c6 = new Cifră(6), c7 = new Cifră(7), c8 = new Cifră(8), c9 = new Cifră(9),
        sp = new Semn('+'), sm = new Semn('-'), so = new Simbol('*x'), si = new Simbol(':-'),
        sn = new Expresie(), sv = new Simbol(','), se = new Simbol('='), P, E, Z;
    sn.cadru.element = sn.selectabil.element = Renderer.creazăElement(sn.cadru);
    Caroiere.call(this,
        [[    new Tastă(sn),                new Tastă(si, [111, 186, 191], si), new Tastă(so, [ 88, 106],      so),     new Tastă(sm, [109, 189], sm)],
         [    new Tastă(c7, [55, 103], c7), new Tastă(c8, [ 56, 104],      c8), new Tastă(c9, [ 57, 105],      c9), P = new Tastă(sp, [107],      sp)],
         [    new Tastă(c4, [52, 100], c4), new Tastă(c5, [ 53, 101],      c5), new Tastă(c6, [ 54, 102],      c6), P                                ],
         [    new Tastă(c1, [49,  97], c1), new Tastă(c2, [ 50,  98],      c2), new Tastă(c3, [ 51,  99],      c3), E = new Tastă(se, [ 13, 187], se)],
         [Z = new Tastă(c0, [48,  96], c0), Z,                                  new Tastă(sv, [110, 188, 190], sv), E                                ]], 55, 0, -1);
    Tastatură.call(this);
    this.tip = 'TastaturăNumerică';
}
TastaturăNumerică.prototype = Derivează(Tastatură);
//-----------------------------------------------------------------------------------------------------------------------------------//
function TastaturăDirecțională() {
    var ins = new Simbol('?'), hme = new Simbol('?'), pgu = new Simbol('?'),
        del = new Simbol('?'), end = new Simbol('?'), pdn = new Simbol('?'),
        sus = new Simbol('+'), jos = new Simbol('-'), stg = new Simbol('<'), dpt = new Simbol('>');
    Caroiere.call(this, [[new Tastă(ins, [45], ins), new Tastă(hme, [36], hme), new Tastă(pdn, [33], pdn)],
                         [new Tastă(del, [46], del), new Tastă(end, [35], end), new Tastă(pgu, [34], pgu)],
                         [    undefined,                 undefined,                 undefined            ],
                         [    undefined,             new Tastă(sus, [38], sus),     undefined            ],
                         [new Tastă(stg, [37], stg), new Tastă(jos, [40], jos), new Tastă(dpt, [39], dpt)]], 55, 0, -1);
    Tastatură.call(this);
    this.tip = 'TastaturăDirecțională';
}
TastaturăDirecțională.prototype = Derivează(Tastatură);
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//
function TastaturăFizică() { Alăturare.call(this, [new TastaturăDirecțională(), new TastaturăNumerică()], 10); this.scalare = 0.75; }
TastaturăFizică.prototype = Derivează(Alăturare);
TastaturăFizică.prototype.activeazăTaste = function () { this.copii[0].activeazăTaste(); this.copii[1].activeazăTaste(); }
//-----------------------------------------------------------------------------------------------------------------------------------//
function Matrice(copii) {
    copii = Aliniere.recunoaște(copii);
    var i, j; for (i in copii) for (j in copii[i]) copii[i][j] = Număr.crează(copii[i][j]); // adică recunoaște  :)
    ParantezeRotunde.call(this, this.conținut = new Aliniere(copii, 30, 35), true, 10);
    this.elemente = this.conținut.copii;
    this.coloane = this.conținut.coloane;
    this.linii = this.conținut.linii;
    this.tip = 'Matrice';
}
Matrice.prototype = Derivează(ParantezeRotunde);
Matrice.prototype.copie = function () { return new Matrice(this.copiiElemente()); }
//-----------------------------------------------------------------------------------------------------------------------------------//
function Adunare(copii) {
    if (!copii || typeof copii == 'string') copii = [new Semn(copii)];
    else {
        if (!copii.length) copii = [copii];
        if (copii[0].tip != 'Semn') {
            this.termeni = [];
            var i, s;
            for (i = 0; i < copii.length; i++) if (copii[i].tip == 'Adunare') this.termeni.concat(copii[i].termeni); else this.termeni.push(copii[i]);
            copii = ((s = this.termeni[0].semnAritmetic()).valoare == '+') ? [this.termeni[0]] : [s, this.termeni[0]];
            for (i = 1; i < this.termeni.length; i++) { copii.push(this.termeni[i].semnAritmetic()); copii.push(this.termeni[i]); }
        }
    }
    Alăturare.call(this, copii, 9);
    this.tip = 'Adunare';
}
Adunare.prototype = Derivează(Alăturare);
Adunare.prototype.copie = function () { return new Adunare(this.copiiTermeni()); }
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//
function Indexare(bază, index, distanțare, deviere, micșorare) {
    if (micșorare > 0) { Alipire.call(this, [bază, index]); index.cadru.X = bază.cadru.L + distanțare; }
    else { micșorare *= -1; Alipire.call(this, [index, bază]); bază.cadru.X = index.cadru.L * micșorare + distanțare; }
    if (deviere > 0) { bază.cadru.Y = index.cadru.H * micșorare - deviere; this.cadru.H = bază.cadru.Y + bază.cadru.H; }
    else { index.cadru.Y = bază.cadru.H + deviere; this.cadru.H = index.cadru.Y + index.cadru.H * micșorare; }
    this.cadru.L = this.selectabil.L = bază.cadru.L + index.cadru.L * micșorare + distanțare;
    this.fundal = Renderer.creazăElement(this.cadru.extins(3));
    this.centru.Y = bază.cadru.Y + bază.centru.Y;
    this.centru.X = this.cadru.L / 2;
    this.selectabil.H = this.cadru.H;
    index.scalare = micșorare;
}
Indexare.prototype = Derivează(Alipire);
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//
function Superiorizare(bază, indice, distanțare) { Indexare.call(this, bază, indice, distanțare || 5, 9, 0.65); }
Superiorizare.prototype = Derivează(Indexare);
//-----------------------------------------------------------------------------------------------------------------------------------//
function Inferiorizare(bază, indice, distanțare) { Indexare.call(this, bază, indice, distanțare || 5, -9, 0.65); }
Inferiorizare.prototype = Derivează(Indexare);
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//
function Putere(bază, exponent) { Superiorizare.call(this, this.bază = bază, this.exponent = exponent); }
Putere.prototype = Derivează(Superiorizare);
function Egal() { Simbol.call(this, '='); this.tip = 'Egal'; }
Egal.prototype = Derivează(Simbol);
Egal.prototype.selectează = function (tastă) {
    if (!tastă) {
        if (exercițiu.selectate[0]) {

        }
        else if(this.părinte.tip == 'Egalitate') {
            this.părinte.copii = this.părinte.copii.reverse();
            var P = this; while (P.părinte) P = P.părinte;
            Renderer.reprezintă(P);
        }
        else Expresie.prototype.selectează.call(this);
    }
    else Expresie.prototype.selectează.call(this, tastă);
}
