import ancienPortfolio from './ancienPortfolio.json';

/**
 * Les descriptifs, preuves et documents viennent de l'export de Google Sites.
 * Les catégories ajoutées servent uniquement à la navigation et ne constituent
 * pas une validation technique supplémentaire.
 */
const projectSettings = {
  'capteur-de-temperature': {
    field:'CAPTEURS & INSTRUMENTATION',chips:['LM335','Mesure de température','Écran LCD'],
    skills:['Concevoir','Vérifier']
  },
  'cblage-domestique': {
    field:'INSTALLATIONS ÉLECTRIQUES',chips:['NF C 15-100','Câblage','Contrôle'],
    skills:['Installer','Vérifier']
  },
  'd-lectronique': {
    field:'ÉLECTRONIQUE NUMÉRIQUE',chips:['Compteur modulo 6','Afficheur 7 segments','Logique'],
    skills:['Concevoir','Vérifier']
  },
  'dimensionnement-lectrique': {
    field:'DISTRIBUTION BASSE TENSION',chips:['Tableau électrique','Protection','Dimensionnement'],
    skills:['Concevoir','Vérifier']
  },
  'malaxeur': {
    field:'AUTOMATISME & MAINTENANCE',chips:['Automatisme','Mesures','Cahier de recette'],
    skills:['Vérifier','Maintenir']
  },
  'moteur-dc-pilot-par-bus-can': {
    field:'ÉLECTRONIQUE EMBARQUÉE',chips:['Bus CAN','Pont en H','Moteur CC'],
    skills:['Concevoir','Vérifier']
  },
  'rs510': {
    field:'ÉLECTROTECHNIQUE & VARIATEURS',chips:['RS510','Moteur asynchrone','Variateur'],
    skills:['Installer','Vérifier']
  },
  'retrofit-maquette-knx': {
    field:'DOMOTIQUE & AUTOMATISME',chips:['KNX','ETS6','Bus 29 V','Adressage'],
    skills:['Installer','Vérifier']
  },
  'robot-suiveur-de-ligne': {
    field:'ÉLECTRONIQUE ANALOGIQUE',chips:['Capteurs infrarouges','Commande moteur','Robotique'],
    skills:['Concevoir','Vérifier']
  },
  'testeur-de-batterie': {
    field:'ÉLECTRONIQUE & MESURE',chips:['Batterie','Comparateurs','Schéma fonctionnel'],
    skills:['Concevoir','Vérifier']
  }
};
const firstParagraph=page=>{
  for(const section of page.sections||[]){
    for(const block of section.blocs||[]){
      const text=(block.texte||'').trim();
      if(text.length>65 && block.type!=='puce')return text;
    }
  }
  return (page.sections||[]).flatMap(s=>s.blocs||[]).map(b=>b.texte).find(Boolean)||
    'Étude technique réalisée dans le cadre de la formation BUT GEII.';
};
const extractImages=page=>{
  const list=page.images||[];
  const selected=list.filter(image=>!image.partagee);
  // Les éléments graphiques communs (menus, logos, fonds) sont conservés dans
  // la source importée mais pas présentés comme preuves du montage.
  return selected.map((img,i)=>({
    image:img.src,
    title:'Illustration originale '+String(i+1).padStart(2,'0'),
    desc:'Photographie ou schéma provenant de la page « '+page.titre+' ».',
    source:'Portfolio Google Sites — export Takeout'
  }));
};
const extractDocs=page=>(page.documents||[]).map(d=>({
  label:d.titre||'Document technique original',
  url:d.url,
  type:'SOURCE GOOGLE DRIVE · ORIGINAL',
  original:true
}));
export function originalFor(name){
  return ancienPortfolio.find(p=>p.source===name+'.html')||null;
}
export function originalEvidence(page){return page?extractImages(page):[];}
export function originalDocuments(page){return page?extractDocs(page):[];}
export const legacyProjects=ancienPortfolio
  .filter(page=>page.type==='projet'&&page.source!=='BMS.html'&&page.source!=='Stage chez BETEM.html')
  .map((page,index)=>{
    const meta=projectSettings[page.id]||{field:'GÉNIE ÉLECTRIQUE & INFORMATIQUE INDUSTRIELLE',chips:['BUT GEII'],skills:['Concevoir','Vérifier']};
    const evidence=extractImages(page);
    return {
      id:'geii-'+page.id,
      name:page.titre,
      no:String(index+6).padStart(2,'0'),
      short:page.sections?.[0]?.titre||'Étude et réalisation technique',
      field:meta.field,
      period:'Projet universitaire · BUT GEII',
      description:firstParagraph(page),
      status:'Dossier original et pièces techniques consultables',
      color:'cyan',
      icon:'legacy',
      cover:evidence[0]?.image||null,
      chips:meta.chips,
      skills:meta.skills,
      metrics:[
        [String(page.sections?.length||0),'chapitres détaillés'],
        [String(evidence.length),'visuels spécifiques'],
        [String(page.documents?.length||0),'documents originaux']
      ],
      evidence,
      docs:extractDocs(page),
      legacyOnly:true,
      originalSections:page.sections||[],
      note:'Les textes et résultats de ce dossier sont issus de la version Google Sites. Les documents liés peuvent être consultés dans leur version d’origine. Les intitulés de compétences sont une classification pour la navigation et ne constituent pas une attestation de conformité.',
    };
  });
