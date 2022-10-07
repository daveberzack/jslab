import { updateCode } from "./main.js";

let challengeData = {};
let responseData = {};
var saveDelay = 10000;
let studentId = 1;

async function loadChallenge() {
  const response = await fetch("/api/challenge");
  challengeData = await response.json();
}

async function loadCode() {
  const response = await fetch("/api/response/" + studentId);
  responseData = await response.json();
  updateCode();
}

async function saveCode() {
  let data = {};

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

async function initData() {
  await loadChallenge();
  await loadCode();
  setInterval(saveCode, saveDelay);
}

export {
  loadChallenge,
  loadCode,
  saveCode,
  challengeData,
  responseData,
  studentId,
  initData,
};
