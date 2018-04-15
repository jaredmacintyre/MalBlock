// var pattern = ["https://imgur.com/*", "https://reddit.com*"];
// var pattern = "https://developer.mozilla.org/*";

var pattern = "*://imgur.com/*";
var powerOn = true;

var portFromCS;

function connected(p) {
  portFromCS = p;
  // portFromCS.postMessage({greeting: "hi there content script!"});
  portFromCS.onMessage.addListener(function(m) {
    console.log("In background script, received message from content script")
    console.log(m);
    powerOn = m.power;
    console.log("PowerOn:" + powerOn);
  });
}

browser.runtime.onConnect.addListener(connected);





// var pat = JSON.parse("list.json");
// console.log(pat);
// var pattern = [
//     "https://developer.mozilla.org/*",
//     "https://imgur.com/*",
//     "*.net/*"];



// cancel function returns an object
// which contains a property `cancel` set to `true`
function cancel(requestDetails) {
  console.log("Cancel Request?:" + powerOn);
  if (powerOn == true) {
    console.log("Cancelling: " + requestDetails.url);
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("icons/logo.svg"),
      "title": "Malicious URL Detected",
      "message": "MalBlock has blocked access to " + requestDetails.url + " because we detect malicious activity."
    });

    return {cancel: true};
  } else {
    return {cancel: false};
  }
}

browser.webRequest.onBeforeRequest.addListener(
  cancel,
  {urls:[pattern]},
  ["blocking"]
);