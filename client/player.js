function sendPrompt() {
  const prompt = document.getElementById("prompt").value;
  const id = window.location.search.substring(1);
  alert("Prompt Sent");
  document.getElementById("prompt").value = "";
  document.getElementById("prompt-button").disabled = true;
  data = {
    id,
    prompt,
  };
  fetch("/api/prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("prompt-button").disabled = false;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function sendVote(choice) {
  const id = window.location.search.substring(1);
  data = {
    id,
    choice,
  };
  fetch("/api/vote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Vote Sent");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function endRound() {
  fetch("/api/endRound", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Round Ended");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function restartGame() {
  fetch("/api/endRound", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Game Ended");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function init() {
  const id = window.location.search.substring(1);
  if (id != 0) {
    document.getElementById("admin").style.display = "none";
  }
}

init();
