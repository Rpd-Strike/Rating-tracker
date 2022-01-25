const randomInt = (from: number, to: number) =>
{
    return Math.floor(Math.random() * (to - from + 1)) + 1;
}

export { randomInt };
