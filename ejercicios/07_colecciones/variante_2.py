tareas = ["Leer", "Practicar"]  # Asigna o actualiza un valor.
tareas.append("Practicar Python")
for indice, tarea in enumerate(tareas, start=1):  # Repite el bloque para cada elemento del recorrido.
    print(indice, "-", tarea)  # Muestra el resultado en la consola.
