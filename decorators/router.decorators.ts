// Decorator para registrar rotas
import { Middleware } from "express-validator/lib/base";

export const routes: { path: string; method: string; middleware?: Middleware; handler: Function }[] = [];


export function Route(method: "get" | "post" | "put" | "delete", path: string, middleware?: Middleware) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        routes.push({
            method,
            path,
            middleware,
            handler: target[propertyKey],
        });
    };
}


export function DefaultParams() {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        console.log(target, propertyKey, parameterIndex, 'aqui')
    }
}