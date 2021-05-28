import { NextFunction, Request, Response } from 'express';
import formidable from 'formidable';
import unprocessableEntity from '../errors/http/unprocessable-entity.error';
import { getFileExtension } from '../helpers/file.helper';

export class FileUploadMiddleware {
  public static image(req: Request, res: Response, next: NextFunction) {
    const form = new formidable.IncomingForm();
    const allowedFileMimeTypes: string[] = [
      'image/png',
      'image/jpeg',
      'image/jpg',
    ];

    form.parse(req, (err, fields, files) => {
      if (!files.image) {
        return unprocessableEntity({
          message: 'Field image is required.',
        }).send(res);
      }

      const file = files.image as any;

      if (!allowedFileMimeTypes.includes(file.type)) {
        return unprocessableEntity({ message: 'Invalid file type.' }).send(res);
      }

      if (file.size > 1500000 || file.size < 30000) {
        return unprocessableEntity({ message: 'Invalid file size.' }).send(res);
      }

      req.dto = {
        file,
        fileExtension: getFileExtension(file.name),
      };

      console.log('nexte');

      next();
    });
  }
}
