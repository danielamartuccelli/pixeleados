/* ===========================================================
   audio.js — música PROCEDURAL (WebAudio), sin archivos de audio.
   No se usan canciones reales (derechos de autor): son composiciones
   originales "con el aire" de cada estilo que pidieron:
     lofi      -> tipo Luv(sic) de Nujabes (jazzy, tranquilo)
     reggaeton -> casa de Daniela (dembow)
     hiphop    -> casa de Sebas (boom-bap, onda Mac Miller)
     rock      -> Parque Kennedy (pop-punk, onda Olivia Rodrigo)
     urbano    -> El Pollo Pier (trap latino oscuro)
     salsa     -> Academia Saoco (clave, montuno, charanga)
     habanera / charanga -> canciones fácil / difícil del baile de Saoco
   =========================================================== */
(function () {
  const G = window.G;
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  const STYLES = {
    lofi: { bpm: 76, swing: 0.16, wave: 'triangle', pad: 0.09, bassW: 'sine',
      chords: [[57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65], [52, 55, 59, 64]], roots: [45, 41, 43, 40],
      kick: [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0], snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], hat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,1],
      bass: [1,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,0], melody: true, vinyl: true },
    reggaeton: { bpm: 92, swing: 0, wave: 'square', pad: 0.035, bassW: 'sine',
      chords: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]], roots: [45, 41, 36, 43],
      kick: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0], snare: [0,0,0,1, 0,0,1,0, 0,0,0,1, 0,0,1,0], hat: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
      bass: [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0], stab: [0,0,0,1, 0,0,1,0, 0,0,0,1, 0,0,1,0], melody: true },
    hiphop: { bpm: 86, swing: 0.2, wave: 'triangle', pad: 0.1, bassW: 'sine',
      chords: [[60, 63, 67, 70], [56, 60, 63, 67], [58, 62, 65, 69], [55, 58, 62, 65]], roots: [48, 44, 46, 43],
      kick: [1,0,0,0, 0,0,0,1, 0,0,1,0, 0,0,0,0], snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1], hat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
      bass: [1,0,0,0, 0,0,0,1, 0,0,1,0, 0,0,0,0], melody: true, vinyl: true },
    rock: { bpm: 128, swing: 0, wave: 'sawtooth', pad: 0.05, bassW: 'sawtooth',
      chords: [[48, 55, 60], [55, 62, 67], [57, 64, 69], [53, 60, 65]], roots: [36, 43, 45, 41],
      kick: [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0], snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], hat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
      bass: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0], stab: [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0], lp: 1800 },
    urbano: { bpm: 100, swing: 0, wave: 'sawtooth', pad: 0.03, bassW: 'sine',
      chords: [[57, 60, 64], [57, 60, 64], [53, 57, 60], [55, 59, 62]], roots: [33, 33, 29, 31],
      kick: [1,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,0,1], snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], hat: [1,1,1,1, 1,0,1,1, 1,1,1,1, 1,0,1,1],
      bass: [1,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,0,1], long808: true, lp: 1200, melody: true },
    salsa: { bpm: 100, swing: 0, wave: 'triangle', pad: 0.05, bassW: 'sine',
      chords: [[57, 60, 64, 67], [62, 65, 69, 72], [55, 59, 62, 65], [60, 64, 67, 71]], roots: [45, 50, 43, 48],
      kick: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], snare: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], hat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
      clave: [1,0,0,1, 0,0,1,0, 0,0,1,0, 1,0,0,0], conga: [0,0,0,0, 1,0,1,1, 0,0,0,0, 1,0,1,1],
      bass: [0,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,1], montuno: true, melody: true },
    /* más ritmos (DJ del igloo y canciones de Saoco) */
    salsaRomantica: { bpm: 90, swing: 0.04, wave: 'triangle', pad: 0.06, bassW: 'sine',
      chords: [[57, 60, 64, 67], [53, 57, 60, 64], [62, 65, 69, 72], [55, 59, 62, 65]], roots: [45, 41, 50, 43],
      kick: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], snare: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], hat: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
      clave: [1,0,0,1, 0,0,1,0, 0,0,1,0, 1,0,0,0], conga: [0,0,0,0, 1,0,1,1, 0,0,0,0, 1,0,1,1],
      bass: [0,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,1], montuno: true, melody: true },
    timba: { bpm: 124, swing: 0, wave: 'square', pad: 0.035, bassW: 'sine',
      chords: [[57, 60, 64, 67], [55, 59, 62, 65], [53, 57, 60, 64], [55, 59, 62, 65]], roots: [45, 43, 41, 43],
      kick: [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0], snare: [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0], hat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
      clave: [1,0,0,1, 0,0,1,0, 0,0,1,0, 1,0,0,0], conga: [0,0,1,0, 1,0,1,1, 0,0,1,0, 1,0,1,1],
      bass: [1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,0,1], montuno: true, melody: true, lp: 3200 },
    electro: { bpm: 124, swing: 0, wave: 'sawtooth', pad: 0.03, bassW: 'sawtooth',
      chords: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]], roots: [33, 29, 36, 31],
      kick: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0], snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], hat: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
      bass: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,1], stab: [1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,0,1], melody: true, lp: 2400 },
    latinpop: { bpm: 104, swing: 0, wave: 'triangle', pad: 0.06, bassW: 'sine',
      chords: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]], roots: [45, 41, 36, 43],
      kick: [1,0,0,0, 0,0,0,0, 1,0,0,1, 0,0,0,0], snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], hat: [1,0,1,1, 1,0,1,0, 1,0,1,1, 1,0,1,0],
      clave: [0,0,0,1, 0,0,1,0, 0,0,0,1, 0,0,1,0], bass: [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0], stab: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0], melody: true },
    /* dojo: pentatónica mayor (sonido chino/oriental), cuerdas pulsadas, tambor taiko y gong */
    oriental: { bpm: 90, swing: 0, wave: 'triangle', pad: 0.04, bassW: 'sine', scale: [0, 2, 4, 7, 9, 12, 14, 16], pluck: [1,0,0,1, 0,0,1,0, 1,0,0,0, 1,0,1,0], gong: true,
      chords: [[57, 64, 69], [55, 62, 67], [52, 59, 64], [55, 62, 67]], roots: [45, 43, 40, 43],
      kick: [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0], snare: [0,0,0,0, 0,0,0,0, 0,0,0,0, 1,0,0,0], hat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
      clave: [0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,0,0], bass: [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0], melody: true },
    /* cocina de Daniela: ¡acelerada! */
    rapido: { bpm: 152, swing: 0, wave: 'square', pad: 0.03, bassW: 'sawtooth', mel: 0.8,
      chords: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]], roots: [45, 41, 36, 43],
      kick: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,1], snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,1,0], hat: [1,0,1,1, 1,0,1,1, 1,0,1,1, 1,0,1,1],
      clave: [0,0,0,1, 0,0,1,0, 0,0,0,1, 0,0,1,0], bass: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,1], stab: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0], melody: true },

    /* ---- una canción distinta para cada lugar, según su mood ---- */
    indie: { bpm: 98, swing: 0.05, wave: 'triangle', pad: 0.06, bassW: 'sine', scale: [0, 2, 4, 7, 9, 12, 14], mel: 0.7,
      chords: [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]], roots: [48, 43, 45, 41],
      kick: [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,0,0], snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], hat: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
      bass: [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,0,1], stab: [0,0,1,0, 0,0,0,1, 0,0,1,0, 0,0,0,0], melody: true },
    surf: { bpm: 138, swing: 0, wave: 'sawtooth', pad: 0.03, bassW: 'sawtooth', scale: [0, 1, 4, 5, 7, 8, 11], mel: 0.9, lp: 2200,
      chords: [[52, 55, 59], [48, 52, 55], [50, 54, 57], [47, 51, 54]], roots: [40, 36, 38, 35],
      kick: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0], snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,1,0], hat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
      bass: [1,0,1,1, 1,0,1,1, 1,0,1,1, 1,0,1,1], melody: true },
    bossa: { bpm: 84, swing: 0.1, wave: 'triangle', pad: 0.07, bassW: 'sine', scale: [0, 2, 4, 7, 9, 11, 12], mel: 0.6,
      chords: [[60, 64, 67, 71], [57, 60, 64, 67], [62, 65, 69, 72], [55, 59, 62, 65]], roots: [48, 45, 50, 43],
      kick: [1,0,0,1, 0,0,1,0, 0,0,1,0, 0,1,0,0], snare: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], hat: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
      clave: [1,0,0,1, 0,0,1,0, 0,0,1,0, 0,1,0,0], bass: [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0], melody: true },
    noche: { bpm: 62, swing: 0, wave: 'sine', pad: 0.11, bassW: 'sine', scale: [0, 2, 4, 7, 9, 12, 14, 16], mel: 0.4,
      chords: [[57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65], [52, 56, 59, 64]], roots: [45, 41, 43, 40],
      kick: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], snare: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], hat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
      bass: [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], melody: true },
    cuento: { bpm: 78, swing: 0, wave: 'triangle', pad: 0.05, bassW: 'sine', scale: [0, 2, 4, 7, 9, 12, 14, 16], pluck: [1,0,1,0, 0,1,0,1, 1,0,0,1, 0,0,1,0],
      chords: [[60, 64, 67], [65, 69, 72], [67, 71, 74], [60, 64, 67]], roots: [48, 53, 43, 48],
      kick: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], snare: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], hat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
      bass: [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0], melody: true },
    cafe: { bpm: 108, swing: 0.3, wave: 'triangle', pad: 0.06, bassW: 'sine', scale: [0, 2, 3, 5, 7, 9, 10, 12], mel: 0.65,
      chords: [[62, 65, 69, 72], [55, 59, 62, 65], [60, 64, 67, 71], [57, 61, 64, 67]], roots: [50, 43, 48, 45],
      kick: [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0], snare: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], hat: [1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,0,1],
      bass: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0], melody: true },
    /* canciones del baile de Saoco: fácil = habanera (lenta), normal = salsa, difícil = charanga (rápida) */
    habanera: { bpm: 88, swing: 0.06, wave: 'triangle', pad: 0.05, bassW: 'sine',
      chords: [[57, 60, 64], [53, 57, 60], [55, 59, 62], [57, 60, 64]], roots: [45, 41, 43, 45],
      kick: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], snare: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], hat: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
      clave: [1,0,0,1, 0,0,1,0, 0,0,0,0, 0,0,0,0], conga: [0,0,0,0, 1,0,1,0, 0,0,0,0, 1,0,1,0],
      bass: [1,0,0,1, 1,0,0,0, 1,0,0,1, 1,0,0,0], melody: true },
    charanga: { bpm: 116, swing: 0, wave: 'sine', pad: 0.045, bassW: 'sine',
      chords: [[60, 64, 67, 71], [65, 69, 72, 76], [67, 71, 74, 77], [60, 64, 67, 71]], roots: [48, 53, 43, 48],
      kick: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], snare: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], hat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
      clave: [1,0,0,1, 0,0,1,0, 0,0,1,0, 1,0,0,0], conga: [0,0,1,0, 1,0,1,1, 0,0,1,0, 1,0,1,1],
      bass: [1,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,1], montuno: true, melody: true }
  };

  /* ===================== v1.6 — MELODÍAS NUEVAS DE SAOCO =====================
     Seis canciones ORIGINALES (compuestas para el juego, no son canciones reales) que ya NO salen de la misma base
     de siempre (La menor – Fa – Do – Sol con melodía al azar). Cada una tiene su propia tonalidad, su progresión de
     acordes, su ritmo (son, bolero, cumbia, bachata, mambo, merengue) y una MELODÍA ESCRITA nota por nota (8 compases).
     La melodía va en `lead`: un texto por compás con 16 casillas (semicorcheas); "." = la nota anterior sigue sonando.
     `bassN` = bajo con notas (semitonos sobre la raíz del acorde); `arp` = guitarra arpegiada; guiro/bongo/cowbell = percusión. */
  const Z = () => [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], _ = null;
  Object.assign(STYLES, {
    sonMalecon: { bpm: 96, swing: 0.03, wave: 'triangle', pad: 0.04, bassW: 'sine', leadW: 'triangle', leadVol: 0.11, leadLp: 3400, arp: true,     // Re mayor · I–IV–V–I
      chords: [[62, 66, 69], [59, 62, 67], [57, 61, 64, 67], [62, 66, 69]], roots: [50, 43, 45, 50],
      kick: Z(), snare: Z(), hat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0], bass: Z(), bassN: [0,_,_,_, _,_,7,_, _,_,_,_, 12,_,_,_],
      clave: [1,0,0,1, 0,0,1,0, 0,0,1,0, 1,0,0,0], bongo: [1,0,2,0, 1,0,2,0, 1,0,2,0, 1,0,2,2],
      lead: ['F#5 . A5 . . D6 . . B5 . A5 . F#5 . . .', 'G5 . B5 . . D6 . . B5 . G5 . E5 . . .', 'E5 . G5 . . C#6 . . B5 . A5 . G5 . E5 .', 'F#5 . . D5 . . F#5 . A5 . . . . . . .',
             'D6 . . A5 . . F#5 . A5 . D6 . . . C#6 .', 'B5 . . G5 . . B5 . D6 . . . B5 . G5 .', 'A5 . C#6 . E6 . . C#6 . . A5 . G5 . E5 .', 'D5 . . . F#5 . A5 . D6 . . . . . . .'] },
    boleroLuna: { bpm: 84, swing: 0.05, wave: 'sine', pad: 0.075, bassW: 'sine', leadW: 'sine', leadVol: 0.13, leadLp: 2600, leadMax: 8, arp: true,   // Mi menor · 8 acordes distintos
      chords: [[64, 67, 71], [57, 60, 64], [62, 66, 69, 72], [59, 62, 67], [60, 64, 67], [57, 60, 64], [59, 63, 66, 69], [64, 67, 71]], roots: [40, 45, 38, 43, 48, 45, 47, 40],
      kick: Z(), snare: Z(), hat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0], bass: Z(), bassN: [0,_,_,_, _,_,_,_, 7,_,_,_, 0,_,_,_],
      bongo: [1,0,0,0, 2,0,1,0, 1,0,0,0, 2,0,1,1],
      lead: ['B5 . . . . . G5 . E5 . . . . . F#5 .', 'A5 . . . . . E5 . C6 . . . B5 . A5 .', 'F#5 . . . . . A5 . C6 . . . . . B5 .', 'B5 . . . . . . . D5 . G5 . B5 . . .',
             'E6 . . . . . C6 . G5 . . . . . A5 .', 'C6 . . . . . A5 . E5 . . . G5 . F#5 .', 'D#5 . . . F#5 . . . A5 . . . B5 . . .', 'E5 . . . . . . . . . . . . . . .'] },
    cumbiaGarua: { bpm: 96, swing: 0, wave: 'triangle', pad: 0.035, bassW: 'sine', leadW: 'square', leadVol: 0.05, leadLp: 2300,                       // Sol menor (armónica) · acordeón
      chords: [[55, 58, 62], [55, 58, 62], [54, 57, 60, 62], [54, 57, 60, 62], [55, 60, 63], [55, 58, 62], [54, 57, 60, 62], [55, 58, 62]], roots: [43, 43, 38, 38, 36, 43, 38, 43],
      kick: [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0], snare: Z(), hat: Z(), bass: Z(), bassN: [0,_,_,_, _,_,_,_, 7,_,_,_, 7,_,_,_],
      guiro: [2,0,1,1, 2,0,1,1, 2,0,1,1, 2,0,1,1], conga: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,1,0], stab: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
      lead: ['D5 . G5 . Bb5 . A5 G5 . . D5 . G5 . . .', 'Bb5 . A5 . G5 . F#5 G5 . . . . D5 . . .', 'C5 . F#5 . A5 . G5 F#5 . . D5 . F#5 . . .', 'A5 . G5 . F#5 . Eb5 D5 . . . . . . . .',
             'Eb5 . G5 . C6 . Bb5 G5 . . Eb5 . G5 . . .', 'D6 . Bb5 . G5 . A5 Bb5 . . . . G5 . . .', 'A5 . C6 . A5 . F#5 A5 . . D5 . F#5 . A5 .', 'G5 . . . Bb5 . . G5 . . D5 . G5 . . .'] },
    bachataParque: { bpm: 120, swing: 0, wave: 'triangle', pad: 0.03, bassW: 'sine', leadW: 'triangle', leadVol: 0.1, leadLp: 3800, leadMax: 3, arp: true,   // Si menor · requinto
      chords: [[59, 62, 66], [59, 64, 67], [58, 61, 64, 66], [59, 62, 66], [62, 66, 69], [57, 61, 64], [59, 64, 67], [58, 61, 64, 66]], roots: [47, 40, 42, 47, 50, 45, 40, 42],
      kick: Z(), snare: Z(), hat: Z(), bass: Z(), bassN: [0,_,_,_, 0,_,_,_, 7,_,_,_, 12,_,_,_],
      guiro: [1,0,1,1, 1,0,1,1, 1,0,1,1, 1,0,1,1], bongo: [1,0,2,0, 1,0,2,0, 1,0,2,0, 1,0,2,2],
      lead: ['B4 D5 F#5 B5 . F#5 D5 F#5 B5 . . . D6 . C#6 .', 'B5 . G5 . E5 G5 B5 E6 . . . . D6 . B5 .', 'A#5 . C#6 . E6 . C#6 A#5 . . F#5 . A#5 . C#6 .', 'B5 . . . F#5 . D5 . B4 . . . . . . .',
             'A5 . F#5 . D5 F#5 A5 D6 . . . . F#6 . E6 .', 'C#6 . A5 . E5 A5 C#6 E6 . . . . C#6 . A5 .', 'G5 . B5 . E6 . . D6 . . B5 . G5 . E5 .', 'F#5 . A#5 . C#6 . E6 . . . C#6 . A#5 . . .'] },
    mamboCcellis: { bpm: 112, swing: 0, wave: 'triangle', pad: 0.03, bassW: 'sine', leadW: 'sawtooth', leadVol: 0.06, leadLp: 2600, leadOct: true, leadMax: 3,   // Fa mayor · metales
      chords: [[60, 62, 65, 69], [60, 62, 65, 69], [58, 60, 64, 67], [58, 60, 64, 67]], roots: [41, 41, 36, 36],
      kick: [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0], snare: Z(), hat: Z(), bass: Z(), bassN: [0,_,_,_, _,_,7,_, _,_,_,_, 12,_,10,_],
      clave: [0,0,1,0, 1,0,0,0, 1,0,0,1, 0,0,1,0], cowbell: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0], conga: [0,0,1,0, 1,0,1,1, 0,0,1,0, 1,0,1,1], stab: [0,0,0,1, 0,0,1,0, 0,0,0,1, 0,0,1,0],
      lead: ['F5 . . F5 . A5 . C6 . . . . A5 . C6 .', 'D6 . . C6 . A5 . . . . . . . . . .', 'E5 . . E5 . G5 . Bb5 . . . . G5 . Bb5 .', 'C6 . . Bb5 . G5 . . . . . . C5 D5 E5 .',
             'F5 . A5 . C6 . . F6 . . D6 . C6 . A5 .', 'C6 . . . . . A5 . C6 . . . . . . .', 'Bb5 . G5 . E5 . . Bb5 . . G5 . E5 . C5 .', 'E5 . G5 . Bb5 . C6 . . . . . . . . .'] },
    merengueRayo: { bpm: 132, swing: 0, wave: 'triangle', pad: 0.025, bassW: 'sine', leadW: 'square', leadVol: 0.045, leadLp: 3000, leadMax: 3, arp: true,   // La mayor · saxo de merengue
      chords: [[57, 61, 64], [57, 61, 64], [56, 59, 62, 64], [56, 59, 62, 64], [56, 59, 62, 64], [56, 59, 62, 64], [57, 61, 64], [57, 61, 64]], roots: [45, 45, 40, 40, 40, 40, 45, 45],
      kick: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0], snare: Z(), hat: Z(), bass: Z(), bassN: [0,_,_,_, 7,_,_,_, 0,_,_,_, 7,_,_,_],
      guiro: [2,1,1,1, 2,1,1,1, 2,1,1,1, 2,1,1,1], conga: [0,0,1,1, 0,0,1,0, 0,0,1,1, 0,0,1,0],
      lead: ['A5 C#6 E6 C#6 A5 C#6 E6 C#6 A5 . E5 . A5 . . .', 'C#6 . . A5 . . E5 . A5 . C#6 . E6 . . .', 'G#5 B5 D6 B5 G#5 B5 D6 B5 G#5 . E5 . G#5 . . .', 'B5 . . G#5 . . E5 . G#5 . B5 . D6 . . .',
             'E6 . D6 . B5 . G#5 . B5 . D6 . E6 . . .', 'D6 . B5 . G#5 . E5 . G#5 . . . . . . .', 'E6 . C#6 . A5 . E5 . A5 . C#6 . E6 . . .', 'A5 . . . C#6 . E6 . A6 . . . . . . .'] }
  });
  /* "F#5" -> número MIDI; y cada compás de texto -> 16 casillas {m, len} (len = cuántas casillas dura la nota) */
  const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const midiOf = n => { const m = /^([A-G])(#|b)?(-?\d)$/.exec(n); return m ? 12 * (+m[3] + 1) + PC[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) : null; };
  Object.keys(STYLES).forEach(k => {
    const S = STYLES[k]; if (!S.lead) return;
    const flat = []; S.lead.forEach(bar => { const tk = bar.trim().split(/\s+/); for (let i = 0; i < 16; i++) flat.push(midiOf(tk[i] || '.')); });
    const mx = S.leadMax || 6;
    S.leadN = flat.map((m, i) => { if (m === null) return null; let len = 1; while (len < mx && flat[(i + len) % flat.length] === null) len++; return { m, len }; });
  });

  /* ajustes del set de DJ (casa de Sebas): velocidad, tono y filtro. Cualquier cambio de lugar los devuelve a lo normal. */
  const mods = { tempo: 1, key: 0, filter: 1 };
  let fxFilter = null;
  let live = new Set(), ctx = null, master = null, bus = null, noiseBuf = null, timer = null, style = null, step = 0, nextT = 0, started = false, lastId = 0;

  function init() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ctx = new AC();
    // se anotan todos los osciladores/ruidos vivos para poder cortarlos de golpe al cambiar de lugar (nada de la canción anterior se alcanza a oír)
    ['createOscillator', 'createBufferSource'].forEach(nm => { const f = ctx[nm].bind(ctx); ctx[nm] = function () { const n = f(); live.add(n); n.addEventListener('ended', () => live.delete(n)); return n; }; });
    master = ctx.createGain(); master.gain.value = 0; fxFilter = ctx.createBiquadFilter(); fxFilter.type = 'lowpass'; fxFilter.frequency.value = 20000; fxFilter.Q.value = 0.7; master.connect(fxFilter); fxFilter.connect(ctx.destination);
    bus = ctx.createGain(); bus.connect(master);   // bus de la canción actual: al cambiar de lugar se apaga el anterior (sin solapes)
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  function env(g, t, a, d, peak, end) {
    g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }
  function tone(t, freq, dur, type, vol, lp, a) {
    const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = type; o.frequency.value = freq; f.type = 'lowpass'; f.frequency.value = lp || 2400;
    env(g, t, a || 0.01, dur, vol); o.connect(f); f.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + (a || 0.01) + 0.05);
  }
  function noise(t, dur, vol, hp, type) {
    const s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    s.buffer = noiseBuf; f.type = type || 'highpass'; f.frequency.value = hp; env(g, t, 0.002, dur, vol);
    s.connect(f); f.connect(g); g.connect(bus); s.start(t); s.stop(t + dur + 0.05);
  }
  function kick(t, vol) { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.12); env(g, t, 0.002, 0.16, vol); o.connect(g); g.connect(bus); o.start(t); o.stop(t + 0.25); }
  function snare(t, vol) { noise(t, 0.12, vol, 1800); tone(t, 190, 0.07, 'triangle', vol * 0.6); }
  function sweep(t, f0, f1, dur, vol, type) { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.6); env(g, t, 0.004, dur, vol); o.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + 0.05); }

  const SCALE = [0, 3, 5, 7, 10, 12, 15];   // pentatónica menor (melodía)

  function playStep(S, n, t) {
    const bar = Math.floor(n / 16) % S.chords.length, k = n % 16, tr = mods.key || 0, ch = S.chords[bar].map(m => m + tr), root = S.roots[bar] + tr, sd = 60 / (S.bpm * mods.tempo) / 4;
    const sw = (k % 2 === 1) ? S.swing * sd : 0; t += sw;
    const lp = S.lp || 2600;
    if (k === 0 && S.pad) ch.forEach((m, i) => tone(t, mtof(m), sd * 4 * 3.6, S.wave, S.pad, lp, 0.25));
    if (S.stab && S.stab[k]) ch.forEach(m => tone(t, mtof(m + 12), 0.14, S.wave === 'sawtooth' ? 'sawtooth' : 'square', S.wave === 'sawtooth' ? 0.05 : 0.03, lp));
    if (S.kick[k]) kick(t, 0.55);
    if (S.snare[k]) snare(t, 0.22);
    if (S.hat[k]) noise(t, 0.03, 0.06, 7000);
    if (S.clave && S.clave[k]) tone(t, 2300, 0.05, 'square', 0.05, 6000);
    if (S.conga && S.conga[k]) sweep(t, 330, 220, 0.12, 0.2, 'sine');
    if (S.bass[k]) {
      if (S.long808) sweep(t, mtof(root), mtof(root) * 0.98, 0.5, 0.45, 'sine');
      else tone(t, mtof(root), 0.28, S.bassW, S.bassW === 'sawtooth' ? 0.12 : 0.32, 700);
    }
    if (S.montuno && k % 2 === 0) { const m = ch[(k / 2) % ch.length] + 12; tone(t, mtof(m), 0.16, 'triangle', 0.09, 3000); }
    if (S.gong && k === 0 && bar % 2 === 0) { tone(t, 98, 1.6, 'sine', 0.14, 900, 0.01); tone(t, 147, 1.2, 'sine', 0.06, 1200, 0.01); }
    if (S.pluck && S.pluck[k]) { const sc = S.scale || SCALE, m = root + 36 + sc[(bar * 3 + k) % sc.length]; tone(t, mtof(m), 0.22, 'sawtooth', 0.035, 1800, 0.004); if (k % 8 === 0) tone(t, mtof(m + 12), 0.3, 'sine', 0.04, 3000, 0.004); }
    // --- v1.6: melodía escrita, bajo con notas, arpegio de guitarra y percusión latina extra ---
    if (S.leadN) { const L = S.leadN[n % S.leadN.length]; if (L) { const d = L.len * sd * 0.92, w = S.leadW || 'triangle'; tone(t, mtof(L.m + tr), d, w, S.leadVol || 0.1, S.leadLp || 3200, 0.012); if (S.leadOct) tone(t, mtof(L.m + tr - 12), d, w, (S.leadVol || 0.1) * 0.55, 1800, 0.012); } }
    if (S.bassN && S.bassN[k] !== null && S.bassN[k] !== undefined) tone(t, mtof(root + S.bassN[k]), 0.3, S.bassW, 0.3, 700);
    if (S.arp && k % 2 === 0) { const m = ch[[0, 1, 2, 1][(k / 2) % 4] % ch.length] + 12; tone(t, mtof(m), 0.2, 'triangle', 0.055, 2800, 0.004); }
    if (S.guiro && S.guiro[k]) noise(t, S.guiro[k] === 2 ? 0.09 : 0.03, S.guiro[k] === 2 ? 0.07 : 0.045, 5200);
    if (S.cowbell && S.cowbell[k]) { tone(t, 800, 0.07, 'square', 0.045, 5000); tone(t, 540, 0.07, 'square', 0.03, 5000); }
    if (S.bongo && S.bongo[k]) { if (S.bongo[k] === 1) sweep(t, 560, 430, 0.07, 0.13, 'sine'); else sweep(t, 360, 250, 0.1, 0.15, 'sine'); }
    if (S.melody && (k === 0 || k === 6 || k === 10 || k === 14) && Math.random() < (S.mel || 0.55)) {
      const sc = S.scale || SCALE, m = root + 24 + sc[Math.floor(Math.random() * sc.length)];
      tone(t, mtof(m), 0.35, S.wave === 'sawtooth' ? 'triangle' : 'sine', 0.07, 2200, 0.02);
    }
  }

  function startLoop() {
    if (timer) return;
    nextT = ctx.currentTime + 0.1; step = 0;
    timer = setInterval(() => {
      if (!ctx) return;
      const S = STYLES[style] || STYLES.lofi, dt = 60 / (S.bpm * mods.tempo) / 4, on = G.state.settings.music && !!style;   // sin estilo = silencio (no hay música "de fondo" automática)
      // pestaña en segundo plano: el navegador frena el temporizador; en vez de soltar de golpe todas las notas atrasadas (se oía "traspapelado"), se salta lo que ya pasó
      if (nextT < ctx.currentTime - 0.1) { const n = Math.ceil((ctx.currentTime - nextT) / dt); nextT += n * dt; step += n; }
      // el reloj avanza aunque la música esté apagada (los juegos de ritmo dependen de él); solo se oye si está encendida
      while (nextT < ctx.currentTime + 0.25) { if (on) { try { playStep(S, step, nextT); } catch (e) { console.warn('audio', e); } } nextT += dt; step++; }
    }, 40);
  }

  function applyVol() {
    if (!master) return;
    const on = G.state.settings.music, v = on ? G.state.settings.vol * 0.55 : 0;
    master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(v, ctx.currentTime, 0.15);
  }

  G.audio = {
    /* llamar tras un click del usuario (los navegadores lo exigen) */
    start() { init(); if (!ctx) return; if (ctx.state === 'suspended') ctx.resume(); started = true; startLoop(); applyVol(); },
    setStyle(s, keepDj) {
      if (!keepDj) this.dj({ tempo: 1, key: 0, filter: 1 });     // salir del set de DJ = música normal (los juegos de ritmo dependen del tempo real)
      if ((s && !STYLES[s]) || s === style) return; style = s || null; step = 0;
      if (ctx && bus) {   // CORTE LIMPIO: lo que sonaba del lugar anterior se silencia al instante (notas largas y ya programadas incluidas)
        const old = bus, t = ctx.currentTime; old.gain.cancelScheduledValues(t); old.gain.setValueAtTime(0, t);
        live.forEach(n => { try { n.stop(); } catch (e) { } }); live.clear();
        setTimeout(() => { try { old.disconnect(); } catch (e) { } }, 150);
        bus = ctx.createGain(); bus.connect(master); nextT = t + 0.12;
      }
    },
    refresh: applyVol,
    /* posición actual de la música en "pasos" (semicorcheas). null si el audio no está corriendo. */
    clock() {
      if (!ctx || ctx.state !== 'running' || !timer) return null;
      const S = STYLES[style] || STYLES.lofi, dt = 60 / (S.bpm * mods.tempo) / 4;
      return { step: step - (nextT - ctx.currentTime) / dt - (ctx.outputLatency || 0) / dt, dt, bpm: S.bpm };
    },
    bpmOf(st) { return (STYLES[st] || STYLES.lofi).bpm; },
    has(st) { return !!STYLES[st]; },
    /* set de DJ: tempo 0.75–1.3, tono −5…+5 semitonos, filtro 0…1 (1 = abierto) */
    dj(o) {
      if (o.tempo !== undefined) mods.tempo = Math.max(0.75, Math.min(1.3, +o.tempo || 1));
      if (o.key !== undefined) mods.key = Math.max(-5, Math.min(5, Math.round(+o.key || 0)));
      if (o.filter !== undefined) { mods.filter = Math.max(0, Math.min(1, +o.filter)); if (fxFilter && ctx) fxFilter.frequency.setTargetAtTime(220 * Math.pow(20000 / 220, mods.filter), ctx.currentTime, 0.05); }
      return Object.assign({}, mods);
    },
    get mods() { return Object.assign({}, mods); },
    /* nivel aproximado del compás (0–1) para luces y ecualizador: sube en cada golpe */
    pulse() { if (!ctx || !style || !G.state.settings.music) return 0; const S = STYLES[style], dt = 60 / (S.bpm * mods.tempo) / 4, p = (step - (nextT - ctx.currentTime) / dt) % 4; return Math.max(0, 1 - ((p + 4) % 4) / 2.2); },
    /* efectos del DJ (botones): suenan encima de la canción */
    pad(kind) {
      if (!ctx || !G.state.settings.music) return; const t = ctx.currentTime + 0.01;
      if (kind === 'corneta') { [0, 0.16, 0.32].forEach((d, i) => { [466, 587, 698].forEach(f => tone(t + d, f, i === 2 ? 0.55 : 0.11, 'sawtooth', 0.07, 2600, 0.01)); }); }
      else if (kind === 'scratch') { sweep(t, 1400, 260, 0.11, 0.12, 'sawtooth'); sweep(t + 0.12, 300, 1500, 0.1, 0.12, 'sawtooth'); sweep(t + 0.24, 1200, 200, 0.14, 0.12, 'sawtooth'); noise(t, 0.3, 0.05, 2500); }
      else if (kind === 'palmas') { [0, 0.012, 0.026].forEach(d => noise(t + d, 0.07, 0.2, 1100, 'bandpass')); }
      else if (kind === 'redoble') { for (let i = 0; i < 8; i++) sweep(t + i * 0.055, 330 - i * 14, 200 - i * 8, 0.08, 0.16 + i * 0.012, 'sine'); kick(t + 0.46, 0.6); noise(t + 0.46, 0.35, 0.12, 5000); }
      else if (kind === 'laser') { sweep(t, 2400, 180, 0.32, 0.1, 'square'); }
      else if (kind === 'subida') { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(180, t); o.frequency.exponentialRampToValueAtTime(1800, t + 1.1); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.09, t + 1.0); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.15); o.connect(g); g.connect(bus); o.start(t); o.stop(t + 1.2); noise(t + 1.1, 0.4, 0.14, 4000); kick(t + 1.12, 0.7); }
      else if (kind === 'campana') { tone(t, 1568, 0.5, 'sine', 0.09, 6000, 0.004); tone(t, 2093, 0.4, 'sine', 0.05, 7000, 0.004); }
      else if (kind === 'beso') { sweep(t, 900, 1900, 0.09, 0.09, 'sine'); tone(t + 0.1, 1318, 0.14, 'triangle', 0.07); tone(t + 0.2, 1760, 0.2, 'triangle', 0.07); }
    },
    get style() { return style; },
    sfx(kind) {            // sonidos cortos de interfaz
      if (!ctx || !G.state.settings.music) return;
      const t = ctx.currentTime;
      if (kind === 'click') tone(t, 660, 0.06, 'square', 0.05, 3000);
      else if (kind === 'ok') { tone(t, 523, 0.08, 'square', 0.05, 3000); tone(t + 0.08, 784, 0.12, 'square', 0.05, 3000); }
      else if (kind === 'coin') { tone(t, 988, 0.06, 'square', 0.05, 3000); tone(t + 0.06, 1318, 0.12, 'square', 0.05, 3000); }
      else if (kind === 'pop') sweep(t, 400, 900, 0.1, 0.08, 'sine');
      else if (kind === 'hit') { sweep(t, 320, 80, 0.2, 0.1, 'square'); }
      else if (kind === 'win') { [523, 659, 784, 1046].forEach((f, i) => tone(t + i * 0.1, f, 0.16, 'triangle', 0.08)); }
      else if (kind === 'heart') { tone(t, 784, 0.1, 'triangle', 0.08); tone(t + 0.1, 1046, 0.18, 'triangle', 0.08); }
    }
  };
  G.bus.on('settings', () => G.audio.refresh());
})();
