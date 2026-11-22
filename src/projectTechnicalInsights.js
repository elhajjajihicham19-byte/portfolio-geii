/**
 * Compléments techniques fondés sur les rapports, schémas et fiches de mesures.
 * Chaque entrée correspond à l'un des six chapitres du dossier.
 * Aucun essai non réalisé n'est transformé en résultat validé.
 */
export const projectTechnicalInsights = {
 'geii-capteur-de-temperature':[
  {chapter:1,title:'Chaîne d’acquisition et de traitement',text:'J’ai retenu un LM335, suivi d’un conditionnement à amplificateur LM324N, puis d’une carte STM32F303K8 et d’un afficheur LCD 16 × 2. L’adaptation analogique permet d’exploiter la variation du signal capteur avant conversion.',
   metrics:[['LM335','Capteur de température'],['LM324N','Conditionnement analogique'],['LCD 16 × 2','Affichage']]},
  {chapter:3,title:'Vérification de la mesure et de l’affichage',text:'Mon rapport décrit des essais sur la tension du capteur, le soustracteur et l’affichage LCD. Le bilan de projet mentionne une mesure fiable et un dispositif fonctionnel, mais ne présente pas une courbe d’étalonnage numérique complète permettant de quantifier l’erreur maximale sur toute la plage.',
   metrics:[['0–50 °C','Plage visée'],['3,3 / 5 V','Alimentation de la carte fille']],note:'Le résultat fonctionnel annoncé dans le rapport est conservé ; la précision finale ne peut pas être chiffrée sans tableau d’étalonnage complet.'}
 ],
 'geii-cblage-domestique':[
  {chapter:1,title:'Protections et commandes étudiées',text:'La maquette comporte deux espaces : garage avec tableau divisionnaire, deux prises et éclairages simple et va-et-vient ; couloir avec commande par télérupteur. Le cahier de recette du semestre 1 décrit les vérifications avant la mise sous tension.',
   metrics:[['C16','Circuit de prises'],['C10','Éclairage'],['40 A / 30 mA','Protection différentielle']]},
  {chapter:3,title:'Essais réalisés sur les deux maquettes',text:'J’ai vérifié la continuité hors tension, l’absence de court-circuit puis le fonctionnement des interrupteurs et du télérupteur. Les deux prises du garage délivraient 230 V lorsque le C16 était enclenché et 0 V lorsqu’il était ouvert. Le cahier de recette classe le fonctionnement des commandes comme conforme aux essais réalisés.',
   table:{columns:['Point vérifié','Résultat consigné'],rows:[['Disjoncteurs C16 et C10','Contrôles ON/OFF : OK'],['DDR 40 A / 30 mA','Contrôles consignés : OK'],['Prises du garage, C16 ON','230 V'],['Prises du garage, C16 OFF','0 V'],['Simple allumage, va-et-vient, télérupteur','Fonctionnement obtenu']]}}
 ],
 'geii-d-lectronique':[
  {chapter:1,title:'Comptage et mémorisation de l’état',text:'Mon dispositif utilise un CD4017 alimenté en 5 V. J’ai injecté à son horloge un signal carré d’environ 1 kHz et observé les sorties successives à l’oscilloscope.',
   metrics:[['5 V','Alimentation du CD4017'],['1 kHz','Horloge du test'],['Q0 à Q5','Six états exploités']]},
  {chapter:3,title:'Vérification de la fonction compteur',text:'La fiche de mesures du 5 novembre 2024 montre les oscillogrammes de Q0 à Q6. J’ai constaté l’activation successive d’une seule sortie parmi Q0 à Q5 et l’arrêt du comptage lorsque l’entrée Enable passe à 5 V.',
   table:{columns:['Condition','Observation'],rows:[['Horloge 1 kHz appliquée','Les sorties s’activent successivement'],['Q0 à Q5','Une sortie active à la fois'],['Enable = 5 V','Comptage arrêté']]}}
 ],
 'geii-dimensionnement-lectrique':[
  {chapter:1,title:'Organisation du tableau de distribution',text:'J’ai dessiné un schéma général et les folios détaillant les trois rangées du tableau. La répartition tient compte des circuits de prises, de chauffage, d’éclairage et des équipements spécialisés ; elle inclut des protections différentielles 30 mA.'},
  {chapter:2,title:'Exemples de départs dimensionnés',text:'Pour les usages identifiés dans mon dossier, j’ai associé la puissance de l’équipement à son calibre de protection et à la section du conducteur. Ces valeurs correspondent au projet étudié et doivent être vérifiées dans les conditions réelles de pose.',
   table:{columns:['Circuit du schéma','Protection','Section'],rows:[['Plaque de cuisson','32 A','6 mm²'],['Lave-vaisselle','20 A','2,5 mm²'],['Éclairage RDC','10 A','1,5 mm²'],['Chauffe-eau','20 A','2,5 mm²']]},note:'Le schéma général présente également le parafoudre et la terre ; les conditions de raccordement restent à confirmer avant validation d’installation.'}
 ],
 'geii-malaxeur':[
  {chapter:2,title:'Séquence automatisée et valeurs de consigne',text:'J’ai vérifié le cycle PH0 à PH7 : montée jusqu’à 20 Hz en 10 s, temporisation, ralentissement vers 10 Hz et arrêt progressif. Les défauts de sécurité accessibles ont été testés et le cycle repartait de son début après réarmement et nouvelle commande.',
   metrics:[['20 Hz / 10 s','Accélération de référence'],['10 Hz','Palier de décélération'],['PH0–PH7','Étapes de la séquence']]},
  {chapter:3,title:'Mesures de la sonde PT100',text:'J’ai comparé différents branchements pour mesurer l’influence de la résistance des conducteurs. Le montage quatre fils et le multimètre en mode température donnaient tous deux 21,7 °C ; la mesure deux fils avec connecteur atteignait 29,4 °C.',
   table:{columns:['Méthode','Résistance','Température'],rows:[['2 fils direct','109,5 Ω','24,3 °C'],['2 fils avec connecteur','111,5 Ω','29,4 °C'],['4 fils avec connecteur','108,5 Ω','21,7 °C'],['Multimètre, mode °C','—','21,7 °C']]},note:'La mesure quatre fils réduit l’influence de la résistance des fils sur la tension mesurée.'},
  {chapter:4,title:'Bilan du cahier de recette : validations et réserves',text:'Le cycle complet a duré 36,7 s pour une cible voisine de 35 s, soit un écart d’environ 4,8 %. La fonction de chauffe n’a pas pu être testée en raison d’un court-circuit signalé sur la machine. L’affichage indiquait 21,32 °C pour 21,18 °C dans la salle : le document le classe validé, malgré un écart de 0,14 °C supérieur à la cible annoncée de 0,01 °C.',
   table:{columns:['Fonction','Résultat'],rows:[['Cycle PH0–PH7','36,7 s ; consigne ≈ 35 s'],['Sécurités accessibles','Validées dans le cahier de recette'],['Affichage température','21,32 °C / référence 21,18 °C'],['Chauffage','Non testé : défaut sur résistances']]},note:'La mention « validé » du dossier pour l’affichage doit être nuancée au regard du critère de 0,01 °C.'}
 ],
 'geii-moteur-dc-pilot-par-bus-can':[
  {chapter:1,title:'Architecture du shield moteur CAN',text:'J’ai conçu un shield autour du pont en H DRV8251A et de la NUCLEO-F303RE. Les fonctions assurent la commande du moteur, la mesure du courant et de la tension, la limitation en courant, la gestion des LED et l’échange de messages sur CANH/CANL.',
   metrics:[['DRV8251A','Pont de puissance'],['NUCLEO-F303RE','Microcontrôleur'],['CANH / CANL','Communication différentielle']]},
  {chapter:3,title:'Contrôles électriques et fonctionnels réalisés',text:'J’ai rédigé une procédure puis effectué les essais consignés sur la carte de l’enseignant Jean-Roch Vaille, comme précisé en page 1 du rapport de test (révision 4 du 05/12/2025). Les vérifications de continuité (sorties moteur, alimentation, broches du microcontrôleur), la protection contre l’inversion de polarité et plusieurs comportements des LED sont notés PASS. Le sens moteur, le test sous charge et les trames CAN font également l’objet d’observations enregistrées.',
   table:{columns:['Essai consigné','Mesure / observation','Statut du rapport'],rows:[
    ['Continuité (pages 2–4)','Aucun court-circuit détecté','PASS'],
    ['Inversion de polarité FP4 (p. 5)','Absence de tension relevée','PASS'],
    ['LED veille / activité (p. 8–10)','Clignotements lent, rapide et flash observés','PASS'],
    ['Sens du moteur / LED D3 (p. 11)','Changement de couleur selon la commande','PASS'],
    ['Commande à 100 % (p. 12)','10 V / 100 Ω → I = 0,10 A mesuré','PASS'],
    ['Communication CAN (p. 15)','Trames obtenues annoncées correspondantes','PASS']
   ]},
   note:'Ces essais ont été réalisés sur la carte de l’enseignant ; ils ne suffisent pas à certifier le fonctionnement de mon propre PCB. La page CAN comporte aussi une mention résiduelle indiquant que des mesures seront réalisées à réception de la carte.'},
  {chapter:3,title:'Comparer les seuils théoriques aux mesures obtenues',text:'La procédure montre plusieurs résultats présentés comme réussis malgré un écart avec leur critère numérique. Pour la mesure de VMOT = 10 V, la sortie VADC0 vaut 1,869 V contre 2,00 V attendus ±2 %. L’essai de limitation à 100 mA donne 80 mA ; la consigne enregistrée à 200 mA conduit à 190 mA. J’ai donc distingué le statut inscrit sur la fiche du respect réel des tolérances.',
   table:{columns:['Fonction','Cible indiquée','Valeur relevée','Lecture technique'],rows:[
    ['FP5 — acquisition (p. 6)','2,00 V ±2 % (1,96–2,04 V)','1,869 V','Écart −6,55 % ; hors tolérance'],
    ['FP1/FP3 — moteur (p. 12)','0,10 A ±2 %','0,10 A','Cible atteinte'],
    ['FP2 — limitation (p. 13)','100 mA ±2 %','80 mA','Écart −20 % ; hors tolérance'],
    ['FP7 — sauvegarde (p. 14)','200 mA ±2 %','190 mA','Écart −5 % ; hors tolérance']
   ]},
   note:'La fiche mentionne PASS pour FP5, FP2 et FP7, même si les valeurs chiffrées ne respectent pas les critères annoncés. La synthèse de la page 16 ne coche pas FP7. Ces écarts méritent une vérification instrumentale avant conclusion globale.'},
  {chapter:4,title:'Interpréter le signal CAN et les limites des essais',text:'J’ai vérifié le principe d’une trame CAN différentielle : état dominant avec une différence CANH−CANL voisine de 2 V et état récessif proche de 0 V. Le protocole propose notamment un exemple à 125 kbit/s et indique que les trames obtenues correspondaient aux trames attendues. Néanmoins, le document ne contient pas de décodage complet mesuré ni de capture probante pour tous les champs.',
   metrics:[['≈ 2 V','CAN dominant attendu'],['≈ 0 V','CAN récessif attendu'],['125 kbit/s','Débit de l’exemple']] ,
   note:'La conclusion CAN est rapportée comme telle dans la procédure ; une validation complète sur mon prototype nécessiterait une acquisition des trames et la traçabilité du banc d’essai.'}
 ],
 'geii-rs510':[
  {chapter:1,title:'Bornier de commande du variateur',text:'J’ai identifié les entrées logiques S1 à S5, la sortie 24 V de commande, le relais RA/RB et l’entrée analogique AVI. Le potentiomètre alimenté en 10 V permet d’ajuster la consigne de fréquence, tandis que les sélecteurs commandent le sens et les vitesses prédéfinies.'},
  {chapter:2,title:'Sections et choix de commande',text:'J’ai étudié le dimensionnement du circuit de puissance en 2,5 mm² et de la commande en 1 mm². Le dossier traite de la protection des personnes, de la chute de tension et des contraintes de pose.',
   table:{columns:['Sous-ensemble','Choix étudié'],rows:[['Câblage puissance','2,5 mm²'],['Câblage commande','1 mm²'],['Consigne de vitesse analogique','0–10 V vers AVI'],['Sélection numérique','S1 à S5, sélecteurs K1/K2']]},
   note:'Le document de dimensionnement retient une puissance moteur de 700 W, une tension 230 V, un rendement de 0,8 et un cos φ de 0,8 comme hypothèses de travail.'},
  {chapter:3,title:'Contrôles électriques et fonctionnels',text:'Le dossier prévoit la vérification de l’arrêt d’urgence, de l’auto-maintien du contacteur et des alimentations de commande. La variation de 0 à 50 Hz et les sélections de 5, 20 et 50 Hz font partie des fonctions de la platine étudiées. Les essais doivent être distingués des simples consignes paramétrées.',
   metrics:[['0–50 Hz','Plage étudiée'],['5 / 20 / 50 Hz','Consignes prédéfinies'],['230 / 24 V','Circuits d’alimentation']]},
 ],
 'geii-retrofit-maquette-knx':[
  {chapter:1,title:'Communication et alimentations',text:'J’ai distingué l’alimentation du bus KNX TP et la distribution 230 V des actionneurs. Mon maquette intègre une interface de programmation, des capteurs, des modules de commande et un coupleur de ligne.',
   metrics:[['29 V DC','Alimentation du bus'],['KNX TP','Paire torsadée'],['ETS6','Logiciel de configuration']]},
  {chapter:2,title:'Lecture des folios de câblage',text:'J’ai associé les équipements de tableau aux modules d’ambiance, en différenciant les lignes principales et secondaires. Les folios indiquent notamment les actionneurs de variation, la passerelle DALI et les éléments de commande.'},
  {chapter:3,title:'Adressage et scan de ligne ETS6',text:'J’ai attribué l’adresse individuelle 1.1.8 au variateur universel après téléchargement et appui sur son bouton de programmation. La procédure de diagnostic consigne un scan de ligne réussi, avec affichage des adresses présentes sur le bus.',
   table:{columns:['Vérification','Résultat consigné'],rows:[['Variateur universel','Adresse 1.1.8'],['Interface de programmation','Adresse 1.1.255 dans la procédure'],['Scan ETS6','Adresses des équipements visibles']]},note:'L’adresse 1.1.255 affichée pour l’interface est à distinguer de l’adresse 1.1.8 attribuée au variateur.'}
 ],
 'geii-robot-suiveur-de-ligne':[
  {chapter:1,title:'Traitement du signal de détection',text:'Le système utilise les capteurs infrarouges puis une chaîne analogique pour comparer la position de la ligne et ajuster le rapport cyclique appliqué aux moteurs. Les fonctions FP2, FP3 et FP4 ont été étudiées séparément.'},
  {chapter:2,title:'Génération du signal triangulaire',text:'J’ai construit un générateur à amplificateur LM324. Le cahier des charges prévoyait un signal triangulaire de 3 à 9 V à environ 1 kHz, utilisé ensuite pour produire une PWM par comparaison avec le signal du capteur.',
   metrics:[['3–9 V','Plage visée'],['1 kHz','Fréquence cible'],['LM324','Générateur/comparateur']]},
  {chapter:3,title:'Essais FP2, FP3 et FP4',text:'La fiche de mesures indique une fréquence du signal triangulaire voisine de 967 Hz. J’ai analysé la commande PWM et l’interface de puissance qui fait varier la vitesse du moteur. Un défaut de câblage de l’intégrateur avait nécessité une correction avant l’assemblage.',
   table:{columns:['Fonction','Élément vérifié'],rows:[['FP2 — Générer triangle','≈ 967 Hz mesurés pour 1 kHz visé'],['FP3 — Comparer','Rapport cyclique suivant Vcap'],['FP4 — Commander moteur','Variation de vitesse selon le PWM']]}}
 ],
 'geii-testeur-de-batterie':[
  {chapter:1,title:'Architecture en cinq fonctions',text:'J’ai séparé la protection contre l’inversion de polarité, la génération d’une référence, l’adaptation de la tension, la comparaison et l’affichage. Le schéma source permet d’identifier le rôle de chaque fonction sans supposer de valeurs de seuil qui ne sont pas documentées.',
   table:{columns:['Fonction','Rôle'],rows:[['FP1','Protéger contre l’inversion de polarité'],['FP2','Générer un seuil de tension'],['FP3','Adapter et régler le signal'],['FP4','Comparer la mesure au seuil'],['FP5','Afficher l’état de la batterie']]}},
  {chapter:3,title:'État des preuves expérimentales',text:'Le document disponible contient la chaîne fonctionnelle et les connexions de conception. Il ne fournit pas de tableau de mesures permettant de vérifier la valeur exacte du seuil ni sa dispersion.',
   note:'La fonctionnalité finale du testeur n’est pas déclarée validée sur la seule base du schéma électrique.'}
 ]
};
