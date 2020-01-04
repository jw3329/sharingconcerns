class Utils {
    static toLocaleTimestamp(timestamp) {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    }
}

export default Utils;