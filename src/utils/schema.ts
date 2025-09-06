import { isValid, parseISO } from "date-fns";
import type { User } from "./addUser.js";

export type UserFile = {
  user_id: string | null;
  name: string;
  email: string;
  instagram_handle: string | null;
  tiktok_handle: string;
  joined_at: string;
  advocacy_programs: [
    {
      program_id: string;
      brand: string | number;
      tasks_completed: [
        {
          task_id: string | null;
          platform: string | number;
          post_url: string;
          likes: string | number;
          comments: number | null;
          shares: number;
          reach: number;
        },
      ];
      total_sales_attributed: string | number;
    },
  ];
};

export const userFileSchema = {
  type: "object",
  properties: {
    user_id: { type: "string", nullable: true },
    name: { type: "string" },
    email: { type: "string" },
    instagram_handle: { type: "string", nullable: true },
    tiktok_handle: { type: "string" },
    joined_at: { type: "string" },
    advocacy_programs: {
      type: "array",
      minItems: 1,
      maxItems: 1,
      items: {
        type: "object",
        properties: {
          program_id: { type: "string" },
          brand: { type: ["string", "integer"] },
          tasks_completed: {
            type: "array",
            minItems: 1,
            maxItems: 1,
            items: {
              type: "object",
              properties: {
                task_id: { type: "string", nullable: true },
                platform: { type: ["string", "integer"] },
                post_url: { type: "string" },
                likes: { type: ["string", "integer"] },
                comments: { type: "integer", nullable: true },
                shares: { type: "integer" },
                reach: { type: "integer" },
              },
              required: [
                "task_id",
                "platform",
                "post_url",
                "likes",
                "comments",
                "shares",
                "reach",
              ],
              additionalProperties: false,
            },
          },
          total_sales_attributed: { type: ["string", "number"] },
        },
        required: [
          "program_id",
          "brand",
          "tasks_completed",
          "total_sales_attributed",
        ],
        additionalProperties: false,
      },
    },
  },
  required: [
    "user_id",
    "name",
    "email",
    "instagram_handle",
    "tiktok_handle",
    "joined_at",
    "advocacy_programs",
  ],
  additionalProperties: false,
};

export const sanitiseUserFile = (
  fileName: string,
  userFile: UserFile,
): User => ({
  fileName,
  userId: userFile.user_id,
  name: replaceWithNull(userFile.name, "???"),
  email: replaceWithNull(userFile.email, "invalid-email"),
  instagramHandle: userFile.instagram_handle,
  tiktokHandle: replaceWithNull(userFile.tiktok_handle, "#error_handle"),
  joinedAt: parseDateOrNull(userFile.joined_at),
  programId: replaceWithNull(userFile.advocacy_programs[0].program_id, ""),
  // The only non-string brand is 12345, so just call .toString() on it
  brand: userFile.advocacy_programs[0].brand.toString(),
  // total_sales_attributed is either a number or the string "no-data", so if it's a string then we just set it to null
  totalSalesAttributed: numberOrNull(
    userFile.advocacy_programs[0].total_sales_attributed,
  ),
  taskId: userFile.advocacy_programs[0].tasks_completed[0].task_id,
  // The only non-string platform is 123, so just call .toString() on it
  platform:
    userFile.advocacy_programs[0].tasks_completed[0].platform.toString(),
  postUrl: replaceWithNull(
    userFile.advocacy_programs[0].tasks_completed[0].post_url,
    "broken_link",
  ),
  likes: numberOrNull(userFile.advocacy_programs[0].tasks_completed[0].likes),
  comments: userFile.advocacy_programs[0].tasks_completed[0].comments,
  shares: userFile.advocacy_programs[0].tasks_completed[0].shares,
  reach: replaceWithNull(
    userFile.advocacy_programs[0].tasks_completed[0].reach,
    -1000,
  ),
});

export const numberOrNull = (value: number | string) =>
  typeof value === "number" ? value : null;

export const parseDateOrNull = (input: string): Date | null => {
  const date = parseISO(input);
  return isValid(date) ? date : null;
};

export const replaceWithNull = <T>(value: T, nullValue: T) =>
  value === nullValue ? null : value;
