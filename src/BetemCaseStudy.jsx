import React, {useState} from 'react';
import {ArrowUpRight, Building2, CircuitBoard, ClipboardCheck, FileText, Gauge, GraduationCap, Layers3, ZoomIn} from 'lucide-react';
import './betem-case-study.css';

/**
 * Stage professionnel — dossier autonome présenté au lecteur.
 * Les sources et photographies restent celles du dossier BETEM autorisé.
 * Les fichiers sont conservés dans ancienPortfolio.json, non rendu comme archive.
 */
const stages=[
  {
    title:'DU CONTEXTE PROFESSIONNEL AU PROJET',
    heading:'Découvrir le fonctionnement d’un bureau d’études techniques.',
    text:'J’ai effectué un stage de dix semaines au sein de BETEM Montpellier, un bureau d’études techniques pluridisciplinaire intervenant notamment en électricité CFO/CFA, CVC, plomberie et structure. J’ai découvert la coordination entre les différents lots et le rôle des pièces techniques dans un projet de construction.'
  },
  {
    title:'PROJET PRINCIPAL / ÉCOLE JEAN MACÉ',
    heading:'Participer à la restructuration des installations électriques.',
    text:'Mon travail a principalement porté sur l’étude de l’école Jean Macé à Sète : implantations électriques CFO/CFA, éclairage, répartition des puissances et élaboration des documents de conception. Le dossier comprenait notamment un bilan de puissance de 199 kVA pour le TGBT, sur une distribution triphasée 230/400 V.'
  },
  {
    title:'CONCEPTION ET IMPLANTATIONS',
    heading:'Passer des plans architecturaux aux implantations CFO/CFA.',
    text:'J’ai participé au placement des luminaires, appareillages et équipements de courant fort et de courant faible sur les plans. J’ai également travaillé sur les schémas et synoptiques des réseaux, l’organisation des tableaux et la cohérence des légendes, principalement avec AutoCAD et Revit.'
  },
  {
    title:'ÉTUDES ET DIMENSIONNEMENT',
    heading:'Justifier les choix techniques et les puissances.',
    text:'J’ai réalisé des études d’éclairement sous DIALux evo, contribué aux bilans de puissance et abordé le dimensionnement des installations avec Caneco BT. Les implantations de brasseurs d’air et les corrections de pièces écrites faisaient également partie du travail de conception. Ces livrables doivent rester cohérents entre les plans, tableaux et prescriptions.'
  },
  {
    title:'VÉRIFICATION ET LIVRABLES',
    heading:'Contrôler la cohérence d’un dossier technique.',
    text:'J’ai travaillé sur des vérifications entre plans d’implantation, synoptiques, bilans de puissance et pièces techniques. J’ai également contribué aux corrections de CCTP et à l’organisation des documents. Les extraits présentés ci-dessous correspondent aux illustrations conservées dans mon dossier de stage.'
  },
  {
    title:'COMPÉTENCES ET RETOUR D’EXPÉRIENCE',
    heading:'Comprendre la rigueur d’un projet de bureau d’études.',
    text:'Cette expérience m’a permis de mieux relier les exigences techniques, les contraintes de chantier et les documents livrables. J’ai progressé dans la préparation des études, l’utilisation d’outils professionnels et les vérifications croisées. Je souhaite encore approfondir le calcul des courants de court-circuit, la sélectivité des protections et les réseaux de distribution.'
  }
];
const tags=['CONTEXTE','PROJET PRINCIPAL','IMPLANTATIONS','CALCULS','VÉRIFICATIONS','BILAN'];
const icons=[Building2,Layers3,CircuitBoard,Gauge,ClipboardCheck,GraduationCap];
function Evidence({item,i,onZoom}){
  return <figure className="betem-evidence">
    <button type="button" onClick={()=>onZoom(item)} aria-label={'Agrandir le document de stage '+(i+1)}>
      <img loading="lazy" src={item.image} alt={item.title||'Plan ou photographie du stage BETEM'}/>
      <span><ZoomIn size={16}/> AGRANDIR</span>
    </button>
    <figcaption><strong>FIGURE {String(i+1).padStart(2,'0')}</strong><span>Extrait ou photographie issu des travaux du stage chez BETEM.</span></figcaption>
  </figure>
}
function StageDocuments({docs}){
  const [preview,setPreview]=useState(null);
  if(!docs?.length)return null;
  const chosen=preview===null?null:docs[preview];
  const id=chosen?.url?.includes('drive.google.com/file/d/')?chosen.url.split('/file/d/')[1]?.split('/')[0]:null;
  return <div className="betem-stage-documents">
    <div className="betem-doc-intro"><FileText size={22}/><div><strong>Pièces de présentation du stage</strong><p>Rapport de stage et présentation de soutenance.</p></div></div>
    {docs.map((doc,i)=><div className="betem-doc-item" key={doc.url+i}>
      <a href={doc.url} target="_blank" rel="noopener noreferrer"><FileText size={16}/>{doc.label}<ArrowUpRight size={16}/></a>
      <button type="button" aria-expanded={preview===i} onClick={()=>setPreview(preview===i?null:i)}>{preview===i?'MASQUER':'APERÇU'}</button>
    </div>)}
    {!!id&&<div className="betem-doc-preview"><iframe title={chosen.label} loading="lazy" src={'https://drive.google.com/file/d/'+id+'/preview'}/><p>L’affichage intégré dépend des autorisations de partage Google Drive.</p></div>}
  </div>
}
export default function BetemCaseStudy({project,onZoom}){
  const media=(project.evidence||[]).filter(item=>item.image!=='/assets/betem-plan-extrait-reel.webp');
  return <div className="bms-study betem-study">
    <div className="bms-study-heading"><span>STAGE PROFESSIONNEL / AVRIL — JUIN 2026</span><h3>DES ÉTUDES <em>AUX LIVRABLES.</em></h3><p>Chez BETEM Montpellier, j’ai participé à la conception d’installations électriques pour des bâtiments, avec un projet principal consacré à l’école Jean Macé. Les plans, schémas et photographies sont directement associés aux missions réalisées.</p></div>
    {stages.map((step,i)=>{
      const Icon=icons[i];
      const group=i===2?media.slice(0,4):i===4?media.slice(4):[];
      return <section className="bms-chapter" key={i}>
        <div className="bms-chapter-index"><span>{String(i+1).padStart(2,'0')} / {step.title}</span><Icon size={22}/></div>
        <div className="betem-stage-layout">
          <div className="betem-stage-content"><h4>{step.heading}</h4><p>{step.text}</p>
          {i===1&&<div className="betem-stage-facts"><div><b>199 kVA</b><span>Bilan TGBT du projet</span></div><div><b>230/400 V</b><span>Distribution triphasée BT</span></div><div><b>10 semaines</b><span>Immersion en bureau d’études</span></div></div>}
          {i===5&&<StageDocuments docs={project.docs}/>}
          </div>
          {i===1&&<figure className="betem-evidence betem-featured-plan"><button type="button" onClick={()=>onZoom({image:'/assets/betem-plan-extrait-reel.webp',title:'Plan CFO/CFA du stage BETEM',desc:'Extrait authentique du dossier de conception.'})}><img src="/assets/betem-plan-extrait-reel.webp" alt="Extrait de plan CFO/CFA du dossier BETEM" loading="lazy"/><span><ZoomIn size={16}/> AGRANDIR</span></button><figcaption><strong>PLAN D’IMPLANTATION CFO/CFA</strong><span>Extrait réel du dossier étudié pendant le stage.</span></figcaption></figure>}
        </div>
        {group.length>0&&<div className="betem-evidence-grid">{group.map((item,j)=><Evidence key={item.image} item={item} i={i===2?j:j+4} onZoom={onZoom}/>)}</div>}
      </section>;
    })}
  </div>;
}
