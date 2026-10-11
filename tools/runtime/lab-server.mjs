import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const runtime = path.join(root, '.research-cache/runtime');
const stateFile = path.join(runtime, 'lab-private.json');
const origin = 'http://127.0.0.1:18096';
const clientAuthorization = 'MediaBrowser Client="Wholphin Runtime Lab", Device="Windows host", DeviceId="wholphin-runtime-host", Version="1.0"';
const privateStateExists = fs.existsSync(stateFile);
let state = privateStateExists ? JSON.parse(fs.readFileSync(stateFile, 'utf8')) : { origin, username: 'WholphinLab', password: crypto.randomBytes(12).toString('hex') };

async function request(route, method = 'GET', body) {
  const response = await fetch(origin + route, {
    method, headers: { 'Content-Type': 'application/json', Authorization: clientAuthorization, ...(state.token ? { 'X-Emby-Token': state.token } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }), signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`${method} ${route.split('?')[0]} failed: HTTP ${response.status}`);
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
const save = () => fs.writeFileSync(stateFile, JSON.stringify(state, null, 2) + '\n');
const mode = process.argv[2] || 'status';

if (mode === 'setup') {
  const publicInfo = await request('/System/Info/Public');
  if (publicInfo.StartupWizardCompleted && !privateStateExists) throw new Error('The isolated server is configured but its private lab state is missing.');
  save();
  if (!publicInfo.StartupWizardCompleted) {
    await request('/Startup/Configuration', 'POST', { UICulture: 'en-US', MetadataCountryCode: 'US', PreferredMetadataLanguage: 'en' });
    await request('/Startup/User', 'POST', { Name: state.username, Password: state.password });
    await request('/Startup/RemoteAccess', 'POST', { EnableRemoteAccess: true, EnableAutomaticPortMapping: false });
    await request('/Startup/Complete', 'POST');
  }
  const login = await request('/Users/AuthenticateByName', 'POST', { Username: state.username, Pw: state.password });
  state.token = login.AccessToken;
  state.userId = login.User.Id;
  state.serverId = login.ServerId;
  save();
  const config = await request('/System/Configuration');
  await request('/System/Configuration', 'POST', { ...config, ServerName: 'Wholphin Runtime Lab' });
  await request(`/Users/${state.userId}/Configuration`, 'POST', { ...login.User.Configuration, AudioLanguagePreference: 'eng', SubtitleLanguagePreference: 'heb', SubtitleMode: 'Always', PlayDefaultAudioTrack: true });
  const folders = await request('/Library/VirtualFolders');
  if (!folders.some(folder => folder.Name === 'Wholphin Lab')) {
    await request('/Library/VirtualFolders?name=Wholphin%20Lab&collectionType=movies&refreshLibrary=false', 'POST', {
      LibraryOptions: { EnableRealtimeMonitor: false, EnableInternetProviders: false, EnableChapterImageExtraction: false, PathInfos: [{ Path: '/media' }], TypeOptions: [{ Type: 'Movie', MetadataFetchers: [], ImageFetchers: [] }] },
    });
  }
  await request('/Library/Refresh', 'POST');
  console.log(JSON.stringify({ server: 'Wholphin Runtime Lab', version: publicInfo.Version, origin, username: state.username, private_credentials: 'Stored only in excluded .research-cache/runtime/lab-private.json', scan: 'requested' }));
} else if (mode === 'items') {
  const result = await request(`/Users/${state.userId}/Items?Recursive=true&IncludeItemTypes=Movie&Fields=MediaSources,Path`);
  const items = result.Items.map(item => ({ id: item.Id, name: item.Name, path: item.Path, sources: item.MediaSources?.map(source => ({ id: source.Id, container: source.Container, streams: source.MediaStreams?.map(stream => ({ index: stream.Index, type: stream.Type, codec: stream.Codec, language: stream.Language, title: stream.Title, external: stream.IsExternal, default: stream.IsDefault })) })) }));
  fs.writeFileSync(path.join(runtime, 'lab-items.json'), JSON.stringify(items, null, 2) + '\n');
  console.log(JSON.stringify(items, null, 2));
} else if (mode === 'authorize') {
  const code = process.argv[3];
  if (!/^\d{6}$/.test(code || '')) throw new Error('Pass the six-digit Quick Connect code shown by the lab app.');
  const authorized = await request(`/QuickConnect/Authorize?code=${encodeURIComponent(code)}&userId=${state.userId}`, 'POST');
  console.log(JSON.stringify({ quick_connect_authorized: authorized }));
} else if (mode === 'sessions') {
  const sessions = await request('/Sessions');
  const output = sessions.map(session => ({ client: session.Client, device: session.DeviceName, user: session.UserName, item: session.NowPlayingItem?.Name, play_state: session.PlayState, last_activity: session.LastActivityDate }));
  console.log(JSON.stringify(output, null, 2));
} else {
  const info = await request('/System/Info/Public');
  console.log(JSON.stringify({ version: info.Version, configured: info.StartupWizardCompleted, server: info.ServerName, private_state_available: fs.existsSync(stateFile) }));
}
