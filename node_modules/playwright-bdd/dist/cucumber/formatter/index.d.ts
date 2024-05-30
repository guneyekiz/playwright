/// <reference types="node" />
/// <reference types="node" />
import { Writable } from 'node:stream';
import { EventEmitter } from 'node:events';
import EventDataCollector from './EventDataCollector';
import { IColorFns } from './getColorFns';
import { ISupportCodeLibrary } from '../types';
import StepDefinitionSnippetBuilder from '@cucumber/cucumber/lib/formatter/step_definition_snippet_builder';
import { SnippetInterface } from '@cucumber/cucumber/lib/formatter/step_definition_snippet_builder/snippet_syntax';
interface FormatRerunOptions {
    separator?: string;
}
interface FormatOptions {
    colorsEnabled?: boolean;
    rerun?: FormatRerunOptions;
    snippetInterface?: SnippetInterface;
    snippetSyntax?: string;
    printAttachments?: boolean;
    [customKey: string]: unknown;
}
type IFormatterLogFn = (buffer: string | Uint8Array) => void;
type IFormatterCleanupFn = () => Promise<unknown>;
export interface IFormatterOptions {
    colorFns: IColorFns;
    cwd: string;
    eventBroadcaster: EventEmitter;
    eventDataCollector: EventDataCollector;
    log: IFormatterLogFn;
    parsedArgvOptions: FormatOptions;
    snippetBuilder: StepDefinitionSnippetBuilder;
    stream: Writable;
    cleanup: IFormatterCleanupFn;
    supportCodeLibrary: ISupportCodeLibrary;
}
export default class Formatter {
    private options;
    static readonly documentation: string;
    constructor(options: IFormatterOptions);
    finished(): Promise<void>;
}
export {};
//# sourceMappingURL=index.d.ts.map