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
const boxes = [lat1_box, long1_box, lat2_box, long2_box, dist_box];
let alert_yn = false;



// calculation func
function calculate_laylines(lat1,long1,lat2,long2,dist) {

    // declare vars and objects
    let leyline_distance;
    let list_add = [], list_sub = [];
    let combined_list = [], list_result = [];

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

    // replace placeholder with leylines
    // the [0] gets the first (and only) element with that class
    document.getElementsByClassName('results-placeholder')[0].style.display = 'none';
    document.getElementsByClassName('results-shown')[0].style.display = 'flex';

    // show the leylines to the user
    for (let i = 0; i < list_result.length; i++) {
        let leyline_display = document.getElementById(`l${String(i)}`);
        leyline_display.style.display = 'block';
        leyline_display.innerHTML = list_result[i];
        leyline_display.style.display = 'block';
    }
}

// locate button func
document.getElementById('locate-button').onclick = function(){

    // get all the values
    let lat1 =  Number(lat1_box.value);
    let long1 = Number(long1_box.value);
    let lat2 =  Number(lat2_box.value);
    let long2 = Number(long2_box.value);
    let dist =  Math.abs(Number(dist_box.value)); // use absolute value for distance in case user enters a negative

    // alert when boxes aren't filled out right
    boxes.forEach(box => {
        if (box.value === '' || box.value === '-') {
            alert_yn = true;
        }
        else {
            alert_yn = false;
            calculate_laylines(lat1,long1,lat2,long2,dist);
        }
    })
    if (alert_yn) {alert('Please make sure you filled out all the boxes!');}
}

// input validation
// actual functions here
function validate_input(box) {
    let value = box.value;
    if (isNaN(Number(value)) && value != '-') {
        // remove the last character
        box.value = value.slice(0,-1);
    }
}
function validate_paste(box) {
    let value = box.value;
    if (isNaN(Number(value)) && value != '-') {
        // clear the box (ik i'm lazy)
        box.value = '';
    }
}
// apply the function to each box
boxes.forEach(box => {
    box.oninput = function() {validate_input(box)}
    box.onpaste = function() {setTimeout(() => validate_paste(box),0)}
})

// clear button func
document.getElementById('clear-button').onclick = function() {
    lat1_box.value  = '';
    long1_box.value = '';
    lat2_box.value  = '';
    long2_box.value = '';
    dist_box.value  = '';
}
