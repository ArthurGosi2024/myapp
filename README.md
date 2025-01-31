# API de Autenticação

🚀 Meu primeiro projeto após um tempo longe do Desenvolvimento Web!

Depois de um período afastado, decidi retomar os estudos criando uma API de autenticação, com envio de e-mails para operações de CRUD, seguindo boas práticas de segurança e organização.

Durante o desenvolvimento, me aprofundei no uso de **decorators** e **middlewares**, dois conceitos essenciais no **NestJS** que fortalecem a segurança e escalabilidade da aplicação. Utilizei **decoradores** para definir rotas e validar acessos, garantindo um código modular e bem estruturado.

## 📌 Objetivo do Projeto
O objetivo do projeto é servir como um modelo para iniciantes, demonstrando como estruturar uma API de login de forma organizada, escalável e de fácil manutenção.

## 🛠 Tecnologias Utilizadas
- **Express** - Gerenciamento de rotas
- **Express-session** - Gerenciamento de sessões
- **Node.js** - Runtime
- **Class-Validator** - Validação de dados
- **Prisma** - ORM
- **Nodemailer** - Envio de e-mails
- **Helmet** - Reforço na segurança

## 🚀 Como Executar o Projeto

### 📌 Requisitos
Antes de iniciar, certifique-se de ter instalado em seu ambiente:
- **Node.js** (v14+)
- **NPM** ou **Yarn**
- **PostgreSQL** ou outro banco compatível com Prisma

### 📥 Instalação
1. Clone o repositório:
   ```sh
   git clone https://github.com/ArthurGosi2024/myapp
   ```
2. Acesse a pasta do projeto:
   ```sh
   cd seu-repositorio
   ```
3. Instale as dependências:
   ```sh
   npm install
   ```
   ou
   ```sh
   yarn install
   ```
4. Configure o banco de dados no arquivo **.env**:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   ```
5. Execute as migrações do Prisma:
   ```sh
   npx prisma migrate dev --name init
   ```

### ▶️ Executando a API
Inicie o servidor:
```sh
npm run start
```
ou
```sh
yarn start
```
A API estará disponível em **http://localhost:3000**.

## 🔧 Estrutura do Projeto

```
├── src
│   ├── constants       # Constantes globais
│   ├── controllers     # Lógica dos endpoints
│   ├── decorators      # Decoradores personalizados
│   ├── dtos            # Data Transfer Objects (DTOs)
│   ├── enums           # Definição de enums
│   ├── helpers         # Funções auxiliares
│   ├── infra          # Configurações de infraestrutura
│   ├── interfaces      # Interfaces TypeScript
│   ├── middlewares     # Middlewares para a API
│   ├── models          # Modelos Prisma
│   ├── prisma          # Configuração do Prisma ORM
│   ├── repository      # Repositórios para acesso a dados
│   ├── services        # Serviços da aplicação
│   ├── main.ts         # Arquivo principal
│   ├── package.json    # Dependências do projeto
│   ├── tsconfig.json   # Configuração do TypeScript
```

## 📫 Contribuição
Contribuições são bem-vindas! Para contribuir:
1. Fork o repositório
2. Crie uma branch com sua feature (`git checkout -b minha-feature`)
3. Commit suas alterações (`git commit -m 'Adicionando minha feature'`)
4. Envie para o repositório (`git push origin minha-feature`)
5. Abra um Pull Request

## 📄 Licença
Este projeto está sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
💻 Desenvolvido por [ArthurGosi2024]([https://github.com/seu-usuario](https://github.com/ArthurGosi2024))

