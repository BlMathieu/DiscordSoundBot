import fs from "fs";
import "dotenv/config";
import path from "path";
const DEFAULT_PATH = process.env.DEFAULT_PATH || "";

class ReaderUtils {
    public static checkPath(filePath: string) {
        if (!filePath.includes(DEFAULT_PATH)) throw new Error("Forbidden path !");
    }
    public static getExistingAudioFilesNames(): string[] {
        const files = fs.readdirSync(DEFAULT_PATH);
        return files;
    }

    public static writeFile(fileData: NodeJS.ArrayBufferView, fileName: string) {
        const filePath = path.resolve(DEFAULT_PATH, fileName.replace(' ',''));
        fs.writeFileSync(filePath, fileData);
    }
}
export default ReaderUtils;