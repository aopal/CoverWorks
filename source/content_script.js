var base = ''
var mappings = ''

chrome.runtime.sendMessage({ loadOptions: true }, (response) => {})
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.options) {
      mappings = JSON.parse(request.mappings);
      base = request.base;
    }
  });

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

function coverGen() {
  let trs = document.getElementById("postingDiv").getElementsByTagName("tr")

  let searchTexts = []
  for (var i = 0; i < trs.length; i++)
    searchTexts.push(trs[i].textContent.trim().replace(/\s+/g, ' '))

  let title = searchTexts.find((a) => { return a.includes("Job Title:")}).split(':')[1]
  let company = searchTexts.find((a) => { return a.includes("Organization:") }).split(':')[1]

  let combinedText = searchTexts.join('\n')
  let body = ''

  for(var i = 0; i < mappings.length; i++) {
    if (combinedText.match(new RegExp(mappings[i].matcher, "ig"))) {
      body += "\n" + mappings[i].text + "\n"
    }
  }

  let text = base.replace(/\$DATE/g, formatDate(new Date()))
  text = text.replace(/\$COMPANY/g, company.trim())
  text = text.replace(/\$POSITION/g, title.trim())
  text = text.replace(/\$BODY/g, body.trim())

  chrome.runtime.sendMessage({ generateLetter: true, letterText: text }, () => {})
}

post = document.getElementById("mainContentDiv").getElementsByClassName("orbis-posting-actions")[0]
div = document.createElement("div")
div.innerHTML = "<button id='cover-gen' class='btn btn-primary btn-large'>Generate Cover Letter</button>"
post.appendChild(div)
Array.from(post.getElementsByTagName('div')).forEach((elem) => {elem.style.display = "inline-block"})

document.getElementById("cover-gen").onclick = coverGen