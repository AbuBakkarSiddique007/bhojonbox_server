#!/usr/bin/env node
import { promises as fs } from "fs";
import path from "path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const srcDir = path.join(distDir, "src");

async function exists(p) {
	try {
		await fs.access(p);
		return true;
	} catch {
		return false;
	}
}

async function main() {
	if (!(await exists(srcDir))) {
		console.log("No dist/src directory to flatten.");
		return;
	}

	const entries = await fs.readdir(srcDir);
	for (const name of entries) {
		const from = path.join(srcDir, name);
		const to = path.join(distDir, name);
		// remove target if it exists to avoid cp error
		try {
			await fs.rm(to, { recursive: true, force: true });
		} catch (e) {}
		// copy recursively, then remove source to avoid Windows rename issues
		await fs.cp(from, to, { recursive: true });
		await fs.rm(from, { recursive: true, force: true });
	}

	// remove the now-empty srcDir (if any remains)
	try {
		await fs.rm(srcDir, { recursive: true, force: true });
	} catch (e) {}

	console.log("Flattened dist/src into dist/");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
