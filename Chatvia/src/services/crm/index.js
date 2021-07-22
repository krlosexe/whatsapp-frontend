import axios from 'axios';

import {base_url, ApiCrm} from '../../Env'
const Crm = () => ({

    GetClient : async (jid) => {
        const response = await axios.get(base_url(ApiCrm, `whatsapp/get/client/${jid}`))
        return response
    },

    RegisterClient : async (data) => {
        const response = await axios({method: "post",
                                        url: base_url(ApiCrm, `whatsapp/register/client`),
                                        data})
        return response
    }


}); 

export default Crm



