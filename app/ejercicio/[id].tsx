import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ejercicios } from '@/data/ejercicios';
import { planSemanal } from '@/data/plan';
import { useGym } from '@/context/GymContext';
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
        <Text style={styles.textoError}>
          El código de ejercicio no existe en el catálogo digital.
        </Text>
        <Pressable
          style={styles.botonVolver}
          onPress={() => router.replace('/catalogo')}
          accessibilityRole="button">
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.tarjetaImagenPlaceholder}>
          <Ionicons name="barbell-outline" size={64} color={COLORES_APP.primario} />
          <Text style={styles.textoPlaceholder}>Ilustración Técnica</Text>
          <Text style={styles.idBadge}>ID: {ejercicio.id}</Text>
        </View>

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

        {tieneLesion && (
          <View style={styles.alertaLesion}>
            <Ionicons name="warning" size={24} color={COLORES_APP.advertencia} />
            <View style={styles.alertaContenido}>
              <Text style={styles.alertaTitulo}>Advertencia de Salud</Text>
              <Text style={styles.alertaTexto}>
                Tienes registrada una lesión que afecta al grupo muscular "{nombreGrupo}".
                Realiza el movimiento con peso moderado y deténte si sientes molestia.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.seccionDias}>
          <Text style={styles.tituloDias}>Días asignados en tu plan semanal</Text>
          {diasAsignados.length === 0 ? (
            <View style={styles.sinDias}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={COLORES_APP.textoSecundario}
              />
              <Text style={styles.sinDiasTexto}>
                Este ejercicio no está asignado a ningún día de tu plan actual.
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
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={COLORES_APP.textoSecundario}
                />
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
  tarjetaImagenPlaceholder: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 16,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    marginBottom: 16,
  },
  textoPlaceholder: { fontSize: 14, color: COLORES_APP.textoSecundario, marginTop: 8 },
  idBadge: {
    marginTop: 6,
    fontSize: 12,
    color: COLORES_APP.primario,
    backgroundColor: COLORES_APP.superficieClara,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontFamily: 'monospace',
  },
  tarjetaInfo: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
  },
  nombreEjercicio: { fontSize: 22, fontWeight: 'bold', color: COLORES_APP.texto, marginBottom: 8 },
  badgeGrupo: {
    backgroundColor: COLORES_APP.superficieClara,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 16,
  },
  textoGrupo: { color: COLORES_APP.primario, fontWeight: '600', fontSize: 14 },
  filaMetricas: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORES_APP.borde,
    paddingTop: 14,
  },
  cajaMetrica: { alignItems: 'center' },
  valorMetrica: { fontSize: 20, fontWeight: 'bold', color: COLORES_APP.texto },
  etiquetaMetrica: { fontSize: 13, color: COLORES_APP.textoSecundario, marginTop: 2 },
  separadorMetrica: { width: 1, height: 32, backgroundColor: COLORES_APP.borde },
  alertaLesion: {
    backgroundColor: COLORES_APP.advertenciaFondo,
    borderColor: COLORES_APP.advertenciaBorde,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    flexDirection: 'row',
    gap: 12,
  },
  alertaContenido: { flex: 1 },
  alertaTitulo: { fontSize: 15, fontWeight: 'bold', color: COLORES_APP.advertencia, marginBottom: 2 },
  alertaTexto: { fontSize: 13, color: COLORES_APP.texto, lineHeight: 18 },
  seccionDias: { marginTop: 6 },
  tituloDias: { fontSize: 16, fontWeight: 'bold', color: COLORES_APP.texto, marginBottom: 10 },
  sinDias: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORES_APP.superficie,
    padding: 14,
    borderRadius: 10,
  },
  sinDiasTexto: { fontSize: 14, color: COLORES_APP.textoSecundario, flex: 1 },
  tarjetaDiaAsignado: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
  },
  infoDiaAsignado: { flex: 1 },
  nombreDiaAsignado: { fontSize: 16, fontWeight: 'bold', color: COLORES_APP.texto },
  enfoqueDiaAsignado: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  contenedorError: {
    flex: 1,
    backgroundColor: COLORES_APP.fondo,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  tituloError: { fontSize: 22, fontWeight: 'bold', color: COLORES_APP.texto, marginTop: 12 },
  textoError: { fontSize: 15, color: COLORES_APP.textoSecundario, textAlign: 'center', marginVertical: 10 },
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
