import { Stack } from 'expo-router';
import { GymProvider } from '@/context/GymContext';
import { COLORES_APP } from '@/constants/colores';

export default function RootLayout() {
  return (
    <GymProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORES_APP.superficie,
          },
          headerTintColor: COLORES_APP.texto,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          contentStyle: {
            backgroundColor: COLORES_APP.fondo,
          },
        }}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="dia/[dia]"
          options={{
            title: 'Detalle del Día',
            headerBackTitle: 'Inicio',
          }}
        />
        <Stack.Screen
          name="grupo/[grupo]"
          options={{
            title: 'Grupo Muscular',
            headerBackTitle: 'Catálogo',
          }}
        />
        <Stack.Screen
          name="ejercicio/[id]"
          options={{
            title: 'Ejercicio',
            headerBackTitle: 'Atrás',
          }}
        />
      </Stack>
    </GymProvider>
  );
}
