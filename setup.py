from setuptools import setup
from glob import glob
import os


def exclude_files(package_dir, exclude_patterns):
    """
    Recursively exclude files matching the exclude_patterns.
    This will prevent them from being packaged.
    """
    excluded_files = []
    for root, _, files in os.walk(package_dir):
        for file in files:
            if any(file.endswith(pattern) for pattern in exclude_patterns):
                # Convert to relative path for packaging exclusion
                rel_path = os.path.relpath(os.path.join(root, file), package_dir)
                excluded_files.append(rel_path)
    return excluded_files
exclude_patterns = (".ipynb", "render.html")

# Find excluded files
package_dir = "src"
exclude_patterns = (".ipynb", "rendered.html")
excluded_files = exclude_files(package_dir, exclude_patterns)
print("Excluded files:", excluded_files)
setup(
    name="jupyter_forge",
    version="0.1.0",
    author="chuongmep",
    author_email="chuongpqvn@gmail.com",
    description="A tool for extracting data from Revit ACC",
    long_description=open("Readme.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/chuongmep/revit-meows",
    package_dir={"": "src"},
    include_package_data=True,
    # packages=find_packages(where="src"),
    data_files=[("src", glob("src/template/*.*", recursive=True)),
                ("src", glob("src/template/Extensions/*.*", recursive=True))],
    install_requires= [open("requirements.txt").read().strip()],
    python_requires=">=3.9",
    # exclude files
    exclude_package_data={"src": excluded_files},
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
    ]
)
