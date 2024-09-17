const { empty } = require('php-in-js/modules/types')
const  Transaction = require('../Models/transaction')
const User = require('../Models/user')
const monetbil = require('../services/monetbil')
/**
 * Check payement, create transaction in database and increment user balance
 * 
 * @internal
 */
const _processTransaction = async (ref, transaction_id, res) => {
    if (empty(transaction_id) || empty(ref)) {
        return 'GONE'
    }

    // Prevent to recharge a account 2 times
    if (await Transaction.count({ where: { ref } })) {
        return 'FOUND'
    }

    const payment = monetbil.getPaymentRef(ref)    

    if (empty(payment)) {
        return 'GONE'
    }

    if (empty(payment.userId)) {
        return 'FORBIDDEN'
    }

    const user = await User.findByPk(payment.userId)
    if (!user) {
        return 'UNAUTHORIZED'
    }

    // Get payment informations
    const { status, transaction } = await monetbil.check(transaction_id)
    const details                 = monetbil.getTransactionDetails(transaction)
    const amount                  = payment.amount || details.amount
    
    // Save transaction
    await Transaction.create({
        userId                : user.id,
        phone                 : details.phone,
        ref                   : ref,
        amount                : amount,
        fee                   : details.fee,
        type                  : 'credit',
        status                : status || details.status,
        message               : details.message,
        operator              : details.operator,
        reference             : details.transaction_id,
        operator_trasaction_id: details.operator_transaction_id,
        transaction_date      : details.date,
        user_agent            : details.user_agent,
        ip_address            : details.ip_address,
    })


    if (status == 1) {
        // if transaction if successful, increment balance of user
        await user.increment({ balance: amount - payment.fee })
    
        
    }
    
    monetbil.removeRef(ref)
    
    return 'OK'
}
module.exports = _processTransaction