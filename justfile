export PATH := './node_modules/.bin:' + env_var('PATH')

default:
    @just --list

clean:
    rm -rf target

compile:
    tsc --build

lint:
    eslint .

test-unit *options:
    mocha --config mocha.config.json --spec './test/unit/**/*.test.ts' {{options}}

test-unit-coverage *options:
    c8 just test-unit {{options}}

test-integration *options:
    mocha --config mocha.config.json --spec './test/integration/**/*.test.ts' {{options}}

test: compile (test-unit)

release-dry:
    release-it --dry-run --no-npm

release:
    release-it
