/**
 * 
 * @param string String to uppercase the first char.
 * @returns 
 */
export const ucFirst = (string: string) => {
    if (string && string.length > 0)
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

/**
 * 
 * @param string String to capitalize
 * @returns 
 */
export const capitalString = (string: any) => {
    let array = string.split("_")
    if (typeof string === 'object')
        Object.keys(string).map(key => {
            array.push(Array.isArray(string[key]) ? string[key].join('. ') : string[key])
        })
    return array.map((item: string) => {
        return ucFirst(item)
    })?.join(" ");
}
