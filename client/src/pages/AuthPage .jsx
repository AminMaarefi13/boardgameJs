import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { socket } from "../network/socket";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // login | signup | welcome
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const { setConnectionState } = useAppContext();

  // خواندن اطلاعات از localStorage برای حفظ وضعیت ورود
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const playerId = localStorage.getItem("playerId");
    if (token && name && playerId) {
      setUserInfo({ name, playerId });
      setMode("welcome");
      setConnectionState((prev) => ({
        ...prev,
        name,
        playerId,
      }));
    }
  }, [setConnectionState]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        }
      );
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.data.user.name);
        localStorage.setItem("playerId", data.data.user._id);

        if (data.token) {
          localStorage.setItem("token", data.token);
          // ... سایر کدها ...
          socket.auth.token = data.token;
          socket.connect();
        }

        setConnectionState((prev) => ({
          ...prev,
          name: data.data.user.name,
          playerId: data.data.user._id,
        }));
        setUserInfo({
          name: data.data.user.name,
          playerId: data.data.user._id,
        });
        setMode("welcome");
      } else {
        setError(data.message || "ورود ناموفق بود.");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            passwordConfirm: form.passwordConfirm,
          }),
        }
      );
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.data.user.name);
        localStorage.setItem("playerId", data.data.user._id);

        if (data.token) {
          localStorage.setItem("token", data.token);
          socket.auth.token = data.token;
          socket.connect();
        }

        setConnectionState((prev) => ({
          ...prev,
          name: data.data.user.name,
          playerId: data.data.user._id,
        }));
        setUserInfo({
          name: data.data.user.name,
          playerId: data.data.user._id,
        });
        setMode("welcome");
      } else {
        setError(data.message || "ثبت‌نام ناموفق بود.");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("playerId");
    setUserInfo(null);
    setMode("login");
    setConnectionState((prev) => ({
      ...prev,
      name: "",
      playerId: "",
    }));
    // بعد از پاک کردن localStorage و ...:
    socket.emit("logout");
    socket.disconnect();
  };

  if (mode === "welcome" && userInfo) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ direction: "rtl" }}
      >
        <div className="max-w-md w-full bg-white p-5 rounded shadow text-gray-800 text-center mx-4">
          <h2 className="text-2xl font-bold mb-4">خوش آمدی {userInfo.name}!</h2>
          <div className="mb-2">
            <span className="font-mono">{userInfo.playerId}</span>
          </div>
          <button
            className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            خروج
          </button>
          <div className="mt-4 text-sm text-gray-500">
            می‌توانید از منو به لابی یا بازی بروید.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white p-6 rounded shadow text-gray-800 mx-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {mode === "login" ? "ورود" : "ثبت‌نام"}
        </h2>
        <form
          onSubmit={mode === "login" ? handleLogin : handleSignup}
          className="space-y-3"
        >
          {mode === "signup" && (
            <input
              className="w-full border rounded p-2"
              name="name"
              placeholder="نام"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}
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
          {mode === "signup" && (
            <input
              className="w-full border rounded p-2"
              name="passwordConfirm"
              type="password"
              placeholder="تکرار رمز عبور"
              value={form.passwordConfirm}
              onChange={handleChange}
              required
            />
          )}
          {error && <div className="text-red-600">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {mode === "login" ? "ورود" : "ثبت‌نام"}
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
          {mode === "login" ? (
            <>
              حساب ندارید؟{" "}
              <button
                className="text-blue-700 underline"
                onClick={() => setMode("signup")}
              >
                ثبت‌نام
              </button>
            </>
          ) : (
            <>
              حساب دارید؟{" "}
              <button
                className="text-blue-700 underline"
                onClick={() => setMode("login")}
              >
                ورود
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
