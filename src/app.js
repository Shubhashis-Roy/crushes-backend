const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE, PATCH",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
// User.syncIndexes();

const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("DB connection established...");
    app.listen(3001, () => {
      console.log("server is listening on port 3001");
    });
  })
  .catch((err) => {
    console.log("DB connection can't be establishe: ", err);
  });
