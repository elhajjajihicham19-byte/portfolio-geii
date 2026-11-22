/**
 * Intitulés publics lisibles : le nom réel des fichiers et leurs URL
 * sont conservés dans le manifeste technique mais ne sont jamais
 * affichés aux visiteurs du portfolio.
 */
export function documentDisplayName(filename='',project=''){
  const f=String(filename).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const subject=String(project).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  if(/telechargez|curriculum|\bcv\b/.test(f))return 'Curriculum vitæ';
  if(/referentiel|competences/.test(f))return 'Référentiel de formation';
  if(/soutenance|presentation/.test(f))return 'Présentation de soutenance';
  if(/rapport.?stage/.test(f)||(subject.includes('betem')&&/rapport/.test(f)))return 'Rapport de stage';
  if(/intervention/.test(f))return 'Fiche d’intervention';
  if(/mesure|\bfm\b/.test(f))return /fp4/.test(f)?'Fiche de mesures — fonction FP4':'Fiche de mesures';
  if(/recette|\bcdr\b/.test(f))return 'Cahier de recette';
  if(/adressage/.test(f))return 'Procédure d’adressage';
  if(/programmation/.test(f))return 'Procédure de programmation';
  if(/procedure|test/.test(f))return 'Procédure de test';
  if(/implantation/.test(f))return 'Plan d’implantation';
  if(/schema|\bschf\b|\bsch\b/.test(f))return 'Schéma électrique';
  if(/dofab|dossier.?fab/.test(f))return 'Dossier de fabrication';
  if(/\bfp[234]\b/.test(f))return 'Étude de la fonction '+f.match(/\bfp[234]\b/)?.[0].toUpperCase();
  if(/maquette/.test(f))return 'Dossier technique';
  if(/rapport|dossier/.test(f))return 'Rapport de projet';
  if(/dimensionnement/.test(f)||subject.includes('rs510'))return 'Étude de dimensionnement';
  return 'Document technique';
}
