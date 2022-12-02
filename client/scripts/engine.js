import {
  updateLogContent,
  highlightCodeBlock,
  clearCodeBlockHighlights,
  onStop,
  currentVersionIndex,
} from "./main.js";

import { versions, template } from "./data.js";

import { updateElement, addElement } from "./display.js";

let logs = [];

var cleanup = function () {
  //console.log("default cleanup");
};

function formatCodeBlock(b) {
  return `
window.currentBlockId="${b.id}";
${b.code}
`;
}

function wrapInTry(code, logError) {
  return `
  try {
    ${code}
  } catch (e){
  ${logError ? "error(e.message, window.currentBlockId)" : ""}
  }`;
}

function run(sections) {
  console.log("run", sections);
  clearCodeBlockHighlights();
  clearLogs();
  const version = versions[currentVersionIndex];
  version.assertions = [];

  const sectionsToRun = [...sections];
  sectionsToRun.sort((a, b) => {
    if (a.priority > b.priority) return 1;
    else if (b.priority > a.priority) return -1;
    else return 0;
  });

  let codeBlocks = [];
  let allCode = "";
  sectionsToRun.forEach((s) => {
    console.log(s.blocks);
    s.blocks.forEach((b) => {
      const formattedCode = formatCodeBlock(b);
      codeBlocks.push({ id: b.id, code: formattedCode });
      allCode += formattedCode;
    });
  });
  

  let codeToRun = wrapInTry(allCode, true);

  try {
    eval(codeToRun);
  } catch (e) {
    codeBlocks.forEach((b) => {
      try {
        eval(wrapInTry(b.code, false));
      } catch (e) {
        error(e.message, b.id);
      }
    });
  }
}

function stop() {
  cleanup();
}

function assert(value, index, message) {
  if (value) {
    if (!versions[currentVersionIndex].assertions[index])
      versions[currentVersionIndex].assertions[index] = 1;
  } else {
    error(message);
    versions[currentVersionIndex].assertions[index] = -1;
  }
}

const log = (message, color) => {
  logs.push({ message, color });
  updateLogContent(logs);
};

const error = (message, id) => {
  log(message, "orange");
  highlightCodeBlock(id);
  onStop();
};

const clearLogs = () => {
  logs = [];
  updateLogContent(logs);
};

window.onerror = function (e) {
  log("Syntax Error");
};

export { run, stop, clearLogs, logs };
