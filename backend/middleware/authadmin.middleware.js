const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");


const durationTokenLogout = 1;

exports.requireAuthAdmin = (req, res, next) => {
   const token = req.cookies.jwtadmin;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.status(401).send("token not found");
      } else {
            UserModel.findOne({ _id: decodedToken.id ,ban: false,role:'admin'} ,(err,doc)=>{
              if (doc) {
              console.log(doc);
                req.role = "admin"
                req.user = decodedToken.id;
                next()
              } else {
              res.cookie("jwt", "", { maxAge: durationTokenLogout }),
              res.cookie("jwtadmin", "", { maxAge: durationTokenLogout }),
              res.status(400).json("utilisateur banni");
                }
            })
          
          }
        });
  } else {
    req.role = ""
    req.user = "";
    console.log("access denied invalid token ");
    next();
  }
};

