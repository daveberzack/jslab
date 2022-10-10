let versions = [];
for (let i = 0; i < 8; i++) {
  versions[i] = {
    id: i,
    name: "Student Name" + i,
    sections: [],
  };
}

const template = {
  title: "Place the Ship",
  sections: [
    {
      title: "Start",
      blocks: [
        {
          locked: true,
          code: `var myName;`,
          hints: ["this is a console log3", "another hint3", "last hint3"],
        },
        {
          code: `//add a variable named myName here`,
          hints: ["this is a console log", "another hint", "last hint"],
        },
        {
          hidden: true,
          code: `test(myName, 1, "You need to define a variable named myName")`,
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
      blocks: [
        {
          code: `var tickInterval = setInterval( function(){
            console.log("tick");
          }, 500);`,
        },
      ],
    },
    {
      title: "End",
      hidden: true,
      blocks: [
        {
          code: `console.log("run cleanup");`,
        },
        {
          code: `cleanup = function(){ clearInterval(tickInterval); }`,
        },
      ],
    },
  ],
  theme: "space",
};

module.exports = (app) => {
  app.get("/api/template", async (req, res) => {
    res.status(200).send(template);
  });

  app.get("/api/versions/:students", async (req, res) => {
    const id = req.params.students.split("&")[0];
    res.status(200).send(versions);
  });

  app.post("/api/version", async (req, res) => {
    const id = req.params.student;
    const data = req.body;
    versions[data.id] = { ...versions[id], ...data };
    res.status(200).send(versions[data.id]);
  });
};
