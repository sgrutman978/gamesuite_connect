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
import React from 'react';

import { ArrowRight, Wallet2 } from "lucide-react";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { ConnectModal } from "@mysten/dapp-kit";

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

}


interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  console.log(onSuccess);

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          className="w-full justify-between h-[44px] cursor-pointer text-left font-normal"
          // onClick={handleGoogleSignup}
        >
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            <span>Sign up with Google</span>
          </div>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <ConnectModal
			trigger={
				<Button
          variant="outline"
          className="w-full mt-4 justify-between cursor-pointer text-left h-[44px] font-normal">
          <div className="flex items-center gap-2">
            <span>Connect Wallet</span>
          </div>
          <ArrowRight className="h-5 w-5" />
        </Button>
			}
		/>
      </CardContent>
    </Card>
  );
}
