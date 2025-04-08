import { GroupController } from "../controllers/group.controller";
import { UserController } from "../controllers/user.controller";
import { BotController } from "../controllers/bot.controller";

export default async function databaseRebuilder(){
    //Reconstroi e atualiza os dados do bot
    new BotController().rebuildBot()
    //Reconstroi e atualiza os dados dos usuários
    await new UserController().rebuildUsers()
    //Reconstroi e atualiza os dados dos grupos
    await new GroupController().rebuildGroups()
    //Reconstroi e atualiza os dados dos participantes dos grupos
    await new GroupController().rebuildParticipants()
    
}