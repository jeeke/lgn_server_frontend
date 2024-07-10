function getRemaingTime(n) {
    const now = new Date();
    const expirationDate = new Date(n);
    const distance = expirationDate.getTime() - now.getTime();
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    return {
        minutes, seconds
    }
    // return `${minutes}:${seconds}`
}
export default getRemaingTime;