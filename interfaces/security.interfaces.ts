export interface ISecurity {
    failedLoginAttempts: number; // Tentativas de Login com falha
    isAccountLocked: boolean; // conta bloqueada
    lockUntil: number; // conta bloquear até
    passwordResetExpiration: string; // expiração da redefinição de senha
    passwordResetToken: string; // token de redefinição de senha
    confirmEmailAccount: boolean; // confirmar conta de e-mail definir token
    confirmEmailToken: string; // confirmar token de e-mail
    confirmEmailExpiration: string; // confirmar expiração do e-mail
}