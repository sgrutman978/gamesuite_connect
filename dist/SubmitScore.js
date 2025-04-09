"use strict";
// // import { SuiClient } from "@mysten/sui/client";
// // import { Transaction } from "@mysten/sui/transactions";
// // export const suiClient = new SuiClient({ url: "https://go.getblock.io/2e301c1cd2e542e897c7a14109d81baf"});
// // export const programAddress = "";
// // async function submitScore(playerAddress: string, score: number) {
// //     try {
// //         const response = await fetch('http://your-server.com:3000/submit-score', {
// //             method: 'POST',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify({ playerAddress, score })
// //         });
// //         const { signature, publicKey } = await response.json();
// //         // Use Sui.js to submit the transaction
// //         // const tx = {
// //         //     kind: 'moveCall',
// //         //     data: {
// //         //         packageObjectId: 'your-package-id',
// //         //         module: 'leaderboard',
// //         //         function: 'submit_score',
// //         //         typeArguments: [],
// //         //         arguments: [playerAddress, score, signature],
// //         //     }
// //         // };
// //         // const tx = new Transaction();
// //         // tx.moveCall({ target: programAddress+"::multi_player::start_multi_player_game2", arguments: [
// //         //     tx.pure.address(addy), 
// //         //     tx.object("0x6"),
// //         //     tx.sharedObjectRef({
// //         //         objectId: gamesTrackerAddy!,
// //         //         mutable: true,
// //         //         initialSharedVersion: gamesTrackerVersion!
// //         //     }),
// //         //     tx.sharedObjectRef({
// //         //         objectId: nonceAddy!,
// //         //         mutable: true,
// //         //         initialSharedVersion: initVersion!
// //         //     })
// //         const tx = new Transaction();
// // 		// console.log(addy);
// // 		// await GetObjectContents(nonceAddy!).then(async (x) => {
// // 			tx.moveCall({ target: programAddress+"::gamesuite_sui::create_leaderboard", arguments: [
// // 				tx.pure.address(addy), 
// // 				tx.object("0x6"),
// // 				tx.sharedObjectRef({
// // 					objectId: gamesTrackerAddy!,
// // 					mutable: true,
// // 					initialSharedVersion: gamesTrackerVersion!
// // 				}),
// // 				tx.sharedObjectRef({
// // 					objectId: nonceAddy!,
// // 					mutable: true,
// // 					initialSharedVersion: initVersion!
// // 				})
// // 				// tx.pure.address(profile.id!), 
// // 				// tx.pure.u64(points), 
// // 			] 
// // 			}); 
// //         // Sign and execute with Sui wallet (e.g., using @mysten/sui.js)
// //         const result = await suiClient.signAndExecuteTransaction({transaction: tx, signer: });
// //         console.log('Score submitted:', result);
// //     } catch (error) {
// //         console.error('Error submitting score:', error);
// //     }
// // }
// import { Transaction } from '@mysten/sui/transactions';
// import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
// import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'; // Example wallet hook
// // Configuration
// const SERVER_URL = 'http://your-server.com:3000/submit-score';
// const PACKAGE_ID = 'your-package-id'; // Replace with your leaderboard package ID
// const MODULE_NAME = 'leaderboard';
// const FUNCTION_NAME = 'submit_score';
// // Assuming you're using a wallet provider like @mysten/wallet-kit
// function SubmitScoreComponent() {
//     const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
//     const currentAccount = useCurrentAccount();
//   const client = new SuiClient({ url: getFullnodeUrl('mainnet') }); // Adjust network
//   const submitScore = async (score: number) => {
//     try {
//       // Step 1: Get signature from server
//       const response = await fetch(SERVER_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ currentAccount: currentAccount?.address, score: score }),
//       });
//       const { signature, publicKey } = await response.json();
//       if (!signature || !publicKey) {
//         throw new Error('Invalid server response');
//       }
//       // Step 2: Build the transaction block
//       const tx = new Transaction();
//       // Call the Move function
//       tx.moveCall({
//         target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
//         arguments: [
//           tx.pure.vector('u8', publicKey),
//         ],
//       });
//       // Step 3: Sign and execute the transaction
//       const result = await signAndExecuteTransaction({
//             transaction: tx,
//             chain: `sui:mainnet`,
//         },{
// 			onSuccess: (result: any) => {
// 				console.log('executed transaction', result);
// 			},
// 			onError: (error: any) => {
// 				console.log(error);
// 			}
// 		});
//       console.log('Transaction successful:', result);
//       return result;
//     } catch (error) {
//       console.error('Error submitting score:', error);
//       throw error;
//     }
//   }
//   // Example usage in a React component
//   const handleSubmit = async () => {
//     const playerAddress = '0xYourAddressHere'; // Replace with actual address
//     const score = 100; // Example score
//     await submitScore(score);
//   };
//   // return (
//   //   <button onClick={handleSubmit}>Submit Score</button>
//   // );
// }
// export default SubmitScoreComponent;
