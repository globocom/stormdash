.PHONY: help setup clean pep8 tests run

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

setup: ## Install project dependencies
	@npm install

clean: ## Clear build files
	@rm -rf build

tests: clean pep8 ## Run pep8 and all tests with coverage
	@echo "Running all tests"
	@npm run -s test

tests_ci: clean pep8 ## Run pep8 and all tests
	@echo "Running the tests"
	@npm run -s test-ci

run: ## Run a development web server
	@npm run start

build: clean
	@npm run build

deploy:
	@tsuru app-deploy -a stormdash build node_modules public server src Procfile package.json package-lock.json
