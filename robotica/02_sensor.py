# SIMULACIÓN: lecturas de un sensor en centímetros.
# No se comunica con sensores físicos reales.
lecturas_cm = [55, 32, 19, 11, 7, 24, 40]
umbral_cm = 15

class RobotSeguro:
    def __init__(self):
        self.pasos = 0

    def revisar_distancia(self, distancia):
        if distancia < umbral_cm:
            print(f"{distancia} cm -> ALTO: obstáculo cercano")
            print("ROBOT_STATUS ALTO")
        else:
            self.pasos += 1
            print(f"{distancia} cm -> AVANZAR: paso {self.pasos}")
            print("ROBOT_STATUS AVANZAR")

robot = RobotSeguro()
for lectura in lecturas_cm:
    robot.revisar_distancia(lectura)
print("Pasos seguros:", robot.pasos)
