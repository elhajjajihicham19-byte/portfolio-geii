import fs from 'node:fs';
import path from 'node:path';
const pages=JSON.parse(fs.readFileSync('src/ancienPortfolio.json','utf8'));
const projects=pages.filter(p=>p.type==='projet');
const docs=pages.flatMap(p=>p.documents||[]);
const refs=[...new Set(pages.flatMap(p=>(p.images||[]).map(image=>image.src)).filter(Boolean))];
const missing=refs.filter(src=>src.startsWith('/legacy/')&&!fs.existsSync(path.join('public',src.slice(1))));
const incomplete=pages.filter(p=>!p.sections||p.sections.length===0||!(p.sections.some(s=>(s.blocs||[]).length)));
const reportPages=[6,9,10,11,14,15,16,17];
const missingBmsFigures=reportPages.map(p=>'public/assets/bms/rapport-page-'+String(p).padStart(2,'0')+'.webp').filter(file=>!fs.existsSync(file));
const counts={pages:pages.length,projects:projects.length,documents:docs.length,imageReferences:refs.length,missingImages:missing,missingBmsFigures,incompletePages:incomplete.map(p=>p.titre)};
console.log(JSON.stringify(counts,null,2));
if(pages.length!==20||projects.length!==12||docs.length!==27||missing.length||missingBmsFigures.length||incomplete.length){
 console.error('Vérification de la migration non validée. Consulter les données ci-dessus.');
 process.exit(1);
}
console.log('Migration documentaire et 8 figures originales du BMS vérifiées.');
