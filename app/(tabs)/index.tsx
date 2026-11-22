import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { planSemanal } from '@/data/plan';
import { useGym } from '@/context/GymContext';
import { TarjetaDia } from '@/components/TarjetaDia';
import { COLORES_APP } from '@/constants/colores';
import type { DiaSemana } from '@/types/gym';

const MAPA_DIAS_JS: Record<number, DiaSemana | null> = {
  1: 'lunes',
  2: 'martes',
  3: 'miercoles',
  4: 'jueves',
  5: 'viernes',
  6: 'sabado',
  0: null, // Domingo: descanso
};

export default function InicioScreen() {
  const { completados, socio } = useGym();
  const diaSemanaIndex = new Date().getDay();
  const diaActualClave = MAPA_DIAS_JS[diaSemanaIndex];
  const esDomingo = diaSemanaIndex === 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.cabecera}>
          <Text style={styles.saludo}>¡Hola, {socio.nombre}!</Text>
          <Text style={styles.subtitulo}>Ficha digital de entrenamiento</Text>
        </View>

        {esDomingo && (
          <View style={styles.tarjetaDescanso}>
            <Ionicons
              name="sunny-outline"
              size={32}
              color={COLORES_APP.advertencia}
              style={styles.iconoDescanso}
            />
            <View style={styles.infoDescanso}>
              <Text style={styles.tituloDescanso}>¡Hoy es domingo!</Text>
              <Text style={styles.textoDescanso}>
                Día de recuperación y descanso muscular. Prepárate para iniciar la
                semana con toda la energía.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.seccionTitulo}>
          <Text style={styles.tituloPlan}>Plan Semanal</Text>
          <Text style={styles.subtituloPlan}>
            Selecciona un día para ver tus ejercicios y registrar tu progreso
          </Text>
        </View>

        {planSemanal.map(plan => {
          const esHoy = plan.dia === diaActualClave;
          const completadosDia = completados[plan.dia]?.length || 0;
          return (
            <TarjetaDia
              key={plan.dia}
              plan={plan}
              esHoy={esHoy}
              completadosCount={completadosDia}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORES_APP.fondo,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  cabecera: {
    marginBottom: 16,
  },
  saludo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORES_APP.texto,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 15,
    color: COLORES_APP.textoSecundario,
  },
  tarjetaDescanso: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 14,
    borderColor: COLORES_APP.advertencia,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconoDescanso: {
    marginRight: 14,
  },
  infoDescanso: {
    flex: 1,
  },
  tituloDescanso: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORES_APP.advertencia,
    marginBottom: 4,
  },
  textoDescanso: {
    fontSize: 14,
    color: COLORES_APP.textoSecundario,
    lineHeight: 20,
  },
  seccionTitulo: {
    marginBottom: 14,
  },
  tituloPlan: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORES_APP.texto,
    marginBottom: 2,
  },
  subtituloPlan: {
    fontSize: 14,
    color: COLORES_APP.textoSecundario,
  },
});
