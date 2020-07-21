import { Subjects, Publisher, PaymentCreatedEvent } from "@betickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
