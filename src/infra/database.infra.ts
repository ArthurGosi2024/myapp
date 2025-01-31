import { PrismaClient} from "@prisma/client";


export class DatabaseInfra {

    protected instance: PrismaClient | null = null;

    constructor() {
        if (this.instance === null) {
            this.instance = new PrismaClient();
        }
    }
    init() {
        this.instance.$connect();
    }
    destroy() {
        this.instance.$disconnect();
        this.instance = null;
    }
}
