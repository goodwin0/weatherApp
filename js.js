const BRICKS_ON_PAGE_NUM = 4;
const WEEKDAYS = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const PRECIPITATION = ['Без осадков', 'Дождь', 'Снег', 'Дождь со снегом', 'Облачно'];
const ICONS = ['icons/sun.svg', 'icons/rain.svg', 'icons/snow.svg', 'icons/snow_rain.svg', 'icons/cloud.svg'];
const MONTHS = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];

function init() {
    var dataJSON = [
        {
            "date": "2019-01-30T08:09:21.191Z",
            "temperature": {
                "night": -3,
                "day": 2
            },
            "cloudiness": "Ясно",
            "snow": false,
            "rain": false
        },
        {
            "date": "2019-01-29T08:09:21.191Z",
            "temperature": {
                "night": 0,
                "day": 4
            },
            "cloudiness": "Облачно",
            "snow": false,
            "rain": true
        },
        {
            "date": "2019-01-31T08:09:21.191Z",
            "temperature": {
                "night": 0,
                "day": 1
            },
            "cloudiness": "Облачно",
            "snow": false,
            "rain": false
        },
        {
            "date": "2019-01-22T08:09:21.191Z",
            "temperature": {
                "night": 0,
                "day": 1
            },
            "cloudiness": "Облачно",
            "snow": false,
            "rain": true
        },
        {
            "date": "2019-02-01T08:09:21.191Z",
            "temperature": {
                "night": 0,
                "day": 1
            },
            "cloudiness": "Облачно",
            "snow": true,
            "rain": true
        },
        {
            "date": "2019-02-02T08:09:21.191Z",
            "temperature": {
                "night": 0,
                "day": 1
            },
            "cloudiness": "Облачно",
            "snow": true,
            "rain": false
        },
        {
            "date": "2019-02-03T08:09:21.191Z",
            "temperature": {
                "night": 0,
                "day": 1
            },
            "cloudiness": "Облачно",
            "snow": true,
            "rain": true
        }
    ];
    dataJSON.forEach(function (el) {
        el.date = Date.parse(el.date);
        el.date = new Date(el.date);
    });
    dataJSON.sort(function (a, b) {
        return a.date - b.date;
    });

    const root = document.getElementById("root");
    const template = document.getElementById("brickContentTml").content;
    const arrowLeft = document.getElementById("arrowLeft");
    const arrowRight = document.getElementById("arrowRight");
    var lastBrickIndex = -1;
    var todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    var sum = 0;
    // init first 4 bricks (or less)
    while (sum < BRICKS_ON_PAGE_NUM && lastBrickIndex < dataJSON.length) {
        var data = dataJSON[++lastBrickIndex];
        if (todayDate <= data.date) {
            root.appendChild(createChildForRoot(data, todayDate, template));
            sum++;
        }
    }
    arrowLeft.classList.add("brickDisabled");
    if(sum < BRICKS_ON_PAGE_NUM){
        arrowRight.classList.add("brickDisabled");
    }

    arrowRight.addEventListener("click", function () {
        if (lastBrickIndex < dataJSON.length - 1) {
            var data = dataJSON[lastBrickIndex + 1];
            if (todayDate <= data.date) {
                replaceWithFadeOut(root.firstElementChild, createChildForRoot(data, todayDate, template), false);
            }
            lastBrickIndex++;
            if (lastBrickIndex >= dataJSON.length - 1) {
                arrowRight.classList.add("brickDisabled");
            }
            if(arrowLeft.classList.contains("brickDisabled")){
                arrowLeft.classList.remove("brickDisabled")
            }
        }
    });

    arrowLeft.addEventListener("click", function () {
        if (lastBrickIndex - BRICKS_ON_PAGE_NUM >= 0) {
            var data = dataJSON[lastBrickIndex - BRICKS_ON_PAGE_NUM];
            if (todayDate <= data.date) {
                replaceWithFadeOut(root.lastElementChild, createChildForRoot(data, todayDate, template), true);
                lastBrickIndex--;
            }
        }
        if (lastBrickIndex - BRICKS_ON_PAGE_NUM <= 0 || todayDate > dataJSON[lastBrickIndex - 1].date){
            arrowLeft.classList.add("brickDisabled");
        }
        if(arrowRight.classList.contains("brickDisabled")){
            arrowRight.classList.remove("brickDisabled")
        }
    });
}

function createChildForRoot(dataElJSON, today, template) {
    var childForRoot = template.cloneNode(true);
    var childAttr = Array.prototype.slice.call(childForRoot.firstElementChild.firstElementChild.children);
    childAttr.forEach(function (elDOM) {
        var weather = dataElJSON.rain && dataElJSON.snow ? 3 : dataElJSON.rain ? 1 : dataElJSON.snow ? 2 : dataElJSON.cloudiness === "Облачно" ? 4 : 0;
        if (elDOM.className === 'today') {
            elDOM.textContent = today.getDate() === dataElJSON.date.getDate() ? 'Сегодня' : WEEKDAYS[dataElJSON.date.getDay()];
        }
        if (elDOM.className === 'date') {
            elDOM.textContent = "".concat(dataElJSON.date.getDate().toString()).concat(" ").concat(MONTHS[dataElJSON.date.getMonth()]);
        }
        if (elDOM.className === 'pic') {
            elDOM.childNodes[1].setAttribute('data', ICONS[weather]);
        }
        if (elDOM.className === 'atDay') {
            elDOM.textContent = dataElJSON.temperature.day;
        }
        if (elDOM.className === 'atNight') {
            elDOM.textContent = dataElJSON.temperature.night;
        }
        if (elDOM.className === 'precipitation') {
            elDOM.textContent = PRECIPITATION[weather];
        }
    });
    return childForRoot;
}

function replaceWithFadeOut(toDelete, toAdd, insertBefore) {
    var delay = 150;
    var parent = toDelete.parentNode;
    toDelete.style.opacity = 0;

    setTimeout(function () {
        parent.removeChild(toDelete);
        if (insertBefore) {
            parent.insertBefore(toAdd, parent.firstElementChild);
        } else {
            parent.appendChild(toAdd);
        }

    }, delay);
}