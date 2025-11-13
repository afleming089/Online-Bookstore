import React, { use, useEffect, useState } from "react";
import "./Cart.css";

import { GUIShoppingCartObserver } from "./account/cart/GUIShoppingCartObserver.js";
import { BackendShoppingCartObserver } from "./account/cart/BackendShoppingCartObserver.js";
import { ShoppingCart } from "./account/cart/ShoppingCart.js";
import { media } from "./MediaSort/media.js";

interface CartProps {
  media: media;
  user : any;
}

function Cart(props: CartProps) {
  const [shoppingCart] = useState(new ShoppingCart());
  const [GUIObserver] = useState(new GUIShoppingCartObserver());
  const [backendObserver] = useState(new BackendShoppingCartObserver());

  const [cartItems, setCartItems] = useState(GUIObserver.display());

  let mediaType: media;
  if(props.media && props.user)
    mediaType = new media(
      props.media.id,
      props.media.title,
      props.media.description,
      props.media.author,
      props.media.price,
      props.media.isbn,
      1,
      Number(props.user.userId)
    );

  useEffect(() => {
      // updates display in cart when media is added
      shoppingCart.addObserver(GUIObserver);
      // updates backend cart when media is added
      shoppingCart.addObserver(backendObserver);

      if(mediaType)
      shoppingCart.addMedia(mediaType);

      fetch(`http://localhost:8081/auth/cart`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return response.json()
      })
      .then(cartItems => {
        console.log('User cart items:', cartItems);
        shoppingCart.setMediaHashMap(cartItems);
        setCartItems(cartItems);
      })
      .catch(error => {
        console.error('Error fetching cart:', error);
      });

      setCartItems(GUIObserver.display());
  }, []);

  const updateQuantity = (id: number, amount: number) => {
    shoppingCart.updateMediaQuantity(id, amount);

    setCartItems(GUIObserver.display());
  };

  const removeItem = (id: number) => {
    shoppingCart.removeMedia(id);
    backendObserver.remove(id);

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
