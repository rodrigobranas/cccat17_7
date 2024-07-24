import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter, HapiAdapter } from "./infra/http/HttpServer";
import Registry from "./infra/di/Registry";

const connection = new PgPromiseAdapter();
// const httpServer = new ExpressAdapter();
const httpServer = new HapiAdapter();
Registry.getInstance().provide("httpServer", httpServer);
httpServer.listen(3000);
