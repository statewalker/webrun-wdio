import { beforeAll, afterAll, expect, test } from "vitest";
import { WebSocket } from "ws";
global.WebSocket = WebSocket;
import connect from "@statewalker/webrun-devtools/dist/webrun-devtools-ws.js";
import { startServer } from "./startServer";

import fs from "fs";
import path from "path";
import url from "url";
import { printToPdf } from "./printToPdf";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const browserDebuggerPort = 9222;
const serverPort = 8080;
const rootDir = path.resolve(__dirname, "./fixtures");

let stopServer = null;
beforeAll(async () => {
  stopServer = await startServer({ rootDir, port: serverPort });
});
afterAll(async () => await stopServer());

test("add 2 numbers", async () => {
  const api = await connect({
    port: browserDebuggerPort,
  });
  const url = `httl://localhost:${serverPort}/01.test.html`;
  const pdfData = await printToPdf(api, url);
  expect(pdfData instanceof Buffer).toEqual(true);
  expect(pdfData.length).toBeGreaterThan(0);
  // expect(sum(2, 3)).toEqual(5);
});
