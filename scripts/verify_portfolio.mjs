import fs from 'node:fs';
import path from 'node:path';
const pages=JSON.parse(fs.readFileSync('src/ancienPortfolio.json','utf8'));
const projects=pages.filter(p=>p.type==='projet');
const docs=pages.flatMap(p=>p.documents||[]);
const refs=[...new Set(pages.flatMap(p=>(p.images||[]).map(image=>image.src)).filter(Boolean))];
const missing=refs.filter(src=>src.startsWith('/legacy/')&&!fs.existsSync(path.join('public',src.slice(1))));
const incomplete=pages.filter(p=>!p.sections||p.sections.length===0||!(p.sections.some(s=>(s.blocs||[]).length)));
const counts={pages:pages.length,projects:projects.length,documents:docs.length,imageReferences:refs.length,missingImages:missing,incompletePages:incomplete.map(p=>p.titre)};
console.log(JSON.stringify(counts,null,2));
if(pages.length!==20||projects.length!==12||docs.length!==27||missing.length||incomplete.length){
 console.error('Vérification de la migration non validée. Consulter les données ci-dessus.');
 process.exit(1);
}
console.log('Migration documentaire vérifiée.');
