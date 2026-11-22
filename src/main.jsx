import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import { AdditiveBlending } from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowUpRight, ArrowDown, ArrowLeft, X, Zap, Cpu, CircuitBoard, Download, ExternalLink, Layers, GraduationCap, FileText, CheckCircle2, AlertCircle, BriefcaseBusiness, Wrench, Microscope, ChevronRight, Link2, ShieldCheck, Sun, MapPin, Mail, Maximize2, Minimize2, PanelRightOpen, Mouse } from 'lucide-react';
import { legacyProjects, originalFor, originalEvidence, originalDocuments } from './legacyProjects.js';
import { documentDisplayName } from './documentLabels.js';
import BmsCaseStudy from './BmsCaseStudy.jsx';
import PvCaseStudy from './PvCaseStudy.jsx';
import LegacyCaseStudy from './LegacyCaseStudy.jsx';
import AppliedTechnicalStudy from './AppliedTechnicalStudy.jsx';
import BetemCaseStudy from './BetemCaseStudy.jsx';
import EdgeNavigation from './EdgeNavigation.jsx';
import ElectricAmbient from './ElectricAmbient.jsx';
import CircuitInteractions from './CircuitInteractions.jsx';
import ancienPortfolio from './ancienPortfolio.json';
import './style.css';
import './documents-compact.css';
import './project-selector.css';
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
    cover:'/legacy/legacy-1ed60ec4c59c2e.webp',
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
    id:'pv', no:'03', name:'Étude photovoltaïque', short:'Simulation Sunny Design 6 kWc et comparaison avec le stockage', field:'TRANSITION ÉNERGÉTIQUE', period:'Projet tutoré · BUT3',
    description:'Simulation d’un champ photovoltaïque résidentiel de 6 kWc sous Sunny Design : production, autoconsommation, injection réseau et dimensionnement de l’onduleur ; comparaison avec batterie à poursuivre.',
    status:'Scénario 6 kWc simulé · Batterie et autres variantes à comparer', color:'violet', icon:'solar', chips:['Sunny Design','6 kWc','9 711 kWh/an','Autoconsommation','Stockage à étudier'],
    metrics:[['9 711 kWh','production annuelle simulée'],['15,2 %','taux d’autoconsommation'],['40,9 %','taux d’autonomie']],
    context:'Pour un même logement, l’objectif est de comparer la vente du surplus et le stockage sur batterie à partir de profils de consommation identiques et d’hypothèses explicites.',
    role:'Construction de la méthode d’étude : définition du logement de référence, bilan d’énergie par usage, comparaison des profils saisonniers et scénarios à simuler.',
    method:[
      'Établissement du bilan de consommation par appareil et par plage horaire.',
      'Création de profils représentatifs été/hiver, jours ouvrés/week-end.',
      'Étude de la ressource solaire et de la configuration des toitures avec PVGIS.',
      'Comparaison sous SAM de scénarios autoconsommation / revente / batterie.',
      'Étude des différences entre onduleur centralisé et micro-onduleurs.'
    ],
    results:'Pour 12 panneaux totalisant 6 kWc et un onduleur de 5 kW, Sunny Design estime 9 711 kWh/an, 1 474 kWh autoconsommés, 8 237 kWh injectés et 2 126 kWh soutirés. Le profil de référence consomme 3 600 kWh/an : 15,2 % d’autoconsommation, 40,9 % d’autonomie. Les variantes batterie et 3 kWc restent à simuler.',
    critique:'La qualité des conclusions dépendra surtout des données de consommation et du réalisme des hypothèses. Il faudra distinguer les résultats simulés des mesures et effectuer une étude de sensibilité sur les prix, les rendements et les profils de charge.',
    skills:['Concevoir','Vérifier','Installer (pré-étude)'],
    evidence:[],
    docs:[{label:'Document de cadrage photovoltaïque',url:'/documents/Etude-photovoltaique-cadrage.docx',type:'DOCX · document de travail'}],
    note:'Les résultats chiffrés décrivent une configuration Sunny Design 6 kWc sans batterie à Laroque ; ce sont des estimations logicielles, non des mesures ni un retour sur investissement démontré.'
  },
  {
    id:'cem', no:'04', name:'Compatibilité électromagnétique', short:'Harmoniques, filtre LC accordé à 150 Hz et PFC Boost', field:'ÉLECTRONIQUE DE PUISSANCE', period:'Travaux pratiques · BUT3',
    description:'Comparaison sous PSIM du redresseur capacitif, de l’inductance série, d’un filtre LC accordé sur 150 Hz et d’un PFC Boost à courant sinusoïdal.',
    status:'Simulations du filtre LC et du PFC analysées', color:'cyan', icon:'cem', chips:['PSIM','CEM','FFT','Filtre LC 150 Hz','PFC Boost','Harmoniques'],
    metrics:[['139 → 3 %','THD initial → PFC'],['0,58 → ≈ 1','facteur de puissance'],['150 Hz','filtre accordé H3']],
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
    status:'Calculs d’éclairement et variantes comparées', color:'green', icon:'lighting', chips:['DIALux evo','NF EN 12464-1','ISOLUX','Uniformité','Puissance'],
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
  {title:'Référentiel de formation',type:'DOCUMENT OFFICIEL',desc:'Compétences, apprentissages critiques et progression du BUT.',url:REFERENTIEL,external:true,icon:GraduationCap},
  {title:'Rapport de travaux pratiques',type:'PREUVE · PDF 34 PAGES',desc:'Schémas, oscillogrammes, spectres et comparaison de solutions.',url:'/documents/TP-CEM-Hicham-El-Hajjaji.pdf',icon:FileText},
  {title:'Cahier des charges',type:'DOCUMENT DE TRAVAIL · DOCX',desc:'Hypothèses, méthode de comparaison et étapes du projet.',url:'/documents/Etude-photovoltaique-cadrage.docx',icon:Sun},
  {title:'Étude d’éclairage',type:'DOCUMENT DE TRAVAIL · DOCX',desc:'Calculs d’éclairement et analyse de variantes.',url:'/documents/Compte-rendu-DIALux.docx',icon:FileText},
];


/* Bibliothèque documentaire complète des pièces jointes de l'ancien portfolio.
   Les URL sont celles du Drive d'origine ; leur accessibilité publique dépend du partage. */
documents.push(...ancienPortfolio.flatMap(page=>(page.documents||[]).map(doc=>({
  title:documentDisplayName(doc.titre,page.titre),
  type:page.titre.toUpperCase(),
  desc:'Pièce de projet : rapport, schéma, mesure ou document technique.',
  url:doc.url,
  external:true,
  icon:FileText
}))));


const highlightedDocuments=[
  documents[0],
  documents[1],
  documents.find(doc=>doc.type==='STAGE CHEZ BETEM'&&doc.title==='Rapport de stage'),
  documents[2]
].filter(Boolean);
const remainingDocuments=documents.filter(doc=>!highlightedDocuments.includes(doc));

// Représentation artistique d'un électron : langage visuel bleu électrique,
// trajectoires orbitales et noyau lumineux (non une représentation quantique).
function ElectronOrbit({radius=1.5,speed=1,phase=0,tilt=[0,0,0],color='#65ceff',reducedMotion=false}){
  const electron=useRef(null);
  const halo=useRef(null);
  useFrame(({clock})=>{
    const t=reducedMotion?phase:clock.elapsedTime*speed+phase;
    if(electron.current){
      electron.current.position.set(Math.cos(t)*radius,Math.sin(t)*radius*.52,0);
    }
    if(halo.current){
      halo.current.opacity=.16+(reducedMotion?0:Math.sin(clock.elapsedTime*.72+phase)*.025);
    }
  });
  return <group rotation={tilt}>
    <mesh scale={[1,.52,1]}>
      <torusGeometry args={[radius,.009,8,220]}/>
      <meshBasicMaterial color={color} transparent opacity={.36}/>
    </mesh>
    <mesh scale={[1,.52,1]}>
      <torusGeometry args={[radius,.028,8,220]}/>
      <meshBasicMaterial color={color} transparent opacity={.085}
        blending={AdditiveBlending} depthWrite={false} toneMapped={false}/>
    </mesh>
    <group ref={electron}>
      <mesh>
        <sphereGeometry args={[.061,20,20]}/>
        <meshBasicMaterial color="#effaff" toneMapped={false}/>
      </mesh>
      <mesh>
        <sphereGeometry args={[.145,20,20]}/>
        <meshBasicMaterial ref={halo} color={color} transparent opacity={.16}
          blending={AdditiveBlending} depthWrite={false} toneMapped={false}/>
      </mesh>
    </group>
  </group>;
}

function ElectronHero(){
  const group=useRef(null);
  const nucleusGlow=useRef(null);
  const [reducedMotion,setReducedMotion]=useState(false);
  useEffect(()=>{
    const query=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReducedMotion(query.matches);
    update();
    query.addEventListener?.('change',update);
    return()=>query.removeEventListener?.('change',update);
  },[]);
  useFrame(({clock,pointer})=>{
    if(!group.current)return;
    const t=clock.elapsedTime;
    group.current.rotation.y=(reducedMotion?0:t*.12)+pointer.x*.16;
    group.current.rotation.x=pointer.y*.1;
    if(nucleusGlow.current){
      nucleusGlow.current.opacity=.13+(reducedMotion?0:Math.sin(t*.65)*.025);
    }
  });
  return <group ref={group} position={[1.7,0,0]}>
    <Float speed={reducedMotion?0:1.2} floatIntensity={reducedMotion?0:.32}
      rotationIntensity={reducedMotion?0:.12}>
      <mesh>
        <sphereGeometry args={[.19,28,28]}/>
        <meshBasicMaterial color="#e7faff" transparent opacity={.92}/>
      </mesh>
      <mesh>
        <sphereGeometry args={[.38,28,28]}/>
        <meshBasicMaterial ref={nucleusGlow} color="#47baff" transparent opacity={.13}
          blending={AdditiveBlending} depthWrite={false} toneMapped={false}/>
      </mesh>
      <mesh rotation={[.2,.5,.3]}>
        <icosahedronGeometry args={[.54,1]}/>
        <meshBasicMaterial color="#2c69c2" wireframe transparent opacity={.38}/>
      </mesh>
      <ElectronOrbit radius={1.33} speed={1.18} phase={0}
        tilt={[.27,.16,.5]} color="#6dd7ff" reducedMotion={reducedMotion}/>
      <ElectronOrbit radius={1.56} speed={.9} phase={2.1}
        tilt={[1.14,.58,.1]} color="#458fff" reducedMotion={reducedMotion}/>
      <ElectronOrbit radius={1.79} speed={.73} phase={4.2}
        tilt={[.68,1.08,.4]} color="#8ce3ff" reducedMotion={reducedMotion}/>
      <pointLight color="#2e96ff" intensity={7.5} distance={8}/>
    </Float>
  </group>;
}
function Scene(){
  return <div className="scene" aria-hidden="true">
    <Canvas camera={{position:[0,0,6],fov:48}} dpr={[1,1.5]} gl={{alpha:true,antialias:true}}>
      <ambientLight intensity={.34}/>
      <Stars radius={85} depth={30} count={900} factor={2} saturation={0} fade speed={.4}/>
      <ElectronHero/>
    </Canvas>
  </div>;
}

function ProjectVisual({kind,image,alt='Illustration technique du projet',rotation=0,priority=false}){
  const [imageFailed,setImageFailed]=useState(false);
  const nativeIllustrations={
    cem:'/assets/cem-schema-reel.webp',
    dialux:'/assets/dialux-reel-1.webp',
    building:'/assets/betem-plan-extrait-reel.webp'
  };
  const src=image||nativeIllustrations[kind]||null;
  useEffect(()=>{setImageFailed(false)},[src]);

  if(src&&!imageFailed){
    return <div className={'project-visual real-art'+(src.startsWith('/assets/studies/')?' project-visual--document':'')}>
      <img src={src} alt="" aria-hidden="true" className="project-visual__backdrop"
        loading={priority?'eager':'lazy'}/>
      <img src={src} alt={alt} className="project-visual__foreground"
        loading={priority?'eager':'lazy'}
        style={rotation?{transform:`rotate(${rotation}deg)`}:undefined}
        onError={()=>setImageFailed(true)}/>
    </div>;
  }
  if(kind==='legacy')return <div className="project-visual original-fallback"><div className="visual-grid"/><FileText size={92} strokeWidth={.75}/><span>SCHÉMAS ET ÉTUDE TECHNIQUE</span></div>;
  if(kind==='solar')return <div className="project-visual solar-art"><div className="visual-grid"/><div className="sun"/><div className="panel-grid">{Array.from({length:12},(_,i)=><span key={i}/>)}</div><span className="solar-label">PV // 6 kWc · 12 MODULES</span></div>;
  return <div className="project-visual bms-art"><div className="visual-grid"/><div className="board"><div className="board-title">BMS // 4S</div>{[1,2,3,4].map(i=><div className="cell" key={i}>CELL 0{i}<span>3,7 V</span></div>)}<div className="chip">ML5243</div></div><span className="visual-disclaimer">ILLUSTRATION SCHÉMATIQUE</span></div>;
}
function SectionHeader({number,title,aside}){return <div className="section-heading reveal"><span className="index">{number} / {title}</span><span className="rule"/>{aside&&<span className="heading-aside">{aside}</span>}</div>}
function Chips({items}){return <div className="chips">{items.map(x=><span key={x}>{x}</span>)}</div>}
function DocumentLink({url,label,external=false}){return <a className="document-link" href={url} target="_blank" rel="noopener noreferrer">{label}{external?<ExternalLink size={15}/>:<Download size={15}/>}</a>}
function EvidenceGrid({items,onZoom}){return <div className="evidence-grid">{items.map((ev,i)=><button key={i} className="evidence-item" type="button" onClick={()=>onZoom(ev)} title="Agrandir la preuve"><div className="evidence-image"><img src={ev.image} alt={ev.title} loading="lazy"/></div><div className="evidence-info"><span>{String(i+1).padStart(2,'0')} / PREUVE AUTHENTIQUE</span><b>{ev.title}</b><small>{ev.desc}</small></div><ArrowUpRight size={16}/></button>)}</div>}

function ProjectCard({project:p,onOpen,featured=false}){
  return <article className={'project reveal'+(featured?' project--featured':'')} key={p.id}>
    <div className="project-meta"><span>{p.no} / {String(academicProjects.length).padStart(2,'0')}</span><span>{p.field}</span></div>
    <ProjectVisual kind={p.icon} image={p.cover} alt={'Photographie ou schéma : '+p.name} rotation={p.coverRotation||0}/>
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

function ProjectSelector({selectedId,onSelect}){
  const [open,setOpen]=useState(false);
  const selectorRef=useRef(null);
  const choiceCount=academicProjects.length-1;

  useEffect(()=>{
    if(!open)return;
    const closeOutside=e=>{
      if(selectorRef.current&&!selectorRef.current.contains(e.target))setOpen(false);
    };
    const closeEscape=e=>{
      if(e.key==='Escape'){
        setOpen(false);
        selectorRef.current?.querySelector('.project-selector__trigger')?.focus();
      }
    };
    document.addEventListener('pointerdown',closeOutside);
    document.addEventListener('keydown',closeEscape);
    return()=>{
      document.removeEventListener('pointerdown',closeOutside);
      document.removeEventListener('keydown',closeEscape);
    };
  },[open]);

  const groups=[
    {title:'PROJETS TUTORÉS',items:tutoredProjects},
    {title:'SAE & RÉALISATIONS PRATIQUES',items:appliedProjects}
  ];
  return <div className={'project-selector'+(open?' project-selector--open':'')}
      ref={selectorRef} data-lenis-prevent={open||undefined}>
    <button type="button" className="project-selector__trigger"
      aria-expanded={open} aria-controls="project-selector-list"
      onClick={()=>setOpen(value=>!value)}>
      <span className="project-selector__trigger-icon"><Layers size={20}/></span>
      <span className="project-selector__trigger-text">
        <strong>EXPLORER LES AUTRES PROJETS</strong>
        <small>{choiceCount} autres réalisations · Projets tutorés et SAE, du BUT3 au BUT1</small>
      </span>
      <span className="project-selector__trigger-count">{String(choiceCount).padStart(2,'0')}</span>
      <ChevronRight size={21} className="project-selector__chevron"/>
    </button>
    {open&&<div id="project-selector-list" className="project-selector__list"
      onWheel={e=>e.stopPropagation()}>
      {groups.map(group=><div className="project-selector__group" key={group.title}>
        <div className="project-selector__group-name">
          <span>{group.title}</span><span>{group.items.length} DOSSIERS</span>
        </div>
        {[3,2,1].map(year=>{
          const entries=group.items.filter(p=>p.year===year&&p.id!==selectedId);
          if(!entries.length)return null;
          return <div className="project-selector__year" key={year}>
            <span className="project-selector__year-label">BUT{year}</span>
            <div className="project-selector__choices">{entries.map(p=>
              <button key={p.id} type="button" className="project-selector__choice"
                onClick={()=>{setOpen(false);onSelect(p)}}>
                <span className="project-selector__choice-icon">{p.no}</span>
                <span className="project-selector__choice-text">
                  <strong>{p.name}</strong>
                  <small>{p.short}</small>
                </span>
                <ArrowUpRight size={17}/>
              </button>
            )}</div>
          </div>;
        })}
      </div>)}
    </div>}
  </div>;
}

function ProjectDetail({project:p,onClose,onZoom,isZoomOpen=false}){
  const dialogRef=useRef(null);
  const [readingMode,setReadingMode]=useState(false);
  const savedScrollProgress=useRef(0);
  const switchMode=(next)=>{
    if(next===readingMode)return;
    const el=dialogRef.current;
    if(el)savedScrollProgress.current=el.scrollTop/Math.max(1,el.scrollHeight-el.clientHeight);
    setReadingMode(next);
  };
  useLayoutEffect(()=>{
    const el=dialogRef.current;
    if(el)el.scrollTop=savedScrollProgress.current*Math.max(0,el.scrollHeight-el.clientHeight);
  },[readingMode]);
  useEffect(()=>{dialogRef.current?.focus({preventScroll:true})},[]);
  useEffect(()=>{
    const handle=e=>{if(e.key==='Escape'&&!isZoomOpen)onClose()};
    window.addEventListener('keydown',handle);
    return()=>window.removeEventListener('keydown',handle);
  },[onClose,isZoomOpen]);
  return <div className={'detail-overlay'+(readingMode?' detail-overlay--reader':'')} onClick={onClose}>
   <article className={'detail-panel'+(readingMode?' detail-panel--reader':'')} data-lenis-prevent role="dialog" aria-modal="true" aria-labelledby="project-title" tabIndex={-1} ref={dialogRef} onClick={e=>e.stopPropagation()} onWheel={e=>e.stopPropagation()}>
    <div className="detail-header">
     <span className="index">{p.id==='betem'?'DOSSIER DE STAGE / BETEM':`DÉCRYPTAGE / PROJET ${p.no}`}</span>
     <div className="detail-header-actions">
      <div className="detail-view-switch" role="group" aria-label="Mode de consultation de l’étude">
       <button type="button" aria-pressed={!readingMode} onClick={()=>switchMode(false)} title="Consultation classique en panneau latéral"><PanelRightOpen size={17}/> CLASSIQUE</button>
       <button type="button" aria-pressed={readingMode} onClick={()=>switchMode(true)} title="Lecture plein écran avec illustrations agrandies">{readingMode?<Minimize2 size={17}/>:<Maximize2 size={17}/>} PLEIN ÉCRAN</button>
      </div>
      <button type="button" onClick={onClose} className="detail-close"><X size={19}/> FERMER</button>
     </div>
    </div>
    <div className="detail-reading-hint"><Mouse size={14}/> DÉFILEMENT À LA MOLETTE <span>·</span> CLIQUE SUR LES SCHÉMAS POUR LES AGRANDIR</div>
    <div className="detail-content">
    <div className="detail-hero"><div><p className="project-subtitle">{p.field} · {p.period}</p><h2 id="project-title">{p.name}</h2><p className="detail-lead">{p.description}</p><span className="status-line">{['bms','pv'].includes(p.id)?<AlertCircle size={15}/>:<CheckCircle2 size={15}/>} {p.status}</span></div><ProjectVisual kind={p.icon} image={p.cover} alt={'Photographie ou schéma : '+p.name} rotation={p.coverRotation||0} priority/></div>
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
    </div>
  </article></div>;
}

function App(){
  const [project,setProject]=useState(null);const [zoom,setZoom]=useState(null);
  const [showDocumentCatalogue,setShowDocumentCatalogue]=useState(false);
  const [selectedProjectId,setSelectedProjectId]=useState('pv');
  const lenisRef=useRef(null);
  const closeDetail=()=>{setProject(null);setZoom(null)};
  useEffect(()=>{
    const lenis=new Lenis({duration:1.2,smoothWheel:true,prevent:node=>Boolean(node?.closest?.('[data-lenis-prevent]'))});lenisRef.current=lenis;let raf;const tick=t=>{lenis.raf(t);raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick);
    lenis.on('scroll',ScrollTrigger.update);
    const anims=gsap.utils.toArray('.reveal').map(el=>gsap.fromTo(el,{opacity:0,y:35},{opacity:1,y:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
    return()=>{cancelAnimationFrame(raf);lenis.destroy();lenisRef.current=null;anims.forEach(a=>a.kill());ScrollTrigger.getAll().forEach(t=>t.kill())};
  },[]);
  useEffect(()=>{
    const hasDialog=Boolean(project||zoom);
    document.body.style.overflow=hasDialog?'hidden':'';
    if(hasDialog)lenisRef.current?.stop();
    else lenisRef.current?.start();
    return()=>{document.body.style.overflow=''};
  },[project,zoom]);
  useEffect(()=>{
    if(!zoom)return;
    const handle=e=>{if(e.key==='Escape'){e.stopPropagation();setZoom(null)}};
    window.addEventListener('keydown',handle);
    return()=>window.removeEventListener('keydown',handle);
  },[zoom]);
  const openProject=(p)=>{setProject(p);setZoom(null)};
  const selectedProject=academicProjects.find(p=>p.id===selectedProjectId)||tutoredProjects[0];
  const selectProject=p=>{
    setSelectedProjectId(p.id);
    requestAnimationFrame(()=>{
      lenisRef.current?.scrollTo('#project-featured',{offset:-80,duration:.85});
    });
  };
  return <><div className="desktop-note">Cette expérience est conçue pour un écran d'ordinateur (largeur minimale : 950 px).</div><div className="site"><ElectricAmbient/><CircuitInteractions paused={Boolean(project||zoom)}/><div className="grain" aria-hidden="true"/>{!project&&!zoom&&<EdgeNavigation/>}
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
          <p>Une réalisation à découvrir à la fois. Parcourez les projets tutorés et les SAE depuis la liste, classés de la troisième à la première année.</p>
        </div>
        <div id="project-featured" className="project-selected">
          <div className="project-selected__heading">
            <div>
              <span>PROJET EN VEDETTE / BUT{selectedProject.year}</span>
              <h3>{selectedProject.category==='tutored'?'PROJET TUTORÉ':'SAE & RÉALISATION PRATIQUE'}</h3>
            </div>
            <span className="project-selected__counter">01 PROJET AFFICHÉ · {academicProjects.length} DISPONIBLES</span>
          </div>
          <ProjectCard key={selectedProject.id} project={selectedProject}
            featured={['pv','bms'].includes(selectedProject.id)}
            onOpen={openProject}/>
        </div>
        <ProjectSelector selectedId={selectedProject.id} onSelect={selectProject}/>
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

      <section id="documents" className="section documents">
        <SectionHeader number="06" title="DOCUMENTS & PREUVES" aside="DOSSIERS TECHNIQUES"/>
        <div className="documents-heading reveal">
          <h2>DES TRACES <span>CONCRÈTES.</span></h2>
          <p>Accès aux rapports, schémas et pièces de conception. Les documents sont également accessibles depuis leurs études respectives.</p>
        </div>
        <div className="documents-quick-list">
          {highlightedDocuments.map((doc,i)=><a className="documents-quick-link" href={doc.url}
            target="_blank" rel="noopener noreferrer" key={doc.url+'-'+i}>
            <doc.icon size={19}/>
            <span><small>{doc.type}</small><strong>{doc.title}</strong></span>
            <ArrowUpRight size={17}/>
          </a>)}
        </div>
        <button className="documents-expand" type="button"
          onClick={()=>setShowDocumentCatalogue(open=>!open)}
          aria-expanded={showDocumentCatalogue} aria-controls="document-catalogue">
          <FileText size={17}/>
          <span>{showDocumentCatalogue?'MASQUER LES DOCUMENTS COMPLÉMENTAIRES':`PARCOURIR LES ${remainingDocuments.length} AUTRES DOCUMENTS`}</span>
          <ChevronRight size={18} className={showDocumentCatalogue?'documents-expand__chevron documents-expand__chevron--open':'documents-expand__chevron'}/>
        </button>
        <div id="document-catalogue" className="documents-catalogue" hidden={!showDocumentCatalogue}>
          {remainingDocuments.map((doc,i)=><a key={doc.url+'-'+i}
            href={doc.url} target="_blank" rel="noopener noreferrer" className="documents-catalogue-link">
            <div><span>{doc.type}</span><strong>{doc.title}</strong></div>
            <ArrowUpRight size={16}/>
          </a>)}
        </div>
      </section>

      <section id="contact" className="section contact"><SectionHeader number="07" title="CONTACT"/><p className="reveal">UNE QUESTION SUR UN PROJET OU UNE OPPORTUNITÉ ?</p><a className="contact-title reveal" href="mailto:hicham.el-hajjaji@etu.umontpellier.fr">ÉCHANGEONS <ArrowUpRight/></a><div className="contact-bottom"><a href="mailto:hicham.el-hajjaji@etu.umontpellier.fr">HICHAM.EL-HAJJAJI@ETU.UMONTPELLIER.FR</a><a href="tel:+33777389922">07 77 38 99 22</a><span>MONTPELLIER · FRANCE</span></div></section>
    </main><footer><span>© 2026 HICHAM EL HAJJAJI</span><a href="#accueil">RETOUR EN HAUT ↑</a><span>BUT GEII / ÉLECTRICITÉ & MAÎTRISE DE L'ÉNERGIE</span></footer>
    {project&&<ProjectDetail project={project} onClose={closeDetail} onZoom={setZoom} isZoomOpen={Boolean(zoom)}/>}
    {zoom&&<div className="zoom-overlay" onClick={()=>setZoom(null)} role="presentation"><div className="zoom-frame" data-lenis-prevent onWheel={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label={zoom.title}><button onClick={()=>setZoom(null)} type="button"><X size={20}/> FERMER</button><img src={zoom.image} alt={zoom.title} style={zoom.rotation?{transform:`rotate(${zoom.rotation}deg)`}:undefined}/><div><strong>{zoom.title}</strong><span>{zoom.desc}</span></div></div></div>}
  </div></>;
}

createRoot(document.getElementById('root')).render(<App/>);
