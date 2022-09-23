const { Replicate } = require("./replicate");
require("dotenv").config();

module.exports = async (prompt) => {
  prompt =
    prompt +
    "realistic, cinematic lighting, highly detailed, intricate, shiny, digital painting, artstation, concept art, smooth, sharp focus, illustration, art by artgerm and greg rutkowski";

  const replicate = new Replicate();
  const model = await replicate.models.get("stability-ai/stable-diffusion");

  return await getResult(prompt, model, 0);
};

getResult = async (prompt, model, tries) => {
  const prediction = await model.predict({
    prompt: prompt,
  });

  if (prediction && prediction[0]) {
    console.log(prediction[0]);
    return prediction[0];
  } else if (tries < 3) {
    console.log("error #" + tries);
    return getResult(prompt, model, tries + 1);
  } else {
    return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0AVvdQVH2LdtsYFauXEnnrgt2CG1diwowkJ1qLwGXLjJrzStCxFnH4p2rEDA9jkomk54&usqp=CAU";
  }
};
