import Express, {NextFunction,Request,Response} from 'express';
import {UserController} from "./controller/user.controller";
import {routes} from "./decorators/router.decorators";
import {UserService} from "./service/user/user.service";

const app = Express();

app.use(Express.json())
app.use(Express.urlencoded({extended: true}))


const userService = new UserService();
const userController = new UserController(userService);


routes.forEach((route) => {
    app[route.method](route.path, route.middleware ? route.middleware : (_r : Request, _rs : Response, next: NextFunction) => {
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
