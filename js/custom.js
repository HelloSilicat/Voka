/****** Global Variables *******/
var isPlay = false;
var vocList = [];
var meaningList = [];
var currentIndex = 0;
var totalIndex = 0;
var voc = "-";
var meaning = "-";
var timer;
/*******************************/

function shuffleList() {
	let index = -1;
	let length = vocList.length;
    let last_index = length - 1;
	let size = length;
     
    while (++index < size) {
    	var rand = index + Math.floor( Math.random() * (last_index - index + 1))
        let value = vocList[rand];
        vocList[rand] = vocList[index];
        vocList[index] = value;
		
		value = meaningList[rand];
		meaningList[rand] = meaningList[index];
		meaningList[index] = value;
    }
}


function update() {
    if (!isPlay) {
        $('#play_button').attr('class', 'glyphicon glyphicon-play');
        $('#meaning_div').css('visibility', 'visible');
    } else {
        $('#play_button').attr('class', 'glyphicon glyphicon-pause');
        $('#meaning_div').css('visibility', 'hidden');
    }

    $('#current_index').text(currentIndex);
    $('#total_index').text(totalIndex);

    voc = vocList[currentIndex - 1];
    meaning = meaningList[currentIndex - 1];
    $('#voc').text(voc);
    $('#meaning').text(meaning);
}

function onPlay() {
    isPlay = !isPlay;

    if (isPlay) {
        // setTimeout("mainLoop()", 1000);
	mainLoop();
    } else {
        clearTimeout(timer);
        if (currentIndex == 1) {
            currentIndex = totalIndex;
        } else {
            currentIndex--;
        }
        update();
        // currentIndex = currentIndex % totalIndex + 1;
    }
}

function mainLoop() {
    if (!isPlay) {
        return;
    }
	if (currentIndex == 1) {
		shuffleList();
	}
    update();
    timer = setTimeout("mainLoop()", 2000);
    currentIndex = currentIndex % totalIndex + 1;
}

function checkEncoding(base64Str) {
    let str = atob(base64Str.split(';base64,')[1])
    let encoding = jschardet.detect(str).encoding
    if (encoding === 'windows-1252') {
        encoding = 'ANSI'
    }
    return encoding
}

function loadList() {
    let request = new XMLHttpRequest();
    let url = "http://39.97.247.132:9991/test.csv";
    request.open('GET', url, true);
    request.responseType = 'blob';

    request.onload = () => {
        let file = request.response;
        let readerBs64 = new FileReader();
        readerBs64.readAsDataURL(file);

        readerBs64.onload = () => {
            let encoding = checkEncoding(readerBs64.result);
            let reader = new FileReader();
            if (encoding == 'GB2312') {
                reader.readAsText(file, 'gb2312');
            } else {
                reader.readAsText(file);
            }

            reader.onload = () => {
                Papa.parse(reader.result, {
                    complete: function(results) {
                        vocList = [];
                        meaningList = [];
                        for (var i = 0; i < results.data.length; i++) {
                            vocList.push(results.data[i][0]);
                            meaningList.push(results.data[i][1]);
                        }
                        // console.log(vocList);
                        // console.log(meaningList);
                        currentIndex = 1;
                        totalIndex = vocList.length;             
                        mainLoop();
                    }
                });

                
            }
        }
    }

    request.send();
}


$(window).load(function () {
    loadList();
}); 
