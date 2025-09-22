import PerkSelector from '../../components/PerkSelector';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { getAllPerks } from '@/app/database/DataService';

it(`Perks inside PerkSelector are tapable`, async () => {
    // ARRANGE
    // render the UI
    const mockFunction = jest.fn();
    const { getByTestId } = render(
        <PerkSelector 
            selectedPerks={[]} 
            onPerkToggle={mockFunction} 
        />
    );

    // access the perk chips
    const mappedPerks = await getAllPerks();
    const firstPerkChip = await waitFor(() =>
        getByTestId(`perk-${mappedPerks[0].id}`)
    );

    // ACT
    // Tap the perk
    fireEvent.press(firstPerkChip);

    // ASSERT
    // expect the callback
    expect(mockFunction).toHaveBeenCalled();
    // expect the selected state
    expect(firstPerkChip.props.accessibilityState.selected).toBe(true);
})