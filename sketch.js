// ZOE ULLUA, COMISION LISANDRO. LEGAJO: 94705/3
// ENTREGA FINAL
// 3 INTERACCIONES: LA 1ERA SEGÚN EL TONO (GRAVE, AGUDO, MEDIO) EL TIPO DE MANCHAS
// LA 2DA SI EL SONIDO SE SOSTIENE MÁS DE 2 SEGUNDOS EMPIEZAN A TEMBLAR LAS MANCHAS
// LA 3RA SI HAY UN APLAUSO SE REINICIA LA OBRA.

// MANCHAS ----------------------------
let finas = []; // contiene todos los trazos finos
let grandes = []; // contiene trazos grandes
let grises = [];// contiene trazos grises
let cantidadfinas = 7;
let cantidadgrandes = 10;
let cantidadgrises = 4;

let contadordetrazos = 17;  // Límite de manchas en pantalla
let contadordetiempo = 0;   // Inicializa el contador de tiempo

let sostenido = false;
let mancha;  // clase
let pgGrises;  // implementacion de pgraphics
let pgNegras;

// MICROFONO ---------------------------------
let mic; // microfono
let amp; // amplitud o volumen
let AMP_MIN = 0.03;
let tiempoInicioSostenido = 0; // Variable para almacenar el tiempo de inicio del sonido sostenido
let dibujarPermitido = true;

let pitch;
let audioContext;
const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
let frequency = 0;

// TEACHABLE MACHINE, APLAUSO ---------------------
// Global variable to store the classifier
let classifier;

// Label
let label = 'listening...';
 
// Teachable Machine model URL:
let soundModel = 'https://teachablemachine.withgoogle.com/models/b1au2k1R3/';





// CARGO LAS FOTOS DE MANCHAS DE PINTURA. ---------------------
function preload(){

  // cargo las finas
  for( let i=0 ; i<cantidadfinas ; i++ ){
    let nombre = "data/finas"+nf(i,2)+".png";
    finas[i] = loadImage( nombre );
  }

  // cargo las grandes
  for( let i=0 ; i<cantidadgrandes ; i++ ){
    let nombre = "data/grandes"+nf(i,2)+".png";
    grandes[i] = loadImage( nombre );
  }

  // cargo las grises
  for( let i=0 ; i<cantidadgrandes ; i++ ){
    let nombre = "data/grandes"+nf(i,2)+".png";
    grises[i] = loadImage( nombre );
  }
  // cargo el aplauso
  classifier = ml5.soundClassifier(soundModel + 'model.json');
}

function setup() {
  createCanvas(550, 620); // ancho parecido a las obras!!
  background(247, 247, 247);  // color de fondo parecido a la obra
  imageMode( CENTER );

  pgGrises = createGraphics(550, 620);
  pgNegras = createGraphics(550, 620);
  mancha = new Mancha(grandes, finas, grises, pgGrises, pgNegras); // inicializo mancha

  mic = new p5.AudioIn(); // objeto que se comunica con la entrada del microfono
  mic.start(); // inicializo el microfono
  audioContext = getAudioContext();
  mic.start(startPitch);
  userStartAudio();

  contadordetiempo = millis(); //inicializo el contador
 classifier.classify(gotResult);
}

function draw() {

    amp = mic.getLevel();
    mancha.fondo();
    // verifico si pasaron 1 seg (1000 ms) desde la última mancha, si hay ruido y si faltan manchas para dibujar,
    // y si sí, se permite dibujar.
    if (!sostenido && dibujarPermitido && millis() - contadordetiempo >= 1000 && amp >= AMP_MIN && !sostenido && contadordetrazos > 0) {
      mancha.dibujar(frequency);  // dibujo las manchas
      contadordetiempo = millis(); // reinicio el contador de tiempo
      contadordetrazos--; // resto un punto al contador de manchas
    }
  console.log(sostenido);
    // si el sonido es sostenido por más de 2 segundos activo el movimiento de las capas
    if (amp >= AMP_MIN) {
      if (!sostenido) {
        tiempoInicioSostenido = millis(); // inicia el contador para sonido sostenido
        sostenido = true;
        dibujarPermitido = false; // no permitir dibujar mientras se sostiene el sonido
      } else if (millis() - tiempoInicioSostenido >= 800) {
        mancha.moverCapas();
        dibujarPermitido = false; // mover las capas si el sonido fue sostenido por más de 2 segundos
      }
    } else {
      if (sostenido) {
        // el sonido cayó y el movimiento de las capas terminó
        sostenido = false;
        dibujarPermitido = true; // permitir dibujar nuevamente
      }
    }

  // console.log("amplitud: " + amp);
   // console.log(sostenido);

    image(pgGrises, width / 2, height / 2); // pgGrises primero
    image(pgNegras, width / 2, height / 2); // pgNegras encima de pgGrises
  }


  // PITCH DETECTION ----------------------------------
  function startPitch() {
    pitch = ml5.pitchDetection(model_url, audioContext , mic.stream, modelLoaded);
  }
  
  function modelLoaded() {
    getPitch();
  }
  
  function getPitch() {
    pitch.getPitch(function(err, freq) {
      if (freq) {
        frequency = freq;
        console.log("FRECUENCIA:" + frequency);
       }
      getPitch();
    })
  }

  // TEACHABLE MACHINE, APLAUSO ------------------
  function gotResult(error, results) {
    if (error) {
      console.error(error);
      return;
    }
  let predictedLabel = results[0].label;
  let confidence = results[0].confidence;

  // muestro label y confianza en la consola
   console.log(predictedLabel + ': ' + confidence);

  // verifico si la confianza en aplauso es mayor a 0.7
  if (predictedLabel === 'Aplausos' && confidence > 0.96) {
    // si pasa, reinicio la obra
    background(247, 247, 247);  
    pgGrises.clear(); // limpio pgGrises
    pgNegras.clear(); // limpio pgNegras
    contadordetrazos = 17; // restablezco el contador
    dibujarPermitido = true; 
    sostenido = false;
  }
  label = predictedLabel;
}