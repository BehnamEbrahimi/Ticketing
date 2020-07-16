import { Subjects, Publisher, OrderCancelledEvent } from "@betickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
