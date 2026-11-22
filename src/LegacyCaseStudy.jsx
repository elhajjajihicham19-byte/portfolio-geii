import React, {useState} from 'react';
import {ArrowUpRight, BookOpen, Camera, ChevronRight, FileText, Info, Layers3, ShieldCheck, ZoomIn} from 'lucide-react';
import {legacyNarratives} from './legacyNarratives.js';
import './legacy-case-study.css';

/**
 * Même rythme de lecture que la fiche BMS :
 * cahier des charges -> architecture -> conception -> essais -> critique -> compétences.
 * Photos d'origine dans les chapitres. Le texte Takeout complet reste accessible.
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
  <p>Ces documents proviennent du portfolio initial et sont conservés sous leur nom d’origine.</p>
 </div>;
}
function LegacyPhoto({ev,onZoom,i}){
 return <figure className="legacy-chapter-figure">
  <button type="button" onClick={()=>onZoom(ev)} aria-label={'Agrandir une illustration du projet : '+ev.title}>
   <img src={ev.image} alt={ev.title} loading="lazy"/>
   <span><ZoomIn size={17}/> AGRANDIR</span>
  </button>
  <figcaption><strong>Illustration d’origine {String(i+1).padStart(2,'0')}</strong>
   <span>{ev.desc||'Image authentique récupérée depuis le portfolio Google Sites.'}</span>
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
 const [sourceOpen,setSourceOpen]=useState(false);
 const data=legacyNarratives[project.id];
 if(!data)return null;
 const figures=project.evidence||[];
 const pictureChapters=picturePositions(figures.length);
 return <div className="bms-study legacy-study">
  <div className="bms-study-heading">
   <span>RÉALISATION UNIVERSITAIRE / DOSSIER GEII D’ORIGINE</span>
   <h3>DU BESOIN <em>À LA VÉRIFICATION.</em></h3>
   <p>{data.subtitle}. Cette fiche présente la démarche suivie, les étapes de conception et les contrôles réalisés. Les explications sont rédigées à partir des pièces du projet ; leurs formulations originales restent consultables en annexe.</p>
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
      {i===4&&<p className="legacy-precision"><Info size={17}/> Les observations, valeurs et limites sont reprises des travaux historiques. Le texte ne constitue pas une nouvelle vérification expérimentale.</p>}
      {i===5&&<div className="legacy-skills-list">{(project.skills||[]).map(skill=><span key={skill}>{skill}</span>)}</div>}
     </div>
     {!!figureIndexes.length&&<div className="legacy-chapter-photo-stack">{figureIndexes.map(index=><LegacyPhoto key={index} ev={figures[index]} onZoom={onZoom} i={index}/>)}</div>}
    </div>
   </section>
  })}
  {figures.length===0&&<div className="legacy-no-photo"><Camera size={22}/><p>Cette page de l'ancien portfolio ne contenait pas de photographie spécifique à cette réalisation. Les documents techniques d'origine sont disponibles dans la partie vérification, sans photographie générique présentée comme une preuve.</p></div>}
  <details open={sourceOpen} onToggle={e=>setSourceOpen(e.currentTarget.open)} className="legacy-full-source">
   <summary>TRANSCRIPTION INTÉGRALE DE L’ANCIEN PORTFOLIO <ChevronRight size={18}/></summary>
   <p>Les textes suivants sont conservés dans leur formulation d’origine pour la traçabilité du dossier. Les synthèses de la fiche principale sont destinées à faciliter la lecture.</p>
   <div className="historical-grid">{(project.originalSections||[]).map((chapter,i)=><section key={i} className="historical-chapter">
    <span className="chapter-index">{String(i+1).padStart(2,'0')}</span>
    <h3>{chapter.titre}</h3>
    {(chapter.blocs||[]).map((block,j)=><p key={j} className={block.type==='puce'?'historical-bullet':''}>{block.type==='puce'?'— ':''}{block.texte}</p>)}
   </section>)}</div>
  </details>
 </div>;
}
