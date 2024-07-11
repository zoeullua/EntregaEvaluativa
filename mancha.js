class Mancha {

    constructor(grandes, finas, grises, pgGrises, pgNegras) {
      this.grandes = grandes;
      this.finas = finas;
      this.grises = grises;
      this.pgGrises = pgGrises;
     this.pgNegras = pgNegras;
    }
  
    fondo() {
      background(247, 247, 247);
    }
    dibujar() {
      let cualgrandes = int(random(this.grandes.length));  // elijo foto random de entre grandes
      let cualfinas = int(random(this.finas.length));  // repito dos veces
      let cualgrises = int(random(this.grises.length));

      if (frequency < 210) {
        this.pgNegras.tint(22, 11, 5); // Tinte para manchas grandes negras
        this.pgNegras.image(this.grandes[cualgrandes], random(-100, 500), random(-100, 450), 400, 400);

      } else if (frequency > 210 && frequency < 350) {
        this.pgGrises.tint(209, 202, 174, 150); // Tinte para manchas grises
        this.pgGrises.image(this.grises[cualgrises], random(-100, 500), random(-100, 450), 400, 400);

      } else if (frequency >= 350) { // sonido agudo
        this.pgNegras.tint(22, 11, 5); // Tinte para manchas finas negras
        this.pgNegras.image(this.finas[cualfinas], random(-100, 500), random(-100, 450), 150, 150);
      }
    }

    moverCapas() {
      let movidoX = random(-2, 2);
      let movidoY = random(-2, 2);
    
      clear();
      push(); // guardo la configuración actual de dibujo
      translate(movidoX, movidoY); // desplazo
      image(this.pgGrises, 0, 0); // dibujo la capa desplazada
      pop(); // resaturo la config de dibujo
  
      translate(movidoX, movidoY);
      // dibujo la capa de negras desplazada, repito proceso
      push(); 
      image(this.pgNegras, 0, 0); 
      pop();
      clear();

  }
}