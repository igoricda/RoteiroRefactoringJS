import ServicoCalculoFatura from './servico.js';
import Repositorio from './repositorio.js';
import { readFileSync } from 'node:fs';
import {gerarFaturaStr, gerarFaturaHTML} from './apresentacao.js';

// main
const faturas = JSON.parse(readFileSync('./faturas.json'));
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);
