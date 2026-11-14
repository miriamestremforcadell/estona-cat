/* ESTONA · Banc lingüístic revisat
 * Referència principal: IEC, GIEC en línia, §31.2.5.1.
 * Les equivalències de campanar són exemples exactes de quarts.
 * Els mitjos quarts i les expressions imprecises no es redueixen a minuts exactes.
 */
(() => {
  const nums=['una','dues','tres','quatre','cinc','sis','set','vuit','nou','deu','onze','dotze'];
  const pad=n=>String(n).padStart(2,'0');
  const hourName=h=>nums[(h-1)%12];
  const hourPhrase=h=>{const n=((h-1)%12)+1;return n===1?'la una':'les '+nums[n-1];};
  const nextName=h=>nums[h%12];
  const nextDe=h=>nextName(h)==='una'?"d'una":'de '+nextName(h);
  const campanar=(h,m)=>{
    if(m===0)return hourPhrase(h);
    const q=Math.floor(m/15),r=m%15;
    if(r!==0)return null;
    return (q===1?'un quart':q===2?'dos quarts':'tres quarts')+' '+nextDe(h);
  };
  const clock=(h,m)=>{
    if(m===0)return hourPhrase(h);
    if(m===15)return hourPhrase(h)+' i quart';
    if(m===30)return hourPhrase(h)+' i mitja';
    if(m===45)return hourPhrase(h+1)+' menys quart';
    return null;
  };
  const source=['iec-giec-31-2-5-1'];
  const quarterExamples=[];
  for(let h=1;h<=12;h++){
    for(const m of [0,15,30,45]){
      const expression=campanar(h,m);
      const alt=clock(h,m);
      quarterExamples.push({
        time:pad(h)+':'+pad(m),expression,status:'validat',
        ...(alt&&alt!==expression?{validAlternatives:[{expression:alt,system:'rellotge',status:'validat'}]}:{}),
        note:m===0?'Hora en punt.':m===15?'Un quart de l’hora en curs ja ha transcorregut.':m===30?'Han transcorregut dos quarts de l’hora en curs.':'Han transcorregut tres quarts de l’hora en curs.',
        sourceIds:source
      });
    }
  }
  const lesson=(id,title,explanation,examples=[],sourceIds=source)=>({
    id,title,status:'validat',explanation,examples,sourceIds
  });
  const quarterLessons=[
    lesson('quarts-01','Les hores en punt','Les hores s’expressen amb el femení del numeral cardinal precedit de l’article definit: «la una», «les dues», «les tres»… Per indicar que és exactament aquella hora, podem afegir «en punt».',quarterExamples.filter(x=>x.time.endsWith(':00'))),
    lesson('quarts-02','Un quart','El primer quart indica que ha passat un quart d’hora de l’hora en curs. En el sistema de campanar, el numeral indica els quarts transcorreguts i «de» introdueix l’hora en curs: «un quart de vuit».',quarterExamples.filter(x=>x.time.endsWith(':15'))),
    lesson('quarts-03','Dos quarts','A la mitja hora diem «dos quarts de» l’hora en curs. La referència és l’hora que està transcorrent, no l’hora precedent.',quarterExamples.filter(x=>x.time.endsWith(':30'))),
    lesson('quarts-04','Tres quarts','Quan han transcorregut tres quarts de l’hora, diem «tres quarts de» l’hora en curs. En arribar a l’hora següent, tornem a expressar-la en punt.',quarterExamples.filter(x=>x.time.endsWith(':45')))
  ];
  const worlds=[
    {id:'fonaments',title:'Els fonaments',description:'Entén la lògica del sistema tradicional i les hores en punt.',
     theory:'El sistema de campanar divideix l’hora en quatre quarts i pren com a referència l’hora en curs: «un quart de set», «dos quarts de set», «tres quarts de set». És el sistema habitual en bona part del català central i nord-occidental. En altres parlars és general el sistema de rellotge.',
     lessons:[
      lesson('fonaments-01','Un sistema que mira endavant','En el sistema de campanar comptem els quarts que han transcorregut de l’hora en curs. A les 8.15 diem «un quart de nou» perquè l’hora en curs és la que acabarà a les nou.',quarterExamples.filter(x=>['08:15','08:30','08:45'].includes(x.time))),
      lesson('fonaments-02','Les quatre parts de l’hora','L’hora es divideix en quatre parts iguals: un quart, dos quarts, tres quarts i l’hora següent en punt.',quarterExamples.filter(x=>['08:15','08:30','08:45','09:00'].includes(x.time))),
      lesson('fonaments-03','L’hora en curs és la referència','En «dos quarts de nou», el nou és l’hora en curs. La construcció no porta article davant del numeral que indica l’hora: diem «dos quarts de nou», no «dos quarts del nou».',quarterExamples.filter(x=>['08:15','08:30','08:45'].includes(x.time)))
     ]},
    {id:'quarts',title:'Els quarts',description:'Aprèn a expressar un quart, dos quarts i tres quarts.',
     theory:'El sistema de campanar té com a fracció bàsica el quart d’hora. El numeral masculí concorda amb «quart» i indica quants quarts han transcorregut; després, «de» introdueix l’hora en curs.',lessons:quarterLessons},
    {id:'mitjos-quarts',title:'Els mitjos quarts',description:'Descobreix les expressions tradicionals aproximades dels mitjos quarts.',
     theory:'Els quarts es poden subdividir en mitjos quarts. La GIEC documenta construccions com «mig quart de sis» i «un quart i mig de deu». Són expressions tradicionals de precisió aproximada: no les tractarem com si fossin equivalències universals a un minut i segon exactes.',
     lessons:[
      lesson('mitjos-01','Mig quart','La forma «mig quart de sis» situa l’hora aproximadament a mig camí entre les cinc i les sis, dins el primer quart de l’hora en curs. El valor concret pot dependre de la convenció d’ús; no el fixem com un minut exacte.',[],source),
      lesson('mitjos-02','Un quart i mig','La GIEC també documenta «un quart i mig de deu»: el mig quart s’afegeix al quart precedent amb la conjunció «i».',[],source),
      lesson('mitjos-03','Precisió sense falsa exactitud','Els mitjos quarts ajuden a situar-se aproximadament dins l’hora. En els exercicis caldrà interpretar-los com a franges o aproximacions, no com a instants exactes calculats al segon.',[],source)
     ]},
    {id:'precisio',title:'La precisió',description:'Expressa els minuts que acompanyen els quarts.',
     theory:'Els minuts es poden afegir al quart precedent amb «i» («tres quarts i un minut d’una») o a l’hora precedent quan la fracció afegida no arriba a un quart («la una i cinc minuts»). El nom «minut(s)» és opcional en exemples com «la una i cinc».',
     lessons:[
      lesson('precisio-01','Minuts després d’un quart','Quan els minuts s’afegeixen al quart precedent, fem servir «i»: «tres quarts i un minut d’una». La forma és documentada per la GIEC.',[{time:'12:46',expression:'tres quarts i un minut d’una',status:'validat',note:'Un minut afegit als tres quarts de dotze.'}],source),
      lesson('precisio-02','Minuts després de l’hora','Quan la fracció afegida no arriba a un quart, podem comptar des de l’hora precedent: «la una i cinc (minuts)».', [{time:'13:05',expression:'la una i cinc minuts',status:'validat',note:'Cinc minuts després de la una.'}],source),
      lesson('precisio-03','No confonguis el patró','La tria entre afegir els minuts al quart precedent o a l’hora precedent depèn de la fracció. No extrapolem una única plantilla a tots els minuts sense comprovar-la.',[],source)
     ]},
    {id:'expressions',title:'Les expressions',description:'Incorpora expressions temporals i maneres de situar-te en el temps.',
     theory:'A més de les hores precises, el català disposa d’expressions aproximatives. La GIEC documenta «a punt de tocar les set», «les set tocades», «un quart tocat» i «a quarts de set». Són expressions contextuals, no etiquetes d’un minut exacte.',
     lessons:[
      lesson('expressions-01','A punt de tocar','«Aviat tocaran les set» o «estan a punt de tocar les set» indica que falten pocs minuts —menys de mig quart segons la descripció de la GIEC— per a les set.',[],source),
      lesson('expressions-02','Hores tocades','«Les set tocades» indica que passen pocs minuts de les set. «Un quart tocat» indica que ja ha passat un quart i que n’han passat pocs minuts més.',[],source),
      lesson('expressions-03','A quarts de','«Arribaran a quarts de set» situa l’arribada en una franja aproximada al voltant de dos quarts de set. La GIEC en descriu un interval orientatiu; no equival a una hora exacta.',[],source)
     ]},
    {id:'converses',title:'Les converses',description:'Fes servir les hores en preguntes, respostes i diàlegs quotidians.',
     theory:'Les hores apareixen en preguntes, respostes, propostes i confirmacions. Cal triar una expressió coherent amb el sistema horari i amb el grau de precisió que demana la conversa.',
     lessons:[
      lesson('converses-01','Demanar l’hora','Podem preguntar «Quina hora és?» i respondre amb l’hora en punt o amb la fracció horària. La resposta ha de deixar clar el moment del dia si pot haver-hi ambigüitat.',[],source),
      lesson('converses-02','Quedar amb algú','En una conversa podem dir «Ens veiem a un quart de nou» o «Ens veiem a les vuit i quart», segons el sistema que fem servir. Totes dues construccions són documentades.',[],source),
      lesson('converses-03','Precisió adequada','En una conversa informal pot ser suficient una expressió aproximada; per a una cita, un horari o un transport, pot caldre una hora més precisa.',[],source)
     ]},
    {id:'vida-quotidiana',title:'La vida quotidiana',description:'Interpreta horaris, intervals, durades i situacions reals.',
     theory:'Cal distingir entre dir l’hora, expressar una durada, delimitar un interval i llegir un horari. El sistema internacional amb xifres és habitual en horaris i usos tècnics.',
     lessons:[
      lesson('vida-01','Les parts del dia','Per situar una hora podem precisar «de la matinada», «del matí», «del migdia», «de la tarda», «del vespre» o «de la nit». La tria depèn del context i dels usos territorials; no imposarem fronteres horàries rígides.',[],source),
      lesson('vida-02','Durades en quarts','«Fa un quart que som a taula» expressa una durada de quinze minuts; «dos quarts» pot equivaler a mitja hora. En alguns usos tradicionals també es compten durades més llargues per quarts.',[],source),
      lesson('vida-03','Llegir horaris','El sistema internacional representa les hores amb xifres de dotze o vint-i-quatre hores, per exemple «0:45» o «14:17». És especialment habitual en horaris, transports i usos tècnics.',[{time:'00:45',expression:'les zero hores i quaranta-cinc minuts',status:'validat',note:'Lectura explicativa del sistema internacional; en horaris se sol escriure amb xifres.'}],source)
     ]},
    {id:'domini',title:'El domini',description:'Combina tots els aprenentatges i consolida el teu domini.',
     theory:'En aquest món es combinaran els sistemes, els quarts, les expressions aproximatives, les durades i els contextos. Una resposta no s’ha de marcar com a incorrecta si és una variant catalana vàlida.',
     lessons:[
      lesson('domini-01','Tria el sistema adequat','Identifica si el context demana el sistema de campanar, el de rellotge o el sistema internacional. Cap d’aquests sistemes no s’ha de presentar com l’única manera correcta a tot el domini lingüístic.',[],source),
      lesson('domini-02','Corregeix amb criteri','Abans de corregir una expressió, comprova si és incorrecta, si és vàlida en un altre sistema o si és una variant que necessita revisió contextual.',[],source),
      lesson('domini-03','Domini de les hores','Combina les expressions precises i aproximatives en converses, horaris, durades i situacions quotidianes.',[],source)
     ]}
  ];
  const sources=[
    {id:'iec-giec-31-2-5-1',name:'IEC · Gramàtica de la llengua catalana, §31.2.5.1: L’expressió de les hores',url:'https://giec.iec.cat/textgramatica/codi/31.2.5.1',scope:'Sistemes de campanar, rellotge i internacional; quarts, mitjos quarts, minuts, aproximacions i durades.'},
    {id:'iec-giec-31-2-3',name:'IEC · Gramàtica de la llengua catalana, §31.2.3: Classes formals de les expressions temporals',url:'https://giec.iec.cat/textgramatica/codi/31.2.3d',scope:'Construccions amb hores i parts del dia.'},
    {id:'optimot-6655-11',name:'Optimot · Les hores: amb lletres o amb xifres? / Com s’escriuen les hores?',url:'https://aplicacions.llengua.gencat.cat/llc/AppJava/index.html?action=Principal&clickLink=detall&database=FITXES_PUB&databaseFilter=FITXES_PUB&databaseFilterName=Fitxes+de+l%27Optimot&idFont=15472&idHit=12804&input_cercar=si+no&method=detall&numPagina=35&numeroResultat=342&parameterField=FITXES_PUB&tipusCerca=cerca.tot&tipusFont=Fitxes+de+l%27Optimot&titol=Les+hores%3A+amb+lletres+o+amb+xifres%3F+%2F+Com+s%27escriuen+les+hores%3F',scope:'Consulta complementària sobre l’expressió i l’escriptura de les hores.'}
  ];
  window.ESTONA_CONTENT={
    schemaVersion:3,language:'ca',referenceVariety:'català central',lastLinguisticReview:'2026-11-14',
    linguisticPolicy:{
      primarySystem:'campanar',territorialScope:'El sistema de campanar és habitual en la major part del català central i nord-occidental; el sistema de rellotge és d’ús general en la resta del domini.',
      correctionClasses:['target-correct','valid-but-not-target','incorrect','needs-review'],
      rules:[
       {id:'campanar-quarter',status:'validat',summary:'Numeral cardinal masculí + quart(s) + de + hora en curs.'},
       {id:'half-quarter',status:'validat',summary:'El mig s’afegeix al quart precedent amb «i»; també es documenta «mig quart de…». Són expressions aproximatives.'},
       {id:'minutes',status:'validat',summary:'Els minuts s’afegeixen al quart precedent o a l’hora precedent si la fracció afegida no arriba a un quart.'},
       {id:'approximate',status:'validat',summary:'Les expressions aproximatives no s’han d’assignar a un minut exacte.'},
       {id:'clock-system',status:'validat',summary:'El sistema de rellotge és vàlid segons els usos territorials; no s’ha de corregir com si fos un error.'},
       {id:'international',status:'validat',summary:'El sistema internacional amb xifres és propi sobretot d’horaris i usos tècnics.'}
      ]
    },
    worlds,
    bank:{
      quarterExpressions:quarterExamples,
      halfQuarters:[
       {expression:'mig quart de sis',meaning:'Aproximadament a mig camí del primer quart de l’hora en curs.',status:'validat',exactMinute:null,sourceIds:source},
       {expression:'un quart i mig de deu',meaning:'Un quart i mig de l’hora en curs.',status:'validat',exactMinute:null,sourceIds:source}
      ],
      minuteExamples:[
       {time:'12:46',expression:'tres quarts i un minut d’una',status:'validat',sourceIds:source},
       {time:'13:05',expression:'la una i cinc (minuts)',status:'validat',sourceIds:source}
      ],
      approximateExpressions:[
       {expression:'Aviat/Ara tocaran les set',meaning:'Falten molt pocs minuts, menys de mig quart, per a les set.',status:'validat',exactMinute:null,sourceIds:source},
       {expression:'Les set tocades',meaning:'Passen molt pocs minuts, menys de mig quart, de les set.',status:'validat',exactMinute:null,sourceIds:source},
       {expression:'Un quart tocat',meaning:'Passen molt pocs minuts, menys de mig quart, d’un quart.',status:'validat',exactMinute:null,sourceIds:source},
       {expression:'A quarts de set',meaning:'Franja aproximada: entre un quart tocat i dos quarts i mig de set; en un sentit més ampli, entre un i tres quarts de set o pels volts de dos quarts de set. No és una hora exacta.',status:'validat',exactMinute:null,sourceIds:source}
      ],
      clockSystemExamples:[
       {time:'08:15',expression:'les vuit i quart',status:'validat'},
       {time:'08:30',expression:'les vuit i mitja',status:'validat'},
       {time:'08:45',expression:'les nou menys quart',status:'validat'}
      ],
      internationalExamples:[
       {time:'00:45',expression:'0:45',reading:'les zero hores i quaranta-cinc minuts',status:'validat'},
       {time:'14:17',expression:'14:17',reading:'les dues hores i disset minuts',status:'validat'}
      ]
    },
    sources
  };
})();