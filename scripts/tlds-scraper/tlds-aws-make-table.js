///
/// converts content from https://d32ze2gidvkk54.cloudfront.net/Amazon_Route_53_Domain_Registration_Pricing_20140731.pdf
/// to a .md table contents
///

// COPY & PASTE FULL CONTENT HERE. - BELOW IS PARTIAL EXAMPLE.
const raw = `adult $100.00 $0.00 $160.00 $100.00 Renewed with transfer
agency $19.00 $0.00 $73.00 $19.00 Renewed with transfer
apartments $47.00 $0.00 $100.00 $47.00 Renewed with transfer
`;

const lines = raw.split("\n");
const columns = lines
  .map((line) => {
    line = line.replace(/Renewed with transfer/g, "renewed-with-transfer");
    line = line.replace(/No change/g, "no-change");
    line = line.replace(/Not supported/g, "not-supported");
    rows = line.split(" ");
    const column = "| " + rows.join(" | ") + " |";
    return column;
  })
  .join("\n");

console.log(columns);
