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
const results =   document.getElementById('results');

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

    // if on mobile, scroll down to the results
    if (window.matchMedia('(max-width: 860px)').matches) {
        results.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
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

    // check if all boxes are filled out (and not NaN)
    boxes.forEach(box => {
        // nuh-uh animation if not
        if (box.value === '' || box.value === '-') {
            locate.style.animation = 'none';
            void locate.offsetWidth; //force reflow (???)
            locate.style.animation = 'nuh-uh 0.1s';
            locate.style.animationIterationCount = 3;
        }
        // spin animation and calculate (with delay) if all good
        else {
            alert_yn = false;
            locate.classList.add('spinning');
            setTimeout(() => {
                locate.classList.remove('spinning');
                calculate_laylines(lat1,long1,lat2,long2,dist);
            }, 500);
        }
    })
}
// apply to button
locate.onclick = () => {send_inputs()}

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

    // scroll to top if on mobile
    if (window.matchMedia('(max-width: 860px)').matches) {
        window.scrollTo({
            behavior: 'smooth',
            top: 0
        });
    }
}

// go to next input when you press enter
boxes.forEach((box, idx) => {
    box.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (idx < boxes.length - 1) { boxes[idx + 1].focus(); }
            else { send_inputs(); }
        }
    });
});
