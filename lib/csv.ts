// Parser CSV mínimo (RFC4180): soporta campos entre comillas con comas,
// saltos de línea y comillas escapadas (""), que es lo que exportan
// Zonaprop/Argenprop/Excel — un split(",") ingenuo rompe con esos casos.
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = "";
  };
  const pushRow = () => {
    pushField();
    rows.push(row);
    row = [];
  };

  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];

    if (inQuotes) {
      if (char === '"') {
        if (normalized[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      pushField();
    } else if (char === "\n") {
      pushRow();
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) pushRow();

  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ""));
}

const COMBINING_MARKS = /[̀-ͯ]/g;

function normalizeHeader(header: string): string {
  return header.normalize("NFD").replace(COMBINING_MARKS, "").trim().toLowerCase();
}

// Convierte filas crudas en objetos { headerNormalizado: valor }, para que
// el importador pueda buscar columnas por alias sin importar tildes o
// mayúsculas ("Título", "titulo", "TITULO" todos matchean "titulo").
export function csvToRecords(rows: string[][]): Record<string, string>[] {
  if (rows.length === 0) return [];
  const headers = rows[0].map(normalizeHeader);
  return rows.slice(1).map((row) => {
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = (row[index] ?? "").trim();
    });
    return record;
  });
}
