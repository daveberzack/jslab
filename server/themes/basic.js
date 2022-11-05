module.exports = {
  types: {
    rectangle: {
      requiredFields: ["x", "y", "w", "h"],
      templateString: `<div id="element-[id]" style="position: absolute; width:[w]px; height:[h]px; left:[x]px; top:[y]px; background-color: [color:#000000]"></div>`,
    },
  },
};
