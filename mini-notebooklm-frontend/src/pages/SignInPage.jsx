import { BookOpenCheck, Check, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function SignInPage() {
  const { login, register } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (pw) => {
    return {
      length: pw.length > 0 && pw.length <= 15,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      number: /[0-9]/.test(pw),
      special: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(pw),
    };
  };

  const checks = validatePassword(password);
  const isValid = Object.values(checks).every(Boolean);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!username.trim() || !password) return;
    
    if (mode === "register" && !isValid) {
      setError("Please satisfy all password requirements.");
      return;
    }

    setLoading(true);
    const action = mode === "register" ? register : login;
    const res = await action(username, password);
    setLoading(false);

    if (!res.success) {
      if (mode === "register" && res.error?.toLowerCase().includes("username already exists")) {
        setMode("signin");
        setPassword("");
        pushToast({
          variant: "error",
          title: "User already exists",
          message: "This profile is already registered. Please log in from the sign-in page.",
          duration: 6000,
        });
      }
      setError(res.error);
    } else {
      navigate("/");
    }
  };

  return (
    <main className="authPage">
      <section className="authPanel">
        <div className="authBrand">
          <span className="brandMark large"><BookOpenCheck size={28} /></span>
          <span>
            <strong>Mini NotebookLM</strong>
            <small>Document intelligence workspace</small>
          </span>
        </div>
        <h1>{mode === "register" ? "Create your workspace" : "Welcome back"}</h1>
        
        {error && <div className="errorBanner">{error}</div>}

        <form onSubmit={submit}>
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your name" autoFocus required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
          </label>

          {mode === "register" && (
            <div className="passwordHints">
              <Hint label="Max 15 characters" valid={checks.length} />
              <Hint label="At least 1 uppercase" valid={checks.upper} />
              <Hint label="At least 1 lowercase" valid={checks.lower} />
              <Hint label="At least 1 number" valid={checks.number} />
              <Hint label="At least 1 special char" valid={checks.special} />
            </div>
          )}

          <Button type="submit" disabled={loading || (mode === "register" && !isValid)}>
            {loading ? "Processing..." : (mode === "register" ? "Register" : "Sign in")}
          </Button>
        </form>
        
        <button className="textButton" type="button" onClick={() => { setMode(mode === "register" ? "signin" : "register"); setError(""); }}>
          {mode === "register" ? "Already have an account? Sign In" : "New to Mini-Notebooklm? Sign Up"}
        </button>
      </section>
    </main>
  );
}

function Hint({ label, valid }) {
  return (
    <div className={`hint ${valid ? "valid" : ""}`}>
      {valid ? <Check size={12} /> : <X size={12} />}
      {label}
    </div>
  );
}
