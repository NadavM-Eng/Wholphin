import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const runtime = path.join(root, '.research-cache/runtime');
const outputArgument = process.argv.find(value => value.startsWith('--output='));
const media = outputArgument ? path.resolve(root, outputArgument.slice(9)) : path.join(runtime, 'jellyfin/media');
if (!media.toLowerCase().startsWith(runtime.toLowerCase() + path.sep)) throw new Error('Fixture output must be inside the excluded runtime directory.');
const seconds = Number(process.argv.find(value => value.startsWith('--seconds='))?.slice(10) || 90);
if (!Number.isInteger(seconds) || seconds < 1 || seconds > 600) throw new Error('Use a fixture duration of 1–600 seconds.');
fs.mkdirSync(media, {recursive:true});
const baseline = path.join(media, 'Wholphin SDR Baseline.mp4');
const embedded = path.join(media, 'Wholphin Hebrew Embedded.mkv');
const srt = path.join(media, 'Wholphin SDR Baseline.heb.srt');
const ass = path.join(media, 'Wholphin SDR Baseline.heb.ass');
for (const [extension,destination] of [['srt',srt],['ass',ass]]) {
  if (!fs.existsSync(destination)) fs.copyFileSync(path.join(root, 'research/fixtures/hebrew-mixed.' + extension), destination, fs.constants.COPYFILE_EXCL);
}
function ffmpeg(args) {
  const result = spawnSync('ffmpeg', ['-hide_banner','-loglevel','warning','-nostdin','-n',...args], {encoding:'utf8'});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr || 'FFmpeg fixture generation failed');
}
if (!fs.existsSync(baseline)) {
  const font = process.platform === 'win32' ? "fontfile='C\\:/Windows/Fonts/consola.ttf':" : '';
  const overlay = `drawtext=${font}text='%{pts\\:hms}':x=8:y=8:fontcolor=yellow:fontsize=28:box=1:boxcolor=black@0.7`;
  ffmpeg(['-f','lavfi','-i',`testsrc2=size=1280x720:rate=30:duration=${seconds}`,'-f','lavfi','-i',`sine=frequency=440:sample_rate=48000:duration=${seconds}`,'-vf',overlay,'-af','volume=0.01','-c:v','libx264','-preset','ultrafast','-crf','24','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-metadata','title=Wholphin SDR Baseline','-metadata:s:a:0','language=eng','-movflags','+faststart',baseline]);
}
if (!fs.existsSync(embedded)) {
  ffmpeg(['-i',baseline,'-i',srt,'-i',ass,'-map','0:v:0','-map','0:a:0','-map','1:0','-map','2:0','-c','copy','-c:s:0','srt','-c:s:1','ass','-metadata','title=Wholphin Hebrew Embedded','-metadata:s:s:0','language=heb','-metadata:s:s:0','title=Hebrew SRT','-metadata:s:s:1','language=heb','-metadata:s:s:1','title=Hebrew ASS','-disposition:s:0','default','-disposition:s:1','0',embedded]);
}
console.log(JSON.stringify({directory:path.relative(root,media),files:[baseline,embedded,srt,ass].map(value=>({file:path.basename(value),bytes:fs.statSync(value).size})),existing_files:'retained without overwrite'}));
