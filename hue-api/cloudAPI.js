/**
 * Created by guven on 21/04/15.
 */

var morse = require('morse-node').create("ITU");
var hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    api = undefined;
    lightState = hue.lightState;
    state = lightState.create();
    debugMode = false;


var displayResult = function(result) {
    if(debugMode)
        console.log(result+"\n");
};


exports.configure = function(hostName,username){
    api = new HueApi(hostName, username);
    displayResult(api);
}

exports.setDebugMode = function(isDebugMode){
    debugMode = isDebugMode;
}

exports.turnOnLight = function(lightNumber){
    api.setLightState(lightNumber, state.on())
        .then(displayResult)
        .done()
}

exports.turnOffLight = function(lightNumber){
    api.setLightState(lightNumber, state.off())
        .then(displayResult)
        .done()
}

exports.turnBlinkerOn = function(blinkInterval){
    var turnBlinkerOnCore = function(result){
        api.setLightState(1,state.alertShort(),function(err,result){
            if(err) throw err;
            setTimeout(function(){turnBlinkerOnCore()},blinkInterval);
        });
    };

    turnBlinkerOnCore();
}

exports.morseText= function(lightNumber,message){

    var morse = require('morse-node').create("ITU");
    var msg = morse.encode(message);
    if(msg[msg.length-1]==' ')
        msg = msg.substring(0,msg.length-1);


    displayResult(msg);

    var i = 0;

    var morseTextCore = function(morseChar){
        if(i>morseChar.length)
            return;

        displayResult(morseChar.length + " " + i);

        if(morseChar[i] == '-'){
            displayResult("- : "+morseChar[i]);
            api.setLightState(1, state.alert("select"), function(err, result) {
                if (err) throw err;
                displayResult(result);
                displayResult(morseChar[i]);
                setTimeout(function(){
                        i++,
                    morseTextCore(morseChar),
                        displayResult(i)},
                    3000);

            });
        }else if (morseChar[i] == '.'){
            displayResult(". : "+morseChar[i]);
            api.setLightState(1, state.alert("select"), function(err, result) {
                if (err) throw err;
                displayResult(result);
                displayResult(morseChar[i]);
                setTimeout(function(){
                        i++,
                    morseTextCore(morseChar),
                        displayResult(i)},
                    1000);

            });
        }else if (morseChar[i] == ' '){
            displayResult(morseChar[i]);
            setTimeout(function(){
                    i++,
                morseTextCore(morseChar),
                    displayResult(i)},
                3000);
        }else if (morseChar[i] == '/'){
            displayResult(morseChar[i]);
            setTimeout(function(){
                    i++,
                morseTextCore(morseChar),
                    displayResult(i)},
                7000);
        }else{
            return;
        }

    };

    morseTextCore(msg);
}