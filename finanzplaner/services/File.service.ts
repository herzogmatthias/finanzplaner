export class FileService {
  private static instance: FileService;
  private constructor() {}
  static getInstance(): FileService {
    if (!FileService.instance) {
      FileService.instance = new FileService();
    }
    return FileService.instance;
  }
}
