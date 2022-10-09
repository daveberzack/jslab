import { updateLogContent } from "./main.js";

let tickInterval = 0;
const tickDuration = 500;

let logs = [];

// var __EVAL = s => eval(`void (__EVAL = ${__EVAL.toString()}); ${s}`);

// async function evaluate(expr) {
//   try {
//     const result = await __EVAL(expr);
//     console.log(expr, '===>', result)
//   } catch (err) {
//     console.log(expr, 'ERROR:', err.message)
//   }
// }

function run(sections) {
  clearLogs();
  clearInterval(tickInterval);

  let startCodeBlocks = [];
  let tickCodeBlocks = [];
  //let handlerCodeBlocks = [];
  console.log("s", sections);
  sections.forEach(s => {
    
    let blocks = startCodeBlocks;
    if (s.type == "tick"){
      blocks = tickCodeBlocks;
    }
    else if (s.type == "handler"){
      
    }

    s.blocks.forEach( b => {
      blocks.push(b);
    })

  });


  startCodeBlocks.forEach( b => {
    try {
      console.log("EVAL: ",b.code);
      eval?.(b.code);
      console.log("?: ",myName);
    } catch (e) {
      log("ERROR", "orange");
      console.log(e);
    }
  })

  tickInterval = setInterval(() => {
    tickCodeBlocks.forEach( b => {
      try {
        eval?.(b.code);
      } catch (e) {
        log("ERROR", "orange");
        console.log(e);
      }
    })
  }, tickDuration);
  
}

function stop() {
  clearInterval(tickInterval);
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

const clearLogs = () => {
  logs = [];
  updateLogContent(logs);
};

export { run, stop, clearLogs };