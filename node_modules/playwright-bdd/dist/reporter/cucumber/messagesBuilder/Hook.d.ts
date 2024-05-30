import * as pw from '@playwright/test/reporter';
import * as messages from '@cucumber/messages';
export type HookType = 'before' | 'after';
export declare class Hook {
    internalId: string;
    static getInternalId(pwStep: pw.TestStep): string;
    id: string;
    name?: string;
    sourceReference: messages.SourceReference;
    constructor(internalId: string, pwStep: pw.TestStep);
    buildMessage(): {
        hook: messages.Hook;
    };
    private getName;
    private getSourceReference;
}
//# sourceMappingURL=Hook.d.ts.map