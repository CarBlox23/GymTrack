import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { planSemanal } from '@/data/plan';
import { ejercicios } from '@/data/ejercicios';
import { useGym } from '@/context/GymContext';
import { BarraProgreso } from '@/components/BarraProgreso';
import { ItemEjercicio } from '@/components/ItemEjercicio';
import { TemporizadorDescanso } from '@/components/TemporizadorDescanso';
import { COLORES_APP } from '@/constants/colores';
import type { DiaSemana, Ejercicio, GrupoMuscular } from '@/types/gym';

const DIAS_VALIDOS: DiaSemana[] = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
];

export default function DetalleDiaScreen() {
  const router = useRouter();
  const { dia } = useLocalSearchParams<{ dia: DiaSemana }>();
  const { completados, alternarEjercicio, socio } = useGym();

  const esDiaValido = dia && DIAS_VALIDOS.includes(dia);
  const plan = useMemo(
    () => (esDiaValido ? planSemanal.find(p => p.dia === dia) : undefined),
    [dia, esDiaValido]
  );

  const listaEjercicios = useMemo(() => {
    if (!plan) return [];
    return plan.ejercicios
      .map(id => ejercicios.find(e => e.id === id))
      .filter((e): e is Ejercicio => e !== undefined);
  }, [plan]);

  const ejerciciosPorGrupo = useMemo(() => {
    const grupos: Record<string, Ejercicio[]> = {};
    listaEjercicios.forEach(e => {
      if (!grupos[e.grupo]) grupos[e.grupo] = [];
      grupos[e.grupo].push(e);
    });
    return Object.entries(grupos) as [GrupoMuscular, Ejercicio[]][];
  }, [listaEjercicios]);

  if (!esDiaValido || !plan) {
    return (
      <SafeAreaView style={styles.contenedorError} edges={['bottom']}>
        <Ionicons name="alert-circle-outline" size={56} color={COLORES_APP.peligro} />
        <Text style={styles.tituloError}>Día no encontrado</Text>
        <Text style={styles.textoError}>
          El día seleccionado no es válido dentro del plan de entrenamiento.
        </Text>
        <Pressable
          style={styles.botonVolver}
          onPress={() => router.replace('/')}
          accessibilityRole="button">
          <Text style={styles.textoBotonVolver}>Volver al Inicio</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const nombreDia = plan.dia.charAt(0).toUpperCase() + plan.dia.slice(1);
  const completadosDia = completados[plan.dia] || [];

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Stack.Screen options={{ title: `${nombreDia} • ${plan.enfoque}` }} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.tarjetaEncabezado}>
          <Text style={styles.subtituloEnfoque}>Enfoque del día</Text>
          <Text style={[styles.enfoquePrincipal, { color: plan.color }]}>
            {plan.enfoque}
          </Text>
          <BarraProgreso
            valor={completadosDia.length}
            total={listaEjercicios.length}
            color={plan.color}
          />
        </View>

        <TemporizadorDescanso />

        <View style={styles.tarjetaCalentamiento}>
          <View style={styles.filaCalentamiento}>
            <Ionicons name="flame-outline" size={20} color={COLORES_APP.advertencia} />
            <Text style={styles.tituloCalentamiento}>
              Calentamiento inicial (5 min)
            </Text>
          </View>
          <Text style={styles.textoCalentamiento}>
            Trote suave, bicicleta estática o elíptica a ritmo moderado.
          </Text>
        </View>

        {plan.cardioMin && (
          <View style={styles.tarjetaCardio}>
            <Ionicons name="heart-outline" size={20} color="#F43F5E" />
            <Text style={styles.textoCardio}>
              Cardio específico: {plan.cardioMin} minutos
            </Text>
          </View>
        )}

        <Text style={styles.seccionEjerciciosTitulo}>Ejercicios Asignados</Text>

        {ejerciciosPorGrupo.map(([grupo, items]) => (
          <View key={grupo} style={styles.bloqueGrupo}>
            <Text style={styles.tituloGrupo}>
              {grupo.toUpperCase()} ({items.length})
            </Text>
            {items.map(item => {
              const completado = completadosDia.includes(item.id);
              const tieneAdvertencia = socio.lesiones.includes(item.grupo);
              return (
                <ItemEjercicio
                  key={item.id}
                  ejercicio={item}
                  completado={completado}
                  tieneAdvertencia={tieneAdvertencia}
                  onAlternar={() => alternarEjercicio(plan.dia, item.id)}
                  onVerDetalle={() =>
                    router.push({
                      pathname: '/ejercicio/[id]',
                      params: { id: item.id },
                    })
                  }
                />
              );
            })}
          </View>
        ))}

        <View style={styles.tarjetaCalentamiento}>
          <View style={styles.filaCalentamiento}>
            <Ionicons name="snow-outline" size={20} color={COLORES_APP.primario} />
            <Text style={styles.tituloCalentamiento}>
              Vuelta a la calma / Final (10 min)
            </Text>
          </View>
          <Text style={styles.textoCalentamiento}>
            Trote muy suave, caminata en cinta o estiramientos de recuperación.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORES_APP.fondo },
  scrollContent: { padding: 16, paddingBottom: 32 },
  tarjetaEncabezado: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
  },
  subtituloEnfoque: { fontSize: 14, color: COLORES_APP.textoSecundario },
  enfoquePrincipal: { fontSize: 22, fontWeight: 'bold', marginVertical: 4 },
  tarjetaCalentamiento: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORES_APP.primario,
  },
  filaCalentamiento: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  tituloCalentamiento: { fontSize: 16, fontWeight: 'bold', color: COLORES_APP.texto },
  textoCalentamiento: { fontSize: 14, color: COLORES_APP.textoSecundario, lineHeight: 20 },
  tarjetaCardio: {
    backgroundColor: '#3F121E',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textoCardio: { fontSize: 15, fontWeight: '600', color: '#FDA4AF' },
  seccionEjerciciosTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORES_APP.texto,
    marginTop: 14,
    marginBottom: 8,
  },
  bloqueGrupo: { marginBottom: 12 },
  tituloGrupo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORES_APP.textoSecundario,
    marginBottom: 6,
    letterSpacing: 1,
  },
  contenedorError: {
    flex: 1,
    backgroundColor: COLORES_APP.fondo,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  tituloError: { fontSize: 22, fontWeight: 'bold', color: COLORES_APP.texto, marginTop: 12 },
  textoError: {
    fontSize: 15,
    color: COLORES_APP.textoSecundario,
    textAlign: 'center',
    marginVertical: 10,
  },
  botonVolver: {
    marginTop: 16,
    backgroundColor: COLORES_APP.primario,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  textoBotonVolver: { color: '#0F172A', fontWeight: 'bold', fontSize: 15 },
});
