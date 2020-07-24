import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import Router from "next/router";

import useRequest from "../../hooks/useRequest";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push("/orders"),
  });

  useEffect(() => {
    setTimeLeft(Math.round((new Date(order.expiresAt) - new Date()) / 1000)); // when the page loads for the first time, the setInterval calls the setTimeLeft 1 second in the future so we have to call it one time manually.

    const intervalRef = setInterval(() => {
      setTimeLeft(Math.round((new Date(order.expiresAt) - new Date()) / 1000));
    }, 1000);

    return () => {
      // when this page is destructed (navigate away from this component or the component is re-rendered), clean the interval (otherwise it runs forever).
      clearInterval(intervalRef);
    };
  }, [order]); // setup the interval only one time when the page renders (the order is just to get rid of warning)

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_hxygSQAzxhsFcZFdvlq49Vqs008LjYr6x7"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data: order } = await client.get(`/api/orders/${orderId}`);

  return { order };
};

export default OrderShow;
