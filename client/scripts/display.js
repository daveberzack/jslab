import { template } from "./data.js";

function update(data) {
  const newElementHtml = formatElement(data);
  $("#canvas #element-" + data.id).remove();
  console.log(newElementHtml);
  $("#canvas").append(newElementHtml);
}

function formatElement(data) {
  console.log("data", data);
  console.log("theme", template.theme);
  if (!data.type) throw { message: "type is not defined" };
  if (!data.id) throw { message: "id is not defined" };
  const type = template.theme.types[data.type];
  console.log("type:", type);

  const str = type.templateString.replace(/\[(.*?)\]/g, function (tag) {
    console.log(tag);
    const tagParts = tag.substr(1, tag.length - 2).split(":");
    return data[tagParts[0]] || tagParts[1];
  });

  return str;
}

function add(data) {
  update(data);
}

export { add, update };
