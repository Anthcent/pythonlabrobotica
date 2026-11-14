class Cuenta:  # Declara una clase: molde para crear objetos.
    def __init__(self, saldo):  # Define una función que se podrá llamar después.
        self.saldo = saldo  # Asigna o actualiza un valor.

    def depositar(self, monto):  # Define una función que se podrá llamar después.
        if monto > 0:  # Comprueba la condición; ejecuta el bloque si es verdadera.
            self.saldo += monto  # Asigna o actualiza un valor.

cuenta = Cuenta(100)  # Asigna o actualiza un valor.
cuenta.depositar(25)
print("Saldo:", cuenta.saldo)  # Muestra el resultado en la consola.
