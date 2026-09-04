"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

interface CheckoutClientProps {
  defaultAddress: string;
}

export default function CheckoutClient({ defaultAddress }: CheckoutClientProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  
  const [deliveryAddress, setDeliveryAddress] = useState(defaultAddress);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Sandbox Simulator Modal State
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxOrderData, setSandboxOrderData] = useState<{
    orderId: string;
    razorpayOrderId: string;
    amount: number;
  } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
        <div className="card-glass" style={{ maxWidth: "500px", margin: "0 auto", padding: "40px" }}>
          <ShoppingBag size={64} className="text-primary" style={{ margin: "0 auto 20px" }} />
          <h2 style={{ fontSize: "28px", fontFamily: "var(--font-outfit)", marginBottom: "12px" }}>
            Your Cart is Empty
          </h2>
          <p className="text-muted" style={{ marginBottom: "28px" }}>
            Add some delicious items from our catalog before checking out!
          </p>
          <button 
            onClick={() => router.push("/restaurants")}
            className="btn btn-primary"
            style={{ width: "100%" }}
          >
            Explore Restaurants
          </button>
        </div>
      </div>
    );
  }

  // Calculate prices
  const subtotal = cartTotal;
  const deliveryFee = 5.00;
  const taxes = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
  const grandTotal = Math.round((subtotal + deliveryFee + taxes) * 100) / 100;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
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

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryAddress.trim()) {
      setOrderError("Please enter a valid delivery address.");
      return;
    }

    setIsPlacingOrder(true);
    setOrderError(null);

    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          deliveryAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate checkout order.");
      }

      if (data.isMock) {
        // Trigger Sandbox Simulator Modal
        setSandboxOrderData({
          orderId: data.orderId,
          razorpayOrderId: data.razorpayOrderId,
          amount: data.amount,
        });
        setShowSandbox(true);
        setIsPlacingOrder(false);
      } else {
        // Run Real Razorpay checkout flow
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error("Failed to load Razorpay payment SDK. Please try again.");
        }

        const options = {
          key: data.keyId || "rzp_test_yourkeyhere",
          amount: Math.round(data.amount * 100),
          currency: data.currency || "INR",
          name: "CraveBite Premium Food",
          description: "Premium Food Delivery",
          order_id: data.razorpayOrderId,
          handler: async function (response: any) {
            try {
              setIsPlacingOrder(true);
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                clearCart();
                router.push("/dashboard/orders");
              } else {
                throw new Error(verifyData.error || "Payment verification failed.");
              }
            } catch (err: any) {
              setOrderError(err.message || "An error occurred during verification.");
            } finally {
              setIsPlacingOrder(false);
            }
          },
          prefill: {
            name: session?.user?.name || "",
            email: session?.user?.email || "",
          },
          theme: {
            color: "#ff6b00",
          },
          modal: {
            ondismiss: function () {
              setIsPlacingOrder(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err: any) {
      console.error(err);
      setOrderError(err.message || "Something went wrong. Please try again.");
      setIsPlacingOrder(false);
    }
  };

  const handleSimulateSuccess = async () => {
    if (!sandboxOrderData) return;
    setIsSimulating(true);

    try {
      const mockPaymentId = `pay_mock_${Math.random().toString(36).substr(2, 9)}`;
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpayOrderId: sandboxOrderData.razorpayOrderId,
          razorpayPaymentId: mockPaymentId,
          razorpaySignature: "mock_signature",
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setShowSandbox(false);
        clearCart();
        router.push("/dashboard/orders");
      } else {
        throw new Error(data.error || "Mock verification failed.");
      }
    } catch (err: any) {
      alert("Simulator Verification Error: " + err.message);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      {/* Page Title */}
      <div style={{ marginBottom: "36px" }}>
        <h1 style={{ fontSize: "36px", fontFamily: "var(--font-outfit)", marginBottom: "8px" }}>
          Secure Checkout
        </h1>
        <p className="text-muted">
          Review your items, enter delivery location, and complete payment.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "32px",
      }} className="grid-responsive grid-3">
        {/* Left column: Address & Payment action */}
        <div style={{ gridColumn: "span 2" }}>
          <div className="card-glass" style={{ padding: "32px", marginBottom: "24px" }}>
            <h2 style={{ 
              fontSize: "20px", 
              fontFamily: "var(--font-outfit)", 
              marginBottom: "24px", 
              display: "flex", 
              alignItems: "center", 
              gap: "8px" 
            }}>
              <MapPin className="text-primary" size={20} />
              <span>Delivery Address</span>
            </h2>

            <form onSubmit={handlePlaceOrder}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, fontSize: "14px" }}>
                  Full Delivery Address
                </label>
                <textarea
                  className="input-premium"
                  rows={4}
                  placeholder="Street name, Building name, Flat number, Zip code, Landmark..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  style={{ resize: "vertical", fontFamily: "inherit" }}
                  required
                />
              </div>

              {orderError && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 16px",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  borderRadius: "8px",
                  color: "#ef4444",
                  fontSize: "14px",
                  marginBottom: "20px"
                }}>
                  <XCircle size={18} />
                  <span>{orderError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isPlacingOrder}
                className="btn btn-primary"
                style={{ width: "100%", padding: "16px", fontSize: "16px" }}
              >
                {isPlacingOrder ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    <span>Place Order & Pay (${grandTotal.toFixed(2)})</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px",
            borderRadius: "var(--border-radius-sm)",
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid var(--card-border)",
            fontSize: "13px"
          }} className="text-muted">
            <ShieldCheck size={20} className="text-secondary" style={{ flexShrink: 0 }} />
            <span>
              Your transaction is secured using end-to-end 256-bit encryption. CraveBite uses a Sandbox Simulator falling back to Razorpay payments processing gateway.
            </span>
          </div>
        </div>

        {/* Right column: Cart summary */}
        <div>
          <div className="card-glass" style={{ padding: "32px", position: "sticky", top: "100px" }}>
            <h2 style={{ 
              fontSize: "20px", 
              fontFamily: "var(--font-outfit)", 
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <ShoppingBag className="text-primary" size={20} />
              <span>Cart Summary</span>
            </h2>

            {/* List items */}
            <div style={{ 
              maxHeight: "300px", 
              overflowY: "auto", 
              marginBottom: "24px",
              paddingRight: "8px"
            }}>
              {cartItems.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    paddingBottom: "16px",
                    marginBottom: "16px",
                    borderBottom: "1px solid var(--card-border)"
                  }}
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, margin: 0, color: "var(--foreground)" }}>
                      {item.name}
                    </h4>
                    <p style={{ fontSize: "12px", margin: "4px 0 0 0" }} className="text-muted">
                      Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span className="text-muted">Subtotal</span>
                <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span className="text-muted">Delivery Fee</span>
                <span style={{ fontWeight: 600 }}>${deliveryFee.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span className="text-muted">GST / Taxes (18%)</span>
                <span style={{ fontWeight: 600 }}>${taxes.toFixed(2)}</span>
              </div>
              
              <div style={{ 
                borderTop: "2px dashed var(--card-border)", 
                paddingTop: "16px",
                marginTop: "4px",
                display: "flex", 
                justifyContent: "space-between", 
                fontSize: "18px",
                fontWeight: 800,
                color: "var(--foreground)"
              }}>
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sandbox Simulator checkout overlay modal */}
      {showSandbox && sandboxOrderData && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10, 8, 6, 0.8)",
          backdropFilter: "blur(12px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div 
            className="card-glass"
            style={{
              maxWidth: "500px",
              width: "100%",
              padding: "40px",
              borderRadius: "24px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              textAlign: "center",
              background: "rgba(25, 22, 19, 0.9)"
            }}
          >
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(255, 107, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px auto"
            }}>
              <Sparkles className="text-primary animate-pulse" size={32} />
            </div>

            <h2 style={{ 
              fontSize: "24px", 
              fontFamily: "var(--font-outfit)", 
              marginBottom: "8px",
              color: "var(--foreground)"
            }}>
              Razorpay Sandbox Simulator
            </h2>
            <p className="text-muted" style={{ fontSize: "14px", marginBottom: "28px" }}>
              Development environment bypass gateway simulator. Click Simulate Success to complete payment.
            </p>

            <div style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--card-border)",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "left",
              marginBottom: "32px",
              fontSize: "14px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span className="text-muted">Order ID:</span>
                <code style={{ color: "var(--secondary)", fontWeight: 600 }}>{sandboxOrderData.orderId}</code>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span className="text-muted">Gateway Order Ref:</span>
                <code style={{ color: "var(--muted)" }}>{sandboxOrderData.razorpayOrderId}</code>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--card-border)", paddingTop: "12px" }}>
                <span className="text-muted" style={{ fontWeight: 600 }}>Total Price:</span>
                <span style={{ fontWeight: 800, color: "var(--foreground)", fontSize: "16px" }}>
                  ${sandboxOrderData.amount.toFixed(2)}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                onClick={handleSimulateSuccess}
                disabled={isSimulating}
                className="btn btn-secondary"
                style={{ width: "100%", padding: "14px", fontSize: "14px" }}
              >
                {isSimulating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Verifying simulation signature...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    <span>Simulate Success</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setShowSandbox(false);
                  setIsPlacingOrder(false);
                }}
                disabled={isSimulating}
                className="btn"
                style={{ 
                  width: "100%", 
                  padding: "14px", 
                  background: "transparent", 
                  border: "1px solid var(--card-border)",
                  color: "var(--foreground)",
                  fontSize: "14px"
                }}
              >
                Cancel Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
