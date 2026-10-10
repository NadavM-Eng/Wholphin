import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const candidates = [
  process.argv[2],
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].filter(Boolean);
const executable = candidates.find(candidate => fs.existsSync(candidate));
if (!executable) throw new Error('Pass a Chromium browser executable as the first argument.');
const cache = path.join(root, '.research-cache/browser-probe');
fs.mkdirSync(cache, { recursive: true });
const url = new URL(`file:///${path.join(root, 'tools/research/browser-capabilities.html').replaceAll('\\', '/')}`).href;
const output = execFileSync(executable, [
  '--headless=new', '--no-first-run', '--no-default-browser-check',
  `--user-data-dir=${path.join(cache, 'isolated-profile')}`,
  '--virtual-time-budget=10000', '--dump-dom', url,
], { cwd: root, encoding: 'utf8', timeout: 45000, windowsHide: true, maxBuffer: 4 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
fs.writeFileSync(path.join(cache, 'probe-dom.html'), output);
if (!output.includes('data-probe-complete="true"')) throw new Error('Browser probe did not finish. Inspect .research-cache/browser-probe/probe-dom.html.');
const content = output.match(/<pre id="result">([\s\S]*?)<\/pre>/)?.[1];
if (!content) throw new Error('Missing browser probe output.');
const decoded = content.replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
const result = { research_date: '2026-10-11', ...JSON.parse(decoded) };
fs.mkdirSync(path.join(root, 'research/generated'), { recursive: true });
fs.writeFileSync(path.join(root, 'research/generated/browser-capabilities.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
