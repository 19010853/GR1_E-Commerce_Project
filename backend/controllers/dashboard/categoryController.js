const formidable = require("formidable");
const { responseReturn } = require("../../utiles/response");
const cloudinary = require("cloudinary").v2;
const categoryModel = require("../../models/categoryModel");

// CRUD For Category Method
class categoryController {

  // Add category method    
  add_category = async (req, res) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        responseReturn(res, 404, { error: "Lỗi server" });
      } else {
        let { name } = fields;
        let { image } = files;
        name = name.trim();
        const slug = name.split(" ").join("-");

        cloudinary.config({
          cloud_name: process.env.cloud_name,
          api_key: process.env.api_key,
          api_secret: process.env.api_secret,
          secure: true,
        });

        try {
          const result = await cloudinary.uploader.upload(image.filepath, {
            folder: "categorys",
          });

          if (result) {
            const category = await categoryModel.create({
              name,
              slug,
              image: result.url,
            });
            responseReturn(res, 201, {
              category,
              message: "Đã thêm danh mục thành công",
            });
          } else {
            responseReturn(res, 404, { error: "Lỗi tải lên hình ảnh" });
          }
        } catch (error) {
          responseReturn(res, 500, { error: "Lỗi server" });
        }
      }
    });
  };
  // End category add method

  // Get category method
  get_category = async (req, res) => {
    const { page, searchValue, parPage } = req.query;

    try {
      let skipPage = "";
      if (parPage && page) {
        skipPage = (parseInt(page) - 1) * parseInt(parPage);
      }

      if (searchValue && page && parPage) {
        const categorys = await categoryModel
          .find({
            $text: {
              $search: searchValue,
            },
          })
          .skip(skipPage)
          .limit(parseInt(parPage))
          .sort({ createdAt: -1 });
        const totalCategory = await categoryModel
          .find({
            $text: {
              $search: searchValue,
            },
          })
          .countDocuments();
        responseReturn(res, 200, { categorys, totalCategory });
      } else if (searchValue === "" && page && parPage) {
        const categorys = await categoryModel
          .find({})
          .skip(skipPage)
          .limit(parseInt(parPage))
          .sort({ createdAt: -1 });
        const totalCategory = await categoryModel.find({}).countDocuments();
        responseReturn(res, 200, { categorys, totalCategory });
      } else {
        const categorys = await categoryModel
          .find({})
          .sort({ createdAt: -1 });
        const totalCategory = await categoryModel.find({}).countDocuments();
        responseReturn(res, 200, { categorys, totalCategory });
      }
    } catch (error) {
      console.log(error.message);
      responseReturn(res, 500, { error: "Lỗi server" });
    }
  };
  //end get category method

  // Update category method
  update_category = async (req, res) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        responseReturn(res, 404, { error: "Lỗi server" });
      } else {
        let { name } = fields;
        let { image } = files;
        const { id } = req.params;

        name = name.trim();
        const slug = name.split(" ").join("-");

        try {
          let result = null;
          if (image) {
            cloudinary.config({
              cloud_name: process.env.cloud_name,
              api_key: process.env.api_key,
              api_secret: process.env.api_secret,
              secure: true,
            });

            result = await cloudinary.uploader.upload(image.filepath, {
              folder: "categorys",
            });
          }

          const updateData = {
            name,
            slug,
          };

          if (result) {
            updateData.image = result.url;
          }

          const category = await categoryModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
          );
          responseReturn(res, 200, {
            category,
            message: "Đã cập nhật danh mục thành công",
          });
        } catch (error) {
          responseReturn(res, 500, { error: "Lỗi server" });
        }
      }
    });
  };
  // end update category method

  // Delete category method
  delete_category = async (req, res) => {
    try {
      const categoryId = req.params.id;
      const deleteCategory = await categoryModel.findByIdAndDelete(categoryId);

      if (!deleteCategory) {
        return responseReturn(res, 404, {
          error: `Không tìm thấy danh mục với id ${categoryId}`,
        });
      }

      responseReturn(res, 200, { message: "Đã xóa danh mục thành công" });
    } catch (error) {
      responseReturn(res, 500, { error: "Lỗi server" });
    }
  };
  // end delete category method
}

module.exports = new categoryController();
