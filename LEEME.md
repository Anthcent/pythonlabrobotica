# PythonLab — laboratorio de Python estilo VS Code

Una aplicación educativa local en español, con **10 ejercicios × 4 variantes = 40 programas** y **3 simulaciones de robótica**, editor de código, ejecución en consola, comentarios explicativos, desglose línea por línea y glosario. Todo el código Python funciona con **Python 3 y su biblioteca estándar**.

## Iniciar en Windows

1. Instala **Python 3.10 o superior** desde https://www.python.org/downloads/ y marca **Add Python to PATH** durante la instalación.
2. Descomprime el ZIP.
3. Haz doble clic en **INICIAR_WINDOWS.bat**.
4. Se abrirá el navegador automáticamente con el laboratorio. Deja la ventana negra del servidor abierta mientras lo utilices.
5. Para cerrar, presiona **Ctrl+C** en la ventana del servidor.

## Iniciar en Linux o macOS

Abre una terminal en la carpeta y ejecuta `bash INICIAR_LINUX_MAC.sh` (requiere `python3`).

## Aprender

- Selecciona uno de los **10 temas** del explorador. Cada tema tiene **4 variantes**.
- Lee los comentarios con `#` y la explicación de la derecha. Abre el apartado **Código explicado, línea por línea** para revisar cada instrucción, palabra, operador y símbolo.
- Edita el programa y haz clic en **▶ Ejecutar y ver resultado**, justo encima de la consola (o usa **Ctrl+Enter**). El robot y la consola se muestran en la misma zona.
- **No hay que introducir respuestas:** todos los ejemplos están resueltos con valores visibles en las variables. Cambia esos valores si quieres experimentar.
- Usa **Restablecer** para recuperar el código de ejemplo.
- Consulta la sección **Glosario** y la **Guía** en el menú vertical izquierdo.

## Ejecutar los scripts por separado

Los 43 programas son archivos `.py` normales. Por ejemplo, desde una terminal:

```sh
python ejercicios/01_hola_mundo/variante_1.py
python robotica/01_movimiento.py
```

En Windows también puedes utilizar `py -3` en lugar de `python`.

## Robótica sin hardware

1. **Movimiento en cuadrícula:** muestra posiciones y mapa ASCII; el panel también representa la posición final.
2. **Sensor de distancia:** genera distancias simuladas y decide detenerse o avanzar.
3. **Seguidor de línea:** simula dos sensores y decisiones de giro.

Las simulaciones **no controlan motores ni se conectan a Arduino o Raspberry Pi**. Son prácticas de lógica de programación por consola, útiles como base para adaptar posteriormente el programa al hardware real.

## Requisitos, privacidad y seguridad

- No requiere internet, Node.js, bases de datos ni paquetes `pip`.
- Necesita Python 3 instalado (el navegador por sí solo no ejecuta Python).
- El servidor se vincula **exclusivamente a 127.0.0.1** en un puerto libre y ejecuta el código en un proceso independiente con **límite de 6 segundos**.
- **No es un entorno aislado de seguridad**: los programas ejecutados tienen los permisos de tu cuenta. Solo ejecuta código propio o confiable y no abras este servidor a la red.
- Los cambios del editor duran únicamente mientras la página esté abierta; conserva el código importante copiándolo a un archivo `.py`.

## Estructura

- `servidor.py`: servidor HTTP y ejecución de Python mediante biblioteca estándar.
- `web/`: HTML, CSS, JavaScript y catálogo de los ejercicios.
- `ejercicios/`: 40 scripts Python organizados en 10 carpetas.
- `robotica/`: 3 simuladores Python independientes.
- `INICIAR_WINDOWS.bat`, `INICIAR_LINUX_MAC.sh`: lanzadores.

## Robótica animada paso a paso

Selecciona «Robótica 01 · Movimiento en cuadrícula» y presiona «Ejecutar y ver resultado». La página reproduce **en secuencia** cada posición que Python imprime con `ROBOT_POS`, en lugar de saltar al resultado final. El botón **Pausar / Continuar** detiene y reanuda la animación; **Un paso** permite avanzar manualmente por cada estado; **Reiniciar** reproduce desde el principio; **Velocidad** controla la espera entre pasos (lenta, normal o rápida). La consola se completa progresivamente, sincronizada con la animación. Los sensores y el seguidor de línea también muestran sus decisiones una por una.

Python se ejecuta localmente para obtener la secuencia de resultados; la reproducción visual se temporiza en el navegador. Esto no controla un robot físico. Si se modifica el código, la animación reflejará las marcas `ROBOT_POS` o `ROBOT_STATUS` que emita el programa.
