import {EmailService} from "../../service/email/email.service";
import {Route} from "../../decorators/router.decorators";
import {Request, Response} from 'express'


export class EmailController {

    private emailService: EmailService;


    constructor() {
        this.emailService = new EmailService();
    }


    @Route("post", "/confirm-email")
    confirmEmail(request: Request, response: Response): void {
    }

    forgotPassword(data: any): void {
    }

    recoverPassword(data: any): void {
    }

    resendEmailConfirmation(data: any): void {
    }

}