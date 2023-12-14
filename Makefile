.PHONY: install clean test retest coverage docs

install:
	pip install -e .[docs,test]

lint:
	flake8 src/ tests/
	isort --recursive --check-only --diff src tests

clean:
	find . -name '*.pyc' -delete
	find . -name '.pytest_cache' -print0|xargs -0 rm -rf

test:
	py.test -vvv

retest:
	py.test --reuse-db -vvv --lf --postgres --nomigrations

coverage:
	py.test --cov=zeep --cov-report=term-missing --cov-report=html

docs:
	$(MAKE) -C docs html

release:
	pip install twine wheel
	rm -rf dist/*
	python setup.py sdist bdist_wheel
	twine upload -s dist/*
