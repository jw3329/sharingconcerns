
class Utils {

    static epochSeconds(date) {
        const time = date
        return time.getDay() * 24 * 3600 + time.getSeconds() + time.getMilliseconds() / 1000;
    }

    static score(ups, downs) {
        return ups - downs;
    }

    static hot(ups, downs, date) {
        const score = this.score(ups, downs);
        const order = Math.log(Math.max(Math.abs(score), 1), 10);
        const sign = score > 0 ? 1 : (score == 0 ? 0 : -1);
        const seconds = this.epochSeconds(date) - 1134028003;
        return sign * order + seconds / 45000;
    }

}

module.exports = Utils;