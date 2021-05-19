MQTTclient = new Paho.MQTT.Client("openlab.kpi.fei.tuke.sk", 80, "/mqtt", "map_simulator_" + new Date() + (Math.random() * 1000));
MQTTclient.onConnectionLost = onConnectionLost;
MQTTclient.onMessageArrived = onMessage;
MQTTclient.connect({onSuccess: onConnect});

var started = false;
var finished = false;
const TOPIC = 'experiments/mapPositions/ib149cd/0';
const TOPIC_VOICE = 'experiments/voice/recognition/ib149cd';

// topics for openlab:
// const TOPIC_VOICE = 'openlab/voice/recognition';
// openlab/mapPositions/9 a openlab/mapPositions/11

function onConnect(){
    console.log("connected to MQTT");
    subscribe();
}
var start = ["chceme hrať", "chcem hrať"]

function onMessage(message) {
    msg = JSON.parse(message.payloadString);
    // console.log(msg);
    if (message.destinationName == 'experiments/voice/recognition/ib149cd'){
        if(msg.status == "recognized"){
            console.log(msg.recognized);
            if (!started && start.includes(msg.recognized)){
                started = true;
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
    MQTTclient.unsubscribe(TOPIC_VOICE);
}
//---------------------------------------------------------------------

const displays = [[735, 770],[680, 715],[625, 660],[570, 605],[510, 550]];
let correct_display = 0;
let detected_display;
let delay = false;
var repeater;

function gameCompleted(){
    finished = true;
    // var win = new Audio("../assets/audio/win.mp3");
    // win.play();
}

function nope(){
    // var nope = new Audio("../assets/audio/nope.mp3");
    // nope.play();
}

window.onload = setBlankScreens();

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
    const info1 = 'V tejto hre budete počuť zvuky zvierat. Vašou úlohou bude nájsť na obrazovkách okolo seba to správne zvieratko. Ak budete pripravení povedzte mi, Chceme hrať';
    // olaSay("info")
    // olaSay(info1);
    setTimeout(function (){
        // playSound();
        correct_display = Math.floor(Math.random() * 5);
        console.log(">> display:",correct_display+1);
        const text_listen = 'Teraz počúvaj!';
        // olaSay(text_listen);
        showOnScreens("https://raw.githubusercontent.com/Bandius/Bandius.github.io/main/assets/testing_screens/Game1/listen.png", 21);
        document.getElementById('text').innerHTML = text_listen;
        document.getElementById('hraj').style.visibility = 'hidden';

        playSound();
    }, 1000);
}

function playSound(){
    var cow = new Audio("../assets/audio/cow.mp3");
    var cat = new Audio("../assets/audio/cat.mp3");
    var dog = new Audio("../assets/audio/dog.mp3");
    var animal = Math.floor(Math.random() * 3);
    setTimeout(function (){
        // switch(animal){
        //     case 0:
        //         var play = cow.play();
        //         break;
        //     case 1:
        //         var play = cat.play();
        //         break;
        //     case 2:
        //         var play = dog.play();
        //         break;
        // }
        findAnimal(animal)
    }, 2000);
}

const cat_url = "https://raw.githubusercontent.com/Bandius/Bandius.github.io/main/assets/images/screen_cat.png"
const cow_url = "https://raw.githubusercontent.com/Bandius/Bandius.github.io/main/assets/images/screen_cow.png"
const dog_url = "https://raw.githubusercontent.com/Bandius/Bandius.github.io/main/assets/images/screen_dog.png"
const rabbit_url = "https://raw.githubusercontent.com/Bandius/Bandius.github.io/main/assets/images/screen_rabbit.png"
// sheep to be added

function findAnimal(type){
    const info2 = 'Nájdi toto zvieratko okolo seba.';
    showOnScreens("https://raw.githubusercontent.com/Bandius/Bandius.github.io/main/assets/testing_screens/Game1/find.png", 21);
    // olaSay(info2);
    document.getElementById('text').innerHTML = info2;
    switch(type){
        case 0:
            console.log("showing cow on display", correct_display+11);
            // showOnScreens(cow_url, 11+correct_display)
            break;
        case 1:
            console.log("showing cat on display", correct_display+11);
            // showOnScreens(cat_url, 11+correct_display)
            break;
        case 2:
            console.log("showing dog on display", correct_display+11);
            // showOnScreens(dog_url, 11+correct_display)
            break;
    }
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

// function showOnScreens(page, screen){
//     if(MQTTclient.isConnected()){
//         console.log("Showing content on displays");
//         var message = new Paho.MQTT.Message(page)
//         message.destinationName = `openlab/screen/${screen}/url`;
//         MQTTclient.send(message);
//     }else{
//         console.log("Client not connected!!!");
//     }
// }

// function setBlankScreens(){
//     console.log("Setting screens to blank");
//     // vertical screens
//     for (var i = 11; i <= 15; i++){
//         showOnScreens("https://raw.githubusercontent.com/Bandius/Bandius.github.io/main/assets/images/vertical_blank.png", i);
//     }
//     // projectors
//     showOnScreens("https://raw.githubusercontent.com/Bandius/Bandius.github.io/main/assets/testing_screens/Game1/intro.png", 21);
//     showOnScreens("https://raw.githubusercontent.com/Bandius/Bandius.github.io/main/assets/images/background.png", 22);
// }

// function revertScreens(){
//     console.log("Setting screens back to showcase");
//     for (var i = 11; i <= 15; i++){
//         showOnScreens("http://ukazky.kpi.fei.tuke.sk:8080/liveit.html", i);
//     }
// }