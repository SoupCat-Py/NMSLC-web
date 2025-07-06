// damn JS might be hard to learn
// anyway

// i heard this was good to avoid having bad practise
// it raises errors when i try to use an undeclared variable
"use strict"

// define elements
const lat1_box =  document.getElementById('lat1');
const long1_box = document.getElementById('long1');
const lat2_box =  document.getElementById('lat2');
const long2_box = document.getElementById('long2');
const dist_box =  document.getElementById('dist');
const locate =    document.getElementById('locate-button');
const clear =     document.getElementById('clear-button');

// declare other vars
const angles = [-90, 0, 90, 180];
const boxes = [lat1_box, long1_box, lat2_box, long2_box, dist_box];
const primary =   window.getComputedStyle(document.body).getPropertyValue('--primary');
const danger =    window.getComputedStyle(document.body).getPropertyValue('--danger');
const success =   window.getComputedStyle(document.body).getPropertyValue('--success');
const text_norm = window.getComputedStyle(document.body).getPropertyValue('--text-norm')
const text_dark = window.getComputedStyle(document.body).getPropertyValue('--text-dark')
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
        // get each line element
        let leyline_display = document.getElementById(`l${String(i)}`);
        // show the lines
        leyline_display.style.display = 'block';
        leyline_display.innerHTML = list_result[i];
        leyline_display.style.display = 'block';
        // set copy funcs
        leyline_display.onclick = function() {
            navigator.clipboard.writeText(list_result[i]);
            leyline_display.classList.add('copied');
            setTimeout(() => {
                leyline_display.classList.remove('copied');
            }, 1000);
        }
    }
}

// locate button func
function send_inputs() {
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
    // animations
    locate.style.animation = 'none';
    void locate.offsetWidth; //force reflow (???)
    if (alert_yn) {
        locate.style.animation = 'nuh-uh 0.1s';
        locate.style.animationIterationCount = 3;
    }
    else {
        locate.style.animation = 'click 0.2s';
        locate.style.animationIterationCount = 1;
    }
}
// apply to button
locate.onclick = () => {send_inputs()}


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
    box.oninput = () => { validate_input(box); }
    box.onpaste = () => { setTimeout(() => validate_paste(box),0); }
    box.onblur  = () => { validate_input(box); }
})


// clear button func
clear.onclick = () => {
    // change button color
    clear.style.color = danger;
    setTimeout(() => {
        clear.style.color = text_norm;
    }, 1000);

    // clear all inputs
    lat1_box.value  = '';
    long1_box.value = '';
    lat2_box.value  = '';
    long2_box.value = '';
    dist_box.value  = '';
}

// go to next input when you press enter
boxes.forEach((box, idx) => {
    box.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (idx < boxes.length - 1) { boxes[idx + 1].focus(); }
            else { send_inputs() }
        }
    });
});
