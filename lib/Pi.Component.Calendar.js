/*
	Info Generali: 
		Crea un calendario
	
	Dipendenze:
		Pi.JS ver 1.2 
	
	Attivazione:
		data-pic = calendar : {
			showToday : <true* / false>,
			year : <anno>,
			month : <mese>,
			lang : <"it"* / "en">,
			style : < "red" / "green" / "blue"* / "orange" / "purple" >,
			currentClass : < "red" / "green" / "blue"* / "orange" / "purple" / false >,
			eventClass : < "red" / "green" / "blue"* / "orange" / "purple" / false >,
			holidayClass : < "red" / "green" / "blue" / "orange"* / "purple" / false >,
			maxEvents : < 0 = no limit >,
			request : {
				Q : "nomechiamata",
				<nome variabile> : "valore variabile"
				<sono passate di default le variabili "Y" "M" "D">
			}
		}
	
	Estensioni aggiuntive:
		Evento giorno singolo:
			<div data-event=" <opzioni> "> Titolo + altre cose</div>
			
			data-event = "
				allDay : <true* / false>, // Se si tratta di giornata intera
				start :  "YYYY-MM-DD [HH:MM]", // data inizio evento. L'orario è opzionale. ES : "2016-05-13" / "2016-05-16 20:00"
				end : "YYYY-MM-DD [HH:MM]", // data fine evento. L'orario è opzionale ma se l'evento è "giornaliero" allora viene ignorato (il campo può essere omesso)
				link : <true / false*>, // Se impostato a true crea un link sull'evento che prenderà i campi input all'interno del DIV
				class : < "red" / "green" / "blue" / "orange" / "purple" / false >, //classe css dell'evento (diversa dal default),
				icon : "mdi-calendar" // nome dell'icona mdi da mettere ... se metti null l'icona viene omessa
			"
	
	Esempio : 
		<div data-pic="calendar : { year : 2016, month : 5, request : { Q : 'Win_Show_All_Day' }}">
			<div data-event=" fullday: true, start:'2016-05-18', link:true"> 
				<input type="hidden" name="Q" value="Win_dett_event"> 
				<input type="hidden" name="id" value="<id dell'evento>"> 
				Ciao mondo 
			</div>
		</div>
*/

pi.component.register('calendar',function(obj,settings){
	
	var iCal = obj;
	var iEvents = iCal.find('[data-event]');
	var defSettings = {
		showToday : true,
		year : null,
		month : null,
		lang : "it",
		style : "blue",
		currentClass : "blue",
		eventClass : "blue",
		holidayClass : "orange",
		maxEvents : 0,
		request : null
	}
	
	var CalendarId = 'Cal_' + Date.now().toString() + Math.random().toString().substr(2,4);
	
	var cfg = $.extend(null,defSettings,settings);
	
	cfg.month--;
	
	var lang = {
		it : {
			week : ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'],
			weekShort : ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'],
			month : ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
			monthShort : ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'],
			events : 'Eventi'
		},
		en : {
			week : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
			weekShort : ['Sun','Mon','Tue','Wen','Thu','Fri','Sat'],
			month : ["January","February","March","April","May","June","July","August","September","October","November","December"],
			monthShort : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
			events : 'Events'
		}
	}
	
	var tNow = new Date();
	var Today = new Date();
	var dayIdx = 1;
	
	tNow.setDate(1);
	tNow.setFullYear(cfg.year);
	tNow.setMonth(cfg.month);
	
	var monthTo
	
	tNow.setMonth(cfg.month + 1);
	monthTo = tNow.getMonth();
	tNow.setFullYear(cfg.year);
	tNow.setMonth(cfg.month);
	
	dayIdx = tNow.getDay() == 0 ? -5 : 2 - tNow.getDay();
	
	var hCalendar = $('<table></table>');
	hCalendar.addClass('calendar');
	hCalendar.addClass('bold');
	hCalendar.addClass('fix');
	hCalendar.addClass(cfg.style);
	hCalendar.addClass('nohover');
	
	var row = $('<tr></tr>');
	var cell;
	var myId = '';
	for(var i = 0; i<7; i++){
		cell = $('<th></th>');
		cell.html(lang[cfg.lang].week[i == 6 ? 0 : i+1]);
		row.append(cell);
	}
	
	tNow.setDate(dayIdx);
	
	while(tNow.getMonth() != monthTo){
		if(tNow.getDay() == 1){
			hCalendar.append(row)
			row = $('<tr></tr>');
		}
		cell = $('<td></td>');
		cell.append($('<div></div>').addClass('day').html(tNow.getDate()));
		myId = CalendarId + '_' + tNow.getFullYear() + ('0'+(tNow.getMonth() + 1).toString() ).slice(-2) + ('0'+tNow.getDate()).slice(-2);
		cell.attr('id',myId);
		if(tNow.getMonth() != cfg.month){
			cell.addClass('nomonth');
		}else{
			
			if(tNow.getDay() == 6 || tNow.getDay() == 0){
				cell.addClass(cfg.holidayClass);
			}else{
				cell.addClass(cfg.eventClass);
			}
			
			if((tNow.getDate() == Today.getDate()) && (tNow.getMonth() == Today.getMonth()) ){
				cell.addClass('thisday');
			}
			
		}
		
		if(cfg.request != null){
			cell.attr('onclick','pi.request(this.id)');
			cell.append($('<input type="hidden" name="Q">').val(cfg.request.Q));
			cell.append($('<input type="hidden" name="Y">').val(tNow.getFullYear()));
			cell.append($('<input type="hidden" name="M">').val(tNow.getMonth() + 1));
			cell.append($('<input type="hidden" name="D">').val(tNow.getDate()));
			cell.attr('style','cursor:pointer');
			var keys = Object.keys(cfg.request);
			for(var i in keys){
				if(keys[i]!='Q'){
					cell.append($('<input type="hidden" name="' + keys[i] + '">').val(cfg.request[keys[i]]));
				}
			}
		}
		
		row.append(cell);
		dayIdx++;
		tNow.setDate(1);
		tNow.setFullYear(cfg.year);
		tNow.setMonth(cfg.month);
		tNow.setDate(dayIdx);
	}
	
	while(tNow.getDay() != 1){
		cell = $('<td></td>');
		myId = CalendarId + '_' + tNow.getFullYear() + ('0'+(tNow.getMonth() + 1).toString() ).slice(-2) + ('0'+tNow.getDate()).slice(-2);
		cell.attr('id',myId);
		cell.addClass('nomonth');
		cell.append($('<div></div>').addClass('day').html(tNow.getDate()));
		
		if(cfg.request != null){
			cell.attr('onclick','pi.request(this.id)');
			cell.append($('<input type="hidden" name="Q">').val(cfg.request.Q));
			cell.append($('<input type="hidden" name="Y">').val(tNow.getFullYear()));
			cell.append($('<input type="hidden" name="M">').val(tNow.getMonth() + 1));
			cell.append($('<input type="hidden" name="D">').val(tNow.getDate()));
			cell.attr('style','cursor:pointer');
			var keys = Object.keys(cfg.request);
			for(var i in keys){
				if(keys[i]!='Q'){
					cell.append($('<input type="hidden" name="' + keys[i] + '">').val(cfg.request[keys[i]]));
				}
			}
		}
		
		row.append(cell);
		dayIdx++;
		tNow.setDate(1);
		tNow.setFullYear(cfg.year);
		tNow.setMonth(cfg.month);
		tNow.setDate(dayIdx);
	}
	hCalendar.append(row);
	
	var eSettings;
	var datepart;
	var eventCounts = [];
	var eventId;
	for(var i = 0; i < iEvents.length; i++){
		eSettings = eval('({'+iEvents[i].getAttribute('data-event')+'})');
		cell = $('<div></div>').addClass('event')
		if(eSettings.icon !== null){
			cell.html('<i class="mdi ' + (eSettings.icon || 'mdi-calendar') + '"></i>' + iEvents[i].innerHTML);
		}else{
			cell.html(iEvents[i].innerHTML);
		}
		datepart = eSettings.start.split(' ')[0].split('-');
		cell.addClass(eSettings.class || cfg.eventClass)
		eventId = CalendarId + '_' + datepart[0] + ('0'+datepart[1]).slice(-2) + ('0'+datepart[2]).slice(-2);
		eventCounts[eventId] = ( eventCounts[eventId] || 0 ) + 1;
		// Ribalto il tag "style" in modo da poter fare tutto il "casino" mi pare
		if (iEvents[i].getAttribute('style')){
			cell.attr('style',iEvents[i].getAttribute('style'));
		}
		if((eventCounts[eventId] > cfg.maxEvents) && (cfg.maxEvents > 0)){
			var countEvents = hCalendar.find('#' + eventId + ' .countEvents');
			if(countEvents.length == 0){
				countEvents = $('<div></div>').addClass('countEvents');
				hCalendar.find('#' + eventId).append(countEvents);
			}
			countEvents.html( '<b>+' + (eventCounts[eventId] - cfg.maxEvents) + '</b> ' +lang[cfg.lang].events);
		}else{
			hCalendar.find('#' + eventId).append(cell);
		}
		//hCalendar.find('#' + CalendarId + '_' + datepart.join('')).append(cell);
	}

	iCal.html('');
	iCal.append(hCalendar);
});