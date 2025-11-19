import { createEntry, updateEntry } from "../Services/EntryService";
import { saveMentionsToEntry } from "../Services/MentionService";
import { Entry } from "../Models";


// creates or updates Entry with handling Mentions
export async function saveEntryWithMentions(entry: Entry): Promise<Entry> {
    if (entry.id == -1) {
        const newEntry = await createEntry(entry);
        entry = newEntry;
    } else {   
        await updateEntry(entry);
    }

    if (entry.text) {
        const uniqueMentionNames = extractUniqueMentions(entry.text);
        console.log("MENTIONS: ", uniqueMentionNames);
        await saveMentionsToEntry(uniqueMentionNames, entry);
    }

    return entry;
}

// TODO: bestehende Mentions werden anders im Text gespeichert als neue "{@}[Name](id)"
// werden also bei erneutem speichern gelöscht und keine neuen angelegt (wegen suggestion tap)
// in Zukunft nur noch neues Format berücksichtigen, aufpassen auf injection 
function extractUniqueMentions(text: string): string[] {
    const result: string[] = [];
    console.log("TEXT: ", text)
    for (const word of text.split(/\s+/)) {
        if (word.startsWith('@')) {
            const extractedWord = word.substring(1);
            console.log("EXTR WORD", extractedWord)
            if (extractedWord && !result.includes(extractedWord)) {
                result.push(extractedWord);
            }
        }
    }
    return result;
}