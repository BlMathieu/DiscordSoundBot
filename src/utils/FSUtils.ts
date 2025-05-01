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

    public static writeFile(fileData: NodeJS.ArrayBufferView, fileName: string):string {
        const filePath = path.resolve(DEFAULT_PATH, fileName);
        fs.writeFileSync(filePath, fileData);
        return path.basename(filePath)
    }

    public static isValidExtension(name: string): boolean {
        const supportedFilesExt = [".mp3", ".mp4", ".wav", ".flac", ".aac", ".alac", ".wma", ".aiff", ".pcm"];
        return supportedFilesExt.some(ext => path.extname(name.toLowerCase()) == ext);
    }
}
export default ReaderUtils;