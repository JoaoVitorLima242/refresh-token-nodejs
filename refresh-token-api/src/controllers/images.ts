import { Request, Response } from 'express'

import S3 from '../integrations/s3'

class ImageControllers {
  public uploadImage = async (req: Request, res: Response) => {
    try {
      const file = req.file
      if (!file) throw new Error('File is required!')

      const result = await S3.uploadFile(file)

      res.json({ imageLocation: result.Location })
    } catch (error) {
      console.log(error, 'error')
    }
  }

  public getImageByKey = async (
    req: Request<{ key: string }>,
    res: Response,
  ) => {
    try {
      const key = req.params.key
      const readStream = S3.getFileStream(key)

      readStream.pipe(res)
    } catch (error) {
      console.log('error', error)
    }
  }
}

export default new ImageControllers()
