"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.suiClient = exports.myNetwork = void 0;
const client_1 = require("@mysten/sui/client");
const transactions_1 = require("@mysten/sui/transactions");
// import { Profile } from './GameBoard';
const dapp_kit_1 = require("@mysten/dapp-kit");
const enoki_controller_1 = require("./enoki_controller");
const enoki_1 = require("@mysten/enoki");
// import { useEffect, useState } from 'react';
const dapp_kit_2 = require("@mysten/dapp-kit");
// import GameSuiteClient from './GameSuiteClient';
exports.myNetwork = "mainnet";
exports.suiClient = new client_1.SuiClient({ url: (0, client_1.getFullnodeUrl)("mainnet") });
class GameSuiteClient {
    constructor(currentAccount, signAndExec) {
        this.myAddy = "";
        this.isEnoki = false;
        this.enokiFlow = new enoki_1.EnokiFlow({ apiKey: "enoki_public_10094b0bafc9ba2626fcbc02a1812d6b" });
        this.currentAccount = currentAccount;
        this.signAndExec = signAndExec;
        this.enokiFlow.$zkLoginState.subscribe((state) => {
            if (state === null || state === void 0 ? void 0 : state.address) {
                this.myAddy = state === null || state === void 0 ? void 0 : state.address;
                console.log("yyyyyy");
                console.log(state.address);
                this.isEnoki = true;
            }
            else {
                if (currentAccount === null || currentAccount === void 0 ? void 0 : currentAccount.address) {
                    this.myAddy = currentAccount === null || currentAccount === void 0 ? void 0 : currentAccount.address;
                }
            }
        });
    }
    handleEnokiLogins(redirectUrl, provider, clientId) {
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
    logoutEnoki() {
        this.enokiFlow.logout();
    }
    doTransaction(transaction, callback, errorCallback) {
        console.log("ENOKI CHECCCCCCKK");
        if (this.isEnoki) {
            (0, enoki_controller_1.executeTransactionBlockWithoutSponsorship)(transaction, this.enokiFlow, exports.suiClient, callback, errorCallback);
        }
        else {
            this.doTraditionalTransaction(transaction, callback, errorCallback);
        }
    }
    ;
    doTraditionalTransaction(transaction, callback, errorCallback) {
        // const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
        this.signAndExec({
            transaction: transaction,
            chain: `sui:${exports.myNetwork}`,
        }, {
            onSuccess: (result) => {
                console.log('executed transaction', result);
                callback(result);
            },
            onError: (error) => {
                console.log(error);
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        });
    }
    ;
}
exports.default = GameSuiteClient;
;
// Configuration
const SERVER_URL = 'http://your-server.com:3000/submit-score';
const PACKAGE_ID = 'your-package-id'; // Replace with your leaderboard package ID
const MODULE_NAME = 'leaderboard';
const FUNCTION_NAME = 'submit_score';
// Assuming you're using a wallet provider like @mysten/wallet-kit
function SubmitScoreComponent() {
    const { mutate: signAndExecuteTransaction } = (0, dapp_kit_1.useSignAndExecuteTransaction)();
    const currentAccount = (0, dapp_kit_2.useCurrentAccount)();
    const client = new client_1.SuiClient({ url: (0, client_1.getFullnodeUrl)('mainnet') }); // Adjust network
    const submitScore = (score) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Step 1: Get signature from server
            const response = yield fetch(SERVER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentAccount: currentAccount === null || currentAccount === void 0 ? void 0 : currentAccount.address, score: score }),
            });
            const { signature, publicKey } = yield response.json();
            if (!signature || !publicKey) {
                throw new Error('Invalid server response');
            }
            // Step 2: Build the transaction block
            const tx = new transactions_1.Transaction();
            // Call the Move function
            tx.moveCall({
                target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
                arguments: [
                    tx.pure.vector('u8', publicKey),
                ],
            });
            // Step 3: Sign and execute the transaction
            const result = yield signAndExecuteTransaction({
                transaction: tx,
                chain: `sui:mainnet`,
            }, {
                onSuccess: (result) => {
                    console.log('executed transaction', result);
                },
                onError: (error) => {
                    console.log(error);
                }
            });
            console.log('Transaction successful:', result);
            return result;
        }
        catch (error) {
            console.error('Error submitting score:', error);
            throw error;
        }
    });
    // Example usage in a React component
    const handleSubmit = () => __awaiter(this, void 0, void 0, function* () {
        const playerAddress = '0xYourAddressHere'; // Replace with actual address
        const score = 100; // Example score
        yield submitScore(score);
    });
    // return (
    //   <button onClick={handleSubmit}>Submit Score</button>
    // );
}
