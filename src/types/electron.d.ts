import { Remote } from "electron";
import DatabaseService from "electronMain/db";

declare module "electron" {
  interface Remote {
    getGlobal(name: "db"): DatabaseService;
  }
}
