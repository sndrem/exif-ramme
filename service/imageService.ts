import {CliOptions} from "..";
import {createFolderIfNotExists} from "./fileService";

import gm from "gm";
const gmSubclass = gm.subClass({imageMagick: true});

interface ExifData {
  ImageWidth: number;
  ImageHeight: number;
  FNumber: string;
  ISO: string;
  Model: string;
  LensID: string;
  ExposureTime: string;
}

// Function to add EXIF data to a white border around the image
export function addExifDataToImage(
  imagePath: string,
  exifData: ExifData,
  outputPath: string,
  options: CliOptions
) {
  const {ImageWidth, ImageHeight, FNumber, ISO, LensID, ExposureTime} =
    exifData;

  // Calculate border size based on image dimensions
  const borderWidth = Number(options.width);
  const fontSize = Number(options.fontSize);
  const newHeight = ImageHeight + borderWidth * 2;

  createFolderIfNotExists(options.output);

  gmSubclass(imagePath)
    .borderColor(options.color)
    .border(borderWidth, borderWidth)
    .font("Helvetica.ttf", fontSize)
    .fill(options.color === "black" ? "white" : "black")
    .drawText(
      borderWidth,
      newHeight - borderWidth / 2,
      `${LensID} - f/${FNumber} - ${ExposureTime}s - ISO${ISO}`
    )
    .drawText(
      ImageWidth - 210,
      newHeight - borderWidth / 2,
      options.photographer ? options.photographer : ""
    )
    .write(outputPath, function (err) {
      if (!err) {
        console.log(`Image with EXIF data added saved at ${outputPath}`);
      } else {
        console.error(err);
      }
    });
}
