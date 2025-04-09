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
exports.executeTransactionBlockWithoutSponsorship = void 0;
const executeTransactionBlockWithoutSponsorship = (tx, enokiFlow, suiClient, callback, errorCallback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("jjjjj");
        // if (!isConnected) {
        //   return;
        // }
        // let tx = new Transaction();
        const signer = yield enokiFlow.getKeypair({
            network: "mainnet",
        });
        tx.setSender(signer.toSuiAddress());
        console.log(signer.toSuiAddress());
        // tx.setGasPrice(5000000000);
        tx.moveCall({
            target: '0x2::clock::timestamp_ms', // Replace with your package ID
            arguments: [
                tx.object("0x6"), // Kiosk object ID
            ],
        });
        const txBytes = yield tx.build({ client: suiClient });
        const signature = yield signTransaction(txBytes, enokiFlow);
        return suiClient.executeTransactionBlock({
            transactionBlock: txBytes,
            signature: signature,
            requestType: "WaitForLocalExecution",
            options: {},
        }).then((result) => {
            callback(result);
            console.log("lllllll");
            console.log(result.digest);
        }).catch(e => {
            if (errorCallback) {
                errorCallback(e);
            }
            console.log(e);
        });
    }
    catch (e) {
        console.log(e);
    }
});
exports.executeTransactionBlockWithoutSponsorship = executeTransactionBlockWithoutSponsorship;
const signTransaction = (bytes, enokiFlow) => __awaiter(void 0, void 0, void 0, function* () {
    // if (isUsingEnoki) {
    const signer = yield enokiFlow.getKeypair({
        network: "mainnet",
    });
    const signature = yield signer.signTransaction(bytes);
    return signature.signature;
    // }
    // const txBlock = Transaction.from(bytes);
    // return signTransactionBlock({
    //   transaction: txBlock,
    //   chain: `sui:${"mainnet"}`,
    // }).then((resp) => resp.signature);
});
