function save_options() {
  var mappingsText = mappings.session.getDocument().getAllLines().join('\n');
  var baseText = base.session.getDocument().getAllLines().join('\n')

  chrome.runtime.sendMessage({ saveOptions: true, mappings: mappingsText, base: baseText },  (response) => {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 2000);
  });
}

function restore_options() {
  chrome.runtime.sendMessage({ loadOptions: true }, (response) => {})
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.options ) {
      mappings.session.getDocument().setValue(request.mappings)
      base.session.getDocument().setValue(request.base)
    }
  });

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

var mappings = ace.edit("mappings");
mappings.setTheme("ace/theme/monokai");
mappings.setOption("showPrintMargin", false)
mappings.session.setMode("ace/mode/json");
mappings.session.setUseWrapMode(true)

var base = ace.edit("base");
base.setTheme("ace/theme/monokai");
base.setOption("showPrintMargin", false)
base.session.setMode("ace/mode/html");
base.session.setUseWrapMode(true)
