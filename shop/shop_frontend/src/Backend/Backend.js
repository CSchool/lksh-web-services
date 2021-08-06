
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function BackendURL(page, params)
{
    var url = process.env.REACT_APP_BACKEND_URL + page;
    var first = true;
    for (var p in params) {
        url += (first ? "?" : "&") + p + "=" + params[p];
        first = false;
    }
    return url;
}

export function fetchBackend(page, params, func) {
    var csrftoken = getCookie('csrftoken');
    return fetch(BackendURL(page, params),
      {credentials: "include", headers: { 
          "Access-Control-Allow-Credentials" : true,
          "SameSite" : "Strict",
          'X-CSRFToken': csrftoken
        } } )
        .then(response => response.json())
        .then(data => { if (func) func(data); });
}

export function postBackend(page, params, form, func) {
    var csrftoken = getCookie('csrftoken');
    return fetch(BackendURL(page, params),
                 {method: 'POST', credentials: "include",
                  body: JSON.stringify(form),
                  headers: {
                    "Access-Control-Allow-Credentials" : true,
                    "SameSite" : "Strict",
                    "Content-Type": "application/json",
                    'X-CSRFToken': csrftoken } } )
            .then(response => response.json())
            .then(data => { if (func) func(data); });
}

export function uploadBackend(page, params, file) {
    var csrftoken = getCookie('csrftoken');
    var form_data = new FormData();
    Object.entries(params).forEach(([key, value]) => form_data.append(key, value));
    form_data.append('file', file);
    return fetch(BackendURL(page, {}),
                {method: 'POST', body: form_data, credentials: "include",
                 "Content-Type": "multipart/form-data",
                 headers: {
                    "Access-Control-Allow-Credentials" : true,
                    "SameSite" : "Strict",
                    'X-CSRFToken': csrftoken
                }});
}

export default fetchBackend;
