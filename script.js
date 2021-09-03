
const hoursEL = document.getElementById('hours');
const minsEL = document.getElementById('mins');
const secsEL = document.getElementById('secs');
const title = document.getElementById('title');
const submit = document.getElementById('submit');
const cdn = document.getElementById('cnt-dn-container');
const btn = document.getElementById('btn-container');
const task = document.getElementById('task');
const mySessionMusic = document.getElementById('music');
const myBreakMusic = document.getElementById('break-music');
const all_items = document.getElementById('all-items');
const active_items = document.getElementById('active-items');
const completed_items = document.getElementById('completed-items');
const left_items = document.getElementById('left-items');
const reset = document.getElementById('reset');
const pause = document.getElementById('pause');
const play = document.getElementById('play');
const add_task = document.getElementById('add-task');
play.style.display = 'none';
//mySessionMusic.autoplay = true;
//mySessionMusic.style.display = 'none';
//mySessionMusic.loop = true;
//mySessionMusic.pause();
myBreakMusic.autoplay = true;
myBreakMusic.style.display = 'none';
myBreakMusic.loop = true;
myBreakMusic.pause();
task.style.display = 'none';
cdn.style.display = 'none';
btn.style.display = 'none';
title.style.display = 'none';
let sessionTimer = 0;
let breakTimer = 0;
let breakMusicTimer = -1;

let speech = new SpeechSynthesisUtterance();
speech.lang = "en";
speech.text = "Session started";
voices = speechSynthesis.getVoices();


speech.voice = voices[0];

function countdown(secns_t) {
    
    const seconds = secns_t;
    const hours = Math.floor(seconds / 3600) % 24;
    const mins = Math.floor(seconds / 60) % 60;
    const secs = Math.floor(seconds) % 60;
    //console.log("hello there");
    //console.log(hours, mins, seconds);

    hoursEL.innerHTML = formatTime(hours);
    minsEL.innerHTML = formatTime(mins);
    secsEL.innerHTML = formatTime(secs);
    
}

function formatTime(time) {
    return time < 10 ? (`0${time}`) : time;
}

function arrayRemove(arr, value) { 
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}
//countdown(sessionTimer);
let cycles = -1;
let currentTimer = sessionTimer;
let flag = 0;
title.innerText = 'Session';
let all_items_list = [];
let active_items_list = [];
let completed_items_list = [];
let left_items_list = [];
let isPaused = false;
let isReset = false;
let isLeftInBetween = false;
//let isCompleted = false;
function startPomodoro(taskvalue) {
var session_interval = setInterval(function() {
    
    if(isReset) {
        clearInterval(session_interval);
    }
    if(!isPaused) {
    countdown(currentTimer);
    if(breakMusicTimer>0) {
        breakMusicTimer++;
    }
    if(breakMusicTimer==5) {
        myBreakMusic.pause();
        breakMusicTimer = -1;
    }
    if(currentTimer===0) {
        if(flag===0) {
            //console.log("flag setting to 1");
            flag = 1;
            currentTimer = breakTimer;
            //mySessionMusic.pause();
            //myBreakMusic.play();
            
            breakMusicTimer=1;
            title.innerText = 'Break';
            speech.text = "Break started"
            speechSynthesis.speak(speech);
            countdown(currentTimer);
        }
        else {
            //console.log("flag setting to 0");
            cycles = cycles-1;
            flag = 0;
            if(cycles===0) {
                console.log(`${taskvalue} ended`);
                title.innerText = 'Completed';
                speech.text = "Task completed";
                speechSynthesis.speak(speech);
                //isCompleted = true;
                countdown(0);
                //mySessionMusic.pause();
                completed_items_list.push(taskvalue);
                active_items_list = arrayRemove(active_items_list, taskvalue);
                showActiveItems();
                showCompletedItems();
                clearInterval(session_interval);
            }
            else {
            flag = 0;
            currentTimer = sessionTimer;
            //myBreakMusic.pause();
            //mySessionMusic.play();
            breakMusicTimer = 0;
            title.innerText = 'Session';
            speech.text = "Session started"
            speechSynthesis.speak(speech);
            countdown(currentTimer);
            }
            
        }
    }
    /*
    if(isLeftInBetween) {
        mySessionMusic.pause();
        myBreakMusic.pause();
        left_items_list.push(taskvalue);
        active_items_list = arrayRemove(active_items_list, taskvalue);
        showLeftItems();
        isLeftInBetween = false;
        clearInterval(session_interval);
        
    }
    */
    
    
    
    //console.log(currentTimer, flag);
    currentTimer--;} 
}, 1000);
}

//startPomodoro();
/*
var break_interval = setInterval(function() {
    if(breakTimer===0) {
        clearInterval(break_interval);
    }
    countdown(breakTimer);
    breakTimer--;
}, 1000);
*/
function showAllItems() {
    s = '<ul>';
    for(let i = 0; i < all_items_list.length; i++) {
        s += `<li>${all_items_list[i]}</li><hr>`;
    }
    s += '</ul>';
    all_items.innerHTML = s;
}
function showActiveItems() {
    s = '<ul>';
    for(let i = 0; i < active_items_list.length; i++) {
        s += `<li>${active_items_list[i]}</li><hr>`;
    }
    s += '</ul>';
    active_items.innerHTML = s;
}
function showCompletedItems() {
    s = '<ul>';
    for(let i = 0; i < completed_items_list.length; i++) {
        s += `<li><s>${completed_items_list[i]}</s></li><hr>`;
    }
    s += '</ul>'
    completed_items.innerHTML = s;
}
function showLeftItems() {
    s = '<ul>Left In Between';
    for(let i = 0; i < left_items_list.length; i++) {
        s += `<li>${left_items_list[i]}</li>`;
    }
    s += '</ul>'
    left_items.innerHTML = s;
}

submit.addEventListener('click', () => {
    //mySessionMusic.style.display = 'flex';
    isPaused = false;
    isReset = false;
    title.innerText = 'Session';
    play.style.display = 'none';
    pause.style.display = 'flex';
    add_task.style.display = 'none';
    const hours_session = document.getElementById('hours-session');
    const mins_session = document.getElementById('mins-session');
    const secs_session = document.getElementById('secs-session');
    const mins_break = document.getElementById('mins-break');
    const secs_break = document.getElementById('secs-break');
    const cycle_value = document.getElementById('cycle');
    const input_task = document.getElementById('inputTask');
    const session_value = parseInt(hours_session.value, 10)*3600+parseInt(mins_session.value, 10)*60+parseInt(secs_session.value, 0);
    const break_value = parseInt(mins_break.value, 10)*60+parseInt(secs_break.value, 10);
    const dc = document.getElementById('duration-text-container');
    const bc = document.getElementById('break-text-container');
    const cc = document.getElementById('cycle-text-container');
    const sc = document.getElementById('submit-button-container');
    input_task.style.display = 'none';
    task.innerText = input_task.value;
    all_items_list.push(input_task.value);
    active_items_list.push(input_task.value);
    title.style.display = 'flex';
    task.style.display = 'flex';
    //mySessionMusic.play();
    showAllItems();
    showActiveItems();

    
    dc.style.display = 'none';
    bc.style.display = 'none';
    cc.style.display = 'none';
    sc.style.display = 'none';
    cdn.style.display = 'flex';
    btn.style.display = 'flex';
    
    //console.log(document.getElementById('hours-session'));
    //console.log(break_value);
    cycles = cycle_value.value;
    sessionTimer = session_value;
    breakTimer = break_value;
    currentTimer = sessionTimer;
    //session_value.value = '';
    //cycle_value.value = '';
    //break_value.value = '';
    speech.text = "Session started"
    speechSynthesis.speak(speech);
    startPomodoro(input_task.value);
    //showCompletedItems();
    //completed_items_list.push(input_task.value);
    

});

reset.addEventListener('click', () => {
    //mySessionMusic.pause();
    //mySessionMusic.style.display = 'none';
    myBreakMusic.pause();
    isPaused = true;
    isReset = true;
    
    title.style.display = 'none';
    task.style.display = 'none';
    add_task.style.display = 'flex';
    const dc = document.getElementById('duration-text-container');
    const bc = document.getElementById('break-text-container');
    const cc = document.getElementById('cycle-text-container');
    const sc = document.getElementById('submit-button-container');
    const input_task = document.getElementById('inputTask');
    active_items_list = arrayRemove(active_items_list, input_task.value);
    showActiveItems();
    dc.style.display = 'flex';
    bc.style.display = 'flex';
    cc.style.display = 'flex';
    sc.style.display = 'flex';
    cdn.style.display = 'none';
    btn.style.display = 'none';
    input_task.style.display = 'flex';
});
/*
pause.addEventListener('click', () => {
    //mySessionMusic.pause();
    //myBreakMusic.pause();
    if(pause.innerText === 'Play') {
        isPaused = false;
        if(flag===1) {
            myBreakMusic.play();
        }
        else {
            mySessionMusic.play();
        }
        pause.innerText = 'Pause';
    }
    else {
        isPaused = true;
        pause.innerText = 'Play';
    }
});
*/

pause.addEventListener('click', () => {
    isPaused = true;
    pause.style.display = 'none';
    play.style.display = 'flex';
});

play.addEventListener('click', () => {
    isPaused = false;
    play.style.display = 'none';
    pause.style.display = 'flex';
    if(flag===1) {
        //myBreakMusic.play();
        speech.text = "Break started"
        speechSynthesis.speak(speech);
    }
    else {
        //mySessionMusic.play();
    }
});


//background-color: rgba(0, 0, 0, 0.37);