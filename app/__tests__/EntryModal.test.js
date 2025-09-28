import { fireEvent, render, waitFor, screen } from '@testing-library/react-native';
import { getAllPerks } from '@/app/database/DataService';
import EntryModalScreen from '../entry-modal';

const { placeholderSnippets } = require('../../constants/TextSnippets');

it(`TextInput inside EntryModalScreen is usable`, async () => {
    // ARRANGE
    // query empty textinput
    const { getByTestId } = render(<EntryModalScreen />);
    const textInput = await waitFor(() => getByTestId('entry-modal_text-input'));
    
    // ACT
    const content = "Dies ist ein Testeintrag, der länger als ein paar Wörter geht.";
    fireEvent.changeText(textInput, content);

    // ASSERT
    expect(textInput.props.value).toBe(content);
    expect(placeholderSnippets).toContain(textInput.props.placeholder);
});

it('EntryModalScreen displays correctly without loaded data', async () => {
    // ARRANGE & ACT
    const allPerks = await getAllPerks();
    const { getByTestId, getByRole } = render(<EntryModalScreen />);
    const textInput = await waitFor(() => getByTestId('entry-modal_text-input'));
    const createBtn = await waitFor(() => getByRole('button', { name: "Add" }));

    // ASSERT
    for (const perk of allPerks) {
        const perkChip = await waitFor(() => getByRole('checkbox', { name: perk.title.toUpperCase() }));
        expect(perkChip.props.accessibilityState.selected).toBe(false);
    }
    expect(textInput.props.value).toBe('');
    expect(createBtn.props.accessibilityState.disabled).toBeFalsy();
    expect(placeholderSnippets).toContain(textInput.props.placeholder);
});

it('EntryModalScreen displays loaded data correctly', async () => {
    // ARRANGE
    // mock getEntry method to return sample entry
    const allPerks = await getAllPerks();
    const mockEntry = {
        id: 1,
        date: new Date().toISOString().slice(0, 10),
        text: "Dies ist ein Testeintrag",
        perks: [allPerks[0], allPerks[1]] 
    };
    require('@/app/database/DataService').getEntry.mockResolvedValueOnce(mockEntry);
    
    // ACT
    const { getByRole, getByTestId } = render(<EntryModalScreen />);
    const updateBtn = await waitFor(() => getByRole('button', { name: "Update" }));
    const textInput = await waitFor(() => getByTestId("entry-modal_text-input"));

    // ASSERT
    for (const perk of mockEntry.perks) {
        const perkChip = await waitFor(() => getByRole('checkbox', { name: perk.title.toUpperCase() }));
        expect(perkChip.props.accessibilityState.selected).toBe(true);
    }
    expect(textInput.props.value).toBe(mockEntry.text);
    expect(updateBtn.props.accessibilityState.disabled).toBeFalsy();
});