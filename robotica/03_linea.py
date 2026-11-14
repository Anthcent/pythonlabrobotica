# SIMULACIÓN DE SEGUIDOR DE LÍNEA.
# 1 significa que el sensor detecta la línea oscura; 0 que no.
lecturas = [(1, 1), (1, 0), (1, 1), (0, 1), (0, 0), (1, 1)]

class SeguidorLinea:
    def decidir(self, izquierdo, derecho):
        if izquierdo == 1 and derecho == 1:
            return "AVANZAR"
        elif izquierdo == 1 and derecho == 0:
            return "GIRAR IZQUIERDA"
        elif izquierdo == 0 and derecho == 1:
            return "GIRAR DERECHA"
        else:
            return "BUSCAR LÍNEA"

robot = SeguidorLinea()
for paso, (izquierdo, derecho) in enumerate(lecturas, start=1):
    accion = robot.decidir(izquierdo, derecho)
    print(f"Lectura {paso}: I={izquierdo} D={derecho} -> {accion}")
    print("ROBOT_STATUS", accion)
print("Simulación terminada")
