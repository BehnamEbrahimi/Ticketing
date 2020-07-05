import { Document, Model, model, Schema } from "mongoose";
import jwt from "jsonwebtoken";

import { PasswordManager } from "../utils/password-manager";

// An interface that describes the properties that are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties that a User Model has
interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a User Document has
interface UserDoc extends Document {
  email: string;
  password: string;
  generateAuthToken(): string;
}

const userSchema = new Schema({
  email: {
    type: String, // It is not TS. It is mongoose.
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (done) {
  // a middleware function implemented in mongoose. It will be executed on a user document before saving to the db.
  const user = this;

  if (user.isModified("password")) {
    const hashed = await PasswordManager.toHash(user.get("password"));
    user.set("password", hashed);
  }

  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  // To use TS with mongoose, we use this function instead of new User() to create a user.
  return new User(attrs);
};

userSchema.methods.toJSON = function () {
  // if an object has a toJSON method, JS will invoke it instead of stringify-ing the whole object when calling JSON.stringify.
  const user = this;
  const userObject = user.toObject();

  userObject.id = userObject._id;

  delete userObject._id;
  delete userObject.password;
  delete userObject.__v;

  return userObject;
};

userSchema.methods.generateAuthToken = function () {
  const user = this;

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_KEY! // because we know that in the start function, the env variable is defined.
  );

  return token;
};

const User = model<UserDoc, UserModel>("User", userSchema);

export { User };
