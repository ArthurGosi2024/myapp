import {Response} from "express";

export interface IContractRepositoryCrudGenerics<T> {
    insert: (data: T) => Promise<void>;
    findBy: (data: T) => Promise<Boolean | T>;
    update: (data: T, dataNew: T) => Promise<void>;
    delete: (data: T) => Promise<void>;
}

export interface IContractServiceCrudGenerics<T> {
    insert: (data: T) => Promise<Boolean> |  Promise<T>;
    findBy: (data: T) => Promise<Boolean> |  Promise<T>;
    update: (data: T, dataNew: T) => void;
    delete: (data: T) => Promise<Boolean> |  Promise<T>;
}