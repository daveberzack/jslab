const path = require("path");

// This route path will match requests to the root route / and serve the index.html file in the client's dist folder
module.exports = (app) => {
  app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "../client/index.html"))
  );

  app.get("/player", (req, res) =>
    res.sendFile(path.join(__dirname, "../../client/player.html"))
  );

  app.get("/screen", (req, res) =>
    res.sendFile(path.join(__dirname, "../../client/screen.html"))
  );
};
