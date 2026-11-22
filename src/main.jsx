import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowUpRight, ArrowDown, ArrowLeft, X, Zap, Cpu, CircuitBoard, Download, ExternalLink, Layers, GraduationCap, FileText, CheckCircle2, AlertCircle, BriefcaseBusiness, Wrench, Microscope, ChevronRight, Link2, ShieldCheck, Sun, MapPin, Mail } from 'lucide-react';
import { legacyProjects, originalFor, originalEvidence, originalDocuments } from './legacyProjects.js';
import BmsCaseStudy from './BmsCaseStudy.jsx';
import PvCaseStudy from './PvCaseStudy.jsx';
import LegacyCaseStudy from './LegacyCaseStudy.jsx';
import AppliedTechnicalStudy from './AppliedTechnicalStudy.jsx';
import BetemCaseStudy from './BetemCaseStudy.jsx';
import ancienPortfolio from './ancienPortfolio.json';
import './style.css';
gsap.registerPlugin(ScrollTrigger);

const REFERENTIEL = 'https://www.enseignementsup-recherche.gouv.fr/sites/default/files/2023-12/g-nie-lectrique-et-informatique-industrielle-30834.pdf';

const projects = [
  {
    id:'bms', no:'01', name:'Battery Management System', short:'Conception et diagnostic d’un BMS Li-ion 4S', field:'ÉLECTRONIQUE & STOCKAGE', period:'Projet tutoré · BUT2',
    description:'Conception d’une carte électronique dédiée à la gestion d’une batterie Li-ion à quatre cellules en série, puis recherche des causes d’un fonctionnement non conforme.',
    status:'Essais non validés — diagnostic documenté', color:'cyan', icon:'bms', chips:['KiCad','Li-ion 4S','ML5243','MOSFET','Diagnostic'],
    metrics:[['4S','cellules en série'],['≈ 15 V','tension du pack mesurée'],['0 V','sortie observée sous charge']],
    context:'La gestion d’un accumulateur Li-ion exige un contrôle de la tension des cellules, un suivi du courant et la commande des interrupteurs de charge et de décharge. Le circuit de gestion étudié est le ML5243.',
    role:'Participation à l’étude du fonctionnement, à la conception électronique sous KiCad, aux mesures et à l’analyse des écarts entre le comportement théorique et les essais.',
    method:[
      'Définition de l’architecture 4S et étude du rôle de la carte de protection.',
      'Analyse de la commande des MOSFET Q3 et Q4 montés tête-bêche côté négatif.',
      'Mesure des tensions batterie, sortie, grille-source et résistance de détection.',
      'Comparaison des valeurs montées avec la nomenclature prévue.'
    ],
    results:'La sortie est restée à 0 V sous charge alors que la tension de batterie était voisine de 15 V. L’analyse a mis en évidence un shunt implanté de 1 kΩ au lieu de 1 mΩ. Cette erreur de valeur remet en cause la mesure du courant et la commande attendue : le système n’a pas été validé fonctionnellement.',
    critique:'Le principal apprentissage a été de distinguer une carte conçue d’une carte vérifiée. Une revue de nomenclature et des contrôles hors tension avant les essais auraient dû être systématiques. Une nouvelle série de mesures serait nécessaire après correction du montage.',
    skills:['Concevoir','Vérifier','Maintenir (diagnostic)'],
    evidence:[],
    note:'Les schémas KiCad, les photographies du PCB et les mesures sont présentés dans l’étude technique. Les essais de charge et de décharge n’ont pas validé le fonctionnement.'
  },
  {
    id:'betem', no:'02', name:'Études électriques — BETEM', short:'École Jean Macé à Sète · CFO / CFA', field:'BUREAU D’ÉTUDES & DISTRIBUTION', period:'Stage de 10 semaines · avril à juin 2026',
    description:'Contribution aux études d’installations électriques d’un établissement scolaire : bilans de puissance, implantations, modélisation et vérifications techniques.',
    status:'Études réalisées en bureau d’études', color:'blue', icon:'building', chips:['AutoCAD','Revit','Caneco BT','DIALux evo','CFO/CFA'],
    metrics:[['199 kVA','bilan TGBT du dossier'],['230/400 V','réseau triphasé BT'],['10 semaines','immersion professionnelle']],
    context:'Au sein de BETEM Montpellier, le projet portait notamment sur une installation électrique basse tension dans un bâtiment ERP. Les études couvrent le courant fort, le courant faible, les tableaux de distribution et l’éclairage.',
    role:'Travaux sur les plans d’implantation, les documents techniques, les synoptiques, les bilans de puissance et les simulations d’éclairage, avec les outils utilisés par le bureau d’études.',
    method:[
      'Lecture des pièces de projet et repérage des équipements CFO/CFA.',
      'Répartition des puissances par tableau et vérification de la cohérence du bilan.',
      'Participation aux études d’éclairement et à l’implantation des luminaires.',
      'Mise à jour de plans, légendes et documents avec AutoCAD et Revit.',
      'Approche du dimensionnement des circuits et des protections avec Caneco BT.'
    ],
    results:'Cette expérience m’a permis de relier les exigences techniques et réglementaires aux livrables d’un bureau d’études. J’ai mieux compris l’articulation entre notes de calcul, plans, pièces écrites et coordination des intervenants.',
    critique:'Un plan ne suffit pas à lui seul à prouver la qualité d’une étude. Les vérifications croisées entre documents et une gestion rigoureuse des indices constituent des points de vigilance. Je souhaite approfondir la sélectivité, les courants de court-circuit et l’exploitation des réseaux HTA/BT.',
    skills:['Concevoir','Vérifier','Installer (études préparatoires)'],
    evidence:[{image:'/assets/betem-plan-extrait-reel.webp',title:'Extrait authentique du plan d’implantation',desc:'Plan d’études CFO/CFA du stage BETEM — diffusion autorisée',source:'Document de travail BETEM'}],
    note:'Les documents et extraits de plans présentés ont été validés pour publication par BETEM.'
  },
  {
    id:'pv', no:'03', name:'Étude photovoltaïque', short:'Autoconsommation, surplus et stockage', field:'TRANSITION ÉNERGÉTIQUE', period:'Projet tutoré · BUT3',
    description:'Étude comparative d’une installation photovoltaïque résidentielle selon la puissance du champ, le profil de consommation, l’architecture de conversion et le stockage.',
    status:'Étude en cours — hypothèses à confirmer', color:'violet', icon:'solar', chips:['SAM','PVGIS','3 / 6 kWc','Micro-onduleurs','Batterie'],
    metrics:[['3 / 6 kWc','variantes à étudier'],['10 kWh','batterie envisagée'],['Été / hiver','profils de charge']],
    context:'Pour un même logement, l’objectif est de comparer la vente du surplus et le stockage sur batterie à partir de profils de consommation identiques et d’hypothèses explicites.',
    role:'Construction de la méthode d’étude : définition du logement de référence, bilan d’énergie par usage, comparaison des profils saisonniers et scénarios à simuler.',
    method:[
      'Établissement du bilan de consommation par appareil et par plage horaire.',
      'Création de profils représentatifs été/hiver, jours ouvrés/week-end.',
      'Étude de la ressource solaire et de la configuration des toitures avec PVGIS.',
      'Comparaison sous SAM de scénarios autoconsommation / revente / batterie.',
      'Étude des différences entre onduleur centralisé et micro-onduleurs.'
    ],
    results:'Le document de cadrage et la méthode de comparaison sont établis. Les performances énergétiques et économiques définitives restent à calculer ; aucun gain de stockage ou de rentabilité n’est annoncé à ce stade.',
    critique:'La qualité des conclusions dépendra surtout des données de consommation et du réalisme des hypothèses. Il faudra distinguer les résultats simulés des mesures et effectuer une étude de sensibilité sur les prix, les rendements et les profils de charge.',
    skills:['Concevoir','Vérifier','Installer (pré-étude)'],
    evidence:[],
    docs:[{label:'Document de cadrage photovoltaïque',url:'/documents/Etude-photovoltaique-cadrage.docx',type:'DOCX · document de travail'}],
    note:'Les valeurs de puissance et de stockage sont des scénarios envisagés, pas des installations réalisées. Le document original est disponible ci-dessous.'
  },
  {
    id:'cem', no:'04', name:'Compatibilité électromagnétique', short:'Harmoniques d’un redresseur et stratégies de filtrage', field:'ÉLECTRONIQUE DE PUISSANCE', period:'Travaux pratiques · BUT3',
    description:'Étude par simulation des perturbations harmoniques provoquées par un pont redresseur alimentant une charge capacitive et analyse de techniques de réduction.',
    status:'Compte rendu technique et simulations disponibles', color:'cyan', icon:'cem', chips:['PSIM','CEM','Redressement','FFT','Filtrage','PFC'],
    metrics:[['50 Hz','fréquence réseau'],['4 diodes','pont redresseur'],['34 p.','compte rendu fourni']],
    context:'Un redresseur à diodes avec filtrage capacitif prélève un courant fortement non sinusoïdal sur le réseau. Cette déformation engendre des composantes harmoniques et modifie le facteur de puissance.',
    role:'Étude des formes d’onde, interprétation des courants de recharge du condensateur et comparaison de solutions de filtrage passif et actif dans le compte rendu de TP.',
    method:[
      'Simulation du redresseur monophasé double alternance et de la charge capacitive.',
      'Observation des pics de courant en entrée et de l’ondulation de la tension continue.',
      'Analyse fréquentielle des courants et repérage des harmoniques.',
      'Comparaison de l’ajout d’une inductance, des filtres et d’une structure PFC.',
      'Synthèse des performances et des limites des solutions étudiées.'
    ],
    results:'Les figures originales montrent le courant absorbé par impulsions et un spectre harmonique significatif. Les solutions de filtrage permettent d’étudier la diminution de cette distorsion et leurs compromis techniques.',
    critique:'La simulation permet d’isoler les phénomènes, mais ne reproduit pas toutes les non-idéalités d’une installation réelle. Une validation expérimentale devrait inclure mesures de THD, facteur de puissance et comportement thermique.',
    skills:['Vérifier','Concevoir'],
    evidence:[
      {image:'/assets/cem-schema-reel.webp',title:'Schéma réel du montage de redressement',desc:'Extrait du compte rendu de TP CEM, page 2',source:'Compte rendu de TP'},
      {image:'/assets/cem-oscillogramme-reel.webp',title:'Formes d’onde simulées',desc:'Extrait du compte rendu, page 10',source:'Simulation'},
      {image:'/assets/cem-spectre-reel.webp',title:'Analyse des composantes harmoniques',desc:'Extrait du compte rendu, page 15',source:'Simulation'},
      {image:'/assets/cem-filtrage-reel.webp',title:'Étude d’un filtrage',desc:'Extrait du compte rendu, page 20',source:'Simulation'}
    ],
    docs:[{label:'Compte rendu complet — CEM et harmoniques',url:'/documents/TP-CEM-Hicham-El-Hajjaji.pdf',type:'PDF · 34 pages'}]
  },
  {
    id:'dialux', no:'05', name:'Étude d’éclairage sous DIALux', short:'Dimensionnement, éclairement et uniformité', field:'ÉCLAIRAGE & PERFORMANCE', period:'Travaux pratiques · BUT3',
    description:'Modélisation de locaux, choix des luminaires, calcul d’éclairement et étude de l’uniformité pour comparer plusieurs implantations.',
    status:'Captures de calcul réelles disponibles', color:'green', icon:'lighting', chips:['DIALux evo','NF EN 12464-1','ISOLUX','Uniformité','Puissance'],
    metrics:[['9','luminaires retenus'],['261,9 W','puissance de la variante'],['8 vs 9','solutions étudiées']],
    context:'L’étude concerne une salle d’enseignement et un hall. Le nombre et la position des luminaires doivent répondre à des critères d’éclairement, d’uniformité et de maîtrise de l’énergie.',
    role:'Modélisation des locaux, mise en place de luminaires, réalisation des calculs DIALux et interprétation des résultats des variantes.',
    method:[
      'Définition des dimensions des pièces et des propriétés des surfaces.',
      'Implantation de neuf luminaires (3 × 3) dans la salle puis simulation.',
      'Essai d’une variante à huit luminaires (2 × 4).',
      'Comparaison des résultats d’éclairement, d’uniformité et de puissance installée.',
      'Étude du hall avec attention portée au profil d’utilisation retenu.'
    ],
    results:'Pour la salle, la variante à huit luminaires diminue la puissance, mais l’uniformité devient insuffisante (inférieure à 0,60 dans le compte rendu). Le choix des neuf luminaires a été conservé. Le hall nécessite de revoir l’uniformité et le profil de calcul.',
    critique:'Le logiciel donne une aide à la décision, mais le choix du bon profil d’utilisation et la vérification des hypothèses sont indispensables. Un calcul de lumière ne remplace pas un relevé sur site.',
    skills:['Concevoir','Vérifier'],
    evidence:[
      {image:'/assets/dialux-reel-1.webp',title:'Répartition des neuf luminaires',desc:'Capture originale DIALux issue du compte rendu',source:'Compte rendu DIALux'},
      {image:'/assets/dialux-reel-2.webp',title:'Variante à huit luminaires',desc:'Capture originale DIALux issue du compte rendu',source:'Compte rendu DIALux'},
      {image:'/assets/dialux-reel-4.webp',title:'Étude du hall',desc:'Capture originale DIALux issue du compte rendu',source:'Compte rendu DIALux'},
      {image:'/assets/dialux-reel-5.webp',title:'Bilan énergétique',desc:'Capture originale DIALux issue du compte rendu',source:'Compte rendu DIALux'}
    ],
    docs:[{label:'Compte rendu DIALux (document de travail)',url:'/documents/Compte-rendu-DIALux.docx',type:'DOCX · version de travail'}]
  },
];



/* Tous les projets sont intégrés à la même galerie : 5 études commentées
   + 10 dossiers historiques complets, avec des preuves et sources originales. */
const originalBMS = originalFor('BMS');
const originalBETEM = originalFor('Stage chez BETEM');
for(const [project,archive] of [[projects[0],originalBMS],[projects[1],originalBETEM]]){
  if(!archive)continue;
  const seen=new Set((project.evidence||[]).map(x=>x.image));
  project.evidence=[...(project.evidence||[]),...originalEvidence(archive).filter(x=>!seen.has(x.image))];
  project.docs=[...(project.docs||[]),...originalDocuments(archive)];
  if(project.id==='bms'){
    project.cover=project.evidence[0]?.image||null;
    project.note="Les photographies, schémas et mesures proviennent des travaux du projet. Les essais n'ont pas validé la charge ni la décharge du BMS ; le diagnostic technique est détaillé dans le dossier.";
  } else {
    project.note="Les plans, pièces techniques et photographies présentés correspondent aux travaux de mon stage. Leur diffusion dans ce portfolio a été validée par BETEM.";
  }
}
projects.push(...legacyProjects);
// Classement pédagogique : projets tutorés d'abord, puis SAE/TP,
// avec les années affichées de BUT3 vers BUT1 dans chaque catégorie.
for(const [id,year,category,nature] of [
  ['pv',3,'tutored','PROJET TUTORÉ'],
  ['bms',2,'tutored','PROJET TUTORÉ'],
  ['cem',3,'applied','TRAVAUX PRATIQUES'],
  ['dialux',3,'applied','TRAVAUX PRATIQUES']
]){
  const p=projects.find(item=>item.id===id);
  if(p){p.year=year;p.category=category;p.nature=nature}
}
const academicProjects=projects.filter(p=>p.id!=='betem');
const sortByYear=(a,b)=>b.year-a.year||a.name.localeCompare(b.name,'fr');
const tutoredProjects=academicProjects.filter(p=>p.category==='tutored').sort(sortByYear);
const appliedProjects=academicProjects.filter(p=>p.category!=='tutored').sort(sortByYear);
[...tutoredProjects,...appliedProjects].forEach((p,i)=>{p.no=String(i+1).padStart(2,'0')});
const betemExperience=projects.find(p=>p.id==='betem');
betemExperience.no='ST';


const competencies = [
  {
    id:'concevoir',no:'C1',name:'Concevoir',title:'Concevoir la partie GEII d’un système',description:'Transformer un besoin en solution technique argumentée, documentée et adaptée aux contraintes.',
    critical:['AC31.01 — Contribuer à la rédaction d’un cahier des charges.','AC31.02 — Prouver la pertinence de ses choix technologiques.','AC31.03 — Rédiger un dossier de conception.'],
    projects:['bms','betem','pv','dialux'], evidence:'KiCad, études CFO/CFA, bilans et choix de luminaires.',
    review:'J’ai progressé dans la structuration d’une étude et la justification des choix. Je dois encore formaliser plus systématiquement mes hypothèses et les critères de comparaison.'
  },
  {
    id:'verifier',no:'C2',name:'Vérifier',title:'Vérifier la partie GEII d’un système',description:'Définir des contrôles, mesurer, comparer à un attendu et expliquer un écart de fonctionnement.',
    critical:['AC32.01 — Évaluer la cause racine d’un dysfonctionnement.','AC32.02 — Proposer une solution corrective à un dysfonctionnement.','AC32.03 — Produire une procédure d’essais pour valider la conformité d’un système.'],
    projects:['bms','cem','dialux'],evidence:'Mesures BMS, simulation harmonique, calculs d’éclairement.',
    review:'L’analyse des essais du BMS m’a appris à chercher une cause matérielle précise. Je dois encore progresser dans la rédaction de procédures de tests reproductibles.'
  },
  {
    id:'maintenir',no:'C3',name:'Maintenir',title:'Assurer le maintien en conditions opérationnelles',description:'Analyser les dysfonctionnements et proposer des actions pour garantir la disponibilité d’un système.',
    critical:['AC33.01 — Proposer une solution de maintenance.','AC33.02 — Évaluer les coûts d’indisponibilité et de maintenance.','AC33.03 — Produire une procédure de maintenance.'],
    projects:['bms'],evidence:'Diagnostic de la carte BMS : démarche de recherche de défaut.',
    review:'Le diagnostic électronique illustre une partie de cette compétence. Il ne remplace pas une véritable opération de maintenance ; il faudra ajouter une preuve portant sur une procédure et les enjeux de disponibilité.'
  },
  {
    id:'installer',no:'C4',name:'Installer',title:'Installer un système de production, conversion ou gestion d’énergie',description:'Préparer, planifier, documenter l’installation puis la mise en service d’un équipement énergétique.',
    critical:['AC34.01EME — Planifier l’installation et la mise en service d’un équipement.','AC34.02EME — Produire une procédure d’installation et de mise en service.','AC34.03EME — Produire le dossier de conformité du système.'],
    projects:['betem','pv'],evidence:'Études d’implantation BT et préparation des architectures photovoltaïques.',
    review:'Mes travaux actuels documentent surtout l’étude préalable à l’installation. Pour prouver entièrement cette compétence, je devrai ajouter des documents de préparation, de contrôle et de mise en service effectivement réalisés.'
  }
];

/* Les études historiques constituent des preuves complémentaires dans le parcours. */
for(const skill of competencies){
  const linked=legacyProjects.filter(p=>p.skills.includes(skill.name)).map(p=>p.id);
  skill.projects=[...new Set([...skill.projects,...linked])];
}

const documents = [
  {title:'Référentiel officiel BUT GEII — parcours EME',type:'DOCUMENT OFFICIEL',desc:'Compétences, apprentissages critiques et progression du BUT.',url:REFERENTIEL,external:true,icon:GraduationCap},
  {title:'Compte rendu de CEM et harmoniques',type:'PREUVE · PDF 34 PAGES',desc:'Schémas, oscillogrammes, spectres et comparaison de solutions.',url:'/documents/TP-CEM-Hicham-El-Hajjaji.pdf',icon:FileText},
  {title:'Étude photovoltaïque — cadrage',type:'DOCUMENT DE TRAVAIL · DOCX',desc:'Hypothèses, méthode de comparaison et étapes du projet.',url:'/documents/Etude-photovoltaique-cadrage.docx',icon:Sun},
  {title:'Compte rendu DIALux',type:'DOCUMENT DE TRAVAIL · DOCX',desc:'Captures originales et analyse de variantes d’éclairage.',url:'/documents/Compte-rendu-DIALux.docx',icon:FileText},
];


/* Bibliothèque documentaire complète des pièces jointes de l'ancien portfolio.
   Les URL sont celles du Drive d'origine ; leur accessibilité publique dépend du partage. */
documents.push(...ancienPortfolio.flatMap(page=>(page.documents||[]).map(doc=>({
  title:doc.titre||'Document technique',
  type:page.titre.toUpperCase(),
  desc:'Pièce de projet : rapport, schéma, mesure ou document technique.',
  url:doc.url,
  external:true,
  icon:FileText
}))));


function EnergyCore(){
  const group=useRef(null);const torus=useRef(null);
  useFrame(({clock,pointer})=>{
    if(!group.current||!torus.current)return;
    const t=clock.elapsedTime;group.current.rotation.y=t*.12+pointer.x*.18;group.current.rotation.x=pointer.y*.12;torus.current.rotation.z=t*.15;
  });
  return <group ref={group} position={[1.7,0,0]}><Float speed={1.3} floatIntensity={.45} rotationIntensity={.25}>
      <mesh ref={torus}><torusKnotGeometry args={[1.38,.012,240,14,2,5]}/><meshBasicMaterial color="#46b9ff" transparent opacity={.8}/></mesh>
      {[0,1,2,3].map(i=><mesh key={i} rotation={[i*.55,i*.8,i*.35]}><torusGeometry args={[1.45+i*.18,.006,5,170]}/><meshBasicMaterial color={i%2?'#3c6dff':'#62d6ff'} transparent opacity={.35}/></mesh>)}
      <mesh><icosahedronGeometry args={[.52,1]}/><meshBasicMaterial color="#2359af" wireframe transparent opacity={.48}/></mesh>
      <pointLight color="#2e96ff" intensity={8} distance={8}/>
    </Float></group>;
}
function Scene(){return <div className="scene" aria-hidden="true"><Canvas camera={{position:[0,0,6],fov:48}} dpr={[1,1.5]} gl={{alpha:true,antialias:true}}><ambientLight intensity={.3}/><Stars radius={85} depth={30} count={900} factor={2} saturation={0} fade speed={.4}/><EnergyCore/></Canvas></div>}

function ProjectVisual({kind,image}){
  if(image)return <div className="project-visual real-art"><img src={image} alt="Photographie originale du projet" loading="lazy"/></div>;
  if(kind==='cem')return <div className="project-visual real-art"><img src="/assets/cem-schema-reel.webp" alt="Schéma original de redresseur issu du compte rendu CEM" loading="lazy"/></div>;
  if(kind==='dialux')return <div className="project-visual real-art"><img src="/assets/dialux-reel-1.webp" alt="Capture réelle DIALux, répartition des luminaires" loading="lazy"/></div>;
  if(kind==='building')return <div className="project-visual real-art"><img src="/assets/betem-plan-extrait-reel.webp" alt="Extrait de plan électrique réel, projet école à Sète" loading="lazy"/></div>;
  if(kind==='legacy')return <div className="project-visual original-fallback"><div className="visual-grid"/><FileText size={92} strokeWidth={.75}/><span>PROJET GEII // DOSSIER DOCUMENTÉ</span></div>;
  if(kind==='solar')return <div className="project-visual solar-art"><div className="visual-grid"/><div className="sun"/><div className="panel-grid">{Array.from({length:18},(_,i)=><span key={i}/>)}</div><span className="solar-label">PV // ÉTUDE ÉNERGÉTIQUE</span></div>;
  return <div className="project-visual bms-art"><div className="visual-grid"/><div className="board"><div className="board-title">BMS // 4S</div>{[1,2,3,4].map(i=><div className="cell" key={i}>CELL 0{i}<span>3,7 V</span></div>)}<div className="chip">ML5243</div></div><span className="visual-disclaimer">ILLUSTRATION — NON CONTRACTUELLE</span></div>;
}
function SectionHeader({number,title,aside}){return <div className="section-heading reveal"><span className="index">{number} / {title}</span><span className="rule"/>{aside&&<span className="heading-aside">{aside}</span>}</div>}
function Chips({items}){return <div className="chips">{items.map(x=><span key={x}>{x}</span>)}</div>}
function DocumentLink({url,label,external=false}){return <a className="document-link" href={url} target="_blank" rel="noopener noreferrer">{label}{external?<ExternalLink size={15}/>:<Download size={15}/>}</a>}
function EvidenceGrid({items,onZoom}){return <div className="evidence-grid">{items.map((ev,i)=><button key={i} className="evidence-item" type="button" onClick={()=>onZoom(ev)} title="Agrandir la preuve"><div className="evidence-image"><img src={ev.image} alt={ev.title} loading="lazy"/></div><div className="evidence-info"><span>{String(i+1).padStart(2,'0')} / PREUVE AUTHENTIQUE</span><b>{ev.title}</b><small>{ev.desc}</small></div><ArrowUpRight size={16}/></button>)}</div>}

function ProjectCard({project:p,onOpen,featured=false}){
  return <article className={'project reveal'+(featured?' project--featured':'')} key={p.id}>
    <div className="project-meta"><span>{p.no} / {String(academicProjects.length).padStart(2,'0')}</span><span>{p.field}</span></div>
    <ProjectVisual kind={p.icon} image={p.cover}/>
    <div className="project-info">
      <div>
        <p className="project-subtitle">{p.period}</p>
        <h3>{p.name}</h3>
        <p className="project-strap">{p.short}</p>
        <span className={'project-nature'+(featured?' project-nature--featured':'')}>{p.nature||'RÉALISATION UNIVERSITAIRE'}</span>
      </div>
      <p className="project-summary">{p.description}</p>
      <Chips items={p.chips}/>
      <div className="project-action"><span>{p.status}</span>
        <button type="button" onClick={()=>onOpen(p)}>ÉTUDE COMPLÈTE <ArrowUpRight size={16}/></button>
      </div>
    </div>
  </article>;
}

function ProjectYearGroup({items,onOpen,featureTutored=false}){
  return <div className="project-year-list">
    {[3,2,1].map(year=>{
      const entries=items.filter(p=>p.year===year);
      if(!entries.length)return null;
      return <div key={year} className={'project-year-block project-year-block--'+year}>
        <div className="project-year-heading reveal"><span>BUT{year}</span><span>{entries.length} {entries.length===1?'RÉALISATION':'RÉALISATIONS'}</span></div>
        <div className="projects-list">
          {entries.map(p=><ProjectCard key={p.id} project={p} featured={featureTutored&&['pv','bms'].includes(p.id)} onOpen={onOpen}/>)}
        </div>
      </div>;
    })}
  </div>;
}

function ProjectDetail({project:p,onClose,onZoom}){
  const dialogRef=useRef(null);
  useEffect(()=>{dialogRef.current?.focus();const handle=e=>{if(e.key==='Escape')onClose()};window.addEventListener('keydown',handle);return()=>window.removeEventListener('keydown',handle)},[onClose]);
  return <div className="detail-overlay" onClick={onClose}><article className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="project-title" tabIndex={-1} ref={dialogRef} onClick={e=>e.stopPropagation()}>
    <div className="detail-header"><span className="index">{p.id==='betem'?'DOSSIER DE STAGE / BETEM':`DÉCRYPTAGE / PROJET ${p.no}`}</span><button type="button" onClick={onClose} className="detail-close"><X size={20}/> FERMER</button></div>
    <div className="detail-hero"><div><p className="project-subtitle">{p.field} · {p.period}</p><h2 id="project-title">{p.name}</h2><p className="detail-lead">{p.description}</p><span className="status-line">{['bms','pv'].includes(p.id)?<AlertCircle size={15}/>:<CheckCircle2 size={15}/>} {p.status}</span></div><ProjectVisual kind={p.icon} image={p.cover}/></div>
    <div className="detail-metrics">{p.metrics.map(([value,label])=><div key={label}><b>{value}</b><span>{label}</span></div>)}</div>
    {p.id==='bms'&&<BmsCaseStudy onZoom={onZoom}/>}
    {p.id==='pv'&&<PvCaseStudy/>}
    {p.legacyOnly&&<LegacyCaseStudy project={p} onZoom={onZoom}/>}
    {['cem','dialux'].includes(p.id)&&<AppliedTechnicalStudy project={p} onZoom={onZoom}/>}
    {p.id==='betem'&&<BetemCaseStudy project={p} onZoom={onZoom}/>}
    {!p.legacyOnly&&!['bms','pv','cem','dialux','betem'].includes(p.id)&&<div className="detail-chapters">
      <section><span className="chapter-index">01 / CONTEXTE</span><h3>Pourquoi ce projet ?</h3><p>{p.context}</p></section>
      <section><span className="chapter-index">02 / MON RÔLE</span><h3>Ce que j'ai réalisé</h3><p>{p.role}</p></section>
      <section className="wide"><span className="chapter-index">03 / DÉMARCHE</span><h3>Étapes techniques</h3><ol className="process-list">{p.method.map((step,i)=><li key={i}><b>{String(i+1).padStart(2,'0')}</b><span>{step}</span></li>)}</ol></section>
      <section><span className="chapter-index">04 / RÉSULTATS</span><h3>Ce que montrent les résultats</h3><p>{p.results}</p></section>
      <section className="critical-section"><span className="chapter-index">05 / PRISE DE RECUL</span><h3>Mon autoévaluation</h3><p>{p.critique}</p></section>
    </div>}
    <div className="detail-footer"><div><span>COMPÉTENCES ASSOCIÉES</span><Chips items={p.skills}/></div><button type="button" onClick={onClose} className="secondary-button"><ArrowLeft size={16}/> RETOUR AU PORTFOLIO</button></div>
  </article></div>;
}

function App(){
  const [project,setProject]=useState(null);const [zoom,setZoom]=useState(null);
  const closeDetail=()=>{setProject(null);setZoom(null)};
  useEffect(()=>{
    const lenis=new Lenis({duration:1.2,smoothWheel:true});let raf;const tick=t=>{lenis.raf(t);raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick);
    lenis.on('scroll',ScrollTrigger.update);
    const anims=gsap.utils.toArray('.reveal').map(el=>gsap.fromTo(el,{opacity:0,y:35},{opacity:1,y:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
    return()=>{cancelAnimationFrame(raf);lenis.destroy();anims.forEach(a=>a.kill());ScrollTrigger.getAll().forEach(t=>t.kill())};
  },[]);
  useEffect(()=>{document.body.style.overflow=(project||zoom)?'hidden':'';return()=>{document.body.style.overflow=''}},[project,zoom]);
  const openProject=(p)=>{setProject(p);setZoom(null)};
  return <><div className="desktop-note">Cette expérience est conçue pour un écran d'ordinateur (largeur minimale : 950 px).</div><div className="site"><div className="grain" aria-hidden="true"/>
    <header className="topbar"><a className="brand" href="#accueil">H<span>.</span> EL HAJJAJI<small>PORTFOLIO DE COMPÉTENCES / 2026—27</small></a><nav aria-label="Navigation principale"><a href="#profil">PROFIL</a><a href="#formation">FORMATION</a><a href="#competences">COMPÉTENCES</a><a href="#projets">PROJETS</a><a href="#experience">EXPÉRIENCE</a><a href="#documents">DOCUMENTS</a><a href="#contact">CONTACT</a></nav></header>
    <main>
      <section className="hero" id="accueil"><Scene/><div className="hero-copy"><div className="eyebrow"><span className="live-dot"/> BUT3 GEII · ÉLECTRICITÉ & MAÎTRISE DE L'ÉNERGIE</div><h1>CONCEVOIR<br/><em>L'ÉNERGIE</em><br/>DE DEMAIN<span className="period">.</span></h1><p>De la carte électronique aux réseaux électriques : projets, preuves, méthodes et compétences développées au fil de ma formation.</p><a href="#projets" className="primary">DÉCOUVRIR MON TRAVAIL <ArrowUpRight size={17}/></a></div><div className="hero-side">INGÉNIERIE ÉLECTRIQUE <span>—</span> PARCOURS EME</div><a className="scroll-hint" href="#profil"><ArrowDown size={17}/> EXPLORER</a><div className="hero-index">2026 / 2027</div></section>

      <section id="profil" className="section about"><SectionHeader number="01" title="INFORMATIONS PERSONNELLES"/><div className="about-grid"><div className="reveal"><h2>QUI<br/>SUIS<span>-JE ?</span></h2><div className="identity-block"><span>HICHAM EL HAJJAJI</span><strong>Étudiant en BUT3 GEII</strong><small>IUT Montpellier–Sète · Parcours EME</small></div></div><div className="about-text reveal"><p>Après un baccalauréat général avec les spécialités mathématiques et physique, puis une première année en informatique, j'ai choisi le <strong>BUT Génie Électrique et Informatique Industrielle</strong> pour approfondir les systèmes électriques et leur fonctionnement.</p><p>Ce qui m'intéresse particulièrement : le transport et la distribution de l'énergie, les réseaux HTA/HTB, les postes électriques, les installations basse tension et l'électronique de puissance.</p><p>J'aime relier les principes physiques aux situations réelles : dimensionner, simuler, chercher l'origine d'un défaut et justifier les décisions techniques.</p><div className="profile-facts"><div><MapPin size={16}/><span>Montpellier / Sète, France</span></div><div><GraduationCap size={16}/><span>BUT3 · GEII / EME</span></div><div><BriefcaseBusiness size={16}/><span>Permis B</span></div><div><FileText size={16}/><a href="https://drive.google.com/file/d/1xgupalQplB7q3yol92GSSMiKyJbB_sn1/view" target="_blank" rel="noopener noreferrer">CV original sur Google Drive ↗</a></div><div><Link2 size={16}/><a href="https://www.linkedin.com/in/hicham-el-hajjaji" target="_blank" rel="noopener noreferrer">Mon profil LinkedIn ↗</a></div></div><a href="#contact" className="inline-action">ME CONTACTER <ArrowUpRight size={16}/></a></div></div>
      </section>

      <section id="formation" className="section formation"><SectionHeader number="02" title="MA FORMATION" aside="DU BAC À L'INGÉNIERIE"/><div className="formation-intro reveal"><h2>MON <span>PARCOURS.</span></h2><p>Une formation qui associe bases scientifiques, conception, travaux pratiques et projets appliqués à l'énergie.</p></div><div className="timeline reveal">
        <div className="timeline-item"><span className="timeline-count">01</span><div className="timeline-year">AVANT LE BUT</div><div><h3>Baccalauréat général</h3><p>Obtention du baccalauréat en 2021, spécialités mathématiques et physique. Acquisition de bases scientifiques pour comprendre les phénomènes électriques et mécaniques.</p></div></div>
        <div className="timeline-item"><span className="timeline-count">02</span><div className="timeline-year">APRÈS LE BAC</div><div><h3>Première année d'informatique</h3><p>Première année de licence informatique, avant ma réorientation en 2024 vers le BUT GEII. J'y ai développé des bases en programmation et en logique, utiles pour les systèmes techniques.</p></div></div>
        <div className="timeline-item current"><span className="timeline-count">03</span><div className="timeline-year">2024—2027 · EN COURS</div><div><h3>BUT Génie électrique et informatique industrielle</h3><p><strong>Parcours Électricité et maîtrise de l'énergie.</strong> Électrotechnique, conversion d'énergie, électronique, automatismes, modélisation, contrôle-commande et réseaux électriques.</p><Chips items={['Électrotechnique','Électronique de puissance','Installations BT','Énergies renouvelables','Mesures & essais']}/></div></div>
        <div className="timeline-item future"><span className="timeline-count">04</span><div className="timeline-year">APRÈS LE BUT · OBJECTIF</div><div><h3>Poursuite en école d'ingénieurs</h3><p>Objectif : approfondir le génie électrique, de préférence en apprentissage, puis travailler dans les réseaux électriques et les installations de transport et distribution HTA/HTB.</p></div></div>
      </div><div className="formation-footer reveal"><div><strong>POURQUOI LE PARCOURS EME ?</strong><p>Pour étudier la production, la conversion, le transport et l'utilisation de l'énergie électrique, de la théorie aux applications industrielles.</p></div><DocumentLink url={REFERENTIEL} label="CONSULTER LE RÉFÉRENTIEL NATIONAL" external/></div>
      </section>

      <section id="competences" className="section competence-section"><SectionHeader number="03" title="RÉFÉRENTIEL GEII" aside="4 COMPÉTENCES · PARCOURS EME"/><div className="competence-intro reveal"><h2>CE QUE JE <span>DÉVELOPPE.</span></h2><p>Les quatre compétences du parcours sont reliées à des situations de projet, à des preuves et à un retour critique. Les apprentissages critiques listés ci-dessous sont ceux du niveau BUT3.</p></div><div className="competency-grid">{competencies.map((c,i)=><article className="competency-card reveal" key={c.id}><div className="competency-index"><span>{c.no} / 04</span><span className="competency-mark">{String(i+1).padStart(2,'0')}</span></div><h3>{c.name}</h3><p className="competency-title">{c.title}</p><p>{c.description}</p><div className="competency-line">APPRENTISSAGES CRITIQUES BUT3</div><ul>{c.critical.map(x=><li key={x}>{x}</li>)}</ul><div className="competency-line">PREUVES & APPLICATIONS</div><p className="competency-evidence">{c.evidence}</p><div className="competency-projects">{c.projects.map(id=>{let p=projects.find(x=>x.id===id);return <button key={id} type="button" onClick={()=>openProject(p)}>{p.name}<ArrowUpRight size={13}/></button>})}</div><div className="self-review"><span>MON REGARD CRITIQUE</span><p>{c.review}</p></div></article>)}</div><p className="competence-source">Référence : Programme national du BUT GEII, parcours EME, niveaux et apprentissages critiques. <a href={REFERENTIEL} target="_blank" rel="noopener noreferrer">Consulter le document officiel <ExternalLink size={13}/></a></p></section>


      <section id="projets" className="section projects">
        <SectionHeader number="04" title="PROJETS & RÉALISATIONS" aside={`${academicProjects.length} ÉTUDES UNIVERSITAIRES`}/>
        <div className="projects-intro reveal">
          <h2>APPRENDRE <span>PAR LA PRATIQUE.</span></h2>
          <p>Deux parcours de réalisation : les projets tutorés au premier plan, puis les SAE et travaux pratiques. Chaque projet présente la démarche, les choix techniques, les résultats et le recul acquis, de la troisième à la première année.</p>
        </div>

        <div className="projects-group projects-group--tutored">
          <div className="projects-group-heading reveal">
            <div className="projects-group-heading-main">
              <span className="projects-group-index">01 / SUIVI DE PROJET</span>
              <h3>PROJETS <em>TUTORÉS.</em></h3>
              <p>Des travaux de conception développés sur plusieurs semaines, avec une démarche complète : cahier des charges, architecture, essais et analyse critique.</p>
            </div>
            <span className="projects-group-count">{String(tutoredProjects.length).padStart(2,'0')} DOSSIERS</span>
          </div>
          <ProjectYearGroup items={tutoredProjects} featureTutored onOpen={openProject}/>
        </div>

        <div className="projects-group projects-group--applied">
          <div className="projects-group-heading reveal">
            <div className="projects-group-heading-main">
              <span className="projects-group-index">02 / MISE EN APPLICATION</span>
              <h3>SAE & <em>RÉALISATIONS PRATIQUES.</em></h3>
              <p>Des systèmes conçus, câblés, programmés ou vérifiés pendant le BUT GEII. Les SAE identifiées et les travaux pratiques sont distingués dans chaque fiche pour respecter la nature réelle des activités.</p>
            </div>
            <span className="projects-group-count">{String(appliedProjects.length).padStart(2,'0')} DOSSIERS</span>
          </div>
          <ProjectYearGroup items={appliedProjects} onOpen={openProject}/>
        </div>
      </section>

      <section id="experience" className="section experience"><SectionHeader number="05" title="EXPÉRIENCE PROFESSIONNELLE"/><div className="experience-grid"><div className="reveal"><span className="superline">STAGE · AVRIL — JUIN 2026</span><h2>DU COURS<br/>AU <span>BUREAU D'ÉTUDES.</span></h2><p className="experience-lead">10 semaines dans l'environnement d'un bureau d'études électriques à Montpellier, avec une immersion sur des projets de bâtiments.</p><button className="primary as-button" type="button" onClick={()=>openProject(betemExperience)}>EXPLORER LE STAGE <ArrowUpRight size={17}/></button></div><div className="experience-details reveal"><div className="experience-company"><span>ENTREPRISE</span><strong>BETEM — Montpellier</strong></div><div className="experience-company"><span>DOMAINE</span><strong>Études CFO / CFA et basse tension</strong></div><div className="experience-company"><span>LOGICIELS UTILISÉS</span><strong>AutoCAD, Revit, Caneco BT, DIALux evo</strong></div><div className="experience-company"><span>COMPÉTENCES MOBILISÉES</span><strong>Concevoir · Vérifier · Préparer l'installation</strong></div><div className="experience-acquired"><b>CE QUE CETTE EXPÉRIENCE M'A APPORTÉ</b><p>Une meilleure compréhension de la production des plans et pièces écrites, de la cohérence entre les livrables, du rôle de chaque intervenant et des contraintes concrètes d'un projet.</p></div></div></div>
        <div className="experience-proof-band reveal">
          <div className="experience-proof-preview">
            <img src="/assets/betem-plan-extrait-reel.webp" alt="Extrait authentique de plan d'implantation électrique réalisé pendant le stage BETEM" loading="lazy"/>
            <span>BETEM / PLAN CFO-CFA</span>
          </div>
          <div className="experience-proof-content">
            <span className="project-subtitle">DOCUMENTATION PROFESSIONNELLE</span>
            <h3>DES LIVRABLES CONCRETS.</h3>
            <p>Implantations, bilans de puissance, schémas, études d'éclairage et pièces écrites : le dossier rassemble les travaux réalisés en bureau d'études.</p>
            <div className="experience-proof-links">
              {betemExperience.docs?.map(doc=><DocumentLink key={doc.url} url={doc.url} label={doc.label} external/>)}
            </div>
          </div>
        </div>
      </section>

      <section id="documents" className="section documents"><SectionHeader number="06" title="DOCUMENTS & PREUVES" aside="SOURCES AUTHENTIQUES"/><div className="documents-heading reveal"><h2>DES TRACES <span>CONCRÈTES.</span></h2><p>Les rapports, schémas, cahiers de recette et procédures de test sont associés aux études correspondantes. Cette bibliothèque rassemble également leurs documents complémentaires.</p></div><div className="documents-grid reveal">{documents.map((d,i)=><a key={d.url+'-'+i} href={d.url} target="_blank" rel="noopener noreferrer" className="doc-card"><div className="doc-num">{String(i+1).padStart(2,'0')} / DOCUMENT</div><d.icon size={30}/><div><span className="doc-type">{d.type}</span><h3>{d.title}</h3><p>{d.desc}</p></div><span className="doc-open">{d.external?'OUVRIR LA SOURCE':'TÉLÉCHARGER'} <ArrowUpRight size={15}/></span></a>)}</div><div className="proof-caveat reveal"><AlertCircle size={20}/><p><strong>Documents encore à intégrer :</strong> schémas complémentaires, extraits de mesures, illustrations techniques et autres preuves à sélectionner au fil des prochaines améliorations. La diffusion des documents techniques présentés pour mon stage a été autorisée par BETEM.</p></div></section>

      <section id="contact" className="section contact"><SectionHeader number="07" title="CONTACT"/><p className="reveal">UNE QUESTION SUR UN PROJET OU UNE OPPORTUNITÉ ?</p><a className="contact-title reveal" href="mailto:hicham.el-hajjaji@etu.umontpellier.fr">ÉCHANGEONS <ArrowUpRight/></a><div className="contact-bottom"><a href="mailto:hicham.el-hajjaji@etu.umontpellier.fr">HICHAM.EL-HAJJAJI@ETU.UMONTPELLIER.FR</a><a href="tel:+33777389922">07 77 38 99 22</a><span>MONTPELLIER · FRANCE</span></div></section>
    </main><footer><span>© 2026 HICHAM EL HAJJAJI</span><a href="#accueil">RETOUR EN HAUT ↑</a><span>BUT GEII / ÉLECTRICITÉ & MAÎTRISE DE L'ÉNERGIE</span></footer>
    {project&&<ProjectDetail project={project} onClose={closeDetail} onZoom={setZoom}/>}
    {zoom&&<div className="zoom-overlay" onClick={()=>setZoom(null)} role="presentation"><div className="zoom-frame" onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label={zoom.title}><button onClick={()=>setZoom(null)} type="button"><X size={20}/> FERMER</button><img src={zoom.image} alt={zoom.title}/><div><strong>{zoom.title}</strong><span>{zoom.desc}</span></div></div></div>}
  </div></>;
}

createRoot(document.getElementById('root')).render(<App/>);
