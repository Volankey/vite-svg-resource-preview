import fs from 'fs'
import path from 'path'
import { type Plugin, createLogger } from 'vite'

const findSvgPlugin = () => {
  const map = new Map()
  const outFile = () => {
    const data: { [key: string]: string[] } = Array.from(map.entries()).reduce(
      (acc: { [key: string]: string[] }, [key, value]) => {
        acc[key] = Array.from(value)
        return acc
      },
      {},
    )

    fs.writeFileSync('svg-importer.json', JSON.stringify(data, null, 2))
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
          relativeKeyPath = path.relative(process.cwd(), id)
        } else {
          relativeKeyPath = path.relative(
            process.cwd(),
            path.resolve(path.dirname(importer!), id),
          )
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
      logger.info(
        `generate svg-importer.json in ${path.join(
          __dirname,
          'svg-importer.json',
        )}`,
      )
      outFile()
    },
  } as Plugin
}

export default findSvgPlugin
