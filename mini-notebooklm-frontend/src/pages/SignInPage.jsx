import { BookOpenCheck } from "lucide-react";
import { useState } from "react";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignInPage() {
  const { signIn, register } = useAuth();
  const [mode, setMode] = useState("signin");
  const [username, setUsername] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (!username.trim()) return;
    const action = mode === "register" ? register : signIn;
    action({ username });
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
        <p>Use a local profile for now. The auth layer is isolated so backend auth can replace it later.</p>
        <form onSubmit={submit}>
          <label>
            Username
            <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter your name" autoFocus />
          </label>
          <Button type="submit">{mode === "register" ? "Register" : "Sign in"}</Button>
        </form>
        <button className="textButton" type="button" onClick={() => setMode(mode === "register" ? "signin" : "register")}>
          {mode === "register" ? "I already have a local profile" : "Create a new local profile"}
        </button>
      </section>
    </main>
  );
}
