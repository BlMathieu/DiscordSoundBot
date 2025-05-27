import path from "path";
import { DEFAULT_PATH } from "../constantes/path_const";
import AudioFileUtils from "./audiofile_utils";

export default class AudioFileValidityUtils {

    public static isAudioFilePathValid(filePath: string) {
        return filePath.includes(DEFAULT_PATH);
    }

    public static isAudioFileExtensionValid(fileName: string): boolean {
        const supportedFilesExt = [".mp3", ".mp4", ".wav", ".flac", ".aac", ".alac", ".wma", ".aiff", ".pcm"];
        const audioFileExtension = path.extname(fileName.toLowerCase());

        return supportedFilesExt.some(ext => audioFileExtension === ext);
    }

    public static doesAudioFileAlreadyExists(fileName: string) {
        const existingFiles = AudioFileUtils.getExistingAudioFilesNames();
        return existingFiles.includes(fileName);
    }

}