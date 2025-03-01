import { GroupMetadata } from 'baileys'
import { showConsoleError} from '../lib/util.js'
import { GroupController } from '../controllers/group.controller.js'

export async function partialGroupUpdate (groupData : Partial<GroupMetadata>){
    try{
        await new GroupController().updatePartialGroup(groupData)
    } catch(err: any){
        showConsoleError(err.message, "PARTIAL-GROUP-UPDATE")
    }
}