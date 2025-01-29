export const tokenGenerator = (length: number, delimiter: string = '-') => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const tokenArray: string[] = [];

    for (let i = 0; i < length; i++) {
        const randomChar = characters[Math.floor(Math.random() * characters.length)];
        tokenArray.push(randomChar);

        if ((i + 1) % 3 === 0 && i !== length - 1) {
            tokenArray.push(delimiter);
        }
    }

    return tokenArray.join('');
}