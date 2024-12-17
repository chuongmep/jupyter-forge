from aps_toolkit import Auth
import random
import socket
from subprocess import Popen, PIPE
import os
from IPython.display import display
from IPython.display import IFrame


class JupyterForge:
    def __init__(self, urn,debug_mode=False):
        self.debug_mode = debug_mode
        self.token = Auth().auth2leg()
        self.urn = urn
        self.port = self.create_a_port_not_in_use()
        self.dir = os.path.dirname(os.path.realpath(__file__))
        self.start_a_server(self.dir)

    def get_current_dir(self):
        return os.path.dirname(os.path.realpath(__file__))

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

    def start_a_server(self, dir):
        try:
            process = Popen(
                ["python", "-m", "http.server", str(self.port), "--directory", dir],
                stdout=PIPE,
                stderr=PIPE,
                cwd=dir
            )
            if self.debug_mode:
                print(f"Server started successfully. Access: http://localhost:{self.port}/viewer_dynamic_rendered.html")
        except Exception as e:
            print(f"Error starting server: {e}")

    def show(self, object_ids: list[int] = None, width:int=600, height:int=350):
        access_token = self.token.access_token
        with open("./template/viewer_dynamic.html", "r") as file:
            html_template = file.read()
        html_content = html_template.replace("{{TOKEN}}", access_token).replace("{{URN}}", self.urn)
        if object_ids:
            objects_ids_str = ",".join(map(str, object_ids))
            html_content = html_content.replace("{{OBJECT_IDS}}", objects_ids_str)
        output_file = "./template/viewer_dynamic_rendered.html"
        with open(output_file, "w") as file:
            file.write(html_content)
        if self.debug_mode:
            print(f"Viewer URL: http://localhost:{self.port}/{output_file}")
        iframe = IFrame(src=f"http://localhost:{self.port}/{output_file}", width=width, height=height)
        display(iframe)

