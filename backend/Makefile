install:
	pip install -r requirements.txt

format:
	python -m black *py app/*py app/routers/*py app/internal/*py tests/*py app/helper/*py

testing:
	python -m pytest

run:
	python -m uvicorn main:app

all: install format testing run 