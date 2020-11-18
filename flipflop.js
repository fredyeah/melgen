inlets = 1; 
outlets = 8;
var count = 0;
function bang() {
    if((count % 1) == 0){
        outlet(0, 'bang')
    }
    if((count % 2) == 0){
        outlet(1, 'bang')
    }
    if((count % 4) == 0){
        outlet(2, 'bang')
    }
    if((count % 8) == 0){
        outlet(3, 'bang')
    }
    if((count % 16) == 0){
        outlet(4, 'bang')
    }
    if((count % 32) == 0){
        outlet(5, 'bang')
    }
    if((count % 64) == 0){
        outlet(6, 'bang')
    }
    if((count % 128) == 0){
        outlet(7, 'bang')
    }
    count++;
}
function clear() {
    count = 0;
}