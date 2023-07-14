import fs from "node:fs/promises";
import assert from "node:assert";
import test from "node:test";

import minify from "../src/rollup-plugin-minify.js";

const extensions = {
  png: [15_000, 16_000],
  svg: [42_000, 43_000],
  jpg: [17_000, 18_000],
};

for (const [extension, [lower, upper]] of Object.entries(extensions)) {
  test(`minifies ${extension}s`, async () => {
    const plugin = minify({ globs: [`./assets/*.${extension}`] });
    await plugin.writeBundle({ dir: "./dist/" });

    const { size } = await fs.stat(`./dist/assets/image.${extension}`);
    assert(
      size < upper,
      `Image wasn't minified! Expected size: ${size} to be less than ${upper} bytes`,
    );
    assert(
      size > lower,
      `Image was minified beyond the test threshold! Expected size: ${size} to be more than ${lower} bytes. Please update the test!`,
    );
  });
}
