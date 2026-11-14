/* ESTONA · Motor de les vuit modalitats de pràctica.
   Només consumeix exemples marcats com a validats al banc de continguts. */
(() => {
  const modeNames = {
    mira: 'Mira i expressa', relaciona: 'Relaciona',
    tria: 'Tria l’expressió correcta', escriu: 'Escriu l’hora',
    construeix: 'Construeix l’expressió', escolta: 'Escolta i interpreta',
    corregeix: 'Corregeix l’error', situacions: 'Situacions reals'
  };
  const clockVariants = {
    '08:15': ['les vuit i quart'],
    '08:30': ['les vuit i mitja'],
    '08:45': ['les nou menys quart']
  };
  const $ = (s, root=document) => root.querySelector(s);
  const el = (tag, cls, value) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (value !== undefined) node.textContent = value;
    return node;
  };
  const normalize = value => String(value || '').toLocaleLowerCase('ca')
    .normalize('NFC').trim().replace(/[¿?¡!.,;:]/g,'').split(' ').filter(Boolean).join(' ');
  let session = null;

  function getItems() {
    const items = [];
    (window.ESTONA_CONTENT?.worlds || []).forEach(world => {
      (world.lessons || []).forEach(lesson => {
        if (lesson.status !== 'validat') return;
        (lesson.examples || []).forEach(example => {
          if (example.status !== 'validat') return;
          if (!items.some(item => item.time === example.time)) items.push({
            time: example.time, expression: example.expression, note: example.note || lesson.explanation
          });
        });
      });
    });
    return items;
  }
  function classify(item, answer, strict=true) {
    const value = normalize(answer);
    if (value === normalize(item.expression)) return 'target-correct';
    if ((clockVariants[item.time] || []).some(v => normalize(v) === value)) return 'valid-but-not-target';
    return strict ? 'incorrect' : 'needs-review';
  }
  function shuffled(list) {
    const copy = list.slice();
    for (let i=copy.length-1;i>0;i--) {
      const j=Math.floor(Math.random()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]];
    }
    return copy;
  }
  function makeQuestions(mode, count, items) {
    const ordered = shuffled(items);
    return Array.from({length:count},(_,i)=>ordered[i%ordered.length]);
  }
  function addButton(parent, label, onClick, cls='answer-option') {
    const b=el('button',cls,label); b.type='button'; b.addEventListener('click',onClick); parent.appendChild(b); return b;
  }
  function optionList(item, items, parent, onAnswer, includeAlternative=true) {
    const distractors=shuffled(items.filter(x=>x.time!==item.time)).slice(0,3).map(x=>({label:x.expression,value:x.expression}));
    const opts=[...distractors,{label:item.expression,value:item.expression}];
    if (includeAlternative && clockVariants[item.time]?.length) opts.push({label:clockVariants[item.time][0],value:clockVariants[item.time][0]});
    shuffled(opts).forEach(o=>addButton(parent,o.label,()=>onAnswer(o.value)));
  }
  function renderFeedback(result, item, answer) {
    const feedback=$('#answer-feedback');
    feedback.className='feedback '+result;
    if(result==='target-correct') feedback.textContent='Molt bé! «'+item.expression+'» és la forma que estem practicant.';
    else if(result==='valid-but-not-target') feedback.textContent='Aquesta expressió també és catalana i vàlida, però correspon al sistema de rellotge. Aquí practiquem el sistema de campanar: «'+item.expression+'».';
    else if(result==='needs-review') feedback.textContent='No podem classificar automàticament aquesta resposta. Pot ser una variant vàlida: revisa la forma de campanar que practiquem, «'+item.expression+'».';
    else feedback.textContent='Encara no. La forma que busquem és «'+item.expression+'». Fixa’t en l’hora següent que prenem com a referència.';
  }
  function answer(value, strict=true) {
    if(!session || session.answered) return;
    const item=session.questions[session.index];
    const result=classify(item,value,strict);
    session.answered=true;
    if(result==='target-correct') session.earned+=10;
    if(result==='target-correct') session.correct++;
    else if(result==='valid-but-not-target') session.validOther++;
    else if(result==='needs-review') session.needsReview++;
    else session.incorrect++;
    renderFeedback(result,item,value);
    $('#next-question').disabled=false;
    $('#next-question').textContent=session.index===session.questions.length-1?'Acaba la pràctica':'Següent pregunta →';
    $('#game-stage').querySelectorAll('button,input').forEach(node=>{ if(node.id!=='next-question' && node.id!=='hint-button') node.disabled=true; });
    session.lastResult=result;
  }
  function showHint() {
    if(!session) return;
    const item=session.questions[session.index];
    $('#answer-feedback').textContent='Pista: pensa en l’hora que ve després. «'+item.expression.split(' de ').slice(-1)[0]+'» és la referència.';
  }
  function relationUI(item, items, stage) {
    stage.appendChild(el('p','game-instruction','Relaciona cada hora amb la seva expressió. Selecciona primer una hora i després la forma corresponent.'));
    const sample=shuffled(items.filter(x=>x.time!==item.time)).slice(0,3);
    const pairs=shuffled([item,...sample]);
    const grid=el('div','matching-grid'), left=el('div','matching-column'), right=el('div','matching-column');
    left.appendChild(el('span','matching-label','HORA'));
    right.appendChild(el('span','matching-label','EXPRESSIÓ'));
    let selectedTime=null, selectedExpression=null;
    const timeButtons=[];
    pairs.forEach(x=>timeButtons.push(addButton(left,x.time,()=>{
      selectedTime=x.time; timeButtons.forEach(b=>b.classList.toggle('selected',b.textContent===x.time));
      resolvePair();
    },'match-option')));
    shuffled(pairs).forEach(x=>addButton(right,x.expression,()=>{
      selectedExpression=x; right.querySelectorAll('button').forEach(b=>b.classList.toggle('selected',b.textContent===x.expression));
      resolvePair();
    },'match-option'));
    function resolvePair(){
      if(!selectedTime || !selectedExpression)return;
      const isCorrect=selectedTime===selectedExpression.time && selectedTime===item.time;
      answer(isCorrect?item.expression:selectedExpression.expression,true);
    }
    grid.append(left,right);stage.appendChild(grid);
  }
  function build() {
    const stage=$('#game-stage'); stage.innerHTML='';
    const item=session.questions[session.index], items=session.items;
    const mode=session.mode;
    const instruction={
      mira:'Observa l’hora i expressa-la en el sistema de campanar.',
      tria:'Tria la forma del sistema de campanar que correspon a aquesta hora.',
      escriu:'Escriu l’expressió en català. Pots fer servir accents i apòstrofs.',
      construeix:'Toca les paraules en l’ordre correcte per construir l’expressió.',
      escolta:'Escolta l’expressió i identifica a quina hora correspon.',
      corregeix:'L’expressió proposada no correspon a aquesta hora. Tria la correcció.',
      situacions:'Llegeix la situació i tria com diries l’hora en una conversa.'
    };
    if(mode==='relaciona') return relationUI(item,items,stage);
    stage.appendChild(el('p','game-instruction',instruction[mode]));
    const prompt=el('div','game-prompt');
    if(mode==='escolta'){
      const speak=addButton(prompt,'▶ Escolta l’expressió',()=>{
        if(!('speechSynthesis' in window)){ $('#answer-feedback').textContent='Aquest dispositiu no ofereix lectura de veu en aquest moment.';return; }
        window.speechSynthesis.cancel();
        const utterance=new SpeechSynthesisUtterance(item.expression); utterance.lang='ca-ES'; utterance.rate=.82; window.speechSynthesis.speak(utterance);
      },'listen-button');
      stage.appendChild(prompt);
      stage.appendChild(el('p','muted','La veu disponible depèn de les veus instal·lades al dispositiu. Si no sona, pots continuar quan vulguis.'));
      const times=el('div','answer-options');
      shuffled(items).forEach(x=>addButton(times,x.time,()=>answer(x.time===item.time?item.expression:x.expression)));
      stage.appendChild(times);
    } else if(mode==='corregeix'){
      prompt.appendChild(el('span','correction-wrong',item.time+' = '+(items.find(x=>x.time!==item.time)?.expression || 'expressió incorrecta')));
      stage.appendChild(prompt);
      const choices=el('div','answer-options'); optionList(item,items,choices,answer,false); stage.appendChild(choices);
    } else if(mode==='situacions'){
      const scenarios={
        '08:15':'La reunió comença a les 08:15. Com ho diries a una companya?',
        '08:30':'Has quedat a les 08:30. Quina hora diràs?',
        '08:45':'El tren surt a les 08:45. Com ho expressaries?',
        '09:00':'La botiga obre a les 09:00. Com ho diries?'
      };
      prompt.textContent=scenarios[item.time] || 'Com diries aquesta hora?';
      stage.appendChild(prompt);
      const choices=el('div','answer-options'); optionList(item,items,choices,answer,true); stage.appendChild(choices);
    } else {
      prompt.textContent=item.time; stage.appendChild(prompt);
      if(mode==='escriu'){
        const input=el('input','game-input'); input.type='text'; input.placeholder='Escriu l’expressió…'; input.autocomplete='off'; input.setAttribute('aria-label','La teva resposta');
        stage.appendChild(input);
        addButton(stage,'Comprova la resposta',()=>answer(input.value,false),'primary-button game-submit');
        input.addEventListener('keydown',e=>{if(e.key==='Enter')answer(input.value,false);});
      } else if(mode==='construeix'){
        const tokens=item.expression.split(' ');
        const wordBank=el('div','word-bank'), built=el('div','built-words');
        let chosen=[];
        shuffled(tokens.map((word,index)=>({word,index}))).forEach(token=>{
          addButton(wordBank,token.word,()=>{
            if(chosen.includes(token.index))return;
            chosen.push(token.index); built.textContent=chosen.map(i=>tokens[i]).join(' ');
          },'word-chip');
        });
        stage.append(wordBank,built);
        addButton(stage,'Comprova la construcció',()=>answer(chosen.map(i=>tokens[i]).join(' '),false),'primary-button game-submit');
        addButton(stage,'Torna a començar',()=>{chosen=[];built.textContent='';wordBank.querySelectorAll('button').forEach(b=>b.disabled=false);},'subtle-link');
      } else {
        const choices=el('div','answer-options'); optionList(item,items,choices,answer,mode==='tria'); stage.appendChild(choices);
      }
    }
  }
  function updateProgress() {
    $('#question-counter').textContent='PREGUNTA '+(session.index+1)+' DE '+session.questions.length;
    $('#session-xp').textContent=session.earned+' XP';
    $('#question-progress').style.width=((session.index)/session.questions.length*100)+'%';
  }
  function finish() {
    const stage=$('#game-stage'); stage.innerHTML='';
    $('#session-title').textContent='Pràctica completada!';
    stage.appendChild(el('div','completion-score',session.correct+' / '+session.questions.length));
    stage.appendChild(el('h2','completion-heading','Molt bona feina!'));
    stage.appendChild(el('p','game-instruction',session.earned+' XP aconseguits · '+session.validOther+' respostes vàlides en un altre sistema · '+session.incorrect+' respostes incorrectes · '+session.needsReview+' respostes pendents de revisió.'));
    stage.appendChild(el('p','muted','Has practicat: '+modeNames[session.mode]+'. El contingut disponible s’ampliarà a mesura que validem més expressions.'));
    addButton(stage,'Torna a practicar',()=>{session.onExit();},'primary-button');
    $('#next-question').hidden=true; $('#hint-button').hidden=true;
    $('#question-counter').textContent='RESUM DE LA SESSIÓ';
    $('#question-progress').style.width='100%';
    session.onComplete(session.earned);
  }
  function start({mode,count,onComplete,onExit}) {
    const items=getItems();
    if(!items.length){ alert('Encara no hi ha expressions validades per practicar.'); return; }
    count=Math.max(1,Math.min(Number(count)||5,items.length));
    session={mode,count,items,questions:makeQuestions(mode,count,items),index:0,earned:0,correct:0,validOther:0,incorrect:0,needsReview:0,answered:false,onComplete,onExit};
    $('#session-title').textContent=modeNames[mode] || 'Pràctica';
    $('#answer-feedback').textContent='';
    $('#next-question').hidden=false; $('#hint-button').hidden=false;
    $('#next-question').disabled=true; $('#next-question').textContent='Comprova la resposta →';
    $('#hint-button').onclick=showHint;
    $('#next-question').onclick=()=>{
      if(!session.answered)return;
      if(session.index===session.questions.length-1){finish();return;}
      session.index++;session.answered=false;$('#answer-feedback').textContent='';
      $('#next-question').disabled=true;$('#next-question').textContent='Comprova la resposta →';
      updateProgress();build();
    };
    updateProgress();build();
    document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.dataset.view==='practice-session'));
    document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.viewTarget==='practicar'));
    window.scrollTo({top:0,behavior:'smooth'});
  }
  window.ESTONA_GAMES={start,getItems,modeNames};
})();