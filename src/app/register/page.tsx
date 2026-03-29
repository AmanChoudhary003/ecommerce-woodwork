"use client";
import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // if error show it and don't reset the form
      const resultData = await response.json();
      if (!response.ok || resultData.error) {
        setError("Something went wrong");
        return;
      }

      // if user is registered
      alert("user created");
      handleReset();
    } catch (err) {
      setError("Network error, Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ email: "", password: "" });
  };

  return (
    <div className="p-10">
      <h1>Register</h1>

      <input
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="border p-2 block mb-2"
      />

      <input
        placeholder="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="border p-2 block mb-2"
      />
      {error && <p>{error}</p>}
      <button disabled={loading} onClick={handleSubmit}>
        Register
      </button>
    </div>
  );
}
