#!/usr/bin/env node
/**
 * Import local Google Takeout into the React portfolio.
 * The archive stays on the owner's computer. Extract only images referenced by
 * the published pages and keep the original text and Drive URLs.
 *
 * Usage: npm run import:takeout -- "C:\\Users\\<you>\\Downloads\\takeout-....zip"
 *        npm run import:takeout
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import AdmZip from 'adm-zip';
import { load } from 'cheerio';
import sharp from 'sharp';

const PREFIX='Takeout/Drive/Export Portfolio/Portfolio/PUBLISHED/';
const DEST=path.resolve('public','legacy');
const OUTPUT=path.resolve('src','ancienPortfolio.json');
const names={
 'Accueil':'Accueil', 'D lectronique':'Dé électronique',
 'Contacts':'Contacts','Moteur DC pilot par bus CAN':'Moteur DC piloté par bus CAN',
 'Concevoir_':'Concevoir','BMS':'Battery Management System (BMS)',
 'Maintenir':'Maintenir','Capteur de Temperature':'Capteur de température',
 'RS510':'Variateur RS510','Retrofit maquette KNX':'Rétrofit maquette KNX',
 'Stage chez BETEM':'Stage chez BETEM','Testeur de batterie':'Testeur de batterie',
 'Cblage domestique':'Câblage domestique','Dimensionnement lectrique':'Dimensionnement électrique',
 'Prsentation':'Présentation personnelle','Vrifier':'Vérifier',
 'Mes comptences':'Mes compétences','Installer':'Installer',
 'Robot Suiveur de ligne':'Robot suiveur de ligne','Malaxeur':'Malaxeur'
};
const projects=new Set(['BMS','D lectronique','Moteur DC pilot par bus CAN','Capteur de Temperature',
 'RS510','Retrofit maquette KNX','Stage chez BETEM','Testeur de batterie',
 'Cblage domestique','Dimensionnement lectrique','Robot Suiveur de ligne','Malaxeur']);
const skills=new Set(['Concevoir_','Vrifier','Maintenir','Installer','Mes comptences']);
const tidy=(s)=>String(s||'').replace(/\s+/g,' ').trim();
const hash=(buffer)=>crypto.createHash('sha256').update(buffer).digest('hex');
const slug=(s)=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
const dec=(s)=>{try{return decodeURIComponent(s)}catch{return s}};
const stripRedirect=(h)=>{
  if(!h)return '';
  if(h.startsWith('https://www.google.com/url?')||h.startsWith('http://www.google.com/url?')){
    try{return new URL(h).searchParams.get('q')||h}catch{return h}
  }
  return h;
};
function chooseArchive(){
  if(process.argv[2])return path.resolve(process.argv[2]);
  const dirs=[path.join(os.homedir(),'Downloads'),process.cwd()];
  const matches=dirs.flatMap(dir=>{
    try{return fs.readdirSync(dir).filter(n=>/^takeout-.*\.zip$/i.test(n))
      .map(n=>path.join(dir,n))}catch{return []}
  });
  return matches.sort((a,b)=>fs.statSync(b).mtimeMs-fs.statSync(a).mtimeMs)[0];
}
const archivePath=chooseArchive();
if(!archivePath||!fs.existsSync(archivePath)){
  console.error('Archive introuvable. Exécute : npm run import:takeout -- "CHEMIN_DU_ZIP_TAKEOUT"');
  process.exit(1);
}
const zip=new AdmZip(archivePath);
const files=new Map(zip.getEntries().filter(e=>!e.isDirectory).map(e=>[e.entryName,e]));
const pages=[...files.keys()].filter(n=>n.startsWith(PREFIX)&&n.endsWith('.html')).sort();
if(pages.length<1)throw new Error('Aucune page Google Sites exportée dans '+PREFIX);
console.log('Source : '+archivePath+' / '+pages.length+' pages publiées');
function imageInfo(src){
  if(!src||src.startsWith('http')||src.startsWith('//'))return null;
  const zipPath=PREFIX+dec(src);
  const entry=files.get(zipPath);
  if(!entry||!zipPath.toLowerCase().endsWith('.jpg'))return null;
  const bytes=entry.getData();
  return {hash:hash(bytes),bytes,zipPath};
}
const images=new Map(),imageCounts=new Map();
for(const file of pages){
  const $=load(files.get(file).getData().toString('utf8'));
  $('img').each((i,el)=>{
    const img=imageInfo($(el).attr('src'));
    if(!img)return;
    images.set(img.hash,img.bytes);
    imageCounts.set(img.hash,(imageCounts.get(img.hash)||0)+1);
  });
}
fs.mkdirSync(DEST,{recursive:true});
const manifest=[];
for(const file of pages){
  const stem=path.basename(file,'.html');
  const title=names[stem]||stem;
  const $=load(files.get(file).getData().toString('utf8'));
  const sections=[];
  const preface=[];
  let chapter=null;
  let pageTitleSeen=false;
  let stop=false;
  const containers=$('div.tyJCtd').toArray();
  for(const div of containers){
    if(stop)break;
    $(div).find('h1,h2,h3,h4,p,li').each((_,node)=>{
      if(stop)return false;
      // A nested .tyJCtd has its own turn in containers.
      if($(node).parents('.tyJCtd').first().get(0)!==div)return;
      if(node.tagName==='p'&&$(node).parents('li').length>0)return;
      const value=tidy($(node).text());
      if(!value)return;
      if(/^h[1-4]$/.test(node.tagName)){
        if(value.toLowerCase()==='contacts'&&stem!=='Contacts'){stop=true;return false;}
        if(!pageTitleSeen&&node.tagName==='h1'){pageTitleSeen=true;return;}
        chapter={titre:value,blocs:[]};
        sections.push(chapter);
      }else{
        if(node.tagName==='p'&&['Linkedin','Concevoir','Vérifier','Installer','Maintenir','Compétences'].includes(value))return;
        const block={type:node.tagName==='li'?'puce':'texte',texte:value};
        (chapter?.blocs||preface).push(block);
      }
    });
  }
  if(preface.length)sections.unshift({titre:'Introduction',blocs:preface});
  const seenHashes=new Set();
  const pageImages=[];
  $('img').each((_,node)=>{
    const ref=dec($(node).attr('src'));
    const info=imageInfo(ref);
    if(!info||seenHashes.has(info.hash))return;
    seenHashes.add(info.hash);
    // Footer and common logos appear on almost every page.
    if((imageCounts.get(info.hash)||0)>=15)return;
    pageImages.push({src:'/legacy/legacy-'+info.hash.slice(0,14)+'.webp',
      legende:'Illustration issue de la page '+title,authentique:true,reference:ref,
      partagee:(imageCounts.get(info.hash)||0)>=4});
  });
  const documents=[],seenDocs=new Set();
  $('iframe').each((_,node)=>{
    const src=$(node).attr('src')||'';
    if(!src.includes('drive.google.com/file/d/'))return;
    const url=src.replace('/preview','/view');
    if(seenDocs.has(url))return;
    seenDocs.add(url);
    documents.push({titre:($(node).attr('aria-label')||'Document').replace(/^Drive,\s*/,''),url,
      statut:'Lien Google Drive original — accès à vérifier'});
  });
  $('a').each((_,node)=>{
    const url=stripRedirect($(node).attr('href')||'');
    if(!url.includes('drive.google.com/file/d/')||seenDocs.has(url))return;
    seenDocs.add(url);
    documents.push({titre:tidy($(node).text())||'Document Drive',url,
      statut:'Lien Google Drive original — accès à vérifier'});
  });
  const links=[],seenLinks=new Set();
  $('a').each((_,node)=>{
    const url=stripRedirect($(node).attr('href')||'');
    if(!url.startsWith('http')||seenLinks.has(url))return;
    if(!url.includes('linkedin.com/in/')&&!url.includes('outlook.office.com/mail/deeplink'))return;
    seenLinks.add(url);links.push({titre:tidy($(node).text())||(url.includes('linkedin')?'Profil LinkedIn':'Contact'),url});
  });
  manifest.push({
    id:slug(stem),source:stem+'.html',titre:title,
    type:projects.has(stem)?'projet':skills.has(stem)?'competence':stem==='Prsentation'?'profil':'general',
    sections,images:pageImages,documents,liens:links
  });
}
let written=0;
for(const [id,buffer] of images){
  if((imageCounts.get(id)||0)>=15)continue;
  const file=path.join(DEST,'legacy-'+id.slice(0,14)+'.webp');
  await sharp(buffer).rotate().resize(2100,2100,{fit:'inside',withoutEnlargement:true})
    .webp({quality:81}).toFile(file);
  written++;
}
fs.mkdirSync(path.dirname(OUTPUT),{recursive:true});
fs.writeFileSync(OUTPUT,JSON.stringify(manifest,null,2)+'\n','utf8');
console.log('Import terminé : '+manifest.length+' pages, '+written+' images, '+
 manifest.reduce((n,p)=>n+p.documents.length,0)+' liens de documents.');
console.log('Vérifie les fichiers dans src/ancienPortfolio.json et public/legacy/, puis les autorisations de diffusion des images de stage avant toute publication publique.');
