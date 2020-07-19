import Queue from "bull";

import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsClient } from "../nats-client";

interface Payload {
  // the structure of a job
  orderId: string;
}

// code to create the queue
const expirationQueue = new Queue<Payload>("order:expiration", {
  // the first arg is the queueName or channel that this job belongs to
  redis: {
    host: process.env.REDIS_HOST,
  },
});

// code to process the job when it is received from redis server to the expiration queue
expirationQueue.process(async (job) => {
  // this job is not just the job data but it is a wrapper that has that data too
  new ExpirationCompletePublisher(natsClient.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
