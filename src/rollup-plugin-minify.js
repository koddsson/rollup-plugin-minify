import fs from "node:fs/promises";
import path from "node:path";

import imagemin from "imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import imageminGiflossy from "imagemin-giflossy";
import imageminSvgo from "imagemin-svgo";
import imageminWebp from "imagemin-webp";

export default function (options) {
  const { globs = [] } = options;
  return {
    name: "rollup-plugin-minify",
    async writeBundle({ dir }) {
      const results = await imagemin(globs, {
        plugins: [
          imageminMozjpeg(),
          imageminPngquant(),
          imageminGiflossy(),
          imageminSvgo({ plugins: [{ name: "preset-default" }] }),
          imageminWebp(),
        ],
      });
      await Promise.all(
        results.map(async (item) => {
          const destinationPath = path.join(dir, item.sourcePath);
          await fs.mkdir(path.dirname(destinationPath), { recursive: true });
          await fs.writeFile(destinationPath, item.data);
        }),
      );
    },
  };
}
