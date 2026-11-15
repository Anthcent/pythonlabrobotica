"""Laboratorio Python local: servidor HTTP estático para la carpeta web/.
El código Python se ejecuta en el navegador con Pyodide; este servidor no ejecuta código.
"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import webbrowser
import threading

BASE = Path(__file__).resolve().parent

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE / 'web'), **kwargs)

    def end_headers(self):
        self.send_header('X-Content-Type-Options', 'nosniff')
        # Cross-origin isolation enables SharedArrayBuffer, required by interactive input().
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        super().end_headers()

if __name__ == '__main__':
    # Puerto automático para evitar colisiones; accesible solo desde este equipo.
    server=ThreadingHTTPServer(('127.0.0.1', 0),Handler)
    address=f'http://127.0.0.1:{server.server_port}'
    print('Laboratorio Python | VS Code Style')
    print('Abre:',address)
    print('Pulsa Ctrl+C aquí para detener el servidor.')
    threading.Timer(0.7,lambda:webbrowser.open(address)).start()
    try: server.serve_forever()
    except KeyboardInterrupt: print('\nServidor detenido.')
