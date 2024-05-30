import BaseReporter, { InternalOptions } from './base';
type MessageReporterOptions = {
    outputFile?: string;
};
export default class MessageReporter extends BaseReporter {
    protected userOptions: MessageReporterOptions;
    constructor(internalOptions: InternalOptions, userOptions?: MessageReporterOptions);
}
export {};
//# sourceMappingURL=message.d.ts.map