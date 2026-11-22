import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGym } from '@/context/GymContext';
import { CampoFormulario } from '@/components/CampoFormulario';
import { COLORES_APP } from '@/constants/colores';

export default function PerfilScreen() {
  const { socio, setSocio } = useGym();

  const [nombre, setNombre] = useState(socio.nombre);
  const [edadTexto, setEdadTexto] = useState(socio.edad.toString());
  const [objetivo, setObjetivo] = useState(socio.objetivo);
  const [errores, setErrores] = useState<{ nombre?: string; edad?: string }>({});

  const validarYGuardar = () => {
    const nuevosErrores: { nombre?: string; edad?: string } = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = 'El nombre no puede estar vacío.';
    }

    const edadLimpia = edadTexto.trim();
    if (!edadLimpia) {
      nuevosErrores.edad = 'La edad es obligatoria.';
    } else {
      const edadNum = Number(edadLimpia);
      if (isNaN(edadNum) || !Number.isInteger(edadNum) || edadNum < 14 || edadNum > 90) {
        nuevosErrores.edad = 'La edad debe ser un número entero entre 14 y 90 años.';
      }
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    setSocio({
      ...socio,
      nombre: nombre.trim(),
      edad: parseInt(edadTexto.trim(), 10),
      objetivo: objetivo.trim(),
    });

    Alert.alert('Perfil Guardado', 'Los datos del socio han sido actualizados con éxito.');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.encabezado}>
            <View style={styles.avatarContenedor}>
              <Ionicons name="person" size={40} color={COLORES_APP.primario} />
            </View>
            <View style={styles.infoEncabezado}>
              <Text style={styles.nombreEncabezado}>{socio.nombre}</Text>
              <Text style={styles.metaEncabezado}>
                Asignado el: {socio.fechaAsignacion}
              </Text>
            </View>
          </View>

          <View style={styles.tarjetaFormulario}>
            <Text style={styles.tituloSeccion}>Datos Personales</Text>

            <CampoFormulario
              etiqueta="Nombre Completo *"
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej. Andrés Gómez"
              error={errores.nombre}
            />

            <CampoFormulario
              etiqueta="Edad *"
              value={edadTexto}
              onChangeText={setEdadTexto}
              placeholder="14 - 90"
              keyboardType="numeric"
              unidad="años"
              error={errores.edad}
            />

            <CampoFormulario
              etiqueta="Objetivo de Entrenamiento"
              value={objetivo}
              onChangeText={setObjetivo}
              placeholder="Ej. Bajar de peso, Hipertrofia..."
            />

            <Pressable
              style={styles.botonGuardar}
              onPress={validarYGuardar}
              accessibilityRole="button"
              accessibilityLabel="Guardar cambios del perfil">
              <Text style={styles.textoBotonGuardar}>Guardar Cambios</Text>
            </Pressable>
          </View>

          <View style={styles.tarjetaMedica}>
            <View style={styles.filaTituloMedica}>
              <Ionicons name="medical" size={20} color={COLORES_APP.advertencia} />
              <Text style={styles.tituloMedica}>Observaciones Médicas y Lesiones</Text>
            </View>

            {socio.observaciones.map((obs, idx) => (
              <View key={idx} style={styles.itemObservacion}>
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color={COLORES_APP.advertencia}
                />
                <Text style={styles.textoObservacion}>{obs}</Text>
              </View>
            ))}

            <View style={styles.seccionGruposLesion}>
              <Text style={styles.subtituloLesiones}>Grupos con Advertencia (RF09):</Text>
              <View style={styles.badgesLesiones}>
                {socio.lesiones.map(lesion => (
                  <View key={lesion} style={styles.badgeLesion}>
                    <Text style={styles.textoBadgeLesion}>
                      {lesion.toUpperCase()}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORES_APP.fondo },
  keyboardView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
  },
  avatarContenedor: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORES_APP.superficieClara,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  infoEncabezado: { flex: 1 },
  nombreEncabezado: { fontSize: 20, fontWeight: 'bold', color: COLORES_APP.texto },
  metaEncabezado: { fontSize: 13, color: COLORES_APP.textoSecundario, marginTop: 2 },
  tarjetaFormulario: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    marginBottom: 16,
  },
  tituloSeccion: { fontSize: 18, fontWeight: 'bold', color: COLORES_APP.texto, marginBottom: 14 },
  botonGuardar: {
    backgroundColor: COLORES_APP.primario,
    borderRadius: 10,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  textoBotonGuardar: { color: '#0F172A', fontSize: 16, fontWeight: 'bold' },
  tarjetaMedica: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
  },
  filaTituloMedica: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  tituloMedica: { fontSize: 16, fontWeight: 'bold', color: COLORES_APP.texto },
  itemObservacion: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  textoObservacion: { fontSize: 14, color: COLORES_APP.texto, flex: 1, lineHeight: 20 },
  seccionGruposLesion: { marginTop: 10, borderTopWidth: 1, borderTopColor: COLORES_APP.borde, paddingTop: 10 },
  subtituloLesiones: { fontSize: 13, color: COLORES_APP.textoSecundario, marginBottom: 6 },
  badgesLesiones: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badgeLesion: {
    backgroundColor: COLORES_APP.advertenciaFondo,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  textoBadgeLesion: { color: COLORES_APP.advertencia, fontSize: 12, fontWeight: 'bold' },
});
