# Description

Jupyter Forge is a library that allows you can explore 3d viewer from Autodesk Platform Services bring into interactive
of Jupyter Notebook.

![](./docs/iShot_2025-01-01_00.28.48.gif)

## Installation

```bash
pip install jupyter-forge
```

## Usage

```python
from jupyter_forge import JupyterForge
from aps_toolkit import Auth

urn = "dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLlFsa1ZtVU5RUmYtanMtd3dLQ2dLM1E_dmVyc2lvbj0x"
token = Auth().auth2leg()
forge_viewer = JupyterForge(urn, token)
# object id from derivative api
object_ids = [123, 456]
# show 3d viewer
forge_viewer.show(object_ids, width=800, height=600)
```

## Developers

#### Test Data Readme

```python
pip
install - e.
```

#### Fix server not starting

```bash
# start a server with dir 
python -m http.server 54364 --directory D:\API\Forge\jupyter-forge\src\template
``` 

#### Kill Port

```bash
netstat -ano | findstr :54364
taskkill /F /PID 21008
```

- Kill all port relate to 54364

```bash
taskkill /F /PID 21008
```

#### Start Debug

http://localhost:54364/render.html
