import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@betickets/common";

import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket, throw error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Mark the ticket as being reserved by setting its orderId property (undefined means not reserved)
    ticket.set({ orderId: data.id });

    // Save the ticket
    await ticket.save(); // Because we have changed the ticket, the version will be increased so we have to emit another event to tell the other services about the update and therefore they update their version as well.

    await new TicketUpdatedPublisher(this.client).publish({
      // we need to pass the client, so we will pass the client of the listener to the publisher. (We could pass the client from nats-client module singleton but this is better.)
      // Note that this is a listener that publishes an event. So it is possible.
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    // ack the message
    msg.ack();
  }
}
