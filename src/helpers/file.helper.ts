export function getFileExtension(fileName: string) {
  const match: RegExpMatchArray = fileName.match(/\.(.+)$/);

  if (!match) {
    return fileName;
  }

  return match[1];
}
