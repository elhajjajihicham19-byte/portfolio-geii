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
 return <a className="technical-doc-link" href={doc.url} target="_blank" rel="noopener noreferrer"><FileText size={20}/><span>{doc.label}<small>SOURCE AUTHENTIQUE DU COMPTE RENDU</small></span><ArrowUpRight size={18}/></a>;
}
function Chapter({number,title,icon,children}){
 return <section className="bms-chapter">
  <div className="bms-chapter-index"><span>{String(number).padStart(2,'0')} / {title}</span>{icon}</div>{children}
 </section>;
}
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
  <Chapter number={4} title="SOLUTIONS DE FILTRAGE" icon={<Microscope size={22}/>}>
   <h4>Comparer l'inductance série, les filtres accordés et le PFC.</h4>
   <p className="technical-intro">J’ai commencé par ajouter une inductance de 10 mH à l’entrée. Elle s’oppose aux variations rapides du courant, réduit la hauteur des impulsions et en augmente la durée. Le compte rendu présente également un filtre passif accordé sur l’harmonique 3 (150 Hz), un correcteur actif de facteur de puissance et un compensateur actif.</p>
   <div className="technical-result-table"><table><thead><tr><th>GRANDEUR</th><th>SANS INDUCTANCE</th><th>AVEC 10 mH</th></tr></thead><tbody>
    <tr><td>Courant crête</td><td>≈ 14,6 A</td><td>≈ 7,5 A</td></tr>
    <tr><td>Durée des impulsions</td><td>≈ 2,2 ms</td><td>≈ 4,5 ms</td></tr>
    <tr><td>THD courant</td><td>≈ 139 %</td><td>≈ 81 %</td></tr>
    <tr><td>Facteur de puissance</td><td>≈ 0,58</td><td>≈ 0,74</td></tr>
   </tbody></table></div>
   <div className="technical-image-wide"><Figure evidence={filter} onZoom={onZoom}/></div>
  </Chapter>
  <Chapter number={5} title="RÉSULTATS ET ANALYSE CRITIQUE" icon={<Gauge size={22}/>}>
   <h4>Un meilleur courant réseau, avec des compromis.</h4>
   <p className="technical-intro">L’ajout de l’inductance a diminué le THD et amélioré le facteur de puissance. En contrepartie, la tension continue et la puissance transmise à la charge baissent, et l’inductance de filtrage reste encombrante. Le filtre accordé agit plus spécifiquement sur une fréquence donnée ; les solutions actives nécessitent une électronique de commande plus complexe.</p>
   <div className="technical-analysis"><AlertCircle size={22}/><p>Cette comparaison repose sur des simulations PSIM : une vérification réelle nécessiterait des mesures de THD, de facteur de puissance, de rendement et d’échauffement sur un montage physique. Les limites normatives dépendent aussi de la classe d'équipement et des conditions d'essai.</p></div>
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
   </div><Figure evidence={nine} onZoom={onZoom}/></div>
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
