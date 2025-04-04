import { useState, useEffect } from "react";
import "./index.css"; 

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

function ShoppingCart() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  useEffect(() => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    
    setCart((prevCart) => {
      if (subtotal >= THRESHOLD && !prevCart.some((item) => item.id === FREE_GIFT.id)) {
        return [...prevCart, { ...FREE_GIFT, quantity: 1 }];
      } else if (subtotal < THRESHOLD) {
        return prevCart.filter((item) => item.id !== FREE_GIFT.id);
      }
      return prevCart;
    });
  }, [cart]);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const progress = (subtotal / THRESHOLD) * 100;

  return (
    <div className="shopping-cart-container">
      <h1>Shopping Cart</h1>
      <div className="products">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="product-card">
            <p>{product.name}</p>
            <p>₹{product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <h2>Cart Summary</h2>
      <div className="cart-summary">
        <p>Subtotal: ₹{subtotal}</p>
        {subtotal < THRESHOLD && (
          <p>Add ₹{THRESHOLD - subtotal} more to get a free gift!</p>
        )}
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <h2>Cart Items</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="cart-item">
            <p>
              {item.name} - ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
            </p>
            {item.id !== FREE_GIFT.id && (
              <>
                <button className="remove-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button className="free-gift" onClick={() => updateQuantity(item.id, 1)}>+</button>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </>
            )}
            {item.id === FREE_GIFT.id && <span className="free-gift">FREE GIFT</span>}
          </div>
        ))
      )}
    </div>
  );
}

export default ShoppingCart;
