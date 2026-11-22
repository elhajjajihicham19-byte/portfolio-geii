import React from 'react';
import {ArrowUpRight,ZoomIn} from 'lucide-react';
import projectTechnicalEvidence from './projectTechnicalEvidence.json';
import './study-highlights.css';

// Sélection de figures réellement déjà intégrées dans les dossiers.
// Les extraits sont montrés comme telles, sans en inventer les résultats.
const dedicated={
 bms:[
  {image:'/assets/bms/rapport-page-06.webp',title:'Architecture de la protection BMS',desc:'Schéma extrait du rapport du projet tutoré',chapter:1},
  {image:'/assets/bms/rapport-page-10.webp',title:'Carte conçue sous KiCad',desc:'Étape de conception du circuit imprimé',chapter:2},
  {image:'/assets/bms/rapport-page-15.webp',title:'Essais et diagnostic de la carte',desc:'Résultats de mesures documentés',chapter:3}
 ],
 cem:[
  {image:'/assets/cem-schema-reel.webp',title:'Redresseur à charge capacitive',desc:'Schéma issu du TP CEM',chapter:1},
  {image:'/assets/cem-spectre-reel.webp',title:'Spectre harmonique du courant',desc:'Analyse fréquentielle du courant absorbé',chapter:2},
  {image:'/assets/cem-pfc-reel.webp',title:'Correction active du facteur de puissance',desc:'Schéma et résultats du montage PFC',chapter:3}
 ],
 dialux:[
  {image:'/assets/dialux-reel-1.webp',title:'Modélisation sous DIALux evo',desc:'Capture de l’étude d’éclairage',chapter:1},
  {image:'/assets/dialux-reel-4.webp',title:'Résultats d’éclairement',desc:'Capture extraite du compte rendu',chapter:2},
  {image:'/assets/dialux-reel-5.webp',title:'Vérification des implantations',desc:'Illustration issue de l’étude',chapter:3}
 ]
};
function chooseFigures(project){
  const candidates=dedicated[project.id]||projectTechnicalEvidence[project.id]||[];
  const chosen=[];
  // Diversifier les étapes plutôt qu'empiler trois pages voisines.
  for(const item of candidates){
    if(!item.image||chosen.some(x=>x.image===item.image))continue;
    if(chosen.some(x=>x.chapter===item.chapter))continue;
    chosen.push(item);
    if(chosen.length===3)break;
  }
  for(const item of candidates){
    if(chosen.length>=3)break;
    if(!chosen.some(x=>x.image===item.image))chosen.push(item);
  }
  return chosen;
}
export default function StudyHighlights({project,onZoom}){
 const figures=chooseFigures(project);
 if(!figures.length)return null;
 return <section className="study-highlights" aria-label="Figures techniques à découvrir">
   <div className="study-highlights__header">
    <div><span>DOCUMENTS ET MESURES</span><h3>LES FIGURES CLÉS DU DOSSIER.</h3></div>
    <p>Sélection de schémas et résultats issus des documents du projet. Chaque figure peut être agrandie avant de poursuivre l’étude.</p>
   </div>
   <div className="study-highlights__list">
    {figures.map((fig,i)=><button type="button" key={fig.image}
      onClick={()=>onZoom(fig)} className="study-highlights__figure"
      title={'Agrandir : '+fig.title}>
       <span className="study-highlights__image"><img src={fig.image} alt={fig.title} loading="lazy"/></span>
       <span className="study-highlights__caption">
         <small>FIGURE {String(i+1).padStart(2,'0')}</small>
         <strong>{fig.title}</strong>
         <span>{fig.desc}</span>
       </span>
       <ZoomIn size={18} className="study-highlights__zoom"/>
    </button>)}
   </div>
 </section>;
}
