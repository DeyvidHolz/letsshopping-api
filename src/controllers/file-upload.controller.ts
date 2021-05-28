import { Request, Response } from 'express';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import jimp from 'jimp';
import { v4 as uuidv4 } from 'uuid';
import { getFileExtension } from '../helpers/file.helper';
import { Logger } from '../helpers/logger.helper';

class FileUploadController {
  public static async imageUpload(req: Request, res: Response) {
    const file = req.dto.file;
    const currentFilePath = file.path;
    // const fileExtension = req.dto.fileExtension;
    const newFileName = `${uuidv4()}.jpg`;
    const newFilePath = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      newFileName,
    );

    if (file.type !== 'image/jpg') {
      // Converting and writing uploaded image
      jimp.read(file.path, (err, image) => {
        image.write(newFilePath);
      });
    } else {
      // Moving uploaded image
      fs.renameSync(currentFilePath, newFilePath);
    }

    return res.status(201).json({
      message: 'Image uploaded successfully.',
      file: { name: newFileName },
    });
  }
}

export default FileUploadController;

// router.post('/', (req, res, next) => {
//   const formidable = require('formidable');
//   const form = new formidable.IncomingForm();
//   form.parse(req, (err, fields, files) => {
//     res.send('File uploaded');
//   });
// });
