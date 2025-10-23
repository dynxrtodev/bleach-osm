import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cacheDir = path.join(__dirname, "../bleach/cache");

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    const { file } = req.query;

    if (!file)
      return res.status(400).json({ error: "Parameter 'file' dibutuhkan!" });

    const filePath = path.join(cacheDir, file);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File tidak ditemukan di bleach/cache!" });
    }

    const data = fs.readFileSync(filePath);
    res.setHeader("Content-Type", "application/octet-stream");
    return res.status(200).send(data);
  }
  return res.status(405).json({ error: "Method tidak didukung!" });
}