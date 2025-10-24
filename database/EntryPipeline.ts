import { createEntry, updateEntry } from "./EntryService";
import { saveMentionsToEntry } from "./MentionService";
import { Entry } from "./Models";


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
        await saveMentionsToEntry(uniqueMentionNames, entry);
    }

    return entry;
}

function extractUniqueMentions(text: string): string[] {
    const result: string[] = [];
    for (const word of text.split(/\s+/)) {
        if (word.startsWith('@')) {
            const extractedWord = word.substring(1);
            if (extractedWord && !result.includes(extractedWord)) {
                result.push(extractedWord);
            }
        }
    }
    return result;
}