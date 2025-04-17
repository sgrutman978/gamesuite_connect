"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.GameSuiteLoginModal = GameSuiteLoginModal;
exports.SubmitScoreComponent = SubmitScoreComponent;
const client_1 = require("@mysten/sui/client");
const transactions_1 = require("@mysten/sui/transactions");
// import { Profile } from './GameBoard';
const dapp_kit_1 = require("@mysten/dapp-kit");
const enoki_controller_1 = require("./enoki_controller");
const enoki_1 = require("@mysten/enoki");
// import { useEffect, useState } from 'react';
const dapp_kit_2 = require("@mysten/dapp-kit");
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const button_1 = require("./button");
const card_1 = require("./card");
const dapp_kit_3 = require("@mysten/dapp-kit");
const react_query_1 = require("@tanstack/react-query");
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
function GameSuiteLoginModal({ onSuccess }) {
    console.log(onSuccess);
    const networks = {
        testnet: { url: (0, client_1.getFullnodeUrl)('testnet') },
        mainnet: { url: (0, client_1.getFullnodeUrl)('mainnet') },
    };
    const [activeNetwork, setActiveNetwork] = (0, react_1.useState)(exports.myNetwork);
    const queryClient = new react_query_1.QueryClient();
    const handleGoogle = () => {
        const { mutate: signAndExecuteTransaction } = (0, dapp_kit_1.useSignAndExecuteTransaction)();
        const gsl = new GameSuiteClient((0, dapp_kit_2.useCurrentAccount)(), signAndExecuteTransaction);
        gsl.handleEnokiLogins("https://find4.io/login_redirect", "google", "1010386909639-p3bjjhp05pnk5vhsqak41lausgtk75nf.apps.googleusercontent.com");
    };
    return (react_1.default.createElement(dapp_kit_1.SuiClientProvider, { networks: networks, network: activeNetwork, onNetworkChange: (network) => {
            setActiveNetwork(network);
        }, 
        // defaultNetwork="devnet"
        createClient: (network, config) => {
            return new client_1.SuiClient({ url: (0, client_1.getFullnodeUrl)(network) });
        } },
        react_1.default.createElement(react_query_1.QueryClientProvider, { client: queryClient },
            react_1.default.createElement(dapp_kit_1.WalletProvider, { autoConnect: true },
                react_1.default.createElement(card_1.Card, { className: "border-none shadow-none" },
                    react_1.default.createElement(card_1.CardHeader, null,
                        react_1.default.createElement(card_1.CardTitle, { className: "text-2xl" }, "Login"),
                        react_1.default.createElement(card_1.CardDescription, null, "Enter your credentials to access your account")),
                    react_1.default.createElement(card_1.CardContent, null,
                        react_1.default.createElement(button_1.Button, { variant: "outline", className: "w-full justify-between h-[44px] cursor-pointer text-left font-normal", onClick: () => handleGoogle() },
                            react_1.default.createElement("div", { className: "flex items-center gap-2" },
                                react_1.default.createElement("svg", { className: "h-5 w-5", viewBox: "0 0 24 24" },
                                    react_1.default.createElement("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z", fill: "#4285F4" }),
                                    react_1.default.createElement("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }),
                                    react_1.default.createElement("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z", fill: "#FBBC05" }),
                                    react_1.default.createElement("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" }),
                                    react_1.default.createElement("path", { d: "M1 1h22v22H1z", fill: "none" })),
                                react_1.default.createElement("span", null, "Sign up with Google")),
                            react_1.default.createElement(lucide_react_1.ArrowRight, { className: "h-5 w-5" })),
                        react_1.default.createElement(dapp_kit_3.ConnectModal, { trigger: react_1.default.createElement(button_1.Button, { variant: "outline", className: "w-full mt-4 justify-between cursor-pointer text-left h-[44px] font-normal" },
                                react_1.default.createElement("div", { className: "flex items-center gap-2" },
                                    react_1.default.createElement("span", null, "Connect Wallet")),
                                react_1.default.createElement(lucide_react_1.ArrowRight, { className: "h-5 w-5" })) })))))));
}
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
}
