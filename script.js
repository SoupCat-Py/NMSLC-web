"use strict"
function gebi(id) { return document.getElementById(id); }

// elements
const BOX_LA1 = gebi('lat1');
const BOX_LA2 = gebi('lat2');
const BOX_LO1 = gebi('long1');
const BOX_LO2 = gebi('long2');
const BOX_DIS = gebi('dist');
const BTN_LOC = gebi('btn-locate');
const BTN_CLR = gebi('btn-clear');
const DIV_PLCHLDR = gebi('placeholder-div');
const DIV_RESULTS = gebi('results-div');
const HED_RESULTS = gebi('results-header');

// other vars and data
const boxes = [BOX_LA1, BOX_LO1, BOX_LA2, BOX_LO2, BOX_DIS];
const info_array = [
    [gebi('info-head-1'), gebi('info-body-1'), gebi('drop-icon-1')],
    [gebi('info-head-2'), gebi('info-body-2'), gebi('drop-icon-2')],
    [gebi('info-head-3'), gebi('info-body-3'), gebi('drop-icon-3')]
];
let full_list = [];

// calc func
function calc_lines(lat1, lat2, long1, long2, dist) {
    let line_distance;
    let add_list = [], sub_list = [];
    const angles = [-90, 0, 90, 180];
    
    // magic formula
    line_distance = (655 * Math.sqrt((lat2-lat1)**2 + (long2-long1)**2)) / dist;
    
    // get the longitudes
    add_list = angles.map(angle => angle + (line_distance/2));
    sub_list = angles.map(angle => angle - (line_distance/2));
    
    // combine both lists
    full_list = add_list.concat(sub_list);
    
    // check for out of range
    full_list = full_list.map(line => {
        if (line > 180)  { line = line - 360; }
        if (line < -180) { line = line + 360; }
        return line.toFixed(2);  // rounding
    });
    
    // sort list AFTER range checks
    full_list.sort(function(a, b){return b - a});
    
    // show laylines
    full_list.forEach((line,i) => {
        let LINE_SPAN = gebi(`l${i+1}`);
        LINE_SPAN.innerHTML = String(line);
    });
    
    // hide placeholder and show results divs
    DIV_PLCHLDR.classList.remove('shown'); DIV_PLCHLDR.classList.add('hidden');
    DIV_RESULTS.classList.remove('hidden'); DIV_RESULTS.classList.add('shown');
    HED_RESULTS.innerHTML = 'Leylines at these longitudes:';

    
}

// check inputs and pass to calc
function send_inputs() {
    let box_values = [BOX_LA1.value, BOX_LA2.value, BOX_LO1.value, BOX_LO2.value, BOX_DIS.value];

    if (box_values.every(val => !isNaN(val) && val !== '' && val !== '-')) {
        // send all inputs to the calc function
        calc_lines(box_values[0], box_values[1], box_values[2], box_values[3], box_values[4]);
    }
    else {
        // make BTN_LOC shake
        BTN_LOC.style.animation = 'none';
        void BTN_LOC.offsetWidth; //force reflow (???)
        BTN_LOC.style.animation = 'nuh-uh 0.1s';
        BTN_LOC.style.animationIterationCount = 3;
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

// clear all
function clear_inputs() {

    // clear inputs
    boxes.forEach(box => {box.value='';})

    // show placeholder
    DIV_PLCHLDR.classList.remove('hidden'); DIV_PLCHLDR.classList.add('shown');
    DIV_RESULTS.classList.remove('shown'); DIV_RESULTS.classList.add('hidden');
    HED_RESULTS.innerHTML = 'Leylines will appear here';

}

// show info panels
info_array.forEach(([head, body, icon]) => {
    head.addEventListener('click', function(){
        if (!head.classList.contains('dropped')) {
            head.classList.add('dropped');
            body.classList.remove('hidden'); body.classList.add('shown');
            icon.classList.remove('fa-chevron-down'); icon.classList.add('fa-chevron-left')
        }
        else {
            head.classList.remove('dropped');
            body.classList.remove('shown'); body.classList.add('hidden')
            icon.classList.remove('fa-chevron-left'); icon.classList.add('fa-chevron-down')
        }
    });
});

BTN_LOC.addEventListener('click', send_inputs);
BTN_CLR.addEventListener('click', clear_inputs);