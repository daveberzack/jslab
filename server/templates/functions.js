module.exports = {
  title: "Blank",
  sections: [
    {
      title: "Your Code",
      priority: 2,
      blocks: [
        {
          locked: true,
          code: `let petType;
let petName;`,
        },
        {
          code: `//define a function called getDog 
//it should take one parameter called name
//it should set petType to "dog" 
//and petName to whatever is passed in

//define a function called getCat
//it should be the same, except set petType to "cat"`,
        },
        {
          code: `const isCatPerson = false;`,
        },
        {
          code: `//check if they're a cat person.
//If so, call getDog with any name. 
//otherwise call getCat with any name.`,
        },
        {
          locked: true,
          code: `log("I have a "+petType+" named "+petName);`,
          hints: ["this is a console log3", "another hint3", "last hint3"],
        },
      ],
    },
  ],
  theme: "space",
};
