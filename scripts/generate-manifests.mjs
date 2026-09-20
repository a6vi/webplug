import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const expo = JSON.parse(await readFile('app.json', 'utf8')).expo;
const metadata = JSON.parse(await readFile(path.join(root, 'metadata.json'), 'utf8'));
const updateUrl = new URL(expo.updates.url);
const baseUrl = new URL('.', updateUrl).href;
const runtimeVersion = expo.runtimeVersion?.policy === 'appVersion'
  ? expo.version
  : expo.runtimeVersion;

if (!runtimeVersion || typeof runtimeVersion !== 'string') {
  throw new Error('Cannot determine runtimeVersion from app.json');
}
if (!metadata.fileMetadata?.ios || !metadata.fileMetadata?.android) {
  throw new Error('dist/metadata.json must contain both ios and android exports');
}

const mime = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', ttf: 'font/ttf', otf: 'font/otf', xml: 'application/xml', json: 'application/json' };
const createdAt = new Date().toISOString();

async function asset(filePath, extension, launch = false) {
  const relative = filePath.replaceAll('\\', '/');
  if (relative.startsWith('/') || relative.split('/').includes('..')) throw new Error(`Invalid asset path: ${filePath}`);
  const bytes = await readFile(path.join(root, ...relative.split('/')));
  const hash = createHash('sha256').update(bytes).digest('base64url');
  const key = createHash('md5').update(bytes).digest('hex');
  const contentType = launch ? 'application/javascript' : mime[extension.toLowerCase()];
  if (!contentType) throw new Error(`Unsupported asset extension: ${extension}`);
  const servedPath = launch ? relative : `${relative}.${extension}`;
  if (!launch) await copyFile(path.join(root, ...relative.split('/')), path.join(root, ...servedPath.split('/')));
  return { hash, key, ...(launch ? {} : { fileExtension: `.${extension}` }), contentType, url: new URL(servedPath, baseUrl).href };
}

for (const platform of ['ios', 'android']) {
  const files = metadata.fileMetadata[platform];
  const launchAsset = await asset(files.bundle, 'bundle', true);
  const assets = await Promise.all(files.assets.map(item => asset(item.path, item.ext)));
  const fingerprint = createHash('sha256').update(JSON.stringify({ runtimeVersion, platform, launchAsset, assets })).digest('hex');
  const id = `${fingerprint.slice(0, 8)}-${fingerprint.slice(8, 12)}-${fingerprint.slice(12, 16)}-${fingerprint.slice(16, 20)}-${fingerprint.slice(20, 32)}`;
  const manifest = { id, createdAt, runtimeVersion, launchAsset, assets, metadata: {}, extra: { expoClient: expo } };
  const directory = path.join(root, platform);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`${platform}: dist/${platform}/manifest.json (${assets.length} assets, runtime ${runtimeVersion})`);
}

const nginx = `# Put the map in nginx's http block. Put the location in the myski.ski server block.\n# Upload dist contents to /var/www/html/appplug/ without deleting older hashed assets.\nmap "$http_expo_platform:$http_expo_runtime_version" $myski_manifest {\n    default "";\n    "ios:${runtimeVersion}" /appplug/ios/manifest.json;\n    "android:${runtimeVersion}" /appplug/android/manifest.json;\n}\n\n# Inside server { ... }:\nlocation = /appplug/manifest.json {\n    root /var/www/html;\n    if ($myski_manifest = "") { return 404; }\n    add_header expo-protocol-version 1 always;\n    add_header expo-sfv-version 0 always;\n    add_header expo-manifest-filters "" always;\n    add_header expo-server-defined-headers "" always;\n    add_header Cache-Control "private, max-age=0" always;\n    add_header Vary "expo-platform, expo-runtime-version" always;\n    default_type application/json;\n    try_files $myski_manifest =404;\n}\n\nlocation /appplug/_expo/ {\n    root /var/www/html;\n}\nlocation /appplug/assets/ {\n    root /var/www/html;\n}\n`;
await writeFile(path.join(root, 'nginx-expo-updates.conf'), nginx.replace(
  'location /appplug/_expo/ {',
  'location /appplug/_expo/ {\n    types { application/javascript hbc; }\n    default_type application/javascript;'
));
console.log('Nginx sample: dist/nginx-expo-updates.conf');
