/* Remove links from menu headers */
//window.onload = () => {
  let unlinkedAs = [
    document.querySelectorAll("a[data-link-id='17627884']"),
    document.querySelectorAll("a[data-link-id='18205969']"),
    document.querySelectorAll("a[data-link-id='17627819']"),
    document.querySelectorAll("a[data-page-link-id='15010016']"),
    document.querySelectorAll("a[data-page-link-id='12029268']"),
    document.querySelectorAll("a[data-page-link-id='12784877']"),
    document.querySelectorAll("a[data-page-link-id='12514772']"),

    document.querySelectorAll("a[href='']")
  ];
  
  for (let i = 0; i < unlinkedAs.length; i++) {
    for (let j = 0; j < unlinkedAs[i].length; j++) {
     const styleAttr = document.createAttribute("style");
     styleAttr.value = "cursor:pointer;";
     unlinkedAs[i][j].removeAttribute("href");
     unlinkedAs[i][j].setAttributeNode(styleAttr);
    }
  }
//}
