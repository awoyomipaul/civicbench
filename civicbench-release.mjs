import {readFile,mkdir,writeFile} from 'node:fs/promises';import {resolve,dirname,sep} from 'node:path';
const root=resolve('.');const files=JSON.parse(await readFile('civicbench-source.json','utf8'));
for(const [name,file]of Object.entries(files)){const target=resolve(root,name);if(!target.startsWith(root+sep))throw new Error('Invalid source path');await mkdir(dirname(target),{recursive:true});await writeFile(target,file.encoding==='base64'?Buffer.from(file.content,'base64'):file.content);}
if(!process.argv.includes('--unpack'))await import('./scripts/build.mjs');
