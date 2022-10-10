import {
  updateLogContent,
  highlightCodeBlock,
  clearCodeBlockHighlights,
  onStop,
} from "./main.js";

let isError = false;

let logs = [];

var cleanup = function () {
  console.log("default cleanup");
};

function formatCodeBlock(b) {
  return `
  if (!isError) { try {
  ${b.code}
  } catch (e) {
    error(e.message, "${b.id}");
  }}`;
}

function run(sections) {
  clearCodeBlockHighlights();
  isError = false;
  clearLogs();

  let codeToRun = "";

  const sectionsToRun = [...sections];
  sectionsToRun.sort((a, b) => {
    if (a.priority > b.priority) return 1;
    else if (b.priority > a.priority) return -1;
    else return 0;
  });

  console.log(sectionsToRun);
  sectionsToRun.forEach((s) => {
    s.blocks.forEach((b) => {
      codeToRun += formatCodeBlock(b);
    });
  });

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
  isError = true;
  onStop();
};

const clearLogs = () => {
  logs = [];
  updateLogContent(logs);
};

export { run, stop, clearLogs };
