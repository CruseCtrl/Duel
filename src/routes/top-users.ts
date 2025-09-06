import { Router } from "express";
import { databasePool } from "../db.js";

export const topUsersRouter = Router();

/**
 * @openapi
 * /top-users:
 *   get:
 *     summary: Get top 10 users by total sales attributed
 *     responses:
 *       200:
 *         description: List of top users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   instagramHandle:
 *                     type: string
 *                   tiktokHandle:
 *                     type: string
 *                   totalSalesAttributed:
 *                     type: number
 */
topUsersRouter.get("/top-users", async (_req, res) => {
  try {
    const users = await getTopUsersBySales();
    res.json(users);
  } catch {
    res.status(500).json({ error: "Failed to fetch top users" });
  }
});

export type TopUser = {
  name: string | null;
  email: string | null;
  instagramHandle: string | null;
  tiktokHandle: string | null;
  totalSalesAttributed: number | null;
};

const getTopUsersBySales = async (): Promise<Array<TopUser>> => {
  const query = `
    SELECT
      name,
      email,
      instagram_handle AS "instagramHandle",
      tiktok_handle AS "tiktokHandle",
      total_sales_attributed AS "totalSalesAttributed"
    FROM "User"
    WHERE total_sales_attributed IS NOT NULL
    ORDER BY total_sales_attributed DESC
    LIMIT 10
  `;
  const result = await databasePool.query<{
    name: string | null;
    email: string | null;
    instagramHandle: string | null;
    tiktokHandle: string | null;
    totalSalesAttributed: string | null;
  }>(query);
  return result.rows.map((row) => ({
    ...row,
    // These are represented as strings when they come out of the database, so we need to convert them to numbers
    totalSalesAttributed:
      row.totalSalesAttributed == null
        ? null
        : Number(row.totalSalesAttributed),
  }));
};
