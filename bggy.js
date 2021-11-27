const FS = require("fs");
const CANVAS = require("canvas");
CANVAS.registerFont(__dirname + "/CreteRound-Regular.ttf", { family: "Crete Round" });
const TEXT_HEIGHT = 32;
const PADDING = 32;

const sources = FS.readdirSync(__dirname + "/sources");
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



exports.command = "$0 [source...]";
exports.describe = "Run BGGY.";

exports.builder = function(yargs) {
	return yargs.positional("source...", {
		describe: "Sources BGGY should use. By default BGGY uses all sources.",
		type: "string"
	});
};

exports.handler = function(argv) {
	if (argv.list) {
		let out = "";
		
		sources.forEach(function(v,i) {
			out += v;
			if (i < sources.length - 1)
				out += ", ";
		});
		
		console.log(out);
	} else {
		let src = [];
		if (argv.source) {
			sources.forEach(function(v,i) {
				if (argv.source.includes(v)) {
					src.push(v);
				}
			});
		} else {
			src = sources;
		}
		
		let src_text = [];
		src.forEach(function(v,i) {
			let lines = FS.readFileSync(__dirname + "/sources/" + v + ".txt", "utf8").split("\n");
			lines.pop();
			
			lines.forEach(function(w,j) {
				src_text.push([w,v]);
			});
		});
		
		if (src_text.length) {
			const canvas = CANVAS.createCanvas(1920, 1080);
			const ctx = canvas.getContext("2d");
			
			const text = src_text[Math.floor(Math.random() * src_text.length)];
			const images = FS.readdirSync(__dirname + "/sources/" + text[1]);
			
			if (images.length > 0) {
				const image = __dirname + "/sources/" + text[1] + "/" + images[Math.floor(Math.random() * images.length)];
				CANVAS.loadImage(image).then(function(img) {
					ctx.fillStyle = "#000";
					ctx.fillRect(0,0,1920,1080);
					
					ctx.fillStyle = "#fff";
					ctx.font = "22px 'Crete Round'";
					ctx.textAlign = "center";
					ctx.textBaseline = "top";
					
					const rendered_text = "[ " + text[0] + " ]";
					ctx.fillText(rendered_text, 1920/2, (1080 + img.naturalHeight - TEXT_HEIGHT + PADDING)/2);
					ctx.drawImage(img, (1920 - img.naturalWidth)/2, (1080 - img.naturalHeight - TEXT_HEIGHT - PADDING)/2);
					
					const out = FS.createWriteStream("/home/massette/Pictures/bg.png");
					canvas.createPNGStream().pipe(out);
				});
			} else {
				ctx.fillStyle = "#000";
				ctx.fillRect(0,0,1920,1080);
				
				ctx.fillStyle = "#fff";
				ctx.font = "22px 'Crete Round'";
				ctx.textAlign = "center";
				ctx.textBaseline = "top";
				ctx.fillText("[ " + text[0] + " ]", 1920/2, 1080/2);
				
				const out = FS.createWriteStream("/home/massette/Pictures/bg.png");
				canvas.createPNGStream().pipe(out);
			}	
		} else {
			console.log("No source found.");
		}
	}
}
