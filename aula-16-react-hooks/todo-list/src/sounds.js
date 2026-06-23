// Sons sintetizados com Web Audio API — sem arquivos externos.

let ctx;

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Navegadores suspendem o áudio até o primeiro gesto do usuário.
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  return ctx;
}

// Toca uma nota com envelope suave (sobe e desce o volume pra não estalar).
function playNote(freq, start, duration, { type = "sine", gain = 0.18 } = {}) {
  const audio = getCtx();
  const t0 = audio.currentTime + start;

  const osc = audio.createOscillator();
  const env = audio.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);

  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.connect(env).connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

// Toca uma sequência de notas (arpejo).
function playSequence(notes, { type = "sine", gain = 0.18, step = 0.08 } = {}) {
  notes.forEach((freq, i) => {
    playNote(freq, i * step, step * 1.8, { type, gain });
  });
}

// Notas (Hz)
const C5 = 523.25;
const E5 = 659.25;
const G5 = 783.99;
const C6 = 1046.5;
const A4 = 440.0;
const F4 = 349.23;
const D4 = 293.66;

// Criar tarefa — arpejo alegre ascendente
export function playAdd() {
  playSequence([C5, E5, G5, C6], { type: "triangle", gain: 0.2, step: 0.07 });
}

// Marcar/desmarcar — "ding" cristalino
export function playToggle() {
  playNote(G5, 0, 0.18, { type: "sine", gain: 0.22 });
  playNote(C6, 0.05, 0.22, { type: "sine", gain: 0.16 });
}

// Limpar tudo — varredura descendente
export function playClear() {
  playSequence([A4, F4, D4], { type: "sawtooth", gain: 0.14, step: 0.06 });
}

// Editar — clique curto e seco
export function playEdit() {
  playNote(E5, 0, 0.1, { type: "square", gain: 0.1 });
}

// Hover de botão — toque sutil
export function playHover() {
  playNote(C6, 0, 0.06, { type: "sine", gain: 0.06 });
}

// Clique genérico de botão
export function playClick() {
  playNote(A4, 0, 0.08, { type: "triangle", gain: 0.12 });
}
