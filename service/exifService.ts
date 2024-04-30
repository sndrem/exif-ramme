// Function to extract EXIF data using exiftool
import {execSync} from "child_process";
export function extractExifData(imagePath: string) {
  const exifData = execSync(`exiftool -json "${imagePath}"`, {
    encoding: "utf-8",
  });
  return JSON.parse(exifData)[0]; // Extracting the first object assuming single image
}
