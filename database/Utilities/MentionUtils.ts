import { Person } from "../Models";

export function encodeLinkedPersonsInText(linkedPersons: Person[], text: string): string {
    var encodedText = "";
    for (const linkedPerson of linkedPersons) {
        encodedText = text.replaceAll(
            `@${linkedPerson.name}`, 
            `{@}[${linkedPerson.name}](${linkedPerson.id})`
        );
    }
    return encodedText;
}
