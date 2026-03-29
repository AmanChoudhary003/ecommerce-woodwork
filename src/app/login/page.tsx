"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParam = useSearchParams();
  const callBackUrl = searchParam.get("callBackUrl") || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(" ");
      setLoading(true);
      const response = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (response?.error) {
        setError(response.error);
        setLoading(false);
        return;
      }
      setFormData({ email: "", password: "" });
      router.push(callBackUrl);
      router.refresh();
    } catch (err) {
      setError("Network error, Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1>Login</h1>

      <input
        placeholder="Email"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="border p-2 block mb-2"
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="border p-2 block mb-2"
      />
      {error && <p>{error}</p>}
      <button disabled={loading} onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
