import path from 'path'
import fs from 'fs'

// Remove old photo
export const removePhoto = (imagePath: string, folder: string): void => {
  const folders = folder.split('/') // ex: 'products/JBlT450' - > [products, JBlT450] || 'users' - > [users]

  // remove product's folder
  if (imagePath === '' && folders[0] === 'products' && folders[1]) {
    const dir = path.join(__dirname, '..', '..', 'assets', `${folder}`)
    fs.rmSync(dir, { recursive: true, force: true })
  }
  // remove product's image or user's photo
  else {
    const dir = path.join(__dirname, '..', '..', 'assets', `${folder}`, path.basename(imagePath))

    if (fs.existsSync(dir)) {
      fs.unlink(dir, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
  }
}
