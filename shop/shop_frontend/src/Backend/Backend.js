import axios from 'axios';

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
      {credentials: "include",
       headers: {
          "Access-Control-Allow-Credentials" : true,
          "SameSite" : "Strict",
          'X-CSRFToken': csrftoken
        } } )
        .then(response => response.json())
        .then(data => { if (func) func(data); });
}

function backend(method, page, params, form, func) {
    var csrftoken = getCookie('csrftoken');
    return fetch(BackendURL(page, params),
                 {method: method, credentials: "include",
                  body: JSON.stringify(form),
                  headers: {
                    "Access-Control-Allow-Credentials" : true,
                    "SameSite" : "Strict",
                    "Content-Type": "application/json",
                    'X-CSRFToken': csrftoken } } )
            .then(response => method === 'DELETE' ? "" : response.json())
            .then(data => { if (func) func(data); });
}

export function postBackend(page, params, form, func) {
    return backend('POST', page, params, form, func);
}

export function patchBackend(page, params, form, func) {
    return backend('PATCH', page, params, form, func);
}

export function deleteBackend(page, params, func) {
    return backend('DELETE', page, params, {}, func);
}

export function uploadBackend(page, params, file, func) {
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
                }})
            .then(response => response.json())
            .then(data => { if (func) func(data); });
}

export async function fetchAsync(page) {
    var csrftoken = getCookie('csrftoken');
    return axios({url: BackendURL(page),
        method: 'GET', withCredentials: true,
        headers:{
            "Access-Control-Allow-Credentials" : true,
            "SameSite" : "Strict",
            'X-CSRFToken': csrftoken
        }}
    );
}

export default fetchBackend;
