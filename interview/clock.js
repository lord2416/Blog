function Clock(opt){
	this.opt = opt;
	this.interval = null;
}

Clock.prototype.init = function(){
    var self = this,
	    timer = self.opt.timer || 5000,
	    cb = self.opt.cb || function(){
	        console.log('cb');
	    };

    self.setIntervalTask(timer, cb);
}

Clock.prototype.compare = function(){
	var self = this, 
	    now = self.getDate(),
		date =  {
			...now,
			...self.opt.date,
		};
		result = false;
	console.log(now);
	console.log(date);	
	
	if(
		(now.year > date.year) ||
		(now.year === date.year && now.month > date.month) ||
		(now.year === date.year && now.month === date.month && now.day > date.day) ||
		(now.year === date.year && now.month === date.month && now.day === date.day && now.hour > date.hour) ||
		(now.year === date.year && now.month === date.month && now.day === date.day && now.hour === date.hour && now.minute > date.minute) ||
		(now.year === date.year && now.month === date.month && now.day === date.day && now.hour === date.hour && now.minute === date.minute && now.second > date.second)
	){
		result = true;
	}
	console.group('result');
	console.log(`now: ${now.year}-${now.month}-${now.day} ${now.hour}:${now.minute}:${now.second}, expected: ${date.year}-${date.month}-${date.day} ${date.hour}:${date.minute}:${date.second}, result:${result}`);
	console.groupEnd('result');
	return result;
}

Clock.prototype.getDate = function(){
	var now = new Date(),
		year = now.getFullYear(),
		month = now.getMonth(),
		day = now.getDate(),
		hour = now.getHours(),
		minute = now.getMinutes(),
		second = now.getSeconds();
		
	return {
		year: year,
		month: month,
		day: day,
		hour: hour,
		minute: minute,
		second: second,
	}	
}

Clock.prototype.setIntervalTask = function(timer, cb){
	var self = this;
	this.interval = setInterval(function(){
		var result = self.compare();
		if(result){
			if(cb && typeof cb === 'function') cb();
			self.clear();
			console.log('tick tock!');
		}
	}, timer);
}

Clock.prototype.clear = function(){
    var self = this;
	clearInterval(this.interval);
	self.interval = null;
}

var clock = new Clock({
    date: {
        hour: 18,
        minute: 05,
        second: 19,
    },
    cb: function(){
    },
    timer: 10*1000,
});

clock.init();
console.log(clock);