import {
  updateLogContent,
  highlightCodeBlock,
  clearCodeBlockHighlights,
  onStop,
} from "./main.js";

let isError = false;

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

function run(sections) {
  console.log("run", sections);
  clearCodeBlockHighlights();
  clearLogs();

  let codeToRun = `
try {
`;

  const sectionsToRun = [...sections];
  sectionsToRun.sort((a, b) => {
    if (a.priority > b.priority) return 1;
    else if (b.priority > a.priority) return -1;
    else return 0;
  });

  sectionsToRun.forEach((s) => {
    s.blocks.forEach((b) => {
      codeToRun += formatCodeBlock(b);
    });
  });
  codeToRun += `} catch (e){
error(e.message, window.currentBlockId)
}`;
  console.log("RUN", codeToRun);
  eval(codeToRun);
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
