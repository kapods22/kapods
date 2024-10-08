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
