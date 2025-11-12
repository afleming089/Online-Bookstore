import React, { useEffect, useState } from "react";
import "./Cart.css";

import { GUIShoppingCartObserver } from "./account/cart/GUIShoppingCartObserver.js";
import { ShoppingCart } from "./account/cart/ShoppingCart.js";
import { media } from "./MediaSort/media.js";

interface CartProps {
  media: media;
}

// const mediaSample = new media(0, "sample books", "description", "author", 9.99, "1234567890", 1);

function Cart(props: CartProps) {
  const shoppingCart = new ShoppingCart();
  const GUIObserver = new GUIShoppingCartObserver();
  const backendObserver = new GUIShoppingCartObserver();

  const mediaType = new media(
    props.media.id,
    props.media.title,
    props.media.description,
    props.media.author,
    props.media.price,
    props.media.isbn,
    1
  );


  console.log(mediaType);
  
   // updates display in cart when media is added
  shoppingCart.addObserver(GUIObserver);
  // updates backend cart when media is added
  shoppingCart.addObserver(backendObserver);
  if(mediaType)
  shoppingCart.addMedia(mediaType);
  // updates observer states
  shoppingCart.notifyObservers();

  const [cartItems, setCartItems] = useState(GUIObserver.display());

  const updateQuantity = (id: number, amount: number) => {
    shoppingCart.updateMediaQuantity(id, amount);
    shoppingCart.notifyObservers();


    const item = GUIObserver.display()[id];
    if (item && item.quantity < 1) {
      shoppingCart.removeMedia(id);
    }

    setCartItems(GUIObserver.display());
  };

  const removeItem = (id: number) => {
    shoppingCart.removeMedia(id);
    shoppingCart.notifyObservers();

    setCartItems(GUIObserver.display());
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      <div className="cart-items">

        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-info">
              <h3>{item.title}</h3>
              <p>${item.price.toFixed(2)}</p>
            </div>
            <div className="item-controls">
              <button
                className="quantity-btn"
                onClick={() => updateQuantity(item.id, -1)}>
                −
              </button>
              <span>{item.quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => updateQuantity(item.id, +1)}>
                +
              </button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <h2>Total: ${calculateTotal()}</h2>
        <button className="checkout-button">Proceed to Checkout</button>
      </div>
    </div>
  );
}

export { Cart };
