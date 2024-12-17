import os
import sys
src_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src'))
print(src_dir)
sys.path.append(src_dir)

from jupyter_forge import JupyterForge