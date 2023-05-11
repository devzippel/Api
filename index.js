const express = require('express');
const request = require('request');
require("dotenv").config({ path: ".env" });
const port = 8085;
const BSC_API_KEY = process.env.BSC_API_KEY;

const app = express();

// Defina a rota para a consulta do token circulante
app.get('/circulating-supply', (req, res) => {
  // Defina as informações do token e os endereços que deseja verificar
  const token_contract_address = "0xda2c0cdf7d764f8c587380cadf7129e5ecb7efb7";
  const addresses_to_check = ["0x000000000000000000000000000000000000dead"];

  // Atribua diretamente o valor total de tokens emitidos à variável total_supply
  const total_supply = 500000000000 * 10**18;

  // Faz uma solicitação para obter os saldos das contas dos endereços específicos
  const account_balance_url_template = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${token_contract_address}&address={{address}}&apikey=${BSC_API_KEY}`;

  const address_balances = [];
  let addresses_checked = 0;
  
  addresses_to_check.forEach((address) => {
      const url = account_balance_url_template.replace("{{address}}", address);
      request(url, (error, response, body) => {
          const balance = parseInt(JSON.parse(body).result);
          address_balances.push(balance);
          addresses_checked++;
          if (addresses_checked === addresses_to_check.length) {
            // Calcula o total circulante e retorna o resultado como JSON
            const total_circulating = (total_supply - address_balances.reduce((a, b) => a + b, 0));
            const total = total_circulating / 10**18;
            res.json((total));
          }          
      });
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Listening for API Calls`);
});
