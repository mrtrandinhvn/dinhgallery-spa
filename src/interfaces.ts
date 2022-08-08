export interface IUser { }

export interface IAppContext {
    storageService: IStorageService | null,
}

export interface IStorageService {
    getPublicUrl: (fileName: string) => string,
}