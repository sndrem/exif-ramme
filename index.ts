import {extractExifData} from "./service/exifService";
import {addExifDataToImage} from "./service/imageService";
import {Command, Option} from "@commander-js/extra-typings";
const path = require("path");
import fs from "fs";

const program = new Command()
  .name("Exif-ramme")
  .version("0.0.1")
  .description(
    "Legger ramme med exif-informasjon på bilder du legger i mappen 'images'"
  )
  .option("-i, --image <image file>", "File name of image")
  .option(
    "-p, --photographer <name of photographer>",
    "Name of the photographer"
  )
  .addOption(
    new Option("-c, --color <color of frame>", "The color of the frame")
      .choices(["white", "black"] as const)
      .default("black")
  )
  .addOption(
    new Option(
      "-f, --folder <name of folder with images>",
      "Name of the folder where you have images"
    ).default("images")
  )
  .addOption(
    new Option(
      "-o, --output <output folder>",
      "The folder where the images will be stored"
    ).default("output")
  )
  .option(
    "-b, --batch",
    "Run the same settings on all images in the <image> folder"
  );

program.parse(process.argv);
const options = program.opts();
export type CliOptions = typeof options;

function processImage(
  imagePath: string,
  outputPath: string,
  options: CliOptions
) {
  const exifData = extractExifData(imagePath);
  addExifDataToImage(imagePath, exifData, outputPath, options);
}

if (!options.image && !options.batch) {
  throw new Error(
    "Du må sette enten -i eller -b for hhv. image eller batch av alle bilder"
  );
}

if (options.batch) {
  const imageFolderPath = `${__dirname}/${options.folder}`;
  const files = fs.readdirSync(imageFolderPath);
  files.forEach((file) => {
    const inputImagePath = `${imageFolderPath}/${file}`;
    const outputImagePath = `${__dirname}/${options.output}/${file}`;
    processImage(inputImagePath, outputImagePath, options);
  });
} else {
  const imageName = path.basename(options.image);
  const inputImagePath = `${__dirname}/${options.folder}/${imageName}`; // Provide your input image path here
  const outputImagePath = `${__dirname}/${options.output}/${imageName}`; // Output image path

  processImage(inputImagePath, outputImagePath, options);
}
