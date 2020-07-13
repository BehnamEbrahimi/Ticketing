import { Message } from "node-nats-streaming";
import { Listener } from "./listener";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated; // readonly makes sure that a given property does not get changed. If we omits it, TS will complain because we shouldn't change the type of subject from Subjects.TicketCreated.
  queueGroupName = "orders-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event data!", data);

    msg.ack();
  }
}
