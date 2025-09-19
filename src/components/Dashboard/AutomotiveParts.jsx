// src/components/Dashboard/AutomotiveParts.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Home,
  Star,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import placeholder from "../../assets/placeholder.png";
import logoplaceholder from "../../assets/logoplaceholder.png";
import iconplaceholder from "../../assets/iconplaceholder.png";

const AutomotiveParts = () => {
  const { fleetName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const bookingId = location.state?.booking_id || fleetName;

  // Initialize cartItems based on bookingId
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem(`cartItems_${bookingId}`);
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantities, setQuantities] = useState({});

  const products = [
    {
      id: 123456,
      name: "RIDEX BRAKE disc, Rear Axle 300x20mm, 5/5 x 120, Vented, Cast Iron",
      price: 40000,
      rating: 3,
      image: placeholder,
      details: {
        fittingPosition: "Rear Axle",
        diameter: "300",
        brakeDiscType: "Vented",
        material: "Cast Iron",
        surface: "Uncoated",
        height: "76",
        brakeDiscThickness: "20",
      },
    },
    {
      id: 123457,
      name: "RIDEX BRAKE disc, Rear Axle 300x20mm, 5/5 x 120, Vented, Cast Iron",
      price: 40000,
      rating: 4,
      image: placeholder,
    },
    {
      id: 123458,
      name: "RIDEX BRAKE disc, Rear Axle 300x20mm, 5/5 x 120, Vented, Cast Iron",
      price: 40000,
      rating: 4.2,
      image: placeholder,
    },
    {
      id: 123459,
      name: "RIDEX BRAKE disc, Rear Axle 300x20mm, 5/5 x 120, Vented, Cast Iron",
      price: 40000,
      rating: 4.5,
      image: placeholder,
    },
  ];

  // Save cartItems to localStorage with bookingId-specific key
  useEffect(() => {
    localStorage.setItem(`cartItems_${bookingId}`, JSON.stringify(cartItems));
  }, [cartItems, bookingId]);

  // Clear cart for new booking if no saved cart exists
  useEffect(() => {
    const savedCart = localStorage.getItem(`cartItems_${bookingId}`);
    if (!savedCart) {
      setCartItems([]);
      setQuantities({});
    }
  }, [bookingId]);

  const addToCart = useCallback(
    (product) => {
      const quantity = quantities[product.id] || 1;
      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.id === product.id);
        let updatedItems;
        if (existingItem) {
          updatedItems = prev.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  totalPrice: item.price * (item.quantity + quantity),
                }
              : item
          );
        } else {
          const newItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
            totalPrice: product.price * quantity,
          };
          updatedItems = [...prev, newItem];
        }
        toast.success(`${product.name} (Qty: ${quantity}) added to cart!`, {
          position: "top-right",
          autoClose: 2000,
          toastId: `add-to-cart-${product.id}`,
        });
        return updatedItems;
      });
    },
    [quantities]
  );

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    toast.info("Item removed from cart", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(`cartItems_${bookingId}`);
    toast.info("Cart cleared", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta),
              totalPrice: item.price * Math.max(1, item.quantity + delta),
            }
          : item
      )
    );
  };

  const updateProductQuantity = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const handleViewCart = () => {
    navigate(`/dashboard/quote/${encodeURIComponent(fleetName)}`, {
      state: { ...location.state, selectedParts: cartItems },
    });
    setIsCartOpen(false);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white relative">
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsCartOpen(false)}
        />
      )}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600">
              Dashboard / Quote / {fleetName} / Automotive Parts
            </span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
              aria-label="Toggle cart"
              aria-expanded={isCartOpen}
            >
              <ShoppingCart className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed top-[72px] right-0 bg-white border-l border-gray-200 z-40 transition-transform duration-300 ease-in-out max-w-xs w-full ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ height: "calc(100vh - 72px)" }}
        role="dialog"
        aria-labelledby="cart-title"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 id="cart-title" className="text-lg font-semibold">
              Shopping Cart ({totalItems})
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4 mb-6 flex-1 overflow-y-auto custom-scrollbar">
            {cartItems.length === 0 ? (
              <div className="text-center text-gray-500">
                Your cart is empty
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      {item.name}
                    </h4>
                    <div className="text-sm font-medium text-gray-900">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 bg-[#E5E5E5B2] hover:bg-gray-100 rounded"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 bg-[#E5E5E5B2] hover:bg-gray-100 rounded"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Sub-Total:</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleViewCart}
              className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg"
            >
              VIEW CART
            </button>
            <button
              onClick={clearCart}
              className="w-full border border-red-300 hover:border-red-400 text-red-700 font-medium py-3 px-4 rounded-lg"
            >
              CLEAR CART
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg border border-gray-200 p-4 relative"
            >
              <img
                src={logoplaceholder}
                alt="product-logo"
                className="w-20 mb-2"
              />
              <div className="text-sm font-semibold text-[#333333] mb-2">
                Article No: <span className="text-[#5A1E78]">{product.id}</span>
              </div>
              <h3 className="text-sm text-[#333333] font-medium mb-4 leading-relaxed">
                {product.name}
              </h3>
              <div className="relative mb-4">
                <img
                  src={product.image}
                  alt="Brake disc"
                  className="w-full h-32 object-contain"
                />
              </div>
              <div className="flex items-center gap-1 mb-3 justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-[#FA8232] text-[#FA8232]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    ({product.rating})
                  </span>
                </div>
                <img src={iconplaceholder} alt="icon" />
              </div>
              <div className="mb-4 flex w-full items-end flex-col">
                <div className="text-base text-[#333333] font-bold">
                  ₦{product.price.toLocaleString()}
                </div>
                <div className="text-sm text-[#333333]">(Price per item)</div>
                <div className="text-sm text-[#333333] mt-1">Incl. 20% VAT</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => updateProductQuantity(product.id, -1)}
                    className="p-2 bg-[#E5E5E5B2] cursor-pointer hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm p-1 border-[1px] px-3 border-[#3333334D]">
                    {quantities[product.id] || 1}
                  </span>
                  <button
                    onClick={() => updateProductQuantity(product.id, 1)}
                    className="p-2 bg-[#E5E5E5B2] cursor-pointer hover:bg-gray-100 rounded"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-[#F7CD3A] cursor-pointer hover:bg-yellow-500 p-2.5 rounded"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b46c1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #553c9a;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #6b46c1 #f1f1f1;
        }
      `}</style>
    </div>
  );
};

export default AutomotiveParts;
