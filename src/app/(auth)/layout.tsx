import { Utensils, Star, Flame, Sparkles, ChefHat, Heart, Pizza, Soup } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-container">
      {/* Sidebar (Left Column - visible on desktop) */}
      <div 
        className="auth-sidebar" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&auto=format&fit=crop&q=80")' 
        }}
      >
        <div className="auth-sidebar-overlay" />
        
        {/* Floating Doodles inside Sidebar */}
        <div className="doodle-bg doodle-1" style={{ color: "#ffffff", opacity: 0.15 }}><Pizza size={54} /></div>
        <div className="doodle-bg doodle-2" style={{ color: "#ffffff", opacity: 0.15 }}><ChefHat size={46} /></div>
        <div className="doodle-bg doodle-3" style={{ color: "#ffffff", opacity: 0.15 }}><Soup size={40} /></div>
        <div className="doodle-bg doodle-4" style={{ color: "#ffffff", opacity: 0.15 }}><Flame size={44} style={{ color: "var(--primary)" }} /></div>

        <div className="auth-sidebar-content">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <div style={{
              background: "var(--primary)",
              color: "#ffffff",
              padding: "10px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Utensils size={24} />
            </div>
            <span style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 800,
              fontSize: "28px",
              letterSpacing: "-0.5px"
            }}>
              Crave<span style={{ color: "var(--primary)" }}>Bite</span>
            </span>
          </div>

          <h2 style={{ fontSize: "38px", lineHeight: 1.1, marginBottom: "16px", fontFamily: "var(--font-outfit)" }}>
            Satisfy Your Hunger Instantly
          </h2>
          <p style={{ fontSize: "16px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "32px" }}>
            Cravings delivered fast, fresh, and hot! Order from the finest selection of local restaurants and track your meal in real-time.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex" }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="#fbbf24" color="#fbbf24" />
              ))}
            </div>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)" }}>
              Loved by 50,000+ Foodies
            </span>
          </div>
        </div>
      </div>

      {/* Forms Content Panel (Right Column) */}
      <div className="auth-form-container">
        {/* Floating Doodles in Form Column Background */}
        <div className="doodle-bg doodle-1" style={{ opacity: 0.03 }}><Sparkles size={32} /></div>
        <div className="doodle-bg doodle-2" style={{ opacity: 0.03 }}><Heart size={30} /></div>
        <div className="doodle-bg doodle-3" style={{ opacity: 0.03 }}><Pizza size={36} /></div>
        
        {children}
      </div>
    </div>
  );
}
