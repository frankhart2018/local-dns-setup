from pathlib import Path
import subprocess
import json
import argparse
import os


parser = argparse.ArgumentParser(description="Pipe command execution service")
parser.add_argument("--pipe-path", type=str, required=True, help="Path to pipe where commands are dumped")
parser.add_argument("--pipe-output-dir", type=str, required=True, help="Path to command result output directory")

args = parser.parse_args()

while True:
    with open(args.pipe_path) as f:
        command = f.read().strip()

    print(command)
    try:
        command_obj = json.loads(command)
    except:
        command_obj = {"cmd": "", "outputPath": os.path.join(args.pipe_output_dir, "output.txt")}
    print(command_obj)
    print("*" * 50)

    process = subprocess.Popen(
        command_obj["cmd"], shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    output, error = process.communicate()
    output_path = os.path.join(args.pipe_output_dir, os.path.basename(command_obj["outputPath"]))

    with open(output_path, "w") as f:
        result = error.decode() if error else output.decode()
        f.write(result)
    