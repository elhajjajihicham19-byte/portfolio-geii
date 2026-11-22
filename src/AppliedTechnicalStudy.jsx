import React from 'react';
import {ArrowUpRight, FileText, ZoomIn, Waves, CircuitBoard, ChartNoAxesCombined, Microscope, ShieldCheck, Lightbulb, Gauge, AlertCircle} from 'lucide-react';
import './applied-technical-study.css';

function Figure({evidence,onZoom}){
 if(!evidence)return null;
 return <figure className="technical-figure">
  <button type="button" onClick={()=>onZoom(evidence)} aria-label={'Agrandir : '+evidence.title}>
   <img src={evidence.image} alt={evidence.title} loading="lazy"/><span><ZoomIn size={16}/> AGRANDIR</span>
  </button>
  <figcaption><strong>{evidence.title}</strong><p>{evidence.desc}</p></figcaption>
 </figure>;
}
function SourceLink({doc}){
 if(!doc)return null;
 return <a className="technical-doc-link" href={doc.url} target="_blank" rel="noopener noreferrer"><FileText size={20}/><span>{doc.label}<small>SIMULATIONS, MESURES ET CALCULS DÉTAILLÉS</small></span><ArrowUpRight size={18}/></a>;
}
function Chapter({number,title,icon,children}){
 return <section className="bms-chapter">
  <div className="bms-chapter-index"><span>{String(number).padStart(2,'0')} / {title}</span>{icon}</div>{children}
 </section>;
}
const cemSimulations={
  lcSchematic:{image:'/assets/cem/filtre-accorde-schema.webp',title:'Schéma PSIM — filtre passif accordé',desc:'LF = 10 mH conservée, L1 = 15 mH et branche L2–C1 accordée sur 150 Hz (TP, p. 20).'},
  lcWaves:{image:'/assets/cem/filtre-accorde-chronogrammes.webp',title:'Chronogrammes — source, filtre et pont',desc:'Courants i(t), iC1(t) et iP(t) : la branche accordée absorbe l’harmonique 3 (TP, p. 21).'},
  lcSpectra:{image:'/assets/cem/filtre-accorde-spectres.webp',title:'Spectres de courants — filtre LC accordé',desc:'Analyse de Fourier des trois courants : H3 disparaît côté réseau (TP, p. 22).'},
  pfcSchematic:{image:'/assets/cem/pfc-schema-boost.webp',title:'Schéma PSIM — redresseur avec PFC Boost',desc:'Pont de diodes, inductance, IGBT, diode de Boost et condensateur de sortie (TP, p. 24).'},
  pfcControl:{image:'/assets/cem/pfc-commande-hysteresis.webp',title:'Commande du PFC par hystérésis',desc:'Comparateurs, bande de courant et bascule RS commandant l’IGBT (TP, p. 26).'},
  pfcHysteresis:{image:'/assets/cem/pfc-bande-hysteresis.webp',title:'Simulation du suivi de courant du PFC',desc:'Le courant de l’inductance reste entre les consignes de la bande d’hystérésis (TP, p. 28).'},
  pfcWaves:{image:'/assets/cem/pfc-chronogrammes.webp',title:'Oscillogrammes PSIM — fonctionnement du PFC',desc:'Tension redressée, courant inductance et courant réseau quasi sinusoïdal (TP, p. 29).'}
};
function CemStudy({project:p,onZoom}){
 const [circuit,waves,spectrum,filter]=p.evidence||[];
 return <div className="bms-study technical-study">
  <div className="bms-study-heading"><span>TRAVAUX PRATIQUES / ÉLECTRONIQUE DE PUISSANCE & CEM</span>
   <h3>COMPRENDRE LA <em>POLLUTION HARMONIQUE.</em></h3>
   <p>J’ai étudié par simulation le comportement d’un redresseur monophasé alimentant une charge capacitive, puis comparé différentes méthodes de limitation des harmoniques. Les résultats ci-dessous sont tirés de mon compte rendu PSIM et ne représentent pas des mesures sur une installation réelle.</p>
  </div>
  <Chapter number={1} title="OBJECTIF & MONTAGE" icon={<CircuitBoard size={22}/>}>
   <div className="bms-chapter-grid"><div className="bms-narrative"><h4>Étudier une alimentation non linéaire.</h4>
    <p>J’ai simulé un pont redresseur monophasé à quatre diodes, suivi d’un condensateur de filtrage et d’une charge résistive. L’objectif était d’observer le courant appelé au réseau et de déterminer comment ce montage peut provoquer une pollution harmonique.</p>
    <p>Le modèle de référence utilise une source de <strong>240 V efficaces à 50 Hz</strong>, un condensateur de <strong>500 µF</strong> et une charge de <strong>160 Ω</strong>. Les valeurs proviennent du sujet de simulation et ne décrivent pas un prototype assemblé.</p>
    <div className="bms-spec-grid"><div className="bms-spec"><strong>50 Hz</strong><span>fréquence du réseau</span></div><div className="bms-spec"><strong>500 µF</strong><span>condensateur de filtrage</span></div><div className="bms-spec"><strong>160 Ω</strong><span>charge du modèle</span></div><div className="bms-spec"><strong>4</strong><span>diodes du pont</span></div></div>
   </div><Figure evidence={circuit} onZoom={onZoom}/></div>
  </Chapter>
  <Chapter number={2} title="PRINCIPE ÉLECTRIQUE" icon={<Waves size={22}/>}>
   <div className="bms-chapter-grid"><div className="bms-narrative"><h4>Pourquoi le courant est-il absorbé par impulsions ?</h4>
    <p>La tension du condensateur reste proche de sa valeur crête. Le pont ne conduit que lorsque la tension alternative redressée dépasse cette tension, ce qui limite la recharge à de courtes périodes autour des maxima.</p>
    <p>J’ai ainsi observé des pics de courant d’environ <strong>14,6 A</strong> pendant <strong>2,2 ms</strong>, alors que la tension réseau reste sinusoïdale. Le condensateur reçoit l’énergie pendant ces pics puis la restitue progressivement à la charge.</p>
    <div className="technical-measure-highlight"><span>COURANT CRÊTE SIMULÉ</span><b>≈ 14,6 A</b><p>Impulsions ≈ 2,2 ms par demi-période</p></div>
   </div><Figure evidence={waves} onZoom={onZoom}/></div>
  </Chapter>
  <Chapter number={3} title="MESURES ET ANALYSE FRÉQUENTIELLE" icon={<ChartNoAxesCombined size={22}/>}>
   <div className="bms-chapter-grid"><div className="bms-narrative"><h4>Mettre en évidence la distorsion du courant.</h4>
    <p>J’ai utilisé une analyse de Fourier pour relever le fondamental à 50 Hz ainsi que les composantes impaires à 150 Hz, 250 Hz, 350 Hz, etc. Les simulations donnent un courant efficace d’environ <strong>4,76 A</strong>, un <strong>THD de 139 %</strong> et un facteur de puissance d’environ <strong>0,58</strong>.</p>
    <p>Le faible facteur de puissance ne s’explique pas principalement par le déphasage du fondamental : son cos φ est voisin de 0,99. Il est fortement pénalisé par la déformation du courant.</p>
    <div className="bms-spec-grid"><div className="bms-spec"><strong>139 %</strong><span>THD courant initial</span></div><div className="bms-spec"><strong>0,58</strong><span>facteur de puissance</span></div></div>
   </div><Figure evidence={spectrum} onZoom={onZoom}/></div>
  </Chapter>
  <Chapter number={4} title="FILTRAGE PASSIF : LF ET FILTRE ACCORDÉ" icon={<Microscope size={22}/>}>
   <h4>Atténuer les impulsions, puis éliminer l’harmonique 3.</h4>
   <p className="technical-intro">J’ai d’abord ajouté une inductance série <strong>LF = 10 mH</strong> pour limiter les variations rapides du courant. Les impulsions sont moins hautes et plus étalées : le THD passe de <strong>139 % à 81 %</strong> et le facteur de puissance s’améliore de <strong>0,58 à 0,74</strong>. Ce premier filtrage reste toutefois insuffisant pour obtenir un courant proche d’une sinusoïde.</p>
   <div className="technical-result-table"><table><thead><tr><th>GRANDEUR SIMULÉE</th><th>REDRESSEUR SEUL</th><th>AVEC LF = 10 mH</th></tr></thead><tbody>
    <tr><td>Courant crête</td><td>≈ 14,6 A</td><td>≈ 7,5 A</td></tr>
    <tr><td>Durée des impulsions</td><td>≈ 2,2 ms</td><td>≈ 4,5 ms</td></tr>
    <tr><td>Courant efficace réseau</td><td>4,76 A</td><td>3,33 A</td></tr>
    <tr><td>THD en courant</td><td>139 %</td><td>81 %</td></tr>
    <tr><td>Facteur de puissance</td><td>0,58</td><td>0,74</td></tr>
   </tbody></table></div>
   <div className="technical-image-wide"><Figure evidence={filter} onZoom={onZoom}/></div>

   <div className="cem-case-divider"><span>SIMULATION PSIM / FILTRE PASSIF ACCORDÉ</span><span>RÉSONANCE À 150 Hz</span></div>
   <h4>Piéger le rang 3 avec une branche LC.</h4>
   <p className="technical-intro">J’ai conservé l’inductance LF précédente et simulé un filtre avec <strong>L1 = 15 mH</strong> pour le découplage et une branche <strong>L2–C1</strong> accordée sur la fréquence du troisième harmonique : <strong>f₃ = 3 × 50 = 150 Hz</strong>. Pour <strong>C1 = 24,8 µF</strong>, j’ai obtenu <strong>L2 ≈ 45,4 mH</strong> avec la relation <strong>L2 = 1 / [(2πf₃)² C1]</strong>.</p>
   <div className="bms-spec-grid cem-spec-grid"><div className="bms-spec"><strong>150 Hz</strong><span>harmonique ciblé</span></div><div className="bms-spec"><strong>45,4 mH</strong><span>inductance L2 calculée</span></div><div className="bms-spec"><strong>24,8 µF</strong><span>capacité C1</span></div><div className="bms-spec"><strong>15 mH</strong><span>découplage L1</span></div></div>
   <div className="cem-figure-grid">
    <Figure evidence={cemSimulations.lcSchematic} onZoom={onZoom}/>
    <Figure evidence={cemSimulations.lcWaves} onZoom={onZoom}/>
   </div>
   <p className="technical-intro">Les chronogrammes distinguent le courant réseau <strong>i(t)</strong>, celui de la branche accordée <strong>iC1(t)</strong> et le courant du pont <strong>iP(t)</strong>. Le redresseur continue d’absorber un courant déformé, mais sa composante de rang 3 est dérivée vers la branche L2–C1 : <strong>I₃ ≈ 0 A côté réseau</strong>, alors que <strong>I₃ = 1,74 A</strong> circule dans le filtre. J’ai également relevé <strong>2,15 A à 50 Hz</strong> dans cette branche.</p>
   <div className="cem-figure-grid cem-figure-grid--single">
    <Figure evidence={cemSimulations.lcSpectra} onZoom={onZoom}/>
   </div>
   <div className="technical-result-table"><table><thead><tr><th>RÉSULTAT</th><th>LF SEULE</th><th>LF + FILTRE ACCORDÉ</th></tr></thead><tbody>
    <tr><td>Harmonique H3 (150 Hz)</td><td>1,86 A</td><td>≈ 0 A</td></tr>
    <tr><td>Harmonique H5 (250 Hz)</td><td>0,89 A</td><td>0,44 A</td></tr>
    <tr><td>THD courant</td><td>81 %</td><td><strong>17 %</strong></td></tr>
    <tr><td>Courant réseau efficace</td><td>3,33 A</td><td>2,88 A</td></tr>
    <tr><td>Facteur de puissance PF</td><td>0,74</td><td><strong>0,89</strong></td></tr>
    <tr><td>Facteur de déplacement DPF</td><td>0,95</td><td>0,90</td></tr>
    <tr><td>Puissance active</td><td>591 W</td><td>616 W</td></tr>
   </tbody></table></div>
   <div className="technical-analysis"><AlertCircle size={22}/><p>Le filtre accordé est efficace sur le rang visé, mais il ne supprime pas toutes les harmoniques. À 50 Hz, la branche L2–C1 reste capacitive : le courant réseau est en avance d’environ <strong>26°</strong> et le DPF baisse à <strong>0,90</strong>. Ce type de filtre est aussi encombrant et peut entrer en résonance avec l’impédance du réseau. Dans les conditions simulées, les harmoniques vérifiées respectent les limites retenues dans le TP.</p></div>
  </Chapter>

  <Chapter number={5} title="PFC BOOST ET COMPARAISON DES RÉSULTATS" icon={<Gauge size={22}/>}>
   <h4>Imposer un courant sinusoïdal avec un correcteur actif.</h4>
   <p className="technical-intro">J’ai ensuite étudié un <strong>correcteur de facteur de puissance (PFC)</strong> constitué d’un pont de diodes et d’un <strong>hacheur élévateur Boost</strong>. Le montage associe une inductance, un interrupteur IGBT, une diode et un condensateur. Contrairement au filtre accordé, il agit directement sur la forme du courant absorbé.</p>
   <div className="cem-figure-grid">
    <Figure evidence={cemSimulations.pfcSchematic} onZoom={onZoom}/>
    <Figure evidence={cemSimulations.pfcControl} onZoom={onZoom}/>
   </div>
   <p className="technical-intro">J’ai étudié une commande par <strong>hystérésis</strong> : le courant dans l’inductance est maintenu entre deux consignes, dont la borne basse représente 90 % de la borne haute. L’IGBT est commuté pour suivre une sinusoïde redressée proportionnelle à la tension d’entrée. Le courant demandé au réseau devient ainsi pratiquement <strong>sinusoïdal et en phase</strong> avec la tension.</p>
   <div className="bms-spec-grid cem-spec-grid"><div className="bms-spec"><strong>390 V</strong><span>tension continue régulée Uc</span></div><div className="bms-spec"><strong>5 mH</strong><span>inductance du Boost</span></div><div className="bms-spec"><strong>≈ 241 Ω</strong><span>résistance de charge</span></div><div className="bms-spec"><strong>20–100 kHz</strong><span>ordre de grandeur du découpage</span></div></div>
   <div className="cem-figure-grid">
    <Figure evidence={cemSimulations.pfcHysteresis} onZoom={onZoom}/>
    <Figure evidence={cemSimulations.pfcWaves} onZoom={onZoom}/>
   </div>
   <p className="technical-intro">Pour le point de fonctionnement simulé (<strong>Uc ≈ 390 V, L = 5 mH, Vicons ≈ 0,77 V</strong>), le courant réseau est proche d’une sinusoïde de 50 Hz. Le signal de commande commute à fréquence variable : environ <strong>24 kHz</strong> au sommet de la sinusoïde redressée, et davantage au voisinage des passages par zéro. Une faible ondulation liée au découpage subsiste.</p>
   <div className="technical-result-table"><table><thead><tr><th>SIMULATION PSIM</th><th>REDRESSEUR</th><th>LF 10 mH</th><th>LC ACCORDÉ</th><th>PFC BOOST</th></tr></thead><tbody>
    <tr><td>THD courant</td><td>139 %</td><td>81 %</td><td>17 %</td><td><strong>≈ 3 %</strong></td></tr>
    <tr><td>Facteur de puissance PF</td><td>0,58</td><td>0,74</td><td>0,89</td><td><strong>≈ 1,00</strong></td></tr>
    <tr><td>Cos φ₁ (DPF)</td><td>0,99</td><td>0,95</td><td>0,90</td><td>1,00</td></tr>
    <tr><td>Courant efficace</td><td>4,76 A</td><td>3,33 A</td><td>2,88 A</td><td>2,65 A</td></tr>
    <tr><td>Harmonique H3</td><td>2,54 A</td><td>1,86 A</td><td>≈ 0 A</td><td>≈ 0 A</td></tr>
    <tr><td>Puissance active</td><td>659 W</td><td>591 W</td><td>616 W</td><td>635 W</td></tr>
    <tr><td>Puissance apparente</td><td>≈ 1,14 kVA</td><td>≈ 0,80 kVA</td><td>≈ 0,69 kVA</td><td>≈ 0,64 kVA</td></tr>
   </tbody></table></div>
   <div className="cem-conclusion-grid">
    <div className="technical-measure-highlight"><span>FILTRE ACCORDÉ / THD</span><b>17 %</b><p>Le rang 3 est dérivé vers la branche LC ; un courant réactif capacitif subsiste.</p></div>
    <div className="technical-measure-highlight"><span>PFC BOOST / THD</span><b>≈ 3 %</b><p>Courant réseau presque sinusoïdal, PF ≈ 1 et tension continue régulée à 390 V.</p></div>
   </div>
   <p className="technical-intro">Le PFC donne les meilleurs résultats de cette comparaison pour une alimentation d’environ <strong>600 W</strong> : <strong>Ieff = 2,65 A</strong>, <strong>PF ≈ 0,999</strong> et <strong>DPF ≈ 1</strong>, avec des harmoniques de basse fréquence quasi nulles. En contrepartie, la commande électronique est plus complexe, le découpage crée des pertes et des perturbations conduites à haute fréquence qui nécessitent un filtrage adapté.</p>
   <div className="technical-analysis"><AlertCircle size={22}/><p>Tous ces résultats sont issus des simulations PSIM du TP. Le THD de 3 % n’implique pas l’absence totale de perturbations : une ondulation résiduelle demeure aux fréquences de découpage. Une validation matérielle demanderait aussi des mesures de rendement, d’échauffement et de compatibilité électromagnétique.</p></div>
  </Chapter>
  <Chapter number={6} title="COMPÉTENCES & DOCUMENTS" icon={<ShieldCheck size={22}/>}>
   <h4>Interpréter des signaux, pas seulement relever des valeurs.</h4>
   <div className="bms-learning-grid">
    <div><span>VÉRIFIER</span><p>J’ai appris à analyser un courant non sinusoïdal à partir de sa forme temporelle et de son spectre.</p></div>
    <div><span>CONCEVOIR</span><p>J’ai comparé plusieurs structures de limitation des harmoniques et leurs contraintes électriques.</p></div>
    <div><span>PRISE DE RECUL</span><p>J’ai distingué amélioration de la forme d’onde, facteur de puissance, puissance utile et coût du filtrage.</p></div>
   </div>
   <SourceLink doc={p.docs?.[0]}/>
  </Chapter>
 </div>;
}
function DialuxStudy({project:p,onZoom}){
 const [nine,eight,hall,energy]=p.evidence||[];
 return <div className="bms-study technical-study">
  <div className="bms-study-heading"><span>TRAVAUX PRATIQUES / ÉCLAIRAGE ET MAÎTRISE DE L'ÉNERGIE</span>
   <h3>CALCULER, COMPARER <em>ET JUSTIFIER.</em></h3>
   <p>J’ai modélisé une salle de cours et un hall dans DIALux evo, puis comparé plusieurs implantations. L’enjeu était de respecter les exigences d’éclairement et d’uniformité tout en maîtrisant la puissance installée. Les captures présentées sont celles de mes calculs.</p>
  </div>
  <Chapter number={1} title="CAHIER DES CHARGES & MODÉLISATION" icon={<Lightbulb size={22}/>}>
   <div className="bms-chapter-grid"><div className="bms-narrative"><h4>Définir le bon profil d'utilisation.</h4>
    <p>J’ai commencé par modéliser la salle I022a, de <strong>8 × 7,5 × 3,4 m</strong>, avec un plan de travail à 0,80 m et un facteur de maintenance de 0,90. Pour les activités générales d’une salle de classe, l’étude retient un éclairement moyen d’au moins <strong>500 lux</strong> et une uniformité d’au moins <strong>0,60</strong>.</p>
    <p>J’ai sélectionné le luminaire THORN OMEGA M 4100-840 HF SRG Q600, d’une puissance de <strong>29,1 W</strong>, pour comparer deux implantations.</p>
    <div className="bms-spec-grid"><div className="bms-spec"><strong>60 m²</strong><span>surface de la salle</span></div><div className="bms-spec"><strong>≥ 500 lx</strong><span>éclairement moyen cible</span></div><div className="bms-spec"><strong>≥ 0,60</strong><span>uniformité demandée</span></div><div className="bms-spec"><strong>29,1 W</strong><span>puissance par luminaire</span></div></div>
   </div><div className="technical-requirements"><span>CRITÈRES DE LA SALLE DE CLASSE</span><strong>500 lux</strong><small>ÉCLAIREMENT MOYEN MINIMAL</small><strong>0,60</strong><small>UNIFORMITÉ MINIMALE</small><strong>UGR ≤ 19</strong><small>ÉBLOUISSEMENT À VÉRIFIER</small></div></div>
  </Chapter>
  <Chapter number={2} title="PREMIÈRE IMPLANTATION" icon={<Lightbulb size={22}/>}>
   <h4>Neuf luminaires en grille 3 × 3.</h4>
   <div className="bms-chapter-grid"><div className="bms-narrative"><p>J’ai placé neuf luminaires puis lancé le calcul et affiché les courbes ISOLUX. Le logiciel indique un éclairement moyen de <strong>545 lux</strong> et une uniformité de <strong>0,63</strong> : les critères retenus pour ces deux grandeurs sont respectés.</p>
    <p>La puissance installée est de <strong>261,9 W</strong>. L’éblouissement UGR doit encore être vérifié séparément, car il n’est pas renseigné dans le compte rendu.</p>
    <div className="technical-measure-highlight"><span>VARIANTE RETENUE</span><b>9 LUMINAIRES</b><p>545 lux · U₀ = 0,63 · 261,9 W</p></div>
   </div><Figure evidence={nine} onZoom={onZoom}/></div>
  </Chapter>
  <Chapter number={3} title="DEUXIÈME IMPLANTATION & COMPARAISON" icon={<Gauge size={22}/>}>
   <h4>Réduire la puissance sans perdre l’uniformité ?</h4>
   <div className="bms-chapter-grid"><div className="bms-narrative"><p>J’ai essayé huit luminaires en configuration 2 × 4. La puissance baisse de 261,9 W à <strong>232,8 W</strong>, soit environ <strong>11,1 %</strong> de moins. Cependant, l’uniformité calculée chute de <strong>0,63 à 0,34</strong>.</p>
    <p>Malgré une puissance plus faible, j’ai donc conservé les neuf luminaires pour cette salle. La réduction de la consommation ne justifie pas une implantation qui ne respecte plus le critère d’uniformité retenu.</p>
   </div><Figure evidence={eight} onZoom={onZoom}/></div>
   <div className="technical-result-table"><table><thead><tr><th>CRITÈRE</th><th>9 LUMINAIRES</th><th>8 LUMINAIRES</th></tr></thead><tbody>
    <tr><td>Éclairement moyen</td><td>545 lux</td><td>545 lux (valeur affichée)</td></tr>
    <tr><td>Uniformité</td><td>0,63</td><td>0,34</td></tr>
    <tr><td>Puissance installée</td><td>261,9 W</td><td>232,8 W</td></tr>
    <tr><td>Décision</td><td>Retenue pour la salle</td><td>Écartée : uniformité insuffisante</td></tr>
   </tbody></table></div>
  </Chapter>
  <Chapter number={4} title="ÉTUDE DU HALL" icon={<Lightbulb size={22}/>}>
   <div className="bms-chapter-grid"><div className="bms-narrative"><h4>Une implantation à reprendre.</h4>
    <p>J’ai modélisé le hall du bâtiment A, de 3 m de hauteur, avec 38 luminaires PHILIPS PowerBalance de 21 W. Le calcul donne un éclairement moyen de <strong>285 lux</strong> et une uniformité de <strong>0,23</strong>, insuffisante pour la répartition recherchée.</p>
    <p>Le dossier précise une incohérence entre la configuration pédagogique « salle de classe » utilisée pour le cas et le profil « Standard (bureau) » affiché par le calcul. Je dois corriger ce profil avant toute conclusion de conformité.</p>
    <div className="technical-analysis"><AlertCircle size={20}/><p>Profil d’utilisation à reprendre avant validation des résultats du hall. Les mesures sur site n’étaient pas encore renseignées dans le compte rendu.</p></div>
   </div><Figure evidence={hall} onZoom={onZoom}/></div>
  </Chapter>
  <Chapter number={5} title="BILAN ÉNERGÉTIQUE" icon={<ChartNoAxesCombined size={22}/>}>
   <div className="bms-chapter-grid"><div className="bms-narrative"><h4>Comparer la qualité d’éclairage à la consommation.</h4>
    <p>Le bilan DIALux du hall fournit une puissance totale de <strong>798 W</strong>, une consommation annuelle calculée de <strong>1 598 kWh/an</strong> et un indicateur LENI de <strong>5,04 kWh/m²/an</strong>.</p>
    <p>Ce bilan s’appuie sur les hypothèses d’occupation et de commande définies dans le logiciel. Il ne correspond pas à un relevé de consommation réelle.</p>
    <div className="bms-spec-grid"><div className="bms-spec"><strong>798 W</strong><span>puissance de calcul</span></div><div className="bms-spec"><strong>1 598</strong><span>kWh/an simulés</span></div></div>
   </div><Figure evidence={energy} onZoom={onZoom}/></div>
  </Chapter>
  <Chapter number={6} title="PRISE DE RECUL & DOCUMENTS" icon={<ShieldCheck size={22}/>}>
   <h4>Le résultat dépend autant du profil que des luminaires.</h4>
   <div className="bms-learning-grid">
    <div><span>CONCEVOIR</span><p>J’ai appris à construire plusieurs variantes et à justifier une implantation à partir de résultats calculés.</p></div>
    <div><span>VÉRIFIER</span><p>J’ai comparé l’éclairement moyen, l’uniformité et la puissance installée, sans me limiter au nombre de luminaires.</p></div>
    <div><span>ESPRIT CRITIQUE</span><p>J’ai identifié l’influence du profil d’utilisation, des hypothèses horaires et l’importance de mesures sur site.</p></div>
   </div>
   <p className="technical-intro">Pour la salle, neuf luminaires sont retenus parmi les deux variantes étudiées. Pour le hall, l’uniformité et le profil de calcul doivent encore être corrigés avant validation.</p>
   <SourceLink doc={p.docs?.[0]}/>
  </Chapter>
 </div>;
}
export default function AppliedTechnicalStudy({project,onZoom}){
 return project.id==='cem'?<CemStudy project={project} onZoom={onZoom}/>:<DialuxStudy project={project} onZoom={onZoom}/>;
}
