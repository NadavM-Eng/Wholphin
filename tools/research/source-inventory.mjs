// Rebuild the assessment inventories from the immutable upstream baseline.
// No Android SDK or third-party npm packages are required.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const baseline = process.argv[2] || 'd6523ce856f7066c35bc9df8b514a8d6b876f06c';
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }).trim();
const commit = git('rev-parse', `${baseline}^{commit}`);
const tracked = git('ls-tree', '-r', '--name-only', commit).split('\n');
const roomSchemaFile = 'app/schemas/com.github.damontecres.wholphin.data.AppDatabase/35.json';
const baseStringsFile = 'app/src/main/res/values/strings.xml';
const hebrewStringsFile = 'app/src/main/res/values-iw/strings.xml';
const textFiles = tracked.filter(name => name.endsWith('.kt') || name.endsWith('.proto') || [roomSchemaFile, baseStringsFile, hebrewStringsFile].includes(name));
const batch = execFileSync('git', ['cat-file', '--batch'], {
  cwd: root, input: textFiles.map(name => `${commit}:${name}\n`).join(''), maxBuffer: 32 * 1024 * 1024,
});
const contents = new Map();
let cursor = 0;
for (const name of textFiles) {
  const headerEnd = batch.indexOf(10, cursor);
  if (headerEnd < 0) throw new Error(`Missing Git object header for ${name}`);
  const header = batch.subarray(cursor, headerEnd).toString('utf8');
  const size = Number(header.split(' ')[2]);
  if (!Number.isInteger(size) || size < 0) throw new Error(`Unexpected Git object header for ${name}`);
  const start = headerEnd + 1;
  contents.set(name, batch.subarray(start, start + size).toString('utf8'));
  cursor = start + size + 1;
}
const read = name => {
  if (!contents.has(name)) throw new Error(`No cached source for ${name}`);
  return contents.get(name);
};
const sourceUrl = (name, line) => `https://github.com/damontecres/Wholphin/blob/${commit}/${name}${line ? `#L${line}` : ''}`;
const lineAt = (text, offset) => text.slice(0, offset).split('\n').length;
const csv = (rows, columns) => [columns, ...rows.map(row => columns.map(column => row[column] ?? ''))]
  .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n') + '\n';
const output = path.join(root, 'research/generated');
fs.mkdirSync(output, { recursive: true });

const directories = new Map();
const kotlin = [];
const packagePrefix = 'app/src/main/java/com/github/damontecres/wholphin/';
for (const file of tracked) {
  const parts = file.split('/');
  for (let i = 1; i < parts.length; i++) {
    const directory = parts.slice(0, i).join('/');
    directories.set(directory, (directories.get(directory) || 0) + 1);
  }
  if (!file.endsWith('.kt')) continue;
  const text = read(file);
  const lines = text.replace(/\n$/, '').split('\n').length;
  const imports = [...text.matchAll(/^import\s+([^\r\n]+)/gm)].map(match => match[1]);
  const android = imports.filter(item => item.startsWith('android.'));
  const tv = imports.filter(item => item.startsWith('androidx.tv.'));
  const media3 = imports.filter(item => item.startsWith('androidx.media3.'));
  const hilt = imports.filter(item => item.startsWith('dagger.hilt.'));
  const java = imports.filter(item => item.startsWith('java.'));
  const androidx = imports.filter(item => item.startsWith('androidx.') && !item.startsWith('androidx.compose.'));
  kotlin.push({
    file, lines, source_url: sourceUrl(file),
    main_application: file.startsWith(packagePrefix),
    package_group: file.startsWith(packagePrefix) ? (file.slice(packagePrefix.length).includes('/') ? file.slice(packagePrefix.length).split('/')[0] : '(entry points)') : '(other)',
    android_imports: android, tv_imports: tv, media3_imports: media3,
    hilt_imports: hilt, java_imports: java, non_compose_androidx_imports: androidx,
    imports,
  });
}
const appKotlin = kotlin.filter(item => item.main_application);
const groups = [...new Set(appKotlin.map(item => item.package_group))].sort().map(group => {
  const files = appKotlin.filter(item => item.package_group === group);
  return { group, files: files.length, lines: files.reduce((sum, item) => sum + item.lines, 0) };
});

const protoFile = 'app/src/main/proto/WholphinDataStore.proto';
const proto = read(protoFile);
const schema = [];
const messages = [];
const enums = [];
for (const match of proto.matchAll(/^message\s+(\w+)\s*\{([\s\S]*?)^\}/gm)) {
  const message = match[1];
  const bodyOffset = match.index + match[0].indexOf('{') + 1;
  const fields = [];
  for (const field of match[2].matchAll(/^\s*((?:repeated\s+)?\w+|map\s*<[^>]+>)\s+(\w+)\s*=\s*(\d+)\s*(\[[^\]]*\])?\s*;/gm)) {
    const line = lineAt(proto, bodyOffset + field.index + field[0].search(/\S/));
    const row = { message, field: field[2], type: field[1], tag: Number(field[3]), deprecated: Boolean(field[4]?.includes('deprecated = true')), source_line: line, source_url: sourceUrl(protoFile, line) };
    schema.push(row);
    fields.push(row.field);
  }
  messages.push({ message, fields });
}
for (const match of proto.matchAll(/^enum\s+(\w+)\s*\{([\s\S]*?)^\}/gm)) {
  enums.push({ name: match[1], values: [...match[2].matchAll(/(\w+)\s*=\s*(-?\d+)\s*;/g)].map(value => ({ name: value[1], value: Number(value[2]) })), source_url: sourceUrl(protoFile, lineAt(proto, match.index)) });
}

// Lexical records, not a Kotlin interpreter: default expressions remain expressions.
const preferenceFiles = tracked.filter(file => file.startsWith(`${packagePrefix}preferences/`) && file.endsWith('.kt'));
const controls = [];
for (const file of preferenceFiles) {
  const text = read(file);
  const starts = [...text.matchAll(/^(\s*)val\s+(\w+)\s*=\s*\r?\n?\s*(App\w*Preference)(?:<[^\r\n]+>)?\(/gm)];
  for (const match of starts) {
    const nextVal = text.slice(match.index + match[0].length).search(new RegExp(`^${match[1].replace(/[\r\n]/g, '')}val\\s`, 'm'));
    const end = nextVal < 0 ? text.length : match.index + match[0].length + nextVal;
    const block = text.slice(match.index, end);
    const line = lineAt(text, match.index + match[0].search(/\S/));
    controls.push({
      name: match[2], control_type: match[3], file, source_line: line,
      title_resource: block.match(/title\s*=\s*R\.string\.(\w+)/)?.[1] || '',
      default_expression: block.match(/defaultValue\s*=\s*([^\r\n]+)/)?.[1]?.replace(/,\s*$/, '') || '',
      source_url: sourceUrl(file, line),
    });
  }
}

const modelFiles = tracked.filter(file => file.startsWith(`${packagePrefix}data/model/`) && file.endsWith('.kt'));
const persistedCandidates = [];
for (const file of modelFiles) {
  const text = read(file);
  if (!/@Entity|@Serializable/.test(text)) continue;
  for (const match of text.matchAll(/^\s*(?:@\w+(?:\([^\r\n]*\))?\s+)?(?:override\s+)?val\s+(\w+)\s*:\s*([^\r\n]+)/gm)) {
    const line = lineAt(text, match.index + match[0].search(/\S/));
    persistedCandidates.push({ file, property: match[1], declaration: match[2].trim(), source_line: line, source_url: sourceUrl(file, line) });
  }
}
const keyValueUses = [];
for (const item of appKotlin) {
  const text = read(item.file);
  for (const match of text.matchAll(/keyValueService\s*\.\s*(?:get|save)/g)) {
    const line = lineAt(text, match.index);
    keyValueUses.push({ file: item.file, source_line: line, source_url: sourceUrl(item.file, line), excerpt: text.slice(match.index, match.index + 180).replaceAll('\r', '').replaceAll('\n', ' ') });
  }
}

const roomSchema = JSON.parse(read(roomSchemaFile)).database;
const roomFields = roomSchema.entities.flatMap(entity => entity.fields.map(field => ({
  table: entity.tableName, field_path: field.fieldPath, column: field.columnName,
  sql_type: field.affinity, not_null: field.notNull,
  primary_key: entity.primaryKey.columnNames.includes(field.columnName),
  default_value: field.defaultValue ?? '', source_url: sourceUrl(roomSchemaFile),
})));
const strings = text => [...text.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<string(?=\s|>)([^>]*)>/g)].flatMap(match => {
  const name = match[1].match(/\bname="([^"]+)"/)?.[1];
  return name ? [{ name, translatable: !/\btranslatable="false"/.test(match[1]) }] : [];
});
const baseStrings = strings(read(baseStringsFile));
const hebrewStrings = strings(read(hebrewStringsFile));
const hebrewNames = new Set(hebrewStrings.map(item => item.name));
const localization = {
  scope: 'String elements in the two strings.xml files only, excluding XML comments. Missing keys may be non-translatable or intentionally use Android fallback. This does not measure plurals, arrays, all resource variants, text entry, RTL layout, fonts, or subtitle rendering.',
  baseline_commit: commit, base_strings: baseStrings.length, hebrew_strings: hebrewStrings.length,
  missing_hebrew_keys: baseStrings.filter(item => !hebrewNames.has(item.name)),
  base_source_url: sourceUrl(baseStringsFile), hebrew_source_url: sourceUrl(hebrewStringsFile),
};

const inventory = {
  baseline_commit: commit, research_date: '2026-10-11',
  upstream: 'https://github.com/damontecres/Wholphin',
  methodology: 'Tracked baseline files only. Counts are lexical evidence, not build or runtime verification. Import categories overlap. Persisted property candidates include computed/runtime members and need manual interpretation. UI controls can navigate or perform actions rather than store a scalar setting.',
  totals: {
    tracked_files: tracked.length, kotlin_files: kotlin.length,
    main_kotlin_files: appKotlin.length, main_kotlin_lines: appKotlin.reduce((sum, item) => sum + item.lines, 0),
    main_files_importing_android: appKotlin.filter(item => item.android_imports.length).length,
    main_files_importing_tv: appKotlin.filter(item => item.tv_imports.length).length,
    main_files_importing_media3: appKotlin.filter(item => item.media3_imports.length).length,
    main_files_importing_hilt: appKotlin.filter(item => item.hilt_imports.length).length,
    main_files_importing_java: appKotlin.filter(item => item.java_imports.length).length,
    main_files_importing_non_compose_androidx: appKotlin.filter(item => item.non_compose_androidx_imports.length).length,
    proto_messages: messages.length, proto_fields: schema.length, proto_enums: enums.length,
    proto_deprecated_fields: schema.filter(item => item.deprecated).length,
    scanned_preference_controls: controls.length,
    room_schema_version: roomSchema.version, room_tables: roomSchema.entities.length,
    room_columns: roomFields.length,
  },
  package_groups: groups, messages, enums, kotlin_files: kotlin, preference_controls: controls, key_value_call_sites: keyValueUses,
  room_tables: roomSchema.entities.map(entity => ({ table: entity.tableName, columns: entity.fields.length })),
  localization,
};
fs.writeFileSync(path.join(output, 'source-inventory.json'), JSON.stringify(inventory, null, 2) + '\n');
fs.writeFileSync(path.join(output, 'directory-inventory.csv'), csv([...directories].sort(([a], [b]) => a.localeCompare(b)).map(([directory, tracked_descendant_files]) => ({ directory, tracked_descendant_files, source_url: `https://github.com/damontecres/Wholphin/tree/${commit}/${directory}` })), ['directory', 'tracked_descendant_files', 'source_url']));
fs.writeFileSync(path.join(output, 'settings-schema.csv'), csv(schema, ['message', 'field', 'type', 'tag', 'deprecated', 'source_line', 'source_url']));
fs.writeFileSync(path.join(output, 'settings-controls.csv'), csv(controls, ['name', 'control_type', 'title_resource', 'default_expression', 'file', 'source_line', 'source_url']));
fs.writeFileSync(path.join(output, 'persisted-model-properties.csv'), csv(persistedCandidates, ['file', 'property', 'declaration', 'source_line', 'source_url']));
fs.writeFileSync(path.join(output, 'room-schema.csv'), csv(roomFields, ['table', 'field_path', 'column', 'sql_type', 'not_null', 'primary_key', 'default_value', 'source_url']));
const schemaMarkdown = [
  '# Wholphin persisted preference schema', '',
  `Generated from upstream commit \`${commit}\` by \`tools/research/source-inventory.mjs\`.`, '',
  'These are schema declarations, including nested objects, identifiers and deprecated fields. Runtime defaults come from AppPreferencesSerializer, preference declarations and upgrade logic, not only proto3 defaults.', '',
  ...messages.flatMap(message => [
    `## ${message.message}`, '', '| Field | Type | Tag | Deprecated | Source |', '| --- | --- | ---: | --- | --- |',
    ...schema.filter(field => field.message === message.message).map(field => `| \`${field.field}\` | \`${field.type}\` | ${field.tag} | ${field.deprecated ? 'Yes' : 'No'} | [Line ${field.source_line}](${field.source_url}) |`), '',
  ]),
  '## Enumerations', '',
  ...enums.flatMap(item => [`### ${item.name}`, '', `[Definition](${item.source_url}).`, '', ...item.values.map(value => `- \`${value.name}\` = ${value.value}`), '']),
].join('\n');
fs.writeFileSync(path.join(output, 'settings-schema.md'), schemaMarkdown.trimEnd() + '\n');
const roomMarkdown = [
  '# Wholphin database schema', '', `Generated from upstream commit \`${commit}\`, Room schema version ${roomSchema.version}.`, '',
  'Columns include identifiers and authentication metadata. The schema also stores serialized JSON objects whose inner fields are defined in Kotlin. Never put real stored credentials into a research fixture.', '',
  ...roomSchema.entities.flatMap(entity => [
    `## ${entity.tableName}`, '', '| Property | Column | SQLite type | Nullable | Primary key |', '| --- | --- | --- | --- | --- |',
    ...roomFields.filter(field => field.table === entity.tableName).map(field => `| \`${field.field_path}\` | \`${field.column}\` | ${field.sql_type} | ${field.not_null ? 'No' : 'Yes'} | ${field.primary_key ? 'Yes' : 'No'} |`), '',
  ]), `[Original schema](${sourceUrl(roomSchemaFile)}).`, '',
].join('\n');
fs.writeFileSync(path.join(output, 'room-schema.md'), roomMarkdown);
fs.writeFileSync(path.join(output, 'localization-string-keys.json'), JSON.stringify(localization, null, 2) + '\n');
console.log(JSON.stringify({ commit, totals: inventory.totals, package_groups: groups, messages: messages.map(item => ({ name: item.message, fields: item.fields.length })), key_value_call_sites: keyValueUses.length }, null, 2));
