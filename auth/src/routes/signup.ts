import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req); // The above middlewares append the errors on request object and this function can pull that info off.

    if (!errors.isEmpty()) {
      // isEmpty method is defined for Result<T = any>
      return res.status(400).send(errors.array()); // array method is defined for Result<T = any>
    }

    const { email, password } = req.body;

    console.log("Creating a user...");

    res.send({});
  }
);

export { router as signupRouter };
