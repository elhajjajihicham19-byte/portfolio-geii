import fs from 'node:fs';
import path from 'node:path';

const ROOT=process.cwd();
const join=(...parts)=>path.join(ROOT,...parts);
const errors=[];
const warnings=[];
const walk=directory=>fs.existsSync(join(directory))?
  fs.readdirSync(join(directory),{withFileTypes:true}).flatMap(entry=>{
    const current=path.posix.join(directory,entry.name);
    return entry.isDirectory()?walk(current):[current];
  }):[];
const sources=walk('src').filter(file=>/\.(jsx?|json|css)$/.test(file));
const publicFiles=walk('public');
const publicSet=new Set(publicFiles);
const read=file=>fs.readFileSync(join(file),'utf8');
const main=read('src/main.jsx');
const navigation=read('src/EdgeNavigation.jsx');
const html=read('index.html');

if(!/\blang="fr"/.test(html))errors.push('La langue fr manque dans index.html');
for(const required of ['name="description"','property="og:title"','property="og:description"','name="viewport"']){
  if(!html.includes(required))errors.push('Métadonnée absente : '+required);
}
if(!html.includes('src="/src/main.jsx"'))errors.push('Point d’entrée Vite introuvable');
if(!main.includes('function EnergyCore(')||main.includes('function ElectronHero(')){
  errors.push('Le noyau énergétique abstrait doit rester le composant de l’accueil');
}

const assetPattern=/\/(?:assets|legacy|documents)\/[A-Za-z0-9_./%()-]+\.(?:webp|png|jpe?g|svg|pdf|docx|xlsx?)/gi;
const foundAssets=[...new Set(sources.flatMap(file=>
  [...read(file).matchAll(assetPattern)].map(match=>match[0])
))];
for(const src of foundAssets){
  const normalized=decodeURI(src).replace(/^\//,'');
  if(!publicSet.has('public/'+normalized))errors.push('Ressource locale introuvable : '+src);
}

const imageFiles=publicFiles.filter(file=>/\.(webp|png|jpe?g)$/i.test(file));
const invalidImageFiles=[];
for(const file of imageFiles){
  const data=fs.readFileSync(join(file));
  const valid=/\.webp$/i.test(file)?
    data.length>=12&&data.toString('ascii',0,4)==='RIFF'&&data.toString('ascii',8,12)==='WEBP':
    /\.png$/i.test(file)?data.length>=8&&data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):
    data.length>=4&&data[0]===0xff&&data[1]===0xd8;
  if(!valid)invalidImageFiles.push(file);
}
if(invalidImageFiles.length)errors.push('Images illisibles : '+invalidImageFiles.join(', '));

const imageElements=sources.filter(file=>/\.jsx$/.test(file)).flatMap(file=>
  [...read(file).matchAll(/<img\b[\s\S]*?\/>/g)].map(match=>({file,tag:match[0]})
));
const missingAlts=imageElements.filter(item=>!/\balt\s*=/.test(item.tag));
if(missingAlts.length)errors.push('Balises img sans texte alternatif : '+missingAlts.map(x=>x.file).join(', '));

const externalNewTabs=sources.filter(file=>/\.jsx$/.test(file)).flatMap(file=>
  [...read(file).matchAll(/<a\b[\s\S]*?>/g)]
    .filter(match=>/target=["']_blank["']/.test(match[0]))
    .map(match=>({file,tag:match[0]}))
);
const missingRel=externalNewTabs.filter(item=>!/rel=["'][^"']*noopener/.test(item.tag));
if(missingRel.length)errors.push('Liens target=_blank sans noopener : '+missingRel.map(x=>x.file).join(', '));

const pageIds=new Set([...main.matchAll(/\bid=["']([A-Za-z][A-Za-z0-9_-]+)["']/g)].map(m=>m[1]));
const hrefTargets=[...main.matchAll(/href=["']#([\w-]+)["']/g)].map(m=>m[1]);
const sideNav=[...navigation.matchAll(/\bid:'([\w-]+)',label:/g)].map(m=>m[1]);
for(const target of new Set([...hrefTargets,...sideNav])){
  if(!pageIds.has(target))errors.push('Ancre de navigation sans section : #'+target);
}

if(!main.includes('inert={Boolean(project||zoom)}')){
  errors.push('Les contenus de fond doivent être inertes pendant une étude ouverte');
}
if(!main.includes('function trapDialogTab(')){
  errors.push('Le piège clavier pour les dialogues est absent');
}
if(!main.includes('frameloop={playing?\'always\':\'demand\'}')){
  errors.push('La pause du canvas WebGL hors écran a disparu');
}

const totalSize=publicFiles.reduce((sum,file)=>sum+fs.statSync(join(file)).size,0);
const largeFiles=publicFiles.filter(file=>fs.statSync(join(file)).size>3*1024*1024);
if(largeFiles.length)warnings.push('Fichiers de plus de 3 Mo : '+largeFiles.join(', '));

const builtIndex=join('dist','index.html');
let built=false;
if(fs.existsSync(builtIndex)){
  built=true;
  const build=fs.readFileSync(builtIndex,'utf8');
  if(!build.includes('/assets/'))errors.push('Le build Vite ne semble pas contenir les ressources compilées');
}

const report={
  sourcesInspected:sources.length,
  staticLinksChecked:foundAssets.length,
  imagesChecked:imageFiles.length,
  imgElementsChecked:imageElements.length,
  newTabLinksChecked:externalNewTabs.length,
  navigationAnchorsChecked:new Set([...hrefTargets,...sideNav]).size,
  publicAssetsMB:Number((totalSize/1048576).toFixed(2)),
  buildInspected:built,
  warnings,
  errors
};
console.log(JSON.stringify(report,null,2));
if(errors.length)process.exit(1);
console.log('Audit statique réussi. Les liens externes et le rendu aux résolutions réelles nécessitent un contrôle navigateur.');
