import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import ogs from "open-graph-scraper-lite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to fetch link metadata
  app.get("/api/metadata", async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      const options = { url };
      const { result } = await (ogs as any)(options);
      
      // Filter out low quality or generic OG images if any
      let imageUrl = result.ogImage?.[0]?.url;

      // If OG image is missing or looks like a placeholder, use screenshot fallback
      if (!imageUrl || imageUrl.includes('placeholder') || imageUrl.includes('default')) {
        imageUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1280`;
      }
      
      res.json({
        title: result.ogTitle || url,
        description: result.ogDescription || "",
        image: imageUrl,
      });
    } catch (error) {
      console.error("Metadata fetch error:", error);
      res.json({
        title: url,
        image: `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1280`
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
