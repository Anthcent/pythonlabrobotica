try:  # Intenta ejecutar el bloque que podría fallar.
    a = 12.0  # Asigna o actualiza un valor.
    b = 3.0  # Asigna o actualiza un valor.
    print("Resultado:", a / b)  # Muestra el resultado en la consola.
except ZeroDivisionError:  # Maneja el tipo de error indicado.
    print("No se puede dividir entre cero")  # Muestra el resultado en la consola.
except ValueError:  # Maneja el tipo de error indicado.
    print("Ingresa números válidos")  # Muestra el resultado en la consola.
