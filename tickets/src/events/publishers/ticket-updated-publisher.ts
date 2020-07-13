import { Publisher, Subjects, TicketUpdatedEvent } from "@betickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
