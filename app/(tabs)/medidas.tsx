import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORES_APP } from '@/constants/colores';

export default function MedidasScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Text style={styles.titulo}>Medidas Corporales</Text>
      <Text style={styles.subtitulo}>Historial y Registro de Medidas</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORES_APP.fondo,
    padding: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORES_APP.texto,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: COLORES_APP.textoSecundario,
  },
});
