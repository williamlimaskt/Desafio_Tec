const fs = require('fs'); 
const path = require('path'); 

function saveReport({ totals, items = [] }) {
  const ts = new Date();
  const stamp = ts.toISOString().replace(/[:.]/g, '-');
  const report = {
    timestamp: ts.toISOString(),
    ...totals,
    items
  };

  const outDir = path.join(__dirname, '..', 'reports');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true});

  const file = path.join(outDir, `run-${stamp}.json`);
  fs.writeFileSync(file, JSON.stringify(report, null, 2), 'utf-8');

  // Console

  console.log('=== Relatório de Processamento ===');
  console.table(totals);
  console.log(`Relatório salvo em: ${file}`);
}

module.exports = { saveReport };
