import { build } from '@deno/eszip';

const moduleURL =
	'https://raw.githubusercontent.com/fusionstrings/fusionstrings/refs/heads/creation/package/src/dom/home.ts';
const importmapURL =
	'https://raw.githubusercontent.com/fusionstrings/fusionstrings/refs/heads/creation/deno.json';
//'https://raw.githubusercontent.com/fusionstrings/fusionstrings/refs/heads/creation/package/src/dom/home.ts'
//const mod = 'server.ts'
const path = new URL('./home.ts', import.meta.url).href;
console.log(path);
async function main() {
	const eszip = await build([path], undefined, importmapURL);
	return await Deno.writeFile('path.eszip2.md', eszip);
	return eszip;
}

main();
