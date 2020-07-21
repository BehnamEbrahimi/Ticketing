import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      getAuthCookie(id?: string): string[];
    }
  }
}

jest.mock("../nats-client"); // jest understands that we want to mock this file so jest redirects the import from this file.

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "whatever";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks(); // Because mocks do not get restarted and we don't want them to be polluted by the previous run.

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.getAuthCookie = (id?: string) => {
  // Build a JWT payload: {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object: {jwt: JWT}
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string that has the cookie with the encoded data
  return [`express:sess=${base64}`];
};
