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
  data.forEach((e, i) => {
    if (e.image == "") showImages = false;
  });

  data.forEach((e, i) => {
    document.getElementById("score" + i).innerHTML = e.score;
    document.getElementById("picture" + i).src = showImages
      ? e.image
      : defaultImage;
  });
}

setInterval(ping, 5000);
ping();
