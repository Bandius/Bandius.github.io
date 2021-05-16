MQTTclient = new Paho.MQTT.Client("openlab.kpi.fei.tuke.sk", 80, "/mqtt", "map_simulator_" + new Date() + (Math.random() * 1000));
MQTTclient.onConnectionLost = onConnectionLost;
MQTTclient.onMessageArrived = onMessage;
MQTTclient.connect({onSuccess: onConnect});

var finished = false;
const TOPIC = 'experiments/mapPositions/ib149cd/0';
const TOPIC_VOICE = 'experiments/voice/recognition/ib149cd';

// topics for openlab:
// const TOPIC_VOICE = 'openlab/voice/recognition';
// const TOPIC_

function onConnect(){
    console.log("connected to MQTT");
    subscribe();
}
var ano = ["ano", "áno"]
function onMessage(message) {
    msg = JSON.parse(message.payloadString);
    // console.log(msg);
    if (message.destinationName == 'experiments/voice/recognition/ib149cd'){
        if(msg.status == "recognized"){
            console.log(msg.recognized);
            if (ano.includes(msg.recognized)){
                changeScreen();
            }
        }
    }else{
        position = msg.positions[0];
        console.log(position);
        if(!finished){
            checkPosition(position[0], position[1]);
        }
    }
    
    
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

function subscribe(){
    MQTTclient.subscribe(TOPIC);
    MQTTclient.subscribe(TOPIC_VOICE);
    console.log("Subscribed!");
}

function unsubscribe(){
    MQTTclient.unsubscribe(TOPIC);
    MQTTclient.subscribe(TOPIC_VOICE);
}
//---------------------------------------------------------------------

const displays = [[735, 770],[680, 715],[625, 660],[570, 605],[510, 550]];
let correct_display = 0;
let detected_display;
let delay = false;
var repeater;

function gameCompleted(){
    finished = true;
    var win = new Audio("../assets/audio/win.mp3");
    win.play();
}

function nope(){
    var nope = new Audio("../assets/audio/nope.mp3");
    nope.play();
}

// window.onload = changeScreen();
function timer(){
    if(!finished){
        console.log(delay);
        if ((detected_display == correct_display) && delay){
            clearInterval(repeater);
            gameCompleted();
        }
        console.log("tick");
        if (detected_display == correct_display){
            delay = true;
        }
        repeater = setTimeout(timer, 3000);
    }
}

// function olaSay(text){
//     var content = JSON.stringify( {"say" : text});
//     var message = new Paho.MQTT.Message(content);
//     message.destinationName = "openlab/audio";
//     MQTTclient.send(message);
// }

function changeScreen(){
    // const info1 = 'V tejto hre budete počuť zvuky zvierat. Vašou úlohou bude nájsť na obrazovkách okolo seba to správne zvieratko.';
    // olaSay(info1);
    setTimeout(function (){
        // playSound();
        correct_display = Math.floor(Math.random() * 5);
        console.log(">> display:",correct_display+1);
        correctDisplay(correct_display);
        document.getElementById('text').innerHTML = "Teraz počúvaj!";
        playSound();
    }, 1000);
}

function playSound(){
    var cow = new Audio("../assets/audio/cow.mp3");
    var cat = new Audio("../assets/audio/cat.mp3");
    var dog = new Audio("../assets/audio/dog.mp3");
    var animal = Math.floor(Math.random() * 3);
    showAnimalsOnScreens();
    setTimeout(function (){
        switch(animal){
            case 0:
                var play = cow.play();
                break;
            case 1:
                var play = cat.play();
                break;
            case 2:
                var play = dog.play();
                break;
        }
        findAnimal(animal)
    }, 2000);
}

function showAnimalsOnScreens(){
    // this function will render images on screens around main display (3x3)
    // vertical displays (1-5) [ openlab/screen/(11-15)/url ]
    // projectors (1,2) [ openlab/screen/(21,22)/url ]
}

function findAnimal(type){
    const info2 = 'Nájdi toto zvieratko okolo seba.';
    document.getElementById('text').innerHTML = "Nájdi toto zvieratko okolo seba.";
    // show pictures of animals on screens
}

// returns current display based on position
function checkPosition(x, y){
    if (y >= 440 && y <= 470){
        for (let i = 0; i < 5; i++){
            if(x >= displays[i][0] && x <= displays[i][1]){
                if (i != detected_display){
                    console.log("Display", i+1);
                    detected_display = i
                    delay = false;
                    clearInterval(repeater);
                    timer();
                    
                }
                
            }
        }
    }
}