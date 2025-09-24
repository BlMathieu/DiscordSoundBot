import fs from "fs";
import path from "path";
import { DEFAULT_PATH } from "../constantes/PathConstante";
import HandlerError from "../errors/HandlerError";
import AudioFileValidityUtils from "./ValidityUtil";

export default class AudioFileUtils {
    public static getExistingAudioFilesNames(): string[] {
        const files = fs.readdirSync(DEFAULT_PATH);
        return files;
    }

    public static writeAudioFile(
        fileData: NodeJS.ArrayBufferView,
        fileName: string
    ): void {
        const filePath = path.resolve(DEFAULT_PATH, fileName);

        const isPathValid = AudioFileValidityUtils.isAudioFilePathValid(filePath);
        const isExtensionValid = AudioFileValidityUtils.isAudioFileExtensionValid(fileName);

        if (!isPathValid) throw new HandlerError(`Le chemin du fichier n'est pas valide !`);
        if (!isExtensionValid) throw new HandlerError(`L'extension du fichier n'est pas valide !`);

        fs.writeFileSync(filePath, fileData);
    }

    public static renameAudioFile(oldName: string, newName: string): void {
        const isOldExtensionValid = AudioFileValidityUtils.isAudioFileExtensionValid(oldName);
        const isNewExtensionValid = AudioFileValidityUtils.isAudioFileExtensionValid(newName);

        if (!isOldExtensionValid || !isNewExtensionValid)
            throw new HandlerError(`L'extension n'est pas valide !`);

        const oldFilePath = path.resolve(DEFAULT_PATH, oldName);
        const newFilePath = path.resolve(DEFAULT_PATH, newName);

        const isOldPathValid = AudioFileValidityUtils.isAudioFilePathValid(oldFilePath);
        const isNewPathValid = AudioFileValidityUtils.isAudioFilePathValid(newFilePath);

        if (!isOldPathValid || !isNewPathValid) {
            throw new HandlerError(`Le chemin du fichier n'est pas valide !`);
        }

        fs.renameSync(oldFilePath, newFilePath);
    }

    public static deleteAudioFile(fileName: string): void {
        if (!AudioFileValidityUtils.doesAudioFileAlreadyExists(fileName)) {
            throw new HandlerError(`Le fichier n'existe pas !`);
        }

        const filePath = path.resolve(DEFAULT_PATH, fileName);
        if (!AudioFileValidityUtils.isAudioFilePathValid(filePath)) {
            throw new HandlerError(`Le chemin du fichier n'est pas valide !`);
        }

        fs.rmSync(filePath);
    }
}
