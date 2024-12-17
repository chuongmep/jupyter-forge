from aps_toolkit import Token
import random
import socket
import subprocess
import os
from IPython.display import display
from IPython.display import IFrame
import time
import sys


class JupyterForge:
    def __init__(self, urn, token: Token,region:str="US", port=62345, debug_mode=False):
        self.debug_mode = debug_mode
        self.token = token
        self.urn = urn
        self.region = region
        if urn is None:
            raise Exception("URN is required")
        if token is None:
            raise Exception("Token is required")
        self.port = port
        self.dir = self.get_current_dir()
        self.file_output_name = "rendered.html"
        self.start_a_server(self.dir)

    def get_current_dir(self):
        dir = os.path.dirname(os.path.realpath(__file__))
        template_dir = os.path.join(dir, "template")
        return template_dir

    def create_a_port_not_in_use(self):
        port = random.randint(1024, 65535)
        # check port is in use, if yes, random a new port
        while self.is_port_in_use(port):
            port = random.randint(1024, 65535)
        if self.debug_mode:
            print(f"Port: {port}")
        return port

    def is_port_in_use(self, port):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            return s.connect_ex(("localhost", port)) == 0

    @staticmethod
    def kill_process_using_port(self, port):
        try:
            # kill all process have port is using
            if self.is_port_in_use(port):
                if self.debug_mode:
                    print(f"Port {port} is in use, kill it")
                # check platform and kill process
                if os.name == 'nt':
                    all_ids = os.popen(f"netstat -ano | findstr :{port}").read()
                    pid = int(all_ids.split()[-1])
                    os.system(f"taskkill /PID {pid} /F")
                    time.sleep(2)
                else:
                    os.system(f"kill -9 $(lsof -t -i:{port})")
                    time.sleep(2)
            else:
                if self.debug_mode:
                    print(f"Port {port} is not in use")

        except Exception as e:
            print(f"Error: {e}")

    def start_a_server(self, dir):
        try:
            # if port is running, kill it
            if self.is_port_in_use(self.port):
                if self.debug_mode:
                    print(f"Port {self.port} is in use, kill it")
                # check platform and kill process
                if os.name == 'nt':
                    all_ids = os.popen(f"netstat -ano | findstr :{self.port}").read()
                    pid = int(all_ids.split()[-1])
                    os.system(f"taskkill /PID {pid} /F")
                    time.sleep(2)
                else:
                    os.system(f"kill -9 $(lsof -t -i:{self.port})")
            else:
                if self.debug_mode:
                    print(f"Port {self.port} is not in use, start init server dir: {dir}")
            # start a server and bind
            FNULL = open(os.devnull, 'w', encoding='utf-8')
            if os.name == 'nt':
                creation_flags = subprocess.CREATE_NEW_PROCESS_GROUP
                process = subprocess.Popen(
                    [sys.executable, "-m", "http.server", str(self.port), "--directory", self.dir],
                    stdout=FNULL,
                    stderr=FNULL,
                    creationflags=creation_flags,
                    shell=False
                )
            else:
                process = subprocess.Popen(
                    [sys.executable, "-m", "http.server", str(self.port), "--directory", self.dir],
                    stdout=FNULL,
                    stderr=FNULL,
                    shell=False
                )
                
            if self.debug_mode:
                print(f"Server PID: {process.pid}")
            if self.debug_mode:
                print(f"Server started successfully. Access: http://localhost:{self.port}")
            # wait 2 seconds for server to start
            time.sleep(2)
        except Exception as e:
            print(f"Error starting server: {e}")

    def show(self, object_ids: list[int] = None, width: int = 600, height: int = 350):
        access_token = self.token.access_token
        current_dir = os.path.dirname(os.path.realpath(__file__))
        file_path = os.path.join(current_dir, "template", "index.html")
        with open(file_path, "r") as file:
            html_template = file.read()
        html_content = html_template.replace("{{TOKEN}}", access_token).replace("{{URN}}", self.urn)
        html_content = html_content.replace("{{REGION}}", self.region)
        if object_ids:
            objects_ids_str = ",".join(map(str, object_ids))
            html_content = html_content.replace("{{OBJECT_IDS}}", objects_ids_str)
        output_file = os.path.join(current_dir, f"template/{self.file_output_name}")
        with open(output_file, "w") as file:
            file.write(html_content)
        if self.debug_mode:
            print(fr"http://localhost:{self.port}/{self.file_output_name}")
        iframe = IFrame(src=f"http://localhost:{self.port}/{self.file_output_name}", width=width, height=height)
        display(iframe)
