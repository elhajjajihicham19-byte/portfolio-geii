import React, {useEffect,useRef,useState} from 'react';
import {BookOpen,ChevronRight} from 'lucide-react';
import './study-contents.css';

/* Le sommaire s'adapte aux chapitres réellement présents dans chaque étude.
 * Cela évite d'imposer une organisation artificielle aux dossiers BETEM,
 * BMS, photovoltaïque ou aux anciens projets GEII.
 */
export default function StudyContents({panelRef,projectId,readingMode}){
  const [chapters,setChapters]=useState([]);
  const [active,setActive]=useState(0);
  const [open,setOpen]=useState(false);
  const entriesRef=useRef([]);
  useEffect(()=>{
    const panel=panelRef.current;
    if(!panel)return;
    const elements=[...panel.querySelectorAll(
      '.detail-content .bms-chapter, .detail-content .detail-chapters > section'
    )];
    const entries=elements.map((node,i)=>{
      const raw=node.querySelector('.bms-chapter-index span, .chapter-index')?.textContent
        ||node.querySelector('h4,h3')?.textContent||'Chapitre '+(i+1);
      const title=raw.replace(/^\s*\d+\s*\/\s*/,'').trim();
      const id='study-'+projectId+'-'+String(i+1).padStart(2,'0');
      node.id=id;
      return {id,title,index:i,node};
    });
    entriesRef.current=entries;
    setChapters(entries.map(({id,title,index})=>({id,title,index})));
    let scheduled=0;
    const update=()=>{
      scheduled=0;
      const line=panel.getBoundingClientRect().top+Math.min(230,panel.clientHeight*.28);
      let current=0;
      entries.forEach((entry,i)=>{
        if(entry.node.getBoundingClientRect().top<line)current=i;
      });
      setActive(current);
    };
    const onScroll=()=>{if(!scheduled)scheduled=requestAnimationFrame(update)};
    update();
    panel.addEventListener('scroll',onScroll,{passive:true});
    return()=>{
      panel.removeEventListener('scroll',onScroll);
      if(scheduled)cancelAnimationFrame(scheduled);
    };
  },[panelRef,projectId,readingMode]);

  const goTo=index=>{
    const panel=panelRef.current;
    const target=entriesRef.current[index]?.node;
    if(!panel||!target)return;
    const offset=target.getBoundingClientRect().top-panel.getBoundingClientRect().top;
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    panel.scrollTo({top:panel.scrollTop+offset-115,behavior:reduce?'instant':'smooth'});
    setActive(index);
    setOpen(false);
  };
  if(chapters.length<2)return null;
  return <nav className={'study-toc'+(open?' study-toc--open':'')}
    aria-label="Sommaire de l'étude"
    onMouseEnter={()=>setOpen(true)}
    onMouseLeave={()=>setOpen(false)}
    onFocus={()=>setOpen(true)}
    onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false)}}>
    <button type="button" className="study-toc__trigger"
      aria-label={open?'Réduire le sommaire':'Afficher le sommaire'}
      aria-expanded={open}
      onClick={()=>setOpen(x=>!x)}>
      <BookOpen size={18}/><span>SOMMAIRE</span>
      <ChevronRight size={15}/>
    </button>
    <div className="study-toc__body" inert={!open}>
      <div className="study-toc__title">NAVIGATION DANS L’ÉTUDE</div>
      {chapters.map(ch=><button key={ch.id} className={'study-toc__chapter'+(ch.index===active?' study-toc__chapter--active':'')}
        type="button" onClick={()=>goTo(ch.index)}
        aria-current={ch.index===active?'location':undefined}>
        <small>{String(ch.index+1).padStart(2,'0')}</small>
        <span>{ch.title}</span>
      </button>)}
    </div>
  </nav>;
}
