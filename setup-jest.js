console.log('loading mock setup...');

jest.mock('expo-router', () => {
    const todayString = new Date().toISOString().slice(0, 10);
    return {
        useLocalSearchParams: () => ({ selectedDay: todayString }),
        router: { dismiss: jest.fn() }
    }
});

jest.mock('@/app/database/EntryService', () => {
    return {
        getEntry: jest.fn(() => Promise.resolve(null))
    }
});

jest.mock('@/app/database/PerkService', () => {
    const { defaultPerks } = require('./constants/Perks');
    const mappedPerks = defaultPerks.map((perk, idx) => ({
        ...perk,
        id: idx
    }));
    return {
        getAllPerks: jest.fn(() => Promise.resolve(mappedPerks)),
    }
});