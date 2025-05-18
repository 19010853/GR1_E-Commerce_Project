const stripeModel = require('../../models/stripeModel')
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')('sk_test_51RP0SYR4aa1jsPsoSSMgGB0Ndsb9jzLgkPWmIqrVC3IR6lYHuArr1hPMBJVA0TAhNCkVefnRxUv9rvSf1smJIKno00cLR4CzB0')
const { responseReturn } = require('../../utiles/response')
const sellerModel = require('../../models/sellerModel')

class paymentController {

    create_stripe_connect_account = async (req, res) => {
        const { id } = req
        const uid = uuidv4()

        try {
            const stripeInfo = await stripeModel.findOne({ sellerId: id })

            if (stripeInfo) {
                await stripeModel.deleteOne({ sellerId: id })
                const account = await stripe.accounts.create({ type: 'express' })

                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: 'http://localhost:3000/refresh',
                    return_url: `http://localhost:3000/success?activeCode=${uid}`,
                    type: 'account_onboarding'
                })
                await stripeModel.create({
                    sellerId: id,
                    stripeId: account.id,
                    code: uid
                })
                responseReturn(res, 201, { url: accountLink.url })

            } else {
                const account = await stripe.accounts.create({ type: 'express' })

                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: 'http://localhost:3000/refresh',
                    return_url: `http://localhost:3000/success?activeCode=${uid}`,
                    type: 'account_onboarding'
                })
                await stripeModel.create({
                    sellerId: id,
                    stripeId: account.id,
                    code: uid
                })
                responseReturn(res, 201, { url: accountLink.url })

            }

        } catch (error) {
            console.log('stripe connect account errror' + error.message)
        }
    }
    // End Method 

    active_stripe_connect_account = async (req, res) => {
        const { activeCode } = req.params
        const { id } = req

        try {
            const userStripeInfo = await stripeModel.findOne({ code: activeCode })

            if (userStripeInfo) {
                await sellerModel.findByIdAndUpdate(id, {
                    payment: 'active'
                })
                responseReturn(res, 200, { message: 'payment Active' })
            } else {
                responseReturn(res, 404, { message: 'payment Active Fails' })
            }

        } catch (error) {
            responseReturn(res, 500, { message: 'Internal Server Error' })
        }

    }
    // End Method

}


module.exports = new paymentController()