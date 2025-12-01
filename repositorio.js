// arquivo repositorio.js
import { readFileSync } from 'node:fs';

export default class Repositorio {
    constructor() {
      this.pecas = JSON.parse(readFileSync('./pecas.json'));
    }
  
    getPeca(apre) {
      return this.pecas[apre.id];
    }
}
