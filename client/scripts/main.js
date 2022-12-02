import { template, versions, initData, updateVersions } from "./data.js";
import { run, stop, logs, clearLogs } from "./engine.js";
import { resize as resizeCanvas, setBackground } from "./display.js";

const queryString = window.location.search;

let currentVersionIndex = 0;
let tabsInitialized = false;
let isInstructor = queryString.indexOf("instructor") >= 0;

jQuery.fn.minitabs = function () {
  var id = "#" + this.attr("id");
  $(id + " .tab-pane:gt(0)").hide();
  $(id + ">ul>li>a:first").addClass("current");
  $(id + ">ul>li>a").click(function () {
    $(id + ">ul>li>a").removeClass("current");
    $(this).addClass("current");
    $(this).blur();
    var re = /([_\-\w]+$)/i;
    var target = $("#" + re.exec(this.href)[1]);
    var old = $(id + " .tab-pane");
    old.hide();
    target.show();
    return false;
  });
};

function getSections() {
  let sections = [];

  let $panes = $(`.code-pane`);
  $panes.each(function () {
    let section = {};
    section.priority = $(this).attr("data-priority");
    section.blocks = [];
    let $blocks = $(this).find("pre");
    $blocks.each(function () {
      let newBlock = {
        id: $(this).attr("id"),
        code: this.innerText,
        isLocked: $(this).hasClass("locked"),
        isHidden: $(this).hasClass("hidden"),
      };
      section.blocks.push(newBlock);
    });

    sections.push(section);
  });

  return sections;
}

function onRun() {
  $("#run-button").hide();
  $("#stop-button").show();
  $("#results-tab").click();
  let sections = getSections();
  run(sections);
}

function onStop() {
  $("#run-button").show();
  $("#stop-button").hide();
  stop();
}

function onRaiseHand() {
  if (!isInstructor) $("#lower-hand-button").show();
  $("#raise-hand-button").hide();
  versions[currentVersionIndex].isHandRaised = true;
}

function onLowerHand() {
  $("#lower-hand-button").hide();
  if (!isInstructor) $("#raise-hand-button").show();
  versions[currentVersionIndex].isHandRaised = false;
}

const addListeners = () => {
  $("#run-button").click(onRun);
  $("#stop-button").click(onStop);
  $("#raise-hand-button").click(onRaiseHand);
  $("#lower-hand-button").click(onLowerHand);
};


var tagsToReplace = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};
function replaceTag(tag) {
  return tagsToReplace[tag] || tag;
}
function htmlEscape(str) {
  return str.replace(/[&<>]/g, replaceTag);
}

function updateCode() {
  let navHtml = "";
  let panesHtml = "";
  const version = versions[currentVersionIndex];

  if (version.isHandRaised) onRaiseHand();
  else onLowerHand();

  template.sections.forEach((section, i) => {
    if (!section.hidden) {
      navHtml += `<li><a href="#code-pane${i}">${section.title}</a></li>`;
    }

    let paneHtml = `<div id="code-pane${i}" class="tab-pane code-pane block" data-priority="${section.priority}">`;

    section.blocks.forEach((block, j) => {
      let codeText = block.code;

      let r = version?.sections;
      if (r && r[i] && r[i].blocks[j] && r[i].blocks[j].code) {
        codeText = r[i].blocks[j].code;
      }

      const id = `code-${i}-${j}`;

      let attrs = `class="code-block"`;
      if (block.locked) {
        attrs = `class="code-block locked"`;
      } else {
        if (!isInstructor) attrs = `contenteditable="true" class="code-block editable"`;
        else attrs = `class="code-block editable"`;
      }

      paneHtml += `<div id="${id}" data-section="${i}" data-block="${j}" spellcheck="false" ${attrs}>`;
      paneHtml += `<pre>${htmlEscape(codeText)}</pre>`;
      if (block.hidden) paneHtml += `<pre class="hidden-block">${htmlEscape(block.hidden)}</pre>`;
      paneHtml += `</div>`;
    });

    panesHtml += paneHtml;
  });

  $("#code-tabs .tab-nav").html(navHtml);
  $("#code-panes").html(panesHtml);

  $(".code-pane p").keyup(function () {
    const section = $(this).attr("data-section");
    const block = $(this).attr("data-block");
    let s = versions[currentVersionIndex].sections;
    if (!s[section]) {
      s[section] = { blocks: [] };
    }
    if (!s[section].blocks[block]) {
      s[section].blocks[block] = {};
    }

    const sectionText = this.innerText;
    s[section].blocks[block].code = sectionText;
  });

  if (!tabsInitialized) {
    $("#code-tabs").minitabs();
    $("#content-tabs").minitabs();
    tabsInitialized = true;
  }
}

function updateVersionsList() {
  let versionsHtml = "";
  versions.forEach((version, i) => {
    const currentClass = currentVersionIndex == i ? 'class="current"' : "";
    const handRaisedHtml = version.isHandRaised ? " [!]" : "";
    let assertionsHtml = "";
    for (let i = 0; i < template.numberOfAssertions; i++) {
      if (version.assertions[i] && version.assertions[i] > 0) {
        assertionsHtml += "-";
      } else {
        assertionsHtml += "X";
      }
    }
    const inactiveTimeHtml = " [" + version.secondsSinceLastChange + "]";
    versionsHtml += `<li data-index="${i}" ${currentClass}>${version.name} [${assertionsHtml}]${inactiveTimeHtml}${handRaisedHtml}</li>`;
  });
  $("#versions-pane ul").html(versionsHtml);

  $("#versions-pane li").click(async function () {
    currentVersionIndex = $(this).attr("data-index");
    await updateVersions();
    updateCode();
    updateVersionsList();
  });
}

function parseCode() {
  let sections = [];
  $(".code-pane").each(function (i) {
    let myBlocks = [];
    $(this)
      .find("pre")
      .each(function (i) {
        let myCode = "";
        if ($(this).hasClass("editable")) myCode = $(this).text();
        myBlocks.push({ code: myCode });
      });
      console.log("?",myBlocks);
    const section = { blocks: myBlocks };
    sections.push(section);
  });

  return { sections };
}

const updateLogContent = (logs) => {
  let html = "";

  logs.forEach((l) => {
    const c = l.color || "#FFFFFF";
    html += "<p style='color:" + c + "'>" + l.message + "</p>";
  });

  $("#log").html(html);
};

const highlightCodeBlock = (id) => {
  $("#" + id).addClass("error");
};

const clearCodeBlockHighlights = () => {
  $(".code-pane p.error").removeClass("error");
};

const initUI = () => {
  if (!isInstructor) $("#versions-link").hide();
  onLowerHand();
};

async function init(ids) {
  $("#version-select").hide();

  await initData(ids);
  onStop();
  resize();
  initUI();

  $(window).resize(resize);
  setBackground(template.backgroundImage);
  addListeners();
}

function resize() {
  const winW = $(window).width();
  const winH = $(window).height();

  $(".col").width((winW - 30) / 2);
  $(".code-pane").height(winH - 120);
  $("#log").height(winH - 670);

  const canvasHeight = Math.min(winH - 320, winW / 2 - 40);
  $("#canvas").height(canvasHeight);
  $("#canvas").width(canvasHeight);
  resizeCanvas(canvasHeight, canvasHeight);
}

$(function () {
  const allIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  if (isInstructor) init(allIds);
  else {
    $("#version-select a").click((e) => {
      e.preventDefault();
      const id = $(e.target).attr("data-id");
      init([id]);
    });
  }
});

export {
  updateLogContent,
  updateCode,
  updateVersionsList,
  currentVersionIndex,
  parseCode,
  highlightCodeBlock,
  clearCodeBlockHighlights,
  onStop,
  isInstructor,
};
