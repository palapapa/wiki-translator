import path, { dirname } from "path";
import glob from "glob";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default
{
    entry: Object.fromEntries
    (
        glob.sync
        (
            path.resolve
            (
                __dirname, "../dist/**/*.js"
            ).replaceAll("\\", "/") // path.resolve returns Windows path. It is converted to POSIX path here.
        ).map
        (
            (p) => p.replaceAll("\\", "/") // Same for glob.sync
        ).map
        (
            (p) =>
            {
                let filename = p.split("dist/")[1];
                return [filename, p];
            }
        )
    ),
    output:
    {
        filename: "[name]"
    },
    devtool: "inline-source-map"
};
