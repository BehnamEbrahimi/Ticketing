import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  // stan is nats client backward
  // the first argument is the cid that we specified in creating nats server instance inside deployment file
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const ticketCreatedPublisher = new TicketCreatedPublisher(stan);
  try {
    await ticketCreatedPublisher.publish({
      id: "123",
      title: "concert",
      price: 20,
    });
  } catch (error) {
    console.log(error);
  }
});
