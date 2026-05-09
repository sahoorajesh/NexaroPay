import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createUser, login } from "../api/userApi.js";
import { useToast } from "../components/ui/ToastProvider.jsx";
import { readAuth, writeAuth } from "../auth/session.js";

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

function Input({ label, id, value, onChange, placeholder, autoComplete, type = "text", error, isPassword }) {
    const [show, setShow] = React.useState(false);

  return (
    <div className="apField">
      <label className="apLabel" htmlFor={id}>
        {label}
      </label>
      <div className="inputWrap">
          <input
            id={id}
            type={isPassword && !show ? "password" : "text"}
            className={cn("apInput", error && "apInput--err")}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
          />
          {isPassword && (
            <button type="button" onClick={() => setShow(!show)}>
              👁
            </button>
          )}
      </div>
      {error ? <div className="apErr">{error}</div> : null}
    </div>
  );
}

function Button({ children, disabled, loading, variant = "primary", type = "button", onClick }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn("apBtn", variant === "ghost" && "apBtn--ghost", variant === "google" && "apBtn--google")}
    >
      {loading ? <span className="apSpinner" aria-hidden="true" /> : null}
      <span className="apBtn__txt">{children}</span>
    </button>
  );
}

export default function AuthPage({ defaultTab = "signin" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  React.useEffect(() => {
    // If the user is already logged in, don't let them open the sign-in page.
    // (Route-level guard also exists, but this helps if this page is reused elsewhere.)
    const auth = readAuth();
    if (auth?.userId) navigate("/welcome", { replace: true });
  }, [navigate]);

  const [tab, setTab] = React.useState(defaultTab === "signup" ? "signup" : "signin");
  const [anim, setAnim] = React.useState("enter");
  const [busy, setBusy] = React.useState(false);
  const [siSubmitted, setSiSubmitted] = React.useState(false);
  const [suSubmitted, setSuSubmitted] = React.useState(false);

  const [signin, setSignin] = React.useState({ email: "", kyc: "" });
  const [signup, setSignup] = React.useState({ name: "", email: "", phone: "", kycNumber: "" });

  React.useEffect(() => {
    const t = defaultTab === "signup" ? "signup" : "signin";
    setTab(t);
    setSiSubmitted(false);
    setSuSubmitted(false);
  }, [defaultTab]);

  React.useEffect(() => {
    // Smooth transition on tab change.
    setAnim("exit");
    const tm = setTimeout(() => setAnim("enter"), 120);
    return () => clearTimeout(tm);
  }, [tab]);

  const signinErrors = React.useMemo(() => {
    const e = {};
    if (!signin.email.trim()) e.email = "Email is required.";
    else if (!isEmail(signin.email)) e.email = "Enter a valid email.";
    if (!signin.kyc.trim()) e.kyc = "KYC number is required.";
    else if (signin.kyc.trim().length < 4) e.kyc = "KYC number looks too short.";
    return e;
  }, [signin]);

  const signupErrors = React.useMemo(() => {
    const e = {};
    if (!signup.name.trim()) e.name = "Name is required.";
    else if (signup.name.trim().length < 2) e.name = "Name looks too short.";
    if (!signup.email.trim()) e.email = "Email is required.";
    else if (!isEmail(signup.email)) e.email = "Enter a valid email.";
    if (!signup.phone.trim()) e.phone = "Phone is required.";
    else if (signup.phone.trim().length < 8) e.phone = "Phone looks too short.";
    if (!signup.kycNumber.trim()) e.kycNumber = "KYC number is required.";
    else if (signup.kycNumber.trim().length < 4) e.kycNumber = "KYC number looks too short.";
    return e;
  }, [signup]);

  const signinValid = Object.keys(signinErrors).length === 0;
  const signupValid = Object.keys(signupErrors).length === 0;

  async function onSubmitSignin(e) {
    e.preventDefault();
    setSiSubmitted(true);
    if (!signinValid || busy) return;
      setBusy(true);
      try {
        const res = await login({ email: signin.email.trim(), kyc: signin.kyc.trim() });
        writeAuth({ userId: res.userId, user: res.user });
        toast.push({ type: "ok", title: "Login successful", message: res.message || "Welcome back." });
        navigate("/welcome", { replace: true });
      } catch (err) {
        const msg = err?.message || "Login failed";
        toast.push({ type: "error", title: "Login failed", message: msg });
      setSignin({ email: "", kyc: "" }); // reset fields on error
      setSiSubmitted(false);
    } finally {
      setBusy(false);
    }
  }

  async function onSubmitSignup(e) {
    e.preventDefault();
    setSuSubmitted(true);
    if (!signupValid || busy) return;
    setBusy(true);
    try {
      await createUser({
        name: signup.name.trim(),
        email: signup.email.trim(),
        phone: signup.phone.trim(),
        kycNumber: signup.kycNumber.trim(),
      });
      toast.push({
        type: "ok",
        title: "Registration successful",
        message: "You can now proceed with login.",
      });
      setSignup({ name: "", email: "", phone: "", kycNumber: "" });
      setTab("signin");
      // Pre-fill sign-in for convenience
      setSignin({ email: signup.email.trim(), kyc: signup.kycNumber.trim() });
      setSiSubmitted(false);
      setSuSubmitted(false);
      navigate("/login", { replace: true, state: { justRegistered: true } });
    } catch (err) {
      const msg = err?.message || "Signup failed";
      toast.push({ type: "error", title: "Sign up failed", message: msg });
    } finally {
      setBusy(false);
    }
  }

  const justRegistered = Boolean(location?.state?.justRegistered);

  return (
    <div className="apRoot">
      <div className="apLeft" aria-label="Brand panel">
        <Link to="/" className="apBrand" aria-label="Go to home">
          <img src="/favicon.png" className="apBrand__logo" alt="" />
          <div className="apBrand__name">NexaroPay</div>
        </Link>

        <div className="apLeft__content">
          <h1 className="apHeadline">Smart. Secure. Seamless Payments.</h1>
          <p className="apTag">
            One account to manage your wallet, send payments, and keep every transaction clear and organized.
          </p>

          <div className="apIllo" aria-hidden="true">
            <div className="apIllo__card apIllo__card--a" />
            <div className="apIllo__card apIllo__card--b" />
            <div className="apIllo__card apIllo__card--c" />
          </div>
        </div>
      </div>

      <div className="apRight" aria-label="Authentication">
        <div className="apTopRow">
          <Link to="/" className="apBack" aria-label="Back to home">
            <span className="apBack__arr" aria-hidden="true">
              ←
            </span>
            Back to Home
          </Link>
        </div>
        <div className="apCard">
          <div className="apTabs" role="tablist" aria-label="Authentication tabs">
            <button
              type="button"
              className={cn("apTab", tab === "signin" && "isActive")}
              onClick={() => {
                setTab("signin");
                setSiSubmitted(false);
              }}
              role="tab"
              aria-selected={tab === "signin"}
            >
              Sign In
            </button>
            <button
              type="button"
              className={cn("apTab", tab === "signup" && "isActive")}
              onClick={() => {
                setTab("signup");
                setSuSubmitted(false);
              }}
              role="tab"
              aria-selected={tab === "signup"}
            >
              Sign Up
            </button>
          </div>

          <div className={cn("apPane", anim === "exit" && "apPane--exit")} aria-live="polite">
            {tab === "signin" ? (
              <form onSubmit={onSubmitSignin} className="apForm">
                <div className="apTitle">Welcome back</div>
                <div className="apSub">Sign in to continue to your wallet.</div>

                {justRegistered ? <div className="apInlineOk">Registration successful. Please sign in.</div> : null}

                <Input
                  id="si_email"
                  label="Email"
                  value={signin.email}
                  onChange={(e) => setSignin((s) => ({ ...s, email: e.target.value }))}
                  placeholder="you@example.com"
                  autoComplete="email"
                  error={siSubmitted ? signinErrors.email : ""}
                />
                <Input
                  id="si_kyc"
                  label="KYC number"
                  value={signin.kyc}
                  isPassword={true}
                  onChange={(e) => setSignin((s) => ({ ...s, kyc: e.target.value }))}
                  placeholder="e.g. 15433-56321-778612"
                  autoComplete="off"
                  error={siSubmitted ? signinErrors.kyc : ""}
                />

                <Button type="submit" loading={busy} disabled={!signinValid}>
                  Sign In
                </Button>
              </form>
            ) : (
              <form onSubmit={onSubmitSignup} className="apForm">
                <div className="apTitle">Create your account</div>
                <div className="apSub">Get started in a minute.</div>

                <Input
                  id="su_name"
                  label="Full name"
                  value={signup.name}
                  onChange={(e) => setSignup((s) => ({ ...s, name: e.target.value }))}
                  placeholder="e.g. Test User"
                  autoComplete="name"
                  error={suSubmitted ? signupErrors.name : ""}
                />
                <Input
                  id="su_email"
                  label="Email"
                  value={signup.email}
                  onChange={(e) => setSignup((s) => ({ ...s, email: e.target.value }))}
                  placeholder="you@example.com"
                  autoComplete="email"
                  error={suSubmitted ? signupErrors.email : ""}
                />
                <Input
                  id="su_phone"
                  label="Phone"
                  value={signup.phone}
                  onChange={(e) => setSignup((s) => ({ ...s, phone: e.target.value }))}
                  placeholder="e.g. 9876543210"
                  autoComplete="tel"
                  error={suSubmitted ? signupErrors.phone : ""}
                />
                <Input
                  id="su_kyc"
                  label="KYC number"
                  value={signup.kycNumber}
                  onChange={(e) => setSignup((s) => ({ ...s, kycNumber: e.target.value }))}
                  placeholder="e.g. 15433-56321-778612"
                  autoComplete="off"
                  error={suSubmitted ? signupErrors.kycNumber : ""}
                />

                <Button type="submit" loading={busy} disabled={!signupValid}>
                  Sign Up
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .apRoot{
          min-height:100vh;
          display:grid;
          grid-template-columns: 1fr 1fr;
          background: var(--bg);
          color: var(--text);
        }
        .apLeft{
          position:relative;
          padding: 28px;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          overflow:hidden;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
        }
        .apLeft::after{
          content:"";
          position:absolute;
          inset:-30%;
          background:
            radial-gradient(circle at 25% 20%, rgba(255,255,255,0.18), rgba(0,0,0,0) 55%),
            radial-gradient(circle at 80% 50%, rgba(255,255,255,0.12), rgba(0,0,0,0) 52%);
          transform: rotate(8deg);
          opacity:0.9;
          pointer-events:none;
        }
        .apBrand{
          position:relative;
          z-index:2;
          display:inline-flex;
          align-items:center;
          gap:10px;
          text-decoration:none;
          color: rgba(255,255,255,0.96);
          width: fit-content;
        }
        .apBrand__logo{ width:34px; height:34px; border-radius:10px; object-fit:cover; box-shadow: 0 18px 30px rgba(0,0,0,0.22); border:1px solid rgba(255,255,255,0.22); }
        .apBrand__name{ font-weight:900; letter-spacing:0; font-size:16px; text-transform:none; }
        .apLeft__content{
          position:relative;
          z-index:2;
          max-width: 520px;
          padding: 24px 0;
        }
        .apHeadline{
          margin: 0 0 10px;
          font-size: 38px;
          line-height: 1.08;
          letter-spacing:0;
          color: rgba(255,255,255,0.96);
        }
        .apTag{
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255,255,255,0.86);
          max-width: 56ch;
        }
        .apIllo{
          margin-top: 22px;
          display:grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
        }
        .apIllo__card{
          height: 120px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.20);
          background: rgba(255,255,255,0.10);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.18);
          transform: translateY(0);
          animation: apFloat 7s ease-in-out infinite;
        }
        .apIllo__card--b{ animation-duration: 9s; }
        .apIllo__card--c{ animation-duration: 11s; }
        @keyframes apFloat { 0%{transform:translateY(0)} 50%{transform:translateY(-10px)} 100%{transform:translateY(0)} }

        .apRight{
          padding: 28px;
          display:grid;
          place-items:center;
          background: transparent;
        }
        .apTopRow{
          width: min(460px, 100%);
          display:flex;
          justify-content:flex-start;
          margin-bottom: 10px;
        }
        .apBack{
          display:inline-flex;
          align-items:center;
          gap:8px;
          text-decoration:none;
          color: var(--muted);
          font-weight: 800;
          font-size: 13px;
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--surface);
        }
        .apBack:hover{ color: var(--text); }
        .apBack__arr{ font-size: 16px; line-height: 0; }
        .apCard{
          width: min(460px, 100%);
          border-radius: 14px;
          border: 1px solid var(--border);
          background: var(--surface2);
          box-shadow: var(--shadowStrong);
          overflow:hidden;
        }
        .apTabs{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:6px;
          padding: 10px;
          background: rgba(15,23,42,0.03);
          border-bottom: 1px solid var(--border);
        }
        html[data-theme="dark"] .apTabs{ background: rgba(148,163,184,0.06); }
        .apTab{
          height: 42px;
          border-radius: 12px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--muted);
          font-size: 13px;
          font-weight: 800;
          cursor:pointer;
        }
        .apTab.isActive{
          background: rgba(255,255,255,0.74);
          border-color: var(--border);
          color: var(--text);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.45);
        }
        html[data-theme="dark"] .apTab.isActive{
          background: rgba(2,6,23,0.48);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .apPane{
          padding: 18px 18px 16px;
          opacity: 1;
          transform: translateX(0);
          transition: opacity 160ms ease, transform 160ms ease;
        }
        .apPane--exit{
          opacity: 0;
          transform: translateX(8px);
        }
        .apForm{ display:grid; gap: 12px; }
        .apTitle{ font-size: 18px; font-weight: 900; letter-spacing:0; margin-top: 2px; }
        .apSub{ font-size: 13px; color: var(--muted); margin-top: -6px; }
        .apInlineOk{
          border-radius: 12px;
          border: 1px solid rgba(16,185,129,0.22);
          background: rgba(16,185,129,0.10);
          color: rgba(16,185,129,0.92);
          font-size: 13px;
          padding: 10px 12px;
        }
        html[data-theme="dark"] .apInlineOk{ color: rgba(167,243,208,0.95); }

        .apField{ display:grid; gap:6px; }
        .apLabel{ font-size: 12px; color: var(--muted); }
        .apInput{
          height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(15,23,42,0.12);
          background: rgba(255,255,255,0.88);
          padding: 0 12px;
          outline: none;
          color: var(--text);
          transition: box-shadow 120ms ease, border-color 120ms ease, background 120ms ease;
        }
        html[data-theme="dark"] .apInput{
          border: 1px solid rgba(148,163,184,0.14);
          background: rgba(2,6,23,0.40);
          color: var(--text);
        }
        .apInput:focus{
          border-color: rgba(37,99,235,0.45);
          box-shadow: 0 0 0 4px rgba(37,99,235,0.14);
        }
        .apInput--err{ border-color: rgba(239,68,68,0.40); }
        .apErr{ font-size: 12px; color: rgba(239,68,68,0.88); }

        .apBtn{
          height: 46px;
          border-radius: 12px;
          border: 1px solid rgba(37,99,235,0.22);
          background: linear-gradient(135deg, rgba(37,99,235,0.92), rgba(124,58,237,0.92));
          color: rgba(255,255,255,0.96);
          font-weight: 900;
          letter-spacing: 0;
          cursor: pointer;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap: 10px;
          box-shadow: 0 14px 34px rgba(37,99,235,0.20);
        }
        .apBtn:disabled{ opacity: 0.55; cursor:not-allowed; }
        .apBtn--ghost{
          background: transparent;
          color: var(--text);
          border: 1px solid var(--border);
          box-shadow: none;
        }
        .apBtn--google{
          background: rgba(255,255,255,0.86);
          color: var(--text);
          border: 1px solid rgba(15,23,42,0.10);
          box-shadow: none;
        }
        html[data-theme="dark"] .apBtn--google{
          background: rgba(2,6,23,0.36);
          border: 1px solid rgba(148,163,184,0.14);
          color: var(--text);
        }

        .apSpinner{
          width: 16px;
          height: 16px;
          border-radius: 999px;
          border: 2px solid rgba(255,255,255,0.55);
          border-top-color: rgba(255,255,255,0.95);
          animation: apSpin 700ms linear infinite;
        }
        @keyframes apSpin { to { transform: rotate(360deg); } }

        @media (max-width: 920px){
          .apRoot{ grid-template-columns: 1fr; }
          .apLeft{ min-height: 44vh; }
          .apRight{ min-height: 56vh; }
          .apIllo{ grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
