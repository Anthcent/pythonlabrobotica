"""Laboratorio Python local: servidor HTTP y ejecutor con límites básicos.
Solo uso personal en 127.0.0.1; NO es un sandbox para código desconocido.
"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import json
import subprocess
import sys
import tempfile
import os
import webbrowser
import threading

BASE = Path(__file__).resolve().parent
MAX_CODE = 30_000
MAX_INPUT = 8_000
MAX_OUTPUT = 30_000

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE / 'web'), **kwargs)

    def end_headers(self):
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()

    def do_POST(self):
        if self.path != '/api/run':
            return self.send_json(404, {'error':'Ruta no encontrada'})
        try:
            n = int(self.headers.get('Content-Length', 0))
            if n <= 0 or n > 60_000:
                return self.send_json(413, {'error':'Solicitud demasiado grande'})
            request = json.loads(self.rfile.read(n))
            code = request.get('code', '')
            stdin_text = request.get('stdin', '')
            if not isinstance(code, str) or not isinstance(stdin_text, str):
                return self.send_json(400, {'error':'Formato inválido'})
            if len(code) > MAX_CODE or len(stdin_text) > MAX_INPUT:
                return self.send_json(413, {'error':'Código o entradas demasiado grandes'})
            with tempfile.TemporaryDirectory(prefix='python_lab_') as folder:
                script = Path(folder) / 'main.py'
                script.write_text(code, encoding='utf-8')
                try:
                    result = subprocess.run(
                        [sys.executable, '-I', '-u', str(script)],
                        input=stdin_text, capture_output=True, text=True,
                        encoding='utf-8', errors='replace', timeout=6,
                        cwd=folder, env={**os.environ, 'PYTHONIOENCODING':'utf-8'}
                    )
                    stdout, stderr, exit_code = result.stdout, result.stderr, result.returncode
                except subprocess.TimeoutExpired as error:
                    stdout = error.stdout or b''
                    if isinstance(stdout, bytes): stdout=stdout.decode('utf-8','replace')
                    stderr = 'La ejecución superó los 6 segundos. Revisa si hay un bucle infinito.'
                    exit_code = 124
            self.send_json(200, {'stdout':stdout[:MAX_OUTPUT], 'stderr':stderr[:MAX_OUTPUT], 'exit_code':exit_code})
        except Exception as error:
            self.send_json(500, {'error':f'Error al ejecutar: {type(error).__name__}: {error}'})

    def send_json(self, status, data):
        data=json.dumps(data,ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type','application/json; charset=utf-8')
        self.send_header('Content-Length',str(len(data)))
        self.end_headers()
        self.wfile.write(data)

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
