import { fireEvent, render, waitFor } from '@testing-library/react-native';
import EntryModalScreen from '../entry-modal';

it(`TextInput inside EntryModalScreen is usable`, async () => {
    // ARRANGE
    // query empty textinput
    const { getByDisplayValue } = render(<EntryModalScreen />);
    const textInput = await waitFor(() => getByDisplayValue(''));
    
    // ACT
    const content = "Dies ist ein Testeintrag, der länger als ein paar Wörter geht.";
    fireEvent.changeText(textInput, content);

    // ASSERT
    expect(textInput.props.value).toBe(content);
});