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
                __dirname, "../distUnbundled/**/*.js" // distUnbundled is for compiled but not yet bundled js files
            ).replaceAll("\\", "/") // path.resolve returns Windows path. It is converted to POSIX path here.
        ).map
        (
            (p) => p.replaceAll("\\", "/") // Same for glob.sync
        ).map
        (
            (p) =>
            {
                let filename = p.split("/distUnbundled/")[1];
                return [filename, p];
            }
        )
    ),
    output:
    {
        filename: "[name]",
        path: path.resolve(__dirname, "../dist")
    },
    devtool: "inline-source-map",
    module:
    {
        rules:
        [
            {
                test: /\.m?js/,
                resolve:
                {
                    fullySpecified: false,
                }
            }
        ]
    }
};
