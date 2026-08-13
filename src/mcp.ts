import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { createHarness, type HarnessOptions } from "./harness.ts";

function jsonResult(data: unknown, isError = false) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    isError,
  };
}

export function createStudyOsServer(options: HarnessOptions = {
  workspaceRoot: process.cwd(),
}): McpServer {
  const harness = createHarness(options);
  const server = new McpServer({ name: "study-os", version: "0.1.0" });

  server.registerTool(
    "load_context",
    {
      title: "Load context",
      description:
        "Load tutor-loop context: bootstrap, teaching profile, mastery for the active course pack, recent session summaries, and runtime registrations.",
      inputSchema: z.object({}),
    },
    async () => jsonResult(await harness.loadContext()),
  );

  server.registerTool(
    "list_course_packs",
    {
      title: "List course packs",
      description:
        "List course packs discovered from course-packs/*/pack.yaml and the active course pack id.",
      inputSchema: z.object({}),
    },
    async () => jsonResult(await harness.listCoursePacks()),
  );

  server.registerTool(
    "set_active_course_pack",
    {
      title: "Set active course pack",
      description:
        "Set the active course pack id in the student-model store. Call between tutor loops only. Refuses unknown ids.",
      inputSchema: z.object({
        pack_id: z.string().min(1).describe("Course pack folder name"),
      }),
    },
    async ({ pack_id }) => {
      const result = await harness.setActiveCoursePack(pack_id);
      return jsonResult(result, result.ok === false);
    },
  );

  return server;
}
