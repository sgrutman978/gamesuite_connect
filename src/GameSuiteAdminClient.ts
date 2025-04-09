import { getFullnodeUrl, PaginatedObjectsResponse, QueryEventsParams, SuiClient, SuiEvent, SuiEventFilter, SuiObjectData } from '@mysten/sui/client';
import { coinWithBalance, Transaction } from '@mysten/sui/transactions';
import { SuiObjectResponse } from '@mysten/sui/client';
// import { Profile } from './GameBoard';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useEnokiFlow } from '@mysten/enoki/react';
import { executeTransactionBlockWithoutSponsorship,  } from './enoki_controller';
import { AuthProvider, EnokiFlow } from '@mysten/enoki';
// import { useEffect, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import type { WalletAccount } from '@mysten/wallet-standard';
import { myNetwork, suiClient } from '.';


export default class GameSuiteClient{
    enokiFlow: EnokiFlow = useEnokiFlow();
    currentAccount: WalletAccount | null; 
    myAddy: string = "";
    isEnoki: boolean = false;
    signAndExec: any;
    
    constructor(enokiFlow: EnokiFlow, currentAccount: WalletAccount | null, signAndExec: any){
        this.enokiFlow = enokiFlow;
        this.currentAccount = currentAccount;
        this.signAndExec = signAndExec;
        this.enokiFlow.$zkLoginState.subscribe((state) => {
            if(state?.address!){
                this.myAddy = state?.address!;
                console.log("yyyyyy");
                console.log(state.address);
                this.isEnoki = true;
            }else{
                if(currentAccount?.address!){
                    this.myAddy = currentAccount?.address!;
                }
            }
        });
    }

    handleEnokiLogins(redirectUrl: string, provider: AuthProvider, clientId: string){
        this.enokiFlow.createAuthorizationURL({
            provider: provider,
            network: 'mainnet',
            clientId: clientId,
            redirectUrl,
            extraParams: {
                scope: ['openid', 'email', 'profile'],
            },
        }).then((url) => {
            window.location.href = url;
        }).catch((error) => {
            console.error(error);
        });
    }

    logoutEnoki(){
        this.enokiFlow.logout();
    }

    doTransaction(transaction: Transaction, callback: (result: any) => void, errorCallback?: (error: any) => void) {
        console.log("ENOKI CHECCCCCCKK");
        if(this.isEnoki){
            executeTransactionBlockWithoutSponsorship(transaction, this.enokiFlow, suiClient, callback, errorCallback);
        }else{
            this.doTraditionalTransaction(transaction, callback, errorCallback);
        }
    };
    
    doTraditionalTransaction(transaction: Transaction, callback: (result: any) => void, errorCallback?: (error: any) => void) {
        // const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
        this.signAndExec({
            transaction: transaction!,
            chain: `sui:${myNetwork}`,
        }, {
            onSuccess: (result: any) => {
                console.log('executed transaction', result);
                callback(result);
            },
            onError: (error: any) => {
                console.log(error);
                if(errorCallback){
                    errorCallback(error);
                }
            }
        });	
    };
};