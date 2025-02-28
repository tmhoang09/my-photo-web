import { useState, useEffect } from "react";

const ADMIN_ID = "hoang123"; // ID admin
const concepts = ["Cưới~Hỏi", "Chân Dung", "Nghệ Thuật", "Kỷ Yếu"];
const video = ["Cưới~Hỏi", "Chân Dung", "Nghệ Thuật", "Kỷ Yếu"];
import About from "./About";
import Contact from "./Contact";
export default function Gallery({ isAdmin, activeTab }) {
  const [selectedConcept, setSelectedConcept] = useState("Wedding");
  const [albums, setAlbums] = useState(() => {
    const savedAlbums = localStorage.getItem("albums");
    return savedAlbums ? JSON.parse(savedAlbums) : {};
  });
  const [newAlbumName, setNewAlbumName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxAlbum, setLightboxAlbum] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]); // Lưu danh sách ảnh được chọn để xóa
  //const [activeTab, setActiveTab] = useState("gallery");
  useEffect(() => {
    const savedAlbums = localStorage.getItem("albums");
    if (savedAlbums) {
      setAlbums(JSON.parse(savedAlbums)); // 🔥 Chuyển từ JSON về object và cập nhật vào state
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("albums", JSON.stringify(albums));
  }, [albums]);

  // ✅ 2. Mỗi khi albums thay đổi → lưu vào LocalStorage
  useEffect(() => {
    localStorage.setItem("albums", JSON.stringify(albums));
  }, [albums]);
  const handleSelectConcept = (concept) => {
    setSelectedConcept(concept);
  };

  const handleAddAlbum = () => {
    if (!newAlbumName) return alert("Vui lòng nhập tên album!");

    setAlbums((prevAlbums) => ({
      ...prevAlbums,
      [selectedConcept]: {
        ...(prevAlbums[selectedConcept] || {}),
        [newAlbumName]: [],
      },
    }));
    setNewAlbumName("");
  };
  const handleSelectImage = (imageId) => {
    setSelectedImages(
      (prevSelected) =>
        prevSelected.includes(imageId)
          ? prevSelected.filter((id) => id !== imageId) // Bỏ chọn nếu đã chọn
          : [...prevSelected, imageId] // Thêm nếu chưa chọn
    );
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const newImages = files.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...newImages]);
  };

  const handleUploadImages = (albumName) => {
    if (!isAdmin) return alert("Bạn không có quyền tải ảnh lên!");
    if (selectedFiles.length === 0)
      return alert("Vui lòng chọn ít nhất một ảnh trước!");

    const enteredId = prompt("Nhập lại mật khẩu Admin để xác nhận:");
    if (enteredId !== ADMIN_ID) {
      alert("Sai mật khẩu! Bạn không thể tải ảnh lên.");
      return;
    }

    setAlbums((prevAlbums) => {
      const updatedAlbums = { ...prevAlbums };
    
      if (!updatedAlbums[selectedConcept]) {
        updatedAlbums[selectedConcept] = {};
      }
      if (!updatedAlbums[selectedConcept][albumName]) {
        updatedAlbums[selectedConcept][albumName] = [];
      }
    
      const newImages = selectedFiles.map((file, index) => ({
        id: Date.now() + Math.random(),
        url: URL.createObjectURL(file), // 🔥 Chuyển file thành URL
      }));
    
      updatedAlbums[selectedConcept][albumName] = [
        ...newImages,
        ...updatedAlbums[selectedConcept][albumName],
      ];
    
      localStorage.setItem("albums", JSON.stringify(updatedAlbums)); // 🔥 Lưu vào LocalStorage
    
      return updatedAlbums;
    });

    // ✅ Xóa selectedFiles sau khi upload để không bị nhân đôi
    setSelectedFiles([]);

    alert(`📤 Ảnh đã được tải lên album ${albumName} thành công!`);
  };

  const openLightbox = (albumName, index) => {
    setLightboxAlbum(albumName);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = "hidden"; // Ngăn trang web bị tràn
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = "auto"; // Khôi phục cuộn trang
  };

  const prevImage = () => {
    if (lightboxAlbum) {
      setLightboxIndex((prevIndex) =>
        prevIndex === 0
          ? albums[selectedConcept][lightboxAlbum].length - 1
          : prevIndex - 1
      );
    }
  };

  const nextImage = () => {
    if (lightboxAlbum) {
      setLightboxIndex((prevIndex) =>
        prevIndex === albums[selectedConcept][lightboxAlbum].length - 1
          ? 0
          : prevIndex + 1
      );
    }
  };
  const deleteSelectedImages = () => {
    if (!isAdmin) return alert("Bạn không có quyền xóa ảnh!");
    if (selectedImages.length === 0)
      return alert("Vui lòng chọn ít nhất một ảnh!");

    const confirmed = confirm("Bạn có chắc chắn muốn xóa ảnh đã chọn?");
    if (!confirmed) return;

    setAlbums((prevAlbums) => {
      if (!lightboxAlbum || !prevAlbums[selectedConcept]?.[lightboxAlbum])
        return prevAlbums;

      const updatedAlbums = { ...prevAlbums };
      let updatedImages = updatedAlbums[selectedConcept][lightboxAlbum].filter(
        (img) => !selectedImages.includes(img.id)
      );

      // Nếu album trống sau khi xóa, xóa luôn album
      if (updatedImages.length === 0) {
        delete updatedAlbums[selectedConcept][lightboxAlbum];

        // Nếu không còn album nào, xóa luôn concept
        if (Object.keys(updatedAlbums[selectedConcept]).length === 0) {
          delete updatedAlbums[selectedConcept];
          closeLightbox(); // 🔥 Đóng Lightbox nếu không còn album
          return updatedAlbums;
        }
      } else {
        updatedAlbums[selectedConcept][lightboxAlbum] = updatedImages;
      }

      // Reset danh sách ảnh đã chọn
      setSelectedImages([]);

      // 🔥 Kiểm tra lại chỉ số ảnh để tránh lỗi trắng màn hình
      setTimeout(() => {
        setLightboxIndex((prevIndex) => {
          if (updatedImages.length === 0) return 0; // Nếu không còn ảnh, đặt về 0
          return prevIndex >= updatedImages.length
            ? updatedImages.length - 1
            : prevIndex;
        });
      }, 0);

      return updatedAlbums;
    });

    alert("Ảnh đã được xóa!");
  };

  return (
    <section
      id="gallery"
      className="w-screen min-h-screen text-white bg-black text-center relative pt-24"
    >
      <h2 className="text-4xl mb-8 bg-black bg-opacity-50 p-2 inline-block rounded-lg">
        CREATION
      </h2>

      <div className="flex justify-center space-x-9 bg-gray-800 p-4 rounded-full">
        {concepts.map((concept) => (
          <button
            key={concept}
            onClick={() => handleSelectConcept(concept)}
            className={`px-10 py-2 text-sm rounded-full text-white font-medium focus:outline-none border-none 
              transform transition duration-200 ease-in-out hover:scale-110 ${
                selectedConcept === concept ? "bg-orange-500" : "bg-blue-400"
              }`}
          >
            {concept}
          </button>
        ))}
      </div>

      {isAdmin && (
        <div className="mt-6">
          <div className="flex justify-center gap-2">
            <input
              type="text"
              placeholder="Tên album"
              className="px-2 py-1 text-sm rounded-lg text-black w-32"
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
            />
            <button
              onClick={handleAddAlbum}
              className="bg-green-500 px-3 py-1 text-xs rounded-lg text-white"
            >
              ➕ Album
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col justify-center items-center gap-8 mt-8 w-full h-full">
        {albums[selectedConcept] &&
          Object.keys(albums[selectedConcept])
            .reverse()
            .map((albumName) => (
              <div
                key={albumName}
                className="w-full h-full flex flex-col items-center"
              >
                <div className="relative w-screen h-screen flex justify-center items-center bg-black">
                  {/* Ảnh đầu tiên trong Album - Full màn hình */}
                  {albums[selectedConcept][albumName]?.length > 0 ? (
                    <img
                      src={albums[selectedConcept][albumName][0].url} // 🛠️ Kiểm tra có `.url`
                      alt="Album Image"
                      className="w-full h-full object-contain rounded-2xl shadow-2xl cursor-pointer"
                      onClick={() => openLightbox(albumName, 0)}
                    />
                  ) : (
                    <p className="text-white">Album chưa có ảnh nào.</p>
                  )}

                  {/* Tên Album hiển thị ở góc dưới bên trái ảnh */}
                  <div className="absolute bottom-6 left-6 bg-black bg-opacity-60 text-white px-6 py-3 rounded-lg text-3xl font-extrabold shadow-lg">
                    {albumName}
                  </div>
                </div>

                {/* Nếu là Admin thì hiển thị nút tải ảnh lên */}
                {isAdmin && (
                  <div className="mt-4 flex flex-col items-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="mb-2"
                    />
                    <button
                      onClick={() => handleUploadImages(albumName)}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      📤 Tải {selectedFiles.length} ảnh lên album {albumName}
                    </button>
                  </div>
                )}
              </div>
            ))}
      </div>

      {isLightboxOpen && lightboxAlbum && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-90 flex flex-col justify-center items-center z-50">
          <button
            className="absolute top-5 right-12 text-white bg-red-600 hover:bg-red-600 w-5 h-10 rounded-full flex justify-center items-center text-1x"
            onClick={closeLightbox}
          ></button>

          {isAdmin && (
            <div className="absolute top-4 left-4 flex items-center gap-2">
              {/* ✅ CheckBox để chọn ảnh */}
              <input
                type="checkbox"
                className="w-6 h-6"
                checked={selectedImages.includes(
                  albums[selectedConcept][lightboxAlbum][lightboxIndex].id
                )}
                onChange={() =>
                  handleSelectImage(
                    albums[selectedConcept][lightboxAlbum][lightboxIndex].id
                  )
                }
              />
              {/* ❌ Nút XÓA ẢNH */}
              <button
                className="text-2x bg-gray-900 px-2 py-2 rounded-lg"
                onClick={deleteSelectedImages}
              >
                Xóa
              </button>
            </div>
          )}

          {/* Nút chuyển ảnh */}
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-4xl text-white bg-black bg-opacity-50 px-3 py-2 rounded-full z-10"
            onClick={prevImage}
          >
            ◀
          </button>

          {/* Ảnh Lightbox */}
          <div className="relative">
            {albums[selectedConcept]?.[lightboxAlbum]?.length > 0 && (
              <img
                src={albums[selectedConcept][lightboxAlbum][lightboxIndex]?.url}
                className="w-auto h-auto max-w-full max-h-screen object-contain"
              />
            )}
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg">
              Ảnh {lightboxIndex + 1}/
              {albums[selectedConcept][lightboxAlbum]?.length}
            </div>
          </div>

          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-4xl text-white bg-black bg-opacity-50 px-3 py-2 rounded-full z-10"
            onClick={nextImage}
          >
            ▶
          </button>
        </div>
      )}
      {activeTab === "gallery" && <h2 className="text-4xl mb-8"></h2>}
      {activeTab === "about" && <About />}
      {activeTab === "contact" && <Contact />}
    </section>
  );
}
