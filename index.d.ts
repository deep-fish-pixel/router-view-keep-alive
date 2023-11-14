import { HistoryState, RouteLocationOptions } from "vue-router";

declare function install (app: any): void;

declare const _default: {
    install(app: any): void;
};

export default _default;

// 扩展cached
declare module 'vue-router' {
    export interface RouteLocationOptions {
        /**
         * Replace the entry in the history instead of pushing a new entry
         */
        replace?: boolean;
        /**
         * Triggers the navigation even if the location is the same as the current one.
         * Note this will also add a new entry to the history unless `replace: true`
         * is passed.
         */
        force?: boolean;
        /**
         * State to save using the History API. This cannot contain any reactive
         * values and some primitives like Symbols are forbidden. More info at
         * https://developer.mozilla.org/en-US/docs/Web/API/History/state
         */
        state?: HistoryState;
        cache?: Boolean;
    }

    export interface Router {
        back({ cache: boolean }): ReturnType<Router['go']>;
        forward({ cache: boolean }): ReturnType<Router['go']>;
        go(delta: number, { cache: boolean }): void;
    }
}
