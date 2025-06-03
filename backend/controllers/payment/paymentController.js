const stripeModel = require('../../models/stripeModel')
const withdrawRequest = require('../../models/withdrawRequest');
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')('sk_test_51RP0SYR4aa1jsPsoSSMgGB0Ndsb9jzLgkPWmIqrVC3IR6lYHuArr1hPMBJVA0TAhNCkVefnRxUv9rvSf1smJIKno00cLR4CzB0')
const { responseReturn } = require('../../utiles/response')
const sellerModel = require('../../models/sellerModel')
const sellerWallet = require('../../models/sellerWallet')
const { mongo: { ObjectId } } = require('mongoose')

class paymentController {

    sumAmount = (data) => {
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum = sum + data[i].amount;
        }
        return sum;
    }
    // Sum of all products' price

    // Create stripe connect account method
    create_stripe_connect_account = async (req, res) => {
        const { id } = req
        const uid = uuidv4()

        try {
            const stripeInfo = await stripeModel.findOne({ sellerId: id })

            if (stripeInfo) {
                // Check if the account exists and is properly set up
                try {
                    const account = await stripe.accounts.retrieve(stripeInfo.stripeId)
                    if (account.charges_enabled) {
                        return responseReturn(res, 200, { message: 'Stripe account is already set up' })
                    }
                    // If account exists but not fully set up, create a new onboarding link
                    const accountLink = await stripe.accountLinks.create({
                        account: stripeInfo.stripeId,
                        refresh_url: 'http://localhost:3001/refresh',
                        return_url: `http://localhost:3001/success?activeCode=${uid}`,
                        type: 'account_onboarding'
                    })
                    return responseReturn(res, 201, { url: accountLink.url })
                } catch (error) {
                    // If account doesn't exist, delete the record and create a new one
                    await stripeModel.deleteOne({ sellerId: id })
                }
            }

            // Create new account
            const account = await stripe.accounts.create({
                type: 'express',
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true }
                },
                business_type: 'individual'
            })

            // Create account link
            const accountLink = await stripe.accountLinks.create({
                account: account.id,
                refresh_url: 'http://localhost:3001/refresh',
                return_url: `http://localhost:3001/success?activeCode=${uid}`,
                type: 'account_onboarding'
            })

            // Create stripe model
            await stripeModel.create({
                sellerId: id,
                stripeId: account.id,
                code: uid
            })

            responseReturn(res, 201, { url: accountLink.url })

        } catch (error) {
            console.error('Stripe connect account error:', error)
            responseReturn(res, 500, {
                message: 'Failed to create Stripe Connect account',
                error: error.message
            })
        }
    }
    // End create_stripe_connect_account method

    // Check stripe account status method
    check_stripe_account_status = async (req, res) => {
        const { id } = req
        try {
            const stripeInfo = await stripeModel.findOne({ sellerId: id })
            if (!stripeInfo) {
                return responseReturn(res, 404, { message: 'No Stripe account found' })
            }

            const account = await stripe.accounts.retrieve(stripeInfo.stripeId)
            const status = {
                charges_enabled: account.charges_enabled,
                payouts_enabled: account.payouts_enabled,
                details_submitted: account.details_submitted,
                requirements: account.requirements
            }

            responseReturn(res, 200, { status })
        } catch (error) {
            console.error('Stripe account status check error:', error)
            responseReturn(res, 500, {
                message: 'Failed to check Stripe account status',
                error: error.message
            })
        }
    }
    // End check_stripe_account_status method

    // Active stripe connect account method
    active_stripe_connect_account = async (req, res) => {
        const { activeCode } = req.params
        const { id } = req

        try {
            const userStripeInfo = await stripeModel.findOne({ code: activeCode })
            if (!userStripeInfo) {
                return responseReturn(res, 404, { message: 'Invalid activation code' })
            }

            const account = await stripe.accounts.retrieve(userStripeInfo.stripeId)
            if (!account.charges_enabled) {
                return responseReturn(res, 400, {
                    message: 'Account setup incomplete. Please complete all required steps.',
                    requirements: account.requirements
                })
            }

            await sellerModel.findByIdAndUpdate(id, {
                payment: 'active'
            })
            responseReturn(res, 200, { message: 'Payment account activated successfully' })

        } catch (error) {
            console.error('Stripe account activation error:', error)
            responseReturn(res, 500, {
                message: 'Failed to activate Stripe account',
                error: error.message
            })
        }
    }
    // End active_stripe_connect_account method

    // Get seller payment details method
    get_seller_payment_details = async (req, res) => {
        const { sellerId } = req.params

        try {
            const payments = await sellerWallet.find({ sellerId })
            const pendingWithdraws = await withdrawRequest.find({
                $and: [
                    {
                        sellerId: {
                            $eq: sellerId
                        }
                    },
                    {
                        status: {
                            $eq: 'pending'
                        }
                    }
                ]
            })

            const successWithdraws = await withdrawRequest.find({
                $and: [
                    {
                        sellerId: {
                            $eq: sellerId
                        }
                    },
                    {
                        status: {
                            $eq: 'success'
                        }
                    }
                ]
            })

            const pendingAmount = this.sumAmount(pendingWithdraws)
            const withdrawAmount = this.sumAmount(successWithdraws)
            const totalAmount = this.sumAmount(payments)

            let availableAmount = 0

            if (totalAmount > 0) {
                availableAmount = totalAmount - (pendingAmount + withdrawAmount)
            }

            responseReturn(res, 200, {
                totalAmount,
                withdrawAmount,
                pendingAmount,
                availableAmount,
                pendingWithdraws,
                successWithdraws
            })
        } catch (error) {
            console.log(error.message)
        }
    }
    // End get_seller_payment_details method

    // Withdrawal request method
    withdrawal_request = async (req, res) => {
        const { amount, sellerId } = req.body

        try {
            const withdrawal = await withdrawRequest.create({
                sellerId,
                amount: parseInt(amount),
            })
            responseReturn(res, 200, {
                message: 'withdrawal request success',
                withdrawal
            })
        } catch (error) {
            responseReturn(res, 500, { message: 'Internal Server Error' })
        }
    }
    // End withdrawal_request method

    // Get payment request method
    get_payment_request = async (req, res) => {
        try {
            const withdrawalRequest = await withdrawRequest.find({
                status: 'pending'
            })
            responseReturn(res, 200, { withdrawalRequest })
        } catch (error) {
            responseReturn(res, 500, { message: 'Internal Server Error' })
        }
    }
    // End get_payment_request method

    // Payment request confirm method
    payment_request_confirm = async (req, res) => {
        const { paymentId } = req.body
        try {
            const payment = await withdrawRequest.findById(paymentId)
            if (!payment) {
                return responseReturn(res, 404, { message: 'Payment request not found' })
            }

            const stripeAccount = await stripeModel.findOne({
                sellerId: payment.sellerId
            })

            if (!stripeAccount) {
                return responseReturn(res, 404, { message: 'Stripe account not found for seller' })
            }

            // Verify the Stripe account exists and is properly set up
            try {
                const account = await stripe.accounts.retrieve(stripeAccount.stripeId)

                // Check if account is fully activated
                if (!account.charges_enabled || !account.payouts_enabled) {
                    // Create a new account link for the seller to complete their setup
                    const accountLink = await stripe.accountLinks.create({
                        account: stripeAccount.stripeId,
                        refresh_url: 'http://localhost:3001/refresh',
                        return_url: 'http://localhost:3001/success',
                        type: 'account_onboarding'
                    })

                    return responseReturn(res, 400, {
                        message: 'Seller needs to complete their Stripe account setup',
                        accountLink: accountLink.url,
                        requirements: account.requirements
                    })
                }

                // Create the transfer
                try {
                    await stripe.transfers.create({
                        amount: payment.amount * 100,
                        currency: 'usd',
                        destination: stripeAccount.stripeId,
                    })

                    await withdrawRequest.findByIdAndUpdate(paymentId, {
                        status: 'success'
                    })
                    responseReturn(res, 200, { message: 'payment request successfully confirmed', payment })
                } catch (transferError) {
                    console.error('Stripe transfer error:', transferError)
                    return responseReturn(res, 400, {
                        message: 'Failed to process transfer. Please ensure the seller has completed their Stripe account setup and can accept transfers.',
                        error: transferError.message
                    })
                }
            } catch (stripeError) {
                console.error('Stripe account verification error:', stripeError)
                return responseReturn(res, 400, {
                    message: 'Invalid Stripe account. Please ensure the seller has completed their Stripe account setup.',
                    error: stripeError.message
                })
            }
        } catch (error) {
            console.error('Payment confirmation error:', error)
            responseReturn(res, 500, { message: error.message || 'Internal Server Error' })
        }
    }
    // End payment_request_confirm method
}


module.exports = new paymentController()