import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { Letterbox, BRAND_BLACK, BRAND_CREAM } from "./components/Letterbox";
import { TrailerCaption, PunchWord } from "./components/TrailerText";
import { LogoReveal } from "./components/LogoReveal";
import { interFamily } from "../fonts";

export const TRAILER_FPS = 30;
export const TRAILER_DURATION_FRAMES = 870; // 29s

// Audio anchors (frames @30fps) derived from silence detect on voiceover.mp3
//   ~ 0     pre-roll silence
//   ~ 58    "Algo se viene."
//   ~ 124   "Voy a hacer algo que nadie te está contando."
//   ~ 277   "Cada flip."
//   ~ 309   "Cada error."
//   ~ 322   "Cada euro real."
//   ~ 405   "Sin filtros. Sin atajos."
//   ~ 590   (atmosphere / breath)
//   ~ 732   "¿Te vienes?"

export const Trailer: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BRAND_BLACK }}>
      <Audio src={staticFile("trailer/voiceover.mp3")} />

      {/* SCENE 1 — Pre-roll black with breath (0 - 45) */}
      <Sequence durationInFrames={45}>
        <Breath />
      </Sequence>

      {/* SCENE 2 — "Algo se viene" + REVENTA REAL graffiti (45 - 124) */}
      <Sequence from={45} durationInFrames={79}>
        <SceneIntro />
      </Sequence>

      {/* SCENE 3 — "Voy a hacer algo que nadie te está contando" (124 - 277) */}
      <Sequence from={124} durationInFrames={153}>
        <ScenePromise />
      </Sequence>

      {/* SCENE 4a/b/c — RAPID CUTS (277 - 405) */}
      <Sequence from={277} durationInFrames={32}>
        <RapidCut src="trailer/image5.jpg" word="CADA" highlight="FLIP" panFrom={-0.05} panTo={0.05} />
      </Sequence>
      <Sequence from={309} durationInFrames={32}>
        <RapidCut src="trailer/image4.jpg" word="CADA" highlight="ERROR" panFrom={0.05} panTo={-0.05} fill />
      </Sequence>
      <Sequence from={341} durationInFrames={64}>
        <RapidCut src="trailer/image2.jpg" word="CADA" highlight="EURO REAL" panFrom={-0.04} panTo={0.04} fill />
      </Sequence>

      {/* SCENE 5 — "Sin filtros · Sin atajos" (405 - 590) */}
      <Sequence from={405} durationInFrames={185}>
        <SceneCraft />
      </Sequence>

      {/* SCENE 6 — Atmosphere + sale confirmed close-up (590 - 732) */}
      <Sequence from={590} durationInFrames={142}>
        <SceneSale />
      </Sequence>

      {/* SCENE 7 — "¿Te vienes?" + LOGO REVEAL (732 - 870) */}
      <Sequence from={732} durationInFrames={42}>
        <SceneTeVienes />
      </Sequence>
      <Sequence from={760} durationInFrames={110}>
        <LogoReveal />
      </Sequence>

      {/* Transition flashes between major beats (subtle for trailer) */}
      {[45, 124, 277, 309, 341, 405, 590, 732].map((f, i) => (
        <Sequence key={i} from={f - 3} durationInFrames={8} layout="none">
          <SoftFlash />
        </Sequence>
      ))}

      {/* Global cinematic vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Top hint - subtle brand corner */}
      <TopBrand />

      {/* Bottom timecode-style ticker (very subtle, trailer feel) */}
      <BottomTick />
    </AbsoluteFill>
  );
};

const Breath: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 30, 45], [0.4, 0, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: "#050505",
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(244,237,224,0.12), transparent 50%)",
          opacity: op,
        }}
      />
    </AbsoluteFill>
  );
};

const SceneIntro: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={79}>
        <Letterbox src="trailer/image1.jpg" scaleFrom={1.05} scaleTo={1.15} panFrom={-0.02} panTo={0.02} fill />
      </Sequence>
      <Sequence from={6} durationInFrames={73} layout="none">
        <TrailerCaption text="Algo se viene." size={130} positionY="bottom" />
      </Sequence>
    </AbsoluteFill>
  );
};

const ScenePromise: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={153}>
        <Letterbox src="trailer/image3.jpg" panFrom={-0.08} panTo={0.08} scaleFrom={1.1} scaleTo={1.22} fill />
      </Sequence>
      <Sequence from={6} durationInFrames={70} layout="none">
        <TrailerCaption text="Algo que nadie te está contando." size={96} positionY="bottom" />
      </Sequence>
      <Sequence from={82} durationInFrames={71} layout="none">
        <TrailerCaption text="Voy a enseñarlo todo." size={106} positionY="bottom" />
      </Sequence>
    </AbsoluteFill>
  );
};

const RapidCut: React.FC<{
  src: string;
  word: string;
  highlight: string;
  panFrom?: number;
  panTo?: number;
  fill?: boolean;
}> = ({ src, word, highlight, panFrom = -0.05, panTo = 0.05, fill = false }) => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={64}>
        <Letterbox
          src={src}
          panFrom={panFrom}
          panTo={panTo}
          scaleFrom={1.1}
          scaleTo={1.2}
          fadeFrames={3}
          fill={fill}
        />
      </Sequence>
      <PunchWord text={word} highlight={highlight} size={170} delayFrames={2} />
    </AbsoluteFill>
  );
};

const SceneCraft: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Sub-scene A: image5 hands ritual + "Sin filtros." */}
      <Sequence durationInFrames={92}>
        <Letterbox src="trailer/image5.jpg" panFrom={-0.05} panTo={0.05} scaleFrom={1.08} scaleTo={1.18} fill />
      </Sequence>
      <Sequence from={6} durationInFrames={86} layout="none">
        <TrailerCaption text="Sin filtros." size={140} positionY="bottom" />
      </Sequence>

      {/* Sub-scene B: image4 sold-out store + "Sin atajos." */}
      <Sequence from={92} durationInFrames={93}>
        <Letterbox src="trailer/image4.jpg" panFrom={0.05} panTo={-0.05} scaleFrom={1.06} scaleTo={1.16} fill />
      </Sequence>
      <Sequence from={98} durationInFrames={87} layout="none">
        <TrailerCaption text="Sin atajos." size={140} positionY="bottom" />
      </Sequence>

      {/* Mid flash between A/B */}
      <Sequence from={89} durationInFrames={8} layout="none">
        <SoftFlash />
      </Sequence>
    </AbsoluteFill>
  );
};

const SceneSale: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={142}>
        <Letterbox src="trailer/image2.jpg" panFrom={-0.03} panTo={0.03} scaleFrom={1.12} scaleTo={1.25} fill />
      </Sequence>
      <Sequence from={20} durationInFrames={80} layout="none">
        <TrailerCaption text="esto es real." size={120} positionY="bottom" />
      </Sequence>
    </AbsoluteFill>
  );
};

const SceneTeVienes: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <TrailerCaption text="¿Te vienes?" size={170} positionY="center" />
    </AbsoluteFill>
  );
};

const SoftFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 2, 8], [0, 0.4, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: BRAND_CREAM,
        opacity: op,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};

const TopBrand: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(
    frame,
    [40, 70, TRAILER_DURATION_FRAMES - 200, TRAILER_DURATION_FRAMES - 130],
    [0, 0.6, 0.6, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: interFamily,
          color: BRAND_CREAM,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: op,
        }}
      >
        <span>REAL · RESELL</span>
        <span>TRAILER · 001</span>
      </div>
    </AbsoluteFill>
  );
};

const BottomTick: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(
    frame,
    [40, 70, TRAILER_DURATION_FRAMES - 200, TRAILER_DURATION_FRAMES - 130],
    [0, 0.45, 0.45, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const secs = Math.floor(frame / TRAILER_FPS)
    .toString()
    .padStart(2, "0");
  const cents = Math.floor((frame % TRAILER_FPS) * (100 / TRAILER_FPS))
    .toString()
    .padStart(2, "0");
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "ui-monospace, SF Mono, Monaco, monospace",
          color: BRAND_CREAM,
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: 3,
          opacity: op,
        }}
      >
        <span>● REC  00:{secs}:{cents}</span>
        <span>SOON</span>
      </div>
    </AbsoluteFill>
  );
};
