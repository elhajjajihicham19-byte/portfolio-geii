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
function Figure({src,title,caption,onZoom,wide=false,source='Photographie originale — Google Sites'}){
  return <figure className={'bms-figure'+(wide?' bms-figure--wide':'')}>
    <button type="button" className="bms-figure-image" onClick={()=>onZoom({image:src,title,desc:caption,source})} aria-label={'Agrandir : '+title}>
      <img src={src} alt={title} loading="lazy"/>
      <span><ZoomIn size={17}/> AGRANDIR</span>
    </button>
    <figcaption><strong>{title}</strong><span>{caption}</span></figcaption>
  </figure>;
}
function ReportFigure({page,title,caption,onZoom,wide=false}) {
  const id=String(page).padStart(2,'0');
  return <Figure src={'/assets/bms/rapport-page-'+id+'.webp'} title={title} caption={caption}
    onZoom={onZoom} wide={wide} source={'Capture authentique du rapport tutoré BMS — page '+page+'/27'}/>;
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
      <p>Dans ce projet tutoré, nous avons conçu, routé, assemblé et testé une carte BMS Li-ion 4S. Les premiers essais ont révélé l’absence de conduction commandée en charge comme en décharge. Les différentes étapes de notre démarche sont présentées à travers les schémas, photographies et mesures obtenues.</p>
    </div>

    <section className="bms-chapter" aria-labelledby="bms-need">
      <div className="bms-chapter-index"><span>01 / CAHIER DES CHARGES</span><Battery size={22}/></div>
      <div className="bms-chapter-grid">
        <div className="bms-narrative">
          <h4 id="bms-need">Protéger un pack de quatre cellules.</h4>
          <p>Notre objectif était de concevoir une carte de protection pour un pack <strong>Li-ion 4S</strong>. Nous devions surveiller la tension des cellules et le courant, puis commander les circuits de charge et de décharge selon les seuils de sécurité définis.</p>
          <p>Dans notre cahier des charges, nous avons retenu un pack de 14,8 V nominaux, une tension maximale de 16,8 V et un courant cible de 1 A. Nous avons également défini des seuils de surtension et de sous-tension pour les cellules.</p>
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
          <p>Nous avons également prévu une mesure du courant par résistance shunt et une surveillance thermique. Nous avons séparé le chemin de puissance des fonctions de mesure et de commande.</p>
          <div className="bms-flow" aria-label="Résumé fonctionnel simplifié">
            <div><span>01</span><b>PACK 4S</b><small>Tensions cellules</small></div><ArrowRight size={20}/><div><span>02</span><b>ML5243</b><small>Surveillance / commande</small></div><ArrowRight size={20}/><div><span>03</span><b>Q3 / Q4</b><small>Charge et décharge</small></div>
          </div>
          <p className="bms-small-note">Cette représentation simplifiée résume l’architecture que nous avons étudiée. Le schéma détaillé est présenté juste après, à partir de notre dossier de conception.</p>
          <Source page="6" label="Architecture d'origine et commandes du ML5243"/>
          <Source page="9" label="Brochage du circuit et choix de composants"/>
        </div>
        <Figure src={images.board} title="Assemblage réel de la carte" caption="Gros plan sur le PCB, les connexions de puissance, le porte-fusible et les composants soudés." onZoom={onZoom}/>
      </div>
      <div className="bms-report-figure-single">
        <ReportFigure page={6} title="Schéma d’architecture original — ML5243" caption="Schéma issu de notre dossier : ML5243, MOSFET de charge/décharge et détection thermique. Une mention « 5S » figure sur cette planche alors que notre cahier des charges retient un pack 4S ; cette incohérence reste à clarifier." onZoom={onZoom} wide/>
      </div>
    </section>

    <section className="bms-chapter" aria-labelledby="bms-design">
      <div className="bms-chapter-index"><span>03 / CONCEPTION & ROUTAGE</span><CircuitBoard size={22}/></div>
      <h4 id="bms-design">Du schéma KiCad à la carte fabriquée.</h4>
      <div className="bms-design-grid">
        <div className="bms-design-notes">
          <p>Nous avons conçu notre carte sous <strong>KiCad</strong>, puis réalisé le routage en tenant compte du chemin de puissance, des connecteurs du pack et de l’implantation des composants de mesure.</p>
          <ul>
            <li><span>01</span>Étudier les entrées de mesure et les sorties de commande du ML5243</li>
            <li><span>02</span>Dimensionner les composants et sélectionner les empreintes</li>
            <li><span>03</span>Router les pistes de puissance (2 mm indiqués dans le rapport)</li>
            <li><span>04</span>Fabriquer, souder et contrôler plusieurs versions du PCB</li>
          </ul>
          <p>Nous avons réalisé <strong>trois versions du PCB</strong>. Les premières itérations nous ont confrontés à des difficultés de soudure, d’implantation et de fiabilité, que nous avons analysées pour améliorer la carte.</p>
          <Source page="10" label="Routage KiCad original et shunt de 1 mΩ"/>
          <Source page="11" label="Versions 1, 2 et 3 du PCB"/>
        </div>
        <Figure src={images.assembly} title="PCB équipé, vue d'ensemble" caption="Notre carte assemblée et raccordée au pack. Les vues KiCad et les versions du PCB sont présentées ci-dessous." onZoom={onZoom}/>
      </div>
      <div className="bms-report-figures">
        <ReportFigure page={9} title="Conception matérielle et brochage du ML5243" caption="Schéma et contraintes électriques du circuit — rapport original, page 9." onZoom={onZoom}/>
        <ReportFigure page={10} title="Routage KiCad — pistes et shunt" caption="Vue réelle du PCB routé : chemin de puissance 2 mm et shunt cible 1 mΩ — rapport original, page 10." onZoom={onZoom}/>
        <ReportFigure page={11} title="Évolution des trois versions du PCB" caption="Comparaison des versions fabriquées, difficultés d’assemblage et corrections — rapport original, page 11." onZoom={onZoom} wide/>
      </div>
      <div className="bms-original-document">
        <div>
          <span>SOURCE TECHNIQUE COMPLÈTE</span>
          <h5>Schéma, routage et nomenclature authentiques</h5>
          <p>Nous avons conservé les vues de conception, le routage et la nomenclature dans notre dossier technique. Les figures présentées sont issues de nos documents de projet, sans schéma fictif.</p>
        </div>
        <button type="button" onClick={()=>setShowReport(v=>!v)}>{showReport?'FERMER LE RAPPORT':'AFFICHER LE RAPPORT DANS LA FICHE'} <ArrowUpRight size={17}/></button>
      </div>
      {showReport&&<div className="bms-report-viewer"><iframe title="Rapport tutoré BMS — schéma et routage KiCad" loading="lazy" src={PREVIEW}/><p>Notre rapport rassemble les schémas et le routage (pages 6 et 9 à 11), ainsi que la nomenclature (page 24). L’aperçu intégré dépend de l’accès Google Drive.</p></div>}
    </section>

    <section className="bms-chapter" aria-labelledby="bms-tests">
      <div className="bms-chapter-index"><span>04 / MESURES ET ESSAIS</span><Gauge size={22}/></div>
      <h4 id="bms-tests">Des mesures à vide aux essais sous charge.</h4>
      <p className="bms-chapter-lead">Nous avons commencé par des mesures à vide avant de raccorder un moteur 9 V en charge, puis d’essayer de recharger le pack avec une alimentation continue. Ces essais nous ont permis de constater qu’une tension présente à vide ne garantit pas la conduction des MOSFET sous charge.</p>
      <div className="bms-measure-photos">
        <Figure src={images.noLoad} title="Tension en sortie à vide : 14,88 V" caption="Lors du test 1, nous avons mesuré 14,88 V en sortie à vide. Notre analyse indique une conduction par diode intrinsèque malgré le blocage des MOSFET." onZoom={onZoom}/>
        <Figure src={images.cell} title="Mesure d'une cellule : 3,789 V" caption="Lors du test 1, nous avons relevé 3,789 V sur une cellule. Lors des essais de recharge, nous avons ensuite travaillé sur un pack plus fortement déchargé." onZoom={onZoom}/>
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
      <div className="bms-report-figures">
        <ReportFigure page={14} title="Test 1 — résultats à vide" caption="Mesures Vbat/Vout et état de Q3/Q4, avec photos du banc d’essai : page 14 du rapport." onZoom={onZoom}/>
        <ReportFigure page={15} title="Test 2 — décharge sous charge" caption="Vgs ≈ 0,58 V ; Vout ≈ 11,8 mV. La conduction des MOSFET n’est pas validée — page 15." onZoom={onZoom}/>
        <ReportFigure page={16} title="Tests 3 et 4 — charge et tensions des cellules" caption="Courant de charge quasi nul, cellule 3 à 2,295 V et interrupteurs bloqués — page 16." onZoom={onZoom} wide/>
      </div>
      <div className="bms-results-source"><Source page="13–16" label="Protocole et tableaux d'essais originaux"/></div>
    </section>

    <section className="bms-chapter" aria-labelledby="bms-diagnostic">
      <div className="bms-chapter-index"><span>05 / DIAGNOSTIC TECHNIQUE</span><Wrench size={22}/></div>
      <div className="bms-chapter-grid">
        <div className="bms-narrative">
          <h4 id="bms-diagnostic">Pourquoi la sortie ne fournit-elle pas la puissance attendue ?</h4>
          <p>En décharge, nous avons mesuré une tension grille-source d’environ <strong>0,58 V</strong>, insuffisante pour commander les MOSFET. Dès le raccordement du moteur, nous avons constaté l’effondrement de la tension de sortie.</p>
          <p>Nous avons également relevé une <strong>incohérence sur la résistance de mesure du courant</strong> : une valeur de <strong>1 kΩ</strong> a été montée au lieu des <strong>1 mΩ</strong> prévus. Nous avons aussi constaté la faible tension d’une cellule pendant les essais de charge, susceptible d’activer une protection. À ce stade, nos mesures ne permettent pas d’attribuer le dysfonctionnement à une seule cause.</p>
          <div className="bms-diagnostic-contrast">
            <div><small>SHUNT PRÉVU</small><b>1 mΩ</b><span>Valeur retenue à la conception</span></div>
            <div><small>VALEUR RELEVÉE</small><b>1 kΩ</b><span>Écart relevé sur notre montage</span></div>
          </div>
          <Source page="17" label="Analyse des anomalies et actions correctives envisagées"/>
        </div>
        <div className="bms-diagnostic-panel">
          <AlertTriangle size={26}/>
          <span>CONCLUSION DES ESSAIS</span>
          <strong>CARTE RÉALISÉE.<br/>FONCTIONNEMENT NON VALIDÉ.</strong>
          <p>Nous avons mené à bien le routage et l’assemblage de la carte. En revanche, nos essais n’ont pas permis de valider la charge ni la décharge. Nous n’avons pas réalisé de validation complète après correction du montage.</p>
          <div><XCircle size={18}/> Décharge sous charge : KO</div>
          <div><XCircle size={18}/> Recharge du pack : KO</div>
          <div><CheckCircle2 size={18}/> Démarche de diagnostic documentée</div>
        </div>
      </div>
      <div className="bms-report-figure-single">
        <ReportFigure page={17} title="Démarche de diagnostic d'origine" caption="Causes possibles, mesures de contrôle et actions correctives envisagées dans le rapport de projet — page 17." onZoom={onZoom} wide/>
      </div>
    </section>

    <section className="bms-chapter bms-chapter--conclusion" aria-labelledby="bms-review">
      <div className="bms-chapter-index"><span>06 / COMPÉTENCES & PRISE DE RECUL</span><Layers size={22}/></div>
      <h4 id="bms-review">Les compétences que j’ai développées.</h4>
      <div className="bms-learning-grid">
        <div><span>CONCEVOIR</span><p>Définir une architecture BMS, comprendre une documentation constructeur, choisir les composants et produire un circuit imprimé.</p></div>
        <div><span>VÉRIFIER</span><p>Construire un protocole d’essai, mesurer Vbat, Vout et Vgs, distinguer un signal présent d’une puissance réellement transférée.</p></div>
        <div><span>DIAGNOSTIQUER</span><p>Rechercher les causes plausibles d’un blocage : MOSFET, résistance shunt, déséquilibre des cellules et protections.</p></div>
      </div>
      <p className="bms-final-note">Pour poursuivre ce projet, nous devrions d’abord vérifier les composants réellement montés, corriger la résistance shunt et reprendre les contrôles hors tension. Nous pourrions ensuite répéter les essais de charge et de décharge avec un pack conforme et une limitation de courant adaptée. Seule cette nouvelle campagne de tests permettrait de conclure à une éventuelle validation du fonctionnement.</p>
      <a className="bms-final-source" href={REPORT} target="_blank" rel="noopener noreferrer"><FileText size={20}/> CONSULTER LE RAPPORT TUTORÉ COMPLET (27 PAGES) <ArrowUpRight size={19}/></a>
    </section>
  </div>;
}
