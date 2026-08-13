import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createStudyOsServer } from "./mcp.ts";

void serveStdio(() => createStudyOsServer());
console.error("study-os MCP server running on stdio");
