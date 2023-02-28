import { readdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import chokidar from 'chokidar'
const __dirname = dirname(fileURLToPath(import.meta.url))
const svgDirPath = resolve(__dirname, './src/assets/svgs')
const indexJsPath = resolve(__dirname, './src/assets/svgs/index.ts')

const genFile = async () => {
  try {
    const files = await readdir(svgDirPath)
    let importContent = ''
    let exportContent = ''
    for (const file of files) {
      const fileArr = file.split('.')
      if (file.endsWith('.svg')) {
        importContent += `import { ReactComponent as ${fileArr[0]} } from './${file}'\n`
        exportContent += `${fileArr[0]}, `
      }
    }
    exportContent = `export { ${exportContent}}`
    writeFile(indexJsPath, `${importContent}\n${exportContent}`)
  }
  catch (err) {
    console.error(err)
  }
}

chokidar.watch(svgDirPath).on('all', (event, path) => {
  if ((event === 'add' || event === 'unlink') && path.endsWith('.svg')) {
    console.log(event, path)
    genFile()
  }
})
