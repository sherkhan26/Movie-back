import { Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'
import { FileResponse } from './file.interface'

@Injectable()
export class FileService {
  async saveFiles(
    files: Express.Multer.File[],
    folder: string = 'default'
  ): Promise<FileResponse[]> {
    const uploadsFolder = `${path}/uploads/${folder}`
    await ensureDir(uploadsFolder)

    const res: FileResponse[] = await Promise.all(
      files.map(async (file) => {
        await writeFile(
          `${uploadsFolder}/${file.originalname}`,
          Buffer.from(file.buffer)
        )

        return {
          url: `/uploads/${folder}/${file.originalname}`,
          name: file.originalname,
        }
      })
    )

    return res
  }
}
