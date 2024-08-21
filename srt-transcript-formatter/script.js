const input = document.getElementById("input");
const copyBtn = document.getElementById("copy");
const formatBtn = document.getElementById("format");
const formatOptions = document.querySelector(".accordion-panel");
const formatOptionBtns = document.querySelectorAll(".accordion-panel button");

function changeFormatMenuDisplay() {
  if (input.value.length > 0) {
    formatOptions.style.display = formatOptions.style.display === "block" ? "none" : "block";
    formatBtn.style.borderBottomLeftRadius = formatOptions.style.display === "block" ? "0" : "8.75px";
  }
}

function formatted() {
  formatOptions.style.display = "none";
  copyBtn.classList.add("usable");
}

function updateButtons() {
  if (input.value.length > 0) {
    formatBtn.classList.add("usable");
  } else {
    copyBtn.classList.remove("usable");
    formatBtn.classList.remove("usable");
    formatOptions.style.display = "none";
  }
}

function isOdd(num) {
  return ( num & 1 ) ? true : false;
}

function titleCase(str) {
  if ((str === null) || (str === ""))
    return false;
  else
    str = str.toString();

  return str.replace(/\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() +
        txt.substr(1).toLowerCase();
    });
}

function isAllCaps(str) {
  return str.toUpperCase() === str;
}

function indexSplit(text, index) {
  // Splits the string at the index and returns an array with the two parts
  let partOne = text.substring(0, index) ? text.substring(0, index) : "";
  let partTwo = text.substring(index).trim() ? text.substring(index).trim() : "";
  return [partOne, partTwo];
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

function removeColons(text)  {
  return text.replace(/:/g, "-");
}

function formatSpeakers() {
  // Make speaker names (which are lines that are entirely all-caps) title case and add a colon then space
  let lines = input.value.split("\n");
  let formattedLines = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] != "" && lines[i] != " ") {
      if (isAllCaps(lines[i])) {
        lines[i] = titleCase(lines[i]) + ": ";
      }
      formattedLines.push(lines[i]);
    }
  }
  input.value = formattedLines.join("\n").replace(/:\s\n/g, ": ").trim();
}

function formatTranscriptB() {
  let lines = input.value.split("\n");
  let formattedLinesA = [];
  let formattedLinesB = [];
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line != "{merged}") {
      if (line == "DEVON:") {
        lines[i] = line + " " + lines[i + 2];
        lines[i + 2] = "{merged}";
      }
      formattedLinesA.push(lines[i]);
    }
  }
  for (let i = 0; i < formattedLinesA.length; i++) {
    const line = formattedLinesA[i];
    if (line != "" && line != " ") {
      const colonIndex = line.includes(":") ? line.indexOf(":") + 1 : line.length;
      let [partOne, partTwo] = indexSplit(line, colonIndex);
      if (isAllCaps(partOne)) {
        partOne = "\n" + titleCase(partOne);
      } else {
        partOne = " " + removeColons(partOne);
      }
      partTwo = partTwo ? " " + removeColons(partTwo) : "";
      formattedLinesB.push(partOne + partTwo);
    }
  }
  input.value = formattedLinesB.join("");
  formatToSRT();
}

function formatToSRT() {
  // Formats the input text into lines, each no more than 32 characters long, without cutting words. There is an additional line break after every 2 lines.
  const lines = input.value.split("\n");
  const formattedLines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line != "" && line != " ") {
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
  }
  input.value = formattedLines.join("\n").trim();
}

function formatStandard() {
  input.value = removeColons(input.value);
  formatSpeakers();
  formatToSRT();
}

function copy() {
  if (copyBtn.className.includes("usable")) {
    // Copies the formatted text to the clipboard
    navigator.clipboard.writeText(input.value);
    alert("The formatted text has been copied to the clipboard!");
  }
}
