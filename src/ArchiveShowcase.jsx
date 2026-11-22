import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, ArrowLeft, X, FileText, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import ancienPortfolio from './ancienPortfolio.json';
import './archive.css';

/**
 * Les pages ci-dessous proviennent exclusivement de l'export Google Takeout.
 * Aucun texte historique n'est interprété comme une preuve de résultat vérifié.
 */
export default function ArchiveShowcase(){
  const [selected,setSelected]=useState(null);
  const [photo,setPhoto]=useState(null);
  const [filter,setFilter]=useState('tous');
  const pages=useMemo(()=>ancienPortfolio.filter(p=>filter==='tous'||p.type===filter),[filter]);
  const docCount=ancienPortfolio.reduce((n,p)=>n+(p.documents?.length||0),0);
  useEffect(()=>{
    if(!selected && !photo)return;
    const previous=document.body.style.overflow;
    document.body.style.overflow='hidden';
    const onKey=(event)=>{if(event.key==='Escape'){if(photo)setPhoto(null);else setSelected(null)}};
    window.addEventListener('keydown',onKey);
    return()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',onKey)};
  },[selected,photo]);
  return <section id="archives" className="section import-archives">
    <div className="section-heading"><span className="index">05 / ARCHIVES DE L'ANCIEN PORTFOLIO</span><span className="rule"/><span className="heading-aside">SOURCES GOOGLE TAKEOUT · 2026</span></div>
    <div className="import-intro">
      <div><p className="import-kicker">LA MÉMOIRE DES PROJETS</p><h2>TOUT MON <span>PARCOURS.</span></h2></div>
      <p>Les rubriques de l'ancien portfolio sont reprises ici avec leurs textes intégraux, illustrations originales et liens de documents. Sélectionnez une page pour consulter le dossier complet dans le même esprit visuel que le BMS.</p>
    </div>
    <div className="import-stats">
      <div><strong>{ancienPortfolio.length}</strong><span>PAGES IMPORTÉES</span></div>
      <div><strong>{docCount}</strong><span>DOCUMENTS LIÉS</span></div>
      <div><strong>{ancienPortfolio.reduce((n,p)=>n+(p.images?.length||0),0)}</strong><span>VISUELS RÉFÉRENCÉS</span></div>
    </div>
    <div className="import-filters" aria-label="Filtrer les archives">
      {[['tous','TOUTES'],['projet','PROJETS'],['competence','COMPÉTENCES'],['profil','PRÉSENTATION'],['general','AUTRES']].map(([value,label])=><button key={value} type="button" className={filter===value?'active':''} onClick={()=>setFilter(value)}>{label}</button>)}
    </div>
    {ancienPortfolio.length===0&&<p className="import-placeholder">L'intégration est préparée sur GitHub. Exécute l'importeur Google Takeout indiqué dans le README afin d'ajouter les textes et les photographies d'origine.</p>}
    <div className="import-grid">{pages.map((page,i)=><button key={page.id} className="import-card" type="button" onClick={()=>setSelected(page)}>
      <span className="import-card-code">ARCHIVE {String(i+1).padStart(2,'0')} / {page.type.toUpperCase()}</span>
      {page.images?.[0]&&<img src={page.images.find(img=>!img.partagee)?.src||page.images[0].src} alt="" loading="lazy"/>}
      <h3>{page.titre}</h3>
      <p>{page.sections?.length||0} sections · {page.images?.length||0} images · {page.documents?.length||0} documents</p>
      <span className="import-card-action">CONSULTER <ArrowUpRight size={17}/></span>
    </button>)}</div>
    {selected&&<div className="import-overlay" onClick={()=>setSelected(null)}>
      <article className="import-panel" role="dialog" aria-modal="true" aria-labelledby="import-selected-title" onClick={e=>e.stopPropagation()}>
        <header className="import-panel-header"><span>GOOGLE SITES / PAGE ORIGINALE</span><button type="button" onClick={()=>setSelected(null)}><X size={18}/> FERMER</button></header>
        <div className="import-panel-title"><span>{selected.type==='projet'?'PROJET TECHNIQUE':selected.type==='competence'?'RÉFÉRENTIEL DE COMPÉTENCES':'PRÉSENTATION & PARCOURS'}</span><h2 id="import-selected-title">{selected.titre}</h2><p>Version historique importée depuis Google Takeout. Les affirmations du site d'origine peuvent avoir évolué depuis leur rédaction.</p></div>
        {selected.source==='BMS.html'&&<div className="import-warning"><AlertTriangle size={21}/><p>Le site d'origine annonçait une validation des tests BMS. Les mesures reprises dans le portfolio actuel montrent au contraire une sortie à 0 V et un shunt de valeur incorrecte : conserver ce texte pour mémoire, sans le présenter comme une preuve de bon fonctionnement.</p></div>}
        {selected.source==='Stage chez BETEM.html'&&<div className="import-warning"><AlertTriangle size={21}/><p>Les documents et schémas liés au stage peuvent être soumis à une autorisation de diffusion de l'entreprise avant publication du site.</p></div>}
        <div className="import-chapters">{selected.sections?.map((s,i)=><div key={i} className="import-chapter">
          <small>{String(i+1).padStart(2,'0')} / DOSSIER TECHNIQUE</small><h3>{s.titre}</h3>
          <div>{s.blocs?.map((b,j)=>b.type==='puce'?<p key={j} className="import-bullet">— &nbsp; {b.texte}</p>:<p key={j}>{b.texte}</p>)}</div>
        </div>)}</div>
        {selected.images?.length>0&&<section className="import-proof"><h3><ImageIcon size={18}/> PHOTOGRAPHIES ET ILLUSTRATIONS DE L'ARCHIVE</h3><div className="import-gallery">{selected.images.map((img,i)=><button type="button" key={img.src} onClick={()=>setPhoto({src:img.src,title:selected.titre})}><img src={img.src} alt={selected.titre+' — illustration '+(i+1)} loading="lazy"/><span>VISUEL {String(i+1).padStart(2,'0')} <ArrowUpRight size={15}/></span></button>)}</div></section>}
        {selected.documents?.length>0&&<section className="import-docs"><h3><FileText size={18}/> DOCUMENTS D'ORIGINE</h3><p>Liens Drive préservés depuis l'ancien site : leur consultation dépend des autorisations de partage du compte propriétaire.</p><div>{selected.documents.map((doc,i)=><a key={doc.url+i} href={doc.url} target="_blank" rel="noopener noreferrer">{doc.titre}<ArrowUpRight size={17}/></a>)}</div></section>}
        {selected.liens?.length>0&&<section className="import-docs"><h3>LIENS EXTERNES D'ORIGINE</h3><div>{selected.liens.map((l,i)=><a key={i} href={l.url} target="_blank" rel="noopener noreferrer">{l.titre||'Ouvrir le lien'}<ArrowUpRight size={17}/></a>)}</div></section>}
        <button className="import-back" type="button" onClick={()=>setSelected(null)}><ArrowLeft size={16}/> RETOUR À LA LISTE</button>
      </article>
    </div>}
    {photo&&<div className="import-zoom" role="dialog" aria-modal="true" aria-label={photo.title} onClick={()=>setPhoto(null)}><button type="button" onClick={()=>setPhoto(null)}><X size={18}/> FERMER</button><img src={photo.src} alt={photo.title} onClick={e=>e.stopPropagation()}/></div>}
  </section>;
}
