
import WhatsApp from './whasatpp'
import Crm from './crm'
import Auth from './auth'

const WhatsAppService = WhatsApp()
const CrmService      = Crm()
const AuthService     = Auth()

export  {
    WhatsAppService,
    CrmService,
    AuthService
}