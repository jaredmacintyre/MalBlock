function setItem() {
  console.log("OK");
}
function onError(error) {
  console.log(error)
}

function gotPower(item) {
  console.log(item);
  // console.log(item.power)
}

//Updates the checkbox power switch value to be correct on load
function updateSwitch(item) {
    if (item.power == undefined) {
        powerSwitch.checked = true;
        browser.storage.local.set({
            'power': document.querySelector("#switch").checked
        }).then(setItem, onError);
    }
    else {
        powerSwitch.checked = item.power;
    }
}

function saveOptions(e) {
    // console.log(document.querySelector("#switch").checked);
    //set local setting for the checked box "checked" state
    browser.storage.local.set({
        'power': document.querySelector("#switch").checked
    }).then(setItem, onError);
    myPort.postMessage({power: document.querySelector("#switch").checked});
}

//allows connection b/n this script and background script
var myPort = browser.runtime.connect({name:"port-from-cs"});

var powerSwitch = document.querySelector('#switch');

// browser.storage.local.get("power")
//   .then(gotPower, onError);

powerSwitch.addEventListener('change', saveOptions);

//When the html is loaded, change the checkbox value to be correct
document.addEventListener('DOMContentLoaded', browser.storage.local.get("power")
  .then(updateSwitch, onError), false);