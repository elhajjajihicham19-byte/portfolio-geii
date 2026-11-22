# Portfolio GEII / EME — version enrichie (desktop)

Portfolio React + Vite + Three.js + GSAP + Lenis, adapté aux consignes du cahier des charges **BUT23 FA – 2026–2027** (partie Portfolio BUT3, pages 4 et 8).

## Démarrer sur Windows (PowerShell)

1. Décompresser le ZIP dans `Téléchargements`.
2. Ouvrir le dossier **portfolio-geii-v2** dans VS Code.
3. Ouvrir le terminal **dans ce dossier** (vérifier que `package.json` est présent avec `dir`).
4. Exécuter :

```powershell
npm.cmd install
npm.cmd run dev
```

5. Ouvrir l'URL indiquée par Vite, généralement `http://localhost:5173`.

**Important** : garder le terminal ouvert tant que vous consultez le portfolio. Si une ancienne version tourne déjà, faire `Ctrl + C` dans l'ancien terminal et lancer la nouvelle version, ou utiliser le port affiché par Vite.

## Sections de cette version

- Accueil avec cœur énergétique WebGL.
- Informations personnelles et projet professionnel.
- Ma formation : bac général → L1 informatique → BUT3 GEII EME → projet d'école d'ingénieurs.
- Quatre compétences du programme national EME : Concevoir, Vérifier, Maintenir et Installer, avec apprentissages critiques de BUT3, liens vers les preuves et autoévaluation.
- Cinq dossiers projet développés : BMS 4S, stage BETEM, photovoltaïque, CEM, DIALux.
- Expérience professionnelle et contact.
- Bibliothèque de documents consultables ou téléchargeables.

## Origine et statut des preuves

**Fichiers authentiques mis à disposition dans cette version :**

- `public/documents/TP-CEM-Hicham-El-Hajjaji.pdf` : compte rendu CEM de 34 pages de l'étudiant, utilisé pour des extraits de schémas et de courbes (`cem-*-reel.webp`).
- `public/documents/Compte-rendu-DIALux.docx` : compte rendu DIALux fourni précédemment, contenant les captures `dialux-reel-*.webp`. Attention, le document est une version de travail, avec des champs à compléter.
- `public/documents/Etude-photovoltaique-cadrage.docx` : document de cadrage de l'étude photovoltaïque ; résultats définitifs non établis.
- `public/assets/betem-plan-extrait-reel.webp` : extrait d'un plan de travail CFO/CFA de l'école Jean Macé à Sète, accessible dans les documents de projet déjà fournis. **Ne pas publier cet extrait sans confirmation des droits de diffusion par le maître de stage/entreprise et le client.** Le plan complet et le CCTP ne sont volontairement pas inclus.

**À compléter** : les images et schémas natifs KiCad du BMS (non récupérés), une photo originale du prototype, le CV réel et l'URL exacte LinkedIn. Le visuel de BMS est illustratif ; il est correctement étiqueté et **ne prétend pas être un schéma KiCad original**. Le visuel solaire est également illustratif.

## Sources de rédaction

- Ancien portfolio public Google Sites : page d'accueil, présentation de la formation GEII, BMS, contact.
- Cahier des charges `BUT23 FA - 26-27 - CdC Projets et PF - V2.pdf` : partie BUT3 / Portfolio et annexe 4.
- Référentiel officiel national BUT GEII, parcours EME, pages 22–29 du document ministère : https://www.enseignementsup-recherche.gouv.fr/sites/default/files/2023-12/g-nie-lectrique-et-informatique-industrielle-30834.pdf
- Documents techniques originaux cités ci-dessus et informations déjà échangées avec l'étudiant.

## Prudence avant publication

1. Relire les formulations qui décrivent votre rôle et le périmètre des interventions.
2. Confirmer les droits pour tout extrait de plan professionnel (vous pouvez supprimer `betem-plan-extrait-reel.webp` et son affichage pour une diffusion publique sans accord).
3. Mettre à jour les études en cours et les liens CV/LinkedIn avant la soutenance.
4. Tester sur un PC de bureau et vérifier les téléchargements.

## Technique

`src/main.jsx` : application et textes du portfolio.

`src/style.css` : thème visuel, grilles, cases studies et animations.

`public/assets/` : illustrations techniques réelles et visuels.

`public/documents/` : preuves téléchargeables.

La plateforme d'origine Google Sites n'a pas été modifiée. Le projet est à ouvrir et à héberger séparément.
