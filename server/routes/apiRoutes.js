const dayjs = require("dayjs");

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
    assertions: [],
    isHandRaised: false,
    lastChanged: 0,
  });
}

const template = require("../templates/arrays");
const theme = require("../themes/basic");

module.exports = (app) => {
  app.get("/api/template", async (req, res) => {
    temp = { ...template, theme };
    res.status(200).send(temp);
  });
  app.get("/api/versions/:students", async (req, res) => {
    const ids = req.params.students.split("&");
    const now = dayjs();

    const versionsToSend = versions.filter((v) => ids.includes(v.id + ""));
    versionsToSend.forEach((v) => {
      const lastChange = dayjs(v.editedTime);
      v.secondsSinceLastChange = Math.round(now.diff(lastChange) / 1000);
    });
    console.log("get versions", versionsToSend[0]);
    res.status(200).send(versionsToSend);
  });

  app.post("/api/version", async (req, res) => {
    const id = req.params.student;
    const data = req.body;
    const now = dayjs();

    console.log("post version", data);
    versions[data.id] = { ...versions[id], ...data, editedTime: now.format() };
    res.status(200).send(versions[data.id]);
  });
};
