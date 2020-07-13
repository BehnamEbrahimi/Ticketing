import { natsClient } from "./../../nats-client";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const res = await request(app).post("/api/tickets").send({});

  expect(res.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({});

  expect(res.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({ title: "", price: 1 })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({ price: 1 })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({ title: "a valid title", price: -1 })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({ title: "a valid title" })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = "a valid title";

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title,
      price: 1,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(1);
  expect(tickets[0].title).toEqual(title);
});

it("publishes an event", async () => {
  const title = "whatever";

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
