import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent } from "@betickets/common";

import { natsClient } from "../../../nats-client";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  const listener = new OrderCancelledListener(natsClient.client);

  const orderId = mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "whatever",
  });
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, ticket, orderId, listener };
};

it("updates the ticket, publishes an event, and acks the message", async () => {
  const { msg, data, ticket, orderId, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(natsClient.client.publish).toHaveBeenCalled();
  expect(msg.ack).toHaveBeenCalled();
});
