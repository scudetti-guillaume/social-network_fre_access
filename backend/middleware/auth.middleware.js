const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

const durationTokenLogout = 1;

exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token ) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.status(401).send("token not found");
      } else {
        UserModel.findOne({ _id: decodedToken.id, ban: true }, (err, doc) => {
          if (doc) {
            res.cookie("jwt", "", { maxAge: durationTokenLogout }),
              res.status(400).json("utilisateur banni");
          } else {
            UserModel.findOne({ _id: decodedToken.id ,role : undefined} ,(err,doc)=>{
              if (doc == null) {
                req.role = "admin"
                req.user = decodedToken.id;
                next()
              } else {
                req.user = decodedToken.id;
                next();}
            })
          
          }
        });
      }
    });
  } else {
    req.role = ""
    req.user = "";
    console.log("access denied invalid token ");
    next();
  }
};


exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.cookie("jwt", "", { session: false, maxAge: 1 });

        next();
      } else {
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


