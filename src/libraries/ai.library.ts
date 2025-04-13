import { showConsoleLibraryError } from '../utils/general.util.js';
import botTexts from '../helpers/bot.texts.helper.js';

export async function questionAI(text: string){
    try {
        //
    } catch(err){
        showConsoleLibraryError(err, 'questionAI')
        throw new Error(botTexts.library_error)
    }
}

export async function imageAI(text: string){
    try {
        //
    } catch(err){
        showConsoleLibraryError(err, 'imageAI')
        throw new Error(botTexts.library_error)
    }
}