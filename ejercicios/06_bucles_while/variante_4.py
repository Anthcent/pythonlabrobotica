numero = 0  # Asigna o actualiza un valor.
while numero < 10:  # Repite mientras la condición sea verdadera.
    numero += 1  # Asigna o actualiza un valor.
    if numero % 2 != 0:  # Comprueba la condición; ejecuta el bloque si es verdadera.
        continue  # Omite el print() para impares.
    print("Par:", numero)  # Muestra el resultado en la consola.
