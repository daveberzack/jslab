let tickInterval = 0;
const tickDuration = 100;
let logText = "";
let challengeData = {};
let responseData = {};
let studentId = 1;
var saveDelay = 10000;

function showTab(i) {
  $(".tab-nav").removeClass("active");
  $("#tab-nav" + i).addClass("active");
  $(".tab-view").hide();
  $("#tab-view" + i).show();
}

// function setCode($target, blocks) {
//   let h = "";
//   blocks.forEach((b) => {
//     h += `<p ${b.type == "editable" ? 'contenteditable="true"' : ""} class="${
//       b.type
//     }">${b.text}</p>`;
//   });

//   $target.html(h);
// }

function log(msg, color) {
  const c = color || "#FFFFFF";
  logText = logText + "<p style='color:" + c + "'>" + msg + "</p>";
  $("#log").html(logText);
  $("#log").scrollTop($("#log")[0].scrollHeight);
}

function run() {
  logText = "";
  clearInterval(tickInterval);

  $("#run-button").hide();
  $("#stop-button").show();

  const startCodeBlocks = document.querySelectorAll(".tab-view p");
  let startCode = "";
  startCodeBlocks.forEach((b) => {
    startCode = startCode + "\n" + $(b).text();
  });
  runCode(startCode);

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

function runCode(code) {
  try {
    eval(code);
  } catch (e) {
    log("ERROR", "orange");
    console.log(e);
  }
}

function resize() {
  const winW = $(window).width();
  const winH = $(window).height();

  $(".col").width((winW - 30) / 2);
  $(".code").height(winH - 70);
  $("#log").height(winH - 760);

  const ch = Math.min(winH - 280, winW / 2 - 40);
  $("#canvas").height(ch);
  $("#canvas").width(ch);
}

async function init() {
  stop();
  resize();
  $(window).resize(resize);

  await loadChallenge();
  await loadCode();
  showTab(0);

  setInterval(saveCode, saveDelay);
  //setTimeout(saveCode, 2000);
}

async function loadChallenge() {
  const response = await fetch("/api/challenge");
  challengeData = await response.json();
}

function updateCode() {
  challengeData.tabs.forEach((tab, i) => {
    let $navElement = $(
      `<div class="tab-nav" id="tab-nav${i}" onclick="showTab(${i});" >${tab.title}</div>`
    );
    $("#tab-nav-bar").append($navElement);

    let $tabElement = $(
      `<div id="tab-view${i}" class="tab-view block code"></div>`
    );
    tab.blocks.forEach((block, j) => {
      let codeText = block.code;

      let r = responseData?.codeBlocks;
      if (r && r[i] && r[i][j]) {
        codeText = r[i][j];
      }

      if (block.hidden) {
        $tabElement.append(`<p class="hidden">${codeText}</p>`);
      } else if (block.locked) {
        $tabElement.append(`<p class="locked">${codeText}</p>`);
      } else {
        $tabElement.append(
          `<p contenteditable="true" class="editable">${codeText}</p>`
        );
      }
    });
    $("#code").append($tabElement);
  });
}

async function loadCode() {
  const response = await fetch("/api/response/" + studentId);
  responseData = await response.json();
  updateCode();
}

async function saveCode() {
  data = {};

  let $tabElements = $(".tab-view");
  data.codeBlocks = [];
  $tabElements.each(function (i) {
    let tabCode = [];
    $blockElements = $(this).find("p");

    $blockElements.each(function (i) {
      if ($(this).hasClass("editable")) tabCode.push($(this).text());
      else tabCode.push("");
    });

    data.codeBlocks.push(tabCode);
  });

  const bodyData = JSON.stringify(data);
  const response = await fetch("/api/response/" + studentId, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: bodyData,
  });
  const dataBack = await response.json();
}

init();
