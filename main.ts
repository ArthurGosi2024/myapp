import Express, {NextFunction, Request, Response} from 'express';
import {UserController} from "./controller/user.controller";
import {routes} from "./decorators/router.decorators";
import helmet from "helmet";
import session, {MemoryStore} from 'express-session'

const app = Express();


app.use(Express.json())
app.use(Express.urlencoded({extended: true}))
app.use(helmet())
app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,         // Não re-salvar a sessão se não houve modificações
        saveUninitialized: true, // Salvar uma sessão nova, mesmo que não tenha dados
        cookie: {
            httpOnly: true,       // Impede o acesso ao cookie via JavaScript
            secure: false,        // Definir como true se estiver usando HTTPS
            maxAge: 60000,        // Duração do cookie (aqui está configurado para 1 minuto)
        },
    })
);


const userController = new UserController();


routes.forEach((route) => {
    app[route.method](route.path, route.middleware ? route.middleware : (_r: Request, _rs: Response, next: NextFunction) => {
        next();
    }, route.handler.bind(userController));
});

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on process.e ${process.env.PORT}`)
})

process.once('SIGINT', () => {
    console.log("Conexão com o bando de dados, encerrada com sucesso.")
    process.exit();
});
