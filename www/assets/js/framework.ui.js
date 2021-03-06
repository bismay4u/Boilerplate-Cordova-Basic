var appPageHistory = [];

var DISABLE_GOBACK = false;
function pageLoader(msg,size) {
	if (msg == null) msg = "";
    	if (size == null) size = "3x";

	$("#mainContainer").html("<div class='appLoaderContainerPage'><br>" + msg + "<br><div class='ajaxloading'></div></div>");
}

function updateTitle(ttl) {
	if(ttl==null || ttl.toUpperCase()=="DASHBOARD") {
		ttl=appConfig.APPTITLE;
	}
	if ($(".header .navbar-header .navbar-brand").length > 0) {
        $(".header .navbar-header .navbar-brand").html(ttl);
	} else if ($(".headerTitle").length) {
        $(".headerTitle").html(ttl);
	}
}

function goBack() {
    if(DISABLE_GOBACK) return false;
	foundSomething = false;
	$.each(appConfig.PAGECONFIG.POPUPCLASSES, function(a, b) {
		if($(a).length>0) {
			if(b!=null && b.length>0) {
	            if(typeof window[b] == "function") window[b]();
	            else eval(b);
				foundSomething = true;
				return false;
	        }
		}
	});

	if(!foundSomething) {
		appPageHistory.pop();
		pg = appPageHistory.pop();
		if (pg == null) {
			if (navigator.app != null) {
				navigator.app.exitApp();
			} else {
				loadPage(appConfig.PAGEHOME);
			}
		} else {
			loadPage(pg);
		}	
	}
}


//Toast Messages
function lgksToast(msg,opts) {
	var defOpts = {
            displayTime: 2000,
            bodyclass: "",
            inTime: 300,
            outTime: 200,
            animate: false,
            inEffect:"fade",
            outEffect:"fade",
            maxWidth: "80%",//500+"px"
            position: "top-right",
        };
    opts = $.extend(defOpts, opts);
	opts.position=opts.position.toLowerCase().split("-");
	var y,x;
	switch (opts.position[0]) {
        case "top":
            y = 32;
            break;
        case "bottom":
            y = 1.0325;
            break;
        default:
            y = 2;
    }
    switch (opts.position[1]) {
        case "left":
            x = 72;
            break;
        case "right":
            x = 72;
            break;
        default:
            x = 2;
    }
    
    $("body .lgksToast.toast").detach();
	  toast = $("<div class='toast lgksToast "+opts.bodyclass+"'>" + msg + "</div>");
    $("body").append(toast);
    var l = window.innerHeight;
    var j = window.innerWidth;
    
    toast.css({
            "max-width": opts.maxWidth + "px",
            top: ((l - toast.outerHeight()) / y) + $(window).scrollTop() + "px",
			position:"absolute",
			padding:"10px",
			"z-index":99999999,
			display:"none",
        });
    switch (opts.position[1]) {
		case "left":
			toast.css({
				left: ((j - toast.outerWidth()) / x) + $(window).scrollLeft() + "px",
			});
			break;
		case "right":
			toast.css({
				right: ((j - toast.outerWidth()) / x) + $(window).scrollLeft() + "px",
			});
			break;
		default:
			toast.css({
				right: ((j - toast.outerWidth()) / x) + $(window).scrollLeft() + "px",
			});
	}
    
    if(opts.bodyclass==="" || opts.bodyclass==null) {
		toast.css({
            color:"#ffffff",
			"background-color":"rgba(0,0,0, 0.7)",
			"border-radius":"4px",
			"-moz-border-radius":"4px",
			"-webkit-border-radius":"4px",
			border:"2px solid #CCCCCC"
        });
	}

	if(opts.animate) {
		toast.show(opts.inEffect,opts.inTime).delay(opts.displayTime).hide(opts.outEffect,opts.outTime, function() {
					toast.remove();
				});
	} else {
		toast.show(opts.inTime).delay(opts.displayTime).hide(opts.outTime, function() {
					toast.remove();
				});
	}
}

function lgksAlert(message, title, callBack) {
	if (title == null) title = appConfig.APPNAME;

	if (navigator.notification) {
		navigator.notification.alert(message, callBack, title, 'OK');
	} else {
		alert(title ? (title + ": " + message) : message);
	}
}

function lgksPrompt(message, defaultData, callBack, title) {
	if (title == null) title = appConfig.APPNAME;
	if (navigator.notification) {
		navigator.notification.prompt(message, function(txt) {
			if (txt.buttonIndex == 1) callBack(txt.input1);
		}, title, null, defaultData);
	} else {
		callBack(prompt(message, defaultData));
	}
}

function lgksConfirm(message, callBack, title) {
    if (title == null) title = appConfig.APPNAME;
    if (navigator.notification) {
        navigator.notification.confirm(message, function(ans) {
            if(ans==1) callBack(true);
            else callBack(false);
        }, title);
    } else {
        callBack(confirm(message));
    }
}

function lgksError(message, type, callBack) {
	if(type==null) type="default";

	title="Error";

	console.warn(message);
	lgksToast(message);

	// if (navigator.notification) {
	// 	navigator.notification.alert(message, callBack, title, 'OK');
	// } else {
	// 	alert("Error:"+message);
	// }
}

function generateMenubar() {
    $("#menuBar").html("");
    $.each(appConfig.MENU, function(alink, menu) {
        if (menu.hidden) return;
        if (menu.method) {
            if (typeof window[menu.method] == "function") {
                menuSet = window[menu.method](menu);
                if (menuSet != null) {
                    if (Array.isArray(menuSet)) {
                        $.each(menuSet, function(a, menuHTML) {
                            $("#menuBar").append(menuHTML);
                        });
                    } else if (typeof menuSet == "string") {
                        $("#menuBar").append(menuSet);
                    }
                }
            }
        } else {
            if (alink.charAt(0) == "@") {
                $("#menuBar").append("<li class='menuLink'><a cmd='" + alink.substr(1) + "' class='actionCmd'>" + menu.icon + menu.title + "</a></li>");
            } else {
                $("#menuBar").append("<li class='menuLink'><a href='" + alink + "' class='pageLink'>" + menu.icon + menu.title + "</a></li>");
            }
        }
    });
}
