require('dotenv').config();
const favicon = require("serve-favicon");
const express = require('express')
const app = express();
const cors = require('cors')
const db = require("./config/connections");
const bodyParser = require("body-parser")
const path = require("path")


 // middlewares
 app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors())


// routes
app.use("/users",require("./routes/users"))





// prot setting
const port = process.env.PORT || 4000
app.listen(port,()=>console.log(`Listening on port ${port}`))



// database connecting
db.connect((err) => {
    if (err) console.log(err);
    else console.log("Database connected");
  });