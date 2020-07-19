import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@betickets/common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
