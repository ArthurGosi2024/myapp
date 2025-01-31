import Express, {NextFunction, Request, Response} from 'express';
import {UserController} from "./controller/user/user.controller";
import {routes} from "./decorators/router.decorators";
import helmet from "helmet";
import session from 'express-session'
import {EmailController} from "./controller/email/email.controller";

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
const emailController = new EmailController();


const controllers = {userController, emailController};

routes.forEach((route) => {
    const boundHandler = Object.values(controllers)
        .find(ctrl => Object.getPrototypeOf(ctrl).hasOwnProperty(route.handler.name))
        ? route.handler.bind(Object.values(controllers).find(ctrl => Object.getPrototypeOf(ctrl).hasOwnProperty(route.handler.name)))
        : route.handler;

    app[route.method](
        route.path,
        route.middleware || ((_, __, next) => next()),
        boundHandler
    );
});

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on process.e ${process.env.PORT}`)
})

process.once('SIGINT', () => {
    console.log("Conexão com o bando de dados, encerrada com sucesso.")
    process.exit();
});


