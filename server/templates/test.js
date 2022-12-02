module.exports = {
  title: "Test",
  numberOfAssertions: 3,
  backgroundImage: "space.jpg",
  sections: [
    {
      title: "Your Code",
      priority: 2,
      blocks: [
        {
          locked: true,
          code: `var num;`,
        },
        {
          code: `//var myName;`,
          instructions: `set myName to dave`,
          hint: `add ="dave" to the end`,
          solution: `var myName="dave"`,
          hidden: `assert(typeof myName != "undefined", 0, "You need to define a variable named myName");
assert(myName=="dave", 1, "myName must be dave");`,
        },
        {
          code: `//write an add function here`,
          instructions: `write an add function here`,
          hint: `write some code here`,
          solution: `function add(a,b){ return a+b }`,
          hidden: `assert(add(3,2)==5, 2, "You need to define an function called add that adds two numbers");`,
          assertionDependencies: [0, 1],
        },
        {
          code: `let spaceship = {
  id:"ship",
  image:"spaceship.png",
  x:50,
  y:30,
  h:40,
  w:20
}`,
          hidden: `onStop();`,
        },
        {},
      ],
    },
    // {
    //   title: "End",
    //   hidden: true,
    //   priority: 0,
    //   blocks: [
    //     {
    //       code: `console.log("run cleanup");`,
    //     },
    //     {
    //       code: `cleanup = function(){ clearInterval(tickInterval); }`,
    //     },
    //   ],
    // },
  ],
};
