import { IDocument } from "@/models/IDocument";

export class FileService {
  private static instance: FileService;

  private static URL = "http://localhost:5200/File/user";
  private constructor() {}
  static getInstance(): FileService {
    if (!FileService.instance) {
      FileService.instance = new FileService();
    }
    return FileService.instance;
  }
  async fetchFiles(id: string, fileType: "L" | "I"): Promise<IDocument[]> {
    try {
      const response = await fetch(
        `${FileService.URL}/files/${id}?FileType=${fileType}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching files: ${response.statusText}`);
      }

      const data: IDocument[] = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch files error:", error);
      throw new Error("An error occurred while fetching the files.");
    }
  }
  async uploadFiles(
    id: string,
    fileList: FileList,
    fileInfo: "L" | "I"
  ): Promise<void> {
    const documents: IDocument[] = await this.transformFileListToDocuments(
      fileList,
      fileInfo
    );

    try {
      const response = await fetch(`${FileService.URL}/upload/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify(documents),
      });

      if (!response.ok) {
        throw new Error(`Error uploading files: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Upload files error:", error);
      throw new Error("An error occurred while uploading the files.");
    }
  }

  async deleteFile(id: string, fileName: string): Promise<void> {
    try {
      const response = await fetch(
        `${FileService.URL}/delete/${id}?FileName=${fileName}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error deleting file: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Delete file error:", error);
      throw new Error("An error occurred while deleting the file.");
    }
  }
  async downloadFile(id: string, fileName: string): Promise<void> {
    try {
      const response = await fetch(`${FileService.URL}/download/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error downloading file: ${response.statusText}`);
      }

      const data = await response.json();
      const { base64File } = data;
      console.log();

      const byteCharacters = atob(base64File);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(null)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/octet-stream" });

      // Create a link element and click it to trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download file error:", error);
      throw new Error("An error occurred while downloading the file.");
    }
  }
  private async transformFileListToDocuments(
    fileList: FileList,
    fileInfo: "L" | "I"
  ): Promise<IDocument[]> {
    const files: IDocument[] = [];
    const fileReadPromises: Promise<void>[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const reader = new FileReader();

      const fileReadPromise = new Promise<void>((resolve, reject) => {
        reader.onload = (event) => {
          const base64 = (event.target?.result as string).split(",")[1];
          files.push({
            fileType: fileInfo, // Adjust this based on your file type logic
            fileName: file.name,
            fileInfo: base64,
          });
          resolve();
        };

        reader.onerror = (error) => reject(error);

        reader.readAsDataURL(file);
      });

      fileReadPromises.push(fileReadPromise);
    }

    await Promise.all(fileReadPromises);
    return files;
  }
}
