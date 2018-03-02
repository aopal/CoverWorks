function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return  monthNames[monthIndex] + ' ' + day + ', ' + year;
}
function httpGet(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous 
  xmlHttp.send(null);
}

var base = ''
var mappings = ''
httpGet(chrome.extension.getURL("base.html"), (res) => {base = res})
httpGet(chrome.extension.getURL("mappings.json"), (res) => {mappings = JSON.parse(res)})

function coverGen() {
  let trs = document.getElementById("postingDiv").getElementsByTagName("tr")

  let searchTexts = []
  for (var i = 0; i < trs.length; i++)
    searchTexts.push(trs[i].textContent.trim().replace(/\s+/g, ' '))

  let title = searchTexts.find((a) => {  return a.includes("Job Title:")}).split(':')[1]
  let company = searchTexts.find((a) => { return a.includes("Organization:") }).split(':')[1]

  let combinedText = searchTexts.join('\n')
  let body = ''

  for(var i = 0; i < mappings.length; i++) {
    if (combinedText.match(new RegExp(mappings[i].matcher, "ig"))) {
      body += "\n" + mappings[i].text + "\n"
    }
  }

  let text = base.replace(/DATE/g, formatDate(new Date()))
  text = text.replace(/COMPANY/g, company.trim())
  text = text.replace(/POSITION/g, title.trim())
  text = text.replace(/BODY/g, body.trim())

  chrome.runtime.sendMessage({ generateLetter: true, letterText: text }, () => {})
}

post = document.getElementById("postingDiv").parentNode

div = document.createElement("div")
div.innerHTML = "<button id='cover-gen' style='color: #fff; background-color: #45B6F7; border-radius: 100px; border: none; padding: 6px; margin: 4px;'>Generate Cover Letter</button>"
document.body.appendChild(div);

post.insertBefore(div, post.childNodes[0]);

document.getElementById("cover-gen").onclick = coverGen