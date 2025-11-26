import { Person } from "../Models";


export function extractUniqueMentions(text: string): string[] {
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

export function encodeLinkedPersonsInText(linkedPersons: Person[], text: string): string {
    var encodedText = text;
    for (const linkedPerson of linkedPersons) {
        encodedText = encodedText.replaceAll(
            `@${linkedPerson.name}`, 
            `{@}[${linkedPerson.name}](${linkedPerson.id})`
        );
    }
    return encodedText;
}
