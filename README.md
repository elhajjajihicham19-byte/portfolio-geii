# Portfolio GEII / EME — version interactive ordinateur

Portfolio de compétences BUT3 Génie Électrique et Informatique Industrielle, parcours **Électricité et Maîtrise de l’Énergie**. Application React + Vite + Three.js + GSAP + Lenis, avec études techniques authentiques.

## Version de référence

- Dépôt GitHub : `elhajjajihicham19-byte/portfolio-geii`
- Branche de travail : **`migration-google-takeout-2026`**
- PR en brouillon : https://github.com/elhajjajihicham19-byte/portfolio-geii/pull/1
- Branche `main` conservée séparément jusqu'à décision de publication.

**Ne pas repartir d'un ancien ZIP** : utiliser la version actuelle de la branche GitHub.

## Exécution Windows (PowerShell)

Depuis le dossier où se trouve `package.json` :

```powershell
git status
git switch migration-google-takeout-2026
git pull origin migration-google-takeout-2026
npm.cmd install
npm.cmd run audit
npm.cmd run dev
```

Ouvrir l'adresse Vite indiquée, généralement `http://localhost:5173/`. Avant `git pull`, vérifier `git status` si des modifications locales ont été faites sous VS Code.

Pour prévisualiser **la version compilée** :

```powershell
npm.cmd run build
npm.cmd run preview
```

`npm.cmd run audit` contrôle la structure de l'ancien portfolio, les documents, la présence et l'intégrité des images, les références internes, les ancres, l'accessibilité de base et les métadonnées. GitHub Actions exécute aussi ces contrôles.

## Structure

- Accueil avec **noyau énergétique abstrait** WebGL, links CV/LinkedIn et orientation professionnelle.
- Profil, formation, quatre compétences BUT GEII EME.
- **14 projets universitaires**, tutorés en premier puis SAE et réalisations pratiques, du BUT3 au BUT1 ; un dossier visible à la fois et un sélecteur illustré.
- Dossiers avec figures techniques, sommaire latéral et consultation classique ou plein écran.
- Stage **BETEM** uniquement dans l'expérience professionnelle.
- Documents, preuves, contact.

## Données et précautions

- **BMS 4S** : figures KiCad et photos du prototype authentiques ; les essais de charge/décharge ne sont **pas validés**.
- **Photovoltaïque** : seule la configuration **6 kWc sans batterie** est simulée et chiffrée sous SMA Sunny Design (9 711 kWh/an). Les variantes 3 kWc, trois pans et batterie restent à comparer. Les courbes sont reconstruites à partir du rapport.
- **CEM / DIALux** : extraits authentiques et rapports disponibles.
- **BETEM** : les extraits CFO/CFA présentés ont été indiqués par le propriétaire du portfolio comme validés par BETEM pour diffusion. Veiller à ne pas élargir ce périmètre sans nouvelle validation.
- Autres projets GEII : photos d'origine et figures de dossiers dans `public/legacy` et `public/assets/studies`.

## Repères techniques

- `src/main.jsx` : application et noyau énergétique.
- `src/StudyContents.jsx` et `src/StudyHighlights.jsx` : sommaire et preuves des études.
- `src/CircuitInteractions.jsx` et `src/ElectricAmbient.jsx` : progression et effets électriques.
- `src/PvCaseStudy.jsx`, `src/PvSunnyResults.jsx`, `src/BmsCaseStudy.jsx` : études détaillées.
- `src/legacyProjects.js`, `src/projectTechnicalEvidence.json` : dossiers historiques.
- `scripts/verify_portfolio.mjs`, `scripts/audit_site.mjs` : audits automatisés.
- `public/assets`, `public/legacy`, `public/documents` : ressources du site.

Les animations 3D sont suspendues hors écran et lorsque le dossier est ouvert. L'option système de mouvement réduit est prise en compte.

## Préparer la publication

Consulter [CONTROLE-PUBLICATION.md](CONTROLE-PUBLICATION.md). La compilation et l'audit statique **ne remplacent pas un test réel dans Chrome/Edge**, notamment à 1366 × 768, 1920 × 1080 et 2560 × 1440. Vérifier aussi CV et LinkedIn en navigation privée, pour confirmer les autorisations d'accès.

Le domaine et la plateforme d'hébergement **ne sont pas encore fixés**. Les URL locales commencent par `/assets/` et `/documents/` : elles supposent une publication à la racine du domaine. Un déploiement sous un sous-chemin nécessite une adaptation préalable. Les métadonnées spécifiques au domaine (canonical, og:url et aperçu social illustré) seront ajoutées une fois l'adresse finale choisie.
