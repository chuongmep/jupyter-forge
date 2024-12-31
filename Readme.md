

# Description

Jupyter 

## Developers 

#### Test Data Readme

```python
pip install -e .
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
