import { Pool } from "pg";

export const databasePool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "DuelTest123",
  database: "duel",
});
