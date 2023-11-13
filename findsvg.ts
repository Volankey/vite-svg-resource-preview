import fs from 'fs'
import path from 'path'
import { type Plugin, createLogger } from 'vite'
import { getAssetsDir } from './utils'

const findSvgPlugin = () => {
  const map = new Map()
  const outFile = () => {
    const targetDir = getAssetsDir()
    if (fs.existsSync(targetDir)) {
      fs.rmdirSync(targetDir, { recursive: true })
    }
    fs.mkdirSync(targetDir, {
      recursive: true,
    })
    const data: { [key: string]: string[] } = Array.from(map.entries()).reduce(
      (acc: { [key: string]: string[] }, [key, value]) => {
        acc[key] = Array.from(value)
        return acc
      },
      {},
    )
    let count = 0
    const newData: Record<string, string[]> = {}

    Object.entries(data).forEach(([key, value]) => {
      const name = path.relative(__dirname, key).replace(/\//g, '_')
      const sourcePath = path.join(key)
      const targetPath = path.join(targetDir, name)
      newData[name] = value.map((item) => {
        return path.relative(__dirname, item)
      })
      fs.copyFile(sourcePath, targetPath, (error) => {
        if (error) {
          console.log(error)
        } else {
          console.log('copied ' + targetPath)
          count++
        }
      })
      // archive.append(content, { name: name });
    })
    fs.writeFileSync(
      path.join(targetDir, 'svg-importer.json'),
      JSON.stringify(newData),
    )
    console.log(`copied ${count} svg files`)
  }
  const logger = createLogger()
  return {
    name: 'find-svg-plugin',
    enforce: 'pre',
    apply: 'build',
    resolveId(id, importer) {
      if (id.endsWith('.svg') && !importer?.endsWith('index.html')) {
        let relativeKeyPath
        if (path.isAbsolute(id)) {
          relativeKeyPath = path.resolve(id)
        } else {
          relativeKeyPath = path.resolve(path.dirname(importer!), id)
        }
        relativeKeyPath = path.resolve(relativeKeyPath)
        const relativeValuePath = path.resolve(importer!)
        if (map.has(relativeKeyPath)) {
          map.get(relativeKeyPath).add(relativeValuePath)
        } else {
          map.set(relativeKeyPath, new Set([relativeValuePath]))
        }
      }
      return null
    },
    closeBundle() {
      outFile()
    },
  } as Plugin
}

export default findSvgPlugin
