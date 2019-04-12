var pattern = [];
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

var request = new XMLHttpRequest();
request.open('GET', "../scripts/badSites.json", false);  // `false` makes the request synchronous
request.send(null);

if (request.status === 200) {
  pattern = JSON.parse(request.responseText).sites;
  console.log(request.responseText);
}

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
      "message": "MalBlock has blocked access to " + requestDetails.url + " because we've detected malicious activity."
    });

    return {cancel: true};
  } else {
    return {cancel: false};
  }
}

console.log(pattern);
browser.webRequest.onBeforeRequest.addListener(
  cancel,
  {urls:pattern},
  ["blocking"]
);