"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Register() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

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
        setError(resultData.error || "Something went wrong");
        return;
      }

      // if user is registered

      if (response.ok) {
        const result = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });
        if (result?.ok) {
          router.push("/");
          router.refresh();
        }
      }
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
