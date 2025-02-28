import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Gallery from "./components/Gallery";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("gallery"); // ✅ State quản lý tab đang hiển thị

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId === "hoang123") {
      setIsAdmin(true);
    }
  }, []);

  return (
    <div className="w-screen min-h-screen bg-gray-900 text-white">
      {/* ✅ Truyền activeTab và setActiveTab cho Header */}
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* ✅ Điều kiện hiển thị các thành phần theo activeTab */}
      {activeTab === "gallery" && <Hero isAdmin={isAdmin} />}
      {activeTab === "gallery" && <Gallery isAdmin={isAdmin} />}
      {activeTab === "about" && <h2 className="text-4xl text-center mt-16">Giới Thiệu</h2>}
      {activeTab === "contact" && <h2 className="text-4xl text-center mt-16">Liên Hệ</h2>}
    </div>
  );
}

export default App;