'use client';
import { useState, useEffect, useRef, useCallback } from "react";

// ─── SHARED STYLES ───────────────────────────────────────────────────────────

const FONT = "Georgia, 'Times New Roman', serif";
const BG = "radial-gradient(ellipse at 50% 35%, #0d1f3c 0%, #050d1a 70%)";

const globalCss = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeUp {
    0%   { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-48px); }
  }
  @keyframes pop {
    0%   { transform: translate(0,0) scale(1); opacity: 1; }
    100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #050d1a; }
`;

// ─── CONFETTI ─────────────────────────────────────────────────────────────────

function useConfetti() {
  const [particles, setParticles] = useState([]);
  const burst = useCallback((cx, cy) => {
    const colors = ["#FFD700", "#FF6B9D", "#00E5FF", "#69FF47", "#FF8C42", "#C77DFF"];
    setParticles(Array.from({ length: 80 }, (_, i) => ({
      id: Date.now() + i, x: cx, y: cy,
      color: colors[i % colors.length],
      angle: (i / 80) * 360 + Math.random() * 20,
      speed: 80 + Math.random() * 120,
      size: 6 + Math.random() * 8,
    })));
    setTimeout(() => setParticles([]), 1400);
  }, []);
  return { particles, burst };
}

function Particle({ x, y, color, angle, speed, size }) {
  return (
    <div style={{
      position: "fixed", left: x, top: y, width: size, height: size,
      backgroundColor: color, borderRadius: "50%",
      pointerEvents: "none", zIndex: 200,
      animation: "pop 1.2s ease-out forwards",
      "--dx": `${Math.cos(angle * Math.PI / 180) * speed}px`,
      "--dy": `${Math.sin(angle * Math.PI / 180) * speed}px`,
    }} />
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────

const MODULES = [
  {
    id: "breathe",
    label: "Breathe",
    sub: "4 · 6 breathing exercise",
    accent: "#FF7F7F",
    icon: "◎",
  },
  {
    id: "mantra",
    label: "Mantra",
    sub: "Calm your caveman brain",
    accent: "#7ec8c8",
    icon: "◇",
  },
  {
    id: "release",
    label: "Release",
    sub: "Shake the tension out",
    accent: "#FFB347",
    icon: "◈",
  },
  {
    id: "follow",
    label: "Follow",
    sub: "Rest your mind, move your eyes",
    accent: "#7ec8ff",
    icon: "◉",
  },
];

function Home({ onSelect }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: FONT,
      padding: "40px 24px",
    }}>
      <div style={{ animation: "fadeIn 0.8s ease", width: "100%", maxWidth: 380 }}>

        {/* App name */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h1 style={{
            color: "#d0e4f8",
            fontSize: "clamp(28px, 8vw, 40px)",
            fontWeight: 300,
            letterSpacing: 6,
            margin: "0 0 8px",
          }}>
            Santosha
          </h1>
          <p style={{ color: "#2a4a6a", fontSize: 12, letterSpacing: 4, textTransform: "uppercase" }}>
            a toolkit for anxious moments
          </p>
        </div>

        {/* Module cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {MODULES.map((m, i) => (
            <ModuleCard key={m.id} module={m} index={i} onSelect={onSelect} />
          ))}
        </div>

      </div>
    </div>
  );
}

function ModuleCard({ module: m, index, onSelect }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => !m.disabled && onSelect(m.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 20,
        padding: "22px 26px",
        borderRadius: 16,
        border: `1px solid ${m.disabled ? "#111d2e" : hovered ? m.accent + "66" : "#0f2040"}`,
        background: m.disabled
          ? "transparent"
          : hovered
          ? `linear-gradient(135deg, ${m.accent}0d, #050d1a00)`
          : "transparent",
        cursor: m.disabled ? "default" : "pointer",
        transition: "all 0.3s ease",
        animation: `fadeIn 0.6s ease ${index * 0.12}s both`,
        opacity: m.disabled ? 0.3 : 1,
      }}
    >
      {/* Icon */}
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        border: `1px solid ${m.accent}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: m.accent,
        fontSize: m.id === "coming" ? 14 : 22,
        flexShrink: 0,
        background: `${m.accent}0a`,
        transition: "all 0.3s ease",
        letterSpacing: m.id === "coming" ? 2 : 0,
      }}>
        {m.icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div style={{
          color: m.disabled ? "#2a4060" : "#d0e4f8",
          fontSize: 18,
          fontWeight: 400,
          letterSpacing: 1,
          marginBottom: 3,
        }}>
          {m.label}
        </div>
        {m.sub && (
          <div style={{
            color: m.disabled ? "#1a3050" : "#3a6080",
            fontSize: 12,
            letterSpacing: 1,
          }}>
            {m.sub}
          </div>
        )}
      </div>

      {/* Arrow */}
      {!m.disabled && (
        <div style={{
          color: hovered ? m.accent : "#1a3050",
          fontSize: 18,
          transition: "all 0.3s ease",
          transform: hovered ? "translateX(4px)" : "translateX(0)",
        }}>
          →
        </div>
      )}
    </div>
  );
}

// ─── BREATHE MODULE ───────────────────────────────────────────────────────────

const INHALE = 4, EXHALE = 6, CYCLE = 10, TOTAL = 180, PREP = 5;
const CX = 160, CY = 160, SVG_SIZE = 320;
const SESSION_R = 130, SESSION_STROKE = 7;
const SESSION_CIRC = 2 * Math.PI * SESSION_R;

function Breathe({ onBack }) {
  const [screen, setScreen] = useState("idle");
  const [score, setScore] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [tapFeedback, setTapFeedback] = useState(null);
  const { particles, burst } = useConfetti();

  const startRef = useRef(null);
  const rafRef = useRef(null);
  const scoreRef = useRef(0);
  const tapCountRef = useRef(0);
  const bgRef = useRef(null);
  const sessionArcRef = useRef(null);
  const timerTextRef = useRef(null);
  const phaseTextRef = useRef(null);
  const tapHintRef = useRef(null);
  const prepBarRef = useRef(null);
  const screenRef = useRef("idle");
  screenRef.current = screen;

  const stopRaf = () => cancelAnimationFrame(rafRef.current);

  const runPrep = useCallback(() => {
    stopRaf();
    const prepStart = performance.now();
    const tick = () => {
      const elapsed = (performance.now() - prepStart) / 1000;
      const rem = Math.max(0, PREP - elapsed);
      if (prepBarRef.current) prepBarRef.current.style.width = `${((PREP - rem) / PREP) * 100}%`;
      if (rem <= 0) { startRef.current = performance.now(); setScreen("running"); return; }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const runGame = useCallback(() => {
    stopRaf();
    const tick = () => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      const total = Math.min(elapsed, TOTAL);
      const cycle = total % CYCLE;
      const isIn = cycle < INHALE;
      const pt = isIn ? cycle : cycle - INHALE;
      const sessionProg = Math.min(total / TOTAL, 1);

      if (bgRef.current) {
        bgRef.current.style.background = isIn
          ? "radial-gradient(ellipse at 50% 35%, #1f0d1a 0%, #050d1a 70%)"
          : "radial-gradient(ellipse at 50% 35%, #0d1f2a 0%, #050d1a 70%)";
      }
      if (sessionArcRef.current) {
        sessionArcRef.current.style.strokeDashoffset = SESSION_CIRC * (1 - sessionProg);
      }
      if (timerTextRef.current) timerTextRef.current.textContent = Math.floor(pt);
      if (phaseTextRef.current) {
        phaseTextRef.current.textContent = isIn ? "BREATHE IN" : "BREATHE OUT";
        phaseTextRef.current.style.fill = isIn ? "#FF7F7F" : "#00CED1";
      }
      if (tapHintRef.current) tapHintRef.current.textContent = isIn ? "tap at 4" : "tap at 6";
      if (total >= TOTAL) { setScreen("done"); return; }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (screen === "prep") runPrep();
    if (screen === "running") runGame();
    if (screen === "idle" || screen === "done") stopRaf();
    return stopRaf;
  }, [screen]);

  const beginPrep = () => {
    scoreRef.current = 0; tapCountRef.current = 0;
    setScore(0); setTapCount(0); setTapFeedback(null);
    setScreen("prep");
  };

  const handleTap = useCallback((e) => {
    if (screenRef.current !== "running") return;
    const elapsed = (performance.now() - startRef.current) / 1000;
    const cycle = elapsed % CYCLE;
    const isIn = cycle < INHALE;
    const pt = isIn ? cycle : cycle - INHALE;
    const target = isIn ? INHALE : EXHALE;
    const dist = Math.min(Math.abs(pt - target), pt);
    const pts = dist <= 1 ? Math.max(0, Math.round(100 - dist * 100)) : 0;
    const perfect = dist < 0.1;
    let label, color;
    if (perfect) { label = "PERFECT! 🎉"; color = "#FFD700"; burst(e.clientX ?? window.innerWidth / 2, e.clientY ?? window.innerHeight / 2); }
    else if (pts >= 80) { label = `Brilliant! +${pts}`; color = "#7FFF7F"; }
    else if (pts >= 50) { label = `Good! +${pts}`; color = "#00CED1"; }
    else if (pts > 0) { label = `+${pts}`; color = "#aaa"; }
    else { label = "Miss"; color = "#FF6B9D"; }
    scoreRef.current += pts; tapCountRef.current += 1;
    setScore(scoreRef.current); setTapCount(tapCountRef.current);
    setTapFeedback({ label, color, id: Date.now() });
  }, [burst]);

  const avg = tapCount > 0 ? Math.round(score / tapCount) : 0;

  return (
    <div ref={bgRef} onClick={handleTap} style={{
      minHeight: "100vh",
      background: BG,
      transition: "background 3s ease",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: FONT, userSelect: "none",
      cursor: screen === "running" ? "pointer" : "default",
      overflow: "hidden", position: "relative",
    }}>
      {particles.map(p => <Particle key={p.id} {...p} />)}

      {/* Back button */}
      <button onClick={(e) => { e.stopPropagation(); stopRaf(); onBack(); }} style={{
        position: "fixed", top: 20, left: 20,
        background: "transparent", border: "none",
        color: "#2a4a6a", fontSize: 13, letterSpacing: 2,
        cursor: "pointer", fontFamily: FONT, padding: "8px 12px",
        zIndex: 50,
      }}>
        ← back
      </button>

      {screen === "idle" && (
        <div style={{ textAlign: "center", animation: "fadeIn 0.6s ease" }}>
          <h1 style={{ color: "#e0f0ff", fontSize: 34, fontWeight: "normal", margin: "0 0 16px", letterSpacing: 3 }}>Breathe</h1>
          <p style={{ color: "#5a80a8", fontSize: 15, margin: "0 0 28px", lineHeight: 2, maxWidth: 270 }}>
            Tap exactly at the end of each<br />in breath and out breath<br />to score points.
          </p>
          <div style={{ fontSize: 13, lineHeight: 2.4, marginBottom: 8 }}>
            <span style={{ color: "#FF7F7F" }}>●</span>
            <span style={{ color: "#4a6a8a" }}> Breathe in · 4 seconds</span><br />
            <span style={{ color: "#00CED1" }}>●</span>
            <span style={{ color: "#4a6a8a" }}> Breathe out · 6 seconds</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); beginPrep(); }} style={{
            marginTop: 28, padding: "13px 44px", background: "transparent",
            border: "1px solid #FF7F7F88", borderRadius: 50,
            color: "#e0f0ff", fontSize: 16, cursor: "pointer",
            letterSpacing: 3, fontFamily: FONT,
          }}>BEGIN</button>
        </div>
      )}

      {screen === "prep" && (
        <div style={{ textAlign: "center", animation: "fadeIn 0.4s ease" }}>
          <p style={{ color: "#00CED1", fontSize: 22, letterSpacing: 3, textTransform: "uppercase", margin: "0 0 10px", fontWeight: "normal" }}>
            Breathe out fully
          </p>
          <p style={{ color: "#2a4a6a", fontSize: 14, margin: "0 0 40px", letterSpacing: 1 }}>
            get ready to breathe in…
          </p>
          <div style={{ width: 160, height: 2, background: "#0d2a4a", borderRadius: 2, margin: "0 auto", overflow: "hidden" }}>
            <div ref={prepBarRef} style={{ height: "100%", width: "0%", background: "#00CED1", borderRadius: 2 }} />
          </div>
        </div>
      )}

      {screen === "running" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#4a6a8a", fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>Score</div>
            <div style={{ color: "#e0f0ff", fontSize: 34, fontWeight: "bold" }}>{score}</div>
          </div>
          <svg width={SVG_SIZE} height={SVG_SIZE} style={{ transform: "rotate(-90deg)", overflow: "visible" }}>
            <circle cx={CX} cy={CY} r={SESSION_R} fill="none" stroke="#0a1e35" strokeWidth={SESSION_STROKE} />
            <circle ref={sessionArcRef} cx={CX} cy={CY} r={SESSION_R}
              fill="none" stroke="#c8922a" strokeWidth={SESSION_STROKE}
              strokeDasharray={SESSION_CIRC} strokeDashoffset={SESSION_CIRC} />
            <g transform={`rotate(90, ${CX}, ${CY})`}>
              <text ref={timerTextRef} x={CX} y={CY - 10} textAnchor="middle" dominantBaseline="middle"
                style={{ fontSize: 68, fontWeight: 200, fill: "#e0f0ff", fontFamily: FONT }}>0</text>
              <text ref={phaseTextRef} x={CX} y={CY + 42} textAnchor="middle"
                style={{ fontSize: 11, letterSpacing: 4, fill: "#FF7F7F", fontFamily: FONT }}>BREATHE IN</text>
              <text ref={tapHintRef} x={CX} y={CY + 62} textAnchor="middle"
                style={{ fontSize: 10, fill: "#2a4a6a", fontFamily: FONT, letterSpacing: 1 }}>tap at 4</text>
            </g>
          </svg>
          <div style={{ height: 36, position: "relative", width: 220, textAlign: "center" }}>
            {tapFeedback && (
              <div key={tapFeedback.id} style={{
                position: "absolute", width: "100%",
                color: tapFeedback.color, fontSize: 17, fontWeight: "bold",
                animation: "fadeUp 1s ease forwards",
              }}>{tapFeedback.label}</div>
            )}
          </div>
          <div style={{ color: "#1a3050", fontSize: 12, letterSpacing: 1 }}>tap anywhere · {tapCount} taps</div>
        </div>
      )}

      {screen === "done" && (
        <div style={{ textAlign: "center", animation: "fadeIn 0.8s ease" }}>
          <h2 style={{ color: "#e0f0ff", fontWeight: "normal", fontSize: 28, margin: "0 0 8px", letterSpacing: 2 }}>Well done</h2>
          <p style={{ color: "#5a80a8", fontSize: 14, margin: "0 0 32px" }}>3 minutes complete</p>
          <div style={{ border: "1px solid #1a3a5a", borderRadius: 20, padding: "28px 52px", marginBottom: 28 }}>
            <div style={{ color: "#4a6a8a", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Final Score</div>
            <div style={{ color: "#FFD700", fontSize: 60, fontWeight: "bold", lineHeight: 1 }}>{score}</div>
            <div style={{ color: "#3a5a7a", fontSize: 13, marginTop: 10 }}>{tapCount} taps · {avg} avg per tap</div>
          </div>
          <div style={{ color: "#4a7a9a", fontSize: 14, marginBottom: 32 }}>
            {avg >= 80 ? "Amazing focus! 🌟" : avg >= 50 ? "Great effort! Keep practising." : "Every breath counts. You did great."}
          </div>
          <button onClick={(e) => { e.stopPropagation(); beginPrep(); }} style={{
            padding: "13px 44px", background: "transparent",
            border: "1px solid #FF7F7F88", borderRadius: 50,
            color: "#e0f0ff", fontSize: 16, cursor: "pointer",
            letterSpacing: 3, fontFamily: FONT,
          }}>AGAIN</button>
        </div>
      )}
    </div>
  );
}

// ─── MANTRA MODULE ────────────────────────────────────────────────────────────

const PHRASES = [
  { text: "Thank you", size: "lg", weight: 300 },
  { text: "Caveman brain", size: "xl", weight: 600, color: "#c8922a" },
  { text: "For always trying to protect me", size: "md", weight: 300 },
  { text: "But", size: "lg", weight: 300 },
  { text: "At the moment", size: "md", weight: 300 },
  { text: "I am SAFE", size: "xl", weight: 700, color: "#7ec8c8" },
  { text: "There is no danger here", size: "md", weight: 300 },
  { text: "I repeat", size: "sm", weight: 300, color: "#5a7a9a" },
  { text: "There is NO danger here", size: "xl", weight: 700, color: "#7ec8c8" },
  { text: "So", size: "md", weight: 300 },
  { text: "You can stand down", size: "lg", weight: 400 },
  { text: "Thinking brain will take over from here", size: "md", weight: 300 },
  { text: "These feelings I have", size: "md", weight: 300 },
  { text: "Are annoying", size: "lg", weight: 500 },
  { text: "VERY annoying", size: "xl", weight: 700, color: "#e08060" },
  { text: "But they are not dangerous", size: "md", weight: 300 },
  { text: "And they are not needed", size: "md", weight: 300 },
  { text: "And they ALWAYS go away", size: "lg", weight: 600, color: "#7ec8c8" },
  { text: "So", size: "md", weight: 300 },
  { text: "I choose", size: "xl", weight: 600 },
  { text: "To let them go away", size: "md", weight: 300 },
  { text: "To let them drift away", size: "md", weight: 300 },
  { text: "To let them fade away", size: "md", weight: 300 },
  { text: "Into nothing", size: "lg", weight: 200, color: "#2a4a6a" },
];

const sizeMap = {
  sm: "clamp(14px, 3.5vw, 18px)",
  md: "clamp(20px, 5vw, 28px)",
  lg: "clamp(28px, 7vw, 42px)",
  xl: "clamp(36px, 9vw, 56px)",
};

function holdTime(phrase) {
  return Math.max(1800, phrase.text.split(" ").length * 600);
}

const FADE_MS = 700;

function Mantra({ onBack }) {
  const [screen, setScreen] = useState("intro");
  const [index, setIndex] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const timerRef = useRef(null);

  const clearTimers = () => clearTimeout(timerRef.current);

  const showPhrase = useCallback((i) => {
    if (i >= PHRASES.length) { setScreen("done"); return; }
    setIndex(i);
    setOpacity(0);
    setTimeout(() => setOpacity(1), 30);
    timerRef.current = setTimeout(() => {
      setOpacity(0);
      timerRef.current = setTimeout(() => showPhrase(i + 1), FADE_MS);
    }, FADE_MS + holdTime(PHRASES[i]));
  }, []);

  const start = () => {
    clearTimers();
    setScreen("playing");
    setIndex(0);
    setOpacity(0);
    setTimeout(() => showPhrase(0), 100);
  };

  useEffect(() => () => clearTimers(), []);

  const phrase = PHRASES[index] || PHRASES[0];
  const bgProgress = index / (PHRASES.length - 1);
  const bg = `radial-gradient(ellipse at 50% 40%, hsl(${200 + bgProgress * 40}, 30%, ${8 + bgProgress * 4}%) 0%, hsl(215, 40%, 4%) 70%)`;

  return (
    <div style={{
      minHeight: "100vh",
      background: bg,
      transition: "background 4s ease",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: FONT, userSelect: "none",
      overflow: "hidden", position: "relative",
      padding: "0 32px",
    }}>
      {/* Back button */}
      <button onClick={() => { clearTimers(); onBack(); }} style={{
        position: "fixed", top: 20, left: 20,
        background: "transparent", border: "none",
        color: "#2a4a6a", fontSize: 13, letterSpacing: 2,
        cursor: "pointer", fontFamily: FONT, padding: "8px 12px",
        zIndex: 50,
      }}>
        ← back
      </button>

      {screen === "intro" && (
        <div style={{ textAlign: "center", animation: "fadeIn 0.7s ease", maxWidth: 340 }}>
          <h1 style={{ color: "#d0e8f0", fontSize: "clamp(24px, 6vw, 34px)", fontWeight: 300, letterSpacing: 4, margin: "0 0 20px" }}>
            Mantra
          </h1>
          <p style={{ color: "#4a6a84", fontSize: 15, lineHeight: 1.9, margin: "0 0 40px" }}>
            Read each message in your head,<br />slowly and calmly,<br />as it appears.
          </p>
          <button onClick={start} style={{
            padding: "13px 44px", background: "transparent",
            border: "1px solid #7ec8c866", borderRadius: 50,
            color: "#d0e8f0", fontSize: 15, cursor: "pointer",
            letterSpacing: 3, fontFamily: FONT,
          }}>BEGIN</button>
        </div>
      )}

      {screen === "playing" && (
        <div style={{
          textAlign: "center", opacity,
          transition: `opacity ${FADE_MS}ms ease`,
          maxWidth: 440, padding: "0 16px",
        }}>
          <p style={{
            margin: 0,
            fontSize: sizeMap[phrase.size],
            fontWeight: phrase.weight,
            color: phrase.color || "#d0e8f0",
            lineHeight: 1.3,
            letterSpacing: phrase.weight >= 600 ? 2 : 0.5,
          }}>
            {phrase.text}
          </p>
        </div>
      )}

      {screen === "done" && (
        <div style={{ textAlign: "center", animation: "fadeIn 1.5s ease", maxWidth: 340 }}>
          <p style={{ color: "#3a6070", fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 300, letterSpacing: 2, margin: "0 0 48px", lineHeight: 1.8 }}>
            Well done.<br />
            <span style={{ fontSize: "0.7em", color: "#2a4a5a", letterSpacing: 1 }}>
              Take a moment.<br />Notice how you feel.
            </span>
          </p>
          <button onClick={start} style={{
            padding: "12px 40px", background: "transparent",
            border: "1px solid #3a6070", borderRadius: 50,
            color: "#7ec8c8", fontSize: 14, cursor: "pointer",
            letterSpacing: 3, fontFamily: FONT,
          }}>AGAIN</button>
        </div>
      )}

      {screen === "playing" && (
        <div style={{ position: "fixed", bottom: 32, display: "flex", gap: 5, alignItems: "center" }}>
          {PHRASES.map((_, i) => (
            <div key={i} style={{
              width: i === index ? 16 : 4, height: 4, borderRadius: 2,
              background: i === index ? "#7ec8c8" : "#1a3a4a",
              transition: "all 0.4s ease",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── RELEASE MODULE ───────────────────────────────────────────────────────────

const CMD_DURATION = 10;
const RELEASE_TOTAL = 180;
const SLOTS = Math.floor(RELEASE_TOTAL / CMD_DURATION);
const FINALE = "SHAKE EVERYTHING OUT LIKE A DOG";

const CMD_POOL = [
  "SMILE","FROWN","PUFF OUT YOUR CHEEKS","SUCK IN YOUR CHEEKS",
  "OPEN YOUR EYES WIDE","SCRUNCH YOUR RIGHT EYE SHUT","SCRUNCH YOUR LEFT EYE SHUT",
  "WIGGLE YOUR EARS","MASSAGE YOUR RIGHT EAR LOBE","PULL YOUR LEFT EAR LOBE",
  "BALL YOUR FISTS TIGHT","MOVE YOUR JAW FROM LEFT TO RIGHT","PRESS YOUR HANDS TOGETHER",
  "STICK YOUR TONGUE OUT","TOUCH THE TIP OF YOUR NOSE WITH YOUR TONGUE",
  "CROSS ALL OF YOUR FINGERS ON YOUR RIGHT HAND","CROSS ALL OF YOUR FINGERS ON YOUR LEFT HAND",
  "HOLD YOUR BREATH","SQUEEZE YOUR THUMBS AND FOREFINGERS TOGETHER",
  "ROLL YOUR SHOULDERS FORWARD","ROLL YOUR SHOULDERS BACKWARDS","SHRUG YOUR SHOULDERS",
  "SPREAD YOUR FINGERS OUT AS WIDE AS YOU CAN","RUN YOUR TONGUE AROUND YOUR TEETH",
  "SCRUNCH YOUR TOES","SPREAD YOUR TOES WIDE",
];

const CMD_EMOJI = {
  "SMILE":"😁","FROWN":"😠","PUFF OUT YOUR CHEEKS":"🐡","SUCK IN YOUR CHEEKS":"😗",
  "OPEN YOUR EYES WIDE":"👀","SCRUNCH YOUR RIGHT EYE SHUT":"😉","SCRUNCH YOUR LEFT EYE SHUT":"😉",
  "WIGGLE YOUR EARS":"🐘","MASSAGE YOUR RIGHT EAR LOBE":"✋","PULL YOUR LEFT EAR LOBE":"👂",
  "BALL YOUR FISTS TIGHT":"✊","MOVE YOUR JAW FROM LEFT TO RIGHT":"🦷","PRESS YOUR HANDS TOGETHER":"🙏",
  "STICK YOUR TONGUE OUT":"😛","TOUCH THE TIP OF YOUR NOSE WITH YOUR TONGUE":"👅",
  "CROSS ALL OF YOUR FINGERS ON YOUR RIGHT HAND":"🤞","CROSS ALL OF YOUR FINGERS ON YOUR LEFT HAND":"🤞",
  "HOLD YOUR BREATH":"🤐","SQUEEZE YOUR THUMBS AND FOREFINGERS TOGETHER":"👌",
  "ROLL YOUR SHOULDERS FORWARD":"🔄","ROLL YOUR SHOULDERS BACKWARDS":"🔃",
  "SHRUG YOUR SHOULDERS":"🤷","SPREAD YOUR FINGERS OUT AS WIDE AS YOU CAN":"🖐️",
  "RUN YOUR TONGUE AROUND YOUR TEETH":"😬","SHAKE EVERYTHING OUT LIKE A DOG":"🐕",
  "SCRUNCH YOUR TOES":"🦶","SPREAD YOUR TOES WIDE":"🦶",
};

const CMD_ACCENTS = [
  "#FF7F7F","#FFB347","#7ec8c8","#c8a2c8","#98d898",
  "#FF9999","#7ec8ff","#FFD700","#b8a0e8","#90e090",
];

function buildSequence() {
  const shuffled = [...CMD_POOL].sort(() => Math.random() - 0.5).slice(0, SLOTS - 1);
  return [...shuffled, FINALE];
}

function Release({ onBack }) {
  const [screen, setScreen] = useState("intro");
  const [sequence, setSequence] = useState([]);
  const [cmdIndex, setCmdIndex] = useState(0);
  const [timeInCmd, setTimeInCmd] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [visible, setVisible] = useState(true);

  const rafRef = useRef(null);
  const startRef = useRef(null);
  const lastCmdRef = useRef(-1);
  const stopRaf = () => cancelAnimationFrame(rafRef.current);

  const startGame = () => {
    const seq = buildSequence();
    setSequence(seq);
    setTotalTime(0); setCmdIndex(0); setTimeInCmd(0); setVisible(true);
    lastCmdRef.current = -1;
    startRef.current = performance.now();
    setScreen("playing");
  };

  useEffect(() => {
    if (screen !== "playing") return;
    stopRaf();
    const tick = () => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      const total = Math.min(elapsed, RELEASE_TOTAL);
      const ci = Math.min(Math.floor(total / CMD_DURATION), SLOTS - 1);
      const timeInC = total - ci * CMD_DURATION;
      setTotalTime(total); setCmdIndex(ci); setTimeInCmd(timeInC);
      if (ci !== lastCmdRef.current) {
        lastCmdRef.current = ci;
        setVisible(false);
        setTimeout(() => setVisible(true), 300);
      }
      if (total >= RELEASE_TOTAL) { setScreen("done"); return; }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return stopRaf;
  }, [screen]);

  const cmd = sequence[cmdIndex] || "";
  const emoji = CMD_EMOJI[cmd] || "✨";
  const accent = CMD_ACCENTS[cmdIndex % CMD_ACCENTS.length];
  const isFinale = cmd === FINALE;
  const sessionProg = Math.min(totalTime / RELEASE_TOTAL, 1);
  const cmdProg = Math.min(timeInCmd / CMD_DURATION, 1);
  const secsLeft = Math.max(0, Math.ceil(CMD_DURATION - timeInCmd));

  const SZ = 280, SRF = SZ / 2;
  const SES_R = 126, SES_S = 5, SES_C = 2 * Math.PI * SES_R;
  const CMD_R = 104, CMD_S = 14, CMD_C = 2 * Math.PI * CMD_R;

  return (
    <div style={{
      minHeight: "100vh",
      background: screen === "playing"
        ? `radial-gradient(ellipse at 50% 35%, ${accent}18 0%, #050d1a 70%)`
        : "radial-gradient(ellipse at 50% 35%, #0d1f3c 0%, #050d1a 70%)",
      transition: "background 1s ease",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: FONT, userSelect: "none",
      overflow: "hidden", position: "relative", padding: "0 24px",
    }}>
      <style>{`
        @keyframes cmdIn { from { opacity:0; transform:scale(0.93); } to { opacity:1; transform:scale(1); } }
        @keyframes shake {
          0%,100% { transform:rotate(0deg) scale(1); }
          20% { transform:rotate(-7deg) scale(1.1); }
          40% { transform:rotate(7deg) scale(1.1); }
          60% { transform:rotate(-5deg) scale(1.08); }
          80% { transform:rotate(5deg) scale(1.08); }
        }
        @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
      `}</style>

      <button onClick={() => { stopRaf(); onBack(); }} style={{
        position:"fixed",top:20,left:20,background:"transparent",border:"none",
        color:"#2a4a6a",fontSize:13,letterSpacing:2,cursor:"pointer",fontFamily:FONT,padding:"8px 12px",zIndex:50,
      }}>← back</button>

      {screen === "intro" && (
        <div style={{ textAlign:"center", animation:"fadeIn 0.7s ease", maxWidth:340 }}>
          <div style={{ fontSize:48, marginBottom:16, animation:"bob 2s ease-in-out infinite" }}>🐕</div>
          <h1 style={{ color:"#d0e4f8", fontSize:"clamp(22px,6vw,32px)", fontWeight:300, letterSpacing:4, margin:"0 0 16px" }}>Release</h1>
          <p style={{ color:"#4a6a84", fontSize:15, lineHeight:1.9, margin:"0 0 12px" }}>
            Follow each command for 10 seconds.<br />Squeeze, stretch, scrunch — then let go.
          </p>
          <p style={{ color:"#2a4a5a", fontSize:13, lineHeight:1.8, margin:"0 0 40px" }}>
            Three minutes. A bit silly.<br />That's the point.
          </p>
          <button onClick={startGame} style={{
            padding:"13px 44px", background:"transparent",
            border:"1px solid #FFB34766", borderRadius:50,
            color:"#d0e4f8", fontSize:15, cursor:"pointer", letterSpacing:3, fontFamily:FONT,
          }}>LET'S GO</button>
        </div>
      )}

      {screen === "playing" && sequence.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20 }}>
          <div style={{ position:"relative", width:SZ, height:SZ }}>
            <svg width={SZ} height={SZ} style={{ transform:"rotate(-90deg)", position:"absolute", top:0, left:0, overflow:"visible" }}>
              <circle cx={SRF} cy={SRF} r={SES_R} fill="none" stroke="#0a1e35" strokeWidth={SES_S} />
              <circle cx={SRF} cy={SRF} r={SES_R} fill="none" stroke="#c8922a" strokeWidth={SES_S}
                strokeDasharray={SES_C} strokeDashoffset={SES_C * (1 - sessionProg)}
                style={{ transition:"stroke-dashoffset 0.5s linear" }} />
              <circle cx={SRF} cy={SRF} r={CMD_R} fill="none" stroke="#0d2a4a" strokeWidth={CMD_S} />
              <circle cx={SRF} cy={SRF} r={CMD_R} fill="none" stroke={accent} strokeWidth={CMD_S}
                strokeDasharray={CMD_C} strokeDashoffset={CMD_C * (1 - cmdProg)}
                strokeLinecap="round"
                style={{ transition:`stroke 0.8s ease, stroke-dashoffset 0.1s linear`, filter:`drop-shadow(0 0 8px ${accent}88)` }} />
            </svg>
            <div style={{
              position:"absolute", inset:0,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              pointerEvents:"none",
            }}>
              <div style={{ fontSize:42, animation: isFinale ? "shake 0.6s ease-in-out infinite" : "none", marginBottom:4 }}>
                {emoji}
              </div>
              <div style={{ fontSize:44, fontWeight:200, color:"#e0f0ff", lineHeight:1, fontVariantNumeric:"tabular-nums" }}>
                {secsLeft}
              </div>
            </div>
          </div>

          <div style={{
            textAlign:"center", maxWidth:300, padding:"0 8px",
            opacity: visible ? 1 : 0,
            transition:"opacity 0.3s ease",
            animation: visible ? "cmdIn 0.4s ease" : "none",
          }}>
            <p style={{
              margin:0,
              fontSize: isFinale ? "clamp(18px,5vw,28px)" : "clamp(14px,4vw,22px)",
              fontWeight: isFinale ? 700 : 600,
              color: accent,
              lineHeight:1.3, letterSpacing:1, textTransform:"uppercase",
            }}>{cmd}</p>
          </div>

          <div style={{ color:"#1a3050", fontSize:12, letterSpacing:2 }}>
            {cmdIndex + 1} of {SLOTS}
          </div>
        </div>
      )}

      {screen === "done" && (
        <div style={{ textAlign:"center", animation:"fadeIn 1s ease", maxWidth:320 }}>
          <div style={{ fontSize:52, marginBottom:20, animation:"shake 0.8s ease-in-out 3" }}>🐕</div>
          <h2 style={{ color:"#d0e4f8", fontWeight:300, fontSize:28, margin:"0 0 12px", letterSpacing:2 }}>Nicely done</h2>
          <p style={{ color:"#3a6070", fontSize:15, lineHeight:1.8, margin:"0 0 40px" }}>
            Your muscles said thank you.<br />
            <span style={{ color:"#2a4050", fontSize:13 }}>Notice how your body feels now.</span>
          </p>
          <button onClick={startGame} style={{
            padding:"13px 44px", background:"transparent",
            border:"1px solid #FFB34766", borderRadius:50,
            color:"#d0e4f8", fontSize:15, cursor:"pointer", letterSpacing:3, fontFamily:FONT,
          }}>AGAIN</button>
        </div>
      )}
    </div>
  );
}

// ─── FOLLOW MODULE ────────────────────────────────────────────────────────────

const FOLLOW_TOTAL = 120;
const TRAIL_LENGTH = 140;
const DOT_RADIUS = 14;

const DOT_COLORS = [
  { color: "#FF7F7F", glow: "rgba(255,127,127,0.7)" },
  { color: "#7ec8ff", glow: "rgba(126,200,255,0.7)" },
  { color: "#98e898", glow: "rgba(152,232,152,0.7)" },
  { color: "#FFD700", glow: "rgba(255,215,0,0.7)"   },
];

function Follow({ onBack }) {
  const [screen, setScreen] = useState("intro");
  const [elapsed, setElapsed] = useState(0);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const dotsRef = useRef(null);

  const stopRaf = () => cancelAnimationFrame(rafRef.current);

  const initDots = (w, h) => {
    return DOT_COLORS.map((d, i) => ({
      x: w * 0.2 + (w * 0.6 / 3) * i + Math.random() * 40 - 20,
      y: h * 0.35 + (i % 2) * h * 0.25 + Math.random() * 40 - 20,
      angle: (Math.PI / 2) * i + Math.random() * 0.5, // spread initial headings
      // Each dot has its own slow sinusoidal turn rate — different period per dot
      // so they never synchronise and always look independent
      turnFreq: 0.25 + i * 0.07 + Math.random() * 0.08,
      turnAmp: 0.034 + Math.random() * 0.012,            // radians added per frame
      turnPhase: Math.random() * Math.PI * 2,
      speed: 2.0 + Math.random() * 0.6,
      trail: [],
      color: d.color,
      glow: d.glow,
      bouncing: false,
    }));
  };

  const startGame = () => {
    setElapsed(0);
    setScreen("playing");
  };

  useEffect(() => {
    if (screen !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext("2d");
    dotsRef.current = initDots(w, h);
    startRef.current = performance.now();
    stopRaf();

    const PAD = 18;
    let frame = 0;

    const tick = () => {
      frame++;
      const now = performance.now();
      const totalSecs = Math.min((now - startRef.current) / 1000, FOLLOW_TOTAL);
      setElapsed(totalSecs);

      ctx.fillStyle = "rgba(5, 13, 26, 0.11)";
      ctx.fillRect(0, 0, w, h);

      dotsRef.current.forEach((dot) => {
        // Continuous sinusoidal turn — each dot always gently curving,
        // the sine wave makes it curve one way then the other organically
        const t = frame * 0.016; // ~seconds
        const turnDelta = Math.sin(t * dot.turnFreq * Math.PI * 2 + dot.turnPhase) * dot.turnAmp;
        dot.angle += turnDelta;

        // Soft centre pull — very gentle, only noticeable when far from centre
        const toCX = w / 2 - dot.x;
        const toCY = h / 2 - dot.y;
        const dist = Math.sqrt(toCX ** 2 + toCY ** 2);
        const maxDist = Math.sqrt((w / 2) ** 2 + (h / 2) ** 2);
        if (dist > maxDist * 0.42) {
          const centreAngle = Math.atan2(toCY, toCX);
          let diff = centreAngle - dot.angle;
          while (diff > Math.PI)  diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          dot.angle += diff * 0.016;
        }

        const nx = dot.x + Math.cos(dot.angle) * dot.speed;
        const ny = dot.y + Math.sin(dot.angle) * dot.speed;

        // Clean bounce — reflect angle, randomise turn phase so it
        // curves differently after the bounce rather than retracing
        let bounced = false;
        if (nx < PAD || nx > w - PAD) {
          dot.angle = Math.PI - dot.angle;
          dot.turnPhase = Math.random() * Math.PI * 2; // new curve after bounce
          bounced = true;
        } else { dot.x = nx; }

        if (ny < PAD || ny > h - PAD) {
          dot.angle = -dot.angle;
          dot.turnPhase = Math.random() * Math.PI * 2;
          bounced = true;
        } else { dot.y = ny; }

        // Trail
        dot.trail.push({ x: dot.x, y: dot.y });
        if (dot.trail.length > TRAIL_LENGTH) dot.trail.shift();

        if (dot.trail.length > 1) {
          for (let i = 1; i < dot.trail.length; i++) {
            const p = i / dot.trail.length;
            const alpha = Math.round(p * 155).toString(16).padStart(2, "0");
            ctx.beginPath();
            ctx.moveTo(dot.trail[i - 1].x, dot.trail[i - 1].y);
            ctx.lineTo(dot.trail[i].x, dot.trail[i].y);
            ctx.strokeStyle = dot.color + alpha;
            ctx.lineWidth = p * 5;
            ctx.lineCap = "round";
            ctx.stroke();
          }
        }

        ctx.save();
        ctx.shadowColor = dot.glow;
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();
        ctx.restore();
      });

      if (totalSecs >= FOLLOW_TOTAL) { setScreen("done"); return; }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return stopRaf;
  }, [screen]);

  const progress = Math.min(elapsed / FOLLOW_TOTAL, 1);
  const minsLeft = Math.floor((FOLLOW_TOTAL - elapsed) / 60);
  const secsLeft = Math.floor((FOLLOW_TOTAL - elapsed) % 60).toString().padStart(2, "0");

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      background: "#050d1a",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: FONT, userSelect: "none",
      overflow: "hidden", position: "relative",
    }}>
      <style>{`
        @keyframes drift {
          0%,100% { transform: translate(0,0); }
          33%      { transform: translate(6px,-4px); }
          66%      { transform: translate(-4px,6px); }
        }
      `}</style>

      <button onClick={() => { stopRaf(); onBack(); }} style={{
        position:"fixed", top:20, left:20,
        background:"transparent", border:"none",
        color:"#2a4a6a", fontSize:13, letterSpacing:2,
        cursor:"pointer", fontFamily:FONT, padding:"8px 12px", zIndex:50,
      }}>← back</button>

      {/* INTRO */}
      {screen === "intro" && (
        <div style={{ textAlign:"center", animation:"fadeIn 0.7s ease", maxWidth:340, padding:"0 24px" }}>
          {/* Animated dots preview */}
          <div style={{ display:"flex", gap:16, justifyContent:"center", marginBottom:32 }}>
            {DOT_COLORS.map((d, i) => (
              <div key={i} style={{
                width:14, height:14, borderRadius:"50%",
                background: d.color,
                boxShadow: `0 0 12px ${d.glow}`,
                animation: `drift ${2.2 + i * 0.4}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }} />
            ))}
          </div>
          <h1 style={{ color:"#d0e4f8", fontSize:"clamp(22px,6vw,32px)", fontWeight:300, letterSpacing:4, margin:"0 0 16px" }}>
            Follow
          </h1>
          <p style={{ color:"#4a6a84", fontSize:15, lineHeight:1.9, margin:"0 0 12px" }}>
            Pick a coloured dot and follow it<br />quietly with your eyes.
          </p>
          <p style={{ color:"#2a4a5a", fontSize:13, lineHeight:1.8, margin:"0 0 40px" }}>
            Just watch. Let your mind rest.<br />Two minutes.
          </p>
          <button onClick={startGame} style={{
            padding:"13px 44px", background:"transparent",
            border:"1px solid #7ec8ff66", borderRadius:50,
            color:"#d0e4f8", fontSize:15, cursor:"pointer",
            letterSpacing:3, fontFamily:FONT,
          }}>BEGIN</button>
        </div>
      )}

      {/* PLAYING — full screen canvas */}
      {screen === "playing" && (
        <>
          <canvas ref={canvasRef} style={{
            position:"fixed", inset:0,
            width:"100%", height:"100%",
            display:"block",
          }} />
          {/* Minimal time indicator — very subtle */}
          <div style={{
            position:"fixed", bottom:24,
            left:"50%", transform:"translateX(-50%)",
            zIndex:10, display:"flex", flexDirection:"column", alignItems:"center", gap:8,
          }}>
            <div style={{ width:120, height:2, background:"#0a1e35", borderRadius:2, overflow:"hidden" }}>
              <div style={{
                height:"100%", background:"#c8922a", borderRadius:2,
                width: `${progress * 100}%`,
                transition:"width 1s linear",
              }} />
            </div>
            <div style={{ color:"#1a3050", fontSize:11, letterSpacing:2 }}>
              {minsLeft}:{secsLeft}
            </div>
          </div>
        </>
      )}

      {/* DONE */}
      {screen === "done" && (
        <div style={{ textAlign:"center", animation:"fadeIn 1s ease", maxWidth:320, padding:"0 24px" }}>
          <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:28 }}>
            {DOT_COLORS.map((d, i) => (
              <div key={i} style={{
                width:10, height:10, borderRadius:"50%",
                background: d.color, opacity:0.5,
                boxShadow:`0 0 8px ${d.glow}`,
              }} />
            ))}
          </div>
          <h2 style={{ color:"#d0e4f8", fontWeight:300, fontSize:26, margin:"0 0 12px", letterSpacing:2 }}>
            Well done
          </h2>
          <p style={{ color:"#3a5a70", fontSize:15, lineHeight:1.9, margin:"0 0 40px" }}>
            Two minutes of stillness.<br />
            <span style={{ color:"#2a3a50", fontSize:13 }}>Notice how calm your eyes feel.</span>
          </p>
          <button onClick={startGame} style={{
            padding:"13px 44px", background:"transparent",
            border:"1px solid #7ec8ff66", borderRadius:50,
            color:"#d0e4f8", fontSize:15, cursor:"pointer",
            letterSpacing:3, fontFamily:FONT,
          }}>AGAIN</button>
        </div>
      )}
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [route, setRoute] = useState("home");

  return (
    <>
      <style>{globalCss}</style>
      {route === "home"    && <Home onSelect={setRoute} />}
      {route === "breathe" && <Breathe onBack={() => setRoute("home")} />}
      {route === "mantra"  && <Mantra onBack={() => setRoute("home")} />}
      {route === "release" && <Release onBack={() => setRoute("home")} />}
      {route === "follow"  && <Follow  onBack={() => setRoute("home")} />}
    </>
  );
}
