'use strict';
const assert = require('node:assert/strict');
const https = require('https');
const axios = require('axios');
const { CompanyTypes, createScraper } = require('israeli-bank-scrapers');

function checkForDemo() {
  const api_token = process.env.API_TOKEN;
  assert(api_token);
  if (api_token == "CHANGEME") {
    console.log("This is a test. Change the API token!");
    process.exit();
  }
}

function parse_args() {
  const config_raw = process.env.CONFIG;
  assert(config_raw);
  const config = JSON.parse(config_raw);
  const tiger_url = process.env.TIGER_URL || "https://real.money-tiger.tech/api/import";
  const api_token = process.env.API_TOKEN;
  assert(api_token);
  const show_browser = Boolean(process.env.SHOW_BROWSER);
  const selector = process.env.SELECTOR;

  return {config, tiger_url, api_token, show_browser, selector};
}

async function sendResults(company, api_token, tiger_url, result) {
  const res = await axios.post(tiger_url, result, {
    headers: {
      Authorization: `Bearer ${api_token}`,
      Company: company,
    },
  });
  return res;
}

async function scrape(company, credentials, show_browser) {
  const options = {
    companyId: company,
    // startDate: args.start_date,
    // combineInstallments: args.combine_installments,
    showBrowser: show_browser,
    args: ['--no-sandbox'],
  };

  const scraper = createScraper(options);
  return await scraper.scrape(credentials);
}

async function main() {
  checkForDemo();
  const {config, tiger_url, api_token, show_browser, selector} = parse_args();
  // Intentionally serial-waiting because I don't want two concurrent operations
  for (const {company, credentials} of config) {
    if (selector && ! new RegExp(selector).test(company)) {
      continue;
    }
    const scrapeResult = await scrape(company, credentials, show_browser);
    console.log(`Company: ${company}, scrape success: ${scrapeResult.success}`);
    const res = await sendResults(company, api_token, tiger_url, scrapeResult);
    console.log("Report:", res.status, res.data);
  }
}

(async function() {await main();})().catch((error)=>{throw error;}).then(()=>{process.exit()});
