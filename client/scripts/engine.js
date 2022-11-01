import {
  updateLogContent,
  highlightCodeBlock,
  clearCodeBlockHighlights,
  onStop,
} from "./main.js";

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

  const sectionsToRun = [...sections];
  sectionsToRun.sort((a, b) => {
    if (a.priority > b.priority) return 1;
    else if (b.priority > a.priority) return -1;
    else return 0;
  });

  let codeBlocks = [];
  let allCode = "";
  sectionsToRun.forEach((s) => {
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

function test(value, index, message) {
  try {
    if (value) {
      console.log("test " + index + " passed");
    } else {
      console.log("test " + index + " failed ... " + message);
    }
  } catch (e) {
    console.log("test " + index + " failed (catch) ... " + message);
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

export { run, stop, clearLogs };
