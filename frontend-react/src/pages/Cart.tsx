import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Cart.css";
import { checkout } from "../api.js";
import { shoppingCart, GUIShoppingCartObserver } from "../account/cart/index.js";
import {
  CreditCardPayment,
  PayPalPayment,
  PaymentProcessor,
} from "../account/payment/strategyPattern.js";
import type { CartItem, CheckoutRequest, PaymentMethod } from "../types.js";

const CartPage = () => {
  const [items, setItems] = useState<CartItem[]>(shoppingCart.list());
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new GUIShoppingCartObserver(setItems);
    shoppingCart.addObserver(observer);
    setItems(shoppingCart.list());
    return () => {
      shoppingCart.removeObserver(observer);
    };
  }, []);

  const totalValue = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items],
  );
  const total = totalValue.toFixed(2);

  const updateQuantity = (bookId: number, delta: number) => {
    shoppingCart.adjustQuantity(bookId, delta);
  };

  const removeItem = (bookId: number) => {
    shoppingCart.remove(bookId);
  };

  const handleCheckout = async () => {
    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    if (paymentMethod === "credit" && cardNumber.trim().length < 4) {
      setError("Enter a valid credit card number.");
      return;
    }
    if (paymentMethod === "paypal" && !paypalEmail.trim()) {
      setError("Enter your PayPal email.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const payload: CheckoutRequest = {
      items: items.map((item) => ({
        bookId: item.bookId,
        quantity: item.quantity,
      })),
    };

    try {
      await checkout(payload);

      const strategy =
        paymentMethod === "credit"
          ? new CreditCardPayment(cardNumber)
          : new PayPalPayment(paypalEmail);
      const receipt = new PaymentProcessor(strategy).process(totalValue);

      shoppingCart.clear();
      navigate("/checkout/success", { state: { payment: receipt } });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 409) {
          const details = (err.response.data?.details ??
            err.response.data) as {
            bookId?: number;
            availableQuantity?: number;
          };
          if (
            typeof details.bookId === "number" &&
            typeof details.availableQuantity === "number"
          ) {
            shoppingCart.setQuantity(details.bookId, details.availableQuantity);
          }
          setError(
            "One of your books no longer has enough stock. We've adjusted your cart.",
          );
        } else if (err.response.status === 401 || err.response.status === 403) {
          setError("Please log in to complete checkout.");
        } else {
          setError("Checkout failed. Please try again.");
        }
      } else {
        setError("Checkout failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      {!items.length ? (
        <div className="cart-items empty-cart">Your cart is empty.</div>
      ) : (
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.bookId} className="cart-item">
              <div className="item-info">
                <h3>{item.title}</h3>
                <p>${item.price.toFixed(2)}</p>
                <p className="inventory-note">
                  {item.inventoryCount > 0
                    ? `In stock: ${item.inventoryCount}`
                    : "Out of stock"}
                </p>
              </div>
              <div className="item-controls">
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.bookId, -1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.bookId, 1)}
                  disabled={item.quantity >= item.inventoryCount}
                >
                  +
                </button>
                <button onClick={() => removeItem(item.bookId)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="cart-total">
        <h2>Total: ${total}</h2>
        <div className="payment-section">
          <h3>Payment Method</h3>
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="credit"
              checked={paymentMethod === "credit"}
              onChange={() => setPaymentMethod("credit")}
            />
            Credit Card
          </label>
          {paymentMethod === "credit" && (
            <input
              className="payment-input"
              type="text"
              placeholder="Card number"
              value={cardNumber}
              onChange={(event) => setCardNumber(event.target.value)}
            />
          )}
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={() => setPaymentMethod("paypal")}
            />
            PayPal
          </label>
          {paymentMethod === "paypal" && (
            <input
              className="payment-input"
              type="email"
              placeholder="PayPal email"
              value={paypalEmail}
              onChange={(event) => setPaypalEmail(event.target.value)}
            />
          )}
        </div>
        <button
          className="checkout-button"
          disabled={!items.length || isSubmitting}
          onClick={handleCheckout}
        >
          {isSubmitting ? "Processing..." : "Proceed to Checkout"}
        </button>
        {error && <p className="cart-error">{error}</p>}
      </div>
    </div>
  );
};

export default CartPage;
