from setuptools import setup, find_packages

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
    # packages=find_packages(where="src"),
    include_package_data=True,
    install_requires=[
        "pandas>=2.1.4",
        "numpy>=1.26.0",
        "requests>=2.0",
        "aps-toolkit"
    ],
    python_requires=">=3.9",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
    ]
)
