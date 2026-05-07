import React from "react";
import { Timeline } from "@/components/ui/timeline";

export default function TimelineDemo() {
  const data = [
    {
      title: "2019",
      content: (
        <div>
          <p className="mb-4 text-xs font-normal md:text-sm text-[rgba(230,208,144,0.85)]">
            2019 — Started, personal scale
          </p>
          <p className="text-xs font-normal md:text-sm text-[rgba(230,208,144,0.85)]">
            The founder began operations in mid‑2019, building the brand on personal service,
            careful sourcing, and word‑of‑mouth trust.
          </p>
        </div>
      ),
    },
    {
      title: "2020",
      content: (
        <div>
          <p className="mb-4 text-xs font-normal md:text-sm text-[rgba(230,208,144,0.85)]">
            2020 — Import ban shift
          </p>
          <p className="text-xs font-normal md:text-sm text-[rgba(230,208,144,0.85)]">
            With Sri Lanka’s vehicle import ban in 2020, we adapted—slowing imports and focusing on
            high‑condition used car sales to keep customers moving.
          </p>
        </div>
      ),
    },
    {
      title: "Jan 2025",
      content: (
        <div>
          <p className="mb-4 text-xs font-normal md:text-sm text-[rgba(230,208,144,0.85)]">
            January 2025 — Full return to imports
          </p>
          <p className="text-xs font-normal md:text-sm text-[rgba(230,208,144,0.85)]">
            With the lifting of the import ban, we re‑launched fully fledged operations, expanding our
            catalogue and services while keeping the same commitment to quality and care.
          </p>
        </div>
      ),
    },
  ];
  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
}
