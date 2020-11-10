export function getSessions(url) {
    return getSession(url, '');
}

export function getSession(url, uuid) {
    url += '/session'+(typeof uuid == 'string' && uuid.length>0? '/'+uuid : '')
    return new Promise(function(result, error) {
        fetch(url).then(
            (rawres) => {
                rawres.json()
                .then(result, error)
            },
            error
        )
    });
}

export function deleteSession(url, uuid) {
    return new Promise(function(result, error) {
        fetch(
            url+'/session/'+uuid,
            {
                method: 'DELETE'
            }
        ).then(result, error)
    });
}

export function postSession(url, session_name) {
    return new Promise(function(result, error) {
        fetch(
            url+'/session',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: session_name
                })
            }
        ).then(
            (rawres) => {
                rawres.json()
                .then(result, error)
            },
            error
        )
    });
}

export function commitSession(url, uuid) {
    return new Promise(function(result, error) {
        fetch(
            url+'/session/'+uuid+'?commit=true',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            }
        ).then(
            (rawres) => {
                rawres.json()
                .then(result, error)
            },
            error
        )
    });
}
