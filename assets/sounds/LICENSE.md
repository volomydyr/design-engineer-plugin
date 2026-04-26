# Sound assets

The two WAV files in this directory (`de-complete.wav`, `de-attention.wav`) are **original synthesized tones** generated with `ffmpeg`'s `lavfi` sine source plus filtering (lowpass, echo, loudness normalization). No third-party samples or recordings.

License: dedicated to the **public domain** (CC0). Use, modify, redistribute freely; no attribution required.

## Recipe

For full reproducibility, the recipes used to synthesize each file:

**de-complete.wav** — ascending fourth (G3 → C4) with octave-up harmonics:
- Note 1: sine 196 Hz × 0.07s mixed with sine 392 Hz × 0.35 (harmonic), fade-in 3ms, fade-out 20ms at 50ms
- Note 2: sine 261 Hz × 0.18s mixed with sine 522 Hz × 0.35 (harmonic), fade-in 3ms, fade-out 100ms at 80ms
- Lowpass 4500 Hz, echo (0.4 in / 0.5 out / 20ms / 0.25 decay), loudnorm I=-9 TP=-1.0 LRA=7

**de-attention.wav** — double-tap at A3 (220 Hz) with octave-up harmonics:
- Pulse 1: sine 220 Hz × 0.06s + sine 440 Hz × 0.35, fade-in 3ms, fade-out 20ms at 40ms
- Silence: 0.06s
- Pulse 2: sine 220 Hz × 0.10s + sine 440 Hz × 0.35, fade-in 3ms, fade-out 50ms at 50ms
- Lowpass 4500 Hz, echo (0.4 in / 0.5 out / 18ms / 0.25 decay), loudnorm I=-9 TP=-1.0 LRA=7

If you replace these with your own sounds, ensure your replacements are similarly licensed for redistribution.
