import React, {useEffect, useRef, useState} from 'react';
import {
  House, UserRound, GraduationCap, Blocks, FolderKanban, BriefcaseBusiness,
  FileText, Mail, Menu, ChevronRight, Zap
} from 'lucide-react';
import './edge-navigation.css';

const sections=[
  {id:'accueil',label:'Accueil',icon:House},
  {id:'profil',label:'Profil',icon:UserRound},
  {id:'formation',label:'Formation',icon:GraduationCap},
  {id:'competences',label:'Compétences',icon:Blocks},
  {id:'projets',label:'Projets & SAE',icon:FolderKanban},
  {id:'experience',label:'Expérience',icon:BriefcaseBusiness},
  {id:'documents',label:'Documents',icon:FileText},
  {id:'contact',label:'Contact',icon:Mail}
];

export default function EdgeNavigation(){
  const [open,setOpen]=useState(false);
  const [active,setActive]=useState('accueil');
  const triggerRef=useRef(null);

  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
      if(visible[0])setActive(visible[0].target.id);
    },{rootMargin:'-25% 0px -50% 0px',threshold:0});
    sections.forEach(({id})=>{const el=document.getElementById(id);if(el)observer.observe(el)});
    return()=>observer.disconnect();
  },[]);

  const closeOnEscape=e=>{
    if(e.key==='Escape'){setOpen(false);triggerRef.current?.blur()}
  };
  return <aside
    className={'edge-nav'+(open?' edge-nav--open':'')}
    aria-label="Navigation latérale"
    onMouseEnter={()=>setOpen(true)}
    onMouseLeave={()=>setOpen(false)}
    onFocus={()=>setOpen(true)}
    onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false)}}
    onKeyDown={closeOnEscape}
  >
    <div className="edge-nav__edge" aria-hidden="true"/>
    <button ref={triggerRef} className="edge-nav__trigger" type="button"
      aria-controls="edge-nav-links" aria-expanded={open}
      aria-label={open?'Masquer la navigation latérale':'Afficher la navigation latérale'}
      onClick={()=>setOpen(value=>!value)}>
      <Menu size={18}/><span>NAVIGATION</span><ChevronRight size={13}/>
    </button>
    <div className="edge-nav__body" inert={!open}>
      <div className="edge-nav__identity"><Zap size={19}/><span>EXPLORER LE PORTFOLIO</span></div>
      <p>ACCÈS RAPIDE AUX SECTIONS</p>
      <nav id="edge-nav-links" aria-label="Accès rapide aux sections">
        {sections.map(({id,label,icon:Icon},index)=>
          <a key={id} href={'#'+id}
            className={'edge-nav__link'+(active===id?' edge-nav__link--active':'')}
            aria-current={active===id?'location':undefined}
            onClick={()=>{setActive(id);setOpen(false)}}>
            <span className="edge-nav__link-number">{String(index+1).padStart(2,'0')}</span>
            <Icon size={19}/>
            <span className="edge-nav__link-name">{label}</span>
            <ChevronRight size={15} className="edge-nav__link-arrow"/>
          </a>)}
      </nav>
      <div className="edge-nav__footer">BUT GEII <span>·</span> PARCOURS EME</div>
    </div>
  </aside>;
}
