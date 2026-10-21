// Kiểm tra mỗi câu hỏi đúng độ khó của cấp độ.
// Chạy bằng Node: node test/check-questions.js
// hoặc trên macOS: jsc -e 'load("questions.js"); load("test/check-questions.js")'
(function () {
  const data = typeof require === "function" ? require("../questions.js") : { LEVELS, LEVEL_RULES };
  const log = typeof console !== "undefined" ? console.log.bind(console) : print;
  let errors = 0;
  const seen = new Set();
  for (const [key, level] of Object.entries(data.LEVELS)) {
    const r = data.LEVEL_RULES[key];
    const lens = [];
    for (const q of level.questions) {
      const a = q.a.normalize("NFC");
      const words = a.split(" ");
      const letters = Array.from(a.replace(/ /g, "")).length;
      lens.push(letters);
      const fail = (msg) => { errors++; log(`✗ [${level.name}] ${a}: ${msg}`); };
      if (a !== a.toLocaleUpperCase("vi")) fail("phải viết hoa");
      if (/[^A-ZÀ-ỹĐ ]/u.test(a) || /  /.test(a)) fail("ký tự lạ");
      if (words.length < r.minWords || words.length > r.maxWords) fail(`${words.length} tiếng (cần ${r.minWords}–${r.maxWords})`);
      if (letters < r.minLetters || letters > r.maxLetters) fail(`${letters} chữ cái (cần ${r.minLetters}–${r.maxLetters})`);
      if (!q.clue || !q.explain || !q.type) fail("thiếu clue/explain/type");
      if (seen.has(a)) fail("bị trùng");
      seen.add(a);
    }
    const avg = (lens.reduce((s, n) => s + n, 0) / lens.length).toFixed(1);
    log(`${level.name.padEnd(11)} ${level.questions.length} câu · ${Math.min(...lens)}–${Math.max(...lens)} chữ cái · TB ${avg}`);
  }
  log(errors ? `\n${errors} lỗi` : "\n✓ Tất cả câu hỏi đúng độ khó");
  if (typeof process !== "undefined") process.exit(errors ? 1 : 0);
})();
