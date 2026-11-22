import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, ArrowLeft, ArrowRight, X, FileText, AlertTriangle, Image as ImageIcon, Layers3, BookOpen } from 'lucide-react';
import ancienPortfolio from './ancienPortfolio.json';
import './archive.css';

// Reprise fidèle de l'ancien site. Les textes sont conservés et distingués
// des commentaires actuels : une photographie ne valide pas un essai technique.
const categories = [
  ['projet','PROJETS'],
  ['competence','COMPÉTENCES'],
  ['profil','MON PARCOURS'],
  ['general','AUTRES PAGES'],
  ['tous','TOUT VOIR']
];
function extractSummary(page) {
  for (const section of page.sections || []) {
    for (const block of section.blocs || []) {
      const v=(block.texte||'').replace(/\s+/g,' ').trim();
      if (v.length > 55) return v.length > 220 ? v.slice(0,218).replace(/\s+\S*$/,'')+'…' : v;
    }
  }
  return 'Dossier complet extrait de mon ancien portfolio : démarche, preuves et compétences associées.';
}
function getImage(page) {
  return page.images?.find(img=>!img.partagee)?.src || page.images?.[0]?.src || null;
}
const typeLabel = type => ({
  projet:'PROJET UNIVERSITAIRE',
  competence:'COMPÉTENCE GEII',
  profil:'PARCOURS PERSONNEL',
  general:'RUBRIQUE DU PORTFOLIO'
})[type] || 'PORTFOLIO GEII';

export default function ArchiveShowcase(){
  const [selected,setSelected]=useState(null);
  const [photo,setPhoto]=useState(null);
  const [filter,setFilter]=useState('projet');
  const pages=useMemo(()=>ancienPortfolio.filter(p=>filter==='tous'||p.type===filter),[filter]);
  const totalImages=useMemo(()=>ancienPortfolio.reduce((n,p)=>n+(p.images?.length||0),0),[]);
  const totalDocs=useMemo(()=>ancienPortfolio.reduce((n,p)=>n+(p.documents?.length||0),0),[]);
  const currentIndex=selected ? ancienPortfolio.findIndex(p=>p.id===selected.id) : -1;
  useEffect(()=>{
    if(!selected&&!photo)return;
    const old=document.body.style.overflow;
    document.body.style.overflow='hidden';
    const onKey=e=>{
      if(e.key==='Escape'){ if(photo)setPhoto(null); else setSelected(null); }
      if(selected&&!photo&&e.key==='ArrowRight')setSelected(ancienPortfolio[(currentIndex+1)%ancienPortfolio.length]);
      if(selected&&!photo&&e.key==='ArrowLeft')setSelected(ancienPortfolio[(currentIndex+ancienPortfolio.length-1)%ancienPortfolio.length]);
    };
    window.addEventListener('keydown',onKey);
    return()=>{document.body.style.overflow=old;window.removeEventListener('keydown',onKey);};
  },[selected,photo,currentIndex]);
  const openPage=page=>{setSelected(page);setPhoto(null)};
  return <section id="archives" className="section import-archives">
    <div className="section-heading"><span className="index">05 / PROJETS & DOSSIERS COMPLETS</span><span className="rule"/><span className="heading-aside">CONTENU ORIGINAL RÉCUPÉRÉ SUR GOOGLE SITES</span></div>
    <div className="import-intro">
      <div><p className="import-kicker">ÉLECTRONIQUE · ÉNERGIE · AUTOMATISME</p><h2>MES AUTRES <span>RÉALISATIONS.</span></h2></div>
      <p>De la conception électronique à l'installation et au diagnostic, chaque réalisation possède maintenant sa fiche complète : objectifs, démarche, travaux, résultats, preuves et documents issus du portfolio d'origine.</p>
    </div>
    <div className="import-stats" aria-label="Contenu du portfolio">
      <div><strong>{ancienPortfolio.filter(p=>p.type==='projet').length}</strong><span>PROJETS DÉTAILLÉS</span></div>
      <div><strong>{ancienPortfolio.length}</strong><span>PAGES DE PARCOURS</span></div>
      <div><strong>{totalDocs}</strong><span>DOCUMENTS RÉFÉRENCÉS</span></div>
      <div><strong>{totalImages}</strong><span>VISUELS DANS LES DOSSIERS</span></div>
    </div>
    <div className="import-toolbar">
      <div className="import-filters" aria-label="Afficher les rubriques du portfolio">
        {categories.map(([value,label])=><button key={value} type="button" className={filter===value?'active':''} aria-pressed={filter===value} onClick={()=>setFilter(value)}>{label}</button>)}
      </div>
      <span className="import-count">{pages.length} FICHES</span>
    </div>
    {ancienPortfolio.length===0&&<p className="import-placeholder">Les données d'origine doivent être générées par l'import Google Takeout avant d'être affichées.</p>}
    <div className="import-grid">{pages.map((page,i)=>{
      const picture=getImage(page);
      return <button key={page.id} className="import-card" type="button" onClick={()=>openPage(page)}>
        <div className="import-card-media">
          {picture ? <img src={picture} alt={'Illustration issue du projet '+page.titre} loading="lazy"/> : <div className="import-card-empty"><Layers3 size={64}/><span>DOSSIER TECHNIQUE</span></div>}
          <span className="import-category">{typeLabel(page.type)}</span>
        </div>
        <div className="import-card-body">
          <span className="import-card-code">DOSSIER {String(i+1).padStart(2,'0')} <span>—</span> PORTFOLIO GEII</span>
          <h3>{page.titre}</h3>
          <p className="import-card-excerpt">{extractSummary(page)}</p>
          <div className="import-card-facts"><span><BookOpen size={15}/> {page.sections?.length||0} CHAPITRES</span><span><ImageIcon size={15}/> {page.images?.length||0} VISUELS</span>{!!page.documents?.length&&<span><FileText size={15}/> {page.documents.length} DOC.</span>}</div>
          <span className="import-card-action">EXPLORER LE DOSSIER <ArrowUpRight size={19}/></span>
        </div>
      </button>;
    })}</div>

    {selected&&<div className="import-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}>
      <article key={selected.id} className="import-panel" role="dialog" aria-modal="true" aria-labelledby="import-selected-title">
        <header className="import-panel-header"><span>PORTFOLIO GEII / DOCUMENTATION TECHNIQUE</span><button type="button" onClick={()=>setSelected(null)}><X size={18}/> FERMER</button></header>
        <div className="import-panel-hero">
          <div className="import-panel-title">
            <span>{typeLabel(selected.type)} / {String(currentIndex+1).padStart(2,'0')}</span>
            <h2 id="import-selected-title">{selected.titre}</h2>
            <p>{extractSummary(selected)}</p>
            <div className="import-hero-facts"><span>{selected.sections?.length||0} CHAPITRES</span><span>{selected.images?.length||0} ILLUSTRATIONS</span><span>{selected.documents?.length||0} DOCUMENTS</span></div>
          </div>
          {getImage(selected)&&<div className="import-panel-photo"><img src={getImage(selected)} alt={'Image originale de '+selected.titre} /></div>}
        </div>
        {selected.source==='BMS.html'&&<div className="import-warning"><AlertTriangle size={21}/><p>Le texte historique décrit une validation des essais. Les mesures plus récentes montrent une sortie à 0 V et un défaut de valeur du shunt : ce dossier est conservé comme trace du travail, pas comme preuve que le BMS fonctionne.</p></div>}
        {selected.source==='Stage chez BETEM.html'&&<div className="import-warning"><AlertTriangle size={21}/><p>Les pièces et plans professionnels de BETEM nécessitent une vérification des autorisations de diffusion avant publication du site.</p></div>}
        <div className="import-dossier">
          <div className="import-dossier-aside"><span>LE DOSSIER</span><strong>{String(selected.sections?.length||0).padStart(2,'0')}</strong><p>Sections retrouvées dans le portfolio d'origine. L'intégralité du texte est conservée.</p></div>
          <div className="import-chapters">
            {selected.sections?.map((s,i)=><section key={i} className="import-chapter">
              <span className="import-chapter-number">{String(i+1).padStart(2,'0')} <span>/</span> {String(selected.sections.length).padStart(2,'0')}</span>
              <h3>{s.titre}</h3>
              <div className="import-chapter-text">{s.blocs?.length?s.blocs.map((b,j)=><p className={b.type==='puce'?'import-bullet':''} key={j}>{b.type==='puce'&&<span aria-hidden="true">— </span>}{b.texte}</p>):<p>Cette partie est constituée d'un titre dans le document d'origine.</p>}</div>
            </section>)}
          </div>
        </div>
        {selected.images?.length>0&&<section className="import-proof">
          <div className="import-section-heading"><span>PREUVES ET ILLUSTRATIONS</span><span>{selected.images.length} DOCUMENTS VISUELS</span></div>
          <p className="import-support-note">Photographies, schémas et illustrations récupérés depuis l'ancien portfolio. Cliquez sur une image pour l'agrandir.</p>
          <div className="import-gallery">{selected.images.map((img,i)=><button type="button" key={img.src} onClick={()=>setPhoto({src:img.src,title:selected.titre+' — visuel '+(i+1)})}>
            <img src={img.src} alt={'Illustration '+(i+1)+' du dossier '+selected.titre} loading="lazy"/><span>DOCUMENT {String(i+1).padStart(2,'0')} <ArrowUpRight size={17}/></span>
          </button>)}</div>
        </section>}
        {selected.documents?.length>0&&<section className="import-docs"><div className="import-section-heading"><span>DOCUMENTS ET JUSTIFICATIFS</span><span>{selected.documents.length} RÉFÉRENCES</span></div><p>Liens Drive conservés à l'identique. Leur ouverture dépend des droits de partage définis par leur propriétaire.</p><div>{selected.documents.map((doc,i)=><a key={doc.url+i} href={doc.url} target="_blank" rel="noopener noreferrer"><FileText size={17}/><span>{doc.titre}</span><ArrowUpRight size={17}/></a>)}</div></section>}
        {selected.liens?.length>0&&<section className="import-docs"><div className="import-section-heading"><span>LIENS DE LA PAGE D'ORIGINE</span></div><div>{selected.liens.map((link,i)=><a key={link.url+i} href={link.url} target="_blank" rel="noopener noreferrer"><ArrowUpRight size={16}/><span>{link.titre||'Ouvrir le lien externe'}</span></a>)}</div></section>}
        <footer className="import-panel-footer"><button type="button" onClick={()=>setSelected(null)}><ArrowLeft size={17}/> REVENIR AUX PROJETS</button><div><button type="button" onClick={()=>openPage(ancienPortfolio[(currentIndex+ancienPortfolio.length-1)%ancienPortfolio.length])}><ArrowLeft size={17}/> PRÉCÉDENT</button><button type="button" onClick={()=>openPage(ancienPortfolio[(currentIndex+1)%ancienPortfolio.length])}>SUIVANT <ArrowRight size={17}/></button></div></footer>
      </article>
    </div>}
    {photo&&<div className="import-zoom" role="dialog" aria-modal="true" aria-label={photo.title} onMouseDown={e=>{if(e.target===e.currentTarget)setPhoto(null)}}><button type="button" onClick={()=>setPhoto(null)}><X size={18}/> FERMER</button><img src={photo.src} alt={photo.title}/></div>}
  </section>;
}
