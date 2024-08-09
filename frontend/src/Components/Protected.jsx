import {Outlet,Navigate} from 'react-router-dom'

const auth=()=>{
    let user={LogedIn: false};
    if (localStorage.getItem('Token')!=null){
        return user['LogedIn']=true
    }
}
const Protected=()=>{
    const isauth=auth()
    return isauth ? <Outlet /> : <Navigate to='/' /> 
}
export default Protected;