import path from 'path'
import fs from 'fs'

// Remove old photo
export const removePhoto = (imagePath: string, folder: string): void => {
  if (imagePath) {
    const oldPath = path.join(__dirname, '..', '..', 'assets', `${folder}`, path.basename(imagePath))

    if (fs.existsSync(oldPath)) {
      fs.unlink(oldPath, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
  }
}
