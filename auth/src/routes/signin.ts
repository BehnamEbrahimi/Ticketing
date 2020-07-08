import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@betickets/common";

import { PasswordManager } from "../utils/password-manager";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password must be supplied"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userInDb = await User.findOne({ email });
    if (!userInDb) {
      throw new BadRequestError("Invalid credentials");
    }

    const isMatch = await PasswordManager.compare(userInDb.password, password);
    if (!isMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    const token = userInDb.generateAuthToken();
    req.session = { jwt: token };

    res.status(200).send(userInDb);
  }
);

export { router as signinRouter };
