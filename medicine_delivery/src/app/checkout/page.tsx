"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CreditCard, Trash2, ShoppingBag, MapPin, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cartItems, removeFromCart, updateQuantity, cartCount, cartTotal, clearCart } = useCart();

  // Delivery address form state
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [city, setCity] = useState("");
  
  // Checkout states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sandbox simulator states
  const [showSimulator, setShowSimulator] = useState(false);
  const [mockOrderData, setMockOrderData] = useState<{
    orderId: string;
    razorpayOrderId: string;
    amount: number;
  } | null>(null);

  // Sync address fields when session loads
  useEffect(() => {
    if (session?.user) {
      setDeliveryAddress(session.user.address || "");
      setCity(session.user.city || "");
    }
  }, [session]);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!deliveryAddress.trim() || !city.trim()) {
      setError("Please fill in your complete delivery address.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((item) => ({ id: item.id, quantity: item.quantity })),
          deliveryAddress: `${deliveryAddress}, ${city}`,
        }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        setError(orderData.message || "Failed to initiate transaction.");
        setIsLoading(false);
        return;
      }

      if (orderData.isMock) {
        // Show sandbox modal
        setMockOrderData({
          orderId: orderData.orderId,
          razorpayOrderId: orderData.razorpayOrderId,
          amount: orderData.amount,
        });
        setShowSimulator(true);
        setIsLoading(false);
      } else {
        // Process real Razorpay transaction
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          setError("Failed to load Razorpay SDK. Check your internet connection.");
          setIsLoading(false);
          return;
        }

        const options = {
          key: orderData.keyId,
          amount: Math.round(orderData.amount * 100),
          currency: "USD",
          name: "MediQuick Pharmacy",
          description: "Online Medicine Checkout",
          order_id: orderData.razorpayOrderId,
          handler: async function (response: any) {
            try {
              setIsLoading(true);
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpayOrderId: orderData.razorpayOrderId,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                clearCart();
                router.push("/dashboard/orders");
                router.refresh();
              } else {
                setError(verifyData.message || "Signature verification failed.");
              }
            } catch (err) {
              setError("Payment verification request failed.");
            } finally {
              setIsLoading(false);
            }
          },
          prefill: {
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            contact: session?.user?.phone || "",
          },
          theme: {
            color: "#0ea5e9",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setError(response.error.description || "Payment failed.");
        });
        rzp.open();
        setIsLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred during checkout.");
      setIsLoading(false);
    }
  };

  const handleSimulateSuccess = async () => {
    if (!mockOrderData) return;
    setIsLoading(true);
    setShowSimulator(false);

    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpayOrderId: mockOrderData.razorpayOrderId,
          razorpayPaymentId: `pay_mock_${Math.random().toString(36).substring(2, 10)}`,
          razorpaySignature: "mock_signature",
        }),
      });

      const verifyData = await res.json();
      if (res.ok && verifyData.success) {
        clearCart();
        router.push("/dashboard/orders");
        router.refresh();
      } else {
        setError(verifyData.message || "Simulated payment verification failed.");
      }
    } catch (err) {
      setError("Failed to simulate verify response.");
    } finally {
      setIsLoading(false);
    }
  };

  const hasRxItem = cartItems.some((item) => item.rxRequired);

  return (
    <>
      <Navbar />
      <main style={{ flexGrow: 1, padding: "3rem 0" }}>
        <div className="container">
          <h1
            className="title-lg"
            style={{
              marginBottom: "2rem",
              background: "linear-gradient(135deg, #ffffff 60%, var(--color-primary) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Secured Checkout
          </h1>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: "2rem" }}>
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          {cartItems.length === 0 ? (
            <div
              className="card-glass"
              style={{ textAlign: "center", padding: "5rem 2rem", display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              <ShoppingBag size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
              <h2 className="title-sm" style={{ color: "white", marginBottom: "0.5rem" }}>
                Your Cart is Empty
              </h2>
              <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
                Add items from the store before checking out.
              </p>
              <button className="btn btn-primary" onClick={() => router.push("/shop")}>
                Browse Medicines
              </button>
            </div>
          ) : (
            <div className="checkout-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "2rem" }}>
              {/* Left Column: Form & Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {/* 1. Address Form */}
                <div className="card-glass">
                  <h3 className="title-sm" style={{ color: "white", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                    <MapPin size={20} style={{ color: "var(--color-primary)" }} />
                    Delivery Information
                  </h3>
                  <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div className="input-group">
                      <label className="input-label" htmlFor="deliveryAddress">
                        Delivery Address
                      </label>
                      <input
                        id="deliveryAddress"
                        type="text"
                        placeholder="Apartment, building, street address"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="input-field"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label" htmlFor="city">
                        City
                      </label>
                      <input
                        id="city"
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="input-field"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </form>
                </div>

                {/* 2. Rx Warn Box */}
                {hasRxItem && (
                  <div className="alert alert-warning">
                    <AlertTriangle size={24} style={{ flexShrink: 0 }} />
                    <div>
                      <strong style={{ display: "block", marginBottom: "0.25rem" }}>Rx Prescription Required</strong>
                      <span style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>
                        One or more items in your cart require prescription verification. If you have not uploaded a doctor prescription yet, please upload it in the dashboard. Dispatch is held until a pharmacist reviews it.
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. Items list */}
                <div className="card-glass" style={{ padding: "1.5rem" }}>
                  <h3 className="title-sm" style={{ color: "white", marginBottom: "1.5rem" }}>
                    Cart Items ({cartCount})
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingBottom: "1rem",
                          borderBottom: "1px solid var(--border-color)",
                          gap: "1rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexGrow: 1, minWidth: 0 }}>
                          <div
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "6px",
                              overflow: "hidden",
                              background: "var(--bg-tertiary)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.5rem",
                              flexShrink: 0,
                            }}
                          >
                            {item.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              "💊"
                            )}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <h4
                              style={{
                                color: "white",
                                fontSize: "0.95rem",
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.name}
                            </h4>
                            {item.rxRequired && (
                              <span className="badge badge-warning" style={{ fontSize: "0.6rem", padding: "0.1rem 0.4rem" }}>
                                Rx Required
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity and Price */}
                        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-color)", borderRadius: "6px" }}>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              style={{ width: "24px", height: "24px", background: "transparent", border: "none", color: "white", cursor: "pointer" }}
                            >
                              -
                            </button>
                            <span style={{ fontSize: "0.85rem", width: "24px", textAlign: "center", fontWeight: "bold" }}>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              style={{ width: "24px", height: "24px", background: "transparent", border: "none", color: "white", cursor: "pointer" }}
                            >
                              +
                            </button>
                          </div>
                          <span style={{ color: "white", fontWeight: 600, minWidth: "60px", textAlign: "right" }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            style={{ background: "transparent", border: "none", color: "var(--color-danger)", cursor: "pointer" }}
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Totals Summary */}
              <div style={{ height: "fit-content", position: "sticky", top: "90px" }}>
                <div className="card-glass">
                  <h3 className="title-sm" style={{ color: "white", marginBottom: "1.5rem" }}>Order Summary</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.95rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Subtotal ({cartCount} items)</span>
                      <span style={{ color: "white" }}>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Shipping Delivery</span>
                      <span style={{ color: "var(--color-accent)" }}>{cartTotal >= 50 ? "FREE" : "$5.00"}</span>
                    </div>
                    <hr style={{ border: 0, borderTop: "1px solid var(--border-color)" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.15rem", fontWeight: 700 }}>
                      <span style={{ color: "white" }}>Total Order</span>
                      <span style={{ color: "var(--color-primary)" }}>
                        ${(cartTotal + (cartTotal >= 50 ? 0 : 5)).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="btn btn-primary"
                      style={{ width: "100%", height: "48px", marginTop: "1.5rem" }}
                      disabled={isLoading}
                    >
                      <CreditCard size={18} />
                      {isLoading ? "Processing..." : "Pay Now"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* 4. Glassmorphism Sandbox Simulator checkout overlay modal */}
      {showSimulator && mockOrderData && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(3, 7, 13, 0.8)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="card-glass animate-pulse-glow"
            style={{
              width: "90%",
              maxWidth: "480px",
              padding: "2.5rem",
              border: "1px solid var(--color-primary)",
              boxShadow: "0 0 30px rgba(14, 165, 233, 0.25)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                background: "rgba(14, 165, 233, 0.15)",
                color: "var(--color-primary)",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem auto",
              }}
            >
              <CreditCard size={32} />
            </div>

            <h3 className="title-sm" style={{ color: "white", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              Razorpay Sandbox Simulator
            </h3>
            <p className="text-muted" style={{ fontSize: "0.9rem", marginBottom: "2rem" }}>
              Development environment gateway simulator. Real Razorpay keys are not provided.
            </p>

            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "1rem",
                textAlign: "left",
                marginBottom: "2rem",
                fontSize: "0.9rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span>Simulator Order ID:</span>
                <code style={{ color: "var(--color-primary)" }}>{mockOrderData.razorpayOrderId}</code>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Total Amount Due:</span>
                <span style={{ color: "white", fontWeight: "bold" }}>
                  ${(mockOrderData.amount + (mockOrderData.amount >= 50 ? 0 : 5)).toFixed(2)}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button
                onClick={handleSimulateSuccess}
                className="btn btn-primary"
                style={{ width: "100%", height: "46px" }}
                disabled={isLoading}
              >
                Simulate Successful Payment
              </button>
              <button
                onClick={() => {
                  setShowSimulator(false);
                  setError("Simulated payment cancelled by user.");
                }}
                className="btn btn-secondary"
                style={{ width: "100%", height: "46px" }}
                disabled={isLoading}
              >
                Cancel Simulation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout layout responsive styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </>
  );
}
