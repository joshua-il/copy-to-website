import { describe, expect, it } from "vitest";
import { joinWaitlistSchema } from "@/lib/waitlist-schema";

describe("joinWaitlistSchema", () => {
  it("normalizes a valid email address", () => {
    expect(joinWaitlistSchema.parse({ email: "  Reader@Example.com " })).toEqual({
      email: "reader@example.com",
    });
  });

  it("rejects an invalid email address", () => {
    expect(joinWaitlistSchema.safeParse({ email: "not-an-email" }).success).toBe(false);
  });

  it("rejects an email address longer than 254 characters", () => {
    const email = `${"a".repeat(250)}@test.com`;
    expect(joinWaitlistSchema.safeParse({ email }).success).toBe(false);
  });
});
