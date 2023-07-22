const express = require("express");
const path = require("path")
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");
const { requireAuthAdmin } = require("./middleware/authadmin.middleware");
require("./config/db");
require("dotenv").config({ path: ".env" });

const app = express();

// Cors parametre \\ 

const corsOptions = {
  Origin: '*' ,
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ["*", "Content-type"],
  exposeHeaders: ["*"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};

app.use(cors(corsOptions));

// parser \\
app.use(cookieParser());
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//jwt check user id \\
app.get('*', checkUser
// ,(req,res)=>{ console.log(res.locals.user._id);res.send(res.locals.user._id)}
); // TODO 
app.get(`${process.env.BASE_URL}/jwtid`, requireAuth, (req,res)=>{
  if(req.user === ''){
    res.status(201).json(res.data = 'notoken')
  }else{
  res.status(200).send(res.locals.user._id)
}
});

app.get(`${process.env.BASE_URL}/jwtidadmin`,requireAuthAdmin, (req,res)=>{
  if(req.user === ''){
    res.status(201).json(res.data = 'notoken')
  }else{
  res.status(200).send(res.locals.user._id)
}
});

// const dir = "images";
const dir = `${process.env.BASE_SERVER}`;
if (!fs.existsSync(dir)) {fs.mkdirSync(dir)}
const dirPictureProfil = `${process.env.BASE_SERVER}/profil`;
if (!fs.existsSync(dirPictureProfil)) { fs.mkdirSync(dirPictureProfil)}
const dirPicturePost = `${process.env.BASE_SERVER}/post`;
if (!fs.existsSync(dirPicturePost)) { fs.mkdirSync(dirPicturePost) }

// routes\\
app.use(`${process.env.BASE_URL}/api/user`, userRoutes);
app.use(`${process.env.BASE_URL}/api/post`, postRoutes);

// config serveur \\
app.listen(process.env.PORT, (port) =>
  console.log(`listening on port ${process.env.PORT}`)
);
