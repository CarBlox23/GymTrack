import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ejercicios } from '@/data/ejercicios';
import { planSemanal } from '@/data/plan';
import { useGym } from '@/context/GymContext';
import { AlertaLesion } from '@/components/AlertaLesion';
import { COLORES_APP } from '@/constants/colores';

export default function EjercicioDetalleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { socio } = useGym();

  const ejercicio = useMemo(() => ejercicios.find(e => e.id === id), [id]);

  const diasAsignados = useMemo(() => {
    if (!id) return [];
    return planSemanal.filter(p => p.ejercicios.includes(id));
  }, [id]);

  if (!ejercicio) {
    return (
      <SafeAreaView style={styles.contenedorError} edges={['bottom']}>
        <Ionicons name="alert-circle-outline" size={56} color={COLORES_APP.peligro} />
        <Text style={styles.tituloError}>Ejercicio no encontrado</Text>
        <Text style={styles.textoError}>El ejercicio no existe en el catálogo.</Text>
        <Pressable
          style={styles.botonVolver}
          onPress={() => router.replace('/catalogo')}>
          <Text style={styles.textoBotonVolver}>Volver al Catálogo</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const tieneLesion = socio.lesiones.includes(ejercicio.grupo);
  const nombreGrupo = ejercicio.grupo.charAt(0).toUpperCase() + ejercicio.grupo.slice(1);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Stack.Screen options={{ title: ejercicio.nombre }} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {ejercicio.imagen ? (
          <View style={styles.tarjetaImagenContenedor}>
            <Image source={ejercicio.imagen} style={styles.imagenEjercicio} resizeMode="cover" />
            <View style={styles.idBadgeFlotante}>
              <Text style={styles.idBadgeTexto}>ID: {ejercicio.id}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.tarjetaImagenPlaceholder}>
            <Ionicons name="barbell-outline" size={60} color={COLORES_APP.primario} />
            <Text style={styles.textoPlaceholder}>Ilustración Técnica</Text>
            <Text style={styles.idBadge}>ID: {ejercicio.id}</Text>
          </View>
        )}

        <View style={styles.tarjetaInfo}>
          <Text style={styles.nombreEjercicio}>{ejercicio.nombre}</Text>
          <View style={styles.badgeGrupo}>
            <Text style={styles.textoGrupo}>{nombreGrupo}</Text>
          </View>

          <View style={styles.filaMetricas}>
            <View style={styles.cajaMetrica}>
              <Text style={styles.valorMetrica}>{ejercicio.series}</Text>
              <Text style={styles.etiquetaMetrica}>Series</Text>
            </View>
            <View style={styles.separadorMetrica} />
            <View style={styles.cajaMetrica}>
              <Text style={styles.valorMetrica}>{ejercicio.repeticiones}</Text>
              <Text style={styles.etiquetaMetrica}>Repeticiones</Text>
            </View>
            <View style={styles.separadorMetrica} />
            <View style={styles.cajaMetrica}>
              <Text style={styles.valorMetrica}>4 × 12</Text>
              <Text style={styles.etiquetaMetrica}>Esquema</Text>
            </View>
          </View>
        </View>

        {tieneLesion && <AlertaLesion grupo={ejercicio.grupo} />}

        <View style={styles.seccionDias}>
          <Text style={styles.tituloDias}>Días asignados en tu plan semanal</Text>
          {diasAsignados.length === 0 ? (
            <View style={styles.sinDias}>
              <Ionicons name="information-circle-outline" size={20} color={COLORES_APP.textoSecundario} />
              <Text style={styles.sinDiasTexto}>
                No está asignado en tu plan actual.
              </Text>
            </View>
          ) : (
            diasAsignados.map(plan => (
              <Pressable
                key={plan.dia}
                style={[styles.tarjetaDiaAsignado, { borderLeftColor: plan.color }]}
                onPress={() => router.push(`/dia/${plan.dia}`)}>
                <View style={styles.infoDiaAsignado}>
                  <Text style={styles.nombreDiaAsignado}>
                    {plan.dia.charAt(0).toUpperCase() + plan.dia.slice(1)}
                  </Text>
                  <Text style={[styles.enfoqueDiaAsignado, { color: plan.color }]}>
                    {plan.enfoque}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORES_APP.textoSecundario} />
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORES_APP.fondo },
  scrollContent: { padding: 16, paddingBottom: 24 },
  tarjetaImagenContenedor: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 16,
    height: 190,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    marginBottom: 14,
    position: 'relative',
  },
  imagenEjercicio: {
    width: '100%',
    height: '100%',
  },
  idBadgeFlotante: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
  },
  idBadgeTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORES_APP.primario,
  },
  tarjetaImagenPlaceholder: {
    backgroundColor: COLORES_APP.superficie, borderRadius: 16, height: 160,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORES_APP.borde, marginBottom: 14,
  },
  textoPlaceholder: { fontSize: 14, color: COLORES_APP.textoSecundario, marginTop: 6 },
  idBadge: {
    marginTop: 4, fontSize: 12, color: COLORES_APP.primario,
    backgroundColor: COLORES_APP.superficieClara, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
  },
  tarjetaInfo: { backgroundColor: COLORES_APP.superficie, borderRadius: 14, padding: 16, marginBottom: 12 },
  nombreEjercicio: { fontSize: 20, fontWeight: 'bold', color: COLORES_APP.texto, marginBottom: 6 },
  badgeGrupo: { backgroundColor: COLORES_APP.superficieClara, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 12 },
  textoGrupo: { color: COLORES_APP.primario, fontWeight: '600', fontSize: 13 },
  filaMetricas: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: COLORES_APP.borde, paddingTop: 12 },
  cajaMetrica: { alignItems: 'center' },
  valorMetrica: { fontSize: 20, fontWeight: 'bold', color: COLORES_APP.texto },
  etiquetaMetrica: { fontSize: 12, color: COLORES_APP.textoSecundario, marginTop: 2 },
  separadorMetrica: { width: 1, height: 28, backgroundColor: COLORES_APP.borde },
  seccionDias: { marginTop: 4 },
  tituloDias: { fontSize: 16, fontWeight: 'bold', color: COLORES_APP.texto, marginBottom: 8 },
  sinDias: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORES_APP.superficie, padding: 12, borderRadius: 10 },
  sinDiasTexto: { fontSize: 14, color: COLORES_APP.textoSecundario, flex: 1 },
  tarjetaDiaAsignado: {
    backgroundColor: COLORES_APP.superficie, borderRadius: 10, padding: 12, marginBottom: 8,
    borderLeftWidth: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48,
  },
  infoDiaAsignado: { flex: 1 },
  nombreDiaAsignado: { fontSize: 15, fontWeight: 'bold', color: COLORES_APP.texto },
  enfoqueDiaAsignado: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  contenedorError: { flex: 1, backgroundColor: COLORES_APP.fondo, alignItems: 'center', justifyContent: 'center', padding: 24 },
  tituloError: { fontSize: 22, fontWeight: 'bold', color: COLORES_APP.texto, marginTop: 12 },
  textoError: { fontSize: 15, color: COLORES_APP.textoSecundario, textAlign: 'center', marginVertical: 10 },
  botonVolver: { marginTop: 16, backgroundColor: COLORES_APP.primario, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, minHeight: 44, justifyContent: 'center' },
  textoBotonVolver: { color: '#0F172A', fontWeight: 'bold', fontSize: 15 },
});
