import React, {useState} from 'react';
import {ArrowRight, Sun, House, PlugZap, Gauge, Info, ChartColumnIncreasing} from 'lucide-react';
import './pv-sunny-results.css';

/* Relevé des valeurs du PDF SMA Sunny Design 6.22.2 du 18/09/2026.
 * Valeurs prévisionnelles simulées, non relevés de production.
 * Les cumuls des lignes mensuelles peuvent différer des bilans annuels
 * de 1 à 2 kWh à cause des arrondis du rapport.
 */
export const PV_SUNNY={
  site:'Laroque, France',
  version:'Sunny Design 6.22.2 / 18 septembre 2026',
  pvKwp:6,modules:12,moduleWp:500,inverterKw:5,
  yieldKwh:9711,consumptionKwh:3600,selfKwh:1474,exportKwh:8237,
  importKwh:2126,selfRate:15.2,autonomyRate:40.9,
  specificYield:1619,performanceIndex:86.3,
  feedInFirstYearEuro:824,monthlySavingsEuro:103,
  savings20YearsEuro:15658,co2Saved20YearsTonnes:65
};
const MONTHS=[
 ['JAN',517,98,420,239],['FÉV',579,100,479,198],['MAR',874,123,751,200],
 ['AVR',935,141,794,155],['MAI',1008,158,851,135],['JUIN',1085,145,940,119],
 ['JUIL',1158,142,1016,124],['AOÛT',1023,150,873,134],['SEPT',898,96,802,132],
 ['OCT',636,120,516,208],['NOV',536,90,446,222],['DÉC',461,111,351,261]
];
const fmt=n=>new Intl.NumberFormat('fr-FR').format(n);
function MiniMetric({value,label}){return <div className="pv-real-metric"><b>{value}</b><span>{label}</span></div>}
export function PvSunnyDesignReference(){
 return <div className="pv-source-stamp"><Sun size={18}/>
   <span>RÉSULTATS SIMULÉS · SMA SUNNY DESIGN 6.22.2 · LAROQUE · 18/09/2026</span>
   <span>CAS 6 kWc SANS BATTERIE</span>
 </div>;
}
export function PvSunnyElectrical(){
 return <div className="pv-real-system">
   <div className="pv-real-system__intro">
     <div><span>GÉNÉRATEUR</span><strong>12 × 500 Wc</strong><small>Modules DMEGC DM500M10RT-B60HBT-U</small></div>
     <ArrowRight size={21}/>
     <div><span>CONVERSION</span><strong>Sunny Boy 5.0</strong><small>SMA SB5.0-1AV-41 · 5 kW AC</small></div>
     <ArrowRight size={21}/>
     <div><span>USAGES & RÉSEAU</span><strong>230 V AC</strong><small>Autoconsommation puis injection du surplus</small></div>
   </div>
   <div className="pv-real-string-grid">
     {['A','B'].map(input=><div key={input} className="pv-real-string">
       <span>ENTRÉE MPPT {input}</span><strong>6 modules en série</strong>
       <div className="pv-real-panels">{Array.from({length:6},(_,i)=><span key={i} aria-hidden="true"/>)}</div>
       <div className="pv-real-string__facts"><span>3,00 kWc</span><span>211 V caractéristique</span><span>13,3 A max. générateur</span></div>
     </div>)}
   </div>
   <p>La puissance DC installée (6,00 kWc) représente <strong>120 %</strong> de la puissance nominale AC de l’onduleur (5,00 kW). Le rapport prévoit deux entrées MPPT indépendantes de 3,00 kWc chacune. L’éventuel écrêtage de puissance n’est pas chiffré par ce tableau.</p>
   <div className="pv-real-system__checks">
    <span><b>198–288 V</b> plage PV calculée par chaîne</span>
    <span><b>100–600 V</b> plage de tension DC indiquée pour l’onduleur</span>
    <span><b>15 A</b> courant d’entrée max. par MPPT</span>
    <span><b>14,2 A</b> court-circuit max. annoncé du champ, par entrée</span>
   </div>
   <small className="pv-real-origin">Rapport Sunny Design, p. 3 et 6 · Données de conception, non mesures sur installation.</small>
 </div>;
}
export function PvSunnyRoof(){
 return <div className="pv-real-roof">
   <svg viewBox="0 0 920 470" role="img"
     aria-label="Reconstitution simplifiée du plan Sunny Design : deux groupes de six modules placés sur la surface de toit orientée sud, dimensions générales 16 par 9 mètres.">
    <defs><linearGradient id="pvroof" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#324d65"/><stop offset="1" stopColor="#1b354e"/></linearGradient></defs>
    <path d="M70 82H850V375H70Z" fill="url(#pvroof)" stroke="#8ab3cb" strokeWidth="3"/>
    <path d="M70 82L232 182H688L850 82M70 375L232 182M850 375L688 182" stroke="#91b9cf" strokeWidth="2" fill="none"/>
    <path d="M232 182H688" stroke="#c3e4f6" strokeWidth="3"/>
    {[0,1].map(group=>Array.from({length:6},(_,i)=>{
      const x=263+group*231+(i%3)*61,y=238+Math.floor(i/3)*57;
      return <g key={group+'-'+i}>
        <rect x={x} y={y} width="55" height="50" rx="2" fill="#0e608a" stroke="#8dd8ff" strokeWidth="1.5"/>
        <path d={`M${x+18} ${y}v50 M${x+36} ${y}v50 M${x} ${y+25}h55`} stroke="#61b4df" opacity=".7"/>
      </g>;
    }))}
    <text x="460" y="40" textAnchor="middle" fill="#c9e7f7" fontSize="23">16,0 m</text>
    <text x="35" y="238" textAnchor="middle" fill="#c9e7f7" fontSize="21" transform="rotate(-90 35 238)">9,0 m</text>
    <text x="460" y="420" textAnchor="middle" fill="#a4d7fa" fontSize="20">SURFACE SUD · AZIMUT 0° · INCLINAISON 33°</text>
   </svg>
   <p>Reconstitution schématique des deux groupes de six modules visibles sur le pan sud. Le plan du rapport montre une toiture d’environ 16,0 × 9,0 m ; cette représentation n’est pas un plan d’exécution.</p>
   <small className="pv-real-origin">D’après le plan de toiture Sunny Design, p. 11.</small>
 </div>;
}
export function PvSunnyEnergyBalance(){
 return <div className="pv-real-balance">
   <div className="pv-real-metrics">
    <MiniMetric value="9 711 kWh" label="Production annuelle simulée"/>
    <MiniMetric value="1 474 kWh" label="Énergie photovoltaïque consommée sur place"/>
    <MiniMetric value="8 237 kWh" label="Surplus injecté au réseau"/>
    <MiniMetric value="2 126 kWh" label="Énergie achetée au réseau"/>
   </div>
   <div className="pv-real-performance"><span><b>1 619 kWh/kWc</b> production spécifique estimée</span><span><b>86,3 %</b> indice de performance déclaré</span><span><b>99,7 %</b> facteur d’utilisation de l’énergie indiqué</span></div>
   <div className="pv-real-balance__streams">
     <div><div className="pv-real-balance__stream-label"><Sun size={18}/> <strong>PRODUCTION SOLAIRE · 9 711 kWh</strong></div>
       <div className="pv-real-balance__bar" role="img" aria-label="15,2 % de la production autoconsommée, 84,8 % injectée">
         <span style={{width:'15.2%',background:'#8ed9ff'}}/>
         <span style={{width:'84.8%',background:'#287cad'}}/>
       </div>
       <p>15,2 % autoconsommés (1 474 kWh) · 84,8 % injectés (8 237 kWh)</p>
     </div>
     <div><div className="pv-real-balance__stream-label"><House size={18}/> <strong>BESOINS DU LOGEMENT · 3 600 kWh</strong></div>
       <div className="pv-real-balance__bar" role="img" aria-label="40,9 % des besoins couverts par le photovoltaïque, 59,1 % par le réseau">
         <span style={{width:'40.9%',background:'#8ed9ff'}}/>
         <span style={{width:'59.1%',background:'#36516d'}}/>
       </div>
       <p>40,9 % couverts par le PV · 59,1 % prélevés sur le réseau</p>
     </div>
   </div>
   <div className="pv-real-analysis"><Info size={20}/><p><strong>Production importante ≠ autonomie élevée :</strong> le champ produit près de 2,7 fois l’énergie annuelle consommée, mais seuls 40,9 % des besoins du foyer sont directement couverts. Sans stockage ni déplacement des usages, les pics de production ne correspondent pas nécessairement aux heures de consommation.</p></div>
   <small className="pv-real-origin">Bilan annuel Sunny Design, p. 3 et 9 · Profil « 2 adultes actifs, 2 enfants », sans optimisation de l’autoconsommation.</small>
 </div>;
}
export function PvSunnyMonthly(){
 const [display,setDisplay]=useState('energy');
 const limit=1200;
 return <div className="pv-real-monthly">
   <div className="pv-real-monthly__header">
     <div><span>SIMULATION MENSUELLE</span><strong>Variations de production et d’usage de l’énergie</strong></div>
     <div className="pv-real-monthly__tabs" role="group" aria-label="Choisir les courbes mensuelles">
       <button type="button" aria-pressed={display==='energy'} onClick={()=>setDisplay('energy')}>PRODUCTION</button>
       <button type="button" aria-pressed={display==='grid'} onClick={()=>setDisplay('grid')}>RÉSEAU</button>
     </div>
   </div>
   <div className="pv-real-monthly__chart" role="img"
     aria-label={display==='energy'?'Barres mensuelles de production : de 461 kWh en décembre à 1158 kWh en juillet.':'Barres mensuelles comparant énergie injectée et énergie achetée au réseau.'}>
     <div className="pv-real-monthly__axis" aria-hidden="true"><span>1 200</span><span>800</span><span>400</span><span>0</span></div>
     {MONTHS.map(([month,yieldKwh,self,exportKwh,importKwh])=>{
       const value=display==='energy'?yieldKwh:exportKwh;
       const second=display==='energy'?self:importKwh;
       return <div className="pv-real-monthly__column" key={month}
         title={`${month} : production ${yieldKwh} kWh ; autoconsommation ${self} kWh ; injection ${exportKwh} kWh ; achat réseau ${importKwh} kWh`}>
         <span className="pv-real-monthly__number">{value}</span>
         <div className="pv-real-monthly__bar">
           <div className="pv-real-monthly__stack pv-real-monthly__stack--primary"
                style={{height:(value/limit*100)+'%'}}/>
           <div className="pv-real-monthly__stack pv-real-monthly__stack--secondary"
                style={{height:(second/limit*100)+'%'}}/>
         </div>
         <small>{month}</small>
       </div>;
     })}
   </div>
   <p className="pv-real-monthly__legend"><i/><span>{display==='energy'?'Énergie solaire totale':'Injection au réseau'}</span><i/><span>{display==='energy'?'Énergie autoconsommée':'Énergie achetée au réseau'}</span></p>
   <details className="pv-real-monthly__details">
     <summary>VOIR LE TABLEAU DES 12 MOIS</summary>
     <div className="pv-real-monthly__table"><table><thead><tr><th>MOIS</th><th>PRODUCTION</th><th>AUTOCONSOMMATION</th><th>INJECTION</th><th>ACHAT RÉSEAU</th></tr></thead><tbody>
       {MONTHS.map(([month,yieldKwh,self,exportKwh,importKwh])=><tr key={month}>
         <td>{month}</td><td>{fmt(yieldKwh)} kWh</td><td>{fmt(self)} kWh</td><td>{fmt(exportKwh)} kWh</td><td>{fmt(importKwh)} kWh</td>
       </tr>)}
     </tbody></table></div>
   </details>
   <div className="pv-real-analysis"><ChartColumnIncreasing size={21}/><p>Le maximum est prévu en <strong>juillet (1 158 kWh)</strong>, contre <strong>461 kWh en décembre</strong>, soit environ 2,5 fois plus. Malgré le pic estival, l’autoconsommation ne suit pas proportionnellement la production : une part importante du surplus rejoint donc le réseau.</p></div>
   <small className="pv-real-origin">D’après le tableau mensuel Sunny Design, p. 10. Les cumuls mensuels peuvent différer de 1–2 kWh des totaux annuels à cause des arrondis du logiciel.</small>
 </div>;
}
export function PvSunnyEconomics(){
 return <div className="pv-real-economics">
   <div className="pv-real-metrics">
     <MiniMetric value="824 €" label="Rémunération d’injection estimée, année 1"/>
     <MiniMetric value="103 €/mois" label="Économies de facture annoncées par le logiciel"/>
     <MiniMetric value="15 658 €" label="Économies cumulées affichées à 20 ans"/>
     <MiniMetric value="65 t" label="Réduction de CO₂ estimée sur 20 ans"/>
   </div>
   <div className="pv-real-analysis"><Info size={20}/><p>Ces montants sont ceux <strong>présentés par Sunny Design</strong> et non des recettes constatées. Le rapport ne détaille pas ici les tarifs appliqués, le coût complet de l’installation, les frais de maintenance ni les modalités de calcul des économies sur 20 ans. En particulier, le montant affiché de 103 €/mois ne doit pas être multiplié mécaniquement par 240 mois ni ajouté aux autres économies. Ces indications ne suffisent donc pas pour annoncer une rentabilité ou un délai d’amortissement fiable.</p></div>
   <small className="pv-real-origin">Données économiques affichées dans Sunny Design, p. 5 · À vérifier dans une étude de rentabilité dédiée.</small>
 </div>;
}
