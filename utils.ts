import path from 'path'

export function getBaseDir() {
    const targetDir = path.join(__dirname, 'src')
    return targetDir
}
export function getAssetsDir(){
    return path.join( getBaseDir() , 'assets')
}