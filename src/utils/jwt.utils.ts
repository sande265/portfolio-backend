import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken';
import { Schema } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { Config } from '../config';
require("dotenv").config()

const secret: string = process.env.SECRET ?? "";

export const TokenSchema = new Schema({
  access_token: {
    type: String,
    required: true
  },
  expires_at: {
    type: String || Number,
  },
  refresh_token: {
    type: String,
    required: true
  }
}, { versionKey: false })

interface PayloadTypes {
  _id: string | number,
  username?: string | number | undefined,
  email?: string | undefined,
}

/**
 * generates JWT used for local testing
 */
export const generateToken = (payload: PayloadTypes, iss: string): Object | string => {

  // read private key value
  const privateKey = (): Buffer | string => {
    try {
      return fs.readFileSync(path.join(__dirname, './../../../private.key'));
    } catch (error: any) {
      console.log("Error: ", error.message);
      console.log("Using ENV keys");
      return Config.privateKey;
    }
  }

  const token_expiry: any = process.env.TOKEN_EXP;
  const rt_expiry: number | string | undefined = process.env.RT_EXP || token_expiry * 2;

  const signInOptions: SignOptions = {
    // RS256 uses a public/private key pair. The API provides the private key
    // to generate the JWT. The client gets a public key to validate the
    // signature
    algorithm: 'RS256',
  };

  const modifiedPayload: any = {
    iat: Math.floor(Date.now() / 1000) - 30,
    exp: Math.floor(Date.now() / 1000) + parseInt(token_expiry),
    sub: payload.username,
    iss: iss,
    jti: randomUUID(),
    scopes: ["*"],
    params: {
      ...payload
    }
  }

  // generate JWT
  try {
    const token = sign(modifiedPayload, { key: privateKey(), passphrase: secret }, signInOptions);
    const rt = sign({ owner: payload?._id, jti: randomUUID() }, secret, { expiresIn: rt_expiry ?? parseInt(token_expiry) * 2 });

    return {
      access_token: token,
      expires_in: parseInt(token_expiry),
      refresh_token: rt
    };
  } catch (error: any) {
    return error.reason
  }
};

interface TokenPayload {
  exp: number;
  accessTypes: string[];
  name: string;
  userId: number;
}


/**
 * checks if JWT token is valid
 *
 * @param token the expected token payload
 */
export const validateToken = (token: string): Promise<TokenPayload> => {
  const publicKey = (): Buffer | string  => {
    try {
      return fs.readFileSync(path.join(__dirname, './../../../public.key'))
    } catch (error: any) {
      console.log("Error: ", error.message);
      console.log("Using ENV keys");
      return Config.publicKey;
    }
  }

  const verifyOptions: VerifyOptions = {
    algorithms: ['RS256'],
  };

  return new Promise((resolve, reject) => {
    verify(token, publicKey(), verifyOptions, (error, decoded: any) => {
      if (error) return reject(error);
      resolve(decoded);
    })
  });
}