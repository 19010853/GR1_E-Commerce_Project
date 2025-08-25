const adminModel = require('../models/adminModel')
const sellerModel = require('../models/sellerModel')
const sellerCustomerModel = require('../models/chat/sellerCustomerModel')
const { responseReturn } = require('../utiles/response')
const bcrpty = require('bcrypt')
const { createToken } = require('../utiles/tokenCreate')
const cloudinary = require('cloudinary').v2
const formidable = require("formidable")

class authControllers {

    //              
    admin_login = async (req, res) => {
        const { email, password } = req.body
        try {
            const admin = await adminModel.findOne({ email }).select('+password')
            // console.log(admin)
            if (admin) {
                const match = await bcrpty.compare(password, admin.password)
                // console.log(match)
                if (match) {
                    const token = await createToken({
                        id: admin.id,
                        role: admin.role
                    })
                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })
                    responseReturn(res, 200, { token, message: "Đăng nhập thành công" })
                } else {
                    responseReturn(res, 404, { error: "Mật khẩu không đúng" })
                }
            } else {
                responseReturn(res, 404, { error: "Không tìm thấy email" })
            }

        } catch (error) {
            responseReturn(res, 500, { error: "Lỗi server" })
        }
    }
    // End admin login method

    seller_login = async (req, res) => {
        const { email, password } = req.body
        try {
            const seller = await sellerModel.findOne({ email }).select('+password')
            // console.log(admin)
            if (seller) {
                const match = await bcrpty.compare(password, seller.password)
                // console.log(match)
                if (match) {
                    const token = await createToken({
                        id: seller.id,
                        role: seller.role
                    })
                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })
                    responseReturn(res, 200, { token, message: "Đăng nhập thành công" })
                } else {
                    responseReturn(res, 404, { error: "Mật khẩu không đúng" })
                }


            } else {
                responseReturn(res, 404, { error: "Không tìm thấy email" })
            }

        } catch (error) {
            responseReturn(res, 500, { error: "Lỗi server" })
        }

    }
    // End seller login method

    seller_register = async (req, res) => {
        const { email, name, password } = req.body
        try {
            const getUser = await sellerModel.findOne({ email })
            if (getUser) {
                responseReturn(res, 404, { error: 'Email đã tồn tại' })
            } else {
                const seller = await sellerModel.create({
                    name,
                    email,
                    password: await bcrpty.hash(password, 10),
                    method: 'menualy',
                    shopInfo: {}
                })
                await sellerCustomerModel.create({
                    myId: seller.id
                })

                const token = await createToken({ id: seller.id, role: seller.role })
                res.cookie('accessToken', token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                })

                responseReturn(res, 201, { token, message: 'Đăng ký thành công' })
            }
        } catch (error) {
            responseReturn(res, 500, { error: 'Lỗi máy chủ' })
        }
    }
    // End seller register method

    getUser = async (req, res) => {
        const { id, role } = req;

        try {
            if (role === 'admin') {
                const user = await adminModel.findById(id)
                responseReturn(res, 200, { userInfo: user })
            } else {
                const seller = await sellerModel.findById(id)
                responseReturn(res, 200, { userInfo: seller })
            }

        } catch (error) {
            responseReturn(res, 500, { error: 'Lỗi máy chủ' })
        }
    }
    // End getUser method

    profile_image_upload = async (req, res) => {
        const { id } = req
        const form = formidable({ multiples: true })
        form.parse(req, async (err, _, files) => {
            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            })
            const { image } = files

            try {
                const result = await cloudinary.uploader.upload(image.filepath, { folder: 'profile' })
                if (result) {
                    await sellerModel.findByIdAndUpdate(id, {
                        image: result.url
                    })
                    const userInfo = await sellerModel.findById(id)
                    responseReturn(res, 201, { message: 'Tải ảnh thành công', userInfo })
                } else {
                    responseReturn(res, 404, { error: 'Tải ảnh thất bại' })
                }

            } catch (error) {
                responseReturn(res, 500, { error: error.message })
            }


        })
    }

    // End profile_image_upload method

    profile_info_add = async (req, res) => {
        const { division, district, shopName, sub_district } = req.body;
        const { id } = req;

        try {
            await sellerModel.findByIdAndUpdate(id, {
                shopInfo: {
                    shopName,
                    division,
                    district,
                    sub_district
                }
            })
            const userInfo = await sellerModel.findById(id)
            responseReturn(res, 201, { message: 'Thêm thông tin thành công', userInfo })

        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }


    }
    // End profile_info_add method

    logout = async (req, res) => {
        try {
            res.cookie('accessToken', null, {
                expires: new Date(Date.now()),
                httpOnly: true
            })
            responseReturn(res, 200, { message: 'Đăng xuất thành công' })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }
    // End logout method

    /// Change Password 
    change_password = async (req, res) => {
        const { email, old_password, new_password } = req.body;
        // console.log(email,old_password,new_password)
        try {
            const user = await sellerModel.findOne({ email }).select('+password');
            if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

            const isMatch = await bcrpty.compare(old_password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });

            user.password = await bcrpty.hash(new_password, 10);
            await user.save();
            responseReturn(res, 200, { message: 'Đổi mật khẩu thành công' });

        } catch (error) {
            responseReturn(res, 500, { message: 'Lỗi máy chủ' });
        }
    }
    // End change_password method
}

module.exports = new authControllers()