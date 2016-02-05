//api testing
function indeed_clk(a, sig) {
    var hr = a.href;
    console.log("hr "+hr);
    var si = hr.indexOf('&jsa=');
    console.log("si "+si);
    if (si > 0) return;
    var jsh = hr + '&jsa=' + sig;
    if (jsh.indexOf('&inchal') == -1) jsh += '&inchal=apiresults';
    a.href = jsh;
}

function init() {
    (new Image()).src = document.location.protocol + '//gdc.indeed.com/rpc/apilog?a=apiresults';
}
if (window.addEventListener) {
    window.addEventListener('load', init, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', init);
}