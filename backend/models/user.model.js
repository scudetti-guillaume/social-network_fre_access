const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

// schema model database mongoose\\

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      minlenth: 3,
      maxlength: 50,
      trim: true,
    },
    fullname: {
      type: String,
      minlenth: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      minlenth: 3,
      maxlength: 100,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlenth: 3,
      maxlength: 50,
      trim: true,
    },
    likes: {
      type: [String],
    },
    role: {
      type: String,
      
    },
    photo: {
      type: String,
    },
    bio: {
      type: String,
      max: 1024,
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    postSignalBy: {
      type: [
        {
          signalPostId: String,
          signalUserId: String,
          date: String,
        },
      ],
    },
    profilSignalBy: {
      type: [
        {
          signalByFullname: { type: String },
          signalById: { type: String },
          date: { type: String },
        },
      ],
    },
    ban: {
      type: Boolean,
      default: false,
    },
    comments: {
      type: [
        {
          commentId: {
            type: String,
          },
          postCommentId: {
            type: String,
            required: true,
          },
          postCommentFullname: {
            type: String,
          },
          comment: {
            type: String,
            trim: true,
            maxlenght: 200,
            required: true,
          },
          commentDate: {
            type: String,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

//bcrypt password and badge user \\

// crypt password and badge from sign up \\
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// decrypt to compare badge and password login -- signup \\
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
        return user;
    }
    throw Error("test password accée refusé  ");
  }
  throw Error("test email accée refusé ");
};

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
