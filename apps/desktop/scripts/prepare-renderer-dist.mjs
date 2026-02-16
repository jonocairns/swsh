import fs from "fs/promises";
import path from "path";

const cwd = process.cwd();
const sourcePath = path.resolve(cwd, "..", "client", "dist");
const targetPath = path.resolve(cwd, "renderer-dist");

await fs.rm(targetPath, { recursive: true, force: true });
await fs.mkdir(targetPath, { recursive: true });
await fs.cp(sourcePath, targetPath, { recursive: true });
