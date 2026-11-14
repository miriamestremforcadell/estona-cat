/* ESTONA · Contingut educatiu estructurat
 * Només es poden publicar com a exercicis les expressions amb estat «validat».
 * Fonts de referència: Optimot, fitxa 6655/11; IEC, GIEC §31.2.5.1.
 */
window.ESTONA_CONTENT = {
  schemaVersion: 1,
  language: 'ca',
  referenceVariety: 'català central',
  worlds: [
    {
      id: 'fonaments', title: 'Els fonaments',
      description: 'Entén la lògica del sistema tradicional i les hores en punt.',
      theory: 'El sistema de campanar divideix l’hora en quatre quarts i pren com a referència l’hora següent. És propi sobretot de bona part del català central i nord-occidental.',
      lessons: [
        { id: 'fonaments-01', title: 'Un sistema que mira endavant', status: 'validat',
          explanation: 'En el sistema de campanar, quan expressem una hora que no és en punt, comptem els quarts de l’hora que ha de venir. Per això, a les 8.15 diem «un quart de nou»: ens situem en el camí cap a les nou.',
          examples: [
            { time: '08:15', expression: 'un quart de nou', status: 'validat', note: 'Un quart de l’hora que ha de venir.' },
            { time: '08:30', expression: 'dos quarts de nou', status: 'validat', note: 'Dos quarts de l’hora que ha de venir.' },
            { time: '08:45', expression: 'tres quarts de nou', status: 'validat', note: 'Tres quarts de l’hora que ha de venir.' }
          ], sourceIds: ['optimot-6655-11', 'iec-giec-31-2-5-1']
        },
        { id: 'fonaments-02', title: 'Les quatre parts de l’hora', status: 'validat',
          explanation: 'L’hora es divideix en quatre parts iguals. El primer, segon i tercer quart indiquen el progrés cap a l’hora següent. Quan s’hi arriba, expressem l’hora en punt.',
          examples: [
            { time: '08:15', expression: 'un quart de nou', status: 'validat' },
            { time: '08:30', expression: 'dos quarts de nou', status: 'validat' },
            { time: '08:45', expression: 'tres quarts de nou', status: 'validat' },
            { time: '09:00', expression: 'les nou', status: 'validat' }
          ], sourceIds: ['optimot-6655-11']
        },
        { id: 'fonaments-03', title: 'L’hora següent és la referència', status: 'validat',
          explanation: 'El nombre que apareix després de «de» és el de l’hora següent, no el de l’hora que ja ha començat. Aquesta és la clau per interpretar les expressions del sistema de campanar.',
          examples: [
            { time: '08:15', expression: 'un quart de nou', status: 'validat' },
            { time: '08:30', expression: 'dos quarts de nou', status: 'validat' },
            { time: '08:45', expression: 'tres quarts de nou', status: 'validat' }
          ], sourceIds: ['optimot-6655-11', 'iec-giec-31-2-5-1']
        }
      ]
    },
    { id: 'quarts', title: 'Els quarts', description: 'Aprèn a expressar un quart, dos quarts i tres quarts.', theory: 'Els quarts són les quatre parts en què es divideix l’hora. En el sistema de campanar es compten respecte de l’hora següent.', lessons: [], status: 'contingut-en-preparacio' },
    { id: 'mitjos-quarts', title: 'Els mitjos quarts', description: 'Descobreix les expressions tradicionals aproximades dels mitjos quarts.', theory: 'Els mitjos quarts permeten situar-se aproximadament entre dos quarts. No s’han de presentar com a instants matemàtics exactes.', lessons: [], status: 'contingut-en-preparacio' },
    { id: 'precisio', title: 'La precisió', description: 'Expressa els minuts que acompanyen els quarts.', theory: 'En el sistema de campanar es poden afegir minuts al quart precedent; si la fracció no arriba a un quart, també es poden afegir a l’hora precedent.', lessons: [], status: 'contingut-en-preparacio' },
    { id: 'expressions', title: 'Les expressions', description: 'Incorpora expressions temporals i maneres de situar-te en el temps.', theory: 'Hi ha expressions per indicar aproximació o una hora ja passada, com ara «a quarts de...» i «les ... tocades».', lessons: [], status: 'contingut-en-preparacio' },
    { id: 'converses', title: 'Les converses', description: 'Fes servir les hores en preguntes, respostes i diàlegs quotidians.', theory: 'Les expressions horàries apareixen en preguntes, respostes, confirmacions i propostes per quedar.', lessons: [], status: 'contingut-en-preparacio' },
    { id: 'vida-quotidiana', title: 'La vida quotidiana', description: 'Interpreta horaris, intervals, durades i situacions reals.', theory: 'Els horaris escrits, les durades i les expressions dites en veu alta tenen usos diferents que cal saber interpretar.', lessons: [], status: 'contingut-en-preparacio' },
    { id: 'domini', title: 'El domini', description: 'Combina tots els aprenentatges i consolida el teu domini.', theory: 'En aquest món es combinaran els continguts dels mons anteriors en situacions de comprensió i ús.', lessons: [], status: 'contingut-en-preparacio' }
  ],
  sources: [
    { id: 'optimot-6655-11', name: 'Optimot · Fitxa 6655/11: Les hores en català: sistema de campanar i sistema de rellotge', url: 'https://aplicacions.llengua.gencat.cat/llc/AppJava/index.html?action=Principal&clickLink=detall&database=FITXES_PUB&databaseFilter=FITXES_PUB&databaseFilterName=Fitxes+de+l%27Optimot&idFont=15472&idHit=12804&input_cercar=si+no&method=detall&numPagina=35&numeroResultat=342&parameterField=FITXES_PUB&tipusCerca=cerca.tot&tipusFont=Fitxes+de+l%27Optimot&titol=Les+hores%3A+amb+lletres+o+amb+xifres%3F+%2F+Com+s%27escriuen+les+hores%3F', scope: 'Sistema de campanar, quarts, mitjos quarts i minuts afegits.' },
    { id: 'iec-giec-31-2-5-1', name: 'Institut d’Estudis Catalans · Gramàtica de la llengua catalana, § 31.2.5.1', url: 'https://publicacions.iec.cat/repository/pdf/00000495/00000088.pdf', scope: 'Marc gramatical dels sistemes d’expressió horària.' }
  ]
};
