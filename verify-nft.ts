import { createNft, fetchDigitalAsset, fetchDigitalAssetByMetadata, findMetadataPda, mplTokenMetadata, verifyCollectionV1 } from "@metaplex-foundation/mpl-token-metadata"
import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from '@solana-developers/helpers';
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { keypairIdentity, generateSigner, percentAmount, publicKey } from "@metaplex-foundation/umi";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const user = await getKeypairFromFile();

await airdropIfRequired(connection, user.publicKey, 1 * LAMPORTS_PER_SOL, 0.5 * LAMPORTS_PER_SOL);
console.log(`User ${user.publicKey.toBase58()} loaded`);

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser))

console.log("Set up umi instance for user ");

const collectionAddress = publicKey("CQVa4oUnbNmxK5pTcyzs1h5MSWtVmdxrunAAKkECQ9Eg");
const nftAddress = publicKey("DfVi4AeddsXmU3VZXtFbvqvTC7rjdDAiZJtxbSKyK8vv");

const tx = await verifyCollectionV1(umi, {
    metadata: findMetadataPda(umi, {
        mint: nftAddress
    }),
    collectionMint: collectionAddress,
    authority: umi.identity
});

await tx.sendAndConfirm(umi);
console.log(`NFT ${nftAddress} verified as member of collection ${collectionAddress}!! See explorer link ${getExplorerLink("address", nftAddress, "devnet")}`); 