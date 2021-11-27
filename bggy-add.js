const FS = require("fs");

const sources = FS.readdirSync(__dirname + "/sources")
{
	let i = 0;
	while (i < sources.length) {
		let v = sources[i];
		
		if (FS.lstatSync(__dirname + "/sources/" + v).isDirectory()) {
			sources.splice(i,1);
			i--;
		} else {
			sources[i] = v.slice(0,-4)
		}
		
		i++;
	}
}

exports.command = "add <name> [value]";
exports.describe = "Add a new source to BGGY or append to an existing source.";

exports.builder = function(yargs) {
	return yargs.positional("name", {
		describe: "Name of the source.",
		type: "string"
	}).positional("value", {
		describe: "Value to initialize the source, or to append if name refers to an existing source.",
		type: "string"
	}).option("image", {
		alias: "I",
		describe: "Specify that an image source is being added.",
		type: "boolean",
	});
};

exports.handler = function(argv) {
	if (argv.image) {
		if (!FS.existsSync(__dirname + "/sources/" + argv.name)) {
			FS.mkdirSync(__dirname + "/sources/" + argv.name);
		}
	} else {
		FS.appendFile(__dirname + "/sources/" + argv.name + ".txt", argv.value + "\n", function(err) {
			if (err) throw err;
		});
	}
}
