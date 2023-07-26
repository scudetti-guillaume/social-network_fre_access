const UserModel = require("../models/user.model");
const PostModel = require("../models/post.model");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");
const jwt = require("jsonwebtoken");

// all user end point \\

exports.getAllUsers = async (req, res) => {
  // const badge =  await UserModel.find().select("-badge");
  const users = await UserModel.find().select("-password").select("-badge").select("-role");

  res.status(200).json(users);
};

// user info end point \\

exports.userInfo = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("utilsateur inconnu :" + req.params.id);
  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("utilisateur inconnu: " + err);
  })
    .select("-password")
    .select("-badge")
    
};

// update user end point \\

exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("utilsateur inconnu :" + req.params.id);
  const postedBy = req.params.id;
  const connectedUser = req.user;
  if (req.role === 'admin' || connectedUser === postedBy) {
    const updatedData = {
      bio: req.body.bio,
      photo:
        req.file != null
          ? `${req.protocol}://${req.get("host")}/${process.env.BASE_IMAGE_PROFIL}/${
              req.file.filename
            }`
          : ``,
    };
    
    const updatePicture = (
      req.file != null
        ? `${req.protocol}://${req.get("host")}/${process.env.BASE_IMAGE_PROFIL}/${
              req.file.filename
            }`
          : ``
    )
    try {

await PostModel.updateMany(
  { "comments.commenterId": req.params.id },
  { $set: { "comments.$[elem].commenterPicture": updatePicture } },
  { arrayFilters: [{ "elem.commenterId": req.params.id }], multi: true }
);

await PostModel.updateMany(
  { posterId: req.params.id },
  { $set: { posterpicture: updatePicture } },
  {new : true}
  // { arrayFilters: [{ "elem.commenterId": req.params.id }], multi: true }
);
    
      await UserModel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedData },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
        .then((docs) => res.json("profil mise a jour"))
        .catch((err) => res.status(500).send({ message: err }));
        
    
            
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  
  } else {
    res.cookie("jwt", "", { session: false, maxAge: 1 });
    res.status(400).json("non autoriser");
  }
};

exports.signalUser = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json("utilsateur inconnu :" + req.params.id);
  const postedBy = req.body.userFromId;
  const connectedUser = req.user;
  if (req.role === 'admin'|| connectedUser === postedBy) {
    const date = new Date(Date.now());
    const days = date.toLocaleDateString();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const finalDate = `signalé le ${days} à ${hours}h${minutes}`;
    const signal = {
      signalById: req.body.userFromId,
      signalByFullname: req.body.userFromFullname,
      date: finalDate,
    };
    UserModel.findById(
      req.params.id,
      {
        profilSignalBy: {
          $elemMatch: {
            signalByFullname: req.body.userFromFullname,
            SignalById: req.body.userFromId,
          },
        },
      },
      (err, doc) => {
        console.log(doc.profilSignalBy);
        if (doc.profilSignalBy[0] !== undefined) {
          res.status(400).json("utilisateur déjà signalé");
        } else {
          UserModel.findByIdAndUpdate(
            req.params.id,
            { $push: { profilSignalBy: signal } },
            (err, doc) => {
              if (err) res.status(400).json(err);
              else res.status(200).json("utilisateur signalé");
            }
          );
          PostModel.updateMany(
            { posterId: req.params.id },
            { $push: { signalProfil: req.body.userFromId } },
            (err,
            (doc) => {
              if (!err) console.log("ajout postsignal ok ");
              else console.log("ajout postSignal erreur");
            })
          );
        }
      }
    );
  } else {
    res.cookie("jwt", "", { session: false, maxAge: 1 });
    res.status(400).json("delete");
  }
};

exports.banuser = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json("utilsateur inconnu :" + req.params.id);
  if (req.role !== 'admin') {
    res.cookie("jwt", "", { session: false, maxAge: 1 });
    res.status(400).json("tu n'est pas l'admin");
  } else {
    UserModel.findById(req.params.id, { ban: true }, (err, doc) => {
      if (doc.ban == true) {
        res.status(400).json("utilisateur deja banni");
      } else {
        PostModel.updateMany(
          { posterId: req.params.id },
          { $set: { banuser: true } },
          (err, doc) => {
            if (err) return res.status(400).json("post" + err);
            else console.log(doc);
          }
        );
        UserModel.findByIdAndUpdate(
          req.params.id,
          { $set: { ban: true } },
          (err, doc) => {
            if (err) return res.status(400).send("user" + err);
            res.status(200).send("Utilisateur banni");
          }
        );
      }
    });
  }
};

exports.unbanuser = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("utilsateur inconnu :" + req.params.id);
  if (req.role !== 'admin') {
    res.cookie("jwt", "", { session: false, maxAge: 1 });
    res.status(400).json("delete");
  } else {
    UserModel.findById(req.params.id, { ban: false }, (err, doc) => {
      if (doc.ban == false) {
        res.status(400).json("utilisateur non banni");
      } else {
        PostModel.updateMany(
          { posterId: req.params.id },
          { $set: { banuser: false } },
          (err, doc) => {
            if (err) return res.status(400).json("post" + err);
            else console.log(doc);
          }
        );
        UserModel.findByIdAndUpdate(
          req.params.id,
          { $set: { ban: false } },
          (err, doc) => {
            if (!err) res.status(200).json("utilisateur débanni");
            else res.status(400).json("user" + err);
          }
        );
      }
    });
  }
};

exports.delPicUser = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("utilsateur inconnu :" + req.params.id);
  UserModel.findById(req.params.id)
    .then((post) => {
      const postedBy = post.posterId;
      const connectedUser = req.user;
      if (req.role === 'admin' || connectedUser === postedBy) {
        let delimg = post.picture.split("profil/")[1];
        fs.unlink(`${process.env.BASE_DELETE_IMAGE_PROFIL}/${delimg}`, () => {
          UserModel.findByIdAndRemove(req.params.id, (err, docs) => {
            if (!err) {
              res.status(200).json("lalalala photo supprimer");
            } else {
              res.status(400).send(err);
            }
          });
        });
        
        
      } else {
        res.cookie("jwt", "", { session: false, maxAge: 1 });
        res.status(400).json("nocookie");
      }
    })
    .catch((err) => {
      err;
    });
};


// follow user  end point \\

exports.follow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  )
    return res.status(400).send("utilsateur inconnu :" + req.params.id);
  const postedBy = req.params.id;
  const connectedUser = req.user;
  if (req.role === 'admin' || connectedUser === postedBy) {
    UserModel.find(
      { _id: req.params.id, following: req.body.idToFollow },
      (err, doc) => {
        if (doc[0] != undefined)
        return res.status(400).json("utilisateur deja follow");
        else {
          try {
            UserModel.findByIdAndUpdate(
              req.params.id,
              { $addToSet: { following: req.body.idToFollow } },
              { new: true, upsert: true },
              (err, doc) => {
                if (!err) res.status(201).json("follow ok");
                else res.status(400).json(err);
              }
            );

            UserModel.findByIdAndUpdate(
              req.body.idToFollow,
              { $addToSet: { followers: req.params.id } },
              { new: true, upsert: true }
            ).catch((err) => res.status(400).json({ message: err }));

            PostModel.findOneAndUpdate(
              { posterId: req.body.idToFollow },
              { $push: { posterfollower: req.params.id } }
              // { new: true, upsert: true }
              ).catch((err) => res.status(400).json({ message: err }));
              PostModel.findOneAndUpdate(
                { posterId: req.params.id },
                { $push: { posterfollowing: req.body.idToFollow } }
                // { new: true, upsert: true }
                ).catch((err) => res.status(400).json({ message: err }));
              } catch (err) {
                res.status(500).json({ message: err });
          }
        }
      }
      );
    } else {
      res.cookie("jwt", "", { session: false, maxAge: 1 });
      res.status(400).json("non autoriser");
    }
  };

// unfollow user end point \\

exports.unfollow = (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnFollow)
  )
    return res.status(400).send("utilsateur inconnu :" + req.params.id);
  const postedBy = req.params.id;
  const connectedUser = req.user;
  if (req.role === 'admin'|| connectedUser === postedBy) {
    try {
      UserModel.findByIdAndUpdate(
        req.params.id,
        { $pull: { following: req.body.idToUnFollow } },
        (err, doc) => {
          if (err) res.status(400).json("probleme unfollow");
          else res.status(201).json("unfollow ok ");
        }
      );
  

      UserModel.findByIdAndUpdate(
        req.body.idToUnFollow,
        { $pull: { followers: req.params.id } }
        // { new: true, upsert: true }
      ).catch((err) => res.status(400).json({ message: err }));
      PostModel.findOneAndUpdate(
        { posterId: req.body.idToUnFollow },
        { $pull: { posterfollower: req.params.id } }
        // { multi: true, upsert: true }
      ).catch((err) => res.status(400).json({ message: err }));
      PostModel.findOneAndUpdate(
        { posterId: req.params.id },
        { $pull: { posterfollowing: req.body.idToUnFollow } }
        // { multi: true, upsert: true }
      ).catch((err) => res.status(400).json({ message: err }));
    } catch (err) {
      res.status(500).json({ message: err });
    }
  } else {
    res.cookie("jwt", "", { session: false, maxAge: 1 });
    res.status(400).json("non autoriser");
  }
};

//=================================== non implant =========================================\\


        // user delete end point \\
    
exports.userDelete = async (req, res) => {

  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Utilisateur inconnu :" + req.params.id);

  const postedBy = req.params.id;
  const connectedUser = req.user;

  if (req.role === 'admin' || connectedUser === postedBy) {
    try {
      // Supprimer tous les commentaires avec commenterId égal à req.params.id
      const updateResult = await PostModel.updateMany(
        { "comments.commenterId": req.params.id },
        { $pull: { comments: { commenterId: req.params.id } } }
      );
      console.log(updateResult);

      // Supprimer tous les posts ayant le posterId égal à req.params.id
      const deletePostsResult = await PostModel.deleteMany({ posterId: req.params.id });
      console.log(deletePostsResult);

      // Supprimer l'utilisateur
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json('Erreur: Utilisateur non trouvé.');
      }

      if (user.photo !== undefined) {
        let delimg = user.photo.split("profil/")[1];
        console.log(delimg);
        if (delimg != "") {
          fs.unlink(`${process.env.BASE_DELETE_IMAGE_PROFIL}/${delimg}`, (err) => {
            if (err) console.log(err);
            else {
              console.log("Photo supprimée");
            }
          });
        } else {
          console.log("Utilisateur inconnu: " + err);
        }
      }

      const userDeleteResult = await UserModel.findByIdAndRemove(req.params.id);
      console.log(userDeleteResult);

      if (!userDeleteResult) {
        return res.status(404).json('Erreur: Utilisateur non trouvé.');
      }

      // Suppression réussie
      res.cookie("jwt_soc_free", "", { session: false, maxAge: 1 });
      return res.status(200).json({ message: "Utilisateur supprimé" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Une erreur s'est produite lors de la suppression de l'utilisateur." });
    }
  } else {
    res.cookie("jwt_soc_free", "", { session: false, maxAge: 1 });
    res.status(400).json("Non autorisé");
  }
};



// exports.userDeleteBan = async (req, res) => {

//   if (!ObjectID.isValid(req.params.id))
//     return res.status(400).send("Utilisateur inconnu :" + req.params.id);
//   const banUser = req.body.data.id
//   const postedBy = req.params.id;
//   const connectedUser = req.user;

//   if (req.role === 'admin' || connectedUser === postedBy) {
//     try {
//       // Supprimer tous les commentaires avec commenterId égal à req.params.id
//       const updateResult = await PostModel.updateMany(
//         { "comments.commenterId": req.params.id },
//         { $pull: { comments: { commenterId: req.params.id } } }
//       );
//       console.log(updateResult);

//       // Supprimer tous les posts ayant le posterId égal à req.params.id
//       const deletePostsResult = await PostModel.deleteMany({ posterId: req.params.id });
//       console.log(deletePostsResult);

//       // Supprimer l'utilisateur
//       const user = await UserModel.findById(req.params.id);
//       if (!user) {
//         return res.status(404).json('Erreur: Utilisateur non trouvé.');
//       }

//       if (user.photo !== undefined) {
//         let delimg = user.photo.split("profil/")[1];
//         console.log(delimg);
//         if (delimg != "") {
//           fs.unlink(`${process.env.BASE_DELETE_IMAGE_PROFIL}/${delimg}`, (err) => {
//             if (err) console.log(err);
//             else {
//               console.log("Photo supprimée");
//             }
//           });
//         } else {
//           console.log("Utilisateur inconnu: " + err);
//         }
//       }

//       const userDeleteResult = await UserModel.findByIdAndRemove(req.params.id);
//       console.log(userDeleteResult);

//       if (!userDeleteResult) {
//         return res.status(404).json('Erreur: Utilisateur non trouvé.');
//       }

//       // Suppression réussie
//       res.cookie("jwt_soc_free", "", { session: false, maxAge: 1 });
//       return res.status(200).json({ message: "Utilisateur supprimé" });
//     } catch (err) {
//       console.log(err);
//       return res.status(500).json({ message: "Une erreur s'est produite lors de la suppression de l'utilisateur." });
//     }
//   } else {
//     res.cookie("jwt_soc_free", "", { session: false, maxAge: 1 });
//     res.status(400).json("Non autorisé");
//   }
// };
