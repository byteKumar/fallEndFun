const pdfParse = require("pdf-parse");
const fs = require("fs");

exports.extractTextFromPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  return pdfParse(buffer);
};
