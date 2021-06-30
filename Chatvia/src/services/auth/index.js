import axios from 'axios';

import {base_url, ApiWhatsapp} from '../../Env'
const Auth = () => ({
    Login : async (phone, password) => {

        const data = {
            phone, 
            password
        }
        const response = await axios({method: "post",
                                        url: base_url(ApiWhatsapp, `whatsapp/auth`, data),
                                        data})

        
        return response
        
    }
}); 

export default Auth



