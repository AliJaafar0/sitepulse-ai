import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { db } from './db';
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-only-change-me');
const COOKIE='sitepulse_session';
export async function hashPassword(p:string){return bcrypt.hash(p,12)}
export async function verifyPassword(p:string,h:string){return bcrypt.compare(p,h)}
export async function createSession(userId:string){const token=await new SignJWT({sub:userId}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('7d').sign(secret); (await cookies()).set(COOKIE,token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*7});}
export async function clearSession(){(await cookies()).delete(COOKIE)}
export async function getCurrentUser(){try{const token=(await cookies()).get(COOKIE)?.value;if(!token)return null;const {payload}=await jwtVerify(token,secret);if(typeof payload.sub!=='string')return null;return db.user.findUnique({where:{id:payload.sub}})}catch{return null}}
