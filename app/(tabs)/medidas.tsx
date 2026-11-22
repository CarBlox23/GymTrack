import { useState, useMemo } from 'react';
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
import { TarjetaResumenImc } from '@/components/TarjetaResumenImc';
import { COLORES_APP } from '@/constants/colores';
import type { Medida, PerimetroClave } from '@/types/gym';

const PERIMETROS_DEF: { clave: PerimetroClave; etiqueta: string }[] = [
  { clave: 'hombro', etiqueta: 'Hombro' },
  { clave: 'brazo', etiqueta: 'Brazo' },
  { clave: 'antebrazo', etiqueta: 'Antebrazo' },
  { clave: 'pecho', etiqueta: 'Pecho' },
  { clave: 'abdomen', etiqueta: 'Abdomen' },
  { clave: 'cadera', etiqueta: 'Cadera' },
  { clave: 'pierna', etiqueta: 'Pierna' },
  { clave: 'pantorrilla', etiqueta: 'Pantorrilla' },
];

export default function MedidasScreen() {
  const { medidas, agregarMedida, socio } = useGym();
  const [mostrarForm, setMostrarForm] = useState(false);

  const [mes, setMes] = useState('');
  const [estatura, setEstatura] = useState(socio.medidas[0]?.estaturaM.toString() || '1.75');
  const [peso, setPeso] = useState('');
  const [perimetros, setPerimetros] = useState<Record<PerimetroClave, string>>({
    hombro: '118', brazo: '33', antebrazo: '28', pecho: '108',
    abdomen: '100', cadera: '105', pierna: '58', pantorrilla: '38',
  });
  const [errores, setErrores] = useState<Record<string, string>>({});

  const historialOrdenado = useMemo(
    () => [...medidas].sort((a, b) => b.mes.localeCompare(a.mes)),
    [medidas]
  );

  const medidaActual = historialOrdenado[0];
  const medidaAnterior = historialOrdenado[1];

  const actualizarPerimetro = (clave: PerimetroClave, val: string) => {
    setPerimetros(prev => ({ ...prev, [clave]: val }));
  };

  const guardar = () => {
    const errs: Record<string, string> = {};
    const mesLimpio = mes.trim();
    if (!mesLimpio) errs.mes = 'El mes es obligatorio (ej. 2026-12).';
    else if (medidas.some(m => m.mes === mesLimpio)) errs.mes = 'Ya existe registro para este mes.';

    const numPeso = parseFloat(peso);
    if (isNaN(numPeso) || numPeso < 30 || numPeso > 300) {
      errs.peso = 'El peso debe estar entre 30 y 300 kg.';
    }

    const numEst = parseFloat(estatura);
    if (isNaN(numEst) || numEst < 1.0 || numEst > 2.3) {
      errs.estatura = 'La estatura debe estar entre 1.00 y 2.30 m.';
    }

    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    const perimNumericos: Record<PerimetroClave, number> = {
      hombro: parseFloat(perimetros.hombro) || 0,
      brazo: parseFloat(perimetros.brazo) || 0,
      antebrazo: parseFloat(perimetros.antebrazo) || 0,
      pecho: parseFloat(perimetros.pecho) || 0,
      abdomen: parseFloat(perimetros.abdomen) || 0,
      cadera: parseFloat(perimetros.cadera) || 0,
      pierna: parseFloat(perimetros.pierna) || 0,
      pantorrilla: parseFloat(perimetros.pantorrilla) || 0,
    };

    const nuevaMedida: Medida = {
      mes: mesLimpio,
      estaturaM: numEst,
      pesoKg: numPeso,
      perimetrosCm: perimNumericos,
    };

    agregarMedida(nuevaMedida);
    setMostrarForm(false);
    setMes('');
    setPeso('');
    Alert.alert('Éxito', 'Medidas registradas correctamente.');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.titulo}>Seguimiento Corporal</Text>
          <TarjetaResumenImc medidaActual={medidaActual} medidaAnterior={medidaAnterior} />

          <Pressable
            style={styles.botonToggle}
            onPress={() => setMostrarForm(prev => !prev)}
            accessibilityRole="button">
            <Ionicons name={mostrarForm ? 'chevron-up' : 'add-circle-outline'} size={20} color="#0F172A" />
            <Text style={styles.textoBotonToggle}>
              {mostrarForm ? 'Ocultar Formulario' : 'Registrar Nuevo Mes'}
            </Text>
          </Pressable>

          {mostrarForm && (
            <View style={styles.formulario}>
              <Text style={styles.formTitulo}>Nueva Medición Mensual</Text>
              <CampoFormulario etiqueta="Mes (AAAA-MM) *" value={mes} onChangeText={setMes} placeholder="2026-12" error={errores.mes} />
              <View style={styles.filaDosCampos}>
                <View style={styles.medioCampo}>
                  <CampoFormulario etiqueta="Peso *" value={peso} onChangeText={setPeso} placeholder="Ej. 97.5" keyboardType="numeric" unidad="kg" error={errores.peso} />
                </View>
                <View style={styles.medioCampo}>
                  <CampoFormulario etiqueta="Estatura *" value={estatura} onChangeText={setEstatura} placeholder="Ej. 1.75" keyboardType="numeric" unidad="m" error={errores.estatura} />
                </View>
              </View>
              <Text style={styles.subtituloPerimetros}>Perímetros Corporales (cm)</Text>
              <View style={styles.gridPerimetros}>
                {PERIMETROS_DEF.map(({ clave, etiqueta }) => (
                  <View key={clave} style={styles.itemGridPerimetro}>
                    <CampoFormulario etiqueta={etiqueta} value={perimetros[clave]} onChangeText={v => actualizarPerimetro(clave, v)} keyboardType="numeric" unidad="cm" />
                  </View>
                ))}
              </View>
              <Pressable style={styles.botonGuardar} onPress={guardar} accessibilityRole="button">
                <Text style={styles.textoBotonGuardar}>Guardar Registro</Text>
              </Pressable>
            </View>
          )}

          <Text style={styles.tituloHistorial}>Historial de Registros ({historialOrdenado.length})</Text>
          {historialOrdenado.map(item => (
            <View key={item.mes} style={styles.itemHistorial}>
              <View style={styles.encabezadoHistorial}>
                <Text style={styles.mesHistorial}>{item.mes}</Text>
                <Text style={styles.pesoHistorial}>{item.pesoKg} kg • {item.estaturaM} m</Text>
              </View>
              <View style={styles.tagsPerimetros}>
                {PERIMETROS_DEF.map(({ clave, etiqueta }) => (
                  <Text key={clave} style={styles.tagPerimetro}>
                    {etiqueta}: {item.perimetrosCm[clave]}cm
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORES_APP.fondo },
  flex: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: COLORES_APP.texto, marginBottom: 12 },
  botonToggle: {
    backgroundColor: COLORES_APP.primario, borderRadius: 10, minHeight: 48,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16,
  },
  textoBotonToggle: { color: '#0F172A', fontSize: 16, fontWeight: 'bold' },
  formulario: {
    backgroundColor: COLORES_APP.superficie, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: COLORES_APP.borde, marginBottom: 20,
  },
  formTitulo: { fontSize: 18, fontWeight: 'bold', color: COLORES_APP.texto, marginBottom: 12 },
  filaDosCampos: { flexDirection: 'row', gap: 10 },
  medioCampo: { flex: 1 },
  subtituloPerimetros: { fontSize: 15, fontWeight: '600', color: COLORES_APP.texto, marginTop: 6, marginBottom: 8 },
  gridPerimetros: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  itemGridPerimetro: { width: '48%' },
  botonGuardar: {
    backgroundColor: COLORES_APP.exito, borderRadius: 10, minHeight: 48,
    alignItems: 'center', justifyContent: 'center', marginTop: 12,
  },
  textoBotonGuardar: { color: '#0F172A', fontSize: 16, fontWeight: 'bold' },
  tituloHistorial: { fontSize: 18, fontWeight: 'bold', color: COLORES_APP.texto, marginVertical: 12 },
  itemHistorial: {
    backgroundColor: COLORES_APP.superficie, borderRadius: 12, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: COLORES_APP.borde,
  },
  encabezadoHistorial: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  mesHistorial: { fontSize: 16, fontWeight: 'bold', color: COLORES_APP.texto },
  pesoHistorial: { fontSize: 14, color: COLORES_APP.primario, fontWeight: '600' },
  tagsPerimetros: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagPerimetro: {
    backgroundColor: COLORES_APP.superficieClara, color: COLORES_APP.textoSecundario,
    fontSize: 12, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
});
