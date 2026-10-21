// Âm thanh tạo hoàn toàn bằng Web Audio API — không cần file nhạc.
// Nhạc nền: giai điệu ngũ cung (Đô Rê Fa Son La) với tiếng gảy kiểu đàn tranh.
const Sound = (() => {
  let ctx = null, master, musicBus, sfxBus, noiseBuf;
  let musicOn = readPref("vtv_music", true);
  let sfxOn = readPref("vtv_sfx", true);
  let playing = false, nextTime = 0, step = 0, schedTimer = null;

  function readPref(k, d) {
    try { const v = localStorage.getItem(k); return v === null ? d : v === "1"; } catch { return d; }
  }
  function writePref(k, v) {
    try { localStorage.setItem(k, v ? "1" : "0"); } catch {}
  }

  const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const freq = (n) => { // "A4", "C5"
    const m = /^([A-G])(\d)$/.exec(n);
    return 440 * Math.pow(2, (NOTE[m[1]] + (+m[2] + 1) * 12 - 69) / 12);
  };

  function init() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = musicOn ? 0.16 : 0;
    sfxBus = ctx.createGain(); sfxBus.gain.value = sfxOn ? 0.5 : 0;
    musicBus.connect(master); sfxBus.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    if (musicOn) startMusic();
  }

  // ---------- nhạc cụ ----------
  function pluck(f, t, dur, out, vol = 0.5, bend = true) {
    const o = ctx.createOscillator(), o2 = ctx.createOscillator();
    const g = ctx.createGain(), lp = ctx.createBiquadFilter();
    o.type = "triangle"; o2.type = "sine";
    o.frequency.setValueAtTime(bend ? f * 0.985 : f, t);
    if (bend) o.frequency.exponentialRampToValueAtTime(f, t + 0.07); // nhấn nhá như đàn tranh
    o2.frequency.value = f * 2;
    lp.type = "lowpass"; lp.frequency.setValueAtTime(f * 6, t); lp.frequency.exponentialRampToValueAtTime(f * 1.5, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const g2 = ctx.createGain(); g2.gain.value = 0.18;
    o.connect(g); o2.connect(g2).connect(g); g.connect(lp).connect(out);
    o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
  }
  function tone(f, t, dur, out, { type = "sine", vol = 0.4, to = null, attack = 0.005 } = {}) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(out); o.start(t); o.stop(t + dur + 0.05);
  }
  function noise(t, dur, out, { vol = 0.2, hp = 6000, lp = 0 } = {}) {
    const s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    s.buffer = noiseBuf; f.type = "highpass"; f.frequency.value = hp;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = s.connect(f);
    if (lp) { const f2 = ctx.createBiquadFilter(); f2.type = "lowpass"; f2.frequency.value = lp; node = node.connect(f2); }
    node.connect(g).connect(out); s.start(t); s.stop(t + dur + 0.05);
  }

  // ---------- nhạc nền ----------
  const BPM = 100, EIGHTH = 60 / BPM / 2;
  // 8 ô nhịp × 8 móc đơn, "-" là nghỉ
  const MELODY = [
    "G4 - A4 C5 - A4 G4 -", "A4 - G4 F4 - D4 F4 -",
    "F4 G4 A4 - C5 - A4 G4", "G4 - - - D4 - F4 -",
    "C5 - D5 C5 - A4 G4 -", "A4 C5 - A4 G4 - F4 -",
    "F4 - G4 A4 - G4 F4 D4", "C4 - D4 F4 G4 - - -",
  ].join(" ").split(" ");
  const BASS = ["C3", "A2", "F2", "G2", "C3", "A2", "F2", "G2"];
  const CHORD = [["C4", "G4"], ["A3", "E4"], ["F3", "C4"], ["G3", "D4"]];

  function scheduleStep(i, t) {
    const bar = Math.floor(i / 8) % 8, beat = i % 8;
    const m = MELODY[i % 64];
    if (m !== "-") pluck(freq(m), t, 0.9, musicBus, 0.42);
    if (beat === 0 || beat === 4) {
      tone(freq(BASS[bar]), t, 0.5, musicBus, { type: "sine", vol: 0.5 });
      tone(120, t, 0.12, musicBus, { vol: 0.35, to: 45 }); // trống nhẹ
    }
    if (beat === 2 || beat === 6) CHORD[bar % 4].forEach((n) => pluck(freq(n), t, 0.5, musicBus, 0.12, false));
    if (beat % 2 === 1) noise(t, 0.05, musicBus, { vol: 0.06, hp: 7000 }); // tiếng lắc
  }
  function scheduler() {
    while (nextTime < ctx.currentTime + 0.25) {
      scheduleStep(step, nextTime);
      nextTime += EIGHTH; step++;
    }
  }
  function startMusic() {
    if (!ctx || playing) return;
    playing = true; step = 0; nextTime = ctx.currentTime + 0.1;
    schedTimer = setInterval(scheduler, 60);
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.setTargetAtTime(0.16, ctx.currentTime, 0.4);
  }
  function stopMusic() {
    if (!ctx || !playing) return;
    playing = false; clearInterval(schedTimer);
    musicBus.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
  }

  // ---------- hiệu ứng ----------
  const PENTA = ["C5", "D5", "F5", "G5", "A5", "C6", "D6", "F6"];
  const fx = {
    click() { tone(880, now(), 0.08, sfxBus, { vol: 0.25, to: 660 }); },
    hover() { tone(1400, now(), 0.04, sfxBus, { vol: 0.06 }); },
    place(i = 0) { pluck(freq(PENTA[i % PENTA.length]), now(), 0.35, sfxBus, 0.5); },
    remove() { tone(520, now(), 0.12, sfxBus, { vol: 0.25, to: 260 }); },
    clear() { noise(now(), 0.25, sfxBus, { vol: 0.25, hp: 1200, lp: 5000 }); tone(600, now(), 0.25, sfxBus, { vol: 0.15, to: 200 }); },
    hint() { ["C6", "E6", "G6", "C7"].forEach((n, k) => tone(freq(n), now() + k * 0.06, 0.3, sfxBus, { vol: 0.18 })); },
    correct() {
      const t = now();
      ["C5", "E5", "G5", "C6"].forEach((n, k) => pluck(freq(n), t + k * 0.08, 0.6, sfxBus, 0.55));
      ["C5", "E5", "G5"].forEach((n) => tone(freq(n), t + 0.34, 0.8, sfxBus, { type: "triangle", vol: 0.15, attack: 0.02 }));
      noise(t + 0.3, 0.6, sfxBus, { vol: 0.08, hp: 8000 });
    },
    wrong() {
      const t = now();
      tone(220, t, 0.18, sfxBus, { type: "square", vol: 0.12, to: 200 });
      tone(165, t + 0.16, 0.3, sfxBus, { type: "square", vol: 0.12, to: 140 });
    },
    tick() { tone(1500, now(), 0.03, sfxBus, { vol: 0.15 }); noise(now(), 0.02, sfxBus, { vol: 0.08, hp: 3000 }); },
    timeout() { tone(660, now(), 0.9, sfxBus, { type: "triangle", vol: 0.25, to: 110 }); },
    whoosh() { noise(now(), 0.3, sfxBus, { vol: 0.08, hp: 2500, lp: 8000 }); },
    fanfare() {
      const t = now();
      [["C5", 0], ["E5", 0.12], ["G5", 0.24], ["C6", 0.36], ["G5", 0.6], ["C6", 0.72]].forEach(([n, d]) =>
        pluck(freq(n), t + d, 0.7, sfxBus, 0.5));
      ["C4", "G4", "C5", "E5"].forEach((n) => tone(freq(n), t + 0.72, 1.4, sfxBus, { type: "triangle", vol: 0.12, attack: 0.03 }));
      noise(t + 0.7, 1, sfxBus, { vol: 0.07, hp: 9000 });
    },
  };
  const now = () => ctx.currentTime + 0.01;

  return {
    init,
    play(name, arg) { if (ctx && sfxOn && fx[name]) fx[name](arg); },
    get musicOn() { return musicOn; },
    get sfxOn() { return sfxOn; },
    toggleMusic() {
      musicOn = !musicOn; writePref("vtv_music", musicOn);
      init();
      if (musicOn) startMusic(); else stopMusic();
      return musicOn;
    },
    toggleSfx() {
      sfxOn = !sfxOn; writePref("vtv_sfx", sfxOn);
      init();
      if (sfxBus) sfxBus.gain.value = sfxOn ? 0.5 : 0;
      return sfxOn;
    },
  };
})();
