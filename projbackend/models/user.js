const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true
    },

    lastname: {
      type: String,
      maxlength: 32,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    userinfo: {
      type: String,
      trim: true
    },

    encrypassword: {
      type: String,
      required: true
    },
    salt: String,
    role: {
      type: Number,
      default: 0
    },
    purchases: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true
  }
);

userSchema
  .virtual("password")
  .set(function(password) {
    this._password = password; //created a private variable using underscore(_)
    this.salt = uuidv1();
    this.encrypassword = this.securePassword(password);
  })
  .get(function() {
    return this._password;
  });

userSchema.methods = {
  authenticate: function(plainPassword) {
    return this.securePassword(plainPassword) === this.encrypassword;
  },

  securePassword: function(plainPassword) {
    if (!plainPassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};

module.exports = mongoose.model("User", userSchema);
