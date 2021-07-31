class Logger {
	moduleName = 'Logger';
	
	log(m) {
		console.log(`%c[${this.moduleName} LOG]: ${m}`, 'color: cornflowerblue');
	}
	
	success(m) {
		console.log(`%c[${this.moduleName} SUCCESS]: ${m}`, 'color: lime');
	}
	
	error(m) {
		console.log(`%c[${this.moduleName} ERROR]: ${m}`, 'color: tomato');
	}
}


module.exports = { Logger };