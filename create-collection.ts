import {createNft, fetchDigitalAsset, fetchDigitalAssetByMetadata, mplTokenMetadata} from "@metaplex-foundation/mpl-token-metadata"
import {airdropIfRequired, getExplorerLink, getKeypairFromFile} from '@solana-developers/helpers'; 
import {createUmi} from "@metaplex-foundation/umi-bundle-defaults";
import {keypairIdentity, generateSigner, percentAmount} from "@metaplex-foundation/umi";
import {Connection, LAMPORTS_PER_SOL, clusterApiUrl} from "@solana/web3.js" ;

const connection = new Connection(clusterApiUrl("devnet")); 
const user = await getKeypairFromFile();

await airdropIfRequired(connection, user.publicKey, 1*LAMPORTS_PER_SOL, 0.5*LAMPORTS_PER_SOL); 
console.log(`User ${user.publicKey.toBase58()} loaded`); 

const umi = createUmi(connection.rpcEndpoint); 
umi.use(mplTokenMetadata()); 

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey); 
umi.use(keypairIdentity(umiUser))

console.log("Set up umi instance for user "); 

const collectionMint = generateSigner(umi); 

const tx = await createNft(umi, {
    mint: collectionMint, 
    name: "Best Nft collection", 
    symbol: "BSNFT", 
    uri: "https://gist.githubusercontent.com/Mudtjn/cf4db6ac534142ff709b706f4a8adf98/raw/ceaa7a597b6dfe0363d758339f2bfcddb5f26aad/sample-nft-offchain-data.json", 
    sellerFeeBasisPoints: percentAmount(0), 
    isCollection: true  
})
await tx.sendAndConfirm(umi); 

const createdNftCollection = await fetchDigitalAsset(umi, collectionMint.publicKey);
console.log(`Created Collection :robot::robot::robot:!! Address is ${getExplorerLink("address", createdNftCollection.mint.publicKey, "devnet")}`);  