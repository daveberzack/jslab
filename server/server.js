const express = require("express");

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.static("../client"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Requires HTML route
require("./routes/htmlRoutes")(app);
require("./routes/apiRoutes")(app);

app.listen(PORT, () => console.log(`Now listening on port: ${PORT}`));
