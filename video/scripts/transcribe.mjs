import {
  installWhisperCpp,
  transcribe,
  downloadWhisperModel,
  convertToCaptions,
} from '@remotion/install-whisper-cpp';
import {execSync} from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const PROJECT = path.resolve(import.meta.dirname, '..');
const WHISPER_PATH = path.join(PROJECT, 'whisper.cpp');
const INPUT = path.join(PROJECT, 'public', 'input.mp4');
const WAV = path.join(PROJECT, 'public', 'input.wav');
const OUT = path.join(PROJECT, 'src', 'captions.json');
const MODEL = 'small';
const WHISPER_VERSION = '1.5.5';

await installWhisperCpp({to: WHISPER_PATH, version: WHISPER_VERSION});
await downloadWhisperModel({folder: WHISPER_PATH, model: MODEL});

if (!fs.existsSync(WAV)) {
  console.log('Extracting 16kHz mono WAV...');
  execSync(
    `ffmpeg -y -i "${INPUT}" -ar 16000 -ac 1 -c:a pcm_s16le "${WAV}"`,
    {stdio: 'inherit'},
  );
}

console.log('Transcribing...');
const {transcription} = await transcribe({
  inputPath: WAV,
  whisperPath: WHISPER_PATH,
  whisperCppVersion: WHISPER_VERSION,
  model: MODEL,
  tokenLevelTimestamps: true,
  language: 'auto',
  splitOnWord: true,
});

const {captions} = convertToCaptions({
  transcription,
  combineTokensWithinMilliseconds: 200,
});

fs.writeFileSync(OUT, JSON.stringify({captions}, null, 2));
console.log(`Wrote ${captions.length} captions → ${OUT}`);
