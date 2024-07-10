import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";
import GetAccount from "./application/usecase/account/GetAccount";
import Signup from "./application/usecase/account/Signup";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter, HapiAdapter } from "./infra/http/HttpServer";
import AccountController from "./infra/controller/AccountController";

const connection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(connection);
const signup = new Signup(accountRepository);
const getAccount = new GetAccount(accountRepository);
// const httpServer = new ExpressAdapter();
const httpServer = new HapiAdapter();
new AccountController(httpServer, signup, getAccount);
httpServer.listen(3000);
