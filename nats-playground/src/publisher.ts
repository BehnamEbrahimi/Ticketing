import nats from "node-nats-streaming";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  // stan is nats client backward
  // the first argument is the cid that we specified in creating nats server instance inside deployment file
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const data = JSON.stringify({
    // data has to be plain string.
    id: "123",
    title: "concert",
    price: 20,
  });

  stan.publish("ticket:created", data, () => {
    // the first arg is the name of the channel. NATS SS will be created the channel if it is not in its list.
    // the third arg is optional callback.
    console.log("Event published");
  });
});
