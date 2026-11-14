try:  # Intenta ejecutar el bloque que podría fallar.
    edad = 18  # Asigna o actualiza un valor.
    print("Edad registrada:", edad)  # Muestra el resultado en la consola.
except ValueError:  # Maneja el tipo de error indicado.
    # Ocurre cuando el texto no puede convertirse a entero.
    print("Error: debes escribir un número entero")  # Muestra el resultado en la consola.
