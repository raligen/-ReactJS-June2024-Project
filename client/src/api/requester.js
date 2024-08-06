import { getAccessToken } from "../utils/authUtil";

async function requester(method, url, data){
    const options = {};

    const accessToken = getAccessToken();

    if (accessToken) {
        options.headers = {
            ...options.headers, 
            'X-Authorization': accessToken,
        }   
    }

    if (method !== 'GET') {
        options.method = method;

    }
    if (data) {
        options.headers = {
            ...options.headers,
            'Content-Type': 'application.json',
        };
 
        options.body = JSON.stringify(data);
    }
    

    const response = await fetch(url, options);
    if (response.status === 204) {
        return;
    }

    const results = await response.json();

    if (!response.ok) {
        console.log(response);
        throw result;
    }
    

    return result;
};

export const get = requester.bind(null, 'GET');
export const post = requester.bind(null, 'POST');
export const put = requester.bind(null, 'PUT');
export const del = requester.bind(null, 'DELETE');

export default{
    get,
    post,
    put,
    del,
};

// }
// const apiUrl = '...';
// export const getData = () => {
// return fetch(apiUrl)
// .then(res => res.json())
// .then(data => data.results)
// .catch(error => console.error(error))
// };


// import { useState, useEffect } from 'react';
// import { getData } from './services/fetching-dataservice';

// function Fetch() {
//     const [state, setState] = useState({ data: [],
//     isLoading: false });
    
//     useEffect(() => {
//          setState((state) => ({ ...state, isLoading:
//             true }));
//             getData().then((data) => {
//             setState((state) => ({ ...state, data,
//             isLoading: false }));
//     });

//     }, []);
// }

// return (
//     <div className='container'>
//     {state.data.map((x) => (<p key={x.id}>
//     {x.text}</p>))}
//     </div>
//     );
//     }
//     export default fetch;
