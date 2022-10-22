let versions = [];

const names = [
  "Ashtean",
  "Sofia",
  "Jack",
  "Patrick",
  "Zaria",
  "Emmanuelle",
  "Amon",
  "Aaron",
  "Skyler",
  "Jules",
  "Nick",
  "Roman",
  "Remy",
  "Ryden",
  "Lydia",
];
for (let i = 0; i < names.length; i++) {
  versions.push({
    id: i,
    name: names[i],
    sections: [],
  });
}

const template = require("../templates/blank");

module.exports = (app) => {
  app.get("/api/template", async (req, res) => {
    res.status(200).send(template);
  });

  app.get("/api/versions/:students", async (req, res) => {
    const ids = req.params.students.split("&");

    console.log(versions);
    const versionsToSend = versions.filter((v) => ids.includes(v.id + ""));
    console.log("...");
    console.log(versionsToSend);
    res.status(200).send(versionsToSend);
  });

  app.post("/api/version", async (req, res) => {
    const id = req.params.student;
    const data = req.body;
    versions[data.id] = { ...versions[id], ...data };
    res.status(200).send(versions[data.id]);
  });
};
