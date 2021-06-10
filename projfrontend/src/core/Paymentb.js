import React, { useState, useEffect } from "react";
import { loadCart, cartEmpty } from "./helper/cartHelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated } from "../auth/helper";
import { getmeToken, processPayment } from "./helper/paymentBHelper";
import { Link } from "react-router-dom";

import DropIn from "braintree-web-drop-in-react";

const Paymentb = ({ products, setReload = f => f, reload = undefined }) => {
  const [info, setinfo] = useState({
    loading: false,
    succes: false,
    clientToken: null,
    error: "",
    instance: {}
  });

  const { user, token } = isAuthenticated();

  const getToken = (userId, token) => {
    getmeToken(userId, token)
      .then(info => {
        // console.log("Information: ", info);
        if (info.error) {
          setinfo({ ...info, error: info.error });
        } else {
          const clientToken = info.clientToken;
          setinfo({ clientToken });
        }
      })
      .catch();
  };

  const showDropIn = () => {
    return (
      <div>
        {info.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={instance => (info.instance = instance)}
            />
            <button className="btn btn-success btn-block" onClick={onPurchase}>
              Buy
            </button>
          </div>
        ) : (
          <h3 className="text-white">Please Login! or add something to cart</h3>
        )}
      </div>
    );
  };

  useEffect(() => {
    getToken(user._id, token);
  }, [reload]);

  const onPurchase = () => {
    setinfo({ loading: true });
    let nonce;
    let getNonce = info.instance.requestPaymentMethod().then(data => {
      nonce = data.nonce;
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getAmount()
      };

      processPayment(user._id, token, paymentData)
        .then(response => {
          setinfo({ ...info, success: response.succes, loading: false });
          console.log("Payment Success");

          const orderData = {
            products: products,
            transaction_id: response.transaction.id,
            amount: response.transaction.amount
          };

          createOrder(user._id, token, orderData);

          cartEmpty(() => {
            console.log("Did we got the crash");
          });
          setReload(!reload);
        })
        .catch(error => {
          setinfo({ loading: false, success: false });
        });
    });
  };

  const getAmount = () => {
    let amount = 0;
    products.map((pro, index) => {
      amount += pro.price;
    });
    return amount;
  };
  return (
    <div>
      <h3>Your bill is $ {getAmount()}</h3>
      {showDropIn()}
    </div>
  );
};

export default Paymentb;
