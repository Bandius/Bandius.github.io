MQTTclient = new Paho.MQTT.Client("openlab.kpi.fei.tuke.sk", 80, "/mqtt", "voice_simulator_" + new Date() + (Math.random() * 1000));
MQTTclient.onConnectionLost = onConnectionLost;
MQTTclient.onMessageArrived = onMessage;
MQTTclient.connect({onSuccess: onConnect});

const TOPIC = 'experiments/voice/recognition/ib149cd';
// topic for openlab:
// const TOPIC = 'openlab/voice/recognition';

var colors = [];
var detected = [];

// storing texts which will be said by ola
const correct = ["áno", "to bola ona", "pekne", "super"];
const incorrect = ["táto farba tam nebola", "ajaj, skús to ešte raz", "nie nie, toto nie je tá farba"];


var info1 = 'V tejto hre si budete musieť zapamätať farby, ktoré sa vám ukážu.';
var info2 = 'Ste pripravení?';
var info3 = 'Zapamätajte si tieto farby.';

function onConnect(){
    console.log("connected to MQTT");
    subscribe();
}

function onMessage(message) {
    msg = JSON.parse(message.payloadString);
    if(msg.status == "recognized"){
        console.log(msg.recognized);
        saveColor(msg.recognized);
    }
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

function subscribe(){
    MQTTclient.subscribe(TOPIC);
}

function unsubscribe(){
    MQTTclient.unsubscribe(TOPIC);
}

// function olaSay(text){
//     var content = JSON.stringify( {"say" : text});
//     var message = new Paho.MQTT.Message(content);
//     message.destinationName = "openlab/audio";
//     MQTTclient.send(message);
// }

function changeScreen(){
    // olaSay(info1);
    setTimeout(function (){
        document.getElementById('text').innerHTML = `Zapamätajte si tieto farby.`
        // olaSay(info3);
        changeLights();
    }, 2000);
}
window.onload = changeScreen();

var colorsLeft = 4;
function saveColor(color){
    if(colors.includes(color) && !detected.includes(color)){
        if (colorsLeft > 1){
            var yes = new Audio("../assets/audio/yes.mp3");
            yes.play();
            // var random_correct = Math.floor(Math.random() * correct.length);
            // olaSay(correct[random_correct]);
        }
        detected.push(color);
        colorsLeft--;
    }else{
        var nope = new Audio("../assets/audio/nope.mp3");
        nope.play();
        // var random_incorrect = Math.floor(Math.random() * incorrect.length);
        // olaSay(incorrect[random_incorrect]);
    }
    if (colorsLeft == 0){
        var win = new Audio("../assets/audio/win.mp3");
        win.play();
        // const winning_text = "Krásne, uhádli ste všetky farby. Ste veľmi šikovní";
        // olaSay(winning_text);

    } 
}


function changeLights(){
    var cnt = 0;
    var color;
    // var lights;
    setTimeout(function (){
        const interval = setInterval(function (){
            switch (cnt){
                case 0:
                    color="#0000FF";
                    colorStr="modrá";
                    // lights="0000ff00";
                    break;
                case 1:
                    color = "#FF0000";
                    colorStr="červená";
                    // lights="ff000000";
                    break;
                case 2:
                    color = "#00FF00";
                    colorStr="zelená";
                    // lights="00ff0000";
                    break;
                case 3:
                    color = "#FF8800";
                    colorStr="oranžová";
                    // lights="ff880000";
                    break;
            }
            console.log(color);
            colors.push(colorStr);
            document.getElementById('color').style.backgroundColor = color;
            cnt += 1;
            if (cnt === 5){
                clearInterval(interval);
                results();
            }
        }, 1000);
    }, 1000);
}

function results(){
    setTimeout(function (){
        document.getElementById('color').style.backgroundColor = "#7a7a7a";
        document.getElementById('text').innerHTML = "Teraz mi povedzte farby, ktoré ste videli."
    }, 1000);
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