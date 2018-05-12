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

let params = (new URL(document.location)).searchParams;
let editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.setOption("showPrintMargin", false)
editor.setOptions({fontSize:14})
editor.session.setMode("ace/mode/html");
editor.session.setUseWrapMode(true);
editor.setShowInvisibles(true)
// editor.commands.addCommand({
//   name: 'save',
//   bindKey: { win: "Ctrl-S", "mac": "Cmd-S" },
//   exec: function (editor) {
//     window.print();
//   }
// })

editor.commands.addCommand({
  name: 'print',
  bindKey: { win: "Ctrl-P", "mac": "Cmd-P" },
  exec: function (editor) {
    window.print();
  }
})

let editDiv = document.getElementById("editor")
editDiv.onkeyup = editDiv.onkeypress = () => {
  document.getElementById("preview").innerHTML = editor.session.getDocument().getValue()
}

window.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
      // if (String.fromCharCode(event.which).toLowerCase() == 's'){
      //   event.preventDefault();
      //   window.print();
      // }
    }
});

httpGet(params.get("blob"), (response) => {
  document.getElementById("preview").innerHTML = response;
  editor.session.getDocument().setValue(response)
})