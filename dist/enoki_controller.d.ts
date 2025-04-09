import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { EnokiFlow } from "@mysten/enoki";
export declare const executeTransactionBlockWithoutSponsorship: (tx: Transaction, enokiFlow: EnokiFlow, suiClient: SuiClient, callback: (result: any) => void, errorCallback?: (error: any) => void) => Promise<SuiTransactionBlockResponse | void>;
