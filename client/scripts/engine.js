import { updateLogContent } from "./main.js";

let tickInterval = 0;
const tickDuration = 100;

let logs = [];

function run() {
  logs = [];
  updateLogContent(logs);

  clearInterval(tickInterval);

  $("#run-button").hide();
  $("#stop-button").show();

  const startCodeBlocks = document.querySelectorAll(".tab-view p");
  let startCode = "";
  startCodeBlocks.forEach((b) => {
    startCode = startCode + "\n" + $(b).text();
  });

  try {
    eval(startCode);
  } catch (e) {
    log("ERROR", "orange");
    console.log(e);
  }

  /*
    
  
    let tickCode = "";
    const tickCodeBlocks = document.querySelectorAll("#tick-code p");
    tickCodeBlocks.forEach((b) => {
      tickCode = tickCode + "\n" + $(b).text();
    });
    
    tickInterval = setInterval(() => {
      runCode(tickCode);
    }, tickDuration);
    */
}

function stop() {
  clearInterval(tickInterval);
  $("#run-button").show();
  $("#stop-button").hide();
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

export { run, stop, test, log };
