//const { get } = require("http");

//const { get } = require("http");

inlets = 2;
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

function buffer(){
    this.buf = []; 
    this.tpnt = 0; 
    this.rpnt = 0;
    this.buflen = 8;
    this.seqstate = 0;
    this.seqbeg = null;
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
    
    //for(var d = 0; d < 1000; d++);
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

function fillbuf(type){
    for(var x = 0; x < buffy.buflen; x++){
        if(((((buffy.tpnt + 1) % buffy.buflen) != buffy.rpnt)) || (type == 'force')){
            var val = steps[getrand(i, 0, 8)].maj + 60;
            var len = getrand(i, 1, 4) * 250;
            //len = 500;
            var n = new note(val, len);
            var last = (buffy.tpnt + (buffy.buflen - 1)) % buffy.buflen;
            if(buffy.buf[last]){
                if(buffy.buf[last].val == steps[6].maj + 60){
                    n.val = steps[7].maj + 60;
                    //post('\nresolve!', buffy.buf[last].val, n.val);
                }
                if(buffy.buf[last].val == steps[3].maj + 60){
                    n.val = steps[4].maj + 60;
                }
                if(buffy.buf[last].val == steps[1].maj + 60){
                    if(getrand(i, 0, 2)){
                        n.val = steps[2].maj + 60;
                    }else{
                        n.val = steps[0].maj + 60;
                    }
                }
            }
            buffy.qu(n); //tpnt++
        }else{
            
        }
/*  
        var val = steps[getrand(i, 0, 7)].maj + 60;
        var len = getrand(i, 1, 4) * 200;
        var n = new note(val, len);
        buffy.qu(n); //tpnt++
        buffy.full = true;
*/
    }
    buffy.full = true;
};

function transpose(){
    for(var x = 0; x < buffy.buflen; x++){
        buffy.buf[x].val += 12;
    }
}; 

function bang() {
    if((getrand(i, 0, 3) == 1) && (buffy.rpnt == buffy.buflen - 1) && (buffy.seqstate == 0)){
        buffy.seqbeg = ((buffy.rpnt + 1) % buffy.buflen);
        buffy.seqstate = 1;
    }

    if((buffy.full == false) && ((buffy.seqstate == 0) || (buffy.seqstate == 3))){
        fillbuf(); 
    }

    post('\nbeat: ' + buffy.seqstate + '    note: ' + buffy.buf[buffy.rpnt].val);
    buffy.pl(); //rpnt++
    if(buffy.seqstate == 1){
        if(((buffy.rpnt + 1) % buffy.buflen) == buffy.seqbeg){
            buffy.seqstate = 2;
        }
    }
    if(buffy.seqstate == 2){
        if(buffy.seqtrans == false){
            transpose();
            buffy.seqtrans = true;
        }
        else if(((buffy.rpnt + 1) % buffy.buflen) == buffy.seqbeg){
            buffy.seqstate = 3;
            fillbuf('force');
            buffy.seqtrans = false;
        }
    }
    else if(buffy.seqstate == 3){
        if(((buffy.rpnt + 1) % buffy.buflen) == buffy.seqbeg){
            buffy.seqstate = 0;
        }
    }
};
