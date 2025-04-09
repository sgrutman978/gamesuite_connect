"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@mysten/enoki/react");
const enoki_controller_1 = require("./enoki_controller");
const _1 = require(".");
class GameSuiteClient {
    constructor(enokiFlow, currentAccount, signAndExec) {
        this.enokiFlow = (0, react_1.useEnokiFlow)();
        this.myAddy = "";
        this.isEnoki = false;
        this.enokiFlow = enokiFlow;
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
            (0, enoki_controller_1.executeTransactionBlockWithoutSponsorship)(transaction, this.enokiFlow, _1.suiClient, callback, errorCallback);
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
            chain: `sui:${_1.myNetwork}`,
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
