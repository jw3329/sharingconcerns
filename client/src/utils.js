class Utils {
    static toLocaleTimestamp(timestamp) {
        return `${new Date(timestamp).toLocaleDateString()} ${new Date(timestamp).toLocaleTimeString()}`
    }
}

export default Utils;