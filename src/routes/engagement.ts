import { Router } from "express";
import { databasePool } from "../db.js";

export const engagementRouter = Router();

const validPlatforms = ["Facebook", "Instagram", "TikTok", "123"];

/**
 * @openapi
 * /engagement:
 *   get:
 *     summary: Get engagement metrics for a platform
 *     parameters:
 *       - in: query
 *         name: platform
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Facebook, Instagram, TikTok, "123"]
 *         description: Social platform
 *     responses:
 *       200:
 *         description: Engagement metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likes:
 *                   type: integer
 *                   description: Number of likes
 *                 comments:
 *                   type: integer
 *                   description: Number of comments
 *                 shares:
 *                   type: integer
 *                   description: Number of shares
 */
engagementRouter.get("/engagement", async (req, res) => {
  const platform = req.query["platform"] as string;
  if (!platform) {
    res.status(400).json({ error: "Missing platform query parameter" });
    return;
  }
  if (!validPlatforms.includes(platform)) {
    res
      .status(400)
      .json({ error: `Platform must be one of ${validPlatforms.join(", ")}` });
    return;
  }
  try {
    const engagement = await getTotalEngagementByPlatform(platform);
    res.json(engagement);
  } catch {
    res.status(500).json({ error: "Failed to fetch engagement totals" });
  }
});

type Engagement = { likes: number; comments: number; shares: number };

export const getTotalEngagementByPlatform = async (
  platform: string,
): Promise<Engagement> => {
  const query = `
    SELECT
      SUM(likes) AS likes,
      SUM(comments) AS comments,
      SUM(shares) AS shares
    FROM "User"
    WHERE platform = $1
  `;

  const result = await databasePool.query<{
    likes: string;
    comments: string;
    shares: string;
  }>(query, [platform]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- This is guaranteed to return exactly one row
  const row = result.rows[0]!;

  return {
    likes: Number(row.likes),
    comments: Number(row.comments),
    shares: Number(row.shares),
  };
};
