import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Suspense, useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { db, initDrizzleDb } from '../database/DataService';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations'
import { SQLiteProvider } from 'expo-sqlite';
import { ActivityIndicator } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Roboto: require('../assets/fonts/Roboto-VariableFont_wdth,wght.ttf'),
    RobotoItalic: require('../assets/fonts/Roboto-Italic-VariableFont_wdth,wght.ttf'),
    PublicSans: require('../assets/fonts/PublicSans-VariableFont_wght.ttf'),
    PublicSansItalic: require('../assets/fonts/PublicSans-Italic-VariableFont_wght.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    initDrizzleDb();
  }, [success])


  const colorScheme = useColorScheme();
  
  function formatDayString(dayString: string) {
    return new Date(dayString).toDateString();
  }

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={"drizzle-db"}
        options={{ enableChangeListener: true }}
        useSuspense>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <KeyboardProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen 
                name="info" 
                options={{ 
                  headerBackButtonDisplayMode: "generic",
                  title: ""
                }} 
                />
              <Stack.Screen
                name="perk-settings"
                options={{
                  headerTitle: "Perk Customization",
                  headerBackButtonDisplayMode: "generic"
                }}
                />
              <Stack.Screen
                name="data-stats"
                options={{
                  headerTitle: "Data Stats",
                  headerBackButtonDisplayMode: "generic"
                }}
                />
              <Stack.Screen name="entry-modal"
                options={({ route }) => ({
                  presentation: 'modal',
                  headerTitle: formatDayString(route.params?.selectedDay) ?? 'Edit Entry',
                })}
                />
            </Stack>
          </KeyboardProvider>
        </ThemeProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
