import { template, versions, currentVersionIndex, initData } from "./data.js";
import { run, stop, clearLogs } from "./engine.js";

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

    section.blocks = [];
    let $blocks = $(this).find("p");
    $blocks.each(function () {
      section.blocks.push({
        id: $(this).attr("id"),
        code: $(this).text(),
      });
    });

    sections.push(section);
  });

  return sections;
}

function onRun() {
  $("#run-button").hide();
  $("#stop-button").show();

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
    navHtml += `<li><a href="#code-pane${i}">${section.title}</a></li>`;

    let paneHtml = `<div id="code-pane${i}" class="tab-pane code-pane block" data-type="${section.type}">`;

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
      paneHtml += `<p id="${id}" spellcheck="false" ${attrs}>${codeText}</p>`;
    });
    paneHtml += `</div>`;

    panesHtml += paneHtml;
  });

  $("#code-tabs .tab-nav").html(navHtml);
  $("#code-panes").html(panesHtml);

  $("#code-tabs").minitabs();
  $("#content-tabs").minitabs();
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

async function init() {
  initData();
  onStop();
  resize();

  $(window).resize(resize);
  addListeners();
}

function resize() {
  const winW = $(window).width();
  const winH = $(window).height();

  $(".col").width((winW - 30) / 2);
  $(".code").height(winH - 70);
  $("#log").height(winH - 760);

  const ch = Math.min(winH - 280, winW / 2 - 40);
  $("#canvas").height(ch);
  $("#canvas").width(ch);
}

$(function () {
  init();
});

export {
  updateLogContent,
  updateCode,
  parseCode,
  highlightCodeBlock,
  clearCodeBlockHighlights,
  onStop,
};
