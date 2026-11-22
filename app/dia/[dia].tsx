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
import { TarjetaCalentamiento } from '@/components/TarjetaCalentamiento';
import { COLORES_APP } from '@/constants/colores';
import type { DiaSemana, Ejercicio, GrupoMuscular } from '@/types/gym';

const DIAS_VALIDOS: DiaSemana[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

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
      <SafeAreaView style={styles.errorContainer} edges={['bottom']}>
        <Ionicons name="alert-circle-outline" size={56} color={COLORES_APP.peligro} />
        <Text style={styles.errorTitulo}>Día no encontrado</Text>
        <Text style={styles.errorTexto}>El día no es válido en el plan semanal.</Text>
        <Pressable style={styles.btnVolver} onPress={() => router.replace('/')}>
          <Text style={styles.btnVolverTexto}>Volver al Inicio</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const nombreDia = plan.dia.charAt(0).toUpperCase() + plan.dia.slice(1);
  const completadosDia = completados[plan.dia] || [];

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Stack.Screen options={{ title: `${nombreDia} • ${plan.enfoque}` }} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.tarjetaEncabezado}>
          <Text style={styles.subtituloEnfoque}>Enfoque del día</Text>
          <Text style={[styles.enfoquePrincipal, { color: plan.color }]}>{plan.enfoque}</Text>
          <BarraProgreso valor={completadosDia.length} total={listaEjercicios.length} color={plan.color} />
        </View>

        <TemporizadorDescanso />

        <TarjetaCalentamiento
          tipo="inicio"
          titulo="Calentamiento inicial"
          duracion="5 min"
          descripcion="Trote suave, bicicleta estática o elíptica a ritmo moderado."
        />

        {plan.cardioMin && (
          <TarjetaCalentamiento
            tipo="cardio"
            titulo="Cardio específico"
            duracion={`${plan.cardioMin} min`}
            descripcion="Intervalos en cinta o elíptica según resistencia recomendada."
          />
        )}

        <Text style={styles.seccionTitulo}>Ejercicios Asignados (4 × 12)</Text>

        {ejerciciosPorGrupo.map(([grupo, items]) => (
          <View key={grupo} style={styles.bloqueGrupo}>
            <Text style={styles.tituloGrupo}>{grupo.toUpperCase()} ({items.length})</Text>
            {items.map(item => (
              <ItemEjercicio
                key={item.id}
                ejercicio={item}
                completado={completadosDia.includes(item.id)}
                tieneAdvertencia={socio.lesiones.includes(item.grupo)}
                onAlternar={() => alternarEjercicio(plan.dia, item.id)}
                onVerDetalle={() =>
                  router.push({ pathname: '/ejercicio/[id]', params: { id: item.id } })
                }
              />
            ))}
          </View>
        ))}

        <TarjetaCalentamiento
          tipo="fin"
          titulo="Vuelta a la calma / Final"
          duracion="10 min"
          descripcion="Trote muy suave, caminata en cinta o estiramientos de recuperación."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORES_APP.fondo },
  scroll: { padding: 16, paddingBottom: 32 },
  tarjetaEncabezado: { backgroundColor: COLORES_APP.superficie, borderRadius: 14, padding: 16, marginBottom: 4 },
  subtituloEnfoque: { fontSize: 14, color: COLORES_APP.textoSecundario },
  enfoquePrincipal: { fontSize: 22, fontWeight: 'bold', marginVertical: 4 },
  seccionTitulo: { fontSize: 18, fontWeight: 'bold', color: COLORES_APP.texto, marginTop: 12, marginBottom: 8 },
  bloqueGrupo: { marginBottom: 10 },
  tituloGrupo: { fontSize: 13, fontWeight: 'bold', color: COLORES_APP.textoSecundario, marginBottom: 6, letterSpacing: 1 },
  errorContainer: { flex: 1, backgroundColor: COLORES_APP.fondo, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorTitulo: { fontSize: 22, fontWeight: 'bold', color: COLORES_APP.texto, marginTop: 12 },
  errorTexto: { fontSize: 15, color: COLORES_APP.textoSecundario, textAlign: 'center', marginVertical: 10 },
  btnVolver: { marginTop: 16, backgroundColor: COLORES_APP.primario, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, minHeight: 44, justifyContent: 'center' },
  btnVolverTexto: { color: '#0F172A', fontWeight: 'bold', fontSize: 15 },
});
