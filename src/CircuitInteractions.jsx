import React, {useEffect, useRef, useState} from 'react';
import './circuit-interactions.css';

/*
 * Le défilement est interprété comme un courant dans le portfolio.
 * Une seule boucle requestAnimationFrame (déclenchée par les événements
 * scroll/pointer) anime les variables CSS : aucun second canvas WebGL.
 */
const sections=[
  {id:'accueil',short:'01'},
  {id:'profil',short:'02'},
  {id:'formation',short:'03'},
  {id:'competences',short:'04'},
  {id:'projets',short:'05'},
  {id:'experience',short:'06'},
  {id:'documents',short:'07'},
  {id:'contact',short:'08'}
];

export default function CircuitInteractions({paused=false}){
  const busRef=useRef(null);
  const [current,setCurrent]=useState('accueil');

  useEffect(()=>{
    const root=document.documentElement;
    const content=sections.map(s=>({id:s.id,node:document.getElementById(s.id)}))
      .filter(s=>s.node);
    if(!content.length)return;

    const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0;
    let active='accueil';
    let previous=window.scrollY;

    const update=()=>{
      frame=0;
      const y=window.scrollY;
      const max=Math.max(1,root.scrollHeight-window.innerHeight);
      const progress=Math.min(1,Math.max(0,y/max));
      if(busRef.current)busRef.current.style.setProperty('--bus-progress',progress.toFixed(4));
      root.style.setProperty('--electric-scroll-progress',progress.toFixed(4));

      // Repère la section qui traverse l'axe de lecture du visiteur.
      const boundary=y+window.innerHeight*.46;
      let next=content[0].id;
      for(const section of content){
        if(section.node.offsetTop<=boundary)next=section.id;
      }
      if(next!==active){
        const previousSection=content.find(s=>s.id===active);
        const newSection=content.find(s=>s.id===next);
        previousSection?.node.classList.remove('is-conducting');
        newSection?.node.classList.add('is-conducting');
        active=next;
        setCurrent(next);
      }else{
        content.find(s=>s.id===active)?.node.classList.add('is-conducting');
      }

      if(!motion.matches){
        const movement=Math.min(1,Math.abs(y-previous)/90);
        root.style.setProperty('--electric-flow-boost',(movement*.27).toFixed(3));
      }
      previous=y;
    };
    const schedule=()=>{
      if(frame)return;
      frame=requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule,{passive:true});

    let pointerFrame=0;
    let mx=window.innerWidth*.5;
    let my=window.innerHeight*.5;
    const updatePointer=()=>{
      pointerFrame=0;
      root.style.setProperty('--electric-pointer-x',mx+'px');
      root.style.setProperty('--electric-pointer-y',my+'px');
    };
    const move=e=>{
      if(motion.matches)return;
      mx=e.clientX;my=e.clientY;
      if(!pointerFrame)pointerFrame=requestAnimationFrame(updatePointer);
    };
    window.addEventListener('pointermove',move,{passive:true});

    return()=>{
      window.removeEventListener('scroll',schedule);
      window.removeEventListener('resize',schedule);
      window.removeEventListener('pointermove',move);
      if(frame)cancelAnimationFrame(frame);
      if(pointerFrame)cancelAnimationFrame(pointerFrame);
      content.forEach(s=>s.node.classList.remove('is-conducting'));
      root.style.removeProperty('--electric-flow-boost');
      root.style.removeProperty('--electric-scroll-progress');
      root.style.removeProperty('--electric-pointer-x');
      root.style.removeProperty('--electric-pointer-y');
    };
  },[]);

  return <div ref={busRef} className={'circuit-bus'+(paused?' circuit-bus--paused':'')}
    aria-hidden="true">
    <div className="circuit-bus__spine">
      <div className="circuit-bus__charge"/>
      {sections.map((section,i)=><span key={section.id}
        className={'circuit-bus__terminal'+(section.id===current?' circuit-bus__terminal--active':'')}
        style={{top:(100*i/(sections.length-1))+'%'}}/>)}
    </div>
    <span className="circuit-bus__label">FLUX / PARCOURS</span>
  </div>;
}
