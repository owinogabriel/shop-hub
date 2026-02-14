import { createContext, useState } from "react";

// Create authentication context
export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  // Holds the currently authenticated user
  const [user, setUser] = useState(null);

  /**
   * Register a new user
   * - Reads existing users from localStorage
   * - Prevents duplicate email registration
   * - Saves new user
   * - Automatically logs user in after signup
   */
  function signUp(email, password) {
    // Get stored users or fallback to empty array
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Check if email already exists
    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email already exists" };
    }

    // Create and store new user
    const newUser = { email, password };
    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    // Persist logged-in session
    localStorage.setItem("currentUserEmail", email);

    // Update React state
    setUser({ email });

    return { success: true };
  }

  /**
   * Login existing user
   * - Validates email & password against stored users
   * - Saves session if successful
   */
  function login(email, password) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Find matching user credentials
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    // Reject if credentials are invalid
    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    // Persist login session
    localStorage.setItem("currentUserEmail", email);

    // Update React state
    setUser({ email });

    return { success: true };
  }

  /**
   * Logout current user
   * - Clears stored session
   * - Resets auth state
   */
  function logout() {
    localStorage.removeItem("currentUserEmail");
    setUser(null);
  }

  // Provide auth functions & state globally
  return (
    <AuthContext.Provider value={{ signUp, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}
