const { default: axios } = require("axios")
const validator = require("validator")
const fs = require('fs')
const { uniqid } = require("php-in-js/modules/math")
const { date } = require("php-in-js/modules/datetime")

const { baseUrl } = require("../config/env")
const { MONETBIL_SERVICE_KEY, MONETBIL_SERVICE_SECRET } = require("../config/constants")
const { empty, is_numeric } = require("php-in-js/modules/types")

module.exports = new class {
    /**
     * Base path of folder containing temp payment files
     */
    basepath = `${__dirname}/../payments`

	/**
	 * Endpoint of payment initialization
	 */
    endpoint_init = `https://api.monetbil.com/widget/v2.1/${MONETBIL_SERVICE_KEY}`

    /**
	 * Endpoint of widrawal
	 */
    endpoint_widrawal = 'https://api.monetbil.com/v1/payouts/withdrawal'
	
	/**
	 * Endpoint of transaction verification
	 */
    endpoint_check = 'https://api.monetbil.com/payment/v1/checkPayment'

    constructor() {
        // if base directory do not exists, create it
        if (!fs.existsSync(this.basepath)) {
            fs.mkdirSync(this.basepath)
        }

    }

    /**
	 * Init payment form widget
	 * 
	 * @param {{amount: int, fee: int, userId: int}}  data
	 * 
	 * @returns {Promise<String>} payment url
	 */
    async initPayment(data) {
        /**
         * Reference is used to etablish link between the payment and the user
         */
        const ref = this._generateRef(data)

        const { data: response } = await axios.post(this.endpoint_init, {
			amount     : data.amount + data.fee,
			locale     : 'en',
			country    : 'CM',
			currency   : 'XAF',
			payment_ref: ref,
			return_url : `${baseUrl}/api/transaction/result`,
			// notify_url : `${baseUrl}/api/transaction/notify/${ref}`,
			// logo       : '',
        })

        let payment_url = '';
		
        if (response && Object.keys(response).includes('payment_url')) {
			payment_url = response.payment_url
		}

		return payment_url
    }

    /**
	 * Verify transaction status
	 * 
	 * @param  {string} paymentId l'id de la transaction
	 * 
	 * @return {Promise<{status: int, transaction: {[key: string]: string}}>}
	 */
    async check(paymentId) {
        const { data: response } = await axios.post(this.endpoint_check, { paymentId }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

		let status = 0, transaction = {}
        
        if (response && Object.keys(response).includes('transaction')) {
            transaction = response.transaction
            status      = parseInt(transaction.status)
		}

		return { status, transaction }
	}

    /**
	 * Send money to an mobile number
	 * 
	 * @param {{amount: int, phone: string}}  data
     * 
     * @return {Promise<{[key: string]: string}>}
	 */
    async send(data) {
        if (empty(data.amount) || !is_numeric (data.amount)) {
			throw new Error('Transaction amount not defined')
		}
		if (empty(data.phone)) {
			throw new Error('Phone number not defined');
		}

        console.log({ 
			service_key      : MONETBIL_SERVICE_KEY,
			service_secret   : MONETBIL_SERVICE_SECRET,
			// processing_number: scl_generateKeys(15, 3),
			phonenumber      : `237${String(data.phone).replace(/^237/, '')}`,
			amount           : data.amount 
        });
        

        const { data: response } = await axios.post(this.endpoint_widrawal, { 
			service_key      : MONETBIL_SERVICE_KEY,
			service_secret   : MONETBIL_SERVICE_SECRET,
			// processing_number: scl_generateKeys(15, 3),
			phonenumber      : `237${String(data.phone).replace(/^237/, '')}`,
			amount           : data.amount 
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
	
        return response
    }

    /**
     * Get details of the transaction
     * 
     * @param {{[key: string]: string}} transaction
     * 
	 * @return {{phone: string, amount: int, fee: int, status: int, message: string, date: string, transaction_id: string, operator_transaction_id: string, operator: string, [key: string]: string}}
	 */
	getTransactionDetails(transaction) {
        return {
            phone                  : transaction.msisdn || '',
            country                : transaction.country_name || '',
            country_code           : transaction.country_code || '',
            amount                 : transaction.amount || 0,
            fee                    : transaction.fee || 0,
            status                 : transaction.status || 0,
            message                : transaction.message || '',
            date                   : transaction.created_date || date('Y-m-d H:i:s'),
            transaction_id         : transaction.transaction_UUID || '',
            operator               : transaction.mobile_operator_code || '',
            operator_transaction_id: transaction.operator_transaction_id || '',
            user_agent             : transaction.http_user_agent || '',
            ip_address             : transaction.ip_address || '',
        }
	}

    /**
	 * Get temp info of payment
     * 
     * @param {String} ref 
     * 
     * @returns {{amount: int, fee: int, userId: int, date: string, ref: string}?}
	 */
    getPaymentRef(ref) {
        const path = this._filename(ref)

		if (!fs.existsSync(path)) {
            return null
        }

		const data = fs.readFileSync(path).toString()

        if (!data) {
            return null
        }

        return JSON.parse(data)	
	}

    /**
	 * Delete payment temp file and return his content
     * 
     * @param {String} ref 
     * 
     * @returns {{amount: int, fee: int, userId: int, date: string, ref: string}?}
	 */
    removeRef(ref) {
        const path = this._filename(ref)

		if (!fs.existsSync(path)) {
            return null
        }

        const data = this.getPaymentRef(ref)

        fs.unlinkSync(path)

		return data
	}

    /**
     * Generates a unique payment reference associated with the user that make transaction
     * 
     * @param {{amount: int, fee: int, userId: int}}  data
     * 
     * @returns { String }
     */
    _generateRef(data) {
        const ref = uniqid('etravel-', true).replace('.', '-')
        data = { ...data, ref, date:date('Y-m-d H:i:s') }

        fs.writeFileSync(this._filename(ref), JSON.stringify(data))

		return ref;
    }

    /**
     * Get the absolute path of the temp file associated on a transaction
     * 
     * @param {String} ref
     * 
     * @returns {String} 
     */
    _filename(ref) {
        return `${this.basepath}/${ref}.json`
    }
}
