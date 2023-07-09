
export default class TimeHelper {
    static getTimeNow() {
        return new Date().getTime();
    }

    static getElapsedSeconds(startTime, endTime) {
        let miliSecs = endTime - startTime;
        return Math.floor(miliSecs / 1000);
    }

    static getElapsedMinutes(startTime, endTime) {
        let secs = this.getElapsedSeconds(startTime, endTime);
        return Math.floor(secs / 60)
    }

    static getElapsedHours(startTime, endTime) {
        let mins = this.getElapsedMinutes(startTime, endTime);
        return Math.floor(mins / 60)
    }

    static getElapsedDays(startTime, endTime) {
        let hrs = this.getElapsedHours(startTime, endTime);
        return Math.floor(hrs / 24)
    }

    static getTopElapsedString(startTime, endTime) {
        let days = this.getElapsedDays(startTime, endTime);
        if (days !== 0) return days + "d";

        let hrs = this.getElapsedHours(startTime, endTime);
        if (hrs !== 0) return hrs + "h";

        let mins = this.getElapsedMinutes(startTime, endTime);
        if (mins !== 0) return mins + "m";

        return "just now";
    }

    static getTopElapsedStringUntilNow(startTime)  {
        return this.getTopElapsedString(startTime, this.getTimeNow());
    }
}