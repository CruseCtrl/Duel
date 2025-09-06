import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import type { ErrorResponse } from "../src/testHelpers.js";

describe("engagement", () => {
  it("responds with engagement totals for a valid platform", async () => {
    const res = await request(app).get("/engagement?platform=Facebook");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      likes: expect.any(Number) as number,
      comments: expect.any(Number) as number,
      shares: expect.any(Number) as number,
    });
  });

  it("responds with 400 if platform query is missing", async () => {
    const res = await request(app).get("/engagement");
    expect(res.status).toBe(400);
    expect((res.body as ErrorResponse).error).toBe(
      "Missing platform query parameter",
    );
  });

  it("responds with 400 for unsupported platforms", async () => {
    const res = await request(app).get("/engagement?platform=something");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect((res.body as ErrorResponse).error).toMatch(
      /Platform must be one of/,
    );
  });
});
