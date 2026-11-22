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
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.encabezado}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={36} color={COLORES_APP.primario} />
            </View>
            <View style={styles.infoEncabezado}>
              <Text style={styles.nombre}>{socio.nombre}</Text>
              <Text style={styles.meta}>Asignado: {socio.fechaAsignacion}</Text>
            </View>
          </View>

          <View style={styles.tarjeta}>
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
              accessibilityRole="button">
              <Text style={styles.textoBoton}>Guardar Cambios</Text>
            </Pressable>
          </View>

          <View style={styles.tarjeta}>
            <View style={styles.filaTitulo}>
              <Ionicons name="medical" size={18} color={COLORES_APP.advertencia} />
              <Text style={styles.tituloMedica}>Observaciones Médicas y Lesiones</Text>
            </View>
            {socio.observaciones.map((obs, idx) => (
              <View key={idx} style={styles.itemObs}>
                <Ionicons name="alert-circle-outline" size={16} color={COLORES_APP.advertencia} />
                <Text style={styles.textoObs}>{obs}</Text>
              </View>
            ))}
            <View style={styles.seccionLesiones}>
              <Text style={styles.subtituloLesion}>Grupos con Advertencia (RF09):</Text>
              <View style={styles.badges}>
                {socio.lesiones.map(lesion => (
                  <View key={lesion} style={styles.badge}>
                    <Text style={styles.textoBadge}>{lesion.toUpperCase()}</Text>
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
  flex: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  encabezado: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORES_APP.superficie,
    borderRadius: 14, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: COLORES_APP.borde,
  },
  avatar: {
    width: 54, height: 54, borderRadius: 27, backgroundColor: COLORES_APP.superficieClara,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  infoEncabezado: { flex: 1 },
  nombre: { fontSize: 18, fontWeight: 'bold', color: COLORES_APP.texto },
  meta: { fontSize: 13, color: COLORES_APP.textoSecundario, marginTop: 2 },
  tarjeta: {
    backgroundColor: COLORES_APP.superficie, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: COLORES_APP.borde, marginBottom: 14,
  },
  tituloSeccion: { fontSize: 17, fontWeight: 'bold', color: COLORES_APP.texto, marginBottom: 12 },
  botonGuardar: {
    backgroundColor: COLORES_APP.primario, borderRadius: 10, minHeight: 46,
    alignItems: 'center', justifyContent: 'center', marginTop: 6,
  },
  textoBoton: { color: '#0F172A', fontSize: 16, fontWeight: 'bold' },
  filaTitulo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  tituloMedica: { fontSize: 15, fontWeight: 'bold', color: COLORES_APP.texto },
  itemObs: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 6 },
  textoObs: { fontSize: 14, color: COLORES_APP.texto, flex: 1, lineHeight: 18 },
  seccionLesiones: { marginTop: 8, borderTopWidth: 1, borderTopColor: COLORES_APP.borde, paddingTop: 8 },
  subtituloLesion: { fontSize: 13, color: COLORES_APP.textoSecundario, marginBottom: 4 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badge: { backgroundColor: COLORES_APP.advertenciaFondo, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  textoBadge: { color: COLORES_APP.advertencia, fontSize: 12, fontWeight: 'bold' },
});
