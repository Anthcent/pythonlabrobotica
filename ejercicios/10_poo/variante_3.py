class Robot:  # Declara una clase: molde para crear objetos.
    def __init__(self):  # Define una función que se podrá llamar después.
        self.posicion = 0  # Asigna o actualiza un valor.

    def avanzar(self, pasos):  # Define una función que se podrá llamar después.
        self.posicion += pasos  # Asigna o actualiza un valor.
        print(f"Robot en posición {self.posicion}")  # Muestra el resultado en la consola.

robot = Robot()  # Asigna o actualiza un valor.
robot.avanzar(2)
robot.avanzar(3)
