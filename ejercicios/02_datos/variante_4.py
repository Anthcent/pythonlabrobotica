# Python permite intercambiar variables sin una temporal.
a = 3  # Asigna o actualiza un valor.
b = 8  # Asigna o actualiza un valor.
print("Antes:", a, b)  # Muestra el resultado en la consola.
a, b = b, a  # Asigna o actualiza un valor.
print("Después:", a, b)  # Muestra el resultado en la consola.
