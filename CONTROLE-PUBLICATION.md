# Contrôle avant publication — Portfolio GEII / EME

État du dossier au **22 novembre 2026**. Le site est toujours développé sur
`migration-google-takeout-2026` ; **ne pas fusionner vers `main` ni mettre en ligne avant les essais visuels**.

## Contrôles techniques réalisés

- [x] Retour du noyau énergétique abstrait d'origine, sans les électrons orbitaux
- [x] Quatorze projets universitaires, stage BETEM séparé
- [x] Galerie des projets, preuves authentiques et sommaires des études intégrés
- [x] Documents, figures BMS/CEM et ressources GEII inclus dans le dépôt
- [x] Chemins internes / ancres / images vérifiés par `npm run audit`
- [x] Compilation de production `npm run build` vérifiée dans GitHub Actions
- [x] Fermeture avec Échap et confinement du focus dans les fenêtres de dossier et de zoom
- [x] Retour au bouton précédent après fermeture ; arrière-plan inerte durant l'étude
- [x] WebGL en pause lorsque l'accueil est invisible ou lorsqu'une étude est ouverte
- [x] Respect du réglage système « Réduire les animations »
- [x] Métadonnées descriptives et Open Graph de base, polices préconnectées
- [x] Les droits sur les extraits BETEM affichés ont été indiqués comme validés pour diffusion par le propriétaire du portfolio

## Essais manuels à réaliser avant publication

Les contrôles statiques **ne prouvent pas** que le rendu navigateur est parfait.

### Résolutions et navigateurs

- [ ] Chrome / Edge : **1366 × 768** (ordinateur portable)
- [ ] Chrome / Edge : **1920 × 1080** (bureau)
- [ ] Chrome / Edge : **2560 × 1440** ou ultralarge
- [ ] Vérifier que les textes de la page d'accueil ne croisent pas le noyau 3D, le menu et les raccourcis
- [ ] Vérifier les photos verticales, légendes, courbes et tableaux en mode plein écran
- [ ] Tester l'option système « Réduire les animations »

### Parcours de navigation à essayer

- [ ] Depuis l'accueil, accéder aux projets via « Découvrir mon travail »
- [ ] Ouvrir la liste déroulante, choisir **BMS**, puis **projet CAN**, puis **PV**
- [ ] Vérifier la miniature et la transition à chaque changement de fiche
- [ ] Ouvrir une étude, passer en **Plein écran** et revenir en **Classique**
- [ ] Naviguer avec le sommaire dans les chapitres d'une étude BMS, PV et BETEM
- [ ] Agrandir une figure, fermer avec **Échap**, puis revenir à l'étude et au portfolio
- [ ] Essayer la navigation au clavier **Tab / Maj+Tab** : le focus ne doit pas quitter le dialogue ouvert
- [ ] Tester la navigation latérale, les ancres, et le rail de progression électrique
- [ ] Vérifier l'absence de message d'erreur dans la console du navigateur

### Accès publics et exactitude des documents

- [ ] Ouvrir le CV Google Drive **en navigation privée**, sans compte connecté
- [ ] Ouvrir le profil LinkedIn depuis un autre navigateur
- [ ] Ouvrir les documents PDF et DOCX en téléchargement
- [ ] Vérifier les éventuelles autres pièces Drive et leurs règles de partage
- [ ] Relire les données techniques, notamment les mentions « simulé », « estimé », « non validé »
- [ ] Revoir les compétences « Installer » et « Maintenir », dont les preuves sont à développer
- [ ] Vérifier que l'adresse e-mail et le numéro de téléphone affichés peuvent être rendus publics

## Préparer l'hébergement

- [ ] Choisir une plateforme et un domaine / une URL définitive
- [ ] Confirmer une publication **à la racine** de l'hébergement, ou adapter les chemins absolus `/assets/...`, `/documents/...` et la configuration `base` de Vite si sous-chemin
- [ ] Ajouter une URL canonique et `og:url` lorsque le domaine est fixé
- [ ] Vérifier l'aperçu lors du partage d'un lien après déploiement
- [ ] Déployer la branche validée sur l'hébergement choisi
- [ ] Exécuter de nouveau tous les tests avec l'URL publique

## Commandes de validation (PowerShell)

```powershell
git status
git switch migration-google-takeout-2026
git pull origin migration-google-takeout-2026
npm.cmd install
npm.cmd run audit
npm.cmd run build
npm.cmd run preview
```

Ne pas lancer `git pull` en écrasant un travail local non enregistré : vérifier d'abord `git status`.
Ne pas fusionner la PR ni déployer automatiquement sans revue finale.
