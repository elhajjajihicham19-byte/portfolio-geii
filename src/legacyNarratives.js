/**
 * Synthèses éditoriales des dossiers universitaires provenant de Google Sites.
 * La voix "nous" décrit les opérations collectives documentées ; les faits
 * techniques et limites sont issus des sections récupérées dans Takeout.
 * Les transcriptions originales restent consultables dans chaque fiche.
 *
 * Ce fichier ne remplace pas les rapports de travaux ni leurs résultats.
 */
export const legacyNarratives = {
 'geii-capteur-de-temperature': {
  subtitle:'Capteur LM335 · conditionnement analogique · STM32 · écran LCD',
  chapters:[
   ['Mesurer une température de 0 à 50 °C','Nous avons défini le besoin d’un thermomètre numérique capable de mesurer une température et de l’afficher sur un écran LCD. Notre cahier des charges visait une plage de mesure de 0 à 50 °C.'],
   ['Du signal analogique à l’affichage numérique','Nous avons organisé la chaîne de mesure autour du capteur LM335, d’un étage analogique de soustraction et d’amplification, d’un convertisseur analogique-numérique et d’un microcontrôleur STM32 chargé de l’affichage.'],
   ['Concevoir et assembler la chaîne de mesure','Nous avons dimensionné les résistances et le gain, préparé le schéma électronique, programmé le traitement numérique, puis travaillé sur le routage de la carte. Les différentes fonctions ont été reliées de la mesure jusqu’à l’écran.'],
   ['Contrôler la cohérence température–tension','Nous avons relevé la tension du capteur et vérifié le conditionnement analogique. La précision finale dépend du calibrage, du gain choisi et du traitement numérique. Le dossier contient le rapport de projet et les essais réalisés.'],
   ['Comprendre les limites de précision','Le capteur et l’électronique peuvent introduire des écarts, amplifiés par le conditionnement ou la conversion. Une calibration plus systématique et des mesures à plusieurs points seraient les prolongements à privilégier.'],
   ['Retour sur les compétences développées','Ce projet m’a permis de relier électronique analogique et programmation embarquée, depuis le cahier des charges jusqu’à la vérification de la chaîne de mesure.']
  ]
 },
 'geii-cblage-domestique': {
  subtitle:'Garage et couloir · prises · éclairage · NF C 15-100',
  chapters:[
   ['Réaliser une installation domestique sûre','Nous avons travaillé sur une installation comprenant deux espaces : un garage et un couloir. Notre objectif était d’assurer le fonctionnement des prises et des éclairages en respectant les règles de câblage et de protection.'],
   ['Organiser les circuits et les commandes','Nous avons prévu un tableau avec protections électriques, des circuits de prises et d’éclairage, un va-et-vient et une commande par télérupteur. Les schémas ont guidé la répartition des circuits et le raccordement.'],
   ['Câbler les équipements et leurs protections','Nous avons réalisé les connexions et contrôlé la cohérence du câblage avec les schémas préparés. La sélection des sections et des dispositifs de protection a été étudiée selon le périmètre du projet.'],
   ['Vérifier à l’aide d’un cahier de recette','Nous avons établi des vérifications de continuité, d’absence de court-circuit et de fonctionnement des prises, lampes et commandes. Le cahier de recette permet de retrouver les étapes de contrôle.'],
   ['Rigueur, sécurité et maintenance','Le projet montre l’importance d’un câblage ordonné et d’une vérification avant mise sous tension. Une amélioration identifiée concerne la lisibilité et l’accessibilité du montage pour faciliter la maintenance.'],
   ['Retour sur les compétences développées','J’ai renforcé ma compréhension du cheminement des circuits, de la lecture des schémas et de la vérification fonctionnelle d’une installation.']
  ]
 },
 'geii-d-lectronique': {
  subtitle:'Logique numérique · compteur modulo 6 · afficheur 7 segments',
  chapters:[
   ['Afficher une valeur comprise entre 1 et 6','Nous avons conçu un dé électronique qui fige une valeur pseudo-aléatoire comprise entre 1 et 6 et l’affiche sur un module à sept segments.'],
   ['Compteur, horloge et décodage','Nous avons choisi un compteur modulo 6 commandé par une horloge. À l’arrêt du comptage, les sorties logiques sont adaptées pour piloter l’afficheur et représenter les six valeurs possibles.'],
   ['Réaliser la chaîne de commande et d’affichage','Nous avons étudié les niveaux logiques, les transitions du compteur et la correspondance entre ses sorties et les segments à allumer. Le dossier associe les choix de composants au fonctionnement attendu.'],
   ['Contrôler la logique et la stabilité','Nous avons préparé une fiche de mesures pour vérifier le déroulement du comptage, la cohérence des valeurs affichées et la stabilité de la commande.'],
   ['Analyser les limites de la solution','Le compteur modulo 6 simplifie la logique ; la qualité de l’affichage dépend également du décodage et de la stabilité du signal d’horloge. Le projet documente ces points de vérification.'],
   ['Retour sur les compétences développées','Cette réalisation m’a permis d’approfondir la logique séquentielle et l’importance de relier un schéma fonctionnel aux observations expérimentales.']
  ]
 },
 'geii-dimensionnement-lectrique': {
  subtitle:'Tableau résidentiel · protections différentielles · sections',
  chapters:[
   ['Préparer le schéma d’une habitation','Nous avons étudié les besoins d’une habitation pour proposer une installation basse tension cohérente avec les exigences de protection et de distribution.'],
   ['Organiser un tableau sur trois rangées','Nous avons réparti les circuits de prises, d’éclairage et d’équipements spécialisés autour d’un disjoncteur de branchement, d’interrupteurs différentiels 30 mA et de disjoncteurs divisionnaires.'],
   ['Dimensionner les circuits et choisir les protections','Nous avons identifié les usages, distingué les circuits dédiés, retenu les protections et vérifié les sections de conducteurs dans le cadre du dossier de conception.'],
   ['Contrôler la cohérence du schéma','Nous avons effectué une vérification documentaire des protections, de la séparation des circuits et des dispositions de sécurité. Une réserve a été identifiée concernant la section du conducteur de terre du parafoudre.'],
   ['Maintenir une réserve explicite sur la conformité','Le schéma a été jugé globalement cohérent dans l’étude initiale, mais des vérifications restent nécessaires, notamment sur le parafoudre et les contrôles sur installation réelle.'],
   ['Retour sur les compétences développées','Ce travail m’a appris à passer de besoins d’usage à une architecture de distribution, sans confondre étude de conception et certification d’une installation en service.']
  ]
 },
 'geii-malaxeur': {
  subtitle:'Automate · cycle PH0–PH7 · mesures PT100 · diagnostic',
  chapters:[
   ['Vérifier un cycle de malaxage automatisé','Nous avons étudié un malaxeur piloté par automate afin de contrôler ses fonctions de démarrage, de sécurité, de variation de vitesse et de positionnement de la pale.'],
   ['Comprendre la séquence et la chaîne de mesure','Le cycle comprend montée en vitesse, temporisations, ralentissement et arrêt contrôlé. Nous avons également examiné la chaîne de mesure de température utilisant une sonde PT100.'],
   ['Élaborer un cahier de recette','Nous avons construit des essais pour les phases PH0 à PH7, les commandes, les rampes, l’arrêt et les sécurités. Chaque fonction a été associée à une mesure et à un critère de vérification.'],
   ['Mesurer les performances et les écarts','Nous avons relevé un temps de cycle d’environ 36,7 s, des rampes d’environ 10 s à l’accélération et 5 s à la décélération, avec des écarts généralement faibles. Le dossier distingue les fonctions validées du contrôle de température resté défaillant.'],
   ['Diagnostiquer le conditionnement de la PT100','Nous avons observé une résistance voisine de 108 Ω à 21 °C et une tension nulle en sortie d’un conditionneur. La comparaison des mesures à 2 fils et à 4 fils a aussi montré l’influence du câblage sur la précision.'],
   ['Retour sur les compétences développées','J’ai renforcé ma méthode de vérification : construire une procédure, croiser mesures électriques et fonctionnement de l’automate, puis isoler les causes d’un défaut sans annoncer une validation globale excessive.']
  ]
 },
 'geii-moteur-dc-pilot-par-bus-can': {
  subtitle:'DRV8251A · pont en H · acquisition · communication CAN',
  chapters:[
   ['Piloter un moteur à courant continu via un bus CAN','Nous avons travaillé sur un prototype réunissant la commande en vitesse et en sens de rotation, la mesure de grandeurs électriques et la communication sur un bus CAN.'],
   ['Réunir puissance, mesure et communication','L’architecture comporte un pont en H DRV8251A, une chaîne de mesure du courant, un diviseur de mesure de tension, un transceiver CAN, un codeur incrémental et des fonctions de protection et de stockage des paramètres.'],
   ['Concevoir les fonctions électroniques','Nous avons réparti le système en fonctions FP, étudié les liaisons avec le microcontrôleur et préparé le dossier de fabrication du prototype.'],
   ['Mettre en place une procédure de test','Nous avons prévu les contrôles de continuité, de protection contre l’inversion de polarité, de fonctionnement des LED, de commande moteur, de limitation du courant et de communication CAN. Le dossier décrit cette procédure ; les mesures détaillées restent à consulter dans les pièces jointes.'],
   ['Vérifier les interfaces avant de conclure','La qualité du prototype dépend du fonctionnement conjoint de l’alimentation, de l’électronique de puissance, de l’acquisition et du réseau. La présence d’une procédure ne constitue pas à elle seule une validation de toutes les fonctions.'],
   ['Retour sur les compétences développées','Cette SAE m’a permis d’articuler plusieurs fonctions électroniques et de mesurer l’importance de vérifier les interfaces entre sous-ensembles.']
  ]
 },
 'geii-rs510': {
  subtitle:'Variateur RS510 · moteur triphasé · commande 0–10 V',
  chapters:[
   ['Dimensionner et contrôler une platine de variation','Nous avons étudié une installation industrielle équipée d’un variateur RS510 et d’un moteur triphasé, avec commandes et protections associées.'],
   ['Chaîne d’énergie et de commande','Nous avons identifié le variateur, le moteur, les disjoncteurs et les organes de commande. Le système permet de modifier la fréquence, la vitesse et le sens de rotation selon les consignes.'],
   ['Préparer le câblage et les essais','Nous avons étudié des conducteurs de 1 mm² en commande et de 2,5 mm² en puissance, puis préparé une procédure de contrôle avant mise sous tension.'],
   ['Contrôler les protections et la variation','Les essais consignés concernent la continuité, l’absence de court-circuit, les alimentations 230 V/24 V et la variation de fréquence de 0 à 50 Hz. Ils comprennent aussi des consignes prédéfinies de 5, 20 et 50 Hz.'],
   ['Respecter les paramètres et les sécurités','La mise en route dépend du paramétrage du variateur et de la vérification des circuits de commande, d’arrêt d’urgence et de protection. Un mauvais réglage peut provoquer un dysfonctionnement ou une surintensité.'],
   ['Retour sur les compétences développées','J’ai appris à considérer une platine comme une installation complète : protections, câblage, paramétrage et procédure d’essai doivent être cohérents.']
  ]
 },
 'geii-retrofit-maquette-knx': {
  subtitle:'KNX 29 V DC · ETS6 · adressage et programmation',
  chapters:[
   ['Remettre en service une maquette domotique KNX','Nous avons travaillé sur l’adressage, la programmation et la vérification de la communication entre les équipements d’une maquette KNX.'],
   ['Identifier les constituants du bus','La maquette comprend une alimentation de bus 29 V DC, une interface de communication USB-KNX, des actionneurs, des capteurs et des lignes sur paire torsadée.'],
   ['Adresser et programmer avec ETS6','Nous avons créé ou mis à jour le projet ETS6, ajouté les modules, attribué les adresses individuelles et téléchargé la configuration dans les équipements via l’interface KNX.'],
   ['Contrôler la communication','Nous avons prévu un scan de ligne, la détection des modules présents et le contrôle des adresses et de la connexion PC-bus. Les procédures d’adressage et de programmation figurent dans les documents d’origine.'],
   ['Croiser câblage et configuration logicielle','Un module absent du réseau peut provenir du câblage, de son alimentation, de son adresse ou de sa programmation. Nous avons donc abordé la vérification sous ces deux angles.'],
   ['Retour sur les compétences développées','Cette réalisation m’a familiarisé avec une architecture d’automatisation du bâtiment et avec la rigueur indispensable au diagnostic d’un réseau KNX.']
  ]
 },
 'geii-robot-suiveur-de-ligne': {
  subtitle:'Robot analogique · capteurs IR · LM324 · PWM',
  chapters:[
   ['Concevoir la commande d’un robot suiveur de ligne','Nous avons développé une commande analogique capable de détecter une ligne au sol et d’ajuster la vitesse des moteurs pour corriger la trajectoire.'],
   ['Détection optique et modulation analogique','Nous avons retenu des capteurs infrarouges, un montage à amplificateur opérationnel LM324, un générateur de signal triangulaire et une comparaison pour produire une commande PWM.'],
   ['Réaliser les fonctions FP2 à FP4','Nous avons distingué la génération du signal triangulaire (FP2), la comparaison (FP3) et l’interface de puissance (FP4). Une erreur initiale sur le montage intégrateur a été corrigée pendant la conception.'],
   ['Mesurer la génération de la PWM','Les essais ont porté sur le signal triangulaire, le PWM et la variation du moteur. La fréquence relevée est voisine de 967 Hz pour un objectif d’environ 1 kHz, selon la fiche de mesures.'],
   ['Analyser précision et robustesse','La commande analogique répond au principe visé, mais la précision de détection et la robustesse du suivi restent perfectibles. La correction de l’intégrateur montre l’intérêt de tester chaque fonction séparément.'],
   ['Retour sur les compétences développées','J’ai approfondi la génération de signaux, la comparaison analogique et la démarche qui consiste à vérifier des fonctions avant d’assembler le système complet.']
  ]
 },
 'geii-testeur-de-batterie': {
  subtitle:'Protection de polarité · seuil de tension · comparateur · LED',
  chapters:[
   ['Indiquer rapidement l’état d’une batterie','Nous avons conçu un testeur qui évalue la tension d’une batterie et fournit une indication visuelle de son état à l’aide d’une LED.'],
   ['Une chaîne fonctionnelle en cinq blocs','Nous avons défini la protection contre l’inversion de polarité (FP1), la référence de seuil (FP2), l’adaptation de tension (FP3), la comparaison (FP4) et l’affichage (FP5).'],
   ['Dimensionner et router la carte','Nous avons déterminé les valeurs de composants nécessaires, réalisé le schéma électrique, puis étudié l’implantation et le routage du PCB.'],
   ['Contrôler le seuil de déclenchement','Nous avons vérifié les tensions sur des points de test et le comportement de la LED au passage du seuil de décision. Le schéma fonctionnel original et les illustrations de la carte sont conservés comme preuves.'],
   ['Limiter les erreurs de diagnostic','La précision dépend des résistances et de la référence de tension ; la protection contre une inversion de polarité est essentielle pour éviter les erreurs de manipulation.'],
   ['Retour sur les compétences développées','Ce projet m’a permis de relier une mesure analogique à une décision simple, tout en tenant compte de la sécurité et de la précision des seuils.']
  ]
 },
};
