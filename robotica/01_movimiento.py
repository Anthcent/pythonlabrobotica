# SIMULADOR DE MOVIMIENTO: controla una posición en un tablero 7x7.
# ROBOT_POS es una marca que utiliza el panel visual del navegador.
DIRECCIONES = [(0, -1), (1, 0), (0, 1), (-1, 0)]  # N, E, S, O
SIMBOLOS = ["^", ">", "v", "<"]

class Robot:
    def __init__(self, x=3, y=3):
        self.x, self.y, self.direccion = x, y, 0

    def girar_derecha(self):
        self.direccion = (self.direccion + 1) % 4

    def avanzar(self):
        dx, dy = DIRECCIONES[self.direccion]
        nuevo_x, nuevo_y = self.x + dx, self.y + dy
        if 0 <= nuevo_x < 7 and 0 <= nuevo_y < 7:
            self.x, self.y = nuevo_x, nuevo_y
        else:
            print("Límite detectado: movimiento detenido")

    def dibujar(self):
        for y in range(7):
            print(" ".join(SIMBOLOS[self.direccion] if (x, y) == (self.x, self.y) else "." for x in range(7)))
        print(f"Posición: ({self.x}, {self.y})")
        print(f"ROBOT_POS {self.x} {self.y}")  # El panel dibuja esta coordenada.
        print("-" * 20)

robot = Robot()
robot.dibujar()
for accion in ["avanzar", "avanzar", "derecha", "avanzar", "derecha", "avanzar"]:
    if accion == "derecha":
        robot.girar_derecha()
    else:
        robot.avanzar()
    robot.dibujar()
