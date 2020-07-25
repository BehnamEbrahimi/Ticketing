import axios from "axios";

export default ({ req }) => {
  // whenever getInitialProps called on the server, the first argument is an object which has the original request object.
  // we are interested in cookie header and also the host header which is ticketing.dev.
  if (typeof window === "undefined") {
    // We are on the server

    return axios.create({
      baseURL:
        "http://www.behnam-ticketing-app.xyz",
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseURL: "/",
    });
  }
};
