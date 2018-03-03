chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.generateLetter) {
      var blob = new Blob([request.letterText], { type: "text/html" })
      var url = URL.createObjectURL(blob)
      chrome.tabs.create({ url: url })
    } else if (request.saveOptions) {
      chrome.storage.sync.set({
        mappings: request.mappings,
        base: request.base
      }, () => { sendResponse({success: true}) })
    } else if (request.loadOptions) {
      chrome.storage.sync.get({
        mappings: defaultMappings,
        base: defaultBase
      }, (items) => {
        items.options = true; chrome.tabs.sendMessage(sender.tab.id, items, () => {})})
    }
  }
)

chrome.runtime.onInstalled.addListener(function (object) {
  chrome.tabs.create({ url: chrome.extension.getURL("options.html") },  () => {});
});

function httpGet(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous 
  xmlHttp.send(null);
}

var defaultBase = ''
var defaultMappings = ''
httpGet(chrome.extension.getURL("base.html"), (res) => { defaultBase = res })
httpGet(chrome.extension.getURL("mappings.json"), (res) => { defaultMappings = JSON.parse(res) })

