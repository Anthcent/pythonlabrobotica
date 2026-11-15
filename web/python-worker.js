// Runs student code with Pyodide (CPython compiled to WebAssembly) inside a Web Worker.
// The worker isolates execution from the UI thread so the page can terminate runaway code.
const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
importScripts(PYODIDE_URL + 'pyodide.js');

const RUNNER = `
import linecache, sys, traceback

def _lab_run(source):
    namespace = {'__name__': '__main__'}
    # Register the source so tracebacks can show the failing line of main.py.
    linecache.cache['main.py'] = (len(source), None, source.splitlines(True), 'main.py')
    try:
        exec(compile(source, 'main.py', 'exec'), namespace)
        return 0
    except SystemExit as error:
        code = error.code
        if code is None:
            return 0
        if isinstance(code, int):
            return code
        print(code, file=sys.stderr)
        return 1
    except BaseException as error:
        # Skip the runner's own frame so the traceback starts at main.py.
        traceback.print_exception(type(error), error, error.__traceback__.tb_next)
        return 1
    finally:
        sys.stdout.flush()
        sys.stderr.flush()
`;

function streamTo(type) {
  const decoder = new TextDecoder('utf-8');
  return {
    write(bytes) {
      const text = decoder.decode(bytes, { stream: true });
      if (text) self.postMessage({ type, text });
      return bytes.length;
    },
  };
}

const ready = (async () => {
  const pyodide = await loadPyodide({ indexURL: PYODIDE_URL });
  pyodide.setStdout(streamTo('stdout'));
  pyodide.setStderr(streamTo('stderr'));
  // No interactive input: input() raises EOFError, matching the old server with empty stdin.
  pyodide.setStdin({ stdin: () => null });
  pyodide.runPython(RUNNER);
  return pyodide;
})();

ready.then(
  () => self.postMessage({ type: 'ready' }),
  (error) => self.postMessage({ type: 'fatal', message: String(error) }),
);

self.onmessage = async ({ data }) => {
  if (data.type !== 'run') return;
  try {
    const pyodide = await ready;
    const run = pyodide.globals.get('_lab_run');
    const exitCode = run(data.code);
    run.destroy();
    self.postMessage({ type: 'done', exitCode });
  } catch (error) {
    self.postMessage({ type: 'done', exitCode: 1, internalError: String(error) });
  }
};
