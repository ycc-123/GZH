export default function (canvas, width, height, actions, resources) {
	canvas.width = width;
	canvas.height = height;
	let context = canvas.getContext('2d');
	let resLoad = Object.keys(resources).map((key) => {
		if (!resources[key]) return Promise.resolve();
		if (typeof resources[key].then == 'function') {
			return resources[key].then((src) => {
				return new Promise((resolve, reject) => {
					let image = new Image;
					image.onload = () => ((resources[key] = image), resolve());
					image.onerror = reject;
					image.src = src;
				});
			});
		}
		return new Promise((resolve, reject) => {
			let image = new Image;
			image.onload = () => ((resources[key] = image), resolve());
			image.onerror = reject;
			image.src = resources[key];
		});
	});

	return Promise.all(resLoad).then(() => {
		context.textAlign = 'left';
		context.textBaseline = 'top';
		actions.forEach((args) => {
			let action = args.shift();
			if (action == 'roundRect') {
				context.beginPath();
				let bottom = args[1] + args[3];
				let right = args[0] + args[2];
				context.moveTo(args[0] + args[4], args[1]);
				context.arcTo(right, args[1], right, args[1] + args[4], args[4]);
				context.arcTo(right, bottom, right - args[4], bottom, args[4]);
				context.arcTo(args[0], bottom, args[0], bottom - args[4], args[4]);
				context.arcTo(args[0], args[1], args[0] + args[4], args[1], args[4]);
				context.closePath();
			} else if (action == 'qrcode') {
				qrcode.encode(args[0]).draw(context, args[1], args[2], args[3], args[4]);
			} else if (action == 'text') {
				let x = 0;
				let y = 0;
				let ewidth = context.measureText('...').width;
				let values = args[0].split('');
				for (let i = 0, l = values.length; i < l; i++) {
					let width = context.measureText(values[i]).width;
					if (args[5] && y == args[5] - 1 && x + width + ewidth > args[3]) {
						context.fillText('...', args[1] + x, args[2] + y * args[4]);
						break;
					} else if (x + width > args[3]) {
						context.fillText(values[i], args[1] + (x = 0), args[2] + ++y * args[4]);
					} else {
						context.fillText(values[i], args[1] + x, args[2] + y * args[4]);
					}
					x += width;
				}
			} else if (typeof context[action] == 'function') {
				if (action == 'drawImage') {
					args[0] = resources[args[0]];
					if (!args[0]) return;
				}
				if (action == 'arc') {
					args[3] = args[3] ? (args[3] * Math.PI) / 180 : 0;
					args[4] = args[4] ? (args[4] * Math.PI) / 180 : 0;
				}
				context[action].apply(context, args);
			} else {
				context[action] = args[0];
			}
		});
	});
}
