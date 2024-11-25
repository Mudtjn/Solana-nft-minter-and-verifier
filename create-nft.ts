import {createNft, fetchDigitalAsset, fetchDigitalAssetByMetadata, mplTokenMetadata} from "@metaplex-foundation/mpl-token-metadata"
import {airdropIfRequired, getExplorerLink, getKeypairFromFile} from '@solana-developers/helpers'; 
import {createUmi} from "@metaplex-foundation/umi-bundle-defaults";
import {keypairIdentity, generateSigner, percentAmount, publicKey} from "@metaplex-foundation/umi";
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

const collectionAddress = publicKey("CQVa4oUnbNmxK5pTcyzs1h5MSWtVmdxrunAAKkECQ9Eg");
console.log(`Creating NFT...`); 

const mint = generateSigner(umi);
console.log(`mint is ${mint}`); 
const tx =  await createNft(umi, {
    mint, 
    name: "My first nft", 
    uri: "https://gist.githubusercontent.com/Mudtjn/cf4db6ac534142ff709b706f4a8adf98/raw/ceaa7a597b6dfe0363d758339f2bfcddb5f26aad/sample-nft-offchain-data.json", 
    sellerFeeBasisPoints: percentAmount(0), 
    collection: {
        key: collectionAddress, 
        verified: false
    } 
}); 

await tx.sendAndConfirm(umi); 
const createdNft = await fetchDigitalAsset(umi, mint.publicKey); 

console.log(`Created Nft!! Address is ${getExplorerLink("address", createdNft.mint.publicKey, "devnet")}`); 
