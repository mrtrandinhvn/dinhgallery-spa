const imageExtensions = ['JPG', 'JPEG', 'PNG', 'GIF'];
const videoExtensions = ['MOV', 'MP4', 'WEBM', 'OGG'];

export type FileType = 'IMAGE' | 'VIDEO' | 'GENERIC'

export function getFileType(fileName: string): FileType {
    const fileExtension: string | undefined = fileName.split('.')?.pop()?.toUpperCase();
    if (!fileExtension) {
        throw new Error(`Could not detect file extension in file name: '${fileName}'`);
    }

    if (imageExtensions.indexOf(fileExtension) >= 0) {
        return 'IMAGE';
    }

    if (videoExtensions.indexOf(fileExtension) > 0) {
        return 'VIDEO';
    }

    return 'GENERIC';
}