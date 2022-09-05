const { Replicate } = require("./replicate");
require("dotenv").config();

module.exports = async (prompt) => {
  const replicate = new Replicate();
  const model = await replicate.models.get("stability-ai/stable-diffusion");
  const prediction = await model.predict({
    prompt: prompt,
    num_inference_steps: 200,
    prompt_strength: 1,
  });
  return prediction[0];
};
