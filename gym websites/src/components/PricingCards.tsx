"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check, ShieldAlert, CreditCard } from "lucide-react";
import "./PricingCards.css";

interface Plan {
  id: string;
  name: string;
  slug: string;
  price: number;
  duration: number;
  tier: string;
  description: string;
  features: string; // JSON string list
  popular: boolean;
}

interface PricingCardsProps {
  plans: Plan[];
}

interface MockOrder {
  isMock: boolean;
  orderId: string;
  amount: number;
  planId: string;
  planName: string;
}

export default function PricingCards({ plans }: PricingCardsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [sandboxOrder, setSandboxOrder] = useState<MockOrder | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const handleSubscribe = async (plan: Plan) => {
    if (!session) {
      router.push(`/login?callbackUrl=/#pricing`);
      return;
    }

    setLoadingPlanId(plan.id);
    setPaymentError("");
    
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await res.json();

      if (orderData.isMock) {
        // Open Sandbox Simulator modal
        setSandboxOrder({
          isMock: true,
          orderId: orderData.orderId,
          amount: orderData.amount,
          planId: plan.id,
          planName: plan.name,
        });
      } else {
        // Native Razorpay checkout flow
        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "AB Fitness Gym",
          description: `Subscription: ${plan.name}`,
          order_id: orderData.orderId,
          handler: async function (response: any) {
            setLoadingPlanId(plan.id);
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            
            if (verifyRes.ok) {
              router.push("/dashboard/membership");
              router.refresh();
            } else {
              setPaymentError("Payment verification failed. Please contact support.");
            }
            setLoadingPlanId(null);
          },
          prefill: {
            name: session.user?.name || "",
            email: session.user?.email || "",
          },
          theme: {
            color: "#ff2a5f",
          },
        };

        // Load Razorpay SDK and trigger native overlay
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      }
    } catch (err: any) {
      setPaymentError("Unable to initiate transaction. Please try again.");
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handleSimulatePayment = async (success: boolean) => {
    if (!sandboxOrder) return;
    
    setPaymentProcessing(true);
    setPaymentError("");

    if (!success) {
      setPaymentProcessing(false);
      setSandboxOrder(null);
      return;
    }

    try {
      // Send mock verification parameters
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: sandboxOrder.orderId,
          razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 9)}`,
          razorpay_signature: "mock_signature",
        }),
      });

      const verifyData = await verifyRes.json();

      if (verifyRes.ok) {
        setSandboxOrder(null);
        router.push("/dashboard/membership");
        router.refresh();
      } else {
        setPaymentError(verifyData.message || "Simulated payment verification failed.");
      }
    } catch (err) {
      setPaymentError("Network error during simulated verification.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <section className="pricing-section section-padding" id="pricing">
      <div className="container">
        <div className="pricing-header">
          <span className="pricing-subtitle">Membership Plans</span>
          <h2 className="pricing-title">CHOOSE YOUR POWER</h2>
          <p className="pricing-desc-header">
            Select a tier that matches your frequency and budget. All plans grant access to our digital tracking tools.
          </p>
        </div>

        {paymentError && (
          <div className="auth-global-error" style={{ maxWidth: "600px", margin: "0 auto 30px auto" }}>
            {paymentError}
          </div>
        )}

        <div className="pricing-grid">
          {plans.map((plan) => {
            const featuresList = JSON.parse(plan.features) as string[];
            return (
              <div key={plan.id} className={`pricing-card ${plan.popular ? "popular" : ""}`}>
                {plan.popular && (
                  <div className="badge badge-primary pricing-card-popular-badge">
                    🔥 MOST POPULAR
                  </div>
                )}
                
                <div>
                  <div className="pricing-tier">{plan.tier}</div>
                  <h3 className="pricing-name">{plan.name}</h3>
                  <div className="pricing-price-container">
                    <span className="pricing-price">₹{plan.price}</span>
                    <span className="pricing-period">/ month</span>
                  </div>
                  <p className="pricing-desc">{plan.description}</p>
                  
                  <ul className="pricing-features-list">
                    {featuresList.map((feat, i) => (
                      <li key={i} className="pricing-feature-item">
                        <Check size={16} className="pricing-feature-check" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribe(plan)}
                  className={`btn ${plan.popular ? "btn-primary" : "btn-secondary"} pricing-btn`}
                  disabled={loadingPlanId !== null}
                >
                  {loadingPlanId === plan.id ? "Preparing Checkout..." : `Subscribe ${plan.tier}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sandbox Simulator Modal */}
      {sandboxOrder && (
        <div className="sandbox-modal-overlay">
          <div className="sandbox-modal">
            <h3 className="sandbox-title">Sandbox Simulator</h3>
            <div className="badge badge-secondary sandbox-badge">
              ⚡ KEYLESS GATEWAY DETECTED
            </div>
            
            <div className="sandbox-details">
              <div className="sandbox-row">
                <span className="sandbox-lbl">Package:</span>
                <span className="sandbox-val">{sandboxOrder.planName}</span>
              </div>
              <div className="sandbox-row">
                <span className="sandbox-lbl">Total Amount:</span>
                <span className="sandbox-val">₹{sandboxOrder.amount / 100}</span>
              </div>
              <div className="sandbox-row">
                <span className="sandbox-lbl">Mock Order ID:</span>
                <span className="sandbox-val" style={{ fontFamily: "monospace", fontSize: "12px" }}>
                  {sandboxOrder.orderId}
                </span>
              </div>
            </div>

            <div className="sandbox-actions">
              <button
                className="btn btn-secondary"
                onClick={() => handleSimulatePayment(false)}
                disabled={paymentProcessing}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleSimulatePayment(true)}
                disabled={paymentProcessing}
                style={{ display: "inline-flex", gap: "6px" }}
              >
                <CreditCard size={16} /> {paymentProcessing ? "Verifying..." : "Simulate Success"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
