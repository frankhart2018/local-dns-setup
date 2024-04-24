from pathlib import Path
import subprocess
import json


PIPE_PATH = "command-runner"
PIPE_OUTPUT_DIR = "."


while True:
    with open(PIPE_PATH) as f:
        command = f.read().strip()

    try:
        command_obj = json.loads(command)
    except:
        command_obj = {"cmd": "", "outputPath": "output.txt"}

    process = subprocess.Popen(
        command_obj["cmd"], shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    output, error = process.communicate()
    output_path = command_obj["outputPath"]

    with open(output_path, "w") as f:
        result = error.decode() if error else output.decode()
        f.write(result)
