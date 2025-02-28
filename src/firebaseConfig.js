import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// ✅ Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBbhuWwLVdL2aksaO-yjAYLW1QXvIVMmOk",
  authDomain: "hft123-94152.firebaseapp.com",
  projectId: "hft123-94152",
  storageBucket: "hft123-94152.appspot.com", // ✅ ĐÃ SỬA ĐÚNG storageBucket
  messagingSenderId: "499531056813",
  appId: "1:499531056813:web:f8b980830caef1d12fe824",
  measurementId: "G-L4GZ46VR69",
};

// ✅ Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// ✅ Khởi tạo Firebase Storage
const storage = getStorage(app);

// ✅ Export storage để dùng trong các file khác
export { storage };