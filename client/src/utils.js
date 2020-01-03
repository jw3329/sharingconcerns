class Utils {
    static toLocaleTimestamp() {
        const date = new Date();
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    }
}

export default Utils;