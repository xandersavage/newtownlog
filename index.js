const Path = require("path");
const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");

const app = express();

// mongoose.connect(
//   "mongodb+srv://swankylex:cgOJKYumlgA2QG6k@newtownlog.1en8h4u.mongodb.net/?retryWrites=true&w=majority&appName=newtownlog"
// );

const userRouter = require("./router/user");
const viewRouter = require("./router/view");

app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(
  methodOverride(function(req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // Look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
app.use(express.json());
app.set("view engine", "pug"); //SPECIFY VIEW ENGINE
app.set("views", Path.join(__dirname, "views")); //SET PATH FOR VIEWS
app.use(express.static(Path.join(__dirname, "public"))); //SET PUBLIC PATH

app.use(userRouter);
app.use(viewRouter);

const port = 3000;

app.listen(port, () => {
  console.log("Hey, server is running on port: ", port);
});

export default app;
