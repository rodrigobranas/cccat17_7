import AccountService, { AccountServiceProduction } from "./application";
import API from "./driver";
import { AccountDAODatabase } from "./resource";

const accountDAO = new AccountDAODatabase();
const accountService = new AccountServiceProduction(accountDAO);
const api = new API(accountService);
api.build();
api.start();
