
// export default async function requester(method, url, data){
//     const options = {};

//     if (method !== 'GET') {
//         options.method = method;

//     }
//     if (data) {
//         options.headers = {
//             'Content-Type': 'application.json',
//         };
 
//         options.body = JSON.stringify(data);
//     }
    

//     const response = await fetch(url, options);
//     const results = response.json();

//     return result;
// };

// export const get = requester.bind(null, 'GET');
// export const get = requester.bind(null, 'POST');
// export const get = requester.bind(null, 'PUT');
// export const get = requester.bind(null, 'DELETE');

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
