import React, { useState, useEffect, useCallback } from "react";
import {
  Home,
  Star,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  ImageOff,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import logoplaceholder from "../../assets/logoplaceholder.png";
import iconplaceholder from "../../assets/iconplaceholder.png";

const AutomotiveParts = () => {
  const { fleetName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const bookingId = location.state?.booking_id || fleetName;
  const { brand_id, model_id, _sub_model_id, partNumber } =
    location.state || {};

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem(`cartItems_${bookingId}`);
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(partNumber || "");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    prev_page_url: null,
    next_page_url: null,
    last_page: 1,
  });
  const [modelNotFound, setModelNotFound] = useState(false);
  const [imageErrors, setImageErrors] = useState({}); // Track failed images

  // Format article number with line breaks at hyphens
  const formatArticleNumber = (id) => id.split("-").join("<br />");

  // Determine if search is a part number
  const isPartNumberSearch = (term) => {
    return term && /^[A-Za-z0-9-]+$/.test(term);
  };

  // Fetch parts from search-filter API
  useEffect(() => {
    const fetchParts = async () => {
      setLoading(true);
      try {
        const searchValue = searchTerm || partNumber || "";
        const isPartNumber = isPartNumberSearch(searchValue);
        const payload = {
          search: searchValue,
          ...(isPartNumber
            ? { brand_id: brand_id || "", model_id: model_id || "" }
            : {
                category_id: "4",
                sub_category_id: "14",
                maker_id: "3",
                brand_id: brand_id || "",
                model_id: model_id || "",
              }),
        };
        const response = await axios.post(
          "https://stockmgt.gapaautoparts.com/api/search-filter",
          payload
        );
        const { results, modelNotFound } = response.data;
        console.log("API Response:", response.data); // Debug log
        const parts =
          results.data && Array.isArray(results.data)
            ? results.data.map((item) => ({
                id: item.id,
                name: item.name,
                price: parseInt(item.price) || 0,
                image: `https://stockmgt.gapaautoparts.com/uploads/products/${encodeURIComponent(
                  item.img_url
                )}`,
                rating: 4,
                details: {
                  description: item.description || "",
                  weight_in_kg: item.weight_in_kg || "",
                  EAN: item.EAN || "",
                  compatibility: item.compatibility || "",
                },
              }))
            : [];
        setProducts(parts);
        setPagination({
          prev_page_url: results.prev_page_url || null,
          next_page_url: results.next_page_url || null,
          last_page: results.last_page || 1,
        });
        setModelNotFound(
          modelNotFound && (!results.data || results.data.length === 0)
        );
        console.log(
          "modelNotFound set to:",
          modelNotFound && (!results.data || results.data.length === 0)
        );
      } catch (err) {
        console.error("Error fetching parts:", err.message);
        toast.error("Failed to fetch parts. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
        setProducts([]);
        setModelNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchParts();
  }, [
    searchTerm,
    brand_id,
    model_id,
    partNumber,
    currentPage,
    fleetName,
    navigate,
  ]);

  // Handle pagination
  const handlePageChange = async (url) => {
    if (!url) return;
    setLoading(true);
    try {
      const response = await axios.get(url);
      const { results } = response.data;
      console.log("Pagination Response:", response.data);
      const parts =
        results.data && Array.isArray(results.data)
          ? results.data.map((item) => ({
              id: item.id,
              name: item.name,
              price: parseInt(item.price) || 0,
              image: `https://stockmgt.gapaautoparts.com/uploads/products/${encodeURIComponent(
                item.img_url
              )}`,
              rating: 4,
              details: {
                description: item.description || "",
                weight_in_kg: item.weight_in_kg || "",
                EAN: item.EAN || "",
                compatibility: item.compatibility || "",
              },
            }))
          : [];
      setProducts(parts);
      setPagination({
        prev_page_url: results.prev_page_url || null,
        next_page_url: results.next_page_url || null,
        last_page: results.last_page || 1,
      });
      setCurrentPage(results.current_page || 1);
      setModelNotFound(!results.data || results.data.length === 0);
    } catch (err) {
      console.error("Error fetching page:", err.message);
      toast.error("Failed to load page. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Save cartItems to localStorage
  useEffect(() => {
    localStorage.setItem(`cartItems_${bookingId}`, JSON.stringify(cartItems));
  }, [cartItems, bookingId]);

  // Clear cart for new booking
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

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchTerm(e.target.elements.search.value);
  };

  const handleImageError = (e, productId) => {
    console.warn(
      `Image failed to load: ${e.target.src} (img_url: ${e.target.src
        .split("/")
        .pop()})`
    );
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
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
                  {imageErrors[item.id] ? (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <ImageOff className="w-6 h-6 text-gray-400" />
                    </div>
                  ) : (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => handleImageError(e, item.id)}
                    />
                  )}
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
        <div className="mb-6 max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="search"
                defaultValue={searchTerm}
                placeholder="Search parts (e.g., oil, SKBP-0011422)"
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              className="bg-[#4B3193] hover:bg-[#3A256F] text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Loading parts...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-600 p-4 bg-gray-100 rounded-lg max-w-3xl mx-auto">
            <p className="text-lg font-medium mb-2">
              {modelNotFound
                ? "Result not found for the selected model."
                : "No parts found for your search."}
            </p>
            {modelNotFound && (
              <button
                onClick={() =>
                  navigate(
                    `/dashboard/quote/${encodeURIComponent(
                      fleetName
                    )}/add-fleet`,
                    { state: location.state }
                  )
                }
                className="text-blue-500 underline hover:text-blue-700 font-medium"
              >
                Back to Add Fleet
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 relative group"
                >
                  {imageErrors[`logo_${product.id}`] ? (
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center mb-2">
                      <ImageOff className="w-8 h-8 text-gray-400" />
                    </div>
                  ) : (
                    <img
                      src={logoplaceholder}
                      alt="product-logo"
                      className="w-20 h-20 object-contain mb-2"
                      onError={(e) => handleImageError(e, `logo_${product.id}`)}
                    />
                  )}
                  <div className="text-sm font-semibold text-[#333333] mb-2 max-w-full overflow-wrap-break-word">
                    Article No:{" "}
                    <span
                      className="text-[#5A1E78]"
                      dangerouslySetInnerHTML={{
                        __html: formatArticleNumber(product.id),
                      }}
                    />
                  </div>
                  <h3 className="text-sm text-[#333333] font-medium mb-4 leading-relaxed">
                    {product.name}
                  </h3>
                  <div className="relative mb-4">
                    {imageErrors[product.id] ? (
                      <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                        <ImageOff className="w-8 h-8 text-gray-400" />
                      </div>
                    ) : (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-contain"
                        onError={(e) => handleImageError(e, product.id)}
                      />
                    )}
                    {product.details.compatibility && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white text-xs p-2 rounded overflow-auto pointer-events-none">
                        {product.details.compatibility}
                      </div>
                    )}
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
                    {imageErrors[`icon_${product.id}`] ? (
                      <div className="w-4 h-4 bg-gray-200 rounded flex items-center justify-center">
                        <ImageOff className="w-3 h-3 text-gray-400" />
                      </div>
                    ) : (
                      <img
                        src={iconplaceholder}
                        alt="icon"
                        className="w-4 h-4"
                        onError={(e) =>
                          handleImageError(e, `icon_${product.id}`)
                        }
                      />
                    )}
                  </div>
                  <div className="mb-4 flex w-full items-end flex-col">
                    <div className="text-base text-[#333333] font-bold">
                      ₦{product.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-[#333333]">
                      (Price per item)
                    </div>
                    <div className="text-sm text-[#333333] mt-1">
                      Incl. 20% VAT
                    </div>
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
            <div className="flex justify-between mt-6 max-w-3xl mx-auto">
              <button
                onClick={() => handlePageChange(pagination.prev_page_url)}
                disabled={!pagination.prev_page_url || loading}
                className={`px-4 py-2 rounded-lg ${
                  pagination.prev_page_url
                    ? "bg-[#4B3193] hover:bg-[#3A256F] text-white"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.next_page_url)}
                disabled={!pagination.next_page_url || loading}
                className={`px-4 py-2 rounded-lg ${
                  pagination.next_page_url
                    ? "bg-[#4B3193] hover:bg-[#3A256F] text-white"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
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
        .overflow-wrap-break-word {
          overflow-wrap: break-word;
          max-width: 100%;
        }
      `}</style>
    </div>
  );
};

export default AutomotiveParts;
