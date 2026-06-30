export type PlayerTuple = [string, string, number]

export const DB: Record<string, PlayerTuple[]> = {

  // ── BRASIL ────────────────────────────────────────────────────

  'Santos 1963': [
    ['Gilmar','GOL',88],['Lima','LD',82],['Mauro Ramos','ZAG',85],['Calvet','ZAG',81],
    ['Dalmo','LE',80],['Zito','VOL',86],['Mengálvio','MC',83],['Dorval','PD',82],
    ['Coutinho','ATA',88],['Pelé','ATA',99],['Pepe','PE',88],['Pagão','ATA',80],
  ],
  'Santos 2011': [
    ['Rafael','GOL',84],['Léo','LD',81],['Edu Dracena','ZAG',82],['Durval','ZAG',80],
    ['Arouca','VOL',83],['Elano','MC',82],['Ganso','MEI',87],['Neymar','PE',94],
    ['Robinho','PD',86],['Borges','ATA',83],['Alan Patrick','MC',79],['Bruno Rodrigo','ZAG',79],
  ],
  'Flamengo 1981': [
    ['Raul','GOL',82],['Leandro','LD',88],['Marinho','ZAG',83],['Mozer','ZAG',83],
    ['Júnior','LE',89],['Andrade','VOL',84],['Adílio','MC',83],['Zico','MEI',94],
    ['Tita','PD',83],['Nunes','ATA',84],['Lico','PE',80],['Baroninho','MC',78],
  ],
  'Flamengo 2019': [
    ['Diego Alves','GOL',84],['Rafinha','LD',82],['Pablo Marí','ZAG',81],['Rodrigo Caio','ZAG',82],
    ['Filipe Luís','LE',84],['Willian Arão','VOL',81],['Gerson','MC',84],['Arrascaeta','MEI',87],
    ['Éverton Ribeiro','MD',84],['Bruno Henrique','PE',86],['Gabigol','ATA',88],
    ['Pedro','ATA',82],['Diego Ribas','MEI',81],
  ],
  'Flamengo 2022': [
    ['Santos','GOL',80],['Rodinei','LD',79],['David Luiz','ZAG',83],['Léo Pereira','ZAG',81],
    ['Filipe Luís','LE',82],['Thiago Maia','VOL',80],['João Gomes','VOL',81],['Arrascaeta','MEI',87],
    ['Pedro Flamengo','ATA',86],['Gabigol','ATA',85],['Éverton Cebolinha','PE',81],['Matheus França','MD',78],
  ],
  'São Paulo 1993': [
    ['Zetti','GOL',85],['Cafu','LD',88],['Antônio Carlos','ZAG',82],['Ronaldão','ZAG',81],
    ['Válber','LE',79],['Pintado','VOL',80],['Toninho Cerezo','VOL',86],['Raí','MEI',91],
    ['Müller','ATA',85],['Palhinha','ATA',82],['Macedo','ATA',80],['Dinho','ZAG',79],
  ],
  'Palmeiras 1999': [
    ['Marcos','GOL',87],['Arce','LD',83],['Roque Júnior','ZAG',84],['Júnior Baiano','ZAG',82],
    ['Júnior','LE',81],['César Sampaio','VOL',84],['Rogério','VOL',80],['Zinho','MEI',84],
    ['Alex','MEI',86],['Oséas','ATA',80],['Paulo Nunes','PE',81],['Asprilla','ATA',83],
  ],
  'Palmeiras 2021': [
    ['Weverton','GOL',88],['Marcos Rocha','LD',80],['Gustavo Gómez','ZAG',87],['Luan','ZAG',80],
    ['Piquerez','LE',82],['Danilo','VOL',82],['Zé Rafael','MC',81],['Raphael Veiga','MEI',86],
    ['Gabriel Menino','MD',79],['Dudu','PE',86],['Rony','ATA',82],['Breno Lopes','ATA',78],
    ['Felipe Melo','VOL',80],
  ],
  'Grêmio 1983': [
    ['Mazaropi','GOL',84],['Caio Júnior','LD',78],['Mauro Galvão','ZAG',84],['Casagrande','ZAG',81],
    ['Clemer','LE',77],['Bino','VOL',79],['Caça-Rato','MC',78],['Paulo César','MD',77],
    ['Renato Gaúcho','MEI',85],['Tita','PE',83],['Osvaldo','ATA',83],['Paulo Nunes','ATA',80],
  ],
  'Grêmio 2017': [
    ['Marcelo Grohe','GOL',83],['Léo Moura','LD',80],['Pedro Geromel','ZAG',88],['Kannemann','ZAG',88],
    ['Bruno Cortez','LE',79],['Maicon','VOL',82],['Arthur','MC',83],['Ramiro','MC',80],
    ['Luan Grêmio','MEI',85],['Everton Ceará','PE',84],['Lucas Barrios','ATA',80],['Fernandinho G','PD',78],
  ],
  'Corinthians 2012': [
    ['Cássio','GOL',90],['Alessandro','LD',80],['Chicão','ZAG',84],['Leandro Castán','ZAG',81],
    ['Fábio Santos','LE',80],['Ralf','VOL',80],['Paulinho','VOL',84],['Danilo','MEI',85],
    ['Jorge Henrique','MD',79],['Emerson Sheik','ATA',86],['Romarinho','ATA',81],
  ],
  'Atlético-MG 2013': [
    ['Victor','GOL',84],['Marcos Rocha','LD',80],['Réver','ZAG',82],['Leonardo Silva','ZAG',81],
    ['Júnior César','LE',78],['Pierre','VOL',79],['Leandro Donizete','VOL',79],
    ['Ronaldinho','MEI',89],['Bernard','PD',82],['Diego Tardelli','ATA',84],['Jô','ATA',84],
  ],
  'Atlético-MG 2021': [
    ['Everson','GOL',83],['Mariano','LD',80],['Júnior Alonso','ZAG',84],['Nathan Silva','ZAG',81],
    ['Guilherme Arana','LE',83],['Jair','VOL',83],['Allan','MC',82],['Nacho Fernández','MEI',84],
    ['Savarino','MC',84],['Hulk','ATA',87],['Keno','PE',78],['Diego Costa','ATA',80],
  ],
  'Internacional 2006': [
    ['Clemer','GOL',80],['Ceará','LD',79],['Índio','ZAG',81],['Fabiano Eller','ZAG',79],
    ['Wellington','LE',77],['Edinho','VOL',80],['Tinga','MC',81],['Iarley','MEI',81],
    ['Alex','MD',78],['Fernandão','ATA',87],['Rafael Sóbis','ATA',84],['Alexandre Pato','ATA',84],
  ],
  'Cruzeiro 1976': [
    ['Raul','GOL',81],['Nelinho','LD',85],['Joél','ZAG',80],['Rodrigues Neto','ZAG',79],
    ['Zé Carlos','LE',78],['Wilson Piazza','VOL',82],['Dirce','MC',79],['Joãozinho','MC',84],
    ['Jairzinho','PE',90],['Palinha','ATA',87],['Waldo','ATA',80],['Humberto','PD',77],
  ],
  'Fluminense 2023': [
    ['Fábio Flu','GOL',88],['Samuel Xavier','LD',82],['Nino','ZAG',84],['Manoel','ZAG',82],
    ['Marcelo','LE',85],['André','VOL',86],['Alexsander','MC',79],['Ganso Flu','MEI',83],
    ['Jhon Arias','PD',82],['Germán Cano','ATA',85],['Lima Flu','MC',79],['Martinelli','ME',78],
  ],

  // ── ARGENTINA ─────────────────────────────────────────────────

  'Boca Juniors 2000': [
    ['Óscar Córdoba','GOL',84],['Hugo Ibarra','LD',81],['Jorge Bermúdez','ZAG',83],['Walter Samuel','ZAG',87],
    ['Aníbal Matellán','LE',78],['Sebastián Battaglia','VOL',82],['Mauricio Serna','VOL',81],
    ['José Basualdo','MC',82],['Riquelme','MEI',92],['Barros Schelotto','MD',85],
    ['Martín Palermo','ATA',88],['Marcelo Delgado','ATA',82],
  ],
  'Boca Juniors 2007': [
    ['Mauricio Caranta','GOL',80],['Hugo Ibarra','LD',80],['Daniel Díaz','ZAG',80],['Gabriel Paletta','ZAG',79],
    ['Krupoviesa','LE',77],['Sebastián Battaglia','VOL',81],['Ever Banega','MC',82],
    ['Pablo Ledesma','MC',79],['Riquelme','MEI',91],['Rodrigo Palacio','ATA',83],['Martín Palermo','ATA',86],
  ],
  'River Plate 1986': [
    ['Pumpido','GOL',87],['Toresani','LD',79],['Ruggeri','ZAG',86],['Héctor Enrique','ZAG',82],
    ['Gallego','LE',78],['Alonso','VOL',80],['Giusti','MC',83],['Burruchaga','MD',84],
    ['Francescoli','MEI',92],['Gareca','ATA',83],['Alzamendi','ATA',81],['Funes','PD',78],
  ],
  'River Plate 1996': [
    ['Burgos','GOL',82],['Pineda','LD',79],['Zapata','ZAG',82],['Sensini','ZAG',83],
    ['Pereyra','LE',79],['Astrada','VOL',82],['Rambert','MC',80],['Berti','MD',79],
    ['Gallardo','MEI',82],['Francescoli','MEI',88],['Crespo','ATA',86],['Marcelo Salas','ATA',87],
  ],
  'River Plate 2015': [
    ['Barovero','GOL',82],['Mercado','LD',81],['Funes Mori','ZAG',82],['Rojas','ZAG',80],
    ['Vangioni','LE',79],['Kranevitter','VOL',82],['Ponzio','VOL',82],['Sánchez','MEI',82],
    ['Driussi','MD',80],['Alario','ATA',82],['Teo Gutiérrez','ATA',83],['Mora','PE',80],
  ],
  'River Plate 2018': [
    ['Franco Armani','GOL',85],['Gonzalo Montiel','LD',80],['Jonatan Maidana','ZAG',81],['Javier Pinola','ZAG',82],
    ['Milton Casco','LE',78],['Enzo Pérez','VOL',84],['Leonardo Ponzio','VOL',82],
    ['Nacho Fernández','MC',84],['Gonzalo Martínez','MEI',84],['Juanfer Quintero','MEI',84],
    ['Lucas Pratto','ATA',83],['Rafael Borré','ATA',82],
  ],
  'Independiente 1984': [
    ['Fillol','GOL',88],['Galván','LD',80],['Percudani','ZAG',79],['Trossero','ZAG',81],
    ['Tarantini','LE',80],['Marangoni','VOL',80],['Sabella','MC',83],['Bertoni','MD',82],
    ['Bochini','MEI',88],['Larrosa','PE',80],['Alzamendi','ATA',81],['García I','ATA',79],
  ],
  'Estudiantes 1968': [
    ['Madero','GOL',82],['Malbernat','LD',79],['Pachamé','ZAG',80],['Manera','ZAG',78],
    ['Ribaudo','LE',77],['Bilardo','VOL',78],['Flores E','MC',80],['Conigliaro','MD',79],
    ['Verón J','PE',83],['Togneri','MC',78],['Poletti','ATA',82],['Medina','ATA',78],
  ],
  'Estudiantes 2009': [
    ['Migliore','GOL',80],['Cellay','LD',78],['Demichelis','ZAG',85],['Desábato','ZAG',79],
    ['Clemente Rodríguez','LE',81],['Orzán','VOL',78],['Bolatti','MC',81],['Braña','MC',79],
    ['Sánchez E','MEI',81],['Verón J.S.','MEI',88],['Boselli','ATA',83],['Palacio','ATA',82],
  ],
  'Vélez Sársfield 1994': [
    ['Chilavert','GOL',89],['Almandoz','LD',78],['Asad','ZAG',80],['Trotta','ZAG',79],
    ['Morel','LE',77],['Cardenas','VOL',79],['Bassedas','MC',81],['Flores V','MD',80],
    ['Asmar','MEI',80],['Latorre','ATA',83],['Martín Rodríguez','ATA',81],['De la Cruz','PE',79],
  ],
  'San Lorenzo 2014': [
    ['Migliore','GOL',79],['Buffarini','LD',83],['Angeleri','ZAG',81],['Matan','ZAG',79],
    ['Barrientos','LE',79],['Mercier','VOL',80],['Ortigoza','MC',83],['Villalba','MD',81],
    ['Piatti','MEI',83],['Cauteruccio','ATA',83],['Blanco','ATA',80],['Ojeda','PE',78],
  ],

  // ── URUGUAI ───────────────────────────────────────────────────

  'Nacional 1971': [
    ['Manga','GOL',83],['Blanco','LD',79],['Masnik','ZAG',80],['Pavoni','ZAG',79],
    ['Soria','LE',77],['Acuña','VOL',78],['Morales','MC',81],['Cubilla','PD',84],
    ['Espárrago','ATA',82],['Artime','ATA',86],['Zubiría','ME',78],['Méndez','MD',76],
  ],
  'Peñarol 1966': [
    ['Mazurkiewicz','GOL',86],['Pablo Forlán','LD',81],['Roberto Matosas','ZAG',82],['Caetano','ZAG',79],
    ['Walter Aguerre','LE',78],['Néstor Gonçalves','VOL',84],['Ledesma P','MC',80],
    ['Juan Joya','PD',82],['Pedro Rocha','MEI',88],['Alberto Spencer','ATA',90],
    ['Julio C. Cortés','PE',83],['Abbadie','PD',82],
  ],
  'Peñarol 1982': [
    ['Gustavo Fernández','GOL',81],['Víctor Diogo','LD',79],['Nelson Gutiérrez','ZAG',80],
    ['Walter Oliveira','ZAG',80],['Juan V. Morales','LE',78],['Néstor Montelongo','LD',78],
    ['Miguel Bossio','VOL',79],['Mario Saralegui','MC',80],['Jair Gaúcho','MC',81],
    ['Fernando Morena','ATA',86],['Venancio Ramos','ATA',80],['Ernesto Vargas','ATA',79],
  ],

  // ── COLÔMBIA / EQUADOR / PARAGUAI ────────────────────────────

  'Once Caldas 2004': [
    ['Mondragón','GOL',84],['Dinas','LD',80],['Wilson','ZAG',78],['Trejos','ZAG',77],
    ['Morales Caldas','LE',76],['Ruiz','VOL',82],['Viáfara','MC',79],['Bedoya','MC',78],
    ['da Silva O','MEI',79],['Molina','ATA',80],['Marín','ATA',79],['Córdoba','PE',77],
  ],
  'LDU Quito 2008': [
    ['Espinoza','GOL',83],['Arroyo','LD',79],['Miranda','ZAG',80],['De Jesús','ZAG',79],
    ['Campos','LE',77],['Ambrossi','VOL',77],['Calderón','MC',79],['Obregón','MC',80],
    ['Bolaños','MEI',82],['Bieler','ATA',83],['Urrutia','PE',80],['Reasco','PD',79],
  ],
  'Olimpia 2002': [
    ['Villar','GOL',79],['Torales','LD',77],['Ferreira','ZAG',79],['Sarabia','ZAG',78],
    ['González','LE',76],['Acuña','VOL',78],['Báez','MC',79],['Palencia','MD',77],
    ['Sanabria','MEI',78],['Cardozo','ATA',82],['Bonet','ATA',79],['Suárez','PE',77],
  ],

  // ── TIMES ADICIONAIS ─────────────────────────────────────────

  'Botafogo 2024': [
    ['John','GOL',86],['Vitinho','LD',80],['Alexander Barboza','ZAG',83],['Bastos','ZAG',82],
    ['Cuiabano','LE',81],['Gregore','VOL',83],['Marlon Freitas','VOL',85],['Thiago Almada','MEI',86],
    ['Luiz Henrique','PE',85],['Savarino','PD',83],['Igor Jesus','ATA',85],['Eduardo','MD',80],
  ],
  'Cruzeiro 2003': [
    ['Geovani','GOL',80],['Rogério Flávio','LD',78],['Carlos Gamarra','ZAG',84],['Antônio Carlos','ZAG',80],
    ['Éder Lima','LE',78],['Wellington','VOL',79],['Ricardinho','MC',83],['Alex','MEI',88],
    ['Edu','PD',82],['Deivid','ATA',83],['Ramon','ATA',80],['Luizão','ATA',82],
  ],
  'Cruzeiro 2014': [
    ['Fábio','GOL',86],['Mayke','LD',79],['Dedé','ZAG',86],['Léo','ZAG',82],
    ['Egídio','LE',81],['Lucas Silva','VOL',83],['Nilton','VOL',80],['Everton Ribeiro','MEI',85],
    ['Ricardo Goulart','MEI',84],['Marcelo Moreno','ATA',83],['Willian','PE',82],
    ['William Bigode','PE',81],['Dagoberto','ATA',80],['Borges C','ATA',81],
  ],

  // ARGENTINA
  'Racing Club 1967': [
    ['Cejas','GOL',82],['Avallay','LD',79],['Chabay','ZAG',80],['Perfumo','ZAG',87],
    ['Mori','LE',78],['Basile','VOL',81],['Pastoriza','MC',83],['Taccone','MD',79],
    ['Cárdenas','PE',84],['Rulli','ME',79],['Maschio','ATA',83],['Raffo','ATA',80],
  ],
  'Estudiantes 1969': [
    ['Madero','GOL',83],['Malbernat','LD',80],['Aguirre Suárez','ZAG',83],['Manera','ZAG',80],
    ['Ribaudo','LE',78],['Bilardo','VOL',80],['Flores 69','MC',81],['Conigliaro 69','MD',80],
    ['Verón Juan','PE',85],['Poletti 69','ATA',84],['Ferreiro','ATA',81],['Togneri 69','MC',79],
  ],
  'Independiente 1972': [
    ['Miguez','GOL',82],['Galván 72','LD',80],['Montes','ZAG',81],['Commisso','ZAG',80],
    ['Sábato','LE',79],['Villaverde','VOL',80],['Babington','MC',83],['Bochini 72','MEI',86],
    ['Bertoni 72','PD',82],['Ruiz I','PE',80],['Balbuena','ATA',81],['Leva','ATA',79],
  ],
  'Newell\'s Old Boys 1992': [
    ['Scoponi','GOL',82],['Gamboa','LD',79],['Pascuttini','ZAG',80],['Siviski','ZAG',79],
    ['Catala','LE',78],['Llop','VOL',80],['Gorosito','MC',83],['Zamora','MC',79],
    ['Abel Balbo','ATA',85],['Alfaro','MD',79],['Batistuta?','PE',80],['Rinaldi','ATA',79],
  ],
  'Boca Juniors 2001': [
    ['Óscar Córdoba','GOL',85],['Hugo Ibarra','LD',82],['Jorge Bermúdez','ZAG',84],['Walter Samuel','ZAG',87],
    ['Aníbal Matellán','LE',79],['Sebastián Battaglia','VOL',82],['Mauricio Serna','VOL',81],
    ['Riquelme','MEI',91],['Barros Schelotto','MD',85],['Martín Palermo','ATA',87],
    ['Tevez 01','ATA',80],['Traverso','MC',79],
  ],

  // COLÔMBIA
  'Atlético Nacional 1989': [
    ['René Higuita','GOL',89],['Andrés Escobar','ZAG',86],['Gildardo Herrera','ZAG',80],
    ['Luis Fajardo','LD',80],['Eduardo Pimentel','LE',79],['Leonel Álvarez','VOL',83],
    ['Alexis García','MEI',83],['Carlos Estrada','MC',80],['Albeiro Usuriaga','PE',83],
    ['John Tréllez','ATA',83],['Iguarán','ATA',84],['Faustino Asprilla','ATA',81],
  ],
  'Atlético Nacional 2016': [
    ['Franco Armani','GOL',84],['Helibelton Palacios','LD',80],['Alexis Henríquez','ZAG',82],
    ['Dany Cure','ZAG',79],['Cristian Meza','LE',79],['Diego Arias','VOL',80],
    ['Rodrigo Ureña','MC',79],['Macnelly Torres','MEI',84],['Marlos Moreno','MD',81],
    ['Miguel Borja','ATA',84],['Dayro Moreno','ATA',82],['Alejandro Guerra','PE',81],
  ],
  'América de Cali 1987': [
    ['Luis Crena','GOL',79],['Carlos Molina','LD',79],['Abelardo Moreno','ZAG',80],
    ['Elber Rueda','ZAG',79],['Bernardo Redín','LE',79],['Carlos Estrada','VOL',80],
    ['Hector Borja','MC',80],['Willington Ortiz','PE',87],['Albeiro Usuriaga 87','ATA',83],
    ['Jaime Morón','ATA',80],['José Alexis Mera','MC',79],['Victor Bonilla','MD',78],
  ],

  // CHILE
  'Colo-Colo 1991': [
    ['Marcelo Espinoza','GOL',82],['Raúl Ormeño','LD',79],['Oscar Rojas','ZAG',82],
    ['Marcelo Cornejo','ZAG',79],['Marcelo Ramírez','LE',81],['Jaime Pizarro','VOL',81],
    ['Patricio Millas','MC',83],['Carlos Gamboa','MC',82],['Jaime Vera','ME',80],
    ['Marcelo Barticciotto','ATA',86],['Luis Pérez','ATA',80],['Lizardo Garrido','MD',79],
  ],

  // URUGUAI
  'Nacional 1980': [
    ['Rodríguez N','GOL',79],['Véscovi','LD',79],['Montero Castillo','ZAG',82],
    ['Victorino','ZAG',83],['Méndez','LE',78],['Silva Leite','VOL',79],['Peré','MC',81],
    ['Diogo','MC',80],['De León 80','PD',80],['Moráis','ATA',83],['Ramos N','ATA',80],
    ['da Silva N','PE',79],
  ],
  'Peñarol 1987': [
    ['Fernando Álvez','GOL',82],['Gutiérrez P','LD',78],['Montero P','ZAG',80],
    ['Perdomo','ZAG',79],['Revelez','LE',77],['Pereira P','VOL',79],
    ['Bengoechea','MC',83],['Da Silva P','MD',79],['Morena','PE',84],
    ['Cabrera P87','ATA',80],['Paz P87','ATA',79],['Santos P','ME',78],
  ],
  'Nacional 1988': [
    ['Fernando Álvez 88','GOL',82],['Revelez 88','LD',79],['Moraes N','ZAG',82],
    ['Toro','ZAG',80],['Correa N','LE',78],['Chicharro','VOL',79],
    ['Diego Aguirre','MC',85],['González N','MD',79],['Zorrilla','MEI',80],
    ['Ostolaza','ATA',83],['Vargas N','ATA',82],['Perdomo N','ME',78],
  ],

  // PARAGUAI
  'Olimpia 1979': [
    ['Ñiquero','GOL',80],['Fretes','LD',79],['Jara O','ZAG',80],['Cáceres O','ZAG',79],
    ['Bogado','LE',78],['Paredes O','VOL',80],['Centurión','MC',81],
    ['Romerito','MEI',90],['Fernández O','PD',83],['Basualdo O','ME',80],
    ['Amarilla','ATA',83],['Morel O','ATA',79],
  ],
  'Olimpia 1990': [
    ['Fernández 90','GOL',80],['Ovelar','LD',79],['Brizuela','ZAG',80],['Núñez','ZAG',79],
    ['Fretes O','LE',78],['Neffa','VOL',79],['Cubillas O','MC',81],
    ['Ramírez O','MEI',80],['Gamarra 90','ZAG',79],['Caballero O','ATA',80],
    ['Bareiro','ATA',79],['Boyeras','PE',78],
  ],
  'Cerro Porteño 2021': [
    ['Jean Fernández','GOL',81],['Iván Piris','LD',80],['Bruno Valdez','ZAG',82],
    ['Gustavo Gómez 21','ZAG',80],['Freddy Bareiro','LE',79],['Enzo Giménez','VOL',80],
    ['Cristian Báez','MC',79],['Mateo Gamarra','MC',79],['Bernardo Vera','MEI',81],
    ['Rodrigo Rojas','ATA',80],['Gabriel Avalos','ATA',82],['Luis Amarilla','PE',80],
  ],

  // BRASIL
  'Cruzeiro 1997': [
    ['Dida','GOL',87],['Paulo Miranda','LD',79],['Sandro G','ZAG',80],['Luís Henrique','ZAG',79],
    ['Marcinho','LE',79],['Mauro Galvão 97','VOL',81],['Fabinho C','MC',80],['Viola','ME',82],
    ['Warley','MD',82],['Tulio Maravilha','ATA',83],['Assis','ATA',80],['Henrique C','PD',79],
  ],
  'Vasco da Gama 1998': [
    ['Carlos Germano','GOL',82],['Odvan','ZAG',81],['Mauro Galvão 98','ZAG',82],
    ['Rafael Vasco','LD',79],['Flávio V','LE',79],['Carlos Alberto V','VOL',80],
    ['Marcos Assunção','MC',83],['Edmundo','ATA',90],['Romário','ATA',93],
    ['Donizete V','MC',81],['Felipe V','MD',81],['Luizão','ATA',82],
  ],
  'Athletico Paranaense 2022': [
    ['Bento','GOL',83],['Khellven','LD',79],['Pedro Henrique','ZAG',82],['Thiago Heleno','ZAG',81],
    ['Abner','LE',80],['Fernandinho AP','VOL',83],['Hugo Moura','MC',79],
    ['David Terans','MEI',82],['Vitinho AP','PE',80],['Pablo','ATA',82],
    ['Canobbio','MD',80],['Rômulo','ZAG',79],
  ],

  // MÉXICO
  'Tigres UANL 2015': [
    ['Nahuel Guzmán','GOL',83],['Jesús Dueñas','LD',79],['Hugo Ayala','ZAG',80],
    ['Francisco Meza','ZAG',79],['Juninho T','LE',79],['Rafael De Souza','VOL',79],
    ['Jürgen Damm','MD',81],['Lucas Zelarayán','MEI',83],['Ismael Sosa','ME',79],
    ['André-Pierre Gignac','ATA',88],['Damián Álvarez','PE',81],['Israel Villafuerte','MC',78],
  ],
  'Cruz Azul 2001': [
    ['Cristante','GOL',80],['Francisco Palencia','LD',81],['Del Olmo','ZAG',80],
    ['Giménez Cruz','ZAG',79],['Fernández Cruz','LE',78],['Gerardo Torrado','VOL',82],
    ['Héctor Coudet','MC',82],['Francisco Fonseca','PE',79],
    ['Jared Borgetti','ATA',85],['Carlos Hermosillo','ATA',83],['Graziani Cruz','MD',79],
  ],

  // EQUADOR
  'Barcelona SC 1990': [
    ['Jacinto Espinoza','GOL',80],['Álvarez BC','LD',79],['Ludeña','ZAG',80],
    ['Lemos BC','ZAG',79],['Suárez BC','LE',78],['Jaime BC','VOL',79],
    ['Poroso','MC',80],['Paúl Vélez','MEI',83],['Mina BC','MD',79],
    ['Rómulo Crespo','ATA',82],['Muñoz BC','ATA',80],['Pita','PE',79],
  ],
}

// ── Jersey numbers (camisa) ───────────────────────────────────────────────────
// Key: DB club name → player name → shirt number
export const JERSEY: Record<string, Record<string, number>> = {
  'Santos 1963': {
    'Gilmar':1,'Lima':2,'Dalmo':3,'Mauro Ramos':4,'Calvet':5,
    'Zito':6,'Dorval':7,'Mengálvio':8,'Coutinho':9,'Pelé':10,'Pepe':11,'Pagão':19,
  },
  'Santos 2011': {
    'Rafael':1,'Léo':2,'Bruno Rodrigo':3,'Edu Dracena':4,'Durval':5,
    'Arouca':6,'Robinho':7,'Elano':8,'Borges':9,'Ganso':10,'Neymar':11,'Alan Patrick':17,
  },
  'Flamengo 1981': {
    'Raul':1,'Leandro':2,'Marinho':3,'Mozer':4,'Andrade':5,
    'Júnior':6,'Tita':7,'Adílio':8,'Nunes':9,'Zico':10,'Lico':11,'Baroninho':16,
  },
  'Flamengo 2019': {
    'Diego Alves':1,'Rafinha':2,'Rodrigo Caio':3,'Pablo Marí':4,'Willian Arão':5,
    'Filipe Luís':16,'Éverton Ribeiro':7,'Gerson':8,'Gabigol':10,'Bruno Henrique':27,
    'Pedro':21,'Arrascaeta':14,'Diego Ribas':35,
  },
  'Flamengo 2022': {
    'Santos':22,'Rodinei':2,'Léo Pereira':5,'David Luiz':23,'Filipe Luís':16,
    'Thiago Maia':29,'João Gomes':20,'Pedro Flamengo':9,'Gabigol':10,
    'Arrascaeta':14,'Éverton Cebolinha':11,'Matheus França':25,
  },
  'São Paulo 1993': {
    'Zetti':1,'Cafu':2,'Antônio Carlos':3,'Ronaldão':4,'Pintado':5,
    'Válber':6,'Müller':7,'Toninho Cerezo':8,'Palhinha':9,'Raí':10,'Macedo':11,'Dinho':13,
  },
  'Palmeiras 1999': {
    'Marcos':1,'Arce':2,'Júnior':3,'Júnior Baiano':4,'Roque Júnior':5,
    'César Sampaio':6,'Alex':7,'Rogério':8,'Oséas':9,'Zinho':10,'Paulo Nunes':11,'Asprilla':17,
  },
  'Palmeiras 2021': {
    'Weverton':21,'Marcos Rocha':2,'Luan':13,'Gustavo Gómez':15,'Piquerez':22,
    'Danilo':28,'Zé Rafael':8,'Raphael Veiga':23,'Gabriel Menino':26,'Dudu':7,'Rony':11,
    'Breno Lopes':18,'Felipe Melo':30,
  },
  'Grêmio 1983': {
    'Mazaropi':1,'Caio Júnior':2,'Clemer':3,'Mauro Galvão':4,'Casagrande':5,
    'Bino':6,'Paulo César':7,'Caça-Rato':8,'Osvaldo':9,'Renato Gaúcho':10,'Tita':11,'Paulo Nunes':19,
  },
  'Grêmio 2017': {
    'Marcelo Grohe':1,'Léo Moura':2,'Pedro Geromel':3,'Kannemann':4,'Maicon':5,
    'Bruno Cortez':6,'Luan Grêmio':7,'Arthur':8,'Fernandinho G':21,'Everton Ceará':11,'Lucas Barrios':9,'Ramiro':17,
  },
  'Corinthians 2012': {
    'Cássio':12,'Alessandro':2,'Fábio Santos':6,'Chicão':4,'Leandro Castán':5,
    'Ralf':8,'Jorge Henrique':7,'Paulinho':5,'Danilo':17,'Emerson Sheik':10,'Romarinho':21,
  },
  'Atlético-MG 2013': {
    'Victor':1,'Marcos Rocha':2,'Réver':4,'Leonardo Silva':3,'Júnior César':6,
    'Pierre':5,'Leandro Donizete':8,'Bernard':7,'Ronaldinho':10,'Diego Tardelli':9,'Jô':99,
  },
  'Atlético-MG 2021': {
    'Everson':1,'Mariano':22,'Júnior Alonso':14,'Nathan Silva':5,'Guilherme Arana':6,
    'Jair':8,'Allan':5,'Nacho Fernández':10,'Savarino':17,'Hulk':7,'Keno':11,'Diego Costa':9,
  },
  'Internacional 2006': {
    'Clemer':1,'Ceará':2,'Índio':3,'Fabiano Eller':5,'Wellington':6,
    'Edinho':8,'Tinga':4,'Iarley':10,'Alex':7,'Fernandão':9,'Rafael Sóbis':11,'Alexandre Pato':17,
  },
  'Cruzeiro 1976': {
    'Raul':1,'Nelinho':2,'Zé Carlos':3,'Rodrigues Neto':4,'Joél':5,
    'Wilson Piazza':6,'Humberto':7,'Dirce':8,'Palinha':9,'Joãozinho':10,'Jair Cruzeiro':11,'Waldo':19,
  },
  'Fluminense 2023': {
    'Fábio Flu':1,'Samuel Xavier':2,'Nino':3,'Manoel':4,'Alexsander':5,
    'André':6,'Jhon Arias':7,'Lima Flu':8,'Germán Cano':14,'Ganso Flu':10,'Martinelli':18,'Marcelo':12,
  },
  'Boca Juniors 2000': {
    'Óscar Córdoba':1,'Hugo Ibarra':2,'Aníbal Matellán':3,'Jorge Bermúdez':4,'Walter Samuel':5,
    'Mauricio Serna':6,'Barros Schelotto':7,'Sebastián Battaglia':8,'Marcelo Delgado':11,
    'Riquelme':10,'Martín Palermo':9,'José Basualdo':17,
  },
  'Boca Juniors 2007': {
    'Mauricio Caranta':1,'Hugo Ibarra':2,'Daniel Díaz':3,'Gabriel Paletta':4,'Krupoviesa':6,
    'Sebastián Battaglia':8,'Pablo Ledesma':5,'Ever Banega':17,'Riquelme':10,'Rodrigo Palacio':11,'Martín Palermo':9,
  },
  'River Plate 1986': {
    'Pumpido':1,'Toresani':2,'Gallego':3,'Héctor Enrique':4,'Ruggeri':5,
    'Alonso':6,'Burruchaga':7,'Giusti':8,'Alzamendi':11,'Francescoli':10,'Gareca':9,'Funes':17,
  },
  'River Plate 1996': {
    'Burgos':1,'Pineda':2,'Pereyra':3,'Sensini':4,'Zapata':5,
    'Astrada':6,'Berti':7,'Rambert':8,'Marcelo Salas':11,'Francescoli':10,'Crespo':9,'Gallardo':17,
  },
  'River Plate 2015': {
    'Barovero':1,'Mercado':2,'Rojas':3,'Funes Mori':4,'Kranevitter':5,
    'Vangioni':6,'Driussi':7,'Ponzio':8,'Alario':9,'Sánchez':10,'Teo Gutiérrez':11,'Mora':17,
  },
  'River Plate 2018': {
    'Franco Armani':1,'Javier Pinola':2,'Milton Casco':3,'Leonardo Ponzio':4,'Jonatan Maidana':5,
    'Enzo Pérez':6,'Nacho Fernández':7,'Gonzalo Montiel':8,'Lucas Pratto':9,'Juanfer Quintero':10,
    'Gonzalo Martínez':11,'Rafael Borré':19,
  },
  'Independiente 1984': {
    'Fillol':1,'Galván':2,'Tarantini':3,'Percudani':4,'Trossero':5,
    'Marangoni':6,'Bertoni':7,'Sabella':8,'García I':11,'Bochini':10,'Alzamendi':9,'Larrosa':17,
  },
  'Estudiantes 1968': {
    'Madero':1,'Malbernat':2,'Ribaudo':3,'Manera':4,'Pachamé':5,
    'Bilardo':6,'Conigliaro':7,'Flores E':8,'Poletti':9,'Verón J':10,'Medina':11,'Togneri':17,
  },
  'Estudiantes 2009': {
    'Migliore':1,'Cellay':2,'Clemente Rodríguez':3,'Desábato':4,'Demichelis':5,
    'Orzán':6,'Sánchez E':7,'Bolatti':8,'Boselli':9,'Verón J.S.':10,'Palacio':11,'Braña':17,
  },
  'Vélez Sársfield 1994': {
    'Chilavert':1,'Almandoz':2,'Morel':3,'Trotta':4,'Asad':5,
    'Cardenas':6,'Flores V':7,'Bassedas':8,'Martín Rodríguez':9,'Asmar':10,'Latorre':11,'De la Cruz':17,
  },
  'San Lorenzo 2014': {
    'Migliore':1,'Buffarini':2,'Angeleri':3,'Matan':4,'Mercier':5,
    'Barrientos':6,'Villalba':7,'Ortigoza':8,'Cauteruccio':9,'Piatti':10,'Blanco':11,'Ojeda':17,
  },
  'Nacional 1971': {
    'Manga':1,'Blanco':2,'Soria':3,'Masnik':4,'Pavoni':5,
    'Acuña':6,'Cubilla':7,'Zubiría':8,'Artime':9,'Morales':10,'Espárrago':11,'Méndez':17,
  },
  'Peñarol 1966': {
    'Mazurkiewicz':1,'Pablo Forlán':2,'Walter Aguerre':3,'Caetano':4,'Roberto Matosas':5,
    'Ledesma P':6,'Juan Joya':7,'Néstor Gonçalves':8,'Alberto Spencer':9,'Pedro Rocha':10,'Julio C. Cortés':11,'Abbadie':17,
  },
  'Peñarol 1982': {
    'Gustavo Fernández':1,'Víctor Diogo':2,'Walter Oliveira':3,'Nelson Gutiérrez':4,'Néstor Montelongo':5,
    'Juan V. Morales':6,'Mario Saralegui':7,'Miguel Bossio':8,'Fernando Morena':9,'Jair Gaúcho':10,
    'Venancio Ramos':11,'Ernesto Vargas':17,
  },
  'Once Caldas 2004': {
    'Mondragón':1,'Dinas':2,'Trejos':3,'Wilson':4,'Ruiz':5,
    'Morales Caldas':6,'Córdoba':7,'Viáfara':8,'Molina':9,'da Silva O':10,'Marín':11,'Bedoya':17,
  },
  'LDU Quito 2008': {
    'Espinoza':1,'Arroyo':2,'De Jesús':3,'Miranda':4,'Ambrossi':5,
    'Campos':6,'Reasco':7,'Calderón':8,'Bieler':9,'Bolaños':10,'Urrutia':11,'Obregón':17,
  },
  'Olimpia 2002': {
    'Villar':1,'Torales':2,'González':3,'Ferreira':4,'Sarabia':5,
    'Acuña':6,'Palencia':7,'Báez':8,'Cardozo':9,'Sanabria':10,'Bonet':11,'Suárez':17,
  },
  'Botafogo 2024': {
    'John':1,'Vitinho':2,'Alexander Barboza':4,'Bastos':5,'Cuiabano':6,
    'Gregore':8,'Marlon Freitas':5,'Thiago Almada':10,'Eduardo':22,'Luiz Henrique':7,
    'Savarino':11,'Igor Jesus':9,
  },
  'Cruzeiro 2003': {
    'Geovani':1,'Rogério Flávio':2,'Antônio Carlos':3,'Carlos Gamarra':4,'Éder Lima':6,
    'Wellington':5,'Ricardinho':8,'Edu':7,'Alex':10,'Deivid':9,'Ramon':11,'Luizão':19,
  },
  'Cruzeiro 2014': {
    'Fábio':1,'Mayke':2,'Léo':3,'Dedé':4,'Egídio':6,
    'Nilton':5,'Lucas Silva':8,'Willian':7,'Everton Ribeiro':10,'Ricardo Goulart':9,
    'Marcelo Moreno':11,'William Bigode':17,'Dagoberto':19,'Borges C':99,
  },
}

// ── CPU teams (for standalone quick match fallback) ────────────────────────────
export interface CpuTeam { n: string; s: string[] }

export const CPU_TEAMS: CpuTeam[] = [
  { n:'Estudiantes 1968',    s:['Verón','Conigliaro','Flores'] },
  { n:'Cruzeiro 1976',       s:['Palinha','Joãozinho','Nelinho'] },
  { n:'Olimpia 2002',        s:['Ferreira','Báez','Sanabria'] },
  { n:'LDU Quito 2008',      s:['Bieler','Bolaños','Urrutia'] },
  { n:'Once Caldas 2004',    s:['Dinas','Ruiz','Viáfara'] },
  { n:'San Lorenzo 2014',    s:['Cauteruccio','Villalba','Buffarini'] },
  { n:'Nacional 1971',       s:['Cubilla','Artime','Espárrago'] },
  { n:'Peñarol 1966',        s:['Spencer','Pedro Rocha','Cortés'] },
  { n:'Independiente 1984',  s:['Bochini','Bertoni','Sabella'] },
  { n:'Vélez Sársfield 1994',s:['Chilavert','Latorre','Bassedas'] },
  { n:'River Plate 1986',    s:['Francescoli','Burruchaga','Gareca'] },
  { n:'Grêmio 1983',         s:['Renato Gaúcho','Osvaldo','Tita'] },
]
