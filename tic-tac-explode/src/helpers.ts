// return a new array containing the elements of the initial array in random order
export function shuffle(input: any[]) {
    const array = [...input]
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}
