const input = document.getElementById("input");
const copyBtn = document.getElementById("copy");
const formatBtn = document.getElementById("format");

function changeFormatBtn() {
  copyBtn.classList.remove("usable");
  
  if (input.value.length > 0) {
    formatBtn.classList.add("usable");
  } else {
    formatBtn.classList.remove("usable");
  }
}

function isOdd(num) {
  return ( num & 1 ) ? true : false;
}

function indexSplit(text, index) {
  // Splits the string at the index and returns an array with the two parts
  return [text.substring(0, index), text.substring(index).trim()];
}

function shortenLine(text, index = 32) {
  for (let i = index; i >= 0; i--) {
    if (text.charAt(i) === " " && text.length > 32) {
      return indexSplit(text, i);
    }
  }
  if (text.length <= 32) {
    return [text, ""];
  } else {
    return indexSplit(text, 32);
  }
}

function format() {
  // Formats the input text into lines, each no more than 32 characters long, without cutting words. There is an additional line break after every 2 lines.
  if (input.value.length > 0) {
    const lines = input.value.split("\n");
    const formattedLines = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let formattedBlocks = [];
      for (let k = 0; k < formattedLines.length; k++) {
        if (formattedLines[k].includes("\n00:\n")) {
          formattedBlocks.push(formattedLines[k]);
        }
      }
      let unformattedLine = line;
      for (let j = 0; unformattedLine != ""; j++) {
        const [first, rest] = shortenLine(unformattedLine);
        if (isOdd(j)) {
          formattedLines.push(`${first}`);
        } else {
          formattedLines.push(`\n${formattedBlocks.length + 1}\n00:\n${first}`);
        }
        unformattedLine = rest;
        formattedBlocks = [];
        for (let k = 0; k < formattedLines.length; k++) {
          if (formattedLines[k].includes("\n00:\n")) {
            formattedBlocks.push(formattedLines[k]);
          }
        }
        if (rest.length <= 32 && rest.length > 0) {
          if (isOdd(j)) {
            formattedLines.push(`\n${formattedBlocks.length + 1}\n00:\n${rest}`);
          } else {
            formattedLines.push(`${rest}`);
          }
          unformattedLine = "";
        }
      }
    }
    input.value = formattedLines.join("\n").trim();
    copyBtn.classList.add("usable");
  }
}

function copy() {
  if (copyBtn.className.includes("usable")) {
    // Copies the formatted text to the clipboard
    navigator.clipboard.writeText(input.value);
    alert("The formatted text has been copied to the clipboard!");
  }
}