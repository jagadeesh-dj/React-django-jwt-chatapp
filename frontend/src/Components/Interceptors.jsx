import axios from "axios";
import { useNavigate } from "react-router-dom";
let refresh = false;
axios.interceptors.response.use(resp => resp, async error => { 
    if (error.response.status === 401 && !refresh) {   
        refresh = true;console.log(localStorage.getItem('Refresh'))
        const response = await axios.post('http://127.0.0.1:8000/token/refresh/', {      
                        refresh:localStorage.getItem('Refresh')},{
                        headers: {'Content-Type': 'application/json'},
                        });    
        if (response.status === 200) {
            console.log('refreshed')
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data['Token']}`;       
            localStorage.setItem('Token', response.data.access);       
            localStorage.setItem('Refresh', response.data.refresh);      
            return axios(error.config);  
        }
    }
    refresh = false;
    return error;
});
