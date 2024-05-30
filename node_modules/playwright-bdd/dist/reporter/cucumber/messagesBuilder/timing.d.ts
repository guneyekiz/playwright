export type TimeMeasured = {
    startTime: Date;
    duration: number;
};
export declare function toCucumberTimestamp(time: number): import("@cucumber/messages").Timestamp;
export declare function calcMinMaxByArray(items: TimeMeasured[]): {
    startTime: Date;
    duration: number;
};
//# sourceMappingURL=timing.d.ts.map