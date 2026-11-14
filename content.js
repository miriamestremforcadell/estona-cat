/* ESTONA · Banc lingüístic estructurat
 * Les formes del sistema de campanar es basen en Optimot, fitxa 6655/11,
 * i IEC, GIEC §31.2.5.1. Les equivalències de quarts s'apliquen a tot el cicle de 12 hores.
 * Els mitjos quarts i les formes amb minuts resten separats fins a validar-ne
 * els valors aproximats i els patrons d'ús de manera específica.
 */
(() => {
  const hours = ['una','dues','tres','quatre','cinc','sis','set','vuit','nou','deu','onze','dotze'];
  const pad = n => String(n).padStart(2,'0');
  const time = (hour, minute) => pad(hour)+':'+pad(minute);
  const nextHour = h => hours[h % 12];
  const quarterExpr = (h, q) => {
    if (q === 0) return h === 1 ? 'la una' : 'les '+hours[h-1];
    const next = nextHour(h);
    const of = next === 'una' ? "d'una" : 'de '+next;
    return (q === 1 ? 'un quart' : q === 2 ? 'dos quarts' : 'tres quarts')+' '+of;
  };
  const groups = [0,1,2,3].map(q => Array.from({length:12},(_,i) => {
    const h=i+1, minute=q*15;
    return {time:time(h,minute),expression:quarterExpr(h,q),status:'validat',
      note:q===0?'Hora en punt.':q===1?'Un quart de l’hora següent.':q===2?'Dos quarts de l’hora següent.':'Tres quarts de l’hora següent.'};
  }));
  const quarterLessons = [
    {id:'quarts-01',title:'Les hores en punt',explanation:'L’hora en punt s’expressa amb el numeral femení i l’article definit: «la una», «les dues», «les tres»… En aquest exercici consolidem les dotze hores del cicle.',examples:groups[0]},
    {id:'quarts-02',title:'El primer quart',explanation:'Quan ha passat un quart d’hora, diem «un quart de» l’hora següent. Si l’hora següent és «una», fem la contracció «d’una».',examples:groups[1]},
    {id:'quarts-03',title:'Dos quarts',explanation:'A la mitja hora diem «dos quarts de» l’hora següent. No comptem des de l’hora que ja ha començat, sinó cap a la que ha de venir.',examples:groups[2]},
    {id:'quarts-04',title:'Tres quarts',explanation:'Quan han passat tres quarts, diem «tres quarts de» l’hora següent. Després d’aquest punt, arribem a l’hora en punt.',examples:groups[3]}
  ].map(lesson=>({...lesson,status:'validat',sourceIds:['optimot-6655-11','iec-giec-31-2-5-1']}));
  window.ESTONA_CONTENT = {
    schemaVersion:2,language:'ca',referenceVariety:'català central',
    worlds:[
      {id:'fonaments',title:'Els fonaments',description:'Entén la lògica del sistema tradicional i les hores en punt.',
       theory:'El sistema de campanar divideix l’hora en quatre quarts i pren com a referència l’hora següent. És propi sobretot de bona part del català central i nord-occidental.',
       lessons:[
        {id:'fonaments-01',title:'Un sistema que mira endavant',status:'validat',explanation:'En el sistema de campanar, quan expressem una hora que no és en punt, comptem els quarts de l’hora que ha de venir. Per això, a les 8.15 diem «un quart de nou»: ens situem en el camí cap a les nou.',examples:[{time:'08:15',expression:'un quart de nou',status:'validat',note:'Un quart de l’hora que ha de venir.'},{time:'08:30',expression:'dos quarts de nou',status:'validat',note:'Dos quarts de l’hora que ha de venir.'},{time:'08:45',expression:'tres quarts de nou',status:'validat',note:'Tres quarts de l’hora que ha de venir.'}],sourceIds:['optimot-6655-11','iec-giec-31-2-5-1']},
        {id:'fonaments-02',title:'Les quatre parts de l’hora',status:'validat',explanation:'L’hora es divideix en quatre parts iguals. El primer, segon i tercer quart indiquen el progrés cap a l’hora següent. Quan s’hi arriba, expressem l’hora en punt.',examples:[{time:'08:15',expression:'un quart de nou',status:'validat'},{time:'08:30',expression:'dos quarts de nou',status:'validat'},{time:'08:45',expression:'tres quarts de nou',status:'validat'},{time:'09:00',expression:'les nou',status:'validat'}],sourceIds:['optimot-6655-11']},
        {id:'fonaments-03',title:'L’hora següent és la referència',status:'validat',explanation:'El nombre que apareix després de «de» és el de l’hora següent, no el de l’hora que ja ha començat. Aquesta és la clau per interpretar les expressions del sistema de campanar.',examples:[{time:'08:15',expression:'un quart de nou',status:'validat'},{time:'08:30',expression:'dos quarts de nou',status:'validat'},{time:'08:45',expression:'tres quarts de nou',status:'validat'}],sourceIds:['optimot-6655-11','iec-giec-31-2-5-1']}
       ]},
      {id:'quarts',title:'Els quarts',description:'Aprèn a expressar un quart, dos quarts i tres quarts.',theory:'Els quarts són les quatre parts en què es divideix l’hora. En el sistema de campanar es compten respecte de l’hora següent.',lessons:quarterLessons},
      {id:'mitjos-quarts',title:'Els mitjos quarts',description:'Descobreix les expressions tradicionals aproximades dels mitjos quarts.',theory:'Els mitjos quarts subdivideixen l’espai entre un quart i el següent. Són expressions aproximades: no s’han de convertir en minuts exactes sense context. Optimot n’ofereix exemples com «mig quart de nou» i «tres quarts i mig de deu».',lessons:[],status:'contingut-en-preparacio'},
      {id:'precisio',title:'La precisió',description:'Expressa els minuts que acompanyen els quarts.',theory:'Es poden afegir minuts al quart precedent; si la fracció afegida no arriba a un quart, també es poden afegir a l’hora precedent. Exemples documentats: «dos quarts i tres minuts de cinc» (16.33 h) i «les tres i cinc minuts» (15.05 h).',lessons:[],status:'contingut-en-preparacio'},
      {id:'expressions',title:'Les expressions',description:'Incorpora expressions temporals i maneres de situar-te en el temps.',theory:'Per parlar d’horaris imprecisos, Optimot recull expressions com «les set tocades» i «a quarts de vuit». Cal distingir-les d’una hora exacta.',lessons:[],status:'contingut-en-preparacio'},
      {id:'converses',title:'Les converses',description:'Fes servir les hores en preguntes, respostes i diàlegs quotidians.',theory:'Les expressions horàries apareixen en preguntes, respostes, confirmacions i propostes per quedar. Aprendrem a triar una forma natural segons el context.',lessons:[],status:'contingut-en-preparacio'},
      {id:'vida-quotidiana',title:'La vida quotidiana',description:'Interpreta horaris, intervals, durades i situacions reals.',theory:'Els horaris escrits, les durades i les expressions dites en veu alta tenen usos diferents. També cal saber llegir formats de 24 hores i situar les parts del dia.',lessons:[],status:'contingut-en-preparacio'},
      {id:'domini',title:'El domini',description:'Combina tots els aprenentatges i consolida el teu domini.',theory:'Aquest món combinarà els continguts anteriors en situacions de comprensió, expressió i correcció.',lessons:[],status:'contingut-en-preparacio'}
    ],
    sources:[
      {id:'optimot-6655-11',name:'Optimot · Fitxa 6655/11: Les hores en català: sistema de campanar i sistema de rellotge',url:'https://aplicacions.llengua.gencat.cat/llc/AppJava/index.html?action=Principal&clickLink=detall&database=FITXES_PUB&databaseFilter=FITXES_PUB&databaseFilterName=Fitxes+de+l%27Optimot&idFont=15472&idHit=12804&input_cercar=si+no&method=detall&numPagina=35&numeroResultat=342&parameterField=FITXES_PUB&tipusCerca=cerca.tot&tipusFont=Fitxes+de+l%27Optimot&titol=Les+hores%3A+amb+lletres+o+amb+xifres%3F+%2F+Com+s%27escriuen+les+hores%3F',scope:'Sistema de campanar, quarts, mitjos quarts, minuts afegits i expressions aproximades.'},
      {id:'iec-giec-31-2-5-1',name:'Institut d’Estudis Catalans · Gramàtica de la llengua catalana, § 31.2.5.1',url:'https://giec.iec.cat/textgramatica/codi/31.2.5.1',scope:'Expressió de les hores i de les parts del dia.'}
    ]
  };
})();
