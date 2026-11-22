import React from 'react';
import './electric-ambient.css';

// Lignes de circulation stylisées : elles évoquent un circuit électrique
// sans représenter un véritable schéma de câblage ou de distribution.
const circuits=[
  {d:'M -110 120 L 160 120 Q 185 120 198 141 L 271 260 L 430 260 L 499 344 L 660 344',duration:'23s',delay:'-5s'},
  {d:'M -75 690 L 225 690 L 308 615 L 410 615 Q 439 615 456 596 L 576 453 L 767 453',duration:'31s',delay:'-17s'},
  {d:'M 1660 80 L 1355 80 L 1305 162 L 1185 162 L 1095 267 L 972 267',duration:'27s',delay:'-9s'},
  {d:'M 1700 508 L 1510 508 L 1443 430 L 1278 430 L 1183 545 L 1060 545',duration:'32s',delay:'-21s'},
  {d:'M 1660 835 L 1450 835 L 1356 734 L 1150 734 L 1085 669 L 945 669',duration:'36s',delay:'-24s'},
  {d:'M 105 965 L 105 838 L 204 765 L 339 765 L 406 839 L 690 839',duration:'34s',delay:'-11s'}
];
const points=[
  [198,141],[271,260],[499,344],[308,615],[456,596],
  [1305,162],[1185,162],[1443,430],[1183,545],[1356,734],[406,839]
];

export default function ElectricAmbient({paused=false}){
  return <div className={"electric-ambient"+(paused?" electric-ambient--paused":"")} aria-hidden="true">
    <div className="electric-ambient__glow electric-ambient__glow--left"/>
    <div className="electric-ambient__glow electric-ambient__glow--right"/>
    <div className="electric-ambient__mesh"/>
    <div className="electric-ambient__cursor"/>
    <svg className="electric-ambient__wires" viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice" focusable="false">
      <defs>
        <linearGradient id="electric-track-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1d71bd" stopOpacity=".05"/>
          <stop offset="45%" stopColor="#47a9ea" stopOpacity=".44"/>
          <stop offset="100%" stopColor="#1b5b96" stopOpacity=".03"/>
        </linearGradient>
      </defs>
      {circuits.map((c,i)=><g key={i} className="electric-ambient__wire">
        <path className="electric-ambient__track" d={c.d} stroke="url(#electric-track-gradient)"/>
        <path className="electric-ambient__pulse" d={c.d}
          style={{'--pulse-duration':c.duration,'--pulse-delay':c.delay}}/>
      </g>)}
      {points.map(([cx,cy],i)=><circle key={i} className="electric-ambient__node"
        cx={cx} cy={cy} r={i%3===0?3.2:2}
        style={{animationDelay:(-i*1.6)+'s'}}/>)}
    </svg>
  </div>;
}
