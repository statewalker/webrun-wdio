import fs from "fs";
import path from "path";
import url from "url";
import connectToDebuggerApi from "@statewalker/webrun-devtools/dist/webrun-devtools-ws.js";
import { WebSocket } from "ws";
global.WebSocket = WebSocket;
import { startServer } from "./startServer.js";
import { printToPdf } from "./printToPdf.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

Promise.resolve().then(main).catch(console.error);

async function main() {
  // const url = "https://pptr.dev";
  const port = 8080;
  const url = `http://127.0.0.1:${port}/01.test.html`;
  const api = await connectToDebuggerApi({ port: 9222 });
  try {
    const closeServer = await startServer({ rootDir: __dirname, port });
    try {
      const pdfData = await printToPdf(api, url);
      const pdfPath = path.join(__dirname, "test.pdf");
      fs.writeFileSync(pdfPath, pdfData);
    } finally {
      closeServer();
    }
    // const pdfUrl = `data:application/pdf;base64,${pdfData}`;
    // console.log(pdfUrl);
    // const view = await pdfView(pdfUrl);
    // return view;
  } finally {
    api.close();
  }
}
