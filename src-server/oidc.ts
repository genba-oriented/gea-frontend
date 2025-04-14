
import { Request, Response } from 'express';
import { jwtDecode } from "jwt-decode";
import * as client from 'openid-client';
import { getSession } from './session';



let config: client.Configuration = null;

async function init() {
  if (process.env.OIDC_ISSUER_URL == null || process.env.OIDC_CLIENT_ID == null || process.env.OIDC_CLIENT_SECRET == null) {
    throw Error("環境変数OIDC_ISSUER_URL、OIDC_CLIENT_ID、OIDC_CLIENT_SECRETが設定されていない");
  }
  config = await client.discovery(
    new URL(process.env.OIDC_ISSUER_URL),
    process.env.OIDC_CLIENT_ID,
    process.env.OIDC_CLIENT_SECRET,
  );

  if (process.env.OIDC_DEBUG == "true") {
    config[client.customFetch] = async (url, option) => {
      console.log("############");
      console.log("req body=" + option.body.toString());
      const res = await fetch(url, option);
      console.log("res body=" + JSON.stringify(await res.clone().text()));
      console.log("############");
      return res;
    };
  }
}
// top level awaitを使うため、package.jsonのtypeをmoduleに設定する必要がある
await init();


export async function getAuthenticationRequestUrl(req: Request, res: Response) {
  if (process.env.OIDC_REDIRECT_URL == null) {
    throw Error("環境変数OIDC_REDIRECT_URLが設定されていない");
  }
  let redirect_uri: string = process.env.OIDC_REDIRECT_URL;
  let scope: string = "openid email profile";

  let code_verifier: string = client.randomPKCECodeVerifier();
  let code_challenge: string =
    await client.calculatePKCECodeChallenge(code_verifier);

  let parameters: Record<string, string> = {
    redirect_uri,
    scope,
    code_challenge,
    code_challenge_method: 'S256',
    state: client.randomState(),
    access_type: "offline",
    prompt: "consent"
  }

  const data = new AuthRequestParams();
  data.code_verifier = code_verifier;
  data.state = parameters.state;

  const session = getSession(req);
  await session.setData("AuthRequestParams", data);

  return client.buildAuthorizationUrl(config, parameters).href;
}


export async function retrieveTokens(req: Request, res: Response) {

  const callbackedUrl = req.protocol + '://' + req.get("host") + req.originalUrl;

  const session = getSession(req);
  const data: AuthRequestParams = session.getData("AuthRequestParams");

  if (data == null) {
    throw Error("sessionにcode_verifierやstateが保存されていない");
  }

  const tokens = await client.authorizationCodeGrant(
    config,
    new URL(callbackedUrl),
    {
      pkceCodeVerifier: data.code_verifier,
      expectedState: data.state,
    },
  );

  const tokensData = new Tokens();

  tokensData.idToken = tokens.id_token;
  tokensData.refreshToken = tokens.refresh_token;
  tokensData.retrievedDate = new Date().getTime() / 1000;

  //logExpiredIn(tokensData);

  await session.removeData("AuthRequestParams");
  await session.setData("Tokens", tokensData);

}

// Googleのアクセストークンはオパークトークン(JWTではない)なので、代わりにIDトークンを使用する
// API側で適切なチェックをすることが前提
// https://developers.google.com/identity/openid-connect/openid-connect#validatinganidtoken
export async function getIdToken(req: Request, res: Response) {
  const data = await refreshIfExpired(req, res);
  if (data == null) {
    return null;
  }

  return data.idToken;
}

export async function isLogined(req: Request, res: Response) {
  const data = await refreshIfExpired(req, res);
  if (data == null) {
    return false;
  }
  if (data.idToken == null) {
    return false;
  }
  return true;
}


async function refreshIfExpired(req: Request, res: Response) {
  const session = getSession(req);
  const data = session.getData("Tokens");
  if (data == null) {
    return null;
  }
  const now = new Date().getTime() / 1000;
  const decoded = jwtDecode(data.idToken);

  if (decoded.exp == null) {
    throw Error("expがJWTに存在しない");
  }

  // 長い期間経ったら強制的に再ログインしてもらう
  const spanSec = 60 * 60 * 24 * 30; // 1 month
  //const spanSec = 60 * 60; // 1 hour
  if (now - data.retrievedDate > spanSec) {
    console.log("force session expired");
    return null;
  }

  if (now < decoded.exp) {
    return data;
  }
  if (data.refreshToken == null) {
    return data;
  }
  const tokens = await client.refreshTokenGrant(config, data.refreshToken);
  data.idToken = tokens.id_token;
  // refreshTokenはnullみたいなので、更新しない
  // data.refreshToken = tokens.refresh_token;

  console.log("token refreshed");
  logExpiredIn(data);
  await session.setData("Tokens", data);
  return data;
}

function logExpiredIn(data: Tokens) {
  if (data.idToken != null) {
    const decodedIdToken = jwtDecode(data.idToken);
    if (decodedIdToken.exp != null) {
      console.log("idToken expired in=" + new Date(decodedIdToken.exp * 1000).toString());
    } else {
      console.log("decodedIdToken.expがnull");
    }
  }
  // refreshTokenはJWTじゃないみたいなので出力しない

}

class AuthRequestParams {
  code_verifier: string;
  state: string;
}


class Tokens {
  idToken: string;
  refreshToken: string;
  retrievedDate: number;
};
