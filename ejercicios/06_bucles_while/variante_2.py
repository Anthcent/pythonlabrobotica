secreto = 7  # Asigna o actualiza un valor.
intentos = 0  # Asigna o actualiza un valor.
respuestas = [3, 5, 7]  # Tres intentos preparados: el tercero acierta.
while intentos < 3:  # Repite mientras la condición sea verdadera.
    numero = respuestas[intentos]  # Tomamos la respuesta correspondiente al intento.
    intentos += 1  # Asigna o actualiza un valor.
    if numero == secreto:  # Comprueba la condición; ejecuta el bloque si es verdadera.
        print("¡Correcto!")  # Muestra el resultado en la consola.
        break  # Sale del bucle inmediatamente.
else:  # Alternativa cuando no se cumple la condición anterior.
    print("Se agotaron los intentos")  # Muestra el resultado en la consola.
