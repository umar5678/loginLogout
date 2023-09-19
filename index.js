import express from "express";
import path from "path";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt"
import helmet from "helmet"; // Added helmet for security headers
import morgan from "morgan"; // Added morgan for logging
import rateLimit from "express-rate-limit"; // Added rate limiting
import dotenv from "dotenv"

dotenv.config()


const app = express();

const jwtSecret = process.env.JWT_SECRET;



// Configure helmet for security headers
app.use(helmet());

// Configure morgan for logging
app.use(morgan("combined"));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/login", limiter);
app.use("/register", limiter);

//mongoDb connention
mongoose
  .connect("mongodb://127.0.0.1:27017/loginLogout")
  .then(() => console.log("database connected"))
  .catch((e) => console.log(e));

// schema for database
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
//making collection or model
const User = mongoose.model("User", userSchema);

// middlewere for static folder path
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs"); // view engine ejs

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/alreadyUser", (req, res) => {
  res.render("alreadyUser");
});

app.get("/registerNewUser", (req, res) => {
  res.render("registerNewUser")
})

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  //check if user exist in database
  let userExist = await User.findOne({ email });

  // if user exist, redirect to a page that says user exists
  if (userExist) {
    res.redirect("/alreadyUser");
  } else {

    // first hash the password and save hashed password in DB
    const hashedPassword = await bcrypt.hash(password, 10)
    // creating a new user in User model in database
    const user = await User.create({
      name,
      email,
      password : hashedPassword,
    });

    // generate JWT token and cookie
    const token = jwt.sign({ _id: user.id }, jwtSecret);
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3 * 60 * 1000), // 3 days
    });

    // on successfully user creation, render logout page which show name of user and his email also gives logout btn
    res.redirect("/dashboard");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });

  if (!user) return res.redirect("/registerNewUser");

  // decrypt the password recived from user collection 
  // and
  // check if passwords match
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.render("login", { msg: "incorrect password", email: email });

  //genete JWT token + cookies
  const token = jwt.sign({ _id: user.id }, jwtSecret);
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 3 * 60 * 1000), // 3 days
  });

  res.redirect("/dashboard");
});

// logout and delete cookie
app.post("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if(token) {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = await User.findById(decoded._id);

    next()
  }else{
    res.redirect("/login")
  }
}

app.get("/dashboard", isAuthenticated ,(req, res) => {
  
  
  const { name, email } = req.user;

  res.render("dashboard", {
    name: name,
    email: email,
  });
});

app.listen(4400, () => {
  console.log("server is listening on port 4400");
});