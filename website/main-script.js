// Remove href attribute from menu headers and <a> elements with no links
let unlinkedAs = [
  document.querySelectorAll("a[data-link-id='17627884']"),
  document.querySelectorAll("a[data-link-id='18205969']"),
  document.querySelectorAll("a[data-link-id='17627819']"),
  document.querySelectorAll("a[data-page-link-id='15010016']"),
  document.querySelectorAll("a[data-page-link-id='12029268']"),
  document.querySelectorAll("a[data-page-link-id='12784877']"),
  document.querySelectorAll("a[data-page-link-id='12514772']")
];

for (let i = 0; i < unlinkedAs.length; i++) {
  for (let j = 0; j < unlinkedAs[i].length; j++) {
    let unlinkedA = unlinkedAs[i][j];
    //let styleAttr = document.createAttribute("style");
    let hrefAttr = document.createAttribute("href");
    //styleAttr.value = "cursor:pointer;";
    hrefAttr.value = "javascript:void(0);";
    unlinkedA.removeAttribute("href");
    //unlinkedA.setAttributeNode(styleAttr);
    unlinkedA.setAttributeNode(hrefAttr);
    //unlinkedA.href = "javascript:void(0);";
  }
}

const newsletterEmail = document.querySelector("#jw-element-230647470 input[type='email']");
const placeholder = document.createAttribute("placeholder");
placeholder.value = "Your email address…";
newsletterEmail.setAttributeNode(placeholder);

document.getElementsByClassName("message-bar--accent")[0].addEventListener("click", function() {
  window.open("/support", "_self");
});

let aSpans = document.querySelectorAll("span:has(:is(span a))");
for (let aSpan of aSpans) {
  if (aSpan.style.textDecoration == "underline") {
    aSpan.style.textDecoration = "none";
    aSpan.querySelector("span a").style.textDecoration = "underline";
  }
}

function unlinkMenuItems(nextFunction) {
  if (document.querySelectorAll("nav.menu").length == 2) {
    nextFunction();
  } else {
    setTimeout(() => { unlinkMenuItems(nextFunction) }, );
  }
}

unlinkMenuItems(() => {
  let tempMenuItems = [
    document.querySelectorAll("a[data-link-id='17627819'], a[data-link-id='18205969'], a[data-link-id='17627884']")
  ]
  let numMenuItems = 0;
  for (let group of tempMenuItems) {
    for (let menuItem of group) {
      numMenuItems += 1;
      menuItem.href = "javascript:void(0);";
    }
  }
  console.log(numMenuItems);
});

if (document.location.pathname.substring(1, 17) == "kingdom-animalia") {
  (function(d) {
    var app = d.createElement('script');
    app.type = 'text/javascript';
    app.async = true;
    app.src = 'https://www.speakpipe.com/loader/q4ndxusw2iz709l0w4puke0bhzhnqrl3.js';
    var s = d.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(app, s);
  })(document);
}
