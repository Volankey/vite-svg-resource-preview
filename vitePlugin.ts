import fs from 'fs'
import path from 'path'
import { type Plugin, createLogger } from 'vite'
import { compileTemplate } from 'vue/compiler-sfc'
import { optimize as optimizeSvg } from 'svgo'

function filenameToTag(filename){
    filename = filename.replace(/-(\w)/g, ($0, $1) => {
        return $1.toUpperCase()
    })
    filename = filename.replace(/_(\w)/g, ($0, $1) => {
        return $1.toUpperCase()
    })
    return filename
}
export const previewIcons = (svgPaths: string[]) => {
    return {
        name: 'previewIcons',
        enforce: 'pre',
        load(id){
            if(id.endsWith('.svg')){
                console.log(id)
                let [tpath, query] = id.split('?', 2)
                let filename = filenameToTag(tpath)
               
                // tpath = path.resolve('./assets',tpath)
                let svg = fs.readFileSync(tpath,'utf-8')
                svg = optimizeSvg(svg, {
                    path:filename
                }).data
                svg = svg.replace(/<style/g, '<component is="style"').replace(/<\/style/g, '</component')
                const { code } = compileTemplate({
                    id: JSON.stringify(id),
                    source: svg,
                    filename: filename,
                    transformAssetUrls: false
                })
                return `${code}\nexport default { render: render }`
            }
        },
        transform(code, id) {
            if (id.includes('PreviewIcons.vue')) {
                const svgNameMapPath = new Map()
                /**
                 * 
                 * // icons script start
        insert code here
                    // icons script end
                 */
         
                const importCode = svgPaths.map((svgPath) => {
                    let svgName = path.basename(svgPath, '.svg')
                    // svgName to camelCase
                    svgName = svgName.replace(/-(\w)/g, ($0, $1) => {
                        return $1.toUpperCase()
                    })
                    svgName = svgName.replace(/_(\w)/g, ($0, $1) => {
                        return $1.toUpperCase()
                    })
                    svgName = svgName.toLowerCase() + 'icon'
                    while (svgNameMapPath.get(svgName)) {
                        svgName = svgName + '1'
                    }
                    svgNameMapPath.set(svgName, svgPath)
                    return `import ${svgName} from '../assets/${svgPath}'`
                }).join('\n')
                // replace code
                code = code.replace(/\/\/ icons script start[\s\S]*\/\/ icons script end/, importCode)
                // icon tags
                const iconTags = Array.from(svgNameMapPath.keys()).map((svgName) => {
                    return `<a class="icon-container" href="vscode://file${svgNameMapPath.get(svgName)}">
                    <div class="checkboard" />
                    <${svgName} /></a>`
                }).join('\n')
                /**
                 * <!-- icons template start -->
    <!-- icons template end -->
                 */
                code = code.replace(/<!-- icons template start -->[\s\S]*<!-- icons template end -->/, iconTags)
                return code
            }

        }

    } as Plugin
}

