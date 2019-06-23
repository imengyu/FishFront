export default {
    start,
    done
}

function start(){
    document.getElementById('loading').setAttribute('class', '');
}
function done(){
    var l = document.getElementById('loading');
    l.setAttribute('class', 'hide');
    setTimeout(() => { l.setAttribute('class', 'hide hidden');}, 600)
}