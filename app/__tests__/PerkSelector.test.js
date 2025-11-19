import { defaultPerks } from '@/constants/Perks';
import PerkSelector from '../../components/PerkSelector';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as EntryService from '@/database/Services/EntryService';
import { experimental_LayoutConformance } from 'react-native';

it(`Perks inside PerkSelector are selectable`, async () => {
    // ARRANGE
    // render the UI
    const mockFunction = jest.fn((perk) => console.log(`${perk.title} tapped`));
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

it('Perks inside PerkSelector initially selected andn deselectable', async () => {
    // ARRANGE
    const mockFunction = jest.fn((perk) => console.log(`${perk.title} tapped`));
    const allPerks = await EntryService.getAllPerks();
    const selectedPerk = allPerks[0];
    // console.log("selected perk: ", selectedPerk);
    // render the UI
    const { getByRole } = render(
        <PerkSelector 
            selectedPerks={[selectedPerk]} 
            onPerkToggle={(perk) => mockFunction(perk)} 
        />
    );

    // access the perk chips
    const perkChip = await waitFor(() => getByRole("checkbox", { name: selectedPerk.title.toUpperCase() }));
    // console.log("accessibilityState: ", perkChip.props.accessibilityState.selected);
    // check if perk is correctly selected initially 
    expect(perkChip.props.accessibilityState.selected).toBe(true);
    
    // ACT
    // Tap the perk
    fireEvent.press(perkChip);

    // ASSERT
    // expect the callback
    expect(mockFunction).toHaveBeenCalled();
    // expect the selected state to have changed to false
    expect(perkChip.props.accessibilityState.selected).toBe(false);
})

it('Perks inside PerkSelector are multi selectable', async () => {
    // ARRANGE
    const mockFunction = jest.fn((perk) => console.log((`${perk.title} tapped`)));
    const { getByRole } = render(
        <PerkSelector 
            selectedPerks={[]}
            onPerkToggle={(perk) => mockFunction(perk)} 
        />
    );
    const allPerks = await getAllPerks();

    // ACT
    // query all selectable perkChips
    for (const perk of allPerks) {
        const perkChip = await waitFor(() => getByRole("checkbox", { name: perk.title.toUpperCase() }));
        fireEvent.press(perkChip);
        // console.log("perkchip pressed: ", perkChip);
        expect(mockFunction).toHaveBeenCalledWith(expect.objectContaining({
            id: perk.id,
            title: perk.title
        }));
        expect(perkChip.props.accessibilityState.selected).toBe(true);
    }
})