export default function extractFileType(url:string) {
    const urlParts = url.split('.');
    const extension = urlParts[urlParts.length - 1];
    return extension.toLowerCase();
  }