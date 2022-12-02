// import { template } from "./data.js";

let allData = {};
let canvasWidth = 100;
let canvasHeight = 100;

function addElement(data) {
  updateElement(data);
}

function setBackground(filename) {
  $("#canvas").css("background-image", "url(img/backgrounds/" + filename + ")");
}

function updateElement(data) {
  if (!data.image) throw { message: "image is not defined" };
  if (!data.id) throw { message: "id is not defined" };
  allData[data.id] = data;
  redrawElement(data);
}

function redrawElement(data) {
  const newElementHtml = formatElement(data);
  if (newElementHtml) {
    $("#canvas #element-" + data.id).remove();
    $("#canvas").append(newElementHtml);
  }
}

function formatElement(data) {
  if (!data || !data.id || !data.image) return null;
  const w = (data.w * canvasWidth) / 100; //convert percent-based units to pixels
  const x = (data.x * canvasWidth) / 100;
  const h = (data.h * canvasHeight) / 100;
  const y = (data.y * canvasHeight) / 100;
  const r = data.r || 0;

  const output = `<img id="element-${data.id}" src="img/elements/${data.image}" class="element" style="width:${w}px; height:${h}px; top:${y}px; left:${x}px; transform:rotate(${r}deg);" />`;
  return output;
}

function redrawAllElements() {
  for (const data in allData) {
    redrawElement(data);
  }
}

function resize(w, h) {
  canvasWidth = w;
  canvasHeight = h;
  redrawAllElements();
}

export { addElement, updateElement, resize, setBackground };
