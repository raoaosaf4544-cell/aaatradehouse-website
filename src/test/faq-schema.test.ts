import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { faqs } from "@/components/FAQ";

/* Google requires FAQPage structured data to mirror content visible on the
   page. If these drift apart the markup becomes a guidelines violation, so
   fail loudly rather than ship a silent penalty. */
describe("FAQPage schema matches the visible FAQ", () => {
  const html = readFileSync("index.html", "utf-8");
  const graph = JSON.parse(
    html.match(/application\/ld\+json">([\s\S]*?)<\/script>/)![1],
  )["@graph"];
  const faqNode = graph.find((n: { "@type": string }) => n["@type"] === "FAQPage");

  it("has a FAQPage node", () => {
    expect(faqNode).toBeDefined();
  });

  it("has one schema entry per visible question", () => {
    expect(faqNode.mainEntity).toHaveLength(faqs.length);
  });

  it("matches every question and answer verbatim", () => {
    const schema = faqNode.mainEntity.map(
      (q: { name: string; acceptedAnswer: { text: string } }) => ({
        q: q.name,
        a: q.acceptedAnswer.text,
      }),
    );
    expect(schema).toEqual(faqs.map(({ q, a }) => ({ q, a })));
  });
});
