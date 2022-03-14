import type { Adapter } from "next-auth/adapters";
export interface NitricAdapterOptions {
    urls?: {
        users: string;
        accounts: string;
        sessions: string;
        verificationTokens: string;
    };
}
export declare const defaultUrls: Required<Required<NitricAdapterOptions>["urls"]>;
export declare function NitricAdapter(options?: NitricAdapterOptions): Adapter;
//# sourceMappingURL=index.d.ts.map