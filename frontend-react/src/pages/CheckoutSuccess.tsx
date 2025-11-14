import { Link, useLocation } from "react-router-dom";
import type { PaymentReceipt } from "../account/payment/strategyPattern.js";

type LocationState = {
  payment?: PaymentReceipt;
};

const CheckoutSuccess = () => {
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? undefined;
  const payment = state?.payment;

  return (
    <div className="checkout-success">
      <h1>Thank you!</h1>
      <p>Your order has been placed successfully.</p>
      {payment?.method === "paypal" && payment.email && (
        <p className="checkout-receipt">
          A PayPal receipt was sent to <strong>{payment.email}</strong>.
        </p>
      )}
      <Link to="/books">Back to books</Link>
    </div>
  );
};

export default CheckoutSuccess;
