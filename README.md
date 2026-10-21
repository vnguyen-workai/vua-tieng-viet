# Vua Tiếng Việt 👑

Trò chơi sắp xếp chữ cái, tôn vinh sự giàu đẹp của tiếng Việt.

- 4 cấp độ: **Dễ**, **Trung bình**, **Khó** (thành ngữ), **Siêu khó** (tục ngữ, ca dao) — 20 câu mỗi cấp, mỗi lượt 10 câu ngẫu nhiên
- Gợi ý, đếm giờ, thưởng tốc độ, giải thích ý nghĩa sau mỗi câu
- Bảng xếp hạng lưu trên trình duyệt (Tuần này / Tháng này / Tất cả)
- Nhạc nền ngũ cung và hiệu ứng âm thanh tạo bằng Web Audio API
- HTML + CSS + JavaScript thuần, không cần cài đặt

## Chạy thử

Mở `index.html` trong trình duyệt, hoặc:

```bash
python3 -m http.server 5173
```

rồi vào http://localhost:5173.

## Thêm / sửa câu hỏi

Sửa `questions.js`. Mỗi cấp độ có quy tắc độ dài để câu hỏi đúng độ khó; kiểm tra bằng:

```bash
node test/check-questions.js
```

(trên macOS không có Node: `/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc -e 'load("questions.js"); load("test/check-questions.js")'`)
