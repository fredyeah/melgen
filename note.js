outlets = 5;
inlets = 5;
var atone = [1, 3, 6, 8, 10];
var count = 0;
var bar = 0; 
var last = 0;
var lastb = 0;
var tfcnt = 0;
var sequence = 'none';
var record = [];
function note(num, len, beat, seq) {
    //confine to 1oct
    num = num % 12;
    //scale 0 2 3 5 7 9 11
    //if num == 1 3 6 8 10, round
    for(var i = 0; i < atone.length; i++){
        if (atone[i] == num){
            num++;
        };
    };
    if(num != 0){
        count++;
    }
    if(count > 6){
        num = 0;
        count = 0;
    }
    if(num == 0){
        count = 0;
    }
    if(last == 9){
        num = 11;
    }
    if(last == 11){
        num = 0;
    }
    if(last == 5){
        num = 7;
    }
    //add 4oct
    num = num + 60;
    outlet(0, num);
    last = num;



    len = len * 250 + 250;
    if(tfcnt == 1){
        len = 250;
    }
    if(len == 250){
        tfcnt++; 
        tfcnt %= 2;
    }
    if(lastb == 750){
        len = 250;
    }
    lastb = len;
    outlet(1, len);





    if((seq == 1) && (beat == 0) && (sequence != 'play')){
        sequence = 'record';
    }
    if(sequence == 'record'){
        record.push({note: num, size: len});
        if(beat == 3){
            sequence = 'play';
        }
    }
    if((sequence == 'play') && (beat == 3)){
        sequence = 'none';
    }
    post(sequence);
}
function len(num, beat) {
    num = num * 250 + 250;
    if(tfcnt == 1){
        num = 250;
    }
    if(num == 250){
        tfcnt++; 
        tfcnt %= 2;
    }
    if(lastb == 750){
        num = 250;
    }
    lastb = num;
    outlet(1, num);
}
function seq(num, beat){
    if((num == 1) && (beat == 0) && (sequence != 'record')){
        sequence = 'record';
    }
}