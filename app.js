const DB_NAME='estona-local';
const DB_VERSION=1;
let db;
let activeWorld=0;
let activeLessonIndex=0;
let activeMode='tria';
let state=defaultState();

const modes=[
  ['mira','Mira i expressa'],['relaciona','Relaciona'],
  ['tria','Tria l’expressió correcta'],['escriu','Escriu l’hora'],
  ['construeix','Construeix l’expressió'],['escolta','Escolta i interpreta'],
  ['corregeix','Corregeix l’error'],['situacions','Situacions reals']
];

function defaultState(){
  return {version:1,xp:0,completedLessons:[],worldsUnlocked:1,streak:0,lastPracticeDate:null,practiceBest:{},
    settings:{theme:'system',textSize:'normal',reduceMotion:false,sounds:false},lastWorld:0};
}
function openDB(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=()=>{
      const d=req.result;
      if(!d.objectStoreNames.contains('state'))d.createObjectStore('state');
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
function getState(){
  return new Promise(resolve=>{
    const tx=db.transaction('state','readonly');
    const req=tx.objectStore('state').get('user');
    req.onsuccess=()=>resolve(req.result||defaultState());
    req.onerror=()=>resolve(defaultState());
  });
}
function saveState(){
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('state','readwrite');
    tx.objectStore('state').put(state,'user');
    tx.oncomplete=resolve;
    tx.onerror=()=>reject(tx.error);
  });
}
function toast(message){
  const el=document.getElementById('toast');
  el.textContent=message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer=setTimeout(()=>el.classList.remove('show'),2400);
}
function showView(name){
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===name));
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.viewTarget===name));
  document.getElementById('main-content').focus({preventScroll:true});
  window.scrollTo({top:0,behavior:state.settings.reduceMotion?'auto':'smooth'});
}
function renderWorlds(){
  const list=document.getElementById('world-list');
  list.innerHTML='';
  window.ESTONA_CONTENT.worlds.forEach((w,i)=>{
    const done=w.lessons.length>0&&w.lessons.every(l=>state.completedLessons.includes(l.id));
    const b=document.createElement('button');
    b.className='world-card';
    const status=done?'Completat':(w.lessons.length?'Lliçons disponibles':'Teoria disponible');
    b.innerHTML='<span class="world-number">'+String(i+1).padStart(2,'0')+'</span>'+
      '<span class="world-info"><strong>'+w.title+'</strong><small>'+w.description+'</small></span>'+
      '<span class="world-state">'+status+'</span>';
    b.addEventListener('click',()=>openLesson(i));
    list.appendChild(b);
  });
}
function openLesson(i,lessonIndex=0){
  activeWorld=i;
  activeLessonIndex=lessonIndex;
  const world=window.ESTONA_CONTENT.worlds[i];
  const lesson=world.lessons[lessonIndex];
  state.lastWorld=i;
  document.getElementById('lesson-world').textContent='MÓN '+(i+1);
  document.getElementById('lesson-title').textContent=world.title;
  document.getElementById('lesson-description').textContent=world.description;
  const lessonList=document.getElementById('lesson-list');
  lessonList.innerHTML='';
  world.lessons.forEach((item,j)=>{
    const b=document.createElement('button');
    b.className='lesson-choice'+(j===lessonIndex?' selected':'');
    b.textContent=(j+1)+'. '+item.title+(state.completedLessons.includes(item.id)?' · Feta':'');
    b.addEventListener('click',()=>openLesson(i,j));
    lessonList.appendChild(b);
  });
  document.getElementById('lesson-heading').textContent=lesson?lesson.title:'Introducció al món';
  document.getElementById('lesson-theory').textContent=lesson?lesson.explanation:world.theory;
  document.getElementById('lesson-example').textContent=lesson&&lesson.examples?
    lesson.examples.map(e=>e.time+' · '+e.expression).join('  |  '):
    'La teoria d’aquest món és consultable. Les lliçons i activitats s’incorporaran després de la validació.';
  const doneButton=document.getElementById('lesson-done');
  doneButton.disabled=!lesson||lesson.status!=='validat';
  doneButton.textContent=lesson?
    (state.completedLessons.includes(lesson.id)?'Lliçó completada':'Marca la lliçó com a completada'):
    'Lliçons en preparació';
  document.querySelector('#view-lliço .fine-print').textContent=lesson?
    'Contingut contrastat amb les fonts lingüístiques indicades al banc de continguts.':
    'Teoria introductòria disponible; les lliçons i els exercicis encara estan en preparació.';
  showView('lliço');
}
function renderStats(){
  document.getElementById('home-xp').textContent=state.xp;
  document.getElementById('home-lessons').textContent=state.completedLessons.length;
  document.getElementById('home-streak').textContent=state.streak;
  document.getElementById('profile-xp').textContent=state.xp+' XP';
  document.getElementById('profile-level').textContent=state.xp>=500?'Nivell 2 · Bon camí':'Nivell 1 · Primeres passes';
}
function applySettings(){
  const s=state.settings;
  document.documentElement.dataset.theme=s.theme==='system'?'system':s.theme;
  document.body.classList.toggle('large',s.textSize==='large');
  document.body.classList.toggle('xlarge',s.textSize==='xlarge');
  document.body.classList.toggle('reduce-motion',s.reduceMotion);
  document.getElementById('theme-select').value=s.theme;
  document.getElementById('text-size').value=s.textSize;
  document.getElementById('reduce-motion').checked=s.reduceMotion;
  document.getElementById('sounds-enabled').checked=s.sounds;
}
function renderModes(){
  const wrap=document.getElementById('practice-modes');
  wrap.innerHTML='';
  modes.forEach(([id,label])=>{
    const b=document.createElement('button');
    b.className='choice-option'+(id===activeMode?' selected':'');
    b.textContent=label;
    b.addEventListener('click',()=>{activeMode=id;renderModes();});
    wrap.appendChild(b);
  });
}
function startSession(){
  if(!window.ESTONA_GAMES){toast('No s’ha pogut carregar el motor de pràctica. Torna-ho a provar.');return;}
  const count=Number(document.getElementById('practice-count').value)||5;
  window.ESTONA_GAMES.start({mode:activeMode,count,
    onComplete:async earned=>{
      state.practiceBest=state.practiceBest||{};
      const previous=state.practiceBest[activeMode]||0;
      if(earned>previous){state.xp+=earned;state.practiceBest[activeMode]=earned;toast('Has superat la teva millor puntuació. XP afegits!');}
      else toast('Bona pràctica! Per guanyar XP de nou, supera la teva millor puntuació en aquesta modalitat.');
      await saveState();renderStats();
    },
    onExit:()=>{showView('practicar');}
  });
}
function localDate(date=new Date()){
  const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');
  return y+'-'+m+'-'+d;
}
function exportBackup(){
  const blob=new Blob([JSON.stringify({app:'ESTONA',formatVersion:1,exportedAt:new Date().toISOString(),state},null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='estona-copia-'+new Date().toISOString().slice(0,10)+'.json';
  a.click();
  URL.revokeObjectURL(url);
  toast('Còpia de seguretat exportada.');
}
async function importBackup(file){
  try{
    const data=JSON.parse(await file.text());
    if(data.app!=='ESTONA'||data.formatVersion!==1||!data.state||
      typeof data.state.xp!=='number'||!Array.isArray(data.state.completedLessons)||!data.state.settings)throw new Error('invalid');
    if(!confirm('La restauració substituirà el progrés i les preferències actuals. Vols continuar?'))return;
    state={...defaultState(),...data.state,settings:{...defaultState().settings,...data.state.settings}};
    await saveState();
    applySettings();renderWorlds();renderStats();
    toast('Còpia restaurada correctament.');
  }catch(e){toast('No s’ha pogut validar la còpia de seguretat.');}
}
function renderDictionary(filter=''){
  const entries=[
    ['Sistema de campanar','Sistema de fraccions horàries basat en quarts. És habitual en la major part del català central i nord-occidental.'],
    ['Sistema de rellotge','Sistema que pren com a base la mitja hora i compta per addició o sostracció. És d’ús general en bona part de la resta del domini lingüístic.'],
    ['Sistema internacional','Sistema numèric de dotze o vint-i-quatre hores, habitual en horaris, transports i usos tècnics.'],
    ['Quart','Cadascuna de les quatre parts en què es divideix l’hora. En el sistema de campanar es compten respecte de l’hora en curs.'],
    ['Mig quart','Subdivisió aproximada d’un quart. No s’ha de convertir automàticament en un nombre exacte de minuts.'],
    ['Un quart i mig','Construcció documentada per la GIEC: el mig s’afegeix al quart precedent amb la conjunció «i».'],
    ['Hora en punt','Expressió que indica que s’ha arribat exactament a una hora. Es pot reforçar amb «en punt».'],
    ['Hora en curs','L’hora que transcorre i que serveix de referència en les expressions del sistema de campanar.'],
    ['Minuts afegits al quart','Els minuts es poden afegir al quart precedent mitjançant la conjunció «i».'],
    ['Minuts afegits a l’hora','Si la fracció afegida no arriba a un quart, els minuts també es poden comptar des de l’hora precedent.'],
    ['A quarts de','Expressió aproximativa que situa un moment dins una franja horària; no designa una hora exacta.'],
    ['Tocades','Expressió aproximativa que indica que ja s’ha passat una hora o un quart per pocs minuts.'],
    ['Durada en quarts','El mot «quart» també pot expressar una durada de quinze minuts; «dos quarts» pot equivaler a mitja hora.'],
    ['Parts del dia','Expressions com «de la matinada», «del matí», «del migdia», «de la tarda», «del vespre» i «de la nit» situen l’hora en el context del dia.']
  ];
  const target=document.getElementById('dictionary-entries');
  target.innerHTML='';
  entries.filter(e=>(e[0]+' '+e[1]).toLocaleLowerCase('ca').includes(filter.toLocaleLowerCase('ca'))).forEach(e=>{
    const div=document.createElement('article');div.className='dictionary-entry';
    const strong=document.createElement('strong');strong.textContent=e[0];
    const p=document.createElement('p');p.textContent=e[1];
    div.append(strong,p);
    const source=document.createElement('small');source.textContent='Font principal: IEC, GIEC § 31.2.5.1 · § 31.2.3';
    div.appendChild(source);target.appendChild(div);
  });
}
function init(){
  document.querySelectorAll('[data-view-target]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.viewTarget)));
  document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.go)));
  document.getElementById('quick-profile').addEventListener('click',()=>showView('perfil'));
  document.getElementById('continue-button').addEventListener('click',()=>openLesson(state.lastWorld||0));
  document.getElementById('back-to-learn').addEventListener('click',()=>showView('aprendre'));
  document.getElementById('back-to-learn-2').addEventListener('click',()=>showView('aprendre'));
  document.getElementById('show-glossary').addEventListener('click',()=>{renderDictionary();showView('diccionari');});
  document.getElementById('lesson-done').addEventListener('click',async()=>{
    const lesson=window.ESTONA_CONTENT.worlds[activeWorld].lessons[activeLessonIndex];
    if(!lesson||lesson.status!=='validat')return;
    if(!state.completedLessons.includes(lesson.id)){state.completedLessons.push(lesson.id);state.xp+=20;}
    state.lastWorld=activeWorld;
    await saveState();renderWorlds();renderStats();openLesson(activeWorld,activeLessonIndex);
    toast('Lliçó completada. Els XP només s’atorguen la primera vegada.');
  });
  document.getElementById('start-practice').addEventListener('click',startSession);
  document.getElementById('exit-session').addEventListener('click',()=>showView('practicar'));
  document.getElementById('export-data').addEventListener('click',exportBackup);
  document.getElementById('import-data').addEventListener('change',e=>{
    if(e.target.files[0])importBackup(e.target.files[0]);e.target.value='';
  });
  document.getElementById('theme-select').addEventListener('change',async e=>{state.settings.theme=e.target.value;applySettings();await saveState();});
  document.getElementById('text-size').addEventListener('change',async e=>{state.settings.textSize=e.target.value;applySettings();await saveState();});
  document.getElementById('reduce-motion').addEventListener('change',async e=>{state.settings.reduceMotion=e.target.checked;applySettings();await saveState();});
  document.getElementById('sounds-enabled').addEventListener('change',async e=>{state.settings.sounds=e.target.checked;await saveState();});
  document.getElementById('dictionary-search').addEventListener('input',e=>renderDictionary(e.target.value));
  renderModes();renderWorlds();renderStats();applySettings();renderDictionary();
}
(async()=>{
  try{
    db=await openDB();state=await getState();
    if(!Array.isArray(state.completedLessons))state.completedLessons=[];
    if(!state.practiceBest||typeof state.practiceBest!=='object')state.practiceBest={};
    state.settings={...defaultState().settings,...(state.settings||{})};
    init();
    if('serviceWorker'in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  }catch(e){console.error(e);toast('No s’han pogut inicialitzar les dades locals.');}
})();
