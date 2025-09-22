import PerkSelector from '../../components/PerkSelector';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

it(`Perks inside PerkSelector are tapable`, async () => {
    // ARRANGE
    // render the UI
    const mockFunction = jest.fn((prop) => console.log(`${prop.title} tapped`));
    const { getAllByRole } = render(
        <PerkSelector 
            selectedPerks={[]} 
            onPerkToggle={(perk) => mockFunction(perk)} 
        />
    );

    // access the perk chips
    const firstPerkChip = await waitFor(() => getAllByRole('checkbox')[0]);

    // ACT
    // Tap the perk
    fireEvent.press(firstPerkChip);

    // ASSERT
    // expect the callback
    expect(mockFunction).toHaveBeenCalled();
    // expect the selected state
    expect(firstPerkChip.props.accessibilityState.selected).toBe(true);
})