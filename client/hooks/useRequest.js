import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (args = {}) => {
    // because some of the things that we want to send in the body might not be clear in the time of setting up useRequest hook. So some will be passed in the doRequest function.
    try {
      setErrors(null);
      const { data } = await axios[method](url, { ...body, ...args }); // Relative Url -> because ingress-nginx will route it to correct service.

      if (onSuccess) {
        return onSuccess(data);
      }

      return data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err.response.data.errors.map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
