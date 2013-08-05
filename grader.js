#!/usr/bin/env node

var fs = require('fs');
var rest = require('restler');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var URL_DEFAULT = "";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
	var instr = infile.toString();
	if (!fs.existsSync(instr)) {
		console.log("%s does not exist. Exiting.", instr);
		process.exit(1);
	}
	return instr;
};

var assertURLExists = function(url) {
	rest.get(url).on('complete', function(result) {
		if (result instanceof Error) {
			console.log("%s does not exist. Exiting.", url);
			process.exit(1);
		} else {
			return url;
		}
	});
}

var cheerioHtml = function(html) {
	return cheerio.load(html);
};

var loadChecks = function(checksfile) {
	return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtml = function(html, checksfile) {
	$ = cheerioHtml(html);
	var checks = loadChecks(checksfile).sort();
	var out = {};
	for (var ii in checks) {
		var present = $(checks[ii]).length > 0;
		out[checks[ii]] = present;
	}
	return out;
};

var clone = function(fn) {
	return fn.bind({});
};

var validateHtml = function(html, checkfile) {

	var checkJson = checkHtml(html, checkfile);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
}

if (require.main == module) {
	program
		.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
		.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
		.option('-u, --url <url>', 'URL of html file', null, URL_DEFAULT)
		.parse(process.argv);

	var html = '';
	if (program.url == URL_DEFAULT) {
		html = fs.readFileSync(program.file);
		validateHtml(html,program.checks);
	} else {
		rest.get(program.url).on('complete', function(result) {
			validateHtml(result,program.checks);
		});
	}
} else {
	exports.checkHtmlFile = checkHtmlFile;
}
