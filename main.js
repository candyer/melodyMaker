
let context = new AudioContext();
let frequency = [1175, 1109, 1047, 987.8, 932.3, 880.0, 830.6, 784.0, 740.0, 698.5, 659.3, 622.3, 587.3, 554.4, 523.3, 493.9]
let pause = document.querySelector('.pause');
let wave_type = document.querySelector('.wave_type');

let checking = [];
let count = 16;
let os = [];
let gs = [];
for (let i = 0; i < count; i++) {
	let o = context.createOscillator();
	let g = context.createGain();
	o.start();
	o.connect(g);
	os.push(o);
	gs.push(g);
}

let board = document.querySelector('.board');
for (let i = 0; i < count; i++) {
	let row = document.createElement('div');
	row.className = `row${i}`;
	board.appendChild(row);
	for (let j = 0; j < count; j++){
		let col = document.createElement('button');
		col.className = `col col${i * count + j}`;
		row.appendChild(col);	
	}
}

function scroll(n) {
	unHighlight((count + n - 1) % count);
	highlight(n, 'activate');
	highlight((count + n - 1) % count, 'trail1');
	highlight((count + n - 2) % count, 'trail2');
	highlight((count + n - 3) % count, 'trail3');
	highlight((count + n - 4) % count, 'trail4');
	highlight((count + n - 5) % count, 'trail5');

	beep();
	setTimeout(
		function() { scroll((n + 1) % count) }, pause.value);
}
scroll(0);

function highlight(n, class_name) {
	let row = document.querySelector(`.row${n}`);
	let cols = row.querySelectorAll('.col');
	cols.forEach(col => col.classList.add(class_name)); 
}

function removeTail(n) {
	document.querySelectorAll(`.trail${n}`).forEach(el => el.classList.remove(`trail${n}`));
}

function unHighlight(n) {
	let row = document.querySelector(`.row${n}`);
	let cols = row.querySelectorAll('.col');
	cols.forEach(col => col.classList.remove('activate'));

	removeTail(1);
	removeTail(2);
	removeTail(3);
	removeTail(4);
	removeTail(5);

	cols.forEach(function(col, i){
		if (col.className.includes('checked')) {
			gs[i].disconnect(context.destination);
		}});
}

function beep() {
	let activated = document.querySelectorAll('.activate');
	activated.forEach(function(activ, i) {
		if (activ.className.includes('checked')) {
			let effect = activ.animate([
				{transform: 'scale(1.0)'},
				{transform: 'scale(1.2)'},
				{transform: 'scale(1.4)'},
				{transform: 'scale(1.2)'}
				], 500);
				effect.addEventListener('finish', function() {
					activ.style.transform = 'scale(1.0)';
				});
			os[i].frequency.value = parseFloat(frequency[i]);
			os[i].type = wave_type.value;
			gs[i].connect(context.destination);
		}});	
}

function uncheckAll() {
	checking.forEach(function(check) {
		gs[check].disconnect(context.disconnect);
	})
	let checked = document.querySelectorAll('.checked');
	checked.forEach(check => check.classList.remove('checked'));
}

function handleCheck(e) {
	let button = document.querySelector(`.${e.target.classList[1]}`);
	let c = `${e.target.classList[1].slice(3)}`;

	if (button.className.includes('activate')) {
		button.click(false);
	}

	if (button.className.includes('checked')){
		button.classList.remove('checked');
		let index = checking.indexOf(c);
		checking.splice(index, 1);
	} else {
		let idx = parseInt(c) % count; 
		button.classList.add('checked');
		checking.push(idx);
	}
}

document.querySelectorAll('.col').forEach(col => col.addEventListener('click', handleCheck));



