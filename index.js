/*
    function getDistance() : Lấy kích thước chiều rộng - chiều cao của map
    function createMap() : Khởi tạo map
    function setLacationColor(param1, param2, param3=null) : Thay trạng thái của điểm [x, y] tương ứng [param1, param2]
        param3 value :
            null : Xóa ô hiện tại
            0 : Phần thân rắn
            1 : Đầu rắn hướng lên
            2 : Đầu rắn hướng sang phải
            3 : Đầu rắn hướng xuống
            4 : Đầu rắn hướng sang trái
    function createSnake() : Khởi tạo rắn
    function keyPressed(event) : Kiểm tra sự kiện nhấn phím
        event.keyCode value :
            32 : Phím space
            13 : Phím enter
            37 : Phím sang trái
            38 : Phím lên
            39 : Phím sang phải
            40 : Phím xuống
    snakeStatus value :
        0 : Đi lên
        1 : Đi sang phải
        2 : Đi xuống
        3 : Đi sang trái
*/

class Snake
{
    constructor(param1, param2, param3=null)
    {
        this.x = param1;
        this.y = param2;
        this.next = param3;
    }

    getDistance()
    {
        return [this.x, this.y];
    }

    getNext()
    {
        return this.next;
    }

    setNext(param)
    {
        this.next = param;
    }
}

var keyCode;
var snakeStatus = 1;
var score = 0;
var max_score = 0;
const [x, y] = getDistance();
const max_snake = x*y-y-3;
var map = createMap();
var [snake_head, snake_tail] = createSnake();
var level = 1;
var thread;
var btn_start_end = 0, btn_resume_pause = 0;
var isPlus = false;

createButtonState();

function createButtonState() {
    setButtonState('end');
    setButtonState('pause');
    setButtonState('resume');
}

function setButtonState(param1, param2=null) {
    document.getElementById(param1).disabled = (param2 == null ? true : false);
    document.getElementById(param1).style = param2 == null ? "background-color: rgb(207, 248, 207);":" ";
}

function keyPressed(event) {
    keyCode = event.keyCode;
    switch (keyCode) {
        case 32:
            btn_resume_pause = !btn_resume_pause;
            btn_resume_pause ? pause() : resume();
            break;
        case 13:
            btn_start_end = !btn_start_end;
            btn_start_end ? start() : end();
            break;
        case 37:
            if (btn_start_end && snakeStatus != 1 && snakeStatus != 3)
            {
                snakeStatus = 3;
                move();
                resume()
            }
            break;
        case 38:
            if (btn_start_end && snakeStatus != 0 && snakeStatus != 2)
            {
                snakeStatus = 0;
                move();
                resume()
            }
            break;
        case 39:
            if (btn_start_end && snakeStatus != 1 && snakeStatus != 3)
            {
                snakeStatus = 1;
                move();
                resume()
            }
            break;
        case 40:
            if (btn_start_end && snakeStatus != 0 && snakeStatus != 2)
            {
                snakeStatus = 2;
                move();
                resume()
            }
            break;
        default:
            break;
    }
}

function autoMove() {
    if (!btn_start_end)
        return;
    if (!move())
    {
        end();
    }
    document.getElementById("score").innerHTML = score;
}

function start() {
    btn_start_end = true;
    reset();
    setButtonState('start');
    setButtonState('end',1);
    setButtonState('pause',1);
    setButtonState('lv');
    level = parseInt(document.getElementById("lv").value[3]);
    clearInterval(thread);
    thread = setInterval('autoMove()', (6-level)*100);
    createPrey();
}

function resume() {
    clearInterval(thread);
    thread = setInterval('autoMove()', (6-level)*100);
    setButtonState('pause',1);
    setButtonState('resume');
}

function pause() {
    clearInterval(thread);
    setButtonState('pause');
    setButtonState('resume',1);
}

function end() {
    btn_start_end = false;
    if (max_score < score) max_score = score;
    document.getElementById("max_score").innerHTML = max_score;
    clearInterval(thread);
    setButtonState('start',1);
    setButtonState('end');
    setButtonState('pause');
    setButtonState('resume');
    setButtonState('lv',1);
    alert("Game over !\nĐiểm của bạn là : "+score);
}

function reset() {
    score = 0;
    snakeStatus = 1;
    document.getElementById("score").innerHTML = score;
    for (i=0; i < x; i++)
        for (j=0; j < y; j++)
        {
            setLacationColor(i,j);
            map[i][j].className = "";
        }
    [snake_head, snake_tail] = createSnake();
}

function getDistance() {
    const x = document.getElementsByTagName('tr')[0].getElementsByTagName('td').length;
    const y = document.getElementsByTagName('tr').length;
    return [x, y];
}

function createMap() {
    let arr = [];
    for (i=0; i < x; i++)
    {
        let newArr = [];
        for (j=0; j < y; j++)
            newArr.push(document.getElementsByTagName('tr')[i].getElementsByTagName('td')[j]);
        arr.push(newArr);
    }
    return arr;
}

function move() {
    if (!btn_start_end)
        return;
    var current = snake_head.getDistance();
    if (snakeStatus == 0)
    {
        if (current[0] == 0)
            return 0;
        const next = new Snake(current[0]-1, current[1]);
        if (!isPrey(next.getDistance()[0],next.getDistance()[1]) && !isEmptyBox(next.getDistance()[0],next.getDistance()[1]))
            return 0;
        setLacationColor(snake_tail.getDistance()[0],snake_tail.getDistance()[1]);
        if (!isPlus)
        {
            snake_tail = snake_tail.getNext();
        }
        isPlus = false;
        snake_head.setNext(next);
        snake_head = next;
        plusScore(snake_head.getDistance()[0],snake_head.getDistance()[1]);
        setLacationColor(snake_head.getDistance()[0],snake_head.getDistance()[1],snakeStatus + 1);
        setLacationColor(current[0],current[1],0);
    }
    else if (snakeStatus == 1)
    {
        if (current[1]== y-1)
            return 0;
        const next = new Snake(current[0], current[1]+1);
        if (!isPrey(next.getDistance()[0],next.getDistance()[1]) && !isEmptyBox(next.getDistance()[0],next.getDistance()[1]))
            return 0;
        setLacationColor(snake_tail.getDistance()[0],snake_tail.getDistance()[1]);
        if (!isPlus)
        {
            snake_tail = snake_tail.getNext();
        }
        isPlus = false;
        snake_head.setNext(next);
        snake_head = next;
        plusScore(snake_head.getDistance()[0],snake_head.getDistance()[1]);
        setLacationColor(snake_head.getDistance()[0],snake_head.getDistance()[1],snakeStatus + 1);
        setLacationColor(current[0],current[1],0);
    }
    else if (snakeStatus == 2)
    {
        if (current[0]== x-1)
            return 0;
        const next = new Snake(current[0]+1, current[1]);
        if (!isPrey(next.getDistance()[0],next.getDistance()[1]) && !isEmptyBox(next.getDistance()[0],next.getDistance()[1]))
            return 0;
        setLacationColor(snake_tail.getDistance()[0],snake_tail.getDistance()[1]);
        if (!isPlus)
        {
            snake_tail = snake_tail.getNext();
        }
        isPlus = false;
        snake_head.setNext(next);
        snake_head = next;
        plusScore(snake_head.getDistance()[0],snake_head.getDistance()[1]);
        setLacationColor(snake_head.getDistance()[0],snake_head.getDistance()[1],snakeStatus + 1);
        setLacationColor(current[0],current[1],0);
    }
    else if (snakeStatus == 3)
    {
        if (current[1]== 0)
            return 0;
        const next = new Snake(current[0], current[1]-1);
        if (!isPrey(next.getDistance()[0],next.getDistance()[1]) && !isEmptyBox(next.getDistance()[0],next.getDistance()[1]))
            return 0;
        setLacationColor(snake_tail.getDistance()[0],snake_tail.getDistance()[1]);
        if (!isPlus)
        {
            snake_tail = snake_tail.getNext();
        }
        isPlus = false;
        snake_head.setNext(next);
        snake_head = next;
        plusScore(snake_head.getDistance()[0],snake_head.getDistance()[1]);
        setLacationColor(snake_head.getDistance()[0],snake_head.getDistance()[1],snakeStatus + 1);
        setLacationColor(current[0],current[1],0);
    }
    return 1;
}

function setLacationColor(param1, param2, param3 = null) {
    map[param1][param2].className = (param3 == null ? '' : 'snake status-head-'+param3);
    map[param1][param2].innerHTML = (param3 == 2 || param3 == 4) ? ":": ((param3==1 || param3 == 3) ? ". ." : "");
}

function createSnake() {
    let head = new Snake(0, 2);
    let body = new Snake(0, 1, head);
    let tail = new Snake(0, 0, body);
    setLacationColor(0,0,0);
    setLacationColor(0,1,0);
    setLacationColor(0,2,2);
    return [head, tail];
}

function createPrey() {
    let temp_x = Math.floor(Math.random() * x);
    let temp_y = Math.floor(Math.random() * y);
    while(!isEmptyBox(temp_x, temp_y))
    {
        temp_x = Math.floor(Math.random() * x);
        temp_y = Math.floor(Math.random() * y);
    }
    map[temp_x][temp_y].className = 'prey';
    return [temp_x, temp_y]; 
}

function isEmptyBox(param1, param2) {
    if (map[param1][param2].className == "" || map[param1][param2].className == null || map[param1][param2].className == undefined)
        return true;
    return false;
}

function plusScore(param1, param2) {
    if (isPrey(param1, param2))
    {
        score+= parseInt(level);
        createPrey();
        isPlus = (score/level > max_snake) ? false : true;
    }
}

function isPrey(param1, param2) {
    if (map[param1][param2].className == 'prey')
        return true;
    return false;
}