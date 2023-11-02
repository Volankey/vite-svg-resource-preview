import fs from 'fs'
import path from 'path'
import { type Plugin, createLogger } from 'vite'
import { compileTemplate } from 'vue/compiler-sfc'
import { optimize as optimizeSvg } from 'svgo'

export const previewIcons = (svgPaths: string[]) => {
    const logger = createLogger()

    return {
        name: 'previewIcons',
        enforce: 'pre',
        apply: 'serve',
        load(id){
            if(svgPaths.includes(id)){
                const [path, query] = id.split('?', 2)
                console.log(id)
                let svg = fs.readFileSync(path,'utf-8')
                svg = optimizeSvg(svg, {
                    path
                }).data
                svg = svg.replace(/<style/g, '<component is="style"').replace(/<\/style/g, '</component')
                const { code } = compileTemplate({
                    id: JSON.stringify(id),
                    source: svg,
                    filename: path,
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
                    svgName = svgName.toLowerCase() + 'icon'
                    while (svgNameMapPath.get(svgName)) {
                        svgName = svgName + '1'
                    }
                    svgNameMapPath.set(svgName, svgPath)
                    return `import ${svgName} from '${svgPath}'`
                }).join('\n')
                // replace code
                code = code.replace(/\/\/ icons script start[\s\S]*\/\/ icons script end/, importCode)
                // icon tags
                const iconTags = Array.from(svgNameMapPath.keys()).map((svgName) => {
                    return `<div class="icon-container" >
                    <div class="checkboard" />
                    <${svgName} /></div>`
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

