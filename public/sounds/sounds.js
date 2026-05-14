/**
 * sounds.js — Synthèse de sonneries d'alerte pour la caisse Trouba.
 * Pas de fichiers .mp3 : tout est généré via Web Audio API (zéro download).
 *
 * Usage :
 *   import { playSound, SOUND_LIST } from '/sounds/sounds.js';
 *   playSound('bell');
 *
 * Ou en script global :
 *   <script src="/sounds/sounds.js"></script>
 *   window.TroubaSounds.play('bell');
 */
(function (global) {
  'use strict';

  var ctx = null;

  function ensureCtx() {
    if (!ctx) {
      try {
        var AC = global.AudioContext || global.webkitAudioContext;
        if (AC) ctx = new AC();
      } catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === 'suspended') {
      try { ctx.resume(); } catch (e) {}
    }
    return ctx;
  }

  // Helper : enveloppe ADSR simple sur un oscillateur.
  function tone(opts) {
    var c = ensureCtx();
    if (!c) return;
    var t0 = (opts.startAt != null) ? opts.startAt : c.currentTime;
    var freq = opts.freq;
    var dur = opts.dur || 0.3;
    var type = opts.type || 'sine';
    var vol = (opts.vol != null) ? opts.vol : 0.3;
    var attack = opts.attack || 0.005;
    var release = opts.release || 0.15;
    var freqEnd = opts.freqEnd;

    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (freqEnd != null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t0 + dur);
    }
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + attack);
    gain.gain.setValueAtTime(vol, t0 + dur - release);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  // ─── Les 6 sonneries ───
  var PLAYERS = {
    // 1) Ding classique : cloche court, deux harmoniques
    ding: function () {
      var c = ensureCtx(); if (!c) return;
      var t0 = c.currentTime;
      tone({ startAt: t0,        freq: 1320, type: 'sine',     dur: 0.45, vol: 0.35, attack: 0.005, release: 0.4 });
      tone({ startAt: t0 + 0.002, freq: 2640, type: 'triangle', dur: 0.35, vol: 0.12, attack: 0.005, release: 0.3 });
    },

    // 2) Bell ample : cloche d'église miniature, décroissance longue
    bell: function () {
      var c = ensureCtx(); if (!c) return;
      var t0 = c.currentTime;
      tone({ startAt: t0,        freq: 880,  type: 'sine',     dur: 1.2,  vol: 0.35, attack: 0.004, release: 1.0 });
      tone({ startAt: t0 + 0.01, freq: 1760, type: 'sine',     dur: 0.9,  vol: 0.15, attack: 0.004, release: 0.7 });
      tone({ startAt: t0 + 0.02, freq: 2640, type: 'triangle', dur: 0.6,  vol: 0.07, attack: 0.004, release: 0.5 });
    },

    // 3) Ding-dong : 2 notes (sol-mi)
    dingdong: function () {
      var c = ensureCtx(); if (!c) return;
      var t0 = c.currentTime;
      tone({ startAt: t0,       freq: 784, type: 'sine', dur: 0.5, vol: 0.32, release: 0.4 }); // G5
      tone({ startAt: t0 + 0.45, freq: 659, type: 'sine', dur: 0.7, vol: 0.32, release: 0.55 }); // E5
    },

    // 4) Chime 3 notes (do-mi-sol ascendant)
    chime: function () {
      var c = ensureCtx(); if (!c) return;
      var t0 = c.currentTime;
      tone({ startAt: t0,       freq: 1046, type: 'sine', dur: 0.3, vol: 0.3, release: 0.22 }); // C6
      tone({ startAt: t0 + 0.18, freq: 1318, type: 'sine', dur: 0.3, vol: 0.3, release: 0.22 }); // E6
      tone({ startAt: t0 + 0.36, freq: 1568, type: 'sine', dur: 0.55, vol: 0.32, release: 0.45 }); // G6
    },

    // 5) Alerte rapide : 4 bips serrés square (urgent)
    alert: function () {
      var c = ensureCtx(); if (!c) return;
      var t0 = c.currentTime;
      for (var i = 0; i < 4; i++) {
        tone({
          startAt: t0 + i * 0.18,
          freq: 1200,
          type: 'square',
          dur: 0.12,
          vol: 0.22,
          attack: 0.004,
          release: 0.05
        });
      }
    },

    // 6) Klaxon doux : glissando descendant (façon notification iOS)
    klaxon: function () {
      var c = ensureCtx(); if (!c) return;
      var t0 = c.currentTime;
      tone({ startAt: t0,       freq: 700, freqEnd: 420, type: 'sawtooth', dur: 0.35, vol: 0.18, release: 0.18 });
      tone({ startAt: t0 + 0.3, freq: 700, freqEnd: 420, type: 'sawtooth', dur: 0.35, vol: 0.18, release: 0.18 });
    },
  };

  var SOUND_LIST = [
    { value: 'ding',     label: 'Ding (klassiko)' },
    { value: 'bell',     label: 'Bell (kambana)' },
    { value: 'dingdong', label: 'Ding-Dong' },
    { value: 'chime',    label: 'Chime (3 notes)' },
    { value: 'alert',    label: 'Alerte rapide' },
    { value: 'klaxon',   label: 'Klaxon doux' },
  ];

  function play(name) {
    var fn = PLAYERS[name] || PLAYERS.ding;
    try { fn(); } catch (e) {}
  }

  function unlock() {
    // Appelé après user gesture pour débloquer iOS
    ensureCtx();
  }

  global.TroubaSounds = {
    play: play,
    unlock: unlock,
    list: SOUND_LIST,
    PLAYERS: PLAYERS,
  };
})(typeof window !== 'undefined' ? window : globalThis);
