
import { NextRequest, NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

export async function POST(request: NextRequest) {
  try {
    const { encryptedCode } = await request.json();
    const secretKey = process.env.ENCRYPTION_SECRET;

    if (!encryptedCode || !secretKey) {
      return NextResponse.json({ error: 'Missing code or key' }, { status: 400 });
    }

    const bytes = CryptoJS.AES.decrypt(encryptedCode, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 403 });
    }

    return NextResponse.json({ decryptedId: decryptedText });
  } catch (error) {
    console.error('Decryption error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
