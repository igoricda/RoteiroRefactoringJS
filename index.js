const { readFileSync } = require('fs');

function gerarFaturaStr (fatura, pecas, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
  
    for (let apre of fatura.apresentacoes) {
      faturaStr += `  ${getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura())}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos()} \n`;
    return faturaStr;
  }

function gerarFaturaHTML(fatura, pecas, calc){
	let faturaHTML = `<html>\n<p> Fatura ${fatura.cliente} </p>\n<ul>\n`

    for (let apre of fatura.apresentacoes) {
      faturaHTML += `<li>  ${getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos) </li>\n`;
    }
	faturaHTML += `</ul>\n`
    faturaHTML += `<p> Valor total: ${formatarMoeda(calc.calcularTotalFatura())} </p>\n`;
    faturaHTML += `<p> Créditos acumulados: ${calc.calcularTotalCreditos()} </p> \n`;
	faturaHTML += `</html>`;
    return faturaHTML;

}


class ServicoCalculoFatura{
	    calcularTotalApresentacao(apre){
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

	// função extraída
	calcularCredito(apre) {
		let creditos = 0;
		creditos += Math.max(apre.audiencia - 30, 0);
		if (getPeca(apre).tipo === "comedia") 
			creditos += Math.floor(apre.audiencia / 5);
		return creditos;   
	}

	calcularTotalFatura(){
	let total = 0;


	 for (let apre of faturas.apresentacoes){

	  total += this.calcularTotalApresentacao(apre);

	 }


	 return total;
	}

	calcularTotalCreditos(){
	
		let creditos =0;
		for(let apre of faturas.apresentacoes){
			creditos+= this.calcularCredito(apre);
		}
		return creditos
	}

}

// função extraída
    function formatarMoeda(valor) {
      return new Intl.NumberFormat("pt-BR",
        { style: "currency", currency: "BRL",
          minimumFractionDigits: 2 }).format(valor/100);
    }


	function getPeca(apresentacao){
		return pecas[apresentacao.id];
	}
const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const calc = new ServicoCalculoFatura();
const faturaStr = gerarFaturaStr(faturas, pecas, calc);
const faturaHTML = gerarFaturaHTML(faturas, pecas, calc);
console.log(faturaStr);
console.log(faturaHTML);
