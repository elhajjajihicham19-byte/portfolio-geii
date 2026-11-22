import ancienPortfolio from './ancienPortfolio.json';
import { documentDisplayName } from './documentLabels.js';

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
// Les niveaux sont issus des pages GEII et, pour le malaxeur,
// du cahier de recette « SAE S2 » daté de mai 2025.
// Le dimensionnement domestique est présenté comme projet tutoré de BUT1.
const projectClassification={
  'capteur-de-temperature': {year:1, category:'tutored', nature:'PROJET TUTORÉ', metrics:[['0–50 °C','plage de mesure'],['LM335','capteur de température'],['STM32','contrôle et affichage']]},
  'cblage-domestique': {year:1, category:'applied', nature:'RÉALISATION PRATIQUE', metrics:[['2','espaces étudiés'],['Va-et-vient','commande éclairage'],['Télérupteur','commande d’éclairage']]},
  'd-lectronique': {year:1, category:'applied', nature:'RÉALISATION PRATIQUE', metrics:[['Modulo 6','compteur'],['1 à 6','valeurs affichées'],['7 segments','affichage']]},
  'dimensionnement-lectrique': {year:1, category:'tutored', nature:'PROJET TUTORÉ', metrics:[['3','rangées du tableau'],['30 mA','protection différentielle'],['NF C 15-100','référence de conception']],
    name:'Dimensionnement électrique domestique',
    description:'En BUT1, j’ai étudié l’installation électrique d’une habitation, réparti les circuits sur un tableau à trois rangées et choisi les protections adaptées aux différents usages.',
    status:'Étude de conception réalisée — vérifications à compléter'},
  'malaxeur': {year:1, category:'applied', nature:'SAE S2', metrics:[['≈ 36,7 s','temps de cycle'],['PH0–PH7','phases automatisées'],['PT100','mesure de température']]},
  'moteur-dc-pilot-par-bus-can': {year:2, category:'applied', nature:'SAE / ÉLECTRONIQUE EMBARQUÉE', metrics:[['0,10 A','commande moteur testée'],['80 mA','limitation relevée'],['CAN','trames étudiées']],status:'Essais sur carte pédagogique — mesures et écarts analysés'},
  'rs510': {year:2, category:'applied', nature:'RÉALISATION PRATIQUE', metrics:[['0–50 Hz','variation de fréquence'],['0–10 V','consigne analogique'],['RS510','variateur']]},
  'retrofit-maquette-knx': {year:2, category:'applied', nature:'RÉALISATION PRATIQUE', metrics:[['29 V DC','alimentation bus'],['ETS6','programmation'],['KNX','réseau domotique']]},
  'robot-suiveur-de-ligne': {year:1, category:'applied', nature:'SAE DOCUMENTÉE', metrics:[['≈ 967 Hz','fréquence PWM relevée'],['LM324','amplificateur'],['IR','détection de ligne']]},
  'testeur-de-batterie': {year:1, category:'applied', nature:'RÉALISATION PRATIQUE', metrics:[['5','fonctions électroniques'],['Comparateur','décision analogique'],['LED','indication d’état']]}
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
    title:'Illustration du projet '+String(i+1).padStart(2,'0'),
    desc:'Photographie ou schéma du projet « '+page.titre+' ».',
    source:'Dossier de projet GEII'
  }));
};
const extractDocs=page=>(page.documents||[]).map(d=>({
  label:documentDisplayName(d.titre,page.titre),
  url:d.url,
  type:'RAPPORT OU SCHÉMA',
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
    const classification=projectClassification[page.id]||{year:1,category:'applied',nature:'PROJET GEII',metrics:[]};
    return {
      id:'geii-'+page.id,
      category:classification.category,
      year:classification.year,
      nature:classification.nature,
      name:classification.name||page.titre,
      no:String(index+6).padStart(2,'0'),
      short:page.sections?.[0]?.titre||'Étude et réalisation technique',
      field:meta.field,
      period:(classification.category==='tutored'?'Projet tutoré':'Projet universitaire')+' · BUT'+classification.year,
      description:classification.description||firstParagraph(page),
      status:classification.status||'Travaux réalisés — démarche et résultats présentés',
      color:'cyan',
      icon:'legacy',
      cover:evidence[0]?.image||null,
      chips:meta.chips,
      skills:meta.skills,
      metrics:classification.metrics,
      evidence,
      docs:extractDocs(page),
      legacyOnly:true,
      note:'Les résultats et choix techniques sont analysés selon les conditions des essais. Les compétences associées décrivent les apprentissages mobilisés, sans attestation de conformité globale.',
    };
  });
