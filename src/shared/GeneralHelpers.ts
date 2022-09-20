import { FileTypes } from "../config";

export const getActualRequestDurationInMilliseconds = (start: [number, number]) => {
    const NS_PER_SEC = 1e9; // convert to nanoseconds
    const NS_TO_MS = 1e6; // convert to milliseconds
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

export const getMimeType = (name: string): string => {
    let ext: string = name.toLowerCase().substring(name?.lastIndexOf(".") + 1)
    if (ext)
        return FileTypes[ext];
    else return ""
}

export const getFileExtension = (name: string) => {

    return name.toLowerCase().substring(name?.lastIndexOf(".") + 1)
}

export const checkFileConstraints = (file: Express.Multer.File, type: string, maxSize: number) => {
    if (file) {
        if (/(video)/.test(type)) {
            return file.buffer.byteLength > maxSize * 5
        } else {
            return file.buffer.byteLength > maxSize
        }
    } else {
        return false
    }
}

export const checkIfValidID = (_id: string) => {
    return _id.length === 24;
}