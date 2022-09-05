const getImage = require("../getImage");

let players = [];
for (let i = 0; i < 6; i++) {
  players[i] = {
    prompt: "",
    image: "",
    vote: -1,
    score: 0,
  };
}

module.exports = (app) => {
  app.post("/api/prompt", async (req, res) => {
    const id = req.body.id * 1;
    const prompt = req.body.prompt;
    console.log(id + ":" + prompt);
    const url = await getImage(prompt);
    players[id].image = url;
    players[id].prompt = prompt;
    res.status(200).send({ message: "success" });
  });

  app.post("/api/vote", async (req, res) => {
    const id = req.body.id * 1;
    const choice = req.body.choice * 1;
    players[id].vote = choice;
    res.status(200).send({ message: "success" });
  });

  app.get("/api/state", async (req, res) => {
    res.status(200).send(players);
  });

  app.post("/api/endRound", async (req, res) => {
    console.log("endRound", players);

    for (let i = 0; i < 6; i++) {
      const vote = players[i].vote;
      if (vote >= 0) {
        console.log(vote + ":", players[vote]);
        players[vote].score++;
      }
    }

    for (let i = 0; i < 6; i++) {
      players[i].vote = -1;
      players[i].prompt = "";
      players[i].image = "";
    }
    res.status(200).send({ message: "success" });
  });

  app.post("/api/restartGame", async (req, res) => {
    console.log("restart");
    players = [];
    for (let i = 0; i < 6; i++) {
      players[i] = {
        prompt: "",
        image: "",
        vote: -1,
        score: 0,
      };
    }
    res.status(200).send({ message: "success" });
  });
};
