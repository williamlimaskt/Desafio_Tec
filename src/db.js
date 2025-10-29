const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..", "data", "users.sqlite");

// Cria o banco de dados em modo de leitura
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao abrir o banco de dados:", err.message);
  } else {
    console.log("Banco de dados aberto com sucesso");
  }
});

// Cria a tabela (caso não exista) com `email` como chave primária
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      title TEXT,
      first_name TEXT,
      last_name TEXT,
      gender TEXT,
      dob_date TEXT,
      age INTEGER,
      phone TEXT,
      cell TEXT,
      country TEXT,
      state TEXT,
      city TEXT,
      postcode TEXT,
      street_number INTEGER,
      street_name TEXT,
      coordinates_latitude TEXT,
      coordinates_longitude TEXT,
      timezone_offset TEXT,
      timezone_description TEXT,
      uuid TEXT,
      username TEXT,
      password TEXT,
      salt TEXT,
      md5 TEXT,
      sha1 TEXT,
      sha256 TEXT,
      picture_large TEXT,
      picture_medium TEXT,
      picture_thumbnail TEXT,
      nationality TEXT,
      registered_date TEXT,
      registered_age INTEGER,
      id_name TEXT,
      id_value TEXT,
      updated_at TEXT,
      created_at TEXT
    );
  `);
});

module.exports = { db };
