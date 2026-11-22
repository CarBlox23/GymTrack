import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ejercicios } from '@/data/ejercicios';
import { useGym } from '@/context/GymContext';
import { AlertaLesion } from '@/components/AlertaLesion';
import { COLORES_APP } from '@/constants/colores';
import type { GrupoMuscular } from '@/types/gym';

const GRUPOS_VALIDOS: GrupoMuscular[] = [
  'pierna', 'pecho', 'triceps', 'espalda', 'hombro', 'biceps',
  'abdomen', 'cadera', 'gluteo', 'lumbar', 'antebrazo',
];

export default function GrupoMuscularScreen() {
  const router = useRouter();
  const { grupo } = useLocalSearchParams<{ grupo: GrupoMuscular }>();
  const { socio } = useGym();

  const esValido = grupo && GRUPOS_VALIDOS.includes(grupo);
  const items = useMemo(
    () => (esValido ? ejercicios.filter(e => e.grupo === grupo) : []),
    [grupo, esValido]
  );

  if (!esValido) {
    return (
      <SafeAreaView style={styles.contenedorError} edges={['bottom']}>
        <Ionicons name="alert-circle-outline" size={56} color={COLORES_APP.peligro} />
        <Text style={styles.tituloError}>Grupo no encontrado</Text>
        <Text style={styles.textoError}>
          El grupo muscular seleccionado no existe en el catálogo.
        </Text>
        <Pressable
          style={styles.botonVolver}
          onPress={() => router.replace('/catalogo')}>
          <Text style={styles.textoBotonVolver}>Volver al Catálogo</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const nombreGrupo = grupo.charAt(0).toUpperCase() + grupo.slice(1);
  const tieneLesion = socio.lesiones.includes(grupo);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Stack.Screen options={{ title: `Grupo: ${nombreGrupo}` }} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cabecera}>
          <Text style={styles.titulo}>{nombreGrupo}</Text>
          <Text style={styles.subtitulo}>{items.length} ejercicios disponibles</Text>
        </View>

        {tieneLesion && <AlertaLesion grupo={grupo} />}

        <View style={styles.lista}>
          {items.map(item => (
            <Pressable
              key={item.id}
              style={styles.tarjetaEjercicio}
              onPress={() =>
                router.push({
                  pathname: '/ejercicio/[id]',
                  params: { id: item.id },
                })
              }
              accessibilityRole="button"
              accessibilityLabel={`Ver detalle de ${item.nombre}`}>
              <View style={styles.infoEjercicio}>
                <Text style={styles.nombreEjercicio}>{item.nombre}</Text>
                <Text style={styles.metaEjercicio}>
                  Esquema: {item.series} series × {item.repeticiones} reps
                </Text>
              </View>
              <View style={styles.botonAccion}>
                <Ionicons name="chevron-forward" size={20} color={COLORES_APP.textoSecundario} />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORES_APP.fondo },
  scrollContent: { padding: 16, paddingBottom: 24 },
  cabecera: { marginBottom: 12 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: COLORES_APP.texto, marginBottom: 2 },
  subtitulo: { fontSize: 14, color: COLORES_APP.textoSecundario },
  lista: { gap: 10, marginTop: 4 },
  tarjetaEjercicio: {
    backgroundColor: COLORES_APP.superficie, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: COLORES_APP.borde, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between', minHeight: 54,
  },
  infoEjercicio: { flex: 1 },
  nombreEjercicio: { fontSize: 16, fontWeight: '600', color: COLORES_APP.texto, marginBottom: 2 },
  metaEjercicio: { fontSize: 13, color: COLORES_APP.textoSecundario },
  botonAccion: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  contenedorError: { flex: 1, backgroundColor: COLORES_APP.fondo, alignItems: 'center', justifyContent: 'center', padding: 24 },
  tituloError: { fontSize: 22, fontWeight: 'bold', color: COLORES_APP.texto, marginTop: 12 },
  textoError: { fontSize: 15, color: COLORES_APP.textoSecundario, textAlign: 'center', marginVertical: 10 },
  botonVolver: { marginTop: 16, backgroundColor: COLORES_APP.primario, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, minHeight: 44, justifyContent: 'center' },
  textoBotonVolver: { color: '#0F172A', fontWeight: 'bold', fontSize: 15 },
});
