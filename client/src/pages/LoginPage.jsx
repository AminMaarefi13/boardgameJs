import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { setConnectionState } = useAppContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.data.user.name);
        localStorage.setItem("playerId", data.data.user._id);
        setConnectionState((prev) => ({
          ...prev,
          name: data.data.user.name,
          playerId: data.data.user._id,
        }));
        navigate("/lobby");
      } else {
        setError(data.message || "ورود ناموفق بود.");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
    }
  };

  return (
    <div
      className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow text-gray-800"
      style={{ direction: "rtl" }}
    >
      <h2 className="text-2xl font-bold mb-4">ورود</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border rounded p-2"
          name="email"
          type="email"
          placeholder="ایمیل"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border rounded p-2"
          name="password"
          type="password"
          placeholder="رمز عبور"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          ورود
        </button>
      </form>
      <div className="mt-4 text-sm">
        حساب ندارید؟{" "}
        <a href="/signup" className="text-blue-700 underline">
          ثبت‌نام
        </a>
      </div>
    </div>
  );
}
