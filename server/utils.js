
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

    static commentRanking(ups, downs) {
        const n = ups + downs;
        if (n === 0) return 0;
        const z = 1.281551565545;
        const p = ups / n;

        const left = p + 1 / (2 * n) * z * z;
        const right = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n));
        const under = 1 + 1 / n * z * z;

        return (left - right) / under;
    }

}

module.exports = Utils;