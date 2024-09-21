import { NextResponse } from 'next/server';
import { signVerify } from 'ton-crypto';
import { beginCell, Address } from 'ton-core';

export async function POST(request: Request) {
    const { proof, address, publicKey } = await request.json();

    try {
        const isValid = verifyTonConnectProof(proof, address, publicKey);
        return NextResponse.json({ isValid });
    } catch (error) {
        console.error('Error verifying proof:', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
    }
}

function verifyTonConnectProof(proof: string, address: string, publicKey: string): boolean {
    // Decode the proof
    const proofData = JSON.parse(Buffer.from(proof, 'base64').toString());

    // Reconstruct the message cell as per TON Connect specifications
    const messageCell = beginCell()
        .storeBuffer(Buffer.from('ton-proof-item-v2/', 'utf-8'))
        .storeUint(BigInt(proofData.timestamp), 64)
        .storeBuffer(Buffer.from(proofData.domain.length.toString(), 'utf-8'))
        .storeBuffer(Buffer.from(proofData.domain, 'utf-8'))
        .storeAddress(Address.parse(address))
        .storeBuffer(Buffer.from(proofData.payload, 'utf-8'))
        .endCell();

    // Get the hash of the message cell
    const messageHash = messageCell.hash();

    // Convert signature and public key to Buffer
    const signatureBuffer = Buffer.from(proofData.signature, 'base64');
    const publicKeyBuffer = Buffer.from(publicKey, 'hex');

    // Verify the signature
    return signVerify(messageHash, signatureBuffer, publicKeyBuffer);
}
