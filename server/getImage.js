const { Replicate } = require("./replicate");
require("dotenv").config();

module.exports = async (prompt) => {
  const replicate = new Replicate();
  const model = await replicate.models.get("stability-ai/stable-diffusion");
  const prediction = await model.predict({ prompt: prompt });
  return prediction[0];
};
