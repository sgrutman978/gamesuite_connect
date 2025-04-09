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

// import GameSuiteClient from './GameSuiteClient';

export const myNetwork = "mainnet";
export const suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") });

export default class GameSuiteClient{
	enokiFlow: EnokiFlow;
	currentAccount: WalletAccount | null; 
	myAddy: string = "";
	isEnoki: boolean = false;
	signAndExec: any;
	
	constructor(currentAccount: WalletAccount | null, signAndExec: any){
		this.enokiFlow = new EnokiFlow({apiKey: "enoki_public_10094b0bafc9ba2626fcbc02a1812d6b"});
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


// Configuration
const SERVER_URL = 'http://your-server.com:3000/submit-score';
const PACKAGE_ID = 'your-package-id'; // Replace with your leaderboard package ID
const MODULE_NAME = 'leaderboard';
const FUNCTION_NAME = 'submit_score';

// Assuming you're using a wallet provider like @mysten/wallet-kit
function SubmitScoreComponent() {
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const currentAccount = useCurrentAccount();
  const client = new SuiClient({ url: getFullnodeUrl('mainnet') }); // Adjust network

  const submitScore = async (score: number) => {
    try {
      // Step 1: Get signature from server
      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentAccount: currentAccount?.address, score: score }),
      });

      const { signature, publicKey } = await response.json();

      if (!signature || !publicKey) {
        throw new Error('Invalid server response');
      }

      // Step 2: Build the transaction block
      const tx = new Transaction();

      // Call the Move function
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
        arguments: [
          tx.pure.vector('u8', publicKey),
        ],
      });

      // Step 3: Sign and execute the transaction
      const result = await signAndExecuteTransaction({
            transaction: tx,
            chain: `sui:mainnet`,
        },{
			onSuccess: (result: any) => {
				console.log('executed transaction', result);
			},
			onError: (error: any) => {
				console.log(error);
			}
		});

      console.log('Transaction successful:', result);
      return result;
    } catch (error) {
      console.error('Error submitting score:', error);
      throw error;
    }
  }

  // Example usage in a React component
  const handleSubmit = async () => {
    const playerAddress = '0xYourAddressHere'; // Replace with actual address
    const score = 100; // Example score
    await submitScore(score);
  };

  // return (
  //   <button onClick={handleSubmit}>Submit Score</button>
  // );
}