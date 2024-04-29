import {CliOptions} from "..";
import {createFolderIfNotExists} from "./fileService";

const gm = require("gm").subClass({imageMagick: true});

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
  const {ImageWidth, ImageHeight, FNumber, ISO, Model, LensID, ExposureTime} =
    exifData;

  // Calculate border size based on image dimensions
  const borderWidth = 100;
  const newHeight = ImageHeight + borderWidth * 2;

  createFolderIfNotExists(options.output);

  gm(imagePath)
    .borderColor(options.color)
    .border(borderWidth, borderWidth)
    .font("Helvetica.ttf", 40)
    .fill(options.color === "black" ? "white" : "black")
    .drawText(
      borderWidth,
      newHeight - 35,
      `${LensID} - f/${FNumber} - ${ExposureTime}s - ISO${ISO}`
    )
    .drawText(
      ImageWidth - 210,
      newHeight - 35,
      options.photographer ? options.photographer : ""
    )
    .write(outputPath, function (err: Error) {
      if (!err) {
        console.log(`Image with EXIF data added saved at ${outputPath}`);
      } else {
        console.error(err);
      }
    });
}
