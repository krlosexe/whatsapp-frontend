import axios from 'axios';

import {base_url, ApiCrm} from '../../Env'
const Crm = () => ({

    RegisterClient : async (data) => {

        return data
        const response = await axios({method: "post",
                                        url: base_url(`${ApiCrm}/register`),
                                        data})

        return response
    },

}); 


export default Crm



