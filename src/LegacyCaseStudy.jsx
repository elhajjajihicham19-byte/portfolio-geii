import React, {useState} from 'react';
import {ArrowUpRight, BookOpen, Camera, FileText, Info, Layers3, ShieldCheck, ZoomIn} from 'lucide-react';
import {legacyNarratives} from './legacyNarratives.js';
import {projectTechnicalInsights} from './projectTechnicalInsights.js';
import projectTechnicalEvidence from './projectTechnicalEvidence.json';
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
  <span>SCHÉMAS ET RAPPORTS</span>
  {docs.map((d,i)=><div key={d.url+i} className="legacy-source-item">
    <a href={d.url} target="_blank" rel="noopener noreferrer"><FileText size={16}/><span>{d.label}</span><ArrowUpRight size={15}/></a>
    {d.url?.includes('drive.google.com/file/d/')&&<button type="button" aria-expanded={active===i} onClick={()=>setActive(active===i?null:i)}>{active===i?'MASQUER':'APERÇU'}</button>}
  </div>)}
  {selected&&fileId&&<div className="legacy-inline-preview">
    <iframe title={'Aperçu : '+selected.label} loading="lazy" src={'https://drive.google.com/file/d/'+fileId+'/preview'}/>
    <p>L’aperçu est disponible selon les autorisations de partage du document.</p>
  </div>}
 </div>;
}
function LegacyPhoto({ev,onZoom,i}){
 const [failed,setFailed]=useState(false);
 const isDocument=ev.image?.startsWith('/assets/studies/');
 return <figure className={'legacy-chapter-figure'+(isDocument?' legacy-chapter-figure--document':'')}>
  <button type="button" disabled={failed} onClick={()=>onZoom(ev)}
   style={{'--figure-rotation':(ev.rotation||0)+'deg'}}
   aria-label={'Agrandir une illustration du projet : '+ev.title}>
   {failed?<span className="legacy-figure-unavailable"><FileText size={24}/> Aperçu indisponible</span>:
    <img src={ev.image} alt={ev.title} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>}
   {!failed&&<span><ZoomIn size={17}/> AGRANDIR</span>}
  </button>
  <figcaption><strong>{ev.title?.startsWith('Illustration du projet')?'FIGURE '+String(i+1).padStart(2,'0'):ev.title||'FIGURE '+String(i+1).padStart(2,'0')}</strong>
   <span>{ev.desc||'Photographie ou schéma authentique du projet.'}</span>
  </figcaption>
 </figure>
}
function TechnicalInsight({item}){
 return <div className="study-insight">
  <span className="study-insight-overline">ANALYSE TECHNIQUE</span>
  <h5>{item.title}</h5>
  <p>{item.text}</p>
  {!!item.metrics?.length&&<div className="study-insight-metrics">{item.metrics.map(([value,label],idx)=><div key={idx}><strong>{value}</strong><span>{label}</span></div>)}</div>}
  {!!item.table&&<div className="study-insight-table"><table><thead><tr>{item.table.columns.map((title,idx)=><th key={idx}>{title}</th>)}</tr></thead>
  <tbody>{item.table.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}
  {item.note&&<div className="study-insight-caveat"><Info size={18}/><p>{item.note}</p></div>}
 </div>;
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
 const reportFigures=projectTechnicalEvidence[project.id]||[];
 const insights=projectTechnicalInsights[project.id]||[];
 return <div className="bms-study legacy-study">
  <div className="bms-study-heading">
   <span>{project.nature} / BUT{project.year}</span>
   <h3>DU BESOIN <em>À LA VÉRIFICATION.</em></h3>
   <p>{data.subtitle}. De l'analyse du besoin aux essais, je présente la démarche, les choix techniques, les résultats obtenus et les points à améliorer.</p>
  </div>
  {data.chapters.map(([title,body],i)=>{
   const figureIndexes=pictureChapters.reduce((acc,pos,index)=>{if(pos===i)acc.push(index);return acc},[]);
   const chapterMedia=[
     ...figureIndexes.map(index=>({item:figures[index],index})),
     ...reportFigures.filter(fig=>fig.chapter===i).map((item,index)=>({item,index:figureIndexes.length+index}))
   ];
   const chapterInsights=insights.filter(item=>item.chapter===i);
   return <section key={i} className="bms-chapter legacy-chapter" aria-labelledby={'geii-section-'+project.id+'-'+i}>
    <div className="bms-chapter-index"><span>{sectionNames[i]}</span>{i===0?<BookOpen size={22}/>:i===1?<Layers3 size={22}/>:i===3?<Camera size={22}/>:i===5?<ShieldCheck size={22}/>:<Info size={22}/>}</div>
    <div className={chapterMedia.length?'legacy-chapter-with-photo':'legacy-chapter-without-photo'}>
     <div className="legacy-chapter-narrative">
      <h4 id={'geii-section-'+project.id+'-'+i}>{title}</h4>
      <p>{body}</p>
      {chapterInsights.map((insight,j)=><TechnicalInsight key={j} item={insight}/>)}
      {i===3&&<IndentedSources docs={project.docs}/>}
      {i===5&&<div className="legacy-skills-list">{(project.skills||[]).map(skill=><span key={skill}>{skill}</span>)}</div>}
     </div>
     {!!chapterMedia.length&&<div className="legacy-chapter-photo-stack">{chapterMedia.map(({item,index},j)=><LegacyPhoto key={item.image+'-'+j} ev={item} onZoom={onZoom} i={index}/>)}</div>}
    </div>
   </section>
  })}
 </div>;
}
