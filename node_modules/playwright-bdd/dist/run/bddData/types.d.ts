import { StepMatchArgumentsList } from '@cucumber/messages';
export type BddData = {
    uri: string;
    pickleLocation: string;
    steps: BddDataStep[];
};
export type BddDataStep = {
    pwStepLocation: string;
    stepMatchArgumentsLists: readonly StepMatchArgumentsList[];
};
//# sourceMappingURL=types.d.ts.map