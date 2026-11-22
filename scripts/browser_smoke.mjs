import fs from 'node:fs';
import {preview} from 'vite';
import {chromium} from 'playwright-core';

const directory='audit-screenshots';
fs.mkdirSync(directory,{recursive:true});
const executablePaths=[
  process.env.CHROME_BIN,
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser'
].filter(Boolean);
const executablePath=executablePaths.find(p=>fs.existsSync(p));
if(!executablePath){
  throw new Error('Aucun Chrome/Chromium trouvé sur le runner GitHub Actions');
}

const previewServer=await preview({preview:{
  host:'127.0.0.1',port:4173,strictPort:true
}});
const browser=await chromium.launch({
  headless:true,
  executablePath,
  args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl',
    '--use-angle=swiftshader','--enable-unsafe-swiftshader']
});
const failures=[];
const checks=[];
async function assert(label,condition){
  if(!condition)failures.push(label);
  checks.push({label,ok:Boolean(condition)});
}
const page=await browser.newPage({viewport:{width:1366,height:768},deviceScaleFactor:1});
page.setDefaultTimeout(60000);
const jsErrors=[];
page.on('pageerror',error=>jsErrors.push(error.message));
try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded',timeout:60000});
  await page.locator('.hero h1').waitFor({state:'attached',timeout:60000});
  for(const [width,height] of [[1366,768],[1920,1080],[2560,1440]]){
    jsErrors.length=0;
    await page.setViewportSize({width,height});
    await page.waitForTimeout(250);
    await page.screenshot({path:`${directory}/accueil-${width}x${height}.png`,
      animations:'disabled',timeout:90000});
    const geometry=await page.evaluate(()=>{
      const selectors=['.hero-copy','.hero-actions','.topbar nav'];
      const overflowing=selectors.flatMap(selector=>{
        const el=document.querySelector(selector);
        if(!el)return [];
        const rect=el.getBoundingClientRect();
        return (rect.right>innerWidth+2||rect.left<-2||rect.top<-2)
          ?[{selector,left:rect.left,right:rect.right,top:rect.top}]:[];
      });
      return {overflowing,heroTitle:document.querySelector('.hero h1')?.textContent};
    });
    await assert(`Accueil ${width}x${height} : éléments visibles sans débordement`,
      geometry.overflowing.length===0);
    await assert(`Accueil ${width}x${height} : noyau et titre présents`,
      geometry.heroTitle?.includes('ÉNERGIE') &&
      await page.locator('.hero h1').isVisible() &&
      await page.locator('.hero canvas').count()===1);
    await assert(`Accueil ${width}x${height} : aucune erreur JavaScript`,
      jsErrors.length===0);
    console.log(JSON.stringify({viewport:`${width}x${height}`,geometry,jsErrors}));

    if(width===1920){
      await page.locator('#projets').scrollIntoViewIfNeeded();
      await page.locator('.project-selector__trigger').click();
      await assert('Liste déroulante des projets ouverte',
        await page.locator('.project-selector__choice').count()>0);
      await page.locator('.project-selector__choice')
        .filter({hasText:'Battery Management System'}).first().click();
      const current=await page.locator('.project-selected .project-info h3').innerText();
      await assert('Changement de la fiche projet : BMS',
        current.includes('Battery Management System'));
      await page.locator('.project-selected .project-action button').click();
      await page.locator('.detail-panel').waitFor();
      await assert('Étude BMS affichée',
        await page.locator('.detail-hero h2').innerText()==='Battery Management System');
      await page.locator('.detail-view-switch button').nth(1).click();
      await assert('Mode plein écran activé',
        await page.locator('.detail-panel--reader').count()===1);
      await page.locator('.study-toc__trigger').click();
      await assert('Sommaire actif avec plusieurs chapitres',
        await page.locator('.study-toc__chapter').count()>=4);
      await page.locator('.study-toc__chapter').nth(1).click();
      await page.screenshot({path:`${directory}/bms-lecture-1920x1080.png`,
        animations:'disabled'});
      await page.locator('.study-highlights__figure').first().click();
      await assert('Zoom des figures ouvert',await page.locator('.zoom-overlay').count()===1);
      await page.keyboard.press('Escape');
      await assert('Zoom refermé au clavier',await page.locator('.zoom-overlay').count()===0);
      await page.locator('.detail-close').focus();
      await page.keyboard.press('Tab');
      await assert('Focus maintenu dans la fenêtre d’étude',
        await page.evaluate(()=>Boolean(document.querySelector('.detail-panel')?.contains(document.activeElement))));
      await page.locator('.detail-close').click();
      await assert('Retour au portfolio après fermeture',
        await page.locator('.detail-panel').count()===0);
    }
  }
}finally{
  await page.close();
  await browser.close();
  await new Promise(resolve=>previewServer.httpServer.close(resolve));
}
console.log(JSON.stringify({checks,failures,screenshots:directory},null,2));
if(failures.length)process.exitCode=1;
