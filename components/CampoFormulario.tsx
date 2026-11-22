import { View, Text, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { COLORES_APP } from '@/constants/colores';

export interface CampoFormularioProps extends TextInputProps {
  etiqueta: string;
  error?: string;
  unidad?: string;
}

export function CampoFormulario({
  etiqueta,
  error,
  unidad,
  style,
  ...props
}: CampoFormularioProps) {
  const tieneError = Boolean(error);

  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <View style={[styles.filaInput, tieneError && styles.filaInputError]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={COLORES_APP.textoSecundario}
          accessibilityLabel={etiqueta}
          {...props}
        />
        {unidad && <Text style={styles.unidad}>{unidad}</Text>}
      </View>
      {tieneError && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginBottom: 14,
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORES_APP.texto,
    marginBottom: 6,
  },
  filaInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  filaInputError: {
    borderColor: COLORES_APP.peligro,
  },
  input: {
    flex: 1,
    color: COLORES_APP.texto,
    fontSize: 16,
    minHeight: 44,
  },
  unidad: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORES_APP.textoSecundario,
    marginLeft: 6,
  },
  error: {
    fontSize: 13,
    color: COLORES_APP.peligro,
    marginTop: 4,
    fontWeight: '500',
  },
});
