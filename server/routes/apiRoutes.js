let students = [];
for (let i = 0; i < 8; i++) {
  students[i] = {
    id: i,
    name: "Student Name" + i,
    codeBlocks: [],
  };
}

const challenge = {
  title: "Place the Ship",
  tabs: [
    {
      title: "Start",
      blocks: [
        {
          code: `//add a variable named myName here`,
          hints: ["this is a console log", "another hint", "last hint"],
        },
        {
          hidden: true,
          code: `test(myName, "You need to define a variable named myName")`,
          hints: ["this is a console log2", "another hint2", "last hint2"],
        },
        {
          locked: true,
          code: `log("myName:"+myName);`,
          hints: ["this is a console log3", "another hint3", "last hint3"],
        },
      ],
    },
    {
      title: "Tick",
      hidden: true,
      blocks: [
        {
          code: `console.log("tick");`,
          hints: ["asdf", "another hint", "last hint"],
        },
      ],
    },
  ],
  theme: "space",
};

module.exports = (app) => {
  app.get("/api/challenge", async (req, res) => {
    res.status(200).send(challenge);
  });

  app.get("/api/response/:student", async (req, res) => {
    const id = req.params.student;
    res.status(200).send(students[id]);
  });

  app.get("/api/responses/:students", async (req, res) => {
    res.status(200).send(null);
  });

  app.post("/api/response/:student", async (req, res) => {
    const id = req.params.student;
    const data = req.body;
    students[id] = { ...students[id], ...data };
    res.status(200).send(students[id]);
  });
};
