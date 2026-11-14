def es_par(numero):  # Define una función que se podrá llamar después.
    return numero % 2 == 0  # Devuelve el resultado de la función.

valor = 8  # Asigna o actualiza un valor.
if es_par(valor):  # Comprueba la condición; ejecuta el bloque si es verdadera.
    print("Es par")  # Muestra el resultado en la consola.
else:  # Alternativa cuando no se cumple la condición anterior.
    print("Es impar")  # Muestra el resultado en la consola.
