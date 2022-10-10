import { parseCode, updateCode } from "./main.js";

let template = {};
let versions = [];
let currentVersionIndex = 0;
var saveDelay = 2000;

async function loadTemplate() {
  const response = await fetch("/api/template");
  template = await response.json();
}

async function loadVersions() {
  const studentIds = "1"; //could be & delimited ints
  const response = await fetch("/api/versions/" + studentIds);
  versions = await response.json();
  updateCode();
}

async function saveVersions() {
  const version = {
    ...versions[currentVersionIndex],
    ...parseCode(),
  };

  const bodyData = JSON.stringify(version);
  const response = await fetch("/api/version/", {
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
  await loadTemplate();
  await loadVersions();
  setInterval(saveVersions, saveDelay);
}

export { template, versions, currentVersionIndex, initData };
