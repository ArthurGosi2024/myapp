import {CookieOptions} from "express";


export const DEFAULT_JWT_CONSTATS :  CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Apenas HTTPS em produção
    sameSite: 'strict', // Pode ser 'Strict' ou 'None' dependendo do fluxo
    maxAge: 24 * 60 * 60 * 1000 // 1 dia
}