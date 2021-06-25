import axios from 'axios';

import {base_url, ApiCrm} from '../../Env'
const Crm = () => ({

    RegisterClient : async (data) => {

        
        const response = await axios({method: "post",
                                        url: base_url(ApiCrm, `whatsapp/register/client`),
                                        data,
                                        headers: { 
                                            "Accept": "application/json",
                                            "Content-Type": "application/json" }})

        return response
    },

}); 


export default Crm



