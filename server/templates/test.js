module.exports = {
  title: "Blank",
  sections: [
    {
      title: "Your Code",
      priority: 2,
      blocks: [
        {
          code: `console.log("run start");`,
        },
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
      title: "End",
      hidden: true,
      priority: 0,
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
