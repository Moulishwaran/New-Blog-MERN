const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");

// database    pass ===== tPrSBwSgAL94QoTt
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    console.log("MongoDB Database Connected");
  } catch (error) {
    console.log(error);
  }
};

//middlewares
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/images", express.static(path.join(__dirname, "/images")));
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

//image upload
const storage = multer.diskStorage({
  destination: (req, file, fn) => {
    fn(null, "images");
  },
  filename: (req, file, fn) => {
    fn(null, req.body.img);
    // fn(null,"image1.jpg")
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  // console.log(req.body)
  res.status(200).json("Image has been uploaded successfully!");
});

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Server is running on port : 5000!");
});
