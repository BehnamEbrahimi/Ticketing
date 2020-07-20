import {
  OrderCancelledEvent,
  Subjects,
  Listener,
  OrderStatus,
} from "@betickets/common";
import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findOne({
      // you can create a method like findByIdAndPreviousVersion in TicketUpdatedListener in orders service
      _id: data.id,
      version: data.version - 1, // here version is really doesn't matter because we don't update our orders but we include it anyway
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
