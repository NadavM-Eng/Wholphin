// Public GitHub metadata only; no credentials or mutations.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const queries = [
  ['issues', 'repo:damontecres/Wholphin desktop'],
  ['issues', 'repo:damontecres/Wholphin browser'],
  ['issues', 'repo:damontecres/Wholphin "web"'],
  ['repositories', 'Wholphin web in:name,description fork:true'],
  ['repositories', 'Wholphin desktop in:name,description fork:true'],
  ['issues', 'repo:DonutWare/Fladder Hebrew'],
  ['issues', 'repo:DonutWare/Fladder "audio sync"'],
  ['issues', 'repo:DonutWare/Fladder "subtitle delay"'],
];
const results = await Promise.all(queries.map(async ([kind, query]) => {
  const url = `https://api.github.com/search/${kind}?q=${encodeURIComponent(query)}&per_page=10`;
  const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'Wholphin-browser-assessment' }, signal: AbortSignal.timeout(30000) });
  if (!response.ok) return { kind, query, status: response.status, error: 'Public search request failed. No absence conclusion can be drawn.' };
  const data = await response.json();
  return { kind, query, status: response.status, total_count: data.total_count, incomplete_results: data.incomplete_results,
    items: (data.items || []).map(item => ({
      number: item.number, title: item.title, full_name: item.full_name, url: item.html_url,
      state: item.state, created_at: item.created_at, updated_at: item.updated_at,
      pull_request: Boolean(item.pull_request),
    })),
  };
}));
const output = { research_date: '2026-10-11', scope: 'A scoped public repository and issue search, limited to the first ten results per query. Negative search results do not establish that no private, unindexed, renamed, or differently described port exists.', results };
fs.mkdirSync(path.join(root, 'research/generated'), { recursive: true });
fs.writeFileSync(path.join(root, 'research/generated/prior-art-search.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify(results.map(result => ({ query: result.query, status: result.status, total_count: result.total_count, items: result.items?.map(item => ({ number: item.number, title: item.title || item.full_name, state: item.state, url: item.url })) })), null, 2));
