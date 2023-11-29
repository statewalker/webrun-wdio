export async function printToPdf(api, url) {
  // Get list of all targets and find a "page" target.
  const targetInfos = await api.debugger.getTargets();
  const { targetId } = targetInfos.find((info) => info.type === "page");
  const target = { targetId };

  await api.debugger.attach(target);

  const handleDetach = (...args) => console.warn(...args);
  api.debugger.onDetach.addListener(handleDetach);
  try {
    await api.debugger.sendCommand(target, "Page.enable");
    const handleEvents = (...args) => console.log(...args);
    api.debugger.onEvent.addListener(handleEvents);
    try {
      const pageInfo = await api.debugger.sendCommand(target, "Page.navigate", {
        url,
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      const { data: pdfData } = await api.debugger.sendCommand(
        target,
        "Page.printToPDF",
        {}
      );
      const buf = Buffer.from(pdfData, "base64");
      return buf;
    } finally {
      await api.debugger.sendCommand(target, "Page.disable");
      api.debugger.onEvent.removeListener(handleEvents);
    }
  } finally {
    await api.debugger.detach(target);
    api.debugger.onDetach.removeListener(handleDetach);
  }
}
