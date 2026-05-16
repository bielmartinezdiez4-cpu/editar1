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

// Audio anchors (frames @30fps) derived from silencedetect:
//
//   frame  s     content
//   0      0.00  pre-roll silence
//   58     1.93  "Algo se viene."
//   124    4.12  "Voy a hacer algo…"
//   201    6.71  "…que nadie te está contando."
//   276    9.21  "Cada flip."
//   305    10.17 "Cada error."
//   322    10.75 "Cada euro real."
//   405    13.50 "Sin filtros."
//   489    16.30 "Sin atajos."
//   589    19.62 (atmosphere / continuation)
//   732    24.39 "¿Te vienes?"

export const Trailer: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BRAND_BLACK }}>
      <Audio src={staticFile("trailer/voiceover.mp3")} />

      {/* SCENE 1 — Pre-roll black with breath (0 - 58 = up to first word) */}
      <Sequence durationInFrames={58}>
        <Breath />
      </Sequence>

      {/* SCENE 2 — "Algo se viene." + REVENTA REAL graffiti (58 - 124) */}
      <Sequence from={58} durationInFrames={66}>
        <SceneIntro />
      </Sequence>

      {/* SCENE 3 — "Voy a hacer algo… / que nadie te está contando" (124 - 276) */}
      <Sequence from={124} durationInFrames={152}>
        <ScenePromise />
      </Sequence>

      {/* SCENE 4a — "CADA FLIP" (276 - 305) */}
      <Sequence from={276} durationInFrames={29}>
        <RapidCut
          src="trailer/image5.jpg"
          word="CADA"
          highlight="FLIP"
          panFrom={-0.05}
          panTo={0.05}
        />
      </Sequence>

      {/* SCENE 4b — "CADA ERROR" (305 - 322) */}
      <Sequence from={305} durationInFrames={17}>
        <RapidCut
          src="trailer/image4.jpg"
          word="CADA"
          highlight="ERROR"
          panFrom={0.05}
          panTo={-0.05}
          fill
        />
      </Sequence>

      {/* SCENE 4c — "CADA EURO REAL" (322 - 405) */}
      <Sequence from={322} durationInFrames={83}>
        <RapidCut
          src="trailer/image2.jpg"
          word="CADA"
          highlight="EURO REAL"
          panFrom={-0.04}
          panTo={0.04}
          fill
        />
      </Sequence>

      {/* SCENE 5a — "Sin filtros." (405 - 489) */}
      <Sequence from={405} durationInFrames={84}>
        <CraftPart
          src="trailer/image5.jpg"
          text="Sin filtros."
          panFrom={-0.05}
          panTo={0.05}
        />
      </Sequence>

      {/* SCENE 5b — "Sin atajos." (489 - 589) */}
      <Sequence from={489} durationInFrames={100}>
        <CraftPart
          src="trailer/image4.jpg"
          text="Sin atajos."
          panFrom={0.05}
          panTo={-0.05}
        />
      </Sequence>

      {/* SCENE 6 — Atmosphere + sale confirmed close-up (589 - 732) */}
      <Sequence from={589} durationInFrames={143}>
        <SceneSale />
      </Sequence>

      {/* SCENE 7 — "¿Te vienes?" on black (732 - 770) */}
      <Sequence from={732} durationInFrames={38}>
        <SceneTeVienes />
      </Sequence>

      {/* SCENE 8 — LOGO REVEAL (770 - 870) */}
      <Sequence from={770} durationInFrames={100}>
        <LogoReveal />
      </Sequence>

      {/* Transition flashes between major beats */}
      {[58, 124, 276, 305, 322, 405, 489, 589, 732, 770].map((f, i) => (
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

      <TopBrand />
      <BottomTick />
    </AbsoluteFill>
  );
};

const Breath: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 30, 58], [0.4, 0.1, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
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

// 66 frames — "Algo se viene." synced from frame 0 of this Sequence
const SceneIntro: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={66}>
        <Letterbox
          src="trailer/image1.jpg"
          scaleFrom={1.05}
          scaleTo={1.15}
          panFrom={-0.02}
          panTo={0.02}
          fill
        />
      </Sequence>
      <Sequence durationInFrames={66} layout="none">
        <TrailerCaption text="Algo se viene." size={130} positionY="bottom" />
      </Sequence>
    </AbsoluteFill>
  );
};

// 152 frames split into two captions:
//   0   "Voy a hacer algo…"    (matches audio onset 4.12s)
//   77  "…que nadie te está contando."  (matches audio onset 6.71s = +2.59s = +77 frames)
const ScenePromise: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={152}>
        <Letterbox
          src="trailer/image3.jpg"
          panFrom={-0.08}
          panTo={0.08}
          scaleFrom={1.1}
          scaleTo={1.22}
          fill
        />
      </Sequence>
      <Sequence durationInFrames={77} layout="none">
        <TrailerCaption text="Voy a hacer algo…" size={96} positionY="bottom" />
      </Sequence>
      <Sequence from={77} durationInFrames={75} layout="none">
        <TrailerCaption
          text="…que nadie te está contando."
          size={92}
          positionY="bottom"
        />
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
      <Letterbox
        src={src}
        panFrom={panFrom}
        panTo={panTo}
        scaleFrom={1.1}
        scaleTo={1.2}
        fadeFrames={3}
        fill={fill}
      />
      <PunchWord text={word} highlight={highlight} size={170} delayFrames={0} />
    </AbsoluteFill>
  );
};

const CraftPart: React.FC<{
  src: string;
  text: string;
  panFrom?: number;
  panTo?: number;
}> = ({ src, text, panFrom = -0.05, panTo = 0.05 }) => {
  return (
    <AbsoluteFill>
      <Letterbox
        src={src}
        panFrom={panFrom}
        panTo={panTo}
        scaleFrom={1.08}
        scaleTo={1.18}
        fadeFrames={4}
        fill
      />
      <TrailerCaption text={text} size={140} positionY="bottom" />
    </AbsoluteFill>
  );
};

// Atmosphere hold (143 frames = 4.77s) — no caption, just the SALE CONFIRMED
// image breathing while voiceover continues. The voice in this segment is what
// the user added between "Sin atajos." and "¿Te vienes?" — captions are
// intentionally absent to let the visual breathe (cinematic teaser pause).
const SceneSale: React.FC = () => {
  return (
    <AbsoluteFill>
      <Letterbox
        src="trailer/image2.jpg"
        panFrom={-0.03}
        panTo={0.03}
        scaleFrom={1.12}
        scaleTo={1.25}
        fill
      />
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
