import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  // Controls whether user is signing up or logging in
  const [mode, setMode] = useState("signup");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get auth functions and current user from context
  const { signUp, user, login } = useContext(AuthContext);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /**
   * Handle form submission
   * - Calls signup or login depending on mode
   */
  async function onSubmit(data) {
    setError(null);

    let result;

    if (mode === "signup") {
      result = await signUp(data.email, data.password);
    } else {
      result = await login(data.email, data.password);
    }

    if (result?.success) {
      navigate("/");
    } else {
      setError(result?.error || "Something went wrong");
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="auth-container">
          {/* Show logged-in user */}
          {user && <p>User logged in: {user.email}</p>}

          {/* Dynamic title */}
          <h1 className="page-title">
            {mode === "signup" ? "Sign Up" : "Login"}
          </h1>

          {/* Authentication Form */}
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            {error && <div className="error-message">{error}</div>}
            {/* EMAIL FIELD */}
            <div className="form-group">
              <label className="form-label">Email</label>

              <input
                type="email"
                id="email"
                autoComplete="email"
                className="form-input"
                {...register("email", {
                  required: "Email is required",
                })}
              />

              {errors.email && (
                <span className="form-error">{errors.email.message}</span>
              )}
            </div>

            {/* PASSWORD FIELD */}
            <div className="form-group">
              <label className="form-label">Password</label>

              <input
                type="password"
                id="password"
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                className="form-input"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  maxLength: {
                    value: 12,
                    message: "Password must be less than 12 characters",
                  },
                })}
              />

              {errors.password && (
                <span className="form-error">{errors.password.message}</span>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button type="submit" className="btn btn-primary btn-large">
              {mode === "signup" ? "Sign Up" : "Login"}
            </button>
          </form>

          {/* SWITCH BETWEEN LOGIN & SIGNUP */}
          <div className="auth-switch">
            {mode === "signup" ? (
              <p>
                Already have an account?{" "}
                <span className="auth-link" onClick={() => setMode("login")}>
                  Login
                </span>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <span className="auth-link" onClick={() => setMode("signup")}>
                  Sign Up
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
