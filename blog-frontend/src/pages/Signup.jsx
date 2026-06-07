import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useToast } from "../ToastContext";

function getStrength(password) {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export default function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const strength = useMemo(() => getStrength(form.password), [form.password]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/auth/signup", form);
      addToast("Account created. You can sign in now.", "success");
      navigate("/login");
    } catch (error) {
      addToast(error.response?.data?.message || "Signup failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page page-enter">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Join Blog Website</p>
        <h1>Create account</h1>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            minLength="6"
            required
          />
        </label>
        <div className="strength" aria-label="Password strength">
          <span className={strength >= 1 ? "strength__bar strength__bar--active" : "strength__bar"} />
          <span className={strength >= 3 ? "strength__bar strength__bar--active" : "strength__bar"} />
          <span className={strength >= 5 ? "strength__bar strength__bar--active" : "strength__bar"} />
        </div>
        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
        <p className="auth-card__switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
