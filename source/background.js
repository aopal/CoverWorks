chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    if (request.generateLetter) {
      var blob = new Blob([request.letterText], { type: "text/html" });
      var url = URL.createObjectURL(blob);
      chrome.tabs.create({ url: url });
    }
  });

