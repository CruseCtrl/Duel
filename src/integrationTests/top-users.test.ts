import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app.js";
import type { TopUser } from "../routes/top-users.js";

describe("top-users", () => {
  it("responds with a list of top users", async () => {
    const res = await request(app).get("/top-users");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const topUsers = res.body as Array<TopUser>;

    expect(topUsers).toHaveLength(10);

    for (const user of topUsers) {
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("instagramHandle");
      expect(user).toHaveProperty("tiktokHandle");
      expect(user).toHaveProperty("totalSalesAttributed");
    }
  });
});
