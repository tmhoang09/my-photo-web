import { useState, useEffect } from "react";
import { storage } from "../firebaseConfig"; // ✅ Import storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Hero({ isAdmin }) {
  const [bannerImage, setBannerImage] = useState("");

  // ✅ Load ảnh bìa từ Firebase Storage khi trang mở
  useEffect(() => {
    const savedBanner = localStorage.getItem("bannerImage");
    if (savedBanner) {
      setBannerImage(savedBanner);
    }
  }, []);

  // ✅ Xử lý khi Admin chọn ảnh bìa
  const handleBannerUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `banners/${file.name}`); // 🔥 Tạo đường dẫn trên Firebase Storage

    try {
      await uploadBytes(storageRef, file); // 🔥 Upload ảnh lên Firebase
      const imageUrl = await getDownloadURL(storageRef); // 🔥 Lấy URL của ảnh

      setBannerImage(imageUrl); // ✅ Cập nhật state
      localStorage.setItem("bannerImage", imageUrl); // ✅ Lưu vào localStorage
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên Firebase:", error);
    }
  };

  return (
    <section className="relative w-auto h-auto flex flex-col justify-center items-center text-white pt-20">
      {/* ✅ Ảnh Bìa */}
      <div className="relative w-full max-w-full h-[600px] border-2 border-gray-500 rounded-lg overflow-hidden">
        {bannerImage ? (
          <img
            src={bannerImage}
            alt="Banner"
            className="w-full h-full object-cover"
            onError={() => setBannerImage("/default-banner.jpg")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <p className="text-white">Không thể tải ảnh bìa</p>
          </div>
        )}

        {/* ✅ Nút chọn ảnh (Chỉ hiển thị nếu là Admin) */}
        {isAdmin && (
          <div className="absolute top-4 right-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              className="hidden"
              id="bannerUpload"
            />
            <label
              htmlFor="bannerUpload"
              className="cursor-pointer text-white px-3 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              🖼️ Thay đổi ảnh bìa
            </label>
          </div>
        )}

        {/* ✅ Tiêu đề */}
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center bg-transparent">
          <h1 className="text-5xl font-bold text-white">Hoàng's Photography</h1>
          <p className="text-lg text-white mt-2">Lưu giữ những khoảnh khắc đẹp nhất</p>
        </div>
      </div>
    </section>
  );
}