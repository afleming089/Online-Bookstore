import React, { useState } from 'react';
import './Cart.css';

function Cart() {
    const [cartItems, setCartItems] = useState([
        { id: 1, title: 'Book 1', price: 29.99, quantity: 1 },
        { id: 2, title: 'Book 2', price: 19.99, quantity: 2 },
    ]);

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    return (
        <div className="cart-container">
            <h1>Shopping Cart</h1>
            <div className="cart-items">
                {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="item-info">
                            <h3>{item.title}</h3>
                            <p>${item.price.toFixed(2)}</p>
                        </div>
                        <div className="item-controls">
                            <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                            <span>{item.quantity}</span>
                            <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
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