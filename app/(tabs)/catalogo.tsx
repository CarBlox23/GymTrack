import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { COLORES_APP } from '@/constants/colores';

export default function CatalogoScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Text style={styles.titulo}>Catálogo de Ejercicios</Text>
      <Link href="/grupo/pecho" style={styles.enlace}>
        <Text style={styles.enlaceTexto}>Ver Pecho (Prueba)</Text>
      </Link>
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
    marginBottom: 16,
  },
  enlace: {
    padding: 12,
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 8,
    alignItems: 'center',
  },
  enlaceTexto: {
    color: COLORES_APP.primario,
    fontSize: 16,
  },
});
