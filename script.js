// damn JS might be hard to learn
// anyway

// i heard this was good to avoid having bad practise
// it raises errors when i try to use an undeclared variable
"use strict"

// define entries
const lat1_box =  document.getElementById('lat1');
const long1_box = document.getElementById('long1');
const lat2_box =  document.getElementById('lat2');
const long2_box = document.getElementById('long2');
const dist_box =  document.getElementById('dist');

// declare other vars
const angles = [-90, 0, 90, 180];

// calculation func
function calculate_laylines(lat1,long1,lat2,long2,dist) {
    // declare vars and objects
    let leyline_distance;
    let list_add = [];
    let list_sub = [];
    let combined_list = [];
    let list_result = [];

    // JS magic formula
    leyline_distance = (655 * Math.sqrt((lat2-lat1)**2 + (long2-long1)**2)) / dist;

    // get leylines for each major angle
    list_add = angles.map(angle => angle + (leyline_distance / 2));
    list_sub = angles.map(angle => angle - (leyline_distance / 2));
    combined_list = list_add.concat(list_sub);

    // check for leylines that are out of range
    for (let i = 0; i < combined_list.length; i++) {
        if (combined_list[i] > 180)  {combined_list[i] -= 360;}
        if (combined_list[i] < -180) {combined_list[i] += 360;}
    }
    
    // rounding and sorting
    list_result = combined_list.map(leyline => leyline.toFixed(2));
    list_result.sort(function(a,b) {return b - a});
    

}

// locate button func
document.getElementById('locate-button').onclick = function(){
    let lat1 =  Number(lat1_box.value);
    let long1 = Number(long1_box.value);
    let lat2 =  Number(lat2_box.value);
    let long2 = Number(long2_box.value);
    let dist =  Number(dist_box.value);
    // either alert errors here or have input validation
    // definetely have an alert when one of them is not filled out
    calculate_laylines(lat1,long1,lat2,long2,dist);
}

// clear button func
