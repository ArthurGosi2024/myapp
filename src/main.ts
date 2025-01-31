import Express from "express";
import helmet from "helmet";
import session from "express-session";

import cors from "cors";
import { UserController } from "./controller/user/user.controller";
import { EmailController } from "./controller/email/email.controller";
import { routes } from "./decorators/router.decorators";

const app = Express();

const corsOptions = {
	origin: process.env.DOMAIN_FRONTEND,
	methods: ["GET", "POST", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors(corsOptions));
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
		cookie: {
			httpOnly: true,
			secure: false,
			maxAge: 60000,
		},
	})
);

const userController = new UserController();
const emailController = new EmailController();

const controllers = { userController, emailController };

routes.forEach((route) => {
	const boundHandler = Object.values(controllers).find((ctrl) =>
		Object.getPrototypeOf(ctrl).hasOwnProperty(route.handler.name)
	)
		? route.handler.bind(
				Object.values(controllers).find((ctrl) =>
					Object.getPrototypeOf(ctrl).hasOwnProperty(route.handler.name)
				)
		  )
		: route.handler;

	app[route.method](
		route.path,
		route.middleware || ((_, __, next) => next()),
		boundHandler
	);
});

app.listen(process.env.PORT, () => {
	console.log(`Example app listening on process.e ${process.env.PORT}`);
});

process.once("SIGINT", () => {
	console.log("Conexão com o bando de dados, encerrada com sucesso.");
	process.exit();
});
