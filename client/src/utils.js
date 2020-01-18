import defaultProfile from './images/default-profile.png';

class Utils {

    static host = 'localhost';
    static port = 8000;
    static server = `http://${this.host}:${this.port}`;

    static toLocaleTimestamp(timestamp) {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    }

    static getProfileImageLink(userId, profileImage) {
        return profileImage ? `${this.server}/api/user/${userId}/profileImage` : defaultProfile;
    }
}

export default Utils;