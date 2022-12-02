import {
  updateCode,
  updateVersionsList,
  currentVersionIndex,
  isInstructor,
} from "./main.js";

let template = {};
let versions = [];
var saveDelay = 2000;
let ids = [];
let lastSavedVersion = "";

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

  //console.log("update:", versions);
  updateVersionsList();
  updateCode();
}

async function saveVersion() {
  const bodyData = JSON.stringify(versions[currentVersionIndex]);
  if (bodyData == lastSavedVersion) return;

  lastSavedVersion = bodyData;
  //console.log("save:", bodyData);
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

  setInterval(() => {
    if (!isInstructor) {
      saveVersion();
    } else {
      updateVersions();
    }
  }, saveDelay);
}

export { template, versions, currentVersionIndex, initData, updateVersions };
