import { template, versions, initData, updateVersions } from "./data.js";
import { run, stop, clearLogs } from "./engine.js";

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
    let $blocks = $(this).find("p");
    $blocks.each(function () {
      section.blocks.push({
        id: $(this).attr("id"),
        code: this.innerText,
      });
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

const addListeners = () => {
  $("#run-button").click(onRun);
  $("#stop-button").click(onStop);
};

function updateCode() {
  let navHtml = "";
  let panesHtml = "";
  const version = versions[currentVersionIndex];
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

      let attrs = `contenteditable="true" class="editable"`;
      if (block.hidden) {
        attrs = `class="hidden"`;
      } else if (block.locked) {
        attrs = `class="locked"`;
      }
      paneHtml += `<p id="${id}" data-section="${i}" data-block="${j}" spellcheck="false" ${attrs}>${codeText}</p>`;
    });
    paneHtml += `</div>`;

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
    versionsHtml += `<li data-index="${i}" ${currentClass}>${version.name}</li>`;
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
      .find("p")
      .each(function (i) {
        let myCode = "";
        if ($(this).hasClass("editable")) myCode = $(this).text();
        myBlocks.push({ code: myCode });
      });

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
};

async function init(ids) {
  $("#version-select").hide();

  initData(ids);
  onStop();
  resize();
  initUI();

  $(window).resize(resize);
  addListeners();
}

function resize() {
  const winW = $(window).width();
  const winH = $(window).height();

  $(".col").width((winW - 30) / 2);
  $(".code").height(winH - 70);

  //$("#log").height(winH - 760);
  // const ch = Math.min(winH - 280, winW / 2 - 40);
  // $("#canvas").height(ch);
  // $("#canvas").width(ch);
  $("#view").hide();
  $("#log").height(winH - 170);
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
};
