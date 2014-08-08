var newDraftOrder = [
    {
        id: 1, name: "Grammie", order: 1, timeleft: 720, color: "#a0a"
    },
    {
        id: 2, name: "Angela", order: 2, timeleft: 720, color: "#f80"
    },
    {
        id: 3, name: "Kaya", order: 3, timeleft: 720, color: "#af3"
    },
    {
        id: 4, name: "Magnus", order: 4, timeleft: 720, color: "#f00"
    },
    {
        id: 5, name: "Michelle", order: 5, timeleft: 720, color: "#f88"
    },
    {
        id: 6, name: "Erik", order: 6, timeleft: 720, color: "#00f"
    },
    {
        id: 7, name: "Brenda", order: 7, timeleft: 720, color: "#ff0"
    },
    {
        id: 8, name: "Aaron", order: 8, timeleft: 720, color: "#0a4"
    },
    {
        id: 9, name: "Odin", order: 9, timeleft: 720, color: "#0ff"
    },
    {
        id: 10, name: "Davin", order: 10, timeleft: 720, color: "#666"
    },
    {
        id: 11, name: "Xander", order: 11, timeleft: 720, color: "#a50"
    },
    {
        id: 12, name: "Papa", order: 12, timeleft: 720, color: "#041"
    }
];


var fft = {};
fft = {
    runningNow: null,
    secsAllowed: 720,
    data: null,
    buttonTemplate: "<div class=\"player\" style=\"background-color:*|BGCOLOR|*\" id=\"*|ID|*\"><div class=\"name\">*|NAME|*</div><div class=\"order\">*|ORDER|*</div><div class=\"time\">*|TIMELEFT|*</div></div>",
    interval: null,
    beep: null,
    beep2: null,
    tap: null,
    mnf: null,
    
    init: function () {
        fft.beep = new Audio("beep.wav");
        fft.beep2 = new Audio("beep.mp3");
        fft.tap = new Audio("tap.mp3");
        fft.mnf = new Audio("mnf.mp3");
        var draftOrder = localStorage.getItem('draftOrder');
        if (draftOrder) {
            fft.data = JSON.parse(draftOrder);
        } else {
            fft.data = newDraftOrder;
        }
        fft.drawButtons();
        var evt = window.navigator.msPointerEnabled ? "MSPointerDown" : "touchstart keydown click";
        $(".player").on(evt, function () {
            fft.mnf.play();
            $(".player").removeClass("active");
            $(this).addClass("active");
            fft.tapped($(this).attr("id"));
        });
        $(".pause").on(evt, function () {
            fft.beep2.play();
            $(".player").removeClass("active");
            clearInterval(fft.interval);
            localStorage.setItem('draftOrder', JSON.stringify(fft.data));
        });
        $(".reset").on(evt, function () {
            fft.beep2.play();
            if (confirm("Are you sure you want to reset the draft?")) {
                localStorage.setItem('draftOrder', "");
                window.location.reload();
            }
        });
    },
    
    tapped: function (id) {
        if (fft.interval) {
            clearInterval(fft.interval);
        }
        var q = $.Enumerable.From(fft.data)
            .Where(function (x) { return x.id == id; })
            .ToArray();
        if (q) {
            fft.runningNow = q[0];
            fft.startInterval();
        }
        localStorage.setItem('draftOrder', JSON.stringify(fft.data));
    },
    
    formatTime: function(seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        if (mins < 10) {
            mins = "0" + mins;
        }
        if (secs < 10) {
            secs = "0" + secs;
        }
        return mins + ":" + secs;
    },

    startInterval: function() {
        fft.interval = setInterval(function() {
            fft.runningNow.timeleft--;
            $("#" + fft.runningNow.id).find(".time").html(fft.formatTime(fft.runningNow.timeleft));
            if (fft.runningNow.timeleft < 60) {
                $("#" + fft.runningNow.id).find(".time").css("color", "#ff0000");
            }
            console.log(fft.runningNow);
        }, 1000);
    },

    drawButtons: function() {
        fft.data.forEach(function(el, ix, ar) {
            $("#container").append(fft.dataBind(el));
        });
    },
    
    dataBind: function (player) {
        return fft.buttonTemplate
                .replace("*|ID|*", player.id)
                .replace("*|NAME|*", player.name)
                .replace("*|ORDER|*", "#" + player.order)
                .replace("*|TIMELEFT|*", fft.formatTime(player.timeleft))
                .replace("*|BGCOLOR|*", player.color);
    }
}