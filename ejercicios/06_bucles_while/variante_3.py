opcion = ""  # Asigna o actualiza un valor.
opciones = ["1", "0"]  # Primero saluda y luego sale.
paso = 0  # Posición de la siguiente opción.
while opcion != "0":  # Repite mientras la condición sea verdadera.
    print("1. Saludar | 0. Salir")  # Muestra el resultado en la consola.
    opcion = opciones[paso]  # Opción ya definida, sin teclado.
    paso += 1  # Avanza al siguiente elemento de la lista.
    if opcion == "1":  # Comprueba la condición; ejecuta el bloque si es verdadera.
        print("¡Hola desde el menú!")  # Muestra el resultado en la consola.
    elif opcion != "0":  # Comprueba la condición; ejecuta el bloque si es verdadera.
        print("Opción no válida")  # Muestra el resultado en la consola.
print("Hasta luego")  # Muestra el resultado en la consola.
