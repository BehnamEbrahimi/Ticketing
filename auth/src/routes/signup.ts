import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest } from "./../middlewares/validate-request";
import { User } from "../models/user";
import { BadRequestError } from "./../errors/bad-request-error";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"), // These middlewares append the errors on request object and the next middleware can pull that info off.
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userInDb = await User.findOne({ email });

    if (userInDb) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });
    await user.save();

    const token = user.generateAuthToken();
    req.session = { jwt: token };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
