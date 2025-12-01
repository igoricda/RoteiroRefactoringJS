const { readFileSync } = require('fs');

function gerarFaturaStr (fatura, pecas) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
  
    for (let apre of fatura.apresentacoes) {
      faturaStr += `  ${getPeca(apre).nome}: ${formatarMoeda(calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura())}\n`;
    faturaStr += `Créditos acumulados: ${calcularTotalCreditos()} \n`;
    return faturaStr;
  }

function gerarFaturaHTML(fatura, pecas){
	let faturaHTML = `<html>\n<p> Fatura ${fatura.cliente} </p>\n<ul>\n`

    for (let apre of fatura.apresentacoes) {
      faturaHTML += `<li>  ${getPeca(apre).nome}: ${formatarMoeda(calcularTotalApresentacao(apre))} (${apre.audiencia} assentos) </li>\n`;
    }
	faturaHTML += `</ul>\n`
    faturaHTML += `<p> Valor total: ${formatarMoeda(calcularTotalFatura())} </p>\n`;
    faturaHTML += `<p> Créditos acumulados: ${calcularTotalCreditos()} </p> \n`;
	faturaHTML += `</html>`;
    return faturaHTML;

}


    function calcularTotalApresentacao(apre){
      let total = 0;
	const peca = getPeca(apre);

      switch (peca.tipo) {
      case "tragedia":
	total = 40000;
	if (apre.audiencia > 30) {
	  total += 1000 * (apre.audiencia - 30);
	}
	break;
      case "comedia":
	total = 30000;
	if (apre.audiencia > 20) {
	   total += 10000 + 500 * (apre.audiencia - 20);
	}
	total += 300 * apre.audiencia;
	break;
      default:
	  throw new Error(`Peça desconhecia: ${peca.tipo}`);
      }
	return total;
	}
function getPeca(apresentacao){
	return pecas[apresentacao.id];
}

// função extraída
function calcularCredito(apre) {
	let creditos = 0;
	creditos += Math.max(apre.audiencia - 30, 0);
	if (getPeca(apre).tipo === "comedia") 
		creditos += Math.floor(apre.audiencia / 5);
	return creditos;   
}

function calcularTotalFatura(){
let total = 0;


 for (let apre of faturas.apresentacoes){

  total += calcularTotalApresentacao(apre);

 }


 return total;
}

function calcularTotalCreditos(){
	let creditos =0;
	for(let apre of faturas.apresentacoes){
		creditos+= calcularCredito(apre);
	}
	return creditos
}

// função extraída
    function formatarMoeda(valor) {
      return new Intl.NumberFormat("pt-BR",
        { style: "currency", currency: "BRL",
          minimumFractionDigits: 2 }).format(valor/100);
    }


const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
const faturaHTML = gerarFaturaHTML(faturas, pecas);
console.log(faturaStr);
console.log(faturaHTML);
