import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORES_APP } from '@/constants/colores';

export function TemporizadorDescanso() {
  const [segundos, setSegundos] = useState<number>(60);
  const [activo, setActivo] = useState<boolean>(false);

  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval> | null = null;

    if (activo && segundos > 0) {
      intervalo = setInterval(() => {
        setSegundos(prev => {
          if (prev <= 1) {
            setActivo(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [activo, segundos]);

  const iniciar = () => {
    if (segundos === 0) setSegundos(60);
    setActivo(true);
  };

  const pausar = () => setActivo(false);

  const reiniciar = () => {
    setActivo(false);
    setSegundos(60);
  };

  const minutos = Math.floor(segundos / 60);
  const segRestantes = segundos % 60;
  const tiempoFormateado = `${minutos.toString().padStart(2, '0')}:${segRestantes.toString().padStart(2, '0')}`;

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <Ionicons name="timer-outline" size={20} color={COLORES_APP.primario} />
        <Text style={styles.titulo}>Temporizador de Descanso (60s)</Text>
      </View>

      <View style={styles.filaControl}>
        <Text style={[styles.contador, segundos === 0 && styles.contadorFin]}>
          {tiempoFormateado}
        </Text>

        <View style={styles.botones}>
          {!activo ? (
            <Pressable
              style={[styles.boton, styles.botonIniciar]}
              onPress={iniciar}
              accessibilityRole="button"
              accessibilityLabel="Iniciar temporizador">
              <Ionicons name="play" size={18} color="#0F172A" />
              <Text style={styles.textoBotonIniciar}>
                {segundos === 0 ? 'Repetir' : 'Iniciar'}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.boton, styles.botonPausar]}
              onPress={pausar}
              accessibilityRole="button"
              accessibilityLabel="Pausar temporizador">
              <Ionicons name="pause" size={18} color={COLORES_APP.texto} />
              <Text style={styles.textoBoton}>Pausar</Text>
            </Pressable>
          )}

          <Pressable
            style={[styles.boton, styles.botonReiniciar]}
            onPress={reiniciar}
            accessibilityRole="button"
            accessibilityLabel="Reiniciar temporizador a 60 segundos">
            <Ionicons name="refresh" size={18} color={COLORES_APP.texto} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 12,
    padding: 14,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORES_APP.texto,
  },
  filaControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contador: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORES_APP.primario,
    fontVariant: ['tabular-nums'],
  },
  contadorFin: {
    color: COLORES_APP.exito,
  },
  botones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  boton: {
    minHeight: 44,
    minWidth: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    flexDirection: 'row',
    gap: 4,
  },
  botonIniciar: {
    backgroundColor: COLORES_APP.primario,
  },
  textoBotonIniciar: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 14,
  },
  botonPausar: {
    backgroundColor: COLORES_APP.superficieClara,
  },
  textoBoton: {
    color: COLORES_APP.texto,
    fontWeight: '600',
    fontSize: 14,
  },
  botonReiniciar: {
    backgroundColor: COLORES_APP.superficieClara,
  },
});
