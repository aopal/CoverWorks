// declare functions
function httpGet(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function printDoc() {
  document.getElementById('preview' + ifrNo).setAttribute('hidden', true);
  printDiv.innerHTML = editor.session.getDocument().getValue();
  window.print();
  document.getElementById('preview' + ifrNo).removeAttribute('hidden');
  printDiv.innerHTML = "";
}

function swap(newSrc) {
  ifr = document.getElementById('preview' + ifrNo);
  ifrNo = 1 - ifrNo;
  ifrHidden = document.getElementById('preview' + ifrNo);

  ifr.onload = null;
  ifrHidden.contentWindow.onload = function () {
    ifr.style.display = 'none';
    ifHidden.style.display = 'block';
  }

  ifrHidden.srcdoc = newSrc;
}


// initialize variables
var ifrNo = 0;
var ifrHidden;
var ifr;
let editDiv = document.getElementById("editor")
let printDiv = document.getElementById('printDiv');
let params = (new URL(document.location)).searchParams;
let editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.setOption("showPrintMargin", false)
editor.setOptions({fontSize:14})
editor.session.setMode("ace/mode/html");
editor.session.setUseWrapMode(true);


// register commands/event listeners
editor.commands.addCommand({
  name: 'save',
  bindKey: { win: "Ctrl-S", "mac": "Cmd-S" },
  exec: function (editor) {
    printDoc();
  }
})

editor.commands.addCommand({
  name: 'print',
  bindKey: { win: "Ctrl-P", "mac": "Cmd-P" },
  exec: function (editor) {
    printDoc();
  }
})

editDiv.onkeyup = editDiv.onkeypress = () => {
  //let key = event.which ||event.keyCode
  //if (key < 37 || key > 40) // not arrow key
    //preview.srcdoc = editor.session.getDocument().getValue();

  // swap(editor.session.getDocument().getValue());
  printDiv.innerHTML = editor.session.getDocument().getValue();
}

window.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
      if (String.fromCharCode(event.which).toLowerCase() == 's' || String.fromCharCode(event.which).toLowerCase() == 'p'){
        event.preventDefault();
        printDoc();
      }
    }
});


// initialize editor and preview, user is now ready to edit
httpGet(params.get("blob"), (response) => {
  document.getElementById('preview' + ifrNo).srcdoc = response;
  editor.session.getDocument().setValue(response)
  printDiv.innerHTML = editor.session.getDocument().getValue();
})