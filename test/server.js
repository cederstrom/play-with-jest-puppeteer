const app = require("./app");
const port = 4444;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}/`);
});
