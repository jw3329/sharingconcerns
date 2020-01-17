class Utils {

    constructor() {
        this.host = 'localhost';
        this.port = 8000;
        this.server = `http://${this.host}:${this.port}`;
    }


    static toLocaleTimestamp(timestamp) {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    }

    static getProfileImageLink(userId) {
        return `${this.server}/api/user/${userId}/profileImage`;
    }
}

export default Utils;