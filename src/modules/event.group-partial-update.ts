import { GroupMetadata } from 'baileys'
import { showConsoleError} from './util.js'
import { GroupController } from '../controllers/GroupController.js'

export async function partialGroupUpdate (groupData : Partial<GroupMetadata>){
    try{
        await new GroupController().updatePartialGroup(groupData)
    } catch(err: any){
        showConsoleError(err.message, "PARTIAL-GROUP-UPDATE")
    }
}