/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // MÀU CHỦ ĐẠO MỚI (ENTERPRISE RED)
        primary: {
          DEFAULT: "oklch(0.637 0.237 25.331)", // Đỏ đậm (Nút bấm, Header)
          soft: "oklch(0.808 0.114 19.571)",    // Đỏ nhạt (Nền nút phụ, Badge)
          foreground: "#FFFFFF",                // Chữ trên nền đỏ
        },
        // MÀU NỀN & THẺ (CHUẨN MISA)
        background: "#F2F4F8", // Xám xanh rất nhạt (Nền App)
        card: "#FFFFFF",       // Trắng (Nền thẻ)

        // MÀU CHỮ
        text: {
          primary: "#1F2937",   // Gray-800 (Tiêu đề)
          secondary: "#6B7280", // Gray-500 (Mô tả)
        },

        // CÁC MÀU TRẠNG THÁI (GIỮ NGUYÊN HOẶC TINH CHỈNH)
        success: "#10B981", // Xanh lá (Chấm công OK)
        danger: "#EF4444",  // Đỏ tươi (Báo lỗi)
        warning: "#F59E0B", // Vàng (Cảnh báo)
      },
      fontFamily: {
        sans: ["System", "sans-serif"], // Dùng font hệ thống cho chuyên nghiệp
      },
    },
  },
  plugins: [],
}
