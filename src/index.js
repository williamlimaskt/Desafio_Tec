const axios = require("axios");
const { db } = require("./db");
const { saveReport } = require("./report");

const API_URL = "https://randomuser.me/api/?results=150";

console.log("Iniciando o processamento...");

// SQL de inserção (upsert) com 36 placeholders de valores
const insertStmt = `INSERT OR REPLACE INTO users (
  email, 
  title, 
  first_name, 
  last_name, 
  gender, 
  dob_date, 
  age, 
  phone,
  cell, 
  country, 
  state, 
  city, 
  postcode, 
  street_number, 
  street_name,
  coordinates_latitude, 
  coordinates_longitude, 
  timezone_offset, 
  timezone_description,
  uuid, 
  username, 
  password, 
  salt, 
  md5, 
  sha1, 
  sha256, 
  picture_large, 
  picture_medium, 
  picture_thumbnail,
  nationality, 
  registered_date, 
  registered_age, 
  id_name, 
  id_value, 
  updated_at, 
  created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const selectByEmailStmt = `SELECT email FROM users WHERE email = ?`;

// Função de mapeamento de dados da API
function mapUser(u) {
  let usuario = {
    nome: u?.name?.first || "",
    sobrenome: u?.name?.last || "",
    email: (u?.email || "").toLowerCase(),
    title: u?.name?.title || "",
    dobDate: u?.dob?.date || null,
    idade: Math.floor(Number(u?.dob?.age ?? 0)),
    telefone: u?.phone || "",
    celular: u?.cell || "",
    pais: u?.location?.country || "",
    estado: u?.location?.state || "",
    cidade: u?.location?.city || "",
    codigo_postal: String(u?.location?.postcode ?? ""),
    rua_numero: u?.location?.street?.number || null,
    rua_nome: u?.location?.street?.name || "",
    latitude: u?.location?.coordinates?.latitude || "",
    longitude: u?.location?.coordinates?.longitude || "",
    timezone_offset: u?.location?.timezone?.offset || "",
    timezone_description: u?.location?.timezone?.description || "",
    picture_large: u?.picture?.large || "",
    picture_medium: u?.picture?.medium || "",
    picture_thumbnail: u?.picture?.thumbnail || "",
    nacionalidade: u?.nat || "",
    uuid: u?.login?.uuid || "",
    username: u?.login?.username || "",
    password: u?.login?.password || "",
    salt: u?.login?.salt || "",
    md5: u?.login?.md5 || "",
    sha1: u?.login?.sha1 || "",
    sha256: u?.login?.sha256 || "",
    registered_date: u?.registered?.date || "",
    registered_age: u?.registered?.age || 0,
    id_name: u?.id?.name || "",
    id_value: u?.id?.value || "",
  };

  const nowIso = new Date().toISOString();

  console.log("Mapeando usuário:", usuario);

  return usuario;
}

// Função para executar a query no banco de dados
function runDbQuery(query, params) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        return reject(err);
      }
      resolve(this);
    });
  });
}

async function main() {
  const totals = {
    totalFetched: 0,
    processed: 0,
    added: 0,
    updated: 0,
    ignoredUnderage: 0,
    errors: 0,
  };
  const errorItems = [];

  try {
    const { data } = await axios.get(API_URL, {
      timeout: 10000, // 10s
      headers: { "User-Agent": "Desafio-Integracoes/1.0" },
    });

    const results = data?.results || [];
    totals.totalFetched = results.length;

    console.log(`Total de resultados recebidos: ${totals.totalFetched}`);

    for (const raw of results) {
      try {
        const mapped = mapUser(raw);

        console.log("Verificando idade:", mapped.idade);

        // Ignora os menores de 18 anos
        if (mapped.age < 18) {
          console.log(
            `Usuário ${mapped.email} foi ignorado por ser menor de 18 anos`
          );
          totals.ignoredUnderage++;
          continue;
        }

        // Verifica se o email já existe
        const row = await new Promise((resolve, reject) => {
          db.get(selectByEmailStmt, [mapped.email], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        });

        // Parâmetros a serem passados para a query
        const params = [
          mapped.email,
          mapped.title,
          mapped.nome,
          mapped.sobrenome,
          mapped.dobDate,
          mapped.idade,
          mapped.telefone,
          mapped.celular,
          mapped.pais,
          mapped.estado,
          mapped.cidade,
          mapped.codigo_postal,
          mapped.rua_numero,
          mapped.rua_nome,
          mapped.latitude,
          mapped.longitude,
          mapped.timezone_offset,
          mapped.timezone_description,
          mapped.uuid,
          mapped.username,
          mapped.password,
          mapped.salt,
          mapped.md5,
          mapped.sha1,
          mapped.sha256,
          mapped.picture_large,
          mapped.picture_medium,
          mapped.picture_thumbnail,
          mapped.nacionalidade,
          mapped.registered_date,
          mapped.registered_age,
          mapped.id_name,
          mapped.id_value,
          mapped.updated_at,
          mapped.created_at,
        ];

        // Executa a query de inserção ou atualização no banco
        await runDbQuery(insertStmt, params);

        if (row) {
          totals.updated++;
        } else {
          totals.added++;
        }
        totals.processed++;
      } catch (err) {
        console.log(err.stack);
        console.log("Erro ao processar usuário:", err.message);
        totals.errors++;
        errorItems.push({
          message: String(err?.message || err),
          userEmail: raw?.email || null,
        });
      }
    }
  } catch (err) {
    console.log("Erro na chamada da API:", err.message);
    totals.errors++;
    errorItems.push({
      message: `Falha na chamada da API: ${String(err?.message || err)}`,
    });
  }

  // Salva o relatório de execução
  saveReport({ totals, items: errorItems });
  console.log("Processamento concluído");
}

main().catch((e) => {
  console.error("Erro fatal:", e);
  process.exit(1);
});
