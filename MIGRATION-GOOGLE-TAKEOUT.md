# Migration Google Takeout — portfolio GEII

Cette branche préserve la version actuelle du portfolio et ajoute une rubrique **Archives** fondée sur l'ancien Google Sites. Le composant React peut afficher toutes les pages, textes, photographies et références Google Drive originaux.

## Import des fichiers d'origine (une seule fois)

L'archive Google Takeout reste sur l'ordinateur de l'étudiant : elle n'est pas envoyée dans son intégralité sur GitHub. Seuls les textes des pages publiées et les photographies utiles seront ajoutés au dépôt privé.

Ouvrir **PowerShell**, puis aller dans le dossier local du projet :

```powershell
cd "$HOME\Downloads\portfolio-geii-v2-complet\portfolio-geii-v2"
git fetch origin
git switch migration-google-takeout-2026
npm.cmd install
npm.cmd run import:takeout
```

Le script cherche automatiquement le dernier fichier `takeout-*.zip` dans **Téléchargements**. Si le fichier n'est pas dans ce dossier, préciser son emplacement :

```powershell
npm.cmd run import:takeout -- "C:\chemin\vers\takeout-20261122T122059Z-1-001.zip"
```

Le script génère :
- `src/ancienPortfolio.json` : sections, paragraphes, listes et liens d'origine de **20 pages publiées** ;
- `public/legacy/*.webp` : les **photographies originales**, dédupliquées et optimisées (avec une limite à 2 100 pixels).

À la fin du script, vérifier le résultat avec :

```powershell
npm.cmd run dev
```

Ouvrir l'URL indiquée, puis vérifier l'onglet **ARCHIVES** et le projet **BMS**. Pour enregistrer ensuite les fichiers du résultat dans cette même branche :

```powershell
git add src/ancienPortfolio.json public/legacy
git commit -m "Importer les pages et images de mon ancien Google Sites"
git push -u origin migration-google-takeout-2026
```

La pull request de migration peut alors être relue avant intégration dans `main`.

## Points à vérifier avant diffusion

- **Photographies BETEM et plans techniques :** demander l'autorisation de publication à l'entreprise avant de rendre le site accessible publiquement.
- **BMS :** ne pas reprendre comme preuve d'une validation réussie les phrases de l'ancien site ; le nouveau diagnostic documente le défaut de mesure du shunt et la sortie à 0 V.
- **27 liens de documents Google Drive :** les références originales sont préservées, mais les fichiers PDF/Word ne se trouvent pas dans l'export de Google Sites. Vérifier leurs permissions ou ajouter les originaux séparément.
- **CV/LinkedIn :** URLs historiques retrouvées, validité et contenu à confirmer.
- **Nouvelles données BUT3 :** conserver la chronologie : la présentation du BUT2 correspond à la période d'origine ; la version actuelle affiche la progression en BUT3.

## Garantie de traçabilité

Les textes de l'ancienne version sont importés tels quels dans une rubrique d'archives consultables. Les commentaires du nouveau portfolio peuvent ensuite les expliquer ou corriger sans écraser le texte original. L'objectif final est de migrer les informations, sans confondre résultats démontrés, projets prévus et projets effectivement réalisés.
