const customerModel = require('../../models/customerModel')
const { responseReturn } = require('../../utiles/response')
const bcrypt = require('bcrypt')
const sellerCustomerModel = require('../../models/chat/sellerCustomerModel')
const { createToken } = require('../../utiles/tokenCreate')

// CRUD For Customer Auth Method
class customerAuthController {

    // Customer register method
    customer_register = async (req, res) => {
        const { name, email, password } = req.body

        try {
            const customer = await customerModel.findOne({ email })
            if (customer) {
                responseReturn(res, 404, { error: 'Email Already Exits' })
            } else {
                const createCustomer = await customerModel.create({
                    name: name.trim(),
                    email: email.trim(),
                    password: await bcrypt.hash(password, 10),
                    method: 'menualy'
                })
                await sellerCustomerModel.create({
                    myId: createCustomer.id
                })
                const token = await createToken({
                    id: createCustomer.id,
                    name: createCustomer.name,
                    email: createCustomer.email,
                    method: createCustomer.method
                })
                res.cookie('customerToken', token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                })
                responseReturn(res, 201, { message: "User Register Success", token })
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    // End customer register method

    // Customer login method
    customer_login = async (req, res) => {
        console.log(req.body)
        const { email, password } = req.body
        try {
            const customer = await customerModel.findOne({ email }).select('+password')
            if (customer) {
                const match = await bcrypt.compare(password, customer.password)
                if (match) {
                    const token = await createToken({
                        id: customer.id,
                        name: customer.name,
                        email: customer.email,
                        method: customer.method
                    })
                    res.cookie('customerToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })
                    responseReturn(res, 201, { message: 'Đăng nhập thành công', token })
                } else {
                    responseReturn(res, 404, { error: 'Mật khẩu không đúng' })
                }
            } else {
                responseReturn(res, 404, { error: 'Không tìm thấy email' })
            }
        } catch (error) {
            responseReturn(res, 500, { error: 'Lỗi server' })
        }
    }
    // End customer login method

    // Customer logout method
    customer_logout = async (req, res) => {
        res.cookie('customerToken', '', {
            expires: new Date(Date.now() - 1000)
        })
        responseReturn(res, 200, { message: 'Đăng xuất thành công' })
    }
    // End customer logout method

    // Customer change password method
    customer_change_password = async (req, res) => {
        const { old_password, new_password } = req.body;
        const { id } = req;

        try {
            const customer = await customerModel.findById(id).select('+password');
            if (!customer) {
                return responseReturn(res, 404, { error: 'Không tìm thấy người dùng' });
            }

            const isMatch = await bcrypt.compare(old_password, customer.password);
            if (!isMatch) {
                return responseReturn(res, 400, { error: 'Mật khẩu cũ không đúng' });
            }

            customer.password = await bcrypt.hash(new_password, 10);
            await customer.save();

            responseReturn(res, 200, { message: 'Đổi mật khẩu thành công' });
        } catch (error) {
            console.error('Lỗi đổi mật khẩu:', error);
            responseReturn(res, 500, { error: 'Lỗi server' });
        }
    }
    // End customer change password method
}

module.exports = new customerAuthController()