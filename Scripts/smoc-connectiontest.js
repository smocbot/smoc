var optionDisabled = false;
$(document).ready(function () {
    if (!$('#test_connection_form').length)
        return;

    $('#client_url').val(location.href);

    var $resultTarget = $('#test_connection_result');
    $('#test_connection').on('click', function () {
        var that = this;
        if (optionDisabled) return;

        $(this).addClass("disabled");
        optionDisabled = true;
        var data = {
            clientId: $('#client_id').val(),
            clientSecret: $('#client_secret').val(),
            hostURL: $('#client_url').val()
        };

        // validate
        $resultTarget.html("");
        if (!data.clientId.trim().length || !data.clientSecret.trim().length) {
            $resultTarget.html("All fields are required");
            $(this).removeClass("disabled");
            optionDisabled = false;
            return;
        }

        $resultTarget.append("<div>Testing for:</div>");
        $resultTarget.append("<div>Client ID: " + data.clientId + "</div>");
        $resultTarget.append("<div>HOST URL: " + data.hostURL + "</div>");
        $resultTarget.append("<div> ------------- [result] -------------- </div>");
        $resultTarget.append("<div></div>");

        // Send
        // todo - add error case
        $.post('/api/configtest', data, function (data) {
            data.result.forEach(function (r) {
                var line = $("<div></div>");
                line.addClass((r.status) ? "success" : "failed");
                line.append(["[ ", (r.status) ? "success" : "failed", " ]"].join(""));
                line.append("&nbsp; <span class=\"status-message\"> "
                    + r.message + "</span>");
                $resultTarget.append(line);
            });

            if (data.reason !== null) {
                $resultTarget.append("<div> ------------- [ possible reason ] -------------- </div>");
                $resultTarget.append("<div>" + data.reason + "</div>");
            }

            optionDisabled = false;
            $(that).removeClass("disabled");
        }).fail(function () {
            $resultTarget.append("<div> Unable to make the request! </div>");
        });
    });
});