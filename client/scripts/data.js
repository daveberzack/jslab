import {
  parseCode,
  updateCode,
  updateVersionsList,
  currentVersionIndex,
} from "./main.js";

let template = {};
let versions = [];
var saveDelay = 2000;

async function loadTemplate() {
  const response = await fetch("/api/template");
  template = await response.json();
  console.log("template", template);
}

async function loadVersions() {
  const studentIds = "1"; //could be & delimited ints
  const response = await fetch("/api/versions/" + studentIds);
  versions = await response.json();
  console.log("versions loaded", versions);
  updateVersionsList();
  updateCode();
}

async function saveVersion() {
  const bodyData = JSON.stringify(versions[currentVersionIndex]);
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
  setInterval(saveVersion, saveDelay);
}

export { template, versions, currentVersionIndex, initData };
