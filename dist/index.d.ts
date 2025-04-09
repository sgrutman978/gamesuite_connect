import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { AuthProvider, EnokiFlow } from '@mysten/enoki';
import type { WalletAccount } from '@mysten/wallet-standard';
export declare const myNetwork = "mainnet";
export declare const suiClient: SuiClient;
export default class GameSuiteClient {
    enokiFlow: EnokiFlow;
    currentAccount: WalletAccount | null;
    myAddy: string;
    isEnoki: boolean;
    signAndExec: any;
    constructor(currentAccount: WalletAccount | null, signAndExec: any);
    handleEnokiLogins(redirectUrl: string, provider: AuthProvider, clientId: string): void;
    logoutEnoki(): void;
    doTransaction(transaction: Transaction, callback: (result: any) => void, errorCallback?: (error: any) => void): void;
    doTraditionalTransaction(transaction: Transaction, callback: (result: any) => void, errorCallback?: (error: any) => void): void;
}
