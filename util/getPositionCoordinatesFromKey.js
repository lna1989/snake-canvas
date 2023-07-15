export default function(key) {
    let [x, y] = key.split('_')
    x = Number(x)
    y = Number(y)

    return [x, y]
}
