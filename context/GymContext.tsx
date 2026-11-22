import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Socio, Medida, DiaSemana } from '@/types/gym';
import { socioInicial } from '@/data/socio';

export type Completados = Record<DiaSemana, string[]>;

export interface GymState {
  socio: Socio;
  setSocio: (s: Socio) => void;
  medidas: Medida[];
  agregarMedida: (m: Medida) => void;
  completados: Completados;
  alternarEjercicio: (dia: DiaSemana, id: string) => void;
  cargando: boolean;
  reiniciarDatos: () => Promise<void>;
}

const vacio: Completados = {
  lunes: [],
  martes: [],
  miercoles: [],
  jueves: [],
  viernes: [],
  sabado: [],
};

const STORAGE_KEYS = {
  SOCIO: '@gymtrack_socio_v1',
  MEDIDAS: '@gymtrack_medidas_v1',
  COMPLETADOS: '@gymtrack_completados_v1',
};

const GymContext = createContext<GymState | null>(null);

export function GymProvider({ children }: { children: ReactNode }) {
  const [socio, setSocioState] = useState<Socio>(socioInicial);
  const [medidas, setMedidasState] = useState<Medida[]>(socioInicial.medidas);
  const [completados, setCompletadosState] = useState<Completados>(vacio);
  const [cargando, setCargando] = useState<boolean>(true);

  // Carga inicial persistida desde AsyncStorage (RF11 / T8)
  useEffect(() => {
    async function cargarPersistencia() {
      try {
        const [rawSocio, rawMedidas, rawCompletados] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.SOCIO),
          AsyncStorage.getItem(STORAGE_KEYS.MEDIDAS),
          AsyncStorage.getItem(STORAGE_KEYS.COMPLETADOS),
        ]);

        if (rawSocio) {
          const parsedSocio: Socio = JSON.parse(rawSocio);
          setSocioState(parsedSocio);
        }
        if (rawMedidas) {
          const parsedMedidas: Medida[] = JSON.parse(rawMedidas);
          setMedidasState(parsedMedidas);
        }
        if (rawCompletados) {
          const parsedCompletados: Completados = JSON.parse(rawCompletados);
          setCompletadosState(parsedCompletados);
        }
      } catch (error) {
        console.error('Error al recuperar datos desde AsyncStorage:', error);
      } finally {
        setCargando(false);
      }
    }

    cargarPersistencia();
  }, []);

  const setSocio = (nuevoSocio: Socio) => {
    setSocioState(nuevoSocio);
    AsyncStorage.setItem(STORAGE_KEYS.SOCIO, JSON.stringify(nuevoSocio)).catch(
      err => console.error('Error al guardar socio:', err)
    );
  };

  const agregarMedida = (m: Medida) => {
    setMedidasState(prev => {
      const nuevas = [m, ...prev];
      AsyncStorage.setItem(STORAGE_KEYS.MEDIDAS, JSON.stringify(nuevas)).catch(
        err => console.error('Error al guardar medidas:', err)
      );
      return nuevas;
    });
  };

  const alternarEjercicio = (dia: DiaSemana, id: string) => {
    setCompletadosState(prev => {
      const diaActual = prev[dia] || [];
      const actualizados = diaActual.includes(id)
        ? diaActual.filter(x => x !== id)
        : [...diaActual, id];
      const nuevos = {
        ...prev,
        [dia]: actualizados,
      };
      AsyncStorage.setItem(
        STORAGE_KEYS.COMPLETADOS,
        JSON.stringify(nuevos)
      ).catch(err => console.error('Error al guardar completados:', err));
      return nuevos;
    });
  };

  const reiniciarDatos = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.SOCIO,
        STORAGE_KEYS.MEDIDAS,
        STORAGE_KEYS.COMPLETADOS,
      ]);
      setSocioState(socioInicial);
      setMedidasState(socioInicial.medidas);
      setCompletadosState(vacio);
    } catch (err) {
      console.error('Error al reiniciar almacenamiento:', err);
    }
  };

  return (
    <GymContext.Provider
      value={{
        socio,
        setSocio,
        medidas,
        agregarMedida,
        completados,
        alternarEjercicio,
        cargando,
        reiniciarDatos,
      }}>
      {children}
    </GymContext.Provider>
  );
}

export function useGym(): GymState {
  const ctx = useContext(GymContext);
  if (!ctx) throw new Error('useGym debe usarse dentro de GymProvider');
  return ctx;
}
