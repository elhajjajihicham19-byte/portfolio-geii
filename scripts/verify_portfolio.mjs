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
const cemFigureNames=[
  'filtre-accorde-schema',
  'filtre-accorde-chronogrammes',
  'filtre-accorde-spectres',
  'pfc-schema-boost',
  'pfc-commande-hysteresis',
  'pfc-bande-hysteresis',
  'pfc-chronogrammes',
];
const missingCemFigures=cemFigureNames
  .map(name=>'public/assets/cem/'+name+'.webp')
  .filter(file=>!fs.existsSync(file));

const technicalManifest=JSON.parse(fs.readFileSync('src/projectTechnicalEvidence.json','utf8'));
const studyPlan=JSON.parse(fs.readFileSync('scripts/project_figure_plan.json','utf8'));
const expectedStudies=studyPlan.length;
const expectedStudyFigures=studyPlan.reduce((count,project)=>count+project.files.reduce((n,source)=>n+source.pages.length,0),0);
const evidenceEntries=Object.entries(technicalManifest);
const evidenceFigures=evidenceEntries.flatMap(([project,images])=>images.map(item=>({project,...item})));
const missingStudyFigures=evidenceFigures
 .filter(item=>!item.image||!item.image.startsWith('/assets/studies/')||!fs.existsSync(path.join('public',item.image.slice(1))))
 .map(item=>({project:item.project,image:item.image}));
// Validation des couvertures et illustrations codées en dur, auparavant absentes
// des contrôles CI (notamment les projets sans photo sur Google Sites).
const imageSourceFiles=[
 'src/main.jsx','src/legacyProjects.js','src/BmsCaseStudy.jsx',
 'src/AppliedTechnicalStudy.jsx','src/BetemCaseStudy.jsx',
 'src/LegacyCaseStudy.jsx'
];
const codeImageRefs=[...new Set(imageSourceFiles.flatMap(file=>{
 const source=fs.readFileSync(file,'utf8');
 return [...source.matchAll(/\\/(?:assets|legacy)\\/[a-zA-Z0-9_./-]+\\.(?:webp|png|jpe?g)/g)].map(match=>match[0]);
}))];
const missingCoverFiles=codeImageRefs.filter(src=>!fs.existsSync(path.join('public',src.slice(1))));
const brokenCoverFiles=codeImageRefs.filter(src=>{
 const file=path.join('public',src.slice(1));
 if(!fs.existsSync(file))return false;
 const buf=fs.readFileSync(file);
 if(src.endsWith('.webp'))return buf.length<700||buf.toString('ascii',0,4)!=='RIFF'||buf.toString('ascii',8,12)!=='WEBP';
 return buf.length<700;
});

const invalidSourceFigures=evidenceFigures.filter(item=>!item.title||!item.desc||item.chapter<0||item.chapter>5);
const counts={pages:pages.length,projects:projects.length,documents:docs.length,imageReferences:refs.length,missingImages:missing,missingBmsFigures,missingCemFigures,coverReferences:codeImageRefs.length,missingCoverFiles,brokenCoverFiles,studyFigureCount:evidenceFigures.length,studyProjects:evidenceEntries.length,expectedStudies,expectedStudyFigures,missingStudyFigures,invalidSourceFigures:invalidSourceFigures.length,incompletePages:incomplete.map(p=>p.titre)};
console.log(JSON.stringify(counts,null,2));
if(pages.length!==20||projects.length!==12||docs.length!==27||missing.length||missingBmsFigures.length||missingCemFigures.length||missingCoverFiles.length||brokenCoverFiles.length||missingStudyFigures.length||invalidSourceFigures.length||evidenceEntries.length!==expectedStudies||evidenceFigures.length!==expectedStudyFigures||incomplete.length){
 console.error('Vérification de la migration non validée. Consulter les données ci-dessus.');
 process.exit(1);
}
console.log('Portfolio vérifié : figures BMS, simulations CEM et extraits authentiques des études GEII présents.');
