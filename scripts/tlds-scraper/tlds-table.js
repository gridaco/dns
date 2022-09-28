const fs = require("fs");
const path = require("path");
const mdspath = path.join(__dirname, "../../docs");
const marked = require("marked");

/**
 * table configuration for parsing
 */
const sources = [
  {
    name: "aws",
    file: "tlds-aws.md",
    tld: "TLD Name",
    price: "Price $",
  },
  {
    name: "dnsimple",
    file: "tlds-dnsimple.md",
    tld: "tld",
    price: "price",
  },
  {
    name: "gcp",
    file: "tlds-gcp.md",
    tld: "tld",
    price: "price",
  },
];

// read the file, fetch the table (if multiple tables found, throw.)
// create map of tld to price by providers
// key: tld
// values: { aws: 100, dnsimple: 10, gcp: 5 }

const tldPriceMap = {};

sources.forEach((source) => {
  try {
    const file = fs.readFileSync(path.join(mdspath, source.file), "utf8");
    const tokens = marked.lexer(file);
    // console.log(tokens);
    const table = tokens.find((token) => token.type === "table");
    if (!table) {
      throw new Error("no table found in " + source.file);
    }
    // console.log(table.header);
    const tldIndex = table.header.findIndex((h) => h.text === source.tld);
    const priceIndex = table.header.findIndex((h) => h.text === source.price);
    table.rows.forEach((row) => {
      // console.log(row);

      let tld = row[tldIndex].text;
      if (!tld.startsWith(".")) {
        tld = "." + tld;
      }

      let price = row[priceIndex].text;
      if (!price.startsWith("$")) {
        price = "$" + price;
      }

      if (!tldPriceMap[tld]) {
        tldPriceMap[tld] = {};
      }
      tldPriceMap[tld][source.name] = price;
    });
  } catch (e) {
    console.error('error parsing file "' + source.file + '"');
    throw e;
  }
});

// create a table from the map
// key: tld
// values: { aws: 100, dnsimple: 10, gcp: 5 }
// output:
// | tld | aws | dnsimple | gcp |
// | --- | --- | --- | --- |
// | .com | 100 | 10 | 5 |
// | .net | 100 | 10 | 5 |
// | .org | 100 | 10 | 5 |

const wrap = (text) => "| " + text + " |";
const tlds = Object.keys(tldPriceMap);
const header = wrap(["tld", ...sources.map((s) => s.name)].join(" | "));
const divider = wrap(["---", ...sources.map((s) => "---")].join(" | "));
const rows = tlds.sort().map((tld) => {
  const prices = sources.map((s) => tldPriceMap[tld][s.name]);
  return wrap([tld, ...prices].join(" | "));
});

const table = [header, divider, ...rows].join("\n");

console.log(table);
