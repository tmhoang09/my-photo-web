import { useState, useEffect } from "react";

const ADMIN_ID = "hoang123"; // ID admin

export default function Header({
  isAdmin,
  setIsAdmin,
  activeTab,
  setActiveTab,
}) {
  const handleAdminLogin = () => {
    const enteredId = prompt("Nhập ID quản trị:");
    if (enteredId === ADMIN_ID) {
      localStorage.setItem("userId", enteredId);
      setIsAdmin(true);
    } else {
      alert("Sai ID, bạn không có quyền quản trị!");
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("userId");
    setIsAdmin(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-black bg-opacity-90 text-white py-4 px-6 flex justify-between items-center z-50">
      {/* ✅ Click vào tên website để về trang chính */}
      <h1
        className="text-2xl font-bold cursor-pointer hover:scale-105 transition-transform"
        onClick={() => setActiveTab("gallery")} // 🔥 QUAN TRỌNG: Cập nhật activeTab thành "gallery"
      >
        Hoàng's Photography
      </h1>

      {/* ✅ Menu chuyển đổi tab nằm trước câu hỏi admin */}
      <div className="flex space-x-6">
        <button
          onClick={() => setActiveTab("gallery")}
          className={`text-base font-medium text-white transition duration-300 ease-in-out transform hover:scale-125 bg-transparent border-none outline-none focus:outline-none ${
            activeTab === "gallery" ? "text-blue-400" : "hover:text-gray-300"
          }`}
        >
          Gallery
        </button>

        <button
          onClick={() => setActiveTab("about")}
          className={`text-base font-medium text-white transition duration-300 ease-in-out transform hover:scale-125 bg-transparent border-none outline-none focus:outline-none ${
            activeTab === "about" ? "text-blue-400" : "hover:text-gray-300"
          }`}
        >
          About
        </button>

        <button
          onClick={() => setActiveTab("contact")}
          className={`text-base font-medium text-white transition duration-300 ease-in-out transform hover:scale-125 bg-transparent border-none outline-none focus:outline-none ${
            activeTab === "contact" ? "text-blue-400" : "hover:text-gray-300"
          }`}
        >
          Contact
        </button>
      </div>

      {/* ✅ Giữ nguyên phần xác thực admin */}
      {!isAdmin ? (
        <button
          onClick={handleAdminLogin}
          className="text-xs font-medium text-white transition duration-300 ease-in-out transform hover:scale-125 border-none outline-none focus:outline-none focus:ring-0 focus:border-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent bg-transparent"
        >
          Bạn có phải Admin không?
        </button>
      ) : (
        <div className="flex items-center space-x-4">
          <span className="text-xs text-green-400">✅ Bạn đang là Admin</span>
          <button
            onClick={handleAdminLogout}
            className="text-xs text-red-400 hover:text-white transition duration-300 ease-in-out transform hover:scale-105"
          >
            🔴 Exit
          </button>
        </div>
      )}
    </header>
  );
}
