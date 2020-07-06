import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set("trust proxy", true); // traffic is coming through ingress-nginx (a proxy).
app.use(express.json());
app.use(
  cookieSession({
    // this middleware creates a req.session object on the incoming req and any info stored on it will be automatically sent to the user browser and set as a cookie for the follow-up requests.
    signed: false, // so no encryption. JWT is already encrypted.
    secure: process.env.NODE_ENV !== "test", // Use cookie only if the connection is HTTPS in dev and prod.
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async () => {
  // all methods: GET, POST, ...
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
