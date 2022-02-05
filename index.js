const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multerUpload = require("./middleware/multer");
const { createAndUploadFile, auth } = require("./middleware/drive");
const verify = require("./middleware/verify");

const app = express();

dotenv.config();

app.use(express.json());


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.configure(function () {
    app.use(allowCrossDomain);
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(application_root, "public")));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });


// connecting to mongoDB
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));


// upload files using multer

app.post("/api/upload", verify, multerUpload().single("file"), async (req, res) => {
      await createAndUploadFile(req, auth);
      console.log("File uploaded to drive. File Id >>> " + req.fileId);
      res.status(200).json({ fileId: req.fileId });
    }
);



app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);


app.listen(process.env.PORT || 5000);
