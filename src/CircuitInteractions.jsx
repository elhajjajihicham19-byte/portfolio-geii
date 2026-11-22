import React, {useEffect,useRef,useState} from 'react';
import './circuit-interactions.css';

const sections=[
  {id:'accueil'},{id:'profil'},{id:'formation'},{id:'competences'},
  {id:'projets'},{id:'experience'},{id:'documents'},{id:'contact'}
];
const clamp=value=>Math.max(0,Math.min(100,value));

/*
 * Rail électrique cohérent avec les sections réelles de la page :
 * chaque borne correspond au début d'une section dans le document,
 * et non à des intervalles fictivement égaux.
 */
export default function CircuitInteractions({paused=false}){
 const busRef=useRef(null);
 const stopRef=useRef(sections.map((_,i)=>100*i/(sections.length-1)));
 const [stops,setStops]=useState(stopRef.current);
 const [current,setCurrent]=useState('accueil');
 const [surge,setSurge]=useState(null);

 useEffect(()=>{
  const root=document.documentElement;
  const content=sections.map(s=>({...s,node:document.getElementById(s.id)}))
   .filter(s=>s.node);
  if(!content.length)return;

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0;
  let measureFrame=0;
  let pointerFrame=0;
  let settleTimer=0;
  let active='accueil';
  let previous=window.scrollY;
  let launched=false;
  let pulseIndex=0;
  let mx=window.innerWidth*.5;
  let my=window.innerHeight*.5;

  const measure=()=>{
   measureFrame=0;
   const max=Math.max(1,root.scrollHeight-window.innerHeight);
   const next=content.map(({node})=>
     clamp((node.getBoundingClientRect().top+window.scrollY)/max*100)
   );
   const completed=sections.map((section,i)=>{
     const index=content.findIndex(item=>item.id===section.id);
     return index<0?100*i/(sections.length-1):next[index];
   });
   stopRef.current=completed;
   setStops(completed);
   schedule();
  };
  const scheduleMeasure=()=>{
   if(!measureFrame)measureFrame=requestAnimationFrame(measure);
  };
  const update=()=>{
   frame=0;
   const y=window.scrollY;
   const max=Math.max(1,root.scrollHeight-window.innerHeight);
   const progress=Math.max(0,Math.min(1,y/max));
   busRef.current?.style.setProperty('--bus-progress',progress.toFixed(4));
   root.style.setProperty('--electric-scroll-progress',progress.toFixed(4));
   let next=content[0].id;
   for(const section of content){
     if(section.node.getBoundingClientRect().top<=window.innerHeight*.46)next=section.id;
   }

   if(next!==active){
     content.find(s=>s.id===active)?.node.classList.remove('is-conducting');
     const from=sections.findIndex(s=>s.id===active);
     const to=sections.findIndex(s=>s.id===next);
     if(launched&&!reduced.matches&&from>=0&&to>=0){
       pulseIndex++;
       setSurge({
         key:pulseIndex,
         from:stopRef.current[from],
         to:stopRef.current[to],
         time:Math.min(1.2,.45+Math.abs(stopRef.current[to]-stopRef.current[from])*.012)
       });
     }
     active=next;
     setCurrent(next);
   }
   content.find(s=>s.id===active)?.node.classList.add('is-conducting');
   if(!reduced.matches){
     const movement=Math.min(1,Math.abs(y-previous)/90);
     root.style.setProperty('--electric-flow-boost',(movement*.27).toFixed(3));
   }
   previous=y;
   launched=true;
  };
  const schedule=()=>{
   if(!frame)frame=requestAnimationFrame(update);
   if(settleTimer)clearTimeout(settleTimer);
   settleTimer=window.setTimeout(()=>root.style.setProperty('--electric-flow-boost','0'),170);
  };
  const updatePointer=()=>{
   pointerFrame=0;
   root.style.setProperty('--electric-pointer-x',mx+'px');
   root.style.setProperty('--electric-pointer-y',my+'px');
  };
  const onMove=e=>{
   if(reduced.matches)return;
   mx=e.clientX;my=e.clientY;
   if(!pointerFrame)pointerFrame=requestAnimationFrame(updatePointer);
  };
  const resizeObserver=typeof ResizeObserver!=='undefined'?
   new ResizeObserver(scheduleMeasure):null;
  const main=document.querySelector('.site main');
  if(main)resizeObserver?.observe(main);
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',scheduleMeasure,{passive:true});
  window.addEventListener('pointermove',onMove,{passive:true});
  window.addEventListener('load',scheduleMeasure,{once:true});
  scheduleMeasure();
  return()=>{
   resizeObserver?.disconnect();
   window.removeEventListener('scroll',schedule);
   window.removeEventListener('resize',scheduleMeasure);
   window.removeEventListener('pointermove',onMove);
   window.removeEventListener('load',scheduleMeasure);
   if(frame)cancelAnimationFrame(frame);
   if(measureFrame)cancelAnimationFrame(measureFrame);
   if(pointerFrame)cancelAnimationFrame(pointerFrame);
   if(settleTimer)clearTimeout(settleTimer);
   content.forEach(s=>s.node.classList.remove('is-conducting'));
   for(const key of ['--electric-flow-boost','--electric-scroll-progress','--electric-pointer-x','--electric-pointer-y'])
     root.style.removeProperty(key);
  };
 },[]);

 return <div ref={busRef} className={'circuit-bus'+(paused?' circuit-bus--paused':'')} aria-hidden="true">
   <div className="circuit-bus__spine">
     <div className="circuit-bus__charge"/>
     {surge&&!paused&&<span key={surge.key} className="circuit-bus__surge"
       style={{
         '--surge-from':surge.from+'%',
         '--surge-to':surge.to+'%',
         '--surge-time':surge.time+'s'
       }}/>}
     {sections.map((section,i)=><span key={section.id}
       className={'circuit-bus__terminal'+(section.id===current?' circuit-bus__terminal--active':'')}
       style={{top:stops[i]+'%'}}/>)}
   </div>
   <span className="circuit-bus__label">FLUX / PARCOURS</span>
 </div>;
}
