import React, {useState} from 'react';
import {ArrowUpRight, BookOpen, Camera, FileText, Info, Layers3, ShieldCheck, ZoomIn} from 'lucide-react';
import {legacyNarratives} from './legacyNarratives.js';
import './legacy-case-study.css';

/**
 * Même rythme de lecture que la fiche BMS :
 * cahier des charges -> architecture -> conception -> essais -> critique -> compétences.
 * Photographies et preuves authentiques dans les chapitres.
 */
const sectionNames=[
 '01 / OBJECTIF & CAHIER DES CHARGES',
 '02 / PRINCIPE DE FONCTIONNEMENT',
 '03 / CONCEPTION & RÉALISATION',
 '04 / MESURES & VALIDATION',
 '05 / ANALYSE CRITIQUE',
 '06 / COMPÉTENCES DÉVELOPPÉES',
];
function IndentedSources({docs}){
 const [active,setActive]=useState(null);
 if(!docs?.length)return null;
 const selected=active===null?null:docs[active];
 const fileId=selected?.url?.includes('drive.google.com/file/d/') ? selected.url.split('/file/d/')[1]?.split('/')[0] : null;
 return <div className="legacy-inline-sources">
  <span>PIÈCES JUSTIFICATIVES ET DOCUMENTS DE TRAVAIL</span>
  {docs.map((d,i)=><div key={d.url+i} className="legacy-source-item">
    <a href={d.url} target="_blank" rel="noopener noreferrer"><FileText size={16}/><span>{d.label}</span><ArrowUpRight size={15}/></a>
    {d.url?.includes('drive.google.com/file/d/')&&<button type="button" aria-expanded={active===i} onClick={()=>setActive(active===i?null:i)}>{active===i?'MASQUER':'APERÇU'}</button>}
  </div>)}
  {selected&&fileId&&<div className="legacy-inline-preview">
    <iframe title={'Aperçu original : '+selected.label} loading="lazy" src={'https://drive.google.com/file/d/'+fileId+'/preview'}/>
    <p>Document Google Drive d’origine ; son affichage dépend des autorisations accordées aux visiteurs.</p>
  </div>}
  <p>Ces pièces sont les documents techniques associés au projet.</p>
 </div>;
}
function LegacyPhoto({ev,onZoom,i}){
 return <figure className="legacy-chapter-figure">
  <button type="button" onClick={()=>onZoom(ev)} aria-label={'Agrandir une illustration du projet : '+ev.title}>
   <img src={ev.image} alt={ev.title} loading="lazy"/>
   <span><ZoomIn size={17}/> AGRANDIR</span>
  </button>
  <figcaption><strong>Illustration du projet {String(i+1).padStart(2,'0')}</strong>
   <span>{ev.desc||'Photographie ou schéma authentique du projet.'}</span>
  </figcaption>
 </figure>
}
function picturePositions(count){
 if(count===0)return [];
 if(count===1)return [2];
 if(count===2)return [1,3];
 if(count===3)return [1,2,3];
 return [0,1,2,3,4].slice(0,count);
}
export default function LegacyCaseStudy({project,onZoom}){
 const data=legacyNarratives[project.id];
 if(!data)return null;
 const figures=project.evidence||[];
 const pictureChapters=picturePositions(figures.length);
 return <div className="bms-study legacy-study">
  <div className="bms-study-heading">
   <span>RÉALISATION UNIVERSITAIRE / PROJET GEII</span>
   <h3>DU BESOIN <em>À LA VÉRIFICATION.</em></h3>
   <p>{data.subtitle}. Cette fiche présente la démarche suivie, les étapes de conception et les contrôles réalisés. Les étapes de conception et les résultats sont illustrés par les photographies, schémas et documents du projet.</p>
  </div>
  {data.chapters.map(([title,body],i)=>{
   const figureIndexes=pictureChapters.reduce((acc,pos,index)=>{if(pos===i)acc.push(index);return acc},[]);
   return <section key={i} className="bms-chapter legacy-chapter" aria-labelledby={'geii-section-'+project.id+'-'+i}>
    <div className="bms-chapter-index"><span>{sectionNames[i]}</span>{i===0?<BookOpen size={22}/>:i===1?<Layers3 size={22}/>:i===3?<Camera size={22}/>:i===5?<ShieldCheck size={22}/>:<Info size={22}/>}</div>
    <div className={figureIndexes.length?'legacy-chapter-with-photo':'legacy-chapter-without-photo'}>
     <div className="legacy-chapter-narrative">
      <h4 id={'geii-section-'+project.id+'-'+i}>{title}</h4>
      <p>{body}</p>
      {i===3&&<IndentedSources docs={project.docs}/>}
      {i===4&&<p className="legacy-precision"><Info size={17}/> Les résultats présentés proviennent des essais du projet ; ils doivent être interprétés selon les conditions et limites décrites dans les documents techniques.</p>}
      {i===5&&<div className="legacy-skills-list">{(project.skills||[]).map(skill=><span key={skill}>{skill}</span>)}</div>}
     </div>
     {!!figureIndexes.length&&<div className="legacy-chapter-photo-stack">{figureIndexes.map(index=><LegacyPhoto key={index} ev={figures[index]} onZoom={onZoom} i={index}/>)}</div>}
    </div>
   </section>
  })}
  {figures.length===0&&<div className="legacy-no-photo"><Camera size={22}/><p>Aucune photographie spécifique n’est disponible pour cette réalisation. Les pièces techniques sont accessibles dans la partie vérification.</p></div>}
 </div>;
}
