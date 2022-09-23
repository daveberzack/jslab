let numberOfPlayers = 3;

function ping() {
  fetch("/api/state", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      update(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function update(data) {
  console.log(data);

  const defaultImage =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ9kLmTELHzWVjMuKbFnKb-Yw7S31slVb6IA&usqp=CAU";

  showImages = true;

  console.log("p:" + numberOfPlayers);
  for (let i = 0; i < numberOfPlayers; i++) {
    if (!data[i]?.image || data[i]?.image == "") showImages = false;
  }

  for (let i = 0; i < numberOfPlayers; i++) {
    document.getElementById("score" + i).innerHTML = data[i]?.score;
    document.getElementById("picture" + i).src = showImages
      ? data[i]?.image
      : defaultImage;
  }

  let winW = window.innerWidth;
  let winH = window.innerHeight;
  let headerH = document.getElementsByTagName("header")[0].clientHeight;

  let w = (2 * winW) / numberOfPlayers - 30;
  let h = (winH - headerH) / 2 - 30;

  w = Math.min(w, h);
  document.querySelectorAll("#pictures img").forEach((element) => {
    element.style.width = w + "px";
  });
}

function init() {
  numberOfPlayers = window.location.search.substring(1);

  for (let i = numberOfPlayers; i < 8; i++) {
    console.log("score-block" + i);
    document.getElementById("score-block" + i).style.display = "none";
    document.getElementById("picture-block" + i).style.display = "none";
  }
  setInterval(ping, 5000);
  ping();
}

init();
