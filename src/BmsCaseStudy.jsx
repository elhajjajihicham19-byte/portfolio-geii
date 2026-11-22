import React, { useState } from 'react';
import { ArrowUpRight, ArrowRight, CircuitBoard, Gauge, Battery, AlertTriangle, CheckCircle2, XCircle, FileText, ZoomIn, Layers, Wrench } from 'lucide-react';
import './bms-case-study.css';

const REPORT='https://drive.google.com/file/d/1DUZowOv8VdRwOAyJHNs0hD_KosBUeGAz/view';
const PREVIEW='https://drive.google.com/file/d/1DUZowOv8VdRwOAyJHNs0hD_KosBUeGAz/preview';

const images={
  assembly:'/legacy/legacy-1ed60ec4c59c2e.webp',
  noLoad:'/legacy/legacy-615388cdac4b0d.webp',
  cell:'/legacy/legacy-3ffc3107d220a3.webp',
  board:'/legacy/legacy-5eff485b4859ec.webp'
};
function Figure({src,title,caption,onZoom,wide=false}){
  return <figure className={'bms-figure'+(wide?' bms-figure--wide':'')}>
    <button type="button" className="bms-figure-image" onClick={()=>onZoom({image:src,title,desc:caption,source:'Photographie originale — Google Sites'})} aria-label={'Agrandir : '+title}>
      <img src={src} alt={title} loading="lazy"/>
      <span><ZoomIn size={17}/> AGRANDIR</span>
    </button>
    <figcaption><strong>{title}</strong><span>{caption}</span></figcaption>
  </figure>;
}
function Source({page,label}){
  return <a className="bms-source" href={REPORT} target="_blank" rel="noopener noreferrer">
    <FileText size={16}/><span>{label||'Consulter le document original'} <small>RAPPORT TUTORÉ · PAGE {page} / 27</small></span><ArrowUpRight size={16}/>
  </a>;
}
function Spec({value,label}){return <div className="bms-spec"><strong>{value}</strong><span>{label}</span></div>}
export default function BmsCaseStudy({onZoom}){
  const [showReport,setShowReport]=useState(false);
  return <div className="bms-study">
    <div className="bms-study-heading">
      <span>ÉTUDE TECHNIQUE / SOURCE : RAPPORT TUTORÉ 2025–2026</span>
      <h3>DE LA CONCEPTION <em>AU DIAGNOSTIC.</em></h3>
      <p>La carte BMS Li-ion 4S a été dessinée, routée, assemblée et testée. Les premiers essais ont mis en évidence l’absence de conduction commandée en charge comme en décharge. Voici la démarche, illustrée par les photographies et les valeurs du projet.</p>
    </div>

    <section className="bms-chapter" aria-labelledby="bms-need">
      <div className="bms-chapter-index"><span>01 / CAHIER DES CHARGES</span><Battery size={22}/></div>
      <div className="bms-chapter-grid">
        <div className="bms-narrative">
          <h4 id="bms-need">Protéger un pack de quatre cellules.</h4>
          <p>L’objectif était de concevoir une carte de surveillance pour un assemblage <strong>4S Li-ion</strong> : mesurer les cellules, surveiller le courant et commander les interrupteurs de charge et de décharge en tenant compte des seuils de sécurité.</p>
          <p>Le rapport de projet fixe un pack de 14,8 V nominaux, 16,8 V maximum et un courant cible de 1 A. Les seuils retenus pour la surveillance sont donnés dans le document technique.</p>
          <div className="bms-spec-grid"><Spec value="4S" label="cellules en série"/><Spec value="14,8 V" label="tension nominale"/><Spec value="16,8 V" label="tension maximale"/><Spec value="1 A" label="courant ciblé"/></div>
          <Source page="5" label="Cahier des charges et seuils de protection"/>
        </div>
        <Figure src={images.assembly} title="Carte et pack Li-ion 4S" caption="Photographie originale du circuit assemblé et raccordé au pack. Elle documente la réalisation physique, sans prouver le fonctionnement des protections." onZoom={onZoom}/>
      </div>
    </section>

    <section className="bms-chapter" aria-labelledby="bms-arch">
      <div className="bms-chapter-index"><span>02 / ARCHITECTURE</span><Layers size={22}/></div>
      <div className="bms-chapter-grid">
        <div className="bms-narrative">
          <h4 id="bms-arch">Le ML5243 et les MOSFET Q3/Q4.</h4>
          <p>Le circuit de gestion <strong>ML5243</strong> surveille les tensions des cellules et commande les MOSFET disposés côté négatif (<em>low-side</em>). Les interrupteurs Q3 et Q4 sont destinés à autoriser ou bloquer les transferts d’énergie suivant l’état du pack.</p>
          <p>La conception prévoit également une mesure du courant par résistance shunt et une surveillance thermique. Le chemin de puissance est distinct des fonctions de mesure et de commande.</p>
          <div className="bms-flow" aria-label="Résumé fonctionnel simplifié">
            <div><span>01</span><b>PACK 4S</b><small>Tensions cellules</small></div><ArrowRight size={20}/><div><span>02</span><b>ML5243</b><small>Surveillance / commande</small></div><ArrowRight size={20}/><div><span>03</span><b>Q3 / Q4</b><small>Charge et décharge</small></div>
          </div>
          <p className="bms-small-note">Représentation fonctionnelle simplifiée pour la lecture du portfolio — le véritable schéma d’architecture se trouve à la page 6 du rapport.</p>
          <Source page="6" label="Architecture d'origine et commandes du ML5243"/>
          <Source page="9" label="Brochage du circuit et choix de composants"/>
        </div>
        <Figure src={images.board} title="Assemblage réel de la carte" caption="Gros plan sur le PCB, les connexions de puissance, le porte-fusible et les composants soudés." onZoom={onZoom}/>
      </div>
    </section>

    <section className="bms-chapter" aria-labelledby="bms-design">
      <div className="bms-chapter-index"><span>03 / CONCEPTION & ROUTAGE</span><CircuitBoard size={22}/></div>
      <h4 id="bms-design">Du schéma KiCad à la carte fabriquée.</h4>
      <div className="bms-design-grid">
        <div className="bms-design-notes">
          <p>La carte a été étudiée sous <strong>KiCad</strong>, puis routée en tenant compte du chemin de puissance, des connecteurs du pack et de la proximité des composants de mesure.</p>
          <ul>
            <li><span>01</span>Étudier les entrées de mesure et les sorties de commande du ML5243</li>
            <li><span>02</span>Dimensionner les composants et sélectionner les empreintes</li>
            <li><span>03</span>Router les pistes de puissance (2 mm indiqués dans le rapport)</li>
            <li><span>04</span>Fabriquer, souder et contrôler plusieurs versions du PCB</li>
          </ul>
          <p>Le rapport présente <strong>trois versions</strong> ainsi que les difficultés de soudure, de placement et de fiabilité rencontrées lors de leur réalisation.</p>
          <Source page="10" label="Routage KiCad original et shunt de 1 mΩ"/>
          <Source page="11" label="Versions 1, 2 et 3 du PCB"/>
        </div>
        <Figure src={images.assembly} title="PCB équipé, vue d'ensemble" caption="Version assemblée et connectée au pack. Les captures du routage KiCad se consultent dans le rapport source, pages 10 et 11." onZoom={onZoom}/>
      </div>
      <div className="bms-original-document">
        <div>
          <span>SOURCE TECHNIQUE COMPLÈTE</span>
          <h5>Schéma, routage et nomenclature authentiques</h5>
          <p>Le rapport comprend les vues originales de conception (pages 6, 9 à 11) et la nomenclature (page 24). Aucun schéma reconstitué n’est présenté ici comme un fichier KiCad d’origine.</p>
        </div>
        <button type="button" onClick={()=>setShowReport(v=>!v)}>{showReport?'FERMER LE RAPPORT':'AFFICHER LE RAPPORT DANS LA FICHE'} <ArrowUpRight size={17}/></button>
      </div>
      {showReport&&<div className="bms-report-viewer"><iframe title="Rapport tutoré BMS — schéma et routage KiCad" loading="lazy" src={PREVIEW}/><p>Dans le document, consulter les pages 6, 9, 10, 11 et 24. L’aperçu intégré dépend de l’accès Google Drive.</p></div>}
    </section>

    <section className="bms-chapter" aria-labelledby="bms-tests">
      <div className="bms-chapter-index"><span>04 / MESURES ET ESSAIS</span><Gauge size={22}/></div>
      <h4 id="bms-tests">Des mesures à vide aux essais sous charge.</h4>
      <p className="bms-chapter-lead">La présence d’une tension en sortie à vide ne suffit pas à établir que les MOSFET conduisent. Le protocole distingue les mesures sans charge, la décharge vers un moteur 9 V et la tentative de recharge par alimentation DC.</p>
      <div className="bms-measure-photos">
        <Figure src={images.noLoad} title="Tension en sortie à vide : 14,88 V" caption="Mesure photographiée lors du test 1. Le rapport attribue la tension relevée à une conduction par diode, malgré les MOSFET bloqués." onZoom={onZoom}/>
        <Figure src={images.cell} title="Mesure d'une cellule : 3,789 V" caption="Contrôle individuel présenté dans le test 1. Cette valeur ne doit pas être confondue avec les mesures du pack fortement déchargé lors du test de charge." onZoom={onZoom}/>
      </div>
      <div className="bms-results-table-wrap">
        <table className="bms-results-table">
          <thead><tr><th>ESSAI</th><th>CONDITIONS / MESURES</th><th>OBSERVATION</th><th>BILAN</th></tr></thead>
          <tbody>
            <tr><td>T1 / À VIDE</td><td>Vbat ≈ 15,16 V ; Vout ≈ 14,88 V</td><td>ΔV ≈ 0,28 V ; conduction via diode et MOS non commandés</td><td><span className="bms-result bms-result--limited">LIMITÉ</span></td></tr>
            <tr><td>T2 / DÉCHARGE</td><td>Moteur DC 9 V en charge ; Vgs ≈ 0,58 V</td><td>Vout ≈ 11,8 mV ; sortie effondrée</td><td><span className="bms-result bms-result--fail">NON VALIDÉ</span></td></tr>
            <tr><td>T3 / CHARGE</td><td>Alimentation ≈ 15 V ; limite 0,5 A</td><td>Courant ≈ 2 mA ; charge non effective</td><td><span className="bms-result bms-result--fail">NON VALIDÉ</span></td></tr>
            <tr><td>T4 / CELLULES</td><td>Pack initial ≈ 10,37 V</td><td>Cellule n° 3 ≈ 2,295 V ; déséquilibre et protection UV possible</td><td><span className="bms-result bms-result--warning">À ANALYSER</span></td></tr>
          </tbody>
        </table>
      </div>
      <div className="bms-results-source"><Source page="13–16" label="Protocole et tableaux d'essais originaux"/></div>
    </section>

    <section className="bms-chapter" aria-labelledby="bms-diagnostic">
      <div className="bms-chapter-index"><span>05 / DIAGNOSTIC TECHNIQUE</span><Wrench size={22}/></div>
      <div className="bms-chapter-grid">
        <div className="bms-narrative">
          <h4 id="bms-diagnostic">Pourquoi la sortie ne fournit-elle pas la puissance attendue ?</h4>
          <p>Les mesures en décharge mettent en évidence une tension grille-source d’environ <strong>0,58 V</strong>, insuffisante pour piloter les MOSFET. La tension de sortie s’effondre dès que le moteur est raccordé.</p>
          <p>Le diagnostic a également identifié une <strong>incohérence sur la résistance de mesure du courant</strong> : le montage a comporté une valeur de <strong>1 kΩ</strong> alors que le dimensionnement prévoyait <strong>1 mΩ</strong>. La faible tension d’une cellule pendant les essais de charge constitue une autre cause de blocage possible. Ces observations ne permettent pas d’attribuer tout le défaut à un unique composant.</p>
          <div className="bms-diagnostic-contrast">
            <div><small>SHUNT PRÉVU</small><b>1 mΩ</b><span>Valeur cible du rapport, p. 10</span></div>
            <div><small>VALEUR RELEVÉE</small><b>1 kΩ</b><span>Écart identifié lors du diagnostic du montage</span></div>
          </div>
          <Source page="17" label="Analyse des anomalies et actions correctives envisagées"/>
        </div>
        <div className="bms-diagnostic-panel">
          <AlertTriangle size={26}/>
          <span>CONCLUSION DES ESSAIS</span>
          <strong>CARTE RÉALISÉE.<br/>FONCTIONNEMENT NON VALIDÉ.</strong>
          <p>Le routage et le soudage constituent des réalisations concrètes ; les tests de charge et de décharge n’ont pas confirmé le fonctionnement attendu. Aucune validation après correction n’est présentée.</p>
          <div><XCircle size={18}/> Décharge sous charge : KO</div>
          <div><XCircle size={18}/> Recharge du pack : KO</div>
          <div><CheckCircle2 size={18}/> Démarche de diagnostic documentée</div>
        </div>
      </div>
    </section>

    <section className="bms-chapter bms-chapter--conclusion" aria-labelledby="bms-review">
      <div className="bms-chapter-index"><span>06 / COMPÉTENCES & PRISE DE RECUL</span><Layers size={22}/></div>
      <h4 id="bms-review">Ce que ce projet m’a appris.</h4>
      <div className="bms-learning-grid">
        <div><span>CONCEVOIR</span><p>Définir une architecture BMS, comprendre une documentation constructeur, choisir les composants et produire un circuit imprimé.</p></div>
        <div><span>VÉRIFIER</span><p>Construire un protocole d’essai, mesurer Vbat, Vout et Vgs, distinguer un signal présent d’une puissance réellement transférée.</p></div>
        <div><span>DIAGNOSTIQUER</span><p>Rechercher les causes plausibles d’un blocage : MOSFET, résistance shunt, déséquilibre des cellules et protections.</p></div>
      </div>
      <p className="bms-final-note">L’amélioration prioritaire consiste à corriger et vérifier les valeurs montées, reprendre les contrôles hors tension, puis répéter la procédure complète sur un pack conforme et avec une limitation de courant adaptée. Le fonctionnement ne pourra être annoncé comme validé qu’après ces nouveaux essais.</p>
      <a className="bms-final-source" href={REPORT} target="_blank" rel="noopener noreferrer"><FileText size={20}/> CONSULTER LE RAPPORT TUTORÉ COMPLET (27 PAGES) <ArrowUpRight size={19}/></a>
    </section>
  </div>;
}
