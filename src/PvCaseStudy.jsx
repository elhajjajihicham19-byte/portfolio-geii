import React, { useState } from 'react';
import {
  ArrowRight, ArrowUpRight, Sun, House, BatteryCharging, PlugZap,
  ChartNoAxesCombined, FileText, ClipboardList, ShieldCheck,
  PanelsTopLeft, Calculator, Gauge, ZoomIn, Info, AlertCircle, CircleCheckBig
} from 'lucide-react';
import {PvSunnyDesignReference,PvSunnyElectrical,PvSunnyRoof,PvSunnyEnergyBalance,PvSunnyMonthly,PvSunnyEconomics} from './PvSunnyResults.jsx';
import './pv-case-study.css';

const DOCUMENT='/documents/Etude-photovoltaique-cadrage.docx';
const CASES=[
  {id:'vente',short:'A / VENTE DU SURPLUS',label:'Autoconsommation et injection',
    description:'L’habitation consomme directement la production disponible. Le surplus non utilisé est injecté sur le réseau selon les conditions de raccordement et de vente.'},
  {id:'stockage',short:'B / STOCKAGE',label:'Autoconsommation et batterie',
    description:'La stratégie donne la priorité aux usages du logement, puis au stockage de l’excédent. La batterie peut restituer une partie de cette énergie en soirée, après les pertes de conversion.'},
];
const fields=[
  ['LOGEMENT','Même profil de consommation dans les deux scénarios'],
  ['CHAMP PV','Même puissance et mêmes conditions de production pour chaque comparaison A/B'],
  ['RÉSULTATS','Production, autoconsommation, injection, autonomie et coûts'],
  ['HYPOTHÈSES','Pertes, rendements, tarifs, horaires et vieillissement documentés']
];
const steps=[
  ['01','Bilan électrique','J’établis la consommation par usage (chauffage, eau chaude, cuisson, appareils), avec puissance, durée et énergie.'],
  ['02','Profil horaire','Je distingue les journées été/hiver et jours ouvrés/week-ends afin de tenir compte du décalage entre production et consommation.'],
  ['03','Ressource solaire','J’utilise les données du site, l’orientation, la pente et les ombrages pour définir la production à simuler avec PVGIS.'],
  ['04','Conversion','Je compare un onduleur centralisé et des micro-onduleurs, en séparant ce choix du mode de valorisation du surplus.'],
  ['05','Simulation','Je prépare dans SAM deux scénarios soumis aux mêmes hypothèses, avec et sans stockage, avant d’interpréter les résultats.'],
  ['06','Bilan comparatif','Je comparerai les flux d’énergie, les achats au réseau, les recettes, les coûts et une sensibilité aux hypothèses.']
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
 <tr><td>Résultat chiffré à ce stade</td><td><strong>Cas 6 kWc : 9 711 kWh/an, 15,2 % autoconsommés, 40,9 % d’autonomie (Sunny Design)</strong></td><td><span className="pv-pending">À SIMULER</span></td></tr>
 </tbody></table></div>;
}
export default function PvCaseStudy(){
 const [mode,setMode]=useState('vente');
 const [roof,setRoof]=useState('1 pan');
 const [power,setPower]=useState('6 kWc');
 const [showMethods,setShowMethods]=useState(false);
 return <div className="bms-study pv-study">
  <div className="bms-study-heading">
   <span>PROJET TUTORÉ / ÉLECTRICITÉ ET MAÎTRISE DE L’ÉNERGIE</span>
   <h3>PRODUIRE, CONSOMMER <em>OU STOCKER ?</em></h3>
   <p>J’étudie la valorisation de la production photovoltaïque d’un logement : consommation directe, injection du surplus ou stockage sur batterie. J’ai désormais un <strong>premier scénario chiffré sous SMA Sunny Design</strong> : une installation de 6 kWc sans batterie, simulée pour Laroque. Les variantes 3 kWc, trois pans et batterie restent à comparer sur des hypothèses équivalentes.</p>
   <PvSunnyDesignReference/>
  </div>

  <section className="bms-chapter" aria-labelledby="pv-problem">
   <div className="bms-chapter-index"><span>01 / PROBLÉMATIQUE ET CAHIER DES CHARGES</span><ClipboardList size={22}/></div>
   <div className="bms-chapter-grid">
    <div className="bms-narrative">
     <h4 id="pv-problem">Comparer deux stratégies à conditions égales.</h4>
     <p>J’ai défini deux stratégies : <strong>l’autoconsommation avec injection du surplus</strong> et <strong>l’autoconsommation avec batterie</strong>. Pour comparer leurs performances, je conserve le même logement, le même champ photovoltaïque et le même profil de consommation.</p>
     <p>Un premier calcul sous <strong>Sunny Design 6.22.2 (18 septembre 2026)</strong> décrit précisément le cas <strong>6 kWc, pan sud à 33°, sans stockage</strong>, avec un logement consommant 3 600 kWh/an. Les autres variantes ci-dessous restent des scénarios à évaluer, non des résultats acquis sur installation réelle.</p>
     <div className="bms-spec-grid"><div className="bms-spec"><strong>3 / 6 kWc</strong><span>puissances PV envisagées</span></div><div className="bms-spec"><strong>1 / 3 pans</strong><span>configurations de toiture</span></div><div className="bms-spec"><strong>10 kWh</strong><span>capacité nominale de batterie envisagée</span></div><div className="bms-spec"><strong>ÉTÉ / HIVER</strong><span>profils horaires à comparer</span></div></div>
    </div>
    <div className="pv-brief">
     <span>PROBLÉMATIQUE</span>
     <strong>Quelle stratégie valorise le mieux le surplus pour un profil de consommation donné ?</strong>
     <p>La réponse dépend de l’autoconsommation directe, du surplus réellement disponible, du rendement du stockage et des conditions économiques.</p>
     <div><CircleCheckBig size={18}/> Comparaison à hypothèses identiques</div>
     <div><CircleCheckBig size={18}/> Premier scénario 6 kWc simulé sous Sunny Design</div>
     <div><AlertCircle size={18}/> Batterie et rentabilité complète non validées</div>
    </div>
   </div>
  </section>

  <section className="bms-chapter" aria-labelledby="pv-architecture">
   <div className="bms-chapter-index"><span>02 / ARCHITECTURES ÉNERGÉTIQUES</span><PanelsTopLeft size={22}/></div>
   <h4 id="pv-architecture">Deux façons de valoriser l’énergie excédentaire.</h4>
   <p className="bms-chapter-lead">Je distingue la stratégie de valorisation (injection ou stockage) de la technologie de conversion (onduleur centralisé ou micro-onduleurs). Le cas chiffré disponible correspond à un <strong>SMA Sunny Boy 5.0</strong> et à deux chaînes raccordées sur des entrées MPPT distinctes.</p>
   <div className="pv-tabs" role="group" aria-label="Choisir le scénario affiché">{CASES.map(c=><button key={c.id} type="button" aria-pressed={mode===c.id} className={mode===c.id?'active':''} onClick={()=>setMode(c.id)}>{c.short}</button>)}</div>
   <PvFlow mode={mode}/>
   <p className="pv-current-description">{CASES.find(c=>c.id===mode).description}</p>
   <div className="pv-converter">
    <div><span>OPTION 01</span><strong>Onduleur centralisé</strong><p>Un convertisseur pour l’ensemble ou une partie du champ : tension des chaînes, MPPT et comportement en cas d’ombres à vérifier.</p></div>
    <div><span>OPTION 02</span><strong>Micro-onduleurs</strong><p>Conversion au niveau des modules ou petits groupes de modules : souplesse d’orientation et suivi à comparer en tenant compte des coûts.</p></div>
   </div>
   <h5 className="pv-real-title">Dimensionnement vérifié dans la simulation 6 kWc</h5>
   <PvSunnyElectrical/>
  </section>

  <section className="bms-chapter" aria-labelledby="pv-roof">
   <div className="bms-chapter-index"><span>03 / IMPLANTATION ET DIMENSIONNEMENT</span><Sun size={22}/></div>
   <h4 id="pv-roof">L’implantation influence directement la production.</h4>
   <p className="bms-chapter-lead">La simulation Sunny Design porte sur <strong>12 panneaux DMEGC de 500 Wc</strong> regroupés sur un pan orienté sud (azimut 0°, inclinaison 33°). Je conserve en parallèle une variante sur trois pans, dont la production reste à établir en tenant compte des orientations et des ombrages.</p>
   <RoofFigure/>
   <EvidenceLabel>SCHÉMAS CONCEPTUELS DES DEUX VARIANTES</EvidenceLabel>
   <h5 className="pv-real-title">Implantation du cas simulé sur le pan sud</h5>
   <PvSunnyRoof/>
   <div className="pv-config">
    <div><label htmlFor="pv-roof-select">CONFIGURATION DE TOITURE</label><select id="pv-roof-select" value={roof} onChange={e=>setRoof(e.target.value)}><option>1 pan</option><option>3 pans</option></select></div>
    <div><label htmlFor="pv-power-select">PUISSANCE ENVISAGÉE</label><select id="pv-power-select" value={power} onChange={e=>setPower(e.target.value)}><option>3 kWc</option><option>6 kWc</option></select></div>
    <p>Variante affichée : <strong>{roof} / {power}</strong>. {roof==='1 pan'&&power==='6 kWc'?'Cas de référence documenté par Sunny Design : 9 711 kWh/an estimés, avec 12 modules au sud.':'Variante de comparaison encore à simuler ; aucune production chiffrée n’est attribuée à cette sélection.'}</p>
   </div>
   <div className="pv-caution"><Info size={18}/><p>Le cas 6 kWc de Sunny Design est une <strong>configuration simulée et documentée</strong>, pas une installation réalisée. Il ne démontre pas les performances d’un autre toit, d’un système à micro-onduleurs ou d’une batterie. Les vérifications réglementaires, d’ombrage et de pose restent distinctes.</p></div>
  </section>

  <section className="bms-chapter" aria-labelledby="pv-consumption">
   <div className="bms-chapter-index"><span>04 / BESOINS DU LOGEMENT ET SIMULATIONS</span><ChartNoAxesCombined size={22}/></div>
   <h4 id="pv-consumption">Pourquoi le profil horaire compte autant que la production annuelle.</h4>
   <p className="bms-chapter-lead">Le profil de charge utilisé par Sunny Design correspond à une <strong>famille de deux adultes actifs et deux enfants</strong>, avec une consommation de <strong>3 600 kWh/an</strong>. La simulation fournit des flux annuels et mensuels précis, mais pas un relevé de consommation réel du logement ni une étude horaire de batterie.</p>
   <PvSunnyEnergyBalance/>
   <h5 className="pv-real-title">Production et échanges réseau, mois par mois</h5>
   <PvSunnyMonthly/>
   <div className="pv-schedule">
    <div><span>MATIN</span><Sun size={20}/><strong>Production croissante</strong><p>Comparer la production au chauffage, à l’eau chaude et aux usages du matin.</p></div>
    <div><span>MIDI</span><Sun size={25}/><strong>Excédent possible</strong><p>Évaluer l’énergie réellement disponible pour l’injection ou la recharge.</p></div>
    <div><span>SOIR</span><House size={20}/><strong>Consommation du logement</strong><p>Vérifier l’intérêt d’une restitution sur batterie lorsque la production baisse.</p></div>
   </div>
   <EvidenceLabel>CHRONOLOGIE EXPLICATIVE — COMPLÉMENT AUX RÉSULTATS MENSUELS SIMULÉS</EvidenceLabel>
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
   <h4 id="pv-compare">Ce que montre déjà le cas de référence.</h4>
   <p className="bms-chapter-lead">J’ai obtenu un premier bilan quantifié pour l’autoconsommation avec injection du surplus, <strong>sans optimisation de charge ni batterie</strong>. Il sert désormais de référence pour comparer le stockage, après intégration des pertes aller-retour, du coût d’investissement et des éventuels remplacements.</p>
   <TableCompare/>
   <h5 className="pv-real-title">Indicateurs économiques du cas sans batterie</h5>
   <PvSunnyEconomics/>
   <div className="pv-pending-panel"><AlertCircle size={24}/><div><strong>UNE RÉFÉRENCE SIMULÉE, PAS ENCORE UN COMPARATIF DE RENTABILITÉ</strong><p>La production et les flux annuels du cas 6 kWc sont estimés par Sunny Design. Le logiciel présente aussi des bénéfices économiques indicatifs, mais le coût complet d’installation et les hypothèses tarifaires ne sont pas détaillés dans ce rapport. Les scénarios avec batterie, 3 kWc et trois pans n’ont pas encore de bilan comparable.</p></div></div>
  </section>

  <section className="bms-chapter bms-chapter--conclusion" aria-labelledby="pv-outlook">
   <div className="bms-chapter-index"><span>06 / COMPÉTENCES ET PERSPECTIVES</span><ShieldCheck size={22}/></div>
   <h4 id="pv-outlook">Interpréter les résultats avant de choisir un stockage.</h4>
   <div className="bms-learning-grid">
    <div><span>CONCEVOIR</span><p>Je structure les scénarios, les hypothèses de toiture et les choix de conversion pour établir une méthode de dimensionnement cohérente.</p></div>
    <div><span>VÉRIFIER</span><p>Je prévois de confronter les bilans d’énergie, les simulations et les résultats économiques aux mêmes conditions de référence.</p></div>
    <div><span>ESPRIT CRITIQUE</span><p>Je cherche à distinguer une amélioration du taux d’autonomie d’un véritable gain économique, sans conclure avant les simulations.</p></div>
   </div>
   <p className="bms-final-note">Le cas Sunny Design de 6 kWc montre qu’une production annuelle de 9 711 kWh n’assure que 40,9 % d’autonomie à un logement consommant 3 600 kWh/an : une grande partie du solaire disponible est injectée au réseau. Cette observation justifie l’étude d’un déplacement des usages ou d’une batterie, mais ne prouve pas que le stockage sera économiquement préférable. Je poursuivrai avec les scénarios 3 kWc et trois pans, puis les simulations avec batterie et leurs coûts réels sous SAM/PVGIS.</p>
   <div className="pv-source-document"><div><FileText size={26}/><div><strong>Références de l’étude</strong><p>Rapport Sunny Design 6.22.2 « PTUT », 18/09/2026, 11 pages : configuration, bilans et projections. Document de cadrage : scénarios et hypothèses du projet tutoré. Les figures de cette fiche sont reconstituées à partir des données du rapport, sans être présentées comme des captures du logiciel.</p></div></div><a href={DOCUMENT} target="_blank" rel="noopener noreferrer">CONSULTER LE CAHIER DES CHARGES <ArrowUpRight size={17}/></a></div>
  </section>
 </div>;
}
