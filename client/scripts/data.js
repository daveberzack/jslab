import { updateCode, updateVersionsList, currentVersionIndex } from "./main.js";

let template = {};
let versions = [];
var saveDelay = 4000;
let ids = [];

async function loadTemplate() {
  const response = await fetch("/api/template");
  template = await response.json();
}

async function loadVersions(ids_in) {
  ids = ids_in;
  await updateVersions();
}

async function updateVersions() {
  const studentIds = ids.join("&");
  const response = await fetch("/api/versions/" + studentIds);
  versions = await response.json();

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

async function initData(ids) {
  await loadTemplate();
  await loadVersions(ids);

  setInterval(saveVersion, saveDelay);
}

export { template, versions, currentVersionIndex, initData, updateVersions };
