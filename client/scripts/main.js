import {
  loadCode,
  saveCode,
  loadChallenge,
  challengeData,
  responseData,
  studentId,
  initData,
} from "./data.js";
import { run, stop, test, log } from "./engine.js";

const addListeners = () => {
  $("#run-button").click(run);
  $("#stop-button").click(stop);
};

function showTab(i) {
  $(".tab-nav").removeClass("active");
  $("#tab-nav" + i).addClass("active");
  $(".tab-view").hide();
  $("#tab-view" + i).show();
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

const updateLogContent = (logs) => {
  const html = "";

  logs.forEach((l) => {
    const c = l.color || "#FFFFFF";
    html += "<p style='color:" + c + "'>" + l.message + "</p>";
  });

  $("log").html(html);
};

async function init() {
  initData();
  stop();
  resize();

  $(window).resize(resize);
  showTab(0);
  addListeners();
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

init();

export { updateLogContent, updateCode };
