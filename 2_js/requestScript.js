//-requestjs객체(리팩토링 필)
var requestjs = {

    ajax: function (method, URL, callback, async) {
        var xhr = new XMLHttpRequest();

        if (method.toUpperCase() === 'GET') {
            method = 'GET';
            xhr.open(method, URL, async);
            xhr.send();
        }else if (method.toUpperCase() === 'POST') {
            method = 'POST';
            parsingURL = URL.split('?');
            xhr.open(method, parsingURL[0], async);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(parsingURL[1]);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(xhr.response);
                    return xhr.status;
                } else {
                    document.write('<div align="center"><h1>Sorry</h1><BR><h3>요청하신 페이지를 찾을 수 없습니다.<BR>잠시 후 다시 시도해 주세요</h3><h3>Please try again later.<BR>The requested page was not found</h3></div>');
                    return xhr.status;
                }
            }else{
                return xhr.readyState;
            }
        };
    },
};

//-loadingjs객체(리팩토링 완): innertext 대체&추가, 정지&로딩바제거, 
var loadingjs = {

//interval 주소값 저장 배열
    intervalAddr: [],
//tag HTML값 복원을 위한 오브젝트
    recoveryTagAddr: {},
    loadingPackage: ['-','\\','\|','\/'],

    insert: function (tagName) {
        var tagContents = document.querySelector(tagName);
        var count = 0;

        var localAddr = setInterval(function() {
            try {
                if (count === 3) {
                    tagContents.innerText = loadingjs.loadingPackage[3];
                    count = 0;
                    //태그의 innertext를 loadingPackage로 교체
                    //count값이 3일 때만 count초기화
                }else{
                    tagContents.innerText = loadingjs.loadingPackage[count];
                    count++;
                }
            } catch (error) {
                clearInterval(localAddr);
                var addrIndex = loadingjs.intervalAddr.indexOf(localAddr);
                loadingjs.intervalAddr.splice(addrIndex, 1);
            }
        }, 100);

        loadingjs.recoveryTagAddr[tagName] = tagContents.innerHTML;
        loadingjs.intervalAddr.push(localAddr);
    },
    plus: function (tagName) {
        var tagContents = document.querySelector(tagName);
        var textLength = document.querySelector(tagName).innerHTML;//호출 당시 최초 길이
        var count = 0;
        
        //count가 0일때는 바로 삽입
        //0이 아닐때는 innerText내용을 복원한 뒤
        //맨 뒤 한글자만 substr로 걸러내서 교체
        var localAddr = setInterval(function() {
            try {
                
                if (count === 0 && tagContents.innerHTML.length === textLength.length) {
                    tagContents.innerHTML += loadingjs.loadingPackage[count];
                    count++;
                }else if(count === 0 && tagContents.innerHTML.length != textLength.length){
                    tagContents.innerHTML = textLength.substr(0, textLength.length);
                    tagContents.innerHTML += loadingjs.loadingPackage[count];
                    count++;
                }else if(count === 3){
                    tagContents.innerHTML = textLength.substr(0, textLength.length);
                    tagContents.innerHTML += loadingjs.loadingPackage[3];
                    count = 0;
                }else{
                    tagContents.innerHTML = textLength.substr(0, textLength.length);
                    tagContents.innerHTML += loadingjs.loadingPackage[count];
                    count++;
                }
            } catch (error) {
                clearInterval(localAddr);
                var addrIndex = loadingjs.intervalAddr.indexOf(localAddr);
                loadingjs.intervalAddr.splice(addrIndex, 1);
                console.log('here');
            }
        }, 100);
        loadingjs.intervalAddr.push(localAddr);
    },
    stop: function () {
        for (var index = 0; index < loadingjs.intervalAddr.length; index++) {
            clearInterval(loadingjs.intervalAddr[index]);
        }
        loadingjs.intervalAddr = [];

        for (var key in loadingjs.recoveryTagAddr) {
            if (loadingjs.recoveryTagAddr.hasOwnProperty(key)) {
                document.querySelector(key).innerHTML = loadingjs.recoveryTagAddr[key];
            }
        }
        loadingjs.recoveryTagAddr = {};
        // document.querySelector(key).innerHTML.slice(0,-1);
    },
};

//-navjs객체(리팩토링 완): 생성, 닫기
var navjs = {

    active: function (title, contents) {
        nav = document.createElement('nav');
        navTitle = document.createElement('div');
        navContents = document.createElement('div');
        
        nav.className = 'z-index-100';
        navTitle.className = 'nav-title';
        navContents.className = 'nav-contents';

        nav.appendChild(navTitle);
        nav.appendChild(navContents);
        document.body.appendChild(nav);
        navTitle.innerHTML = title;
        // loadingjs 삽입
        loadingjs.plus('.nav-title');
        new Textjs.insertText('.nav-contents', contents, 10);
        
    },
    inactive: function () {
        loadingjs.stop();
        var navs = document.querySelectorAll('nav');
        for (var i = 0; i < navs.length; i++) {
            document.body.removeChild(navs[i]);
        }
        // navs.forEach(function(nav) {
        //     document.body.removeChild(nav);
        // });
    }
};

//-navjs객체(리팩토링 완): 생성, 닫기, 드래그
// new키워드를 통한 새로운 오브젝트 생성의 필요가 없음
var modaljs = {
    
    create: function (titvarext, contentsText) {
        
        var container = document.createElement('div');
        var header = document.createElement('div');
        var title = document.createElement('div');
        var close = document.createElement('a');
        var contents = document.createElement('div');

        container.className = 'header-modal header-modal-component flex';
            container.appendChild(header);
            container.appendChild(contents);
        
        header.className = 'header-modal header-modal-title';
            title.className = 'msg-warning';
            header.appendChild(title);
            header.appendChild(close);
            close.className = 'header-modal-title-close';
            close.setAttribute('href','javascript:;');
            close.innerHTML = '&times';

        contents.className = 'header-modal header-modal-contents';


        title.innerHTML = titvarext;
        contents.innerHTML = contentsText;
        
        document.body.appendChild(container);

        close.addEventListener('click',modaljs.close);
        modaljs.dragElement(container);
    },
    
    close: function () {
        if (this.parentNode.parentNode != null) {
            document.body.removeChild(this.parentNode.parentNode);
                // document.querySelector('.header-modal'));
        }
    },

    //w3s 인용
    //출처 : https://www.w3schools.com/howto/howto_js_draggable.asp
    dragElement: function (element) {

        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        if (this.titleContainer) {
            this.titleContainer.onmousedown = dragMouseDown;
        } else {
            element.onmousedown = dragMouseDown;
        }

        function dragMouseDown(event) {
            event = event || window.event;
            event.preventDefault();
            pos3 = event.clientX;
            pos4 = event.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(event) {
            event = event || window.event;
            event.preventDefault();
            pos1 = pos3 - event.clientX;
            pos2 = pos4 - event.clientY;
            pos3 = event.clientX;
            pos4 = event.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }

    }
};

//-wrapjs객체(리팩토링 완): 틀만 생성(세부컨텐츠는 별도로 스크립트 구성 필요), wrap 더하기, wrap 초기화
var wrapjs = {
    
    bodyContainer : document.querySelector('#bodyContainer'),
    wrap : document.querySelector('.wrap'),

    add: function (titleHTML, contentsHTML) {
        var container = new wrapjs.console(titleHTML, contentsHTML);
        wrapjs.wrap.appendChild(container);
    },
    reset: function (titleHTML, contentsHTML) {
        wrapjs.wrap.innerText='';

        var container = new wrapjs.console(titleHTML, contentsHTML);
        wrapjs.wrap.appendChild(container);
    },
    console: function (titleHTML, contentsHTML) {
        var container = document.createElement('div');
        var header = document.createElement('div');
        var title = document.createElement('div');
        var icon = document.createElement('img');
        var btn1 = document.createElement('div');
        var btn2 = document.createElement('div');
        var square = document.createElement('span');
        var btn3 = document.createElement('div');
        var mainConsole = document.createElement('div');

        container.className = 'command';
        header.className = 'command-header';
        title.className = 'command-title';
        icon.src = '/4_img/cmdicon.png';
        btn1.className = 'command-btn';
        btn1.innerHTML = '&minus;';
        btn2.className = 'command-btn command-btn-squre';
        btn3.className = 'command-btn command-btn-close';
        btn2.appendChild(square);
        btn3.innerHTML = '&times;';
        mainConsole.id = 'mainConsole';
        mainConsole.className = 'console-black';

        container.appendChild(header);
        header.appendChild(title);
        title.appendChild(icon);
        title.innerHTML += titleHTML;
        header.appendChild(btn1);
        header.appendChild(btn2);
        header.appendChild(btn3);
        container.appendChild(mainConsole);

        mainConsole.innerHTML = contentsHTML;

        return container;
    }
};

//-Textjs객체 문자열을 character로 변환하여 한 자씩 interval로 반복해가며 삽입
var Textjs = {
    
    insertText: function (tagName, insertTextValue, interval) {
        
        var frontSpan = document.createElement('span');
        var backSpan = document.createElement('span');
        backSpan.className = 'input-character';
        document.querySelector(tagName).appendChild(frontSpan);
        document.querySelector(tagName).appendChild(backSpan);
        
        var timeCount = true;
        var loopCount = 0;
        var intervalAddr = setInterval(function() {
            try {
                
                var character = insertTextValue.charAt(loopCount);

                if (insertTextValue.length === loopCount) {
                    throw 'go catch';

                }else if(character === '/'){
                    frontSpan.innerHTML += '<BR>';
                    timeCount = true;
                    loopCount++;

                }else if(timeCount === true){
                    backSpan.innerHTML = insertTextValue.charAt(loopCount);
                    timeCount = false;
                    
                }else {
                    frontSpan.innerHTML += backSpan.innerHTML;
                    backSpan.innerHTML = '';
                    timeCount = true;
                    loopCount++;
                    
                }

            } catch (error) {
                clearInterval(intervalAddr);
                intervalAddr = null;
            }
        }, interval);
    },

    insertTextLine : function (params) {
        
    }
};

//-headerjs객체 헤더로고 움직임, aside바 닫힘, headercontents 투명 조절
var headerjs = {
    header: document.querySelector('header'),
    aside: document.querySelector('aside'),
    headerLogo: document.querySelector('#headerLogo'),
    headereye: document.querySelector('.header-eye'),
    headerNav: document.querySelector('#headerContents'),
    
    AsideFocus: function (event) {

        headerjs.headereye.classList.toggle('opacity-1');
        headerjs.headereye.classList.toggle('z-index-100');
       
        var asideChilden = headerjs.aside.querySelectorAll('aside>*');

        headerjs.aside.classList.toggle('aside-focus');

        for (var index = 0; index < asideChilden.length; index++) {
            asideChilden[index].classList.toggle('opacity-1');
        }
        
    },
    RemoveAsideFocus: function (event) {
        headerjs.headereye.classList.remove('opacity-1');
        headerjs.headereye.classList.remove('z-index-100');
       
        var asideChilden = headerjs.aside.querySelectorAll('aside>*');

        headerjs.aside.classList.remove('aside-focus');

        for (var index = 0; index < asideChilden.length; index++) {
            asideChilden[index].classList.remove('opacity-1');
        }
    },

    MouseXY: function (event){

        var pupil = headerjs.header.querySelector('.header-eye-pupil');
// eyelidInfo의 getBoundingClientRect()메소드를 호출하여 이 태그의 위치를 기준으로
// 좌표 정보값을 가지는 객체를 리턴받음
        var eyelidInfo = headerjs.header.querySelector('.header-eye-eyelid').getBoundingClientRect();
// eventLocation: 현재 마우스 좌표값
        var eventLocation = {X: event.clientX, Y: event.clientY};
// center: 좌표값 기준이 될 header-eye-eyelid클래스의 X Y좌표 중앙 값
        var center = {
                        X: (eyelidInfo.left + eyelidInfo.right)/2,
                        Y: (eyelidInfo.top + eyelidInfo.bottom)/2
                        };

        var locationX = eventLocation.X;
        var locationY = eventLocation.Y;

    //pupil의 위치가 eyelid의 범위에서 벗어나지 않게 
    // 조건문으로 위치 조정
        if (eventLocation.X > eyelidInfo.right-10) {
            locationX = (center.X+2);
        }
        if (eventLocation.X < eyelidInfo.left+10) {
            locationX = (center.X-5);
        }
        if (eventLocation.Y > eyelidInfo.bottom-5) {
            locationY = (center.Y+3);
        }
        if (eventLocation.Y < eyelidInfo.top+5) {
            locationY = (center.Y-5);
        }
    //좌표값 반영
        pupil.style.left = String(locationX)+'px';
        pupil.style.top = String(locationY)+'px';
    },

    navContents:function (event) {
        var actionY = event.srcElement.scrollingElement.scrollTop;
        headerjs.RemoveAsideFocus();
        if (headerjs.scrollTargetTop - actionY < 0) {
            headerjs.headerNav.classList.add('opacity-0');
        }else {
            headerjs.headerNav.classList.remove('opacity-0');
        }
        headerjs.scrollTargetTop = actionY;
    }
};


var activeScript = {
    asideList: function (acceptedData) {
        var jsonData;
        if (typeof data === 'object') {
            jsonData = acceptedData;
        }else {
            jsonData = JSON.parse(acceptedData);
        }
        var asideList = document.querySelector('#asideList');
        var tagHTML = '';
        for (var key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                tagHTML += '<li><a href="'+jsonData[key]+'">'+key+'</a></li>';
            }
        }
        asideList.innerHTML = tagHTML;
    },
    alertModal : function(fileURL) {
            requestjs.ajax('GET', fileURL, function (data) {
            var data_ = JSON.parse(data);
            modaljs.create(data_.title, data_.contents);
        }, true);
    },
    foward: function (URL, contents) {
        navjs.active('loading...',contents);
        setTimeout(function() {
            requestjs.ajax('GET',URL,function(data) {
                wrapjs.reset('Contents window',data);
                navjs.inactive();
                headerjs.RemoveAsideFocus();
            }, true);
        }, 1000);
    }
};

function requestInit() {
    var dateObj = new Date(2019, 8-1, 9);
    var pastDays = Math.floor((new Date().getTime() - dateObj.getTime())/1000/60/60/24);
    document.querySelector('.header-contents').innerText = pastDays+' Days';
    
    headerjs.headerLogo.addEventListener('click',headerjs.AsideFocus);
    headerjs.headereye.addEventListener('click',headerjs.AsideFocus);
    window.addEventListener('mousemove',headerjs.MouseXY);
    window.addEventListener('scroll',headerjs.navContents);
}

requestInit();