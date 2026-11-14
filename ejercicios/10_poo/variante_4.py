class Animal:  # Declara una clase: molde para crear objetos.
    def hablar(self):  # Define una función que se podrá llamar después.
        print("Un animal emite un sonido")  # Muestra el resultado en la consola.

class Perro(Animal):  # Declara una clase: molde para crear objetos.
    def hablar(self):  # Define una función que se podrá llamar después.
        print("Guau")  # Muestra el resultado en la consola.

animal = Animal()  # Asigna o actualiza un valor.
perro = Perro()  # Asigna o actualiza un valor.
animal.hablar()
perro.hablar()
