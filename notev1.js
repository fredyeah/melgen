//const { get } = require("http");

inlets = 1;
outlets = 2;
var i = 'int';
var f = 'float';
var buflen = 16;
var intervals = {
    unison: {maj: 0, min: 0}, 
    second: {maj: 2, min: 1}, 
    third: {maj: 4, min: 3}, 
    fourth: {maj: 5, min: 5}, 
    fifth: {maj: 7, min: 7}, 
    sixth: {maj: 9, min: 8}, 
    seventh: {maj: 11, min: 10}, 
    oct: {maj: 12, min: 12}
}
var steps = [
    {maj: 0, min: 0, dim: 0, aug: 0}, 
    {maj: 2, min: 1, dim: 1, aug: 2}, 
    {maj: 4, min: 3, dim: 3, aug: 4}, 
    {maj: 5, min: 5, dim: 5, aug: 6}, 
    {maj: 7, min: 7, dim: 6, aug: 7}, 
    {maj: 9, min: 8, dim: 8, aug: 9}, 
    {maj: 11, min: 10, dim: 10, aug: 11}, 
    {maj: 12, min: 12, dim: 12, aug: 12}
]

function note(val, len){
    this.val = val; 
    this.len = len; 
}
/*
function buffer() {
    constructor(){
        this.buf = [];
        this.tpnt = 0;
        this.rpnt = 0;
    };
    qu(note){
        this.buf[this.pnt] = note;
        this.len = this.buf.length;
        this.tpnt++; 
        this.tpnt%=24;
    };
};
*/
function buffer(){
    this.buf = []; 
    this.tpnt = 0; 
    this.rpnt = 0;
    this.buflen = 4;
    this.seqplaying = false;
    this.seqbeg = null;
    this.seqset = false;
    this.seqtrans = false;
    this.full = false;
};
buffer.prototype.qu = function(note){
    this.buf[this.tpnt] = note; 
    this.len = this.buf.length;
    this.tpnt++; 
    this.tpnt%=this.buflen;
};
buffer.prototype.pl = function(){
    var cur = this.buf[this.rpnt++];
    this.rpnt%=this.buflen;
    //post(this.buflen);
    outlet(1, cur.len);
    outlet(0, cur.val);
    this.full = false;
}

var buffy = new buffer(); 

function getrand(type, low, hi) {
    if(type == 'int'){
        return(Math.floor(Math.random() * (hi - low)) + low);
    }else if(type == 'float'){
        return((Math.random() * (hi - low)) + low);
    }else{
        //do nothing
    };
};

function fillbuf(){
    for(var x = 0; x < buffy.buflen; x++){
        if((((buffy.tpnt + 1) % buffy.buflen) != buffy.rpnt)){
            var val = steps[getrand(i, 0, 7)].maj + 60;
            var len = getrand(i, 1, 4) * 200;
            //len = 500;
            var n = new note(val, len);
            buffy.qu(n); //tpnt++
        }
        var val = steps[getrand(i, 0, 7)].maj + 60;
        var len = getrand(i, 1, 4) * 200;
        //len = 500;
        var n = new note(val, len);
        buffy.qu(n); //tpnt++
        buffy.full = true;
    }
};

function transpose(){
    for(var x = 0; x < buffy.buflen; x++){
        //post(buffy.buf[x].val);
        //post(buffy.buflen);
        buffy.buf[x].val += 12;
        //buffy.buf[x].val+=10;
        //post(buffy.buf[x].val + "\n");
    }
}; 

function bang() {


    if((getrand(i, 0, 3) == 1) && (buffy.rpnt == buffy.buflen - 1) && (buffy.seqplaying == false) && (buffy.seqset == false) && (buffy.seqtrans == false)){
        //post('playseq');
        
        buffy.seqset = true;
        //buffy.seqplaying = true;
        buffy.seqbeg = ((buffy.rpnt + 1) % buffy.buflen);
    }

    if((buffy.full == false) && (buffy.seqplaying == false) && (buffy.seqset == false) && (buffy.seqtrans == false)){
        post('filling');
        fillbuf(); 
        //post('filling');
    }
    post('\n' + buffy.buf[buffy.rpnt].val + '\n');
    buffy.pl(); //rpnt++
    
    if(buffy.seqset == true){
        post('seq beg');
        if(((buffy.rpnt + 1) % buffy.buflen) == buffy.seqbeg){
            buffy.seqplaying = true;
        }
    }

    if(buffy.seqplaying == true){
        if(buffy.seqtrans == false){
            post('seq transposed');
            transpose();
            buffy.seqtrans = true;
        }
        else if(((buffy.rpnt + 1) % buffy.buflen) == buffy.seqbeg){
            post('seq end');
            buffy.seqplaying = false; 
            buffy.seqset = false;
            buffy.seqtrans = false;
        }
    }
/*
    for(var x = 0; x < buffy.buf.length; x++){
        post(buffy.buf[x].val);
    };
    post('\n');
*/
};
