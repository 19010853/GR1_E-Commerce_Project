import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { IoMdImages } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { get_category } from "../../store/Reducers/categoryReducer";
import {
  get_product,
  update_product,
  messageClear,
  product_image_update,
  remove_product_image,
} from "../../store/Reducers/productReducer";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import toast from "react-hot-toast";
import axios from "axios";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { categorys } = useSelector((state) => state.category);
  const { product, loader, successMessage, errorMessage } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(
      get_category({
        searchValue: "",
        parPage: "",
        page: "",
      })
    );
  }, []);

  useEffect(() => {
    dispatch(get_product(productId));
  }, [productId]);

  const [state, setState] = useState({
    name: "",
    description: "",
    discount: "",
    price: "",
    brand: "",
    stock: "",
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const [cateShow, setCateShow] = useState(false);
  const [category, setCategory] = useState("");
  const [allCategory, setAllCategory] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const categorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      let srcValue = allCategory.filter(
        (c) => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      setAllCategory(srcValue);
    } else {
      setAllCategory(categorys);
    }
  };

  const [imageShow, setImageShow] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const changeImage = (img, files) => {
    if (files.length > 0) {
      dispatch(
        product_image_update({
          oldImage: img,
          newImage: files[0],
          productId,
        })
      );
    }
  };

  useEffect(() => {
    setState({
      name: product.name,
      description: product.description,
      discount: product.discount,
      price: product.price,
      brand: product.brand,
      stock: product.stock,
    });
    setCategory(product.category);
    setImageShow(product.images);
  }, [product]);

  useEffect(() => {
    if (categorys.length > 0) {
      setAllCategory(categorys);
    }
  }, [categorys]);

  const [justSubmitted, setJustSubmitted] = useState(false);

  useEffect(() => {
    dispatch(messageClear());
    setJustSubmitted(false);
  }, [dispatch]);

  useEffect(() => {
    if (successMessage && /success|thành công/i.test(successMessage) && justSubmitted) {
      toast.success("Cập nhật sản phẩm thành công!");
      dispatch(messageClear());
      setJustSubmitted(false);
      setTimeout(() => {
        navigate("/seller/dashboard/products");
      }, 1000);
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
      setJustSubmitted(false);
    }
  }, [successMessage, errorMessage, justSubmitted, dispatch, navigate]);

  const update = async (e) => {
    e.preventDefault();
    const obj = {
      name: state.name,
      description: state.description,
      discount: state.discount,
      price: state.price,
      brand: state.brand,
      stock: state.stock,
      category: category,
      productId: productId,
    };
    await dispatch(update_product(obj));
    if (newImages.length > 0) {
      for (let i = 0; i < newImages.length; i++) {
        const formData = new FormData();
        formData.append("productId", productId);
        formData.append("newImage", newImages[i]);
        try {
          await axios.post("/api/product-add-image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          });
        } catch (err) {
          toast.error("Lỗi khi upload ảnh mới!");
        }
      }
      setNewImages([]);
    }
    dispatch(get_product(productId));
    setJustSubmitted(true);
  };

  const imageHandle = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setNewImages([...newImages, ...files]);
    }
  };

  const removeExistingImage = (imgUrl) => {
    dispatch(remove_product_image({ productId, imageUrl: imgUrl }))
      .unwrap()
      .then(() => {
        dispatch(get_product(productId));
        toast.success("Đã xoá ảnh thành công!");
      })
      .catch((err) => {
        toast.error(err?.error || "Lỗi khi xoá ảnh!");
      });
  };

  const removeNewImage = (i) => {
    const filterImage = newImages.filter((img, index) => index !== i);
    setNewImages(filterImage);
    setImageShow(imageShow.slice(0, imageShow.length - 1));
  };

  const changeExistingImage = (imgUrl, file) => {
    setImageShow(imageShow.map((img) => (img === imgUrl ? URL.createObjectURL(file) : img)));
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#6a5fdf] rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-[#d0d2d6] text-xl font-semibold">Chỉnh sửa sản phẩm</h1>
          <Link
            to="/seller/dashboard/products"
            className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2"
          >
            Tất cả sản phẩm
          </Link>
        </div>
        <div>
          <form onSubmit={update}>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="name">Tên sản phẩm</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={state.name}
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Tên sản phẩm"
                />
              </div>

              <div className="flex flex-col w-full gap-1">
                <label htmlFor="brand">Thương hiệu sản phẩm</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={state.brand}
                  type="text"
                  name="brand"
                  id="brand"
                  placeholder="Tên thương hiệu"
                />
              </div>
            </div>

            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1 relative">
                <label htmlFor="category">Danh mục</label>
                <input
                  readOnly
                  onClick={() => setCateShow(!cateShow)}
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={category}
                  type="text"
                  id="category"
                  placeholder="--chọn danh mục--"
                />

                <div
                  className={`absolute top-[101%] bg-[#475569] w-full transition-all ${
                    cateShow ? "scale-100" : "scale-0"
                  } `}
                >
                  <div className="w-full px-4 py-2 fixed">
                    <input
                      value={searchValue}
                      onChange={categorySearch}
                      className="px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] overflow-hidden"
                      type="text"
                      placeholder="tìm kiếm"
                    />
                  </div>
                  <div className="pt-14"></div>
                  <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scrool">
                    {allCategory.length > 0 &&
                      allCategory.map((c, i) => (
                        <span
                          className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${
                            category === c.name && "bg-indigo-500"
                          }`}
                          onClick={() => {
                            setCateShow(false);
                            setCategory(c.name);
                            setSearchValue("");
                            setAllCategory(categorys);
                          }}
                        >
                          {c.name}{" "}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full gap-1">
                <label htmlFor="stock">Số lượng sản phẩm</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={state.stock}
                  type="number"
                  name="stock"
                  id="stock"
                  placeholder="Số lượng"
                />
              </div>
            </div>

            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="price">Giá</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={state.price}
                  type="number"
                  name="price"
                  id="price"
                  placeholder="giá"
                />
              </div>

              <div className="flex flex-col w-full gap-1">
                <label htmlFor="discount">Discount</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={state.discount}
                  type="number"
                  name="discount"
                  id="discount"
                  placeholder="discount by %"
                />
              </div>
            </div>

            <div className="flex flex-col w-full gap-1 mb-5">
              <label htmlFor="description" className="text-[#d0d2d6]">
                Mô tả
              </label>
              <textarea
                className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]"
                onChange={inputHandle}
                value={state.description}
                name="description"
                id="description"
                placeholder="Description"
                cols="10"
                rows="4"
              ></textarea>
            </div>

            <div className="grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 gap-3 w-full text-[#d0d2d6] mb-4">
              {imageShow && imageShow.length > 0 && imageShow.map((img, i) => (
                <div className="h-[180px] relative" key={i}>
                  <label htmlFor={`edit-img-${i}`}>
                    <img className="w-full h-full rounded-sm" src={img} alt="" />
                  </label>
                  <input
                    onChange={(e) => changeExistingImage(img, e.target.files[0])}
                    type="file"
                    id={`edit-img-${i}`}
                    className="hidden"
                  />
                  <span
                    onClick={() => removeExistingImage(img)}
                    className="p-2 z-10 cursor-pointer bg-slate-700 hover:shadow-lg hover:shadow-slate-400/50 text-white absolute top-1 right-1 rounded-full"
                  >
                    <IoMdCloseCircle />
                  </span>
                </div>
              ))}
              {newImages && newImages.length > 0 && Array.from(newImages).map((file, i) => (
                <div className="h-[180px] relative" key={`new-${i}`}> 
                  <label htmlFor={`new-img-${i}`}>
                    <img className="w-full h-full rounded-sm" src={URL.createObjectURL(file)} alt="" />
                  </label>
                  <input
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files.length > 0) {
                        const updated = Array.from(newImages);
                        updated[i] = files[0];
                        setNewImages(updated);
                      }
                    }}
                    type="file"
                    id={`new-img-${i}`}
                    className="hidden"
                  />
                  <span
                    onClick={() => removeNewImage(i)}
                    className="p-2 z-10 cursor-pointer bg-slate-700 hover:shadow-lg hover:shadow-slate-400/50 text-white absolute top-1 right-1 rounded-full"
                  >
                    <IoMdCloseCircle />
                  </span>
                </div>
              ))}
              <label
                className="flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-red-500 w-full text-[#d0d2d6]"
                htmlFor="edit-image"
              >
                <span>
                  <IoMdImages />
                </span>
                <span>Chọn hình ảnh</span>
              </label>
              <input
                className="hidden"
                onChange={imageHandle}
                multiple
                type="file"
                id="edit-image"
              />
            </div>

            <div className="flex">
              <button
                disabled={loader ? true : false}
                className="bg-red-500 w-[280px] hover:shadow-red-300/50 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
              >
                {loader ? (
                  <PropagateLoader color="#fff" cssOverride={overrideStyle} />
                ) : (
                  "Lưu thay đổi"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
