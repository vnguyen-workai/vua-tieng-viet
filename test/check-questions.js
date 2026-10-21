// Kiểm tra mỗi câu hỏi đúng độ khó của cấp độ, cho cả 5 dạng câu hỏi.
// Chạy bằng Node: node test/check-questions.js
// hoặc trên macOS: jsc -e 'load("questions.js"); load("questions-more.js"); load("test/check-questions.js")'
(function () {
  const isNode = typeof require === "function";
  const base = isNode ? require("../questions.js") : { LEVELS, LEVEL_RULES };
  const more = isNode ? require("../questions-more.js") : { MORE_QUESTIONS, MORE_RULES };
  const log = typeof console !== "undefined" ? console.log.bind(console) : print;
  const letterCount = (s) => Array.from(s.replace(/ /g, "")).length;
  let errors = 0;
  const fail = (lvl, kind, item, msg) => { errors++; log(`✗ [${lvl}/${kind}] ${item}: ${msg}`); };
  const range = (n, r) => n >= r.min && n <= r.max;

  for (const [key, level] of Object.entries(base.LEVELS)) {
    const name = level.name;
    // 1. Sắp xếp chữ cái
    const r = base.LEVEL_RULES[key];
    const seen = new Set();
    for (const q of level.questions) {
      const a = q.a.normalize("NFC");
      const words = a.split(" ").length, n = letterCount(a);
      if (a !== a.toLocaleUpperCase("vi")) fail(name, "scramble", a, "phải viết hoa");
      if (/[^A-ZÀ-ỹĐ ]/u.test(a)) fail(name, "scramble", a, "ký tự lạ");
      if (words < r.minWords || words > r.maxWords) fail(name, "scramble", a, `${words} tiếng (cần ${r.minWords}–${r.maxWords})`);
      if (n < r.minLetters || n > r.maxLetters) fail(name, "scramble", a, `${n} chữ cái (cần ${r.minLetters}–${r.maxLetters})`);
      if (!q.clue || !q.explain || !q.type) fail(name, "scramble", a, "thiếu clue/explain/type");
      if (seen.has(a)) fail(name, "scramble", a, "bị trùng");
      seen.add(a);
    }
    const m = more.MORE_QUESTIONS[key];
    // 2. Điền chữ cái còn thiếu
    for (const q of m.letters) {
      const blanks = [...q.t.matchAll(/\{([^}]*)\}/g)].map((x) => x[1]);
      if (!range(blanks.length, more.MORE_RULES.letters[key])) fail(name, "letters", q.t.slice(0, 30), `${blanks.length} ô trống`);
      if (blanks.some((b) => Array.from(b).length !== 1 || !/\p{L}/u.test(b))) fail(name, "letters", q.t.slice(0, 30), "mỗi ô phải là 1 chữ cái");
    }
    // 3. Điền từ còn thiếu
    for (const q of m.word) {
      const miss = [...q.t.matchAll(/\[([^\]]*)\]/g)].map((x) => x[1]);
      if (miss.length !== 1) { fail(name, "word", q.t.slice(0, 30), "cần đúng 1 chỗ trống"); continue; }
      const w = miss[0], wr = more.MORE_RULES.word[key];
      const n = letterCount(w), words = w.split(" ").length;
      if (n < wr.minLetters || n > wr.maxLetters) fail(name, "word", w, `${n} chữ cái (cần ${wr.minLetters}–${wr.maxLetters})`);
      if (words < wr.minWords || words > wr.maxWords) fail(name, "word", w, `${words} tiếng (cần ${wr.minWords}–${wr.maxWords})`);
    }
    // 4. Sắp xếp từ
    for (const q of m.order) {
      const n = q.t.replace(/[.,;:!?“”"]/g, "").split(/\s+/).length;
      if (!range(n, more.MORE_RULES.order[key])) fail(name, "order", q.t, `${n} từ`);
    }
    // 5. Chọn chính tả
    for (const q of m.spell) {
      if (q.ok === q.bad) fail(name, "spell", q.ok, "hai đáp án giống nhau");
      if (q.ok.split(" ").length !== q.bad.split(" ").length) fail(name, "spell", q.ok, "hai đáp án khác số tiếng");
    }
    for (const kind of ["letters", "word", "order", "spell"]) {
      const keys = m[kind].map((q) => q.t || q.ok);
      if (new Set(keys).size !== keys.length) fail(name, kind, "", "có câu bị trùng");
      if (m[kind].length < 10) fail(name, kind, "", `chỉ có ${m[kind].length} câu (cần ≥ 10)`);
      if (m[kind].some((q) => !q.explain)) fail(name, kind, "", "thiếu giải thích");
    }
    log(`${name.padEnd(11)} chữ cái ${level.questions.length} · điền chữ ${m.letters.length} · điền từ ${m.word.length} · sắp xếp từ ${m.order.length} · chính tả ${m.spell.length}`);
  }
  log(errors ? `\n${errors} lỗi` : "\n✓ Tất cả câu hỏi đúng độ khó");
  if (typeof process !== "undefined") process.exit(errors ? 1 : 0);
})();
