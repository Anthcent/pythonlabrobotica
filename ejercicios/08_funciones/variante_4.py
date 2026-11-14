def calcular_area(base, altura):  # Define una función que se podrá llamar después.
    return base * altura  # Devuelve el resultado de la función.

def mostrar_resultado(area):  # Define una función que se podrá llamar después.
    print(f"El área calculada es {area:.2f}")  # Muestra el resultado en la consola.

base = 5.0  # Asigna o actualiza un valor.
altura = 3.0  # Asigna o actualiza un valor.
mostrar_resultado(calcular_area(base, altura))
