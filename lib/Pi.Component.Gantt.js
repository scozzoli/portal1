/*
    Info generali: 
        Crea un grafico basilare di tipo Gantt

    Dipendenze:
		Pi.JS ver 1.2
    
    Attivazione:
        data-pic = gantt : {
            start: 'YYYY-MM-DD',
            end: 'YYYY-MM-DD',
            showToday: true* / false,
            holidayClass: < classe css * red >,
            showHolday: true* / false,
            specialDates: ['YYYY-MM-DD','YYYY-MM-DD'],
            specialDatesClass: < classe css * purple >,
            taskClass: < classe css * purple >,
            fullMonth: true* / false
        }
    
    Elementi interni:
        <c-line title="titolo" onclick="javascritp sul click" id="id">
            <c-title>html del titolo (se omesso prende il tag "title")</c-title>
            <c-task 
                id="<nome>" 
                onclick="javascript sul click"
                start="YYYY-MM-DD" 
                end="YYYY-MM-DD",
                class="<classe css>">
                descrizione in HTML 
            </c-task>
        </c-line>

    Esempio:
        <div data-pic="gantt : {start : '2017-01-01'}">
            <c-line title="catico 5555">
                <c-title>Carico 55<b>55</b></c-title>
                <c-task id="10256" start="2017-01-05" end="2017-01-10" class="blue">
                    Ciao mondo : <b> 10256 </b>
                </c-task>
                <c-task id="10" start="2017-01-05" end="2017-01-10" class="blue">
                    Ciao mondo : <b> 10256 </b>
                </c-task>
            </c-line>
        </div>
*/

/* global pi */

pi.component.register('gantt',function(obj,settings){
    var defaults = {
        showToday:true,
        holidayClass: 'orange',
        showHolday: true,
        specialDatesClass: 'purple',
        taskClass: false,
        lang: 'i18n',
        fullMonth: true,
        legendSize: 0
    }

    var _month = {
        i18n : ['<i18n>month:jan</i18n>','<i18n>month:feb</i18n>','<i18n>month:mar</i18n>','<i18n>month:apr</i18n>','<i18n>month:may</i18n>','<i18n>month:jun</i18n>','<i18n>month:jul</i18n>','<i18n>month:aug</i18n>','<i18n>month:set</i18n>','<i18n>month:oct</i18n>','<i18n>month:nov</i18n>','<i18n>month:dec</i18n>'],
        it : ['Gennatio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']
    }

    var cfg = $.extend(null, defaults, settings || {});
    //var tasksElem = obj.find('task');
    var tasksElem;
    var linesElem = obj.find('c-line');
    var lines = [];

    var tasks = [];
    var dataStart,dataEnd;
    var constToDay = 24 * 60 * 60 * 1000; //per trasformare le date in giorni hh * min * sec * msec
    var item;

    for(var i = 0 ; i <linesElem.length; i++ ){
        item = {
            id: linesElem[i].getAttribute('id'),
            click: linesElem[i].getAttribute('onclick'),
            html: linesElem[i].getAttribute('title'),
            title: linesElem[i].getAttribute('title'),
            tasks: []
        }

        if($(linesElem[i]).find('c-title').length == 1){
            item.html = $(linesElem[i]).find('c-title')[0].innerHTML;
        }

        tasksElem = $(linesElem[i]).find('c-task');

        for(var k = 0; k < tasksElem.length; k++){
            item.tasks.push({
                start : new Date(tasksElem[k].getAttribute('start')),
                end : new Date(tasksElem[k].getAttribute('end') || tasksElem[k].getAttribute('start') ),
                id : tasksElem[k].getAttribute('id'),
                class : tasksElem[k].getAttribute('class') || cfg.taskClass,
                html : tasksElem[k].innerHTML,
                click : tasksElem[k].getAttribute('onclick')
            });

            if((dataStart || item.tasks[k].start) >= item.tasks[k].start){
                dataStart = item.tasks[k].start;
            }

            if((dataEnd || item.tasks[k].end) <= item.tasks[k].end){
                dataEnd = item.tasks[k].end;
            }
        }

        lines.push(item);
    }
    /*
    for(var i = 0 ; i < tasksElem.length; i++){
        item = {
            start : new Date(tasksElem[i].getAttribute('start')),
            end : new Date(tasksElem[i].getAttribute('end')),
            id : tasksElem[i].getAttribute('id'),
            class : tasksElem[i].getAttribute('class') || cfg.taskClass,
            html : tasksElem[i].innerHTML
        }

        if((dataStart || item.start) >= item.start){
            dataStart = item.start;
        }

        if((dataEnd || item.end) <= item.end){
            dataEnd = item.end;
        }

        tasks.push(item);
    }
    */
    // Se mi sono state passate le date da configurazione, allora faccio l'ovveride di quelle calcolate
    if(cfg.start){ dataStart = new Date(cfg.start); }
    if(cfg.end){ dataEnd = new Date(cfg.end); }
    if(cfg.fullMonth){
        dataStart = new Date(dataStart.getFullYear(),dataStart.getMonth(),1);
        dataEnd = new Date(dataEnd.getFullYear(),dataEnd.getMonth()+1,0);
    }

    var maxCell = Math.round((dataEnd - dataStart) / constToDay);
    
    // Struttura a lista
    var dayRow = '';
    var headerDayRow = '';
    var headerMonthRow = '';
    var currentMonth = dataStart.getMonth();
    var dayOfMonth = 0;
    var today = new Date();

    for(var i = 0; i <= maxCell; i++ ){
        now = new Date(dataStart.getFullYear(), dataStart.getMonth(), dataStart.getDate() + i);
        var style = now.getDay() % 6 ? '' : 'class="'+cfg.holidayClass+'"';
        
        if(cfg.showToday && (today.toDateString() == now.toDateString())){
            style = 'class="blue"';
        }
        headerDayRow += '<li '+style+'> '+now.getDate()+' </li>';
        dayRow += '<li '+style+'></li>';

        if(currentMonth != now.getMonth()){
            headerMonthRow += '<li class="length-'+dayOfMonth+'"> '+_month[cfg.lang][currentMonth]+' </li>';
            dayOfMonth = 0;
            currentMonth = now.getMonth();
        }
        dayOfMonth++;
    }

    headerMonthRow += '<li class="length-'+dayOfMonth+'"> '+_month[cfg.lang][currentMonth]+' </li>';
    var elem = $('<div></div>');
    elem.addClass('pi-chart');
    elem.append($('<ul class="pi-month">'+headerMonthRow+'</ul>'));
    elem.append($('<ul class="pi-days">'+headerDayRow+'</ul>'));

    var rowTaskElem, taskElem, offset, width, legend;

    var legendElem = $('<div></div>');
    legendElem.addClass('pi-legend');
    legendElem.append($('<div class="pi-legend-header"></div>'));
    
    for(i = 0; i < lines.length; i++){
        
        rowTaskElem = $('<ul class="pi-days pi-taskRow">'+dayRow+'</ul>');

        if(cfg.legendSize){
            legend = $('<div></div>');
            legend.addClass('pi-legend-voice');
            legend.addClass('pi-line');
            legend.html(lines[i].html);
            legend.attr('title',lines[i].title);
            legend.attr('id',lines[i].id);

            if(lines[i].click){
                legend.attr('onClick',lines[i].click);
                legend.addClass('pi-link');
            }

            legendElem.append(legend);
        }

        for(k = 0; k < lines[i].tasks.length; k++){
            item = lines[i].tasks[k];
            taskElem = $('<span class="pi-task"></span>');

            // normalizzo le date dei task per visualizzarle nei limiti del gantt
            if(item.dataStart < dataStart){ item.dataStart = dataStart; }
            if(item.dataEnd > dataEnd) { item.dataEnd = dataEnd; }

            offset = (26 * Math.round((item.start - dataStart) / constToDay)) + 3; 
            width = 26 * Math.round(((item.end - item.start) / constToDay) + 1 ) - 7; 

            taskElem.css('left', offset + 'px');
            taskElem.css('width', width + 'px');
            taskElem.html(item.html);
            taskElem.addClass('pi-line');
            
            if(item.click){
                taskElem.attr('onClick', item.click);
                taskElem.addClass('pi-link');
            }

            if(item.class) taskElem.addClass(item.class);

            rowTaskElem.append(taskElem);
        }
        elem.append(rowTaskElem);
    }

/*
    for(i = 0; i< tasks.length; i++){
        item = tasks[i];
        taskElem = $('<span class="pi-task"></span>');
        offset = (26 * Math.round((item.start - dataStart) / constToDay)) + 4; 
        width = 26 * Math.round((item.end - item.start) / constToDay) - 6; 

        taskElem.css('left', offset + 'px');
        taskElem.css('width', width + 'px');
        taskElem.html(item.html);
        taskElem.addClass('pi-line');
        if(item.class) taskElem.addClass(item.class);

        if(cfg.legendSize){
            legend = $('<div></div>');
            legend.addClass('pi-legend-voice');
            legend.addClass('pi-line');
            legend.html(item.html);
            legend.attr('title',item.html);
            legendElem.append(legend);
        }

        //legend = cfg.legendSize ? '<li style="width:'+cfg.legendSize+'px" class="pi-legend pi-line">'+item.html+'</li>': '';

        rowTaskElem = $('<ul class="pi-days pi-taskRow">'+dayRow+'</ul>');
        rowTaskElem.append(taskElem);
        elem.append(rowTaskElem);
        
    }
*/
    // sono da disegnare i task

    // svuoto l'elemento principale e rimpiazzo il contenuto con il nuovo elemento

    var GanttElem = $('<div></div>');
    
    GanttElem.addClass('pi-gantt');
    if(cfg.legendSize){ 
        legendElem.css('width',cfg.legendSize);
        GanttElem.append(legendElem);
        elem.css('width','calc( 100% - '+cfg.legendSize+'px )');
    }
    GanttElem.append(elem);

    obj.empty();
    obj.append(GanttElem);

    // Abilito il drag 
    var ElemToDrag = elem;
    var dragCurDown = false;
    var dragLastPos = [];
    var dragPosition = [];
    var dragDiff = [];

    ElemToDrag.on('mousedown',e => { 
        if(!dragCurDown){
            dragCurDown = true;
            dragLastPos = [e.clientX, e.clientY];
        }
    });
    ElemToDrag.on('mousemove',e => {
        if(dragCurDown){
            dragPosition = [e.clientX, e.clientY];
            dragDiff = [(dragPosition[0] - dragLastPos[0]), (dragPosition[1] - dragLastPos[1])];
            ElemToDrag.scrollLeft( ElemToDrag.scrollLeft() - dragDiff[0]);
            //ElemToDrag.scrollTop( ElemToDrag.scrollTop() - dragDiff[1]);
            dragLastPos = [e.clientX, e.clientY];
        }
    });
    ElemToDrag.on('mouseup', e => { dragCurDown = false;});
    //ElemToDrag.on('mouseout', e => { dragCurDown = false; console.log('[>> Out]');});
});