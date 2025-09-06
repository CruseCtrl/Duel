import { databasePool } from "../db.js";

export type User = {
  fileName: string;

  userId: string | null;
  name: string | null;
  email: string | null;
  instagramHandle: string | null;
  tiktokHandle: string | null;
  joinedAt: Date | null;

  programId: string | null;
  brand: string;
  totalSalesAttributed: number | null;

  taskId: string | null;
  platform: string;
  postUrl: string | null;
  likes: number | null;
  comments: number | null;
  shares: number;
  reach: number | null;
};

export const addUser = async (user: User): Promise<void> => {
  const query = `
    INSERT INTO "User" (
      filename, user_id, name, email, instagram_handle, tiktok_handle,
      joined_at, program_id, brand, total_sales_attributed, task_id, platform,
      post_url, likes, comments, shares, reach
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
    )
  `;

  const values = [
    user.fileName,
    user.userId,
    user.name,
    user.email,
    user.instagramHandle,
    user.tiktokHandle,
    user.joinedAt,
    user.programId,
    user.brand,
    user.totalSalesAttributed,
    user.taskId,
    user.platform,
    user.postUrl,
    user.likes,
    user.comments,
    user.shares,
    user.reach,
  ];

  await databasePool.query(query, values);
};
