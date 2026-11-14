class Persona:  # Declara una clase: molde para crear objetos.
    def __init__(self, nombre):  # Define una función que se podrá llamar después.
        self.nombre = nombre  # Atributo de la instancia.

    def saludar(self):  # Define una función que se podrá llamar después.
        print(f"Hola, soy {self.nombre}")  # Muestra el resultado en la consola.

persona = Persona("Elena")  # Asigna o actualiza un valor.
persona.saludar()
