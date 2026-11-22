import React, { useState } from 'react';
import {
  ArrowRight, ArrowUpRight, Sun, House, BatteryCharging, PlugZap,
  ChartNoAxesCombined, FileText, ClipboardList, ShieldCheck,
  PanelsTopLeft, Calculator, Gauge, ZoomIn, Info, AlertCircle, CircleCheckBig
} from 'lucide-react';
import './pv-case-study.css';

const DOCUMENT='/documents/Etude-photovoltaique-cadrage.docx';
const CASES=[
  {id:'vente',short:'A / VENTE DU SURPLUS',label:'Autoconsommation et injection',
    description:'Nous consommons directement la production disponible. Le surplus non utilisé est injecté sur le réseau selon les conditions de raccordement et de vente.'},
  {id:'stockage',short:'B / STOCKAGE',label:'Autoconsommation et batterie',
    description:'Nous donnons la priorité aux usages du logement, puis au stockage de l’excédent. La batterie peut restituer une partie de cette énergie en soirée, après les pertes de conversion.'},
];
const fields=[
  ['LOGEMENT','Même profil de consommation dans les deux scénarios'],
  ['CHAMP PV','Même puissance et mêmes conditions de production pour chaque comparaison A/B'],
  ['RÉSULTATS','Production, autoconsommation, injection, autonomie et coûts'],
  ['HYPOTHÈSES','Pertes, rendements, tarifs, horaires et vieillissement documentés']
];
const steps=[
  ['01','Bilan électrique','Nous établissons la consommation par usage (chauffage, eau chaude, cuisson, appareils), avec puissance, durée et énergie.'],
  ['02','Profil horaire','Nous distinguons les journées été/hiver et jours ouvrés/week-ends afin de tenir compte du décalage entre production et consommation.'],
  ['03','Ressource solaire','Nous utilisons les données du site, l’orientation, la pente et les ombrages pour définir la production à simuler avec PVGIS.'],
  ['04','Conversion','Nous comparons un onduleur centralisé et des micro-onduleurs, en séparant ce choix du mode de valorisation du surplus.'],
  ['05','Simulation','Nous préparons dans SAM deux scénarios soumis aux mêmes hypothèses, avec et sans stockage, avant d’interpréter les résultats.'],
  ['06','Bilan comparatif','Nous comparerons les flux d’énergie, les achats au réseau, les recettes, les coûts et une sensibilité aux hypothèses.']
];
function EvidenceLabel({children}){return <span className="pv-evidence-label">{children}</span>}
function Formula({name,eq,caption}){return <div className="pv-formula"><span>{name}</span><strong>{eq}</strong><p>{caption}</p></div>}
function PvFlow({mode='vente'}){
 const battery=mode==='stockage';
 return <div className="pv-flow" role="img" aria-label={battery?'Schéma de principe : panneaux photovoltaïques, conversion, logement, batterie et réseau':'Schéma de principe : panneaux photovoltaïques, conversion, logement et réseau'}>
   <div className="pv-flow-title"><EvidenceLabel>SCHÉMA DE PRINCIPE — NON CONTRACTUEL</EvidenceLabel><span>{battery?'B / AUTOCONSOMMATION + STOCKAGE':'A / AUTOCONSOMMATION + VENTE'}</span></div>
   <div className="pv-flow-main">
     <div className="pv-flow-node"><Sun size={28}/><b>CHAMP PV</b><small>Production variable</small></div>
     <ArrowRight aria-hidden="true" size={22}/>
     <div className="pv-flow-node"><PlugZap size={28}/><b>CONVERSION</b><small>Onduleur / chaîne AC</small></div>
     <ArrowRight aria-hidden="true" size={22}/>
     <div className="pv-flow-node"><House size={28}/><b>LOGEMENT</b><small>Consommation directe</small></div>
   </div>
   <div className="pv-flow-branches">
     {battery&&<div className="pv-flow-branch"><BatteryCharging size={21}/><span>Batterie : stockage de l’excédent puis restitution, avec pertes</span></div>}
     <div className="pv-flow-branch"><Gauge size={21}/><span>Réseau : injection du surplus et achat d’électricité en cas de besoin</span></div>
   </div>
   <p>Schéma volontairement simplifié. Le raccordement, les protections et la position des convertisseurs dépendent de l’architecture finale retenue.</p>
 </div>
}
function RoofFigure(){
 return <div className="pv-roof-compare">
  <div className="pv-roof-card">
   <div className="pv-roof-picture pv-roof-picture--one"><div className="pv-roof-face"><div className="pv-modules">{Array.from({length:12},(_,i)=><i key={i}/>)}</div></div></div>
   <div><strong>TOITURE / 1 PAN</strong><p>Implantation sur une orientation et une inclinaison communes. Étude des chaînes, de l’ombrage et de l’espace disponible.</p></div>
  </div>
  <div className="pv-roof-card">
   <div className="pv-roof-picture pv-roof-picture--three"><div className="pv-roof-face small"><div className="pv-modules">{Array.from({length:6},(_,i)=><i key={i}/>)}</div></div><div className="pv-roof-face small"><div className="pv-modules">{Array.from({length:6},(_,i)=><i key={i}/>)}</div></div><div className="pv-roof-face small"><div className="pv-modules">{Array.from({length:6},(_,i)=><i key={i}/>)}</div></div></div>
   <div><strong>TOITURE / 3 PANS</strong><p>Répartition sur plusieurs orientations : productibilité différente selon les heures, les masques et la conversion retenue.</p></div>
  </div>
 </div>;
}
function TableCompare(){
 return <div className="pv-comparison-wrap"><table className="pv-comparison"><thead><tr><th>CRITÈRE</th><th>SCÉNARIO A · SURPLUS VENDU</th><th>SCÉNARIO B · BATTERIE</th></tr></thead><tbody>
 <tr><td>Énergie solaire consommée immédiatement</td><td>Comptabilisée</td><td>Comptabilisée</td></tr>
 <tr><td>Excédent photovoltaïque</td><td>Injection vers le réseau</td><td>Stockage prioritaire, injection résiduelle possible</td></tr>
 <tr><td>Demande en soirée</td><td>Achat éventuel au réseau</td><td>Restitution depuis la batterie puis achat éventuel</td></tr>
 <tr><td>Pertes supplémentaires</td><td>Pertes de conversion du système PV</td><td>Pertes de conversion et rendement aller-retour batterie</td></tr>
 <tr><td>Indicateurs économiques</td><td>Économies sur les achats + recettes d’injection</td><td>Économies possibles + investissement et remplacement du stockage</td></tr>
 <tr><td>Résultat chiffré à ce stade</td><td><span className="pv-pending">À SIMULER</span></td><td><span className="pv-pending">À SIMULER</span></td></tr>
 </tbody></table></div>;
}
export default function PvCaseStudy(){
 const [mode,setMode]=useState('vente');
 const [roof,setRoof]=useState('1 pan');
 const [power,setPower]=useState('3 kWc');
 const [showMethods,setShowMethods]=useState(false);
 return <div className="bms-study pv-study">
  <div className="bms-study-heading">
   <span>PROJET TUTORÉ / ÉLECTRICITÉ ET MAÎTRISE DE L’ÉNERGIE</span>
   <h3>PRODUIRE, CONSOMMER <em>OU STOCKER ?</em></h3>
   <p>Dans cette étude, nous cherchons à déterminer, pour un même logement, s’il est plus pertinent de vendre l’excédent photovoltaïque ou de le stocker. Notre démarche consiste à comparer les flux d’énergie et les coûts avec des hypothèses identiques. Le dimensionnement définitif et les résultats de simulation restent à établir.</p>
  </div>

  <section className="bms-chapter" aria-labelledby="pv-problem">
   <div className="bms-chapter-index"><span>01 / PROBLÉMATIQUE ET CAHIER DES CHARGES</span><ClipboardList size={22}/></div>
   <div className="bms-chapter-grid">
    <div className="bms-narrative">
     <h4 id="pv-problem">Comparer deux stratégies à conditions égales.</h4>
     <p>Nous avons défini deux modes de valorisation du surplus : <strong>injection sur le réseau</strong> et <strong>stockage sur batterie</strong>. Pour obtenir une comparaison pertinente, nous devons conserver le même logement, le même champ photovoltaïque et le même profil de consommation.</p>
     <p>Nous avons également prévu de comparer différentes puissances et configurations de toiture. Les valeurs ci-dessous correspondent à des <strong>scénarios d’étude</strong> : elles ne représentent pas une installation réalisée ou un dimensionnement validé.</p>
     <div className="bms-spec-grid"><div className="bms-spec"><strong>3 / 6 kWc</strong><span>puissances PV envisagées</span></div><div className="bms-spec"><strong>1 / 3 pans</strong><span>configurations de toiture</span></div><div className="bms-spec"><strong>10 kWh</strong><span>capacité nominale de batterie envisagée</span></div><div className="bms-spec"><strong>ÉTÉ / HIVER</strong><span>profils horaires à comparer</span></div></div>
    </div>
    <div className="pv-brief">
     <span>NOTRE PROBLÉMATIQUE</span>
     <strong>Quelle stratégie valorise le mieux le surplus pour un profil de consommation donné ?</strong>
     <p>La réponse dépend de l’autoconsommation directe, du surplus réellement disponible, du rendement du stockage et des conditions économiques.</p>
     <div><CircleCheckBig size={18}/> Comparaison à hypothèses identiques</div>
     <div><AlertCircle size={18}/> Aucune rentabilité démontrée à ce stade</div>
    </div>
   </div>
  </section>

  <section className="bms-chapter" aria-labelledby="pv-architecture">
   <div className="bms-chapter-index"><span>02 / ARCHITECTURES ÉNERGÉTIQUES</span><PanelsTopLeft size={22}/></div>
   <h4 id="pv-architecture">Deux façons de valoriser l’énergie excédentaire.</h4>
   <p className="bms-chapter-lead">Nous distinguons le choix du mode de valorisation (vente ou stockage) de l’architecture électrique (onduleur centralisé ou micro-onduleurs). Les deux critères seront étudiés séparément afin d’isoler leur influence sur les résultats.</p>
   <div className="pv-tabs" role="group" aria-label="Choisir le scénario affiché">{CASES.map(c=><button key={c.id} type="button" aria-pressed={mode===c.id} className={mode===c.id?'active':''} onClick={()=>setMode(c.id)}>{c.short}</button>)}</div>
   <PvFlow mode={mode}/>
   <p className="pv-current-description">{CASES.find(c=>c.id===mode).description}</p>
   <div className="pv-converter">
    <div><span>OPTION 01</span><strong>Onduleur centralisé</strong><p>Un convertisseur pour l’ensemble ou une partie du champ : tension des chaînes, MPPT et comportement en cas d’ombres à vérifier.</p></div>
    <div><span>OPTION 02</span><strong>Micro-onduleurs</strong><p>Conversion au niveau des modules ou petits groupes de modules : souplesse d’orientation et suivi à comparer en tenant compte des coûts.</p></div>
   </div>
  </section>

  <section className="bms-chapter" aria-labelledby="pv-roof">
   <div className="bms-chapter-index"><span>03 / IMPLANTATION ET DIMENSIONNEMENT</span><Sun size={22}/></div>
   <h4 id="pv-roof">L’implantation influence directement la production.</h4>
   <p className="bms-chapter-lead">Pour distinguer l’effet de la configuration du toit, nous avons prévu deux cas : des modules répartis sur un pan ou sur trois pans. Chaque variante devra être évaluée avec son orientation, son inclinaison et ses ombrages.</p>
   <RoofFigure/>
   <EvidenceLabel>ILLUSTRATIONS DE PRINCIPE — NON ISSUES D'UN RELEVÉ DE TOITURE</EvidenceLabel>
   <div className="pv-config">
    <div><label htmlFor="pv-roof-select">CONFIGURATION DE TOITURE</label><select id="pv-roof-select" value={roof} onChange={e=>setRoof(e.target.value)}><option>1 pan</option><option>3 pans</option></select></div>
    <div><label htmlFor="pv-power-select">PUISSANCE ENVISAGÉE</label><select id="pv-power-select" value={power} onChange={e=>setPower(e.target.value)}><option>3 kWc</option><option>6 kWc</option></select></div>
    <p>Variante affichée : <strong>{roof} / {power}</strong>. Ces choix préparent la comparaison et ne calculent pas une production réelle.</p>
   </div>
   <div className="pv-caution"><Info size={18}/><p>Le premier cadrage envisageait aussi une vingtaine de modules. Nous ne retiendrons définitivement ni le nombre de panneaux ni leur puissance avant l’analyse des besoins et de la surface disponible.</p></div>
  </section>

  <section className="bms-chapter" aria-labelledby="pv-consumption">
   <div className="bms-chapter-index"><span>04 / BESOINS DU LOGEMENT ET SIMULATIONS</span><ChartNoAxesCombined size={22}/></div>
   <h4 id="pv-consumption">Pourquoi le profil horaire compte autant que la production annuelle.</h4>
   <p className="bms-chapter-lead">Nous avons choisi de partir d’un bilan des usages du logement, puis de construire des profils horaires représentatifs en été et en hiver. Deux maisons ayant la même consommation annuelle peuvent présenter des taux d’autoconsommation différents si leurs besoins se situent à des heures distinctes.</p>
   <div className="pv-schedule">
    <div><span>MATIN</span><Sun size={20}/><strong>Production croissante</strong><p>Comparer la production au chauffage, à l’eau chaude et aux usages du matin.</p></div>
    <div><span>MIDI</span><Sun size={25}/><strong>Excédent possible</strong><p>Évaluer l’énergie réellement disponible pour l’injection ou la recharge.</p></div>
    <div><span>SOIR</span><House size={20}/><strong>Consommation du logement</strong><p>Vérifier l’intérêt d’une restitution sur batterie lorsque la production baisse.</p></div>
   </div>
   <EvidenceLabel>CHRONOLOGIE EXPLICATIVE — PAS DE PROFIL MESURÉ</EvidenceLabel>
   <div className="pv-workflow">
    {steps.map(([num,title,detail])=><div key={num}><b>{num}</b><div><strong>{title}</strong><p>{detail}</p></div></div>)}
   </div>
   <div className="pv-formulas">
    <Formula name="BILAN D'UN USAGE" eq="E = P × t" caption="Énergie en kWh ; puissance en kW ; durée d’utilisation en heures."/>
    <Formula name="AUTOCONSOMMATION" eq="E PV consommée / E PV produite" caption="Part de l’énergie solaire produite utilisée sur place, directement ou après stockage selon le périmètre retenu."/>
    <Formula name="AUTONOMIE" eq="E fournie par le PV / E consommée" caption="Part des besoins électriques du logement couverte par la production photovoltaïque."/>
   </div>
  </section>

  <section className="bms-chapter" aria-labelledby="pv-compare">
   <div className="bms-chapter-index"><span>05 / COMPARAISON ET VALIDATION</span><Calculator size={22}/></div>
   <h4 id="pv-compare">Quels résultats nous permettront de choisir ?</h4>
   <p className="bms-chapter-lead">Nous comparerons les deux scénarios à production et consommation égales. Pour le stockage, il faudra notamment retrancher les pertes aller-retour de la batterie et tenir compte de son coût d’acquisition, de sa durée de vie et des cycles réalisés.</p>
   <TableCompare/>
   <div className="pv-pending-panel"><AlertCircle size={24}/><div><strong>SIMULATIONS ET RENTABILITÉ : RÉSULTATS NON ENCORE VALIDÉS</strong><p>Les documents actuellement disponibles définissent le périmètre de l’étude et ses indicateurs. Ils ne donnent pas encore de production annuelle, de taux d’autoconsommation final ni de temps de retour sur investissement vérifié. Aucun résultat fictif n’est ajouté au portfolio.</p></div></div>
  </section>

  <section className="bms-chapter bms-chapter--conclusion" aria-labelledby="pv-outlook">
   <div className="bms-chapter-index"><span>06 / COMPÉTENCES ET PERSPECTIVES</span><ShieldCheck size={22}/></div>
   <h4 id="pv-outlook">Passer des hypothèses à une comparaison argumentée.</h4>
   <div className="bms-learning-grid">
    <div><span>CONCEVOIR</span><p>Nous structurons les scénarios, les hypothèses de toiture et les choix de conversion pour établir une méthode de dimensionnement cohérente.</p></div>
    <div><span>VÉRIFIER</span><p>Nous prévoyons de confronter les bilans d’énergie, les simulations et les résultats économiques aux mêmes conditions de référence.</p></div>
    <div><span>ESPRIT CRITIQUE</span><p>Je cherche à distinguer une amélioration du taux d’autonomie d’un véritable gain économique, sans conclure avant les simulations.</p></div>
   </div>
   <p className="bms-final-note">La prochaine étape consiste à valider la consommation de référence, les caractéristiques des toitures et les paramètres des équipements, puis à exécuter les scénarios sous SAM et PVGIS. Les performances annoncées dans cette étude seront actualisées uniquement lorsque les résultats seront disponibles et justifiés.</p>
   <div className="pv-source-document"><div><FileText size={26}/><div><strong>Document de cadrage du projet photovoltaïque</strong><p>Problématique, scénarios A/B, méthode de comparaison et indicateurs de suivi.</p></div></div><a href={DOCUMENT} target="_blank" rel="noopener noreferrer">CONSULTER LE CAHIER DES CHARGES <ArrowUpRight size={17}/></a></div>
  </section>
 </div>;
}
