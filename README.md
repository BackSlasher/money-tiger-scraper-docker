# Money Tiger scraper
Scrape your data from banks / credit cards and upload to Money Tiger

💰️🐯

## Parameters via Envvars
* `CONFIG`: JSON config (or the filename where such a config can be found)
* `API_TOKEN`: Token for the Money Tiger API
* `SHOW_BROWSER`: Set to non-falsy value to show the browser while processing
* `SELECTOR`: If not empty, filter companies by this regex
* `TIGER_URL`: Override the default Money Tiger URL

## Config

JSON array of objects containing a company ID and credentials:

```json
[
  {
    "company": "AAAA",
    "credentials": {
        "username": "best",
        "password": "incorrect"
    }
  },
  {
    "company": "MonopolyBank",
    "credentials": {
        "id": "1234567",
        "password": "secret",
        "card6digits": "123456"
    }
  }
]
```

The list of valid company IDs can be found [here][1].

## Running
Download and run the Docker image:
```
docker pull backslasher/money-tiger-scraper
docker run --rm -e API_TOKEN=AAAAAA -e CONFIG=BIG_BLOB backslasher/money-tiger-scraper
```

## Developing
Run nodejs:
```
npm install
SHOW_BROWSER=1 PARAMETERS=HERE node src/index.js
```
Via Docker:
```
docker build . -t teste && docker run --rm -e API_TOKEN=TOKEN -e CONFIG=CONFIG teste
```

[1]: https://github.com/eshaham/israeli-bank-scrapers/blob/82d6277d348180e5d61ad52f19fff23b0834fc5d/src/definitions.ts#L5-L22
