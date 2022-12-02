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
          code: `var myArray;
var myElement;`,
        },
        {
          code: `//set myArray equal to an empty array`,
          hidden: `assert(myArray && myArray.length==0, 1, "You need to set myArray to an empty array");`,
        },
        {
          code: `//now set myArray equal to an array with three items`,
          hidden: `assert(myArray && myArray.length==3, 1, "You need to set myArray to an array with three items");`,
        },
        {
          code: `//use push to add one more item to the end of the array`,
          hidden: `assert(myArray.length==4, 1, "You need to push another item to the end of the array"); let temp=myArray[0]`,
        },
        {
          code: `//use shift() to remove the first item and then store it in the variable myElement`,
          hidden: `assert(myArray.length==3 && myElement==temp, 1, "You need to shift the item and store it in myElement");`,
        },
        {
          code: `//loop through myArray using a for loop, and log each value
//use this editor's log() function, not console.log()`,
          
        },
      ],
    },
  ],
};


// xhidden: `
//           let hasLoggedAll = true;
//           for (let j=0; j<myArray.length; j++){
//             if (!logs.find( l => l.message.contains(myArray[j]))) hasLoggedAll = false;
//           }
//           assert(hasLoggedAll, 1, "You need to log all the values in your array. Log only the value in each log ");`,