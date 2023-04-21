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
                                __dirname, "../src/**/*.ts"
                            ).replaceAll("\\", "/") // path.resolve returns Windows path. It is converted to POSIX path here.
                    ).map
                    (
                        (p) => p.replaceAll("\\", "/") // Same for glob.sync
                    ).map
                    (
                        (p) => {
                            let filename = p.split("src/")[1];
                            return [filename.substring(0, filename.lastIndexOf(".")) + ".js", p];
                        }
                    )
            ),
        output:
        {
            filename: "[name]"
        }
    };
