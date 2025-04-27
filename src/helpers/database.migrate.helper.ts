import { GroupController } from "../controllers/group.controller.js";
import { UserController } from "../controllers/user.controller.js";
import { BotController } from "../controllers/bot.controller.js";

export default async function databaseMigration(){
    new BotController().migrateBot()
    await new UserController().migrateUsers()
    await new GroupController().migrateGroups()
    await new GroupController().migrateParticipants()
}