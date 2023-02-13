import S3, { GetObjectRequest, PutObjectRequest } from 'aws-sdk/clients/s3'
import fs from 'fs'

import { config } from '../config/vars'

class S3Integration {
  private s3: S3

  constructor() {
    this.s3 = new S3({
      region: config.AWS_BUCKET_REGION,
      accessKeyId: config.AWS_ACCESS_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS,
    })
  }

  // Uploads a file to s3
  public uploadFile = (file: Express.Multer.File) => {
    const fileStream = fs.createReadStream(file.path)

    const uploadParams: PutObjectRequest = {
      Bucket: config.AWS_BUCKET_NAME,
      Body: fileStream,
      Key: `images/${file.filename}`,
    }

    return this.s3.upload(uploadParams).promise()
  }

  // downloads a file from s3
  public getFileStream = (fileKey: string) => {
    const downloadParams: GetObjectRequest = {
      Key: fileKey,
      Bucket: config.AWS_BUCKET_NAME,
    }

    return this.s3.getObject(downloadParams).createReadStream()
  }
}

export default new S3Integration()
