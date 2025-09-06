import { describe, expect, it } from "vitest";
import {
  type UserFile,
  numberOrNull,
  parseDateOrNull,
  replaceWithNull,
  sanitiseUserFile,
} from "./schema.js";

describe("schema", () => {
  describe("numberOrNull", () => {
    it("returns the number if input is a number", () => {
      expect(numberOrNull(12)).toBe(12);
    });
    it("returns null if input is a string", () => {
      expect(numberOrNull("not-a-number")).toBeNull();
    });
  });

  describe("parseDateOrNull", () => {
    it("returns a Date for a valid ISO string", () => {
      expect(parseDateOrNull("2024-01-01")).toBeInstanceOf(Date);
    });
    it("returns null for an invalid date string", () => {
      expect(parseDateOrNull("not-a-date")).toBeNull();
    });
  });

  describe("replaceWithNull", () => {
    it("returns null if value matches nullValue", () => {
      expect(replaceWithNull("???", "???")).toBeNull();
      expect(replaceWithNull(-1000, -1000)).toBeNull();
    });
    it("returns value if it does not match nullValue", () => {
      expect(replaceWithNull("hello", "???")).toBe("hello");
      expect(replaceWithNull(123, -1000)).toBe(123);
    });
  });

  describe("sanitiseUserFile", () => {
    it("sanitises a valid user file", () => {
      const userFile: UserFile = {
        user_id: "9c548567-ae6c-48ce-8fe8-da336b65440e",
        name: "Dallas Metz",
        email: "Giovanna_Gusikowski70@yahoo.com",
        instagram_handle: "@Lucio98",
        tiktok_handle: "@Jaleel93",
        joined_at: "2024-09-07T15:59:34.170Z",
        advocacy_programs: [
          {
            program_id: "355e40a7-58ca-41c4-abe8-2aaeaf4bfca9",
            brand: "Gibson, Hartmann and Murray",
            tasks_completed: [
              {
                task_id: "90f738ce-9ca8-4fb6-8b34-7d035925e089",
                platform: "TikTok",
                post_url: "https://hateful-custom.org",
                likes: 287,
                comments: 14,
                shares: 15,
                reach: 9993,
              },
            ],
            total_sales_attributed: 564.0311517201802,
          },
        ],
      };

      const result = sanitiseUserFile("file1.json", userFile);

      expect(result).toEqual({
        fileName: "file1.json",
        userId: "9c548567-ae6c-48ce-8fe8-da336b65440e",
        name: "Dallas Metz",
        email: "Giovanna_Gusikowski70@yahoo.com",
        instagramHandle: "@Lucio98",
        tiktokHandle: "@Jaleel93",
        joinedAt: expect.any(Date) as Date,
        programId: "355e40a7-58ca-41c4-abe8-2aaeaf4bfca9",
        brand: "Gibson, Hartmann and Murray",
        totalSalesAttributed: 564.0311517201802,
        taskId: "90f738ce-9ca8-4fb6-8b34-7d035925e089",
        platform: "TikTok",
        postUrl: "https://hateful-custom.org",
        likes: 287,
        comments: 14,
        shares: 15,
        reach: 9993,
      });
    });

    it("handles null/invalid values", () => {
      const userFile: UserFile = {
        user_id: null,
        name: "???",
        email: "invalid-email",
        instagram_handle: null,
        tiktok_handle: "#error_handle",
        joined_at: "not-a-date",
        advocacy_programs: [
          {
            program_id: "",
            brand: 12345,
            tasks_completed: [
              {
                task_id: null,
                platform: 123,
                post_url: "broken_link",
                likes: "nope",
                comments: null,
                shares: 0,
                reach: -1000,
              },
            ],
            total_sales_attributed: "no-data",
          },
        ],
      };

      const result = sanitiseUserFile("file2.json", userFile);

      expect(result).toEqual({
        fileName: "file2.json",
        userId: null,
        name: null,
        email: null,
        instagramHandle: null,
        tiktokHandle: null,
        joinedAt: null,
        programId: null,
        brand: "12345",
        totalSalesAttributed: null,
        taskId: null,
        platform: "123",
        postUrl: null,
        likes: null,
        comments: null,
        shares: 0,
        reach: null,
      });
    });
  });
});
