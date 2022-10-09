
import {
  loadCode,
  saveCode,
  loadChallenge,
  challengeData,
  responseData,
  studentId,
  initData,
} from "./data.js";
import { run, stop, clearLogs } from "./engine.js";

jQuery.fn.minitabs = function() {
  var id = "#" + this.attr('id');
  console.log("mini "+id, this);
  $(id + " .tab-pane:gt(0)").hide();
  $(id + ">ul>li>a:first").addClass("current");
  $(id + ">ul>li>a").click(
    function(){
      $(id + ">ul>li>a").removeClass("current");
      $(this).addClass("current");
      $(this).blur();
      var re = /([_\-\w]+$)/i;
      var target = $('#' + re.exec(this.href)[1]);
      var old = $(id + " .tab-pane");
          old.hide();
          target.show()
      return false;
    }
  );
}

function onRun(){
  $("#run-button").hide();
  $("#stop-button").show();

  // const sections = [
  //   {
  //     type:"start",
  //     blocks:[
  //       {
  //         id:"code1-1",
  //         code:`log("working")`
  //       },
  //       {
  //         id:"code1-2",
  //         code:`log("working2")`
  //       }
  //     ]
  //   },
  //   {
  //     type:"tick",
  //     blocks:[
  //       {
  //         id:"code2-1",
  //         code:`log("ticking")`
  //       }
  //     ]
  //   }
  // ];

  let sections = [];

  let $panes = $(".code-pane");
  $panes.each( function(){
    let section = {};
    section.type = $(this).attr("data-type") || "start";

    section.blocks = [];
    let $blocks = $(this).find("p");
    $blocks.each( function(){
      section.blocks.push({
        id: "1",
        code: $(this).text()
      });
    })

    sections.push(section);
  })
  run(sections);
}

function onStop(){
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
  challengeData.tabs.forEach((tab, i) => {
    navHtml += `<li><a href="#code-pane${i}">${tab.title}</a></li>`;

    let paneHtml = `<div id="code-pane${i}" class="tab-pane code-pane block" data-type="${tab.type}">`;

    
    tab.blocks.forEach((block, j) => {
      let codeText = block.code;

      let r = responseData?.codeBlocks;
      if (r && r[i] && r[i][j]) {
        codeText = r[i][j];
      }

      if (block.hidden) {
        paneHtml += `<p class="hidden">${codeText}</p>`;
      } else if (block.locked) {
        paneHtml += `<p class="locked">${codeText}</p>`;
      } else {
        paneHtml += `<p contenteditable="true" class="editable">${codeText}</p>`;
      }
    });
    paneHtml += `</div>`;
    
    panesHtml+=paneHtml;
  });

  $("#code-tabs .tab-nav").html(navHtml);
  $("#code-panes").html(panesHtml);

  $('#code-tabs').minitabs();
  $('#content-tabs').minitabs();
}

const updateLogContent = (logs) => {
  let html = "";

  logs.forEach((l) => {
    const c = l.color || "#FFFFFF";
    html += "<p style='color:" + c + "'>" + l.message + "</p>";
  });

  $("#log").html(html);
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

$(function(){
  init();
});

export { updateLogContent, updateCode };
