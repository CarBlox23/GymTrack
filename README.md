# GymTrack - App de Entrenamiento y Ficha Digital 🏋️‍♂️📱

**Desarrollo de Aplicaciones Móviles**  
VI Semestre · Ingeniería de Sistemas · Periodo 2026-2  
*Laboratorio Integrado Final (40 %)*

---

## 👥 Integrantes del Equipo
* **Carlos Stevan Cordoba** — Ingeniería de Sistemas
* **Luis Angel Ruiz** — Ingeniería de Sistemas

---

## ⚙️ Línea Base Tecnológica y Requisitos de Entorno

| Herramienta | Versión Utilizada | Comando de Verificación |
| :--- | :--- | :--- |
| **Node.js** | 24 LTS (`v24.15.0`) | `node -v` |
| **Expo SDK** | 57 (`~57.0.33`) | `"expo": "~57.0.33"` en `package.json` |
| **Expo Go** | Compatible con SDK 57 | Pantalla de inicio de Expo Go |
| **TypeScript** | Modo `strict: true` activo | `tsconfig.json` |
| **Expo Router** | Navegación basada en archivos | Carpeta `app/` |
| **React / React Native**| React 19.2.3 / React Native 0.86.3 | `package.json` |

---

## 🚀 Instrucciones de Instalación y Ejecución

1. **Clonar el repositorio y ubicarse en la carpeta del proyecto:**
   ```bash
   cd gymtrack
   ```

2. **Instalar dependencias oficiales:**
   ```bash
   npm install
   ```

3. **Verificar tipado estricto con TypeScript (sin errores):**
   ```bash
   npx tsc --noEmit
   ```

4. **Verificar calidad de código y linter:**
   ```bash
   npx eslint .
   ```

5. **Iniciar el servidor de desarrollo Expo:**
   ```bash
   npx expo start
   ```

6. **Abrir en dispositivo físico o emulador:**
   * Escanear el código QR con la aplicación **Expo Go (SDK 57)** en Android o la cámara en iOS.
   * Presionar `w` en la terminal para abrir la versión Web.

---

## 📋 Matriz de Cumplimiento de Requisitos

### Requisitos Funcionales Obligatorios (RF01 - RF08)

| ID | Requisito | Criterio de Aceptación | Estado | Evidencia en el Código |
| :--- | :--- | :--- | :---: | :--- |
| **RF01** | Ver el plan semanal | Muestra los 6 días con su enfoque y color asignado de la ficha; el día actual aparece destacado con badge "HOY"; el domingo muestra mensaje de descanso. | **Cumplido** | [`app/(tabs)/index.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/app/(tabs)/index.tsx), [`components/TarjetaDia.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/components/TarjetaDia.tsx) |
| **RF02** | Ver el detalle de un día | Ruta `/dia/[dia]` con calentamiento inicial (5 min), ejercicios agrupados por grupo muscular con esquema 4 × 12, cardio específico y calentamiento final (10 min). | **Cumplido** | [`app/dia/[dia].tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/app/dia/[dia].tsx), [`components/TarjetaCalentamiento.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/components/TarjetaCalentamiento.tsx) |
| **RF03** | Consultar el catálogo | Pestaña Catálogo con los 11 grupos musculares en tarjetas; al presionar un grupo navega a `/grupo/[grupo]` listando sus ejercicios. | **Cumplido** | [`app/(tabs)/catalogo.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/app/(tabs)/catalogo.tsx), [`app/grupo/[grupo].tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/app/grupo/[grupo].tsx) |
| **RF04** | Filtrar ejercicios | `TextInput` controlado que busca por nombre sin distinguir mayúsculas ni tildes (`normalizar`). Probar con "extension" retorna 4 ejercicios. | **Cumplido** | [`app/(tabs)/catalogo.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/app/(tabs)/catalogo.tsx), [`utils/texto.ts`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/utils/texto.ts) |
| **RF05** | Ver detalle de ejercicio | Ruta `/ejercicio/[id]` con nombre, grupo, ilustración técnica/marcador, series (4), repeticiones (12) y días asignados calculados con `filter`. | **Cumplido** | [`app/ejercicio/[id].tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/app/ejercicio/[id].tsx) |
| **RF06** | Registrar sesión del día | En `/dia/[dia]`, cada ejercicio se marca como completado/pendiente; barra de progreso muestra porcentaje y completados/total. | **Cumplido** | [`app/dia/[dia].tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/app/dia/[dia].tsx), [`components/ItemEjercicio.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/components/ItemEjercicio.tsx), [`components/BarraProgreso.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/components/BarraProgreso.tsx) |
| **RF07** | Gestionar el perfil | Formulario controlado con nombre, edad, objetivo y observaciones; valida edad entre 14 y 90 y nombre no vacío; `KeyboardAvoidingView` y confirmación con `Alert`. | **Cumplido** | [`app/(tabs)/perfil.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/app/(tabs)/perfil.tsx), [`components/CampoFormulario.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/components/CampoFormulario.tsx) |
| **RF08** | Registrar medidas mensuales | Formulario con mes, estatura, peso y 8 perímetros; rechaza pesos fuera de 30-300 kg, estaturas fuera de 1.00-2.30 m y meses duplicados; calcula IMC, clasificación OMS y diferencia de peso. | **Cumplido** | [`app/(tabs)/medidas.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/app/(tabs)/medidas.tsx), [`components/TarjetaResumenImc.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/components/TarjetaResumenImc.tsx), [`utils/imc.ts`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/utils/imc.ts) |

### Requisitos de Bonificación (+0.50)

| ID | Bonificación | Descripción de Implementación | Estado | Evidencia en el Código |
| :--- | :--- | :--- | :---: | :--- |
| **RF09** | Advertir restricciones médicas | Si el socio registra lesiones en un grupo muscular (ej. pierna, lumbar), los ejercicios de ese grupo muestran una insignia y tarjeta de advertencia visible en el catálogo, detalle y sesión. | **Cumplido** | [`components/AlertaLesion.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/components/AlertaLesion.tsx), [`components/ItemEjercicio.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/components/ItemEjercicio.tsx), [`app/ejercicio/[id].tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/app/ejercicio/[id].tsx) |
| **RF10** | Temporizador de descanso | Cuenta regresiva de 60 segundos entre series con botones de Iniciar, Pausar y Reiniciar, retroalimentación táctil (`expo-haptics`) y limpieza del intervalo con `clearInterval` en el retorno de `useEffect`. | **Cumplido** | [`components/TemporizadorDescanso.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/components/TemporizadorDescanso.tsx), [`app/dia/[dia].tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/app/dia/[dia].tsx) |
| **RF11** | Persistencia con AsyncStorage | Datos del perfil, historial de medidas y progreso de ejercicios completados por día se guardan y recuperan automáticamente al reiniciar la app mediante `@react-native-async-storage/async-storage`. | **Cumplido** | [`context/GymContext.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/context/GymContext.tsx) |

### Requisitos No Funcionales (RNF01 - RNF06)

| ID | Requisito | Criterio de Verificación | Estado |
| :--- | :--- | :--- | :---: |
| **RNF01** | Tipado Estricto | TypeScript con `strict: true`. Cero usos de `any` y cero directivas `@ts-ignore`. `npx tsc --noEmit` termina sin errores. | **Cumplido** |
| **RNF02** | Compatibilidad Expo Go | Proyecto compatible al 100% con Expo Go SDK 57 sin librerías nativas incompatibles. | **Cumplido** |
| **RNF03** | Usabilidad y Accesibilidad | Áreas táctiles mínimas de 44 × 44 puntos, tamaños de texto legible (mínimo 14 pt para contenido principal), `accessibilityRole` y contenido dentro de `SafeAreaView`. | **Cumplido** |
| **RNF04** | Organización y Límite de Líneas | Estructura de carpetas exacta según la sección 5 del documento. **Ningún archivo de pantalla en `app/` supera las 200 líneas**. | **Cumplido** |
| **RNF05** | Control de Versiones | Repositorio Git con al menos 8 commits distribuidos en las fases con mensajes descriptivos y etiqueta `v1.0`. | **Cumplido** |
| **RNF06** | Rendimiento | Transiciones fluidas entre pestañas y rutas dinámicas en menos de 1 segundo sin peticiones de red bloqueantes. | **Cumplido** |

---

## 📱 Recorrido Visual de las 4 Pestañas Principales

1. **Pestaña 1: Inicio (`/`)**
   * Encabezado con saludo personalizado al socio y objetivo actual.
   * Lista visual de los 6 días de entrenamiento (Lunes a Sábado) con sus colores oficiales de la ficha (Cian, Naranja, Verde, Rosado, Amarillo verdoso).
   * Detección dinámica del día actual (`new Date().getDay()`) marcándolo con el distintivo **"HOY"**.
   * Si es Domingo, muestra una tarjeta informativa invitando a la recuperación y descanso.
   * Mini barra de progreso por día que refleja cuántos ejercicios se han completado.

2. **Pestaña 2: Catálogo (`/catalogo`)**
   * Buscador en tiempo real controlado por `TextInput`.
   * Búsqueda normalizada mediante `utils/texto.ts`: buscar "extension" encuentra "Extensión de cuádriceps", "Extensión con mancuerna", "Extensión en polea" e "Hiperextensiones".
   * Cuadrícula adaptable con `useWindowDimensions`: 2 columnas en modo vertical (móvil) y 3 columnas cuando el ancho supera los 600 puntos (tableta o modo horizontal).
   * Al pulsar un grupo, navega a `/grupo/[grupo]`, y al pulsar un ejercicio navega a su detalle `/ejercicio/[id]`.

3. **Pestaña 3: Medidas (`/medidas`)**
   * Tarjeta resumen con el último mes registrado, peso, estatura, cálculo de IMC (`utils/imc.ts`), clasificación según la OMS (ej. *Obesidad grado I*) y comparativa respecto al mes previo (ej. *−2.5 kg* con indicador verde).
   * Botón para desplegar el formulario de nueva medición mensual.
   * Validaciones numéricas: peso (30 a 300 kg), estatura (1.00 a 2.30 m) y prevención de meses duplicados.
   * Registro completo de los 8 perímetros corporales (hombro, brazo, antebrazo, pecho, abdomen, cadera, pierna, pantorrilla).
   * Historial cronológico ordenado del más reciente al más antiguo.

4. **Pestaña 4: Perfil (`/perfil`)**
   * Información del socio y fecha de asignación de la ficha.
   * Formulario controlado para modificar nombre, edad (validada numéricamente entre 14 y 90 años) y objetivo.
   * Despliegue de observaciones médicas y grupos musculares con lesiones previas (Cirugía de menisco en pierna, Dolor lumbar).
   * Botón para restaurar los datos iniciales de prueba en caso de requerir reevaluación.

---

## 🔍 Bitácora de Investigación Autónoma (Sección 11)

| Tema | Fuentes Consultadas | Qué se aprendió | Archivo Aplicado | Pregunta Guía de Sustentación |
| :--- | :--- | :--- | :--- | :--- |
| **T1. Estado global con Context** | [React: useContext](https://react.dev/reference/react/useContext) | Context permite compartir el estado del socio, medidas y ejercicios completados a través del árbol de componentes sin necesidad de "prop drilling" manual por múltiples niveles jerárquicos. | [`context/GymContext.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/context/GymContext.tsx) | *¿Qué problema resuelve Context frente a pasar props por varios niveles, y por qué useGym lanza un error fuera del Provider?* **Respuesta:** Resuelve el acoplamiento y la carga de pasar props a través de componentes intermedios que no las necesitan. `useGym` valida si el contexto es `null` para advertir en desarrollo que ningún componente puede consumir el estado fuera del `<GymProvider>`. |
| **T2. Tabs y rutas dinámicas en Expo Router** | [Expo Router: Dynamic Routes](https://docs.expo.dev/router/create-pages/#dynamic-routes) | Expo Router mapea la estructura de archivos en el sistema de navegación: las carpetas entre paréntesis como `(tabs)` definen grupos sin alterar la URL, y los corchetes como `[dia].tsx` capturan parámetros dinámicos tipados mediante `useLocalSearchParams`. | [`app/_layout.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/app/_layout.tsx), [`app/dia/[dia].tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/app/dia/[dia].tsx) | *¿Cómo se traduce app/dia/[dia].tsx en una URL y cómo llega el parámetro a la pantalla?* **Respuesta:** Se traduce a la ruta `/dia/:dia`. Al navegar con `router.push('/dia/martes')`, Expo Router extrae el segmento de la URL y lo inyecta tipado en el hook `useLocalSearchParams<{ dia: DiaSemana }>()`. |
| **T3. useEffect y función de limpieza** | [React: Synchronizing with Effects](https://react.dev/reference/react/useEffect) | Cuando se inicializa un temporizador o suscripción asíncrona dentro de `useEffect`, la función retornada actúa como cleanup, ejecutándose antes del siguiente efecto o al desmontar el componente para evitar fugas de memoria o intervalos huérfanos. | [`components/TemporizadorDescanso.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/components/TemporizadorDescanso.tsx) | *¿Qué pasa si el temporizador no limpia su intervalo al salir de la pantalla?* **Respuesta:** El `setInterval` continúa ejecutándose indefinidamente en segundo plano, consumiendo CPU y batería, e intentando actualizar el estado de un componente ya desmontado (memory leak). |
| **T4. Formularios controlados y validación** | [React Native: TextInput](https://reactnative.dev/docs/textinput) | En un formulario controlado, el valor del input está ligado a un estado de React (`value` y `onChangeText`). Las validaciones deben comprobar explícitamente cadenas vacías antes de convertir a número para evitar que `Number('')` se evalúe como 0. | [`app/(tabs)/perfil.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/app/(tabs)/perfil.tsx), [`app/(tabs)/medidas.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/app/(tabs)/medidas.tsx) | *¿Por qué Number('') es un riesgo al validar la edad y cómo lo evitó?* **Respuesta:** En JavaScript, `Number('')` retorna `0`, lo que podría interpretarse erróneamente como un número válido. Se evitó comprobando primero `!edadTexto.trim()` y luego validando con `Number.isInteger(num) && num >= 14 && num <= 90`. |
| **T5. Diseño adaptable y área segura** | [React Native: useWindowDimensions](https://reactnative.dev/docs/usewindowdimensions) | `useWindowDimensions` escucha cambios en las dimensiones de la pantalla en tiempo real (orientación vertical y horizontal). `SafeAreaView` añade padding automático para proteger el contenido de la barra de estado y notch. | [`app/(tabs)/catalogo.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/app/(tabs)/catalogo.tsx), [`constants/colores.ts`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/constants/colores.ts) | *¿Cómo cambia su cuadrícula al girar el teléfono y qué valor lo decide?* **Respuesta:** Al girar horizontalmente, el ancho supera los 600 puntos (`width > 600`), lo cual conmuta la cuadrícula de 2 a 3 columnas automáticamente mediante `useWindowDimensions`. |
| **T6. Arreglos y tipos en TypeScript** | [TypeScript: Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) | Métodos funcionales como `filter`, `map` y `find` permiten manipular colecciones sin mutaciones. `String.normalize('NFD')` descompone caracteres acentuados en letra base y diacrítico, permitiendo remover tildes mediante expresiones regulares. | [`utils/texto.ts`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/utils/texto.ts), [`app/ejercicio/[id].tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/app/ejercicio/[id].tsx) | *¿Cómo obtiene los días en que aparece un ejercicio y por qué el filtro encuentra “extension” sin tilde?* **Respuesta:** Se filtran los días del plan con `planSemanal.filter(p => p.ejercicios.includes(id))`. Para el filtro de búsqueda, `normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()` iguala "extensión" y "extension" a nivel de bytes unicode. |
| **T7. Recursos estáticos e imágenes locales** | [React Native: Images](https://reactnative.dev/docs/images) | En React Native, `require()` se resuelve estáticamente en tiempo de empaquetado (Metro bundler), por lo que no acepta concatenación dinámica de variables en tiempo de ejecución. Por ello, se implementó un contenedor ilustrativo tipado con fallback estético. | [`app/ejercicio/[id].tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/app/ejercicio/[id].tsx) | *¿Por qué la ruta de require no puede construirse con una variable?* **Respuesta:** Metro bundler analiza las dependencias del proyecto de manera estática antes de ejecutar la aplicación para generar el bundle de recursos; una variable dinámica no puede inferirse durante el empaquetado. |
| **T8. Persistencia con AsyncStorage** | [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/docs/usage) | AsyncStorage es un almacenamiento asíncrono no cifrado de tipo clave-valor para cadenas de texto. Requiere serializar objetos complejos con `JSON.stringify` y deserializar con `JSON.parse`. | [`context/GymContext.tsx`](file:///c:/Users/carlo/OneDrive/Desktop/Movil/gymtrack/context/GymContext.tsx) | *¿Por qué AsyncStorage no sirve para guardar contraseñas o tokens?* **Respuesta:** Porque los datos se almacenan en texto plano en el almacenamiento del sistema operativo (SharedPreferences en Android / archivos plist en iOS) sin cifrado de hardware, siendo vulnerable en dispositivos rooteados o vulnerados (para secretos se debe usar `expo-secure-store`). |

---

## 💡 Reflexión Técnica (Máximo 300 palabras)

**Decisión de diseño justificada:**  
Se optó por una arquitectura desacoplada basada en un Context global (`GymContext`) complementado con componentes puros reutilizables en `components/`. Esta decisión centralizó la sincronización entre el progreso de los entrenamientos diarios, las medidas corporales y la persistencia sin acoplar las pantallas entre sí, facilitando que cada pantalla mantuviera un tamaño estrictamente inferior a las 200 líneas sin sacrificar legibilidad ni funcionalidad.

**Dificultad técnica y resolución:**  
El mayor reto fue garantizar la sincronización segura y sin parpadeos del temporizador de descanso de 60 segundos (RF10) junto con la persistencia en `AsyncStorage` (RF11) bajo el ciclo de vida de React Native. Si el usuario cambiaba de pestaña durante el conteo, podían generarse intervalos huérfanos. Se resolvió mediante un efecto con función de limpieza estricta (`clearInterval`) y la persistencia asíncrona desacoplada de la interfaz, asegurando que las modificaciones de estado se reflejen instantáneamente en memoria mientras el almacenamiento secundario se actualiza en segundo plano.

**Declaración del uso de IA:**  
Se utilizó el asistente de IA **Antigravity (Google DeepMind)** como herramienta de soporte para la estructuración inicial de los tipos de TypeScript, la redacción de expresiones regulares diacríticas en utilidades de texto y la verificación cruzada de la rúbrica de evaluación. Toda la lógica de negocio, validaciones matemáticas de IMC, diseño Flexbox y sustentación fueron validadas y apropiadas por el equipo de desarrollo.
